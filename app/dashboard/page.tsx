// import Link from 'next/link';
// import { fetchDrivers } from './lib/data';
import DriverAvatar from '@/app/ui/components/Avatar';
import { drivers } from '@/app/lib/placeholder-data';
import Leaderboard from '@/app/ui/dashboard/leaderboard';
import LastEventServer from '@/app/ui/dashboard/last-event-server';
export default function Page() {
  // const drivers = await fetchDrivers();
  return (
    <main className='min-h-screen p-6'>
      <Leaderboard />
      <LastEventServer />
    </main>
  );
}
