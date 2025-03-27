import {
  fetchSeasonPredictionsConfig,
  fetchDrivers,
  fetchTeams,
  fetchSeasonUserPredictions,
} from '@/app/lib/data';
import SeasonPredictionsForm from './season-predictions-form';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';
import { UserPrediction } from '@/app/lib/definitions';

export default async function SeasonPredictions() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const seasonPredictionsConfig = await fetchSeasonPredictionsConfig();
  const drivers = await fetchDrivers();
  const teams = await fetchTeams();
  const userPredictions = userId
    ? await fetchSeasonUserPredictions(userId)
    : [];

  return (
    <div className='space-y-4'>
      <SeasonPredictionsForm
        predictions={seasonPredictionsConfig}
        drivers={drivers}
        teams={teams}
        userPredictions={userPredictions}
      />
    </div>
  );
}
