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
  } catch (error) {
    console.error(error);
    return { message: 'Error saving predictions' };
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
