'use server';
import postgres from 'postgres';
import {
  User,
  Team,
  Driver,
  PredictionGroup,
  PredictionGroupItem,
  PointsDefinition,
  PointsException,
  Event,
  EventResult,
  SeasonResult,
  UserPrediction,
  Leaderboard,
  SeasonPredictionsConfig,
  EventResultDetailed,
  EventPredictionsConfig,
  UserResultByEvent,
  UserPointsByEvent,
  CumulativePoints,
} from './definitions';

const sql = postgres(process.env.POSTGRES_URL!);

export async function fetchDrivers() {
  try {
    const data = await sql<
      Driver[]
    >`SELECT * FROM drivers ORDER BY team_id ASC`;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchTeams() {
  const data = await sql<Team[]>`SELECT * FROM teams ORDER BY id ASC`;
  return data;
}

export async function fetchLeaderboard() {
  const data = await sql<Leaderboard[]>`
  select
    u.id,
    u.name,
    max(u.profile_image) profile_image_url,
    SUM(coalesce(up.points, 0)) points,
    ROW_NUMBER() OVER (ORDER BY SUM(coalesce(up.points, 0)) DESC) position
  from
    users u
  left outer join user_predictions up on
    u.id = up.user_id
  group by
    u.id,
    u.name
  order by
    SUM(coalesce(up.points, 0)) desc
  limit 3
  `;
  return data;
}

// last events
export async function fetchLastEvents() {
  const events = await sql<Event[]>`select
    *
  from
    events
  where
    status = 'FINISHED'
  order by
    date desc
  limit 3`;

  const data = await Promise.all(
    events.map(async (event) => {
      const results = await sql<EventResultDetailed[]>`
        select
          er.id,
          er.event_id,
          pgi."name" pridiction_name,
          er.driver_id,
          d.full_name driver_name,
          d.name_acronym driver_acronym,
          d.headshot_url driver_headshot_url,
          t.name team_name,
          t.car_image team_image_url,
          coalesce(t.colour, t_d.colour) team_color,
          pg.name group_name
        from
          event_results er
        left join drivers d on
          er.driver_id = d.id
        left join teams t on
          er.team_id = t.id
        left join prediction_group_items pgi on
          er.prediction_group_item_id = pgi.id
        left join prediction_groups pg on pg.id = pgi.prediction_group_id
        left join teams t_d on t_d.id = d.team_id
        where
          event_id = ${event.id}
        order by
          pg.id, pgi.id
      `;

      // Group results by group_name
      const groupedResults = results.reduce((acc, result) => {
        if (!acc[result.group_name]) {
          acc[result.group_name] = [];
        }
        acc[result.group_name].push(result);
        return acc;
      }, {} as Record<string, EventResultDetailed[]>);

      return {
        ...event,
        results: groupedResults,
      };
    })
  );

  return data;
}

// season predictions configuration
export async function fetchSeasonPredictionsConfig() {
  const data = await sql<SeasonPredictionsConfig[]>`
  select
    pgi.id,
    pg."name" group_name,
    pg.prediction_deadline,
    pgi.name prediction_name,
    pgi.selection_type
  from
    prediction_groups pg
  inner join prediction_group_items pgi on
    pg.id = pgi.prediction_group_id
  where
    group_type = 'SEASON'
  `;
  return data;
}

//season user predictions
export async function fetchSeasonUserPredictions(userId: number) {
  const data = await sql<
    UserPrediction[]
  >`select * from user_predictions where user_id = ${userId} and event_id is null`;
  return data;
}

// last events
export async function fetchEventPredictionsConfig() {
  const events = await sql<Event[]>`select
    *
  from
    events
  where
    date > CURRENT_DATE
  order by
    date asc`;

  const predictions_config = await sql<EventPredictionsConfig[]>`
    select
      pgi.id,
      pg."name" group_name,
      pg.prediction_deadline,
      pgi.name prediction_name,
      pgi.selection_type
    from
      prediction_groups pg
    inner join prediction_group_items pgi on
      pg.id = pgi.prediction_group_id
    where
      group_type = 'RACE'
    ORDER BY pg.id, pgi.id
  `;

  const data = await Promise.all(
    events.map(async (event) => {
      return {
        ...event,
        predictions_config,
      };
    })
  );

  return data;
}

// next event
export async function fetchNextEventPredictionsConfig() {
  const events = await sql<Event[]>`select
    *
  from
    events
  where
    date > (CURRENT_DATE - interval '5 days')
    and status != 'FINISHED'
  order by
    date asc
  limit 1`;

  const predictions_config = await sql<EventPredictionsConfig[]>`
    select
      pgi.id,
      pg."name" group_name,
      pg.prediction_deadline,
      pgi.name prediction_name,
      pgi.selection_type
    from
      prediction_groups pg
    inner join prediction_group_items pgi on
      pg.id = pgi.prediction_group_id
    where
      group_type = 'RACE'
  `;

  const data = await Promise.all(
    events.map(async (event) => {
      return {
        ...event,
        predictions_config,
      };
    })
  );

  return data;
}

// event user predictions
export async function fetchEventUserPredictions(userId: number) {
  const data = await sql<
    UserPrediction[]
  >`select * from user_predictions where user_id = ${userId} and event_id is not null`;
  return data;
}

// season results
export async function fetchSeasonResults() {
  const data = await sql<SeasonResult[]>`select * from season_results`;
  return data;
}

// event results
export async function fetchEventResults() {
  const data = await sql<EventResult[]>`select * from event_results`;
  return data;
}

// fetch prediction group configurations with items and points
export async function fetchPredictionGroupConfigs() {
  const groups = await sql`
    select 
      id,
      name,
      group_type,
      prediction_deadline
    from prediction_groups
  `;

  const items = await sql`
    select
      *
    from prediction_group_items
  `;

  const points = await sql`
    select
      *
    from points_definitions
  `;

  const groupedData = groups.map((group) => {
    return {
      ...group,
      items: items.filter((item) => item.prediction_group_id === group.id),
      points: points.filter((point) => point.prediction_group_id === group.id),
    };
  });

  return groupedData;
}

export const fetchUserFullResults = async () => {
  const data = await sql<UserResultByEvent[]>`
    select
      up.event_id,
      e.name event_name,
      up.user_id,
      u.name user_name,
      u.profile_image user_avatar,
      up.prediction_group_item_id item_id,
      pgi."name" prediction_name,
      up.driver_id,
      d_p.name_acronym driver_acronym,
      d_p.headshot_url driver_avatar,
      d_p_t.colour driver_color,
      d_r.name_acronym result_driver_acronym,	
      d_r.headshot_url result_driver_avatar,
      d_r_t.colour result_driver_color,
      up.points
    from
      user_predictions up
    inner join users u on
      u.id = up.user_id
    inner join prediction_group_items pgi on
      pgi.id = up.prediction_group_item_id
    inner join prediction_groups pg on
      pg.id = pgi.prediction_group_id
    inner join events e on
      e.id = up.event_id
    left join drivers d_p on
      d_p.id = up.driver_id
    left join teams d_p_t on d_p_t.id = d_p.team_id
    left join event_results er on er.event_id = e.id and er.prediction_group_item_id = pgi.id 
    left join drivers d_r on d_r.id = er.driver_id 
    left join teams d_r_t on d_r_t.id = d_r.team_id
    where e.quali_start_at < NOW()
    order by e.date desc, pg.id, pgi.id, u.name
    limit 80
  `;
  return data;
};

export const fetchUserPointsByEvent = async () => {
  const data = await sql<UserPointsByEvent[]>`
    select
      e.id event_id,
      e.name event_name,
      e.track_image,
      u.id user_id,
      u.name user_name,
      u.profile_image user_avatar,
      SUM(up.points) points
    from
      events e
    inner join user_predictions up on
      up.event_id = e.id
    inner join users u on
      u.id = up.user_id
    where
      e.status = 'FINISHED'
    group by
      e.id,
      e.name,
      u.id,
      u.name
    order by
      e.id desc,
      u.name
    limit 15
  `;
  return data;
};

export const fetchEventDashboardData = async (eventId: number) => {
  const events = await sql<Event[]>`
    select
      *
    from events
    where id = ${eventId}
  `;

  const groups = await sql<PredictionGroup[]>`
    select
      *
    from prediction_groups
    where group_type = 'RACE'
    order by id
  `;

  const results = await sql`
    select er.id,
      pgi.id item_id,
      pgi."name" item_name,
      er.driver_id,
      d.name_acronym driver_acronym, 
      d.headshot_url driver_avatar,
      t.colour team_color,
      pgi.prediction_group_id group_id
    from event_results er 
    inner join prediction_group_items pgi ON er.prediction_group_item_id = pgi.id
    inner join drivers d on d.id = er.driver_id 
    inner join teams t on d.team_id = t.id
    where er.event_id = ${eventId}
  `;

  const predictions = await sql`
    select 
      up.id,
      up.user_id,
      u."name" user_name,
      u.profile_image user_avatar,
      pgi.id item_id,
      pgi."name" item_name,
      up.driver_id,
      d.name_acronym driver_acronym,
      d.headshot_url driver_avatar,
      t.colour team_color,
      pgi.prediction_group_id group_id,
      up.points
    from users u 
    inner join user_predictions up on up.user_id = u.id 
    inner join prediction_group_items pgi on pgi.id = up.prediction_group_item_id 
    inner join drivers d on d.id = up.driver_id 
    inner join teams t on d.team_id = t.id
    where up.event_id = ${eventId}
    order by u.id, pgi.prediction_group_id, pgi.id
  `;

  const event_user_points = await sql`
    select
      e.id event_id,
      e.name event_name,
      e.track_image,
      u.id user_id,
      u.name user_name,
      u.profile_image user_avatar,
      SUM(up.points) points
    from
      events e
    inner join user_predictions up on
      up.event_id = e.id
    inner join users u on
      u.id = up.user_id
    where
      e.status = 'FINISHED'
      and e.id = ${eventId}
    group by
      e.id,
      e.name,
      u.id,
      u.name
    order by
      points desc,
      u.name
  `;

  const data_with_groups = await Promise.all(
    events.map(async (event) => {
      const groups_with_results = groups.map((group) => {
        const gr_predictions = predictions.filter(
          (prediction) => prediction.group_id === group.id
        );

        const converted_predictions = gr_predictions.reduce(
          (acc, prediction) => {
            const existingUser = acc.find(
              (p: any) => p.user_id === prediction.user_id
            );

            if (existingUser) {
              // Add prediction as new properties
              existingUser[`${prediction.item_name}_name`] =
                prediction.item_name;
              existingUser[`${prediction.item_name}_driver_id`] =
                prediction.driver_id;
              existingUser[`${prediction.item_name}_driver_acronym`] =
                prediction.driver_acronym;
              existingUser[`${prediction.item_name}_driver_avatar`] =
                prediction.driver_avatar;
              existingUser[`${prediction.item_name}_team_color`] =
                prediction.team_color;
              existingUser[`${prediction.item_name}_group_id`] =
                prediction.group_id;
              existingUser[`${prediction.item_name}_points`] =
                prediction.points;
              existingUser.total_points =
                (existingUser.total_points || 0) + prediction.points;
              return acc;
            }

            // Create new user object with first prediction
            return [
              ...(acc as any[]),
              {
                id: prediction.id,
                user_id: prediction.user_id,
                user_name: prediction.user_name,
                user_avatar: prediction.user_avatar,
                [`${prediction.item_name}_name`]: prediction.item_name,
                [`${prediction.item_name}_driver_id`]: prediction.driver_id,
                [`${prediction.item_name}_driver_acronym`]:
                  prediction.driver_acronym,
                [`${prediction.item_name}_driver_avatar`]:
                  prediction.driver_avatar,
                [`${prediction.item_name}_team_color`]: prediction.team_color,
                [`${prediction.item_name}_group_id`]: prediction.group_id,
                [`${prediction.item_name}_points`]: prediction.points,
                total_points: prediction.points,
              },
            ];
          },
          []
        );

        // Get unique item_names from gr_predictions
        const prediction_names = [
          ...new Set(gr_predictions.map((p) => p.item_name)),
        ];

        return {
          ...group,
          results: results.filter((result) => result.group_id === group.id),
          predictions: converted_predictions,
          prediction_names: prediction_names,
        };
      });

      return {
        ...event,
        prediction_groups: groups_with_results,
        event_user_points: event_user_points,
      };
    })
  );
  console.log(data_with_groups);
  return data_with_groups;
};

export const fetchFinishedEvents = async () => {
  const data = await sql<Event[]>`
    select * from events where status = 'FINISHED' or quali_start_at < NOW() + INTERVAL '1 hour' order by date desc
  `;
  return data;
};

export const fetchCumulativePoints = async () => {
  const data = await sql<CumulativePoints[]>`
    WITH summarized AS (
      SELECT
        user_id,
        u.name user_name,
        event_id,
        e.name event_name,
        SUM(points) AS event_points
      FROM user_predictions up inner join events e on e.id = up.event_id
      inner join users u on u.id = up.user_id
      where e.status = 'FINISHED'
      GROUP BY user_id, event_id, e.name, u.name
    )
    SELECT
      user_id,
      user_name,
      event_id,
      event_name,
      event_points,
      SUM(event_points) OVER (
        PARTITION BY user_id
        ORDER BY event_id
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
      ) AS cumulative_points
    FROM summarized
    ORDER BY user_id, event_id;
  `;
  return data;
};
