import { fetchTeams, fetchDrivers, fetchEvents } from '@/app/lib/data';
import GridSection from './components/grid-section';
import CalendarSection from './components/calendar-section';

export default async function Page() {
  const [teams, drivers, events] = await Promise.all([
    fetchTeams(),
    fetchDrivers(),
    fetchEvents(),
  ]);

  return (
    <main className='min-h-screen p-6'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
        <GridSection teams={teams} drivers={drivers} />
        <CalendarSection events={events} />
      </div>
    </main>
  );
}
