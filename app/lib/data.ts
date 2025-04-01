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
          t.car_image team_image_url
        from
          event_results er
        left join drivers d on
          er.driver_id = d.id
        left join teams t on
          er.team_id = t.id
        left join prediction_group_items pgi on
          er.prediction_group_item_id = pgi.id
        where
          event_id = ${event.id}
        order by
          pgi.id
      `;
      return {
        ...event,
        results,
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
    date > CURRENT_DATE
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
