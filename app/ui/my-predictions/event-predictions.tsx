import {
  fetchEventPredictionsConfig,
  fetchDrivers,
  fetchTeams,
} from '@/app/lib/data';
import EventPredictionsForm from './event-predictions-form';

export default async function EventPredictions() {
  const predictionsConfig = await fetchEventPredictionsConfig();
  const drivers = await fetchDrivers();
  const teams = await fetchTeams();
  return (
    <div className='space-y-4'>
      <EventPredictionsForm
        predictions={predictionsConfig}
        drivers={drivers}
        teams={teams}
      />
    </div>
  );
}
