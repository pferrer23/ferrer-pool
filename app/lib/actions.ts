'use server';
import postgres from 'postgres';
import {
  EventResult,
  PointsDefinition,
  PredictionGroup,
  PredictionGroupConfig,
  PredictionGroupItem,
  SeasonResult,
  UserPrediction,
} from './definitions';

const sql = postgres(process.env.POSTGRES_URL!);

export type State = {
  message?: string | null;
};

// save season user predictions
export async function saveUserPredictions(
  userId: number,
  predictions: UserPrediction[]
) {
  try {
    await sql`
    INSERT INTO user_predictions (
      user_id,
      event_id,
      prediction_group_item_id,
      driver_id,
      team_id,
      position
    )
    VALUES ${sql(
      predictions.map(
        (p) =>
          [
            userId,
            p.event_id ?? null,
            p.prediction_group_item_id,
            p.driver_id ?? null,
            p.team_id ?? null,
            p.position ?? null,
          ] as const
      )
    )}
    ON CONFLICT (user_id, prediction_group_item_id, COALESCE(event_id, -1))
    DO UPDATE SET
      driver_id = EXCLUDED.driver_id,
      team_id = EXCLUDED.team_id, 
      position = EXCLUDED.position,
      updated_at = CURRENT_TIMESTAMP
    `;
    return { message: 'Predictions saved successfully', success: true };
  } catch (error) {
    console.error(error);
    return { message: 'Error saving predictions', success: false };
  }
}

// save season results
export async function saveSeasonResults(results: SeasonResult[]) {
  try {
    await sql`
    INSERT INTO season_results (
      prediction_group_item_id,
      driver_id,
      team_id,
      position
    )
    VALUES ${sql(
      results.map(
        (p) =>
          [
            p.prediction_group_item_id,
            p.driver_id ?? null,
            p.team_id ?? null,
            p.position ?? null,
          ] as const
      )
    )}
    ON CONFLICT (prediction_group_item_id)
    DO UPDATE SET
      driver_id = EXCLUDED.driver_id,
      team_id = EXCLUDED.team_id, 
      position = EXCLUDED.position
    `;
  } catch (error) {
    console.error(error);
    return { message: 'Error saving season results' };
  }
}

// save event results
export async function saveEventResults(results: EventResult[]) {
  try {
    await sql`
    INSERT INTO event_results (
      event_id,
      prediction_group_item_id,
      driver_id,
      team_id,
      position
    )
    VALUES ${sql(
      results.map(
        (p) =>
          [
            p.event_id,
            p.prediction_group_item_id,
            p.driver_id ?? null,
            p.team_id ?? null,
            p.position ?? null,
          ] as const
      )
    )}
    ON CONFLICT (event_id, prediction_group_item_id)
    DO UPDATE SET
      driver_id = EXCLUDED.driver_id,
      team_id = EXCLUDED.team_id, 
      position = EXCLUDED.position
    `;
  } catch (error) {
    console.error(error);
    return { message: 'Error saving season results' };
  }
}

//Update prediction group items
export async function updatePredictionGroupItems(
  predictionGroupItems: PredictionGroupItem[]
) {
  try {
    await sql`
    UPDATE prediction_group_items 
    SET 
      prediction_group_id = updates.prediction_group_id::integer,
      name = updates.name,
      selection_type = updates.selection_type
    FROM (VALUES ${sql(
      predictionGroupItems.map(
        (item) =>
          [
            item.id,
            String(item.prediction_group_id), // Convert to string since VALUES clause coerces everything to text
            String(item.name),
            String(item.selection_type),
          ] as const
      )
    )}) AS updates(id, prediction_group_id, name, selection_type)
    WHERE prediction_group_items.id = updates.id::integer`; // Cast id comparison to integer
  } catch (error) {
    console.error(error);
    return { message: 'Error updating prediction group items' };
  }
}

//update points definitions
export async function updatePointsDefinitions(
  pointsDefinitions: PointsDefinition[]
) {
  try {
    await sql`
      UPDATE points_definitions
      SET prediction_group_id = updates.prediction_group_id::integer,
        points = updates.points::integer,
        type = updates.type
      FROM (VALUES ${sql(
        pointsDefinitions.map(
          (item) =>
            [
              item.id,
              String(item.prediction_group_id),
              String(item.points),
              String(item.type),
            ] as const
        )
      )}) AS updates(id, prediction_group_id, points, type)
      WHERE points_definitions.id = updates.id::integer
    `;
  } catch (error) {
    console.error(error);
    return { message: 'Error updating points definitions' };
  }
}

// create prdiction group
export async function createPredictionGroup(predictionGroup: PredictionGroup) {
  try {
    await sql`
    INSERT INTO prediction_groups (
      name,
      group_type
    )
    VALUES (${predictionGroup.name}, ${predictionGroup.group_type})
  `;
  } catch (error) {
    console.error(error);
    return { message: 'Error creating prediction group' };
  }
}

// create prediction group item
export async function createPredictionGroupItem(
  predictionGroupItem: Partial<PredictionGroupItem>
) {
  try {
    await sql`
      INSERT INTO prediction_group_items (
        prediction_group_id,
        name,
        selection_type
      )
      VALUES (
        ${predictionGroupItem.prediction_group_id || 0},
        ${predictionGroupItem.name || ''},
        ${predictionGroupItem.selection_type || 'DRIVER_UNIQUE'}
      )
    `;
  } catch (error) {
    console.error(error);
    return { message: 'Error creating prediction group item' };
  }
}

// create points definition
export async function createPointsDefinition(
  pointsDefinition: Partial<PointsDefinition>
) {
  try {
    await sql`
      INSERT INTO points_definitions (
        prediction_group_id,
        type,
        points
      )
      VALUES (
        ${pointsDefinition.prediction_group_id || 0},
        ${pointsDefinition.type || 'EXACT'},
        ${pointsDefinition.points || 0}
      )
    `;
  } catch (error) {
    console.error(error);
    return { message: 'Error creating points definition' };
  }
}

// close event
export async function closeEvent(eventId: number) {
  try {
    await sql`
      UPDATE events
      SET status = 'FINISHED'
      WHERE id = ${eventId}
    `;

    const pointsConfig = await sql`
      select
        pg.id group_id,
        pg.name group_name,
        pgi.id item_id,
        pgi.name item_name,
        pgi.selection_type item_selection_type,
        pd.id points_id,
        pd.type points_type,
        pd.points
      from
        prediction_groups pg
      inner join prediction_group_items pgi on
        pg.id = pgi.prediction_group_id
      inner join points_definitions pd on
        pg.id = pd.prediction_group_id
      where
        pg.group_type = 'RACE'
      order by
        pg.id,
        pgi.id,
        pd.id
    `;

    const userPredictions = await sql`
      select
        u.id user_id,
        u.name user_name,
        up.id prediction_id,
        up.prediction_group_item_id,
        pgi.name item_name,
        pg.id group_id,
        pg.name group_name,
        up.driver_id,
        up.team_id,
        up.position
      from users u
      inner join user_predictions up on u.id = up.user_id
      inner join prediction_group_items pgi on up.prediction_group_item_id = pgi.id
      inner join prediction_groups pg on pgi.prediction_group_id = pg.id
      where up.event_id = ${eventId}
      order by u.id, pgi.id, up.id
    `;

    const eventResults = await sql`
      select
        prediction_group_item_id,
        driver_id,
        team_id,
        position
      from event_results
      where event_id = ${eventId}
    `;

    const user_prediction_points = userPredictions.map((userPrediction) => {
      const item_id = userPrediction.prediction_group_item_id;
      let user_prediction_item_points = 0;

      const item_points_configs = pointsConfig.filter(
        (pt) => pt.item_id === item_id
      );

      item_points_configs.forEach((points) => {
        if (points.item_id === item_id) {
          let validation_column = 'driver_id';
          if (points.item_selection_type === 'TEAM_UNIQUE') {
            validation_column = 'team_id';
          }
          if (points.item_selection_type === 'POSITION') {
            validation_column = 'position';
          }

          const user_group_items = userPredictions
            .filter(
              (itm) =>
                itm.group_id === points.group_id &&
                itm.user_id === userPrediction.user_id
            )
            .map((itm) => itm[validation_column]);

          const user_exact_item = userPrediction[validation_column];
          const result_value = eventResults.find(
            (itm) => itm.prediction_group_item_id === item_id
          )?.[validation_column];

          if (
            points.points_type === 'EXACT' &&
            user_exact_item == result_value
          ) {
            user_prediction_item_points += points.points;
          }

          if (
            points.points_type === 'ANY_IN_ITEMS' &&
            user_group_items.includes(result_value)
          ) {
            user_prediction_item_points += points.points;
          }
        }
      });

      return {
        ...userPrediction,
        points: user_prediction_item_points,
      };
    });

    // Update points in database
    await sql`
      UPDATE user_predictions
      SET points = updates.points::integer
      FROM (VALUES ${sql(
        user_prediction_points.map(
          (item: any) => [item.prediction_id, String(item.points)] as const
        )
      )}) AS updates(prediction_id, points)
      WHERE user_predictions.id = updates.prediction_id::integer
    `;

    return { message: 'Event closed successfully' };
  } catch (error) {
    console.error(error);
    return { message: 'Error closing event' };
  }
}
