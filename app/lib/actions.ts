'use server';
import postgres from 'postgres';
import { UserPrediction } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!);

export type State = {
  message?: string | null;
};

// save season user predictions
export async function saveSeasonUserPredictions(
  userId: number,
  predictions: UserPrediction[]
) {
  try {
    await sql`
    INSERT INTO user_predictions (
      user_id,
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
            p.prediction_group_item_id,
            p.driver_id ?? null,
            p.team_id ?? null,
            p.position ?? null,
          ] as const
      )
    )}
    ON CONFLICT (user_id, prediction_group_item_id) 
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
