// import Link from 'next/link';
// import { fetchDrivers } from './lib/data';
import DriverAvatar from '@/app/ui/components/Avatar';
import { drivers } from '@/app/lib/placeholder-data';
import Leaderboard from '@/app/dashboard/components/leaderboard';
import LastEventServer from '@/app/dashboard/components/last-event-server';
import TrackChart from '@/app/dashboard/components/track-chart';
export default function Page() {
  // const drivers = await fetchDrivers();
  return (
    <main className='min-h-screen p-6'>
      <Leaderboard />
      <TrackChart />
      <LastEventServer />
    </main>
  );
}
