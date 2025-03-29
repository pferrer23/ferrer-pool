import {
  fetchEventPredictionsConfig,
  fetchDrivers,
  fetchTeams,
  fetchEventUserPredictions,
} from '@/app/lib/data';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';
import EventPredictionsForm from './event-predictions-form';

export default async function EventPredictions() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const predictionsConfig = await fetchEventPredictionsConfig();
  const drivers = await fetchDrivers();
  const teams = await fetchTeams();
  const userPredictions = await fetchEventUserPredictions(userId!);
  return (
    <div className='space-y-4'>
      <EventPredictionsForm
        predictions={predictionsConfig}
        drivers={drivers}
        teams={teams}
        userPredictions={userPredictions}
      />
    </div>
  );
}
