'use server';
import postgres from 'postgres';
import { EventResult, SeasonResult, UserPrediction } from './definitions';

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
