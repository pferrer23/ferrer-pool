import {
  fetchSeasonPredictionsConfig,
  fetchDrivers,
  fetchTeams,
} from '@/app/lib/data';
import SeasonPredictionsForm from './season-predictions-form';

export default async function SeasonPredictions() {
  const seasonPredictionsConfig = await fetchSeasonPredictionsConfig();
  const drivers = await fetchDrivers();
  const teams = await fetchTeams();

  return (
    <div className='space-y-4'>
      <SeasonPredictionsForm
        predictions={seasonPredictionsConfig}
        drivers={drivers}
        teams={teams}
      />
    </div>
  );
}
