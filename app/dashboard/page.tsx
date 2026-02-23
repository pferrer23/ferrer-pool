import Leaderboard from '@/app/dashboard/components/leaderboard';
import LastEvents from '@/app/dashboard/components/last-events';
import TrackChart from '@/app/dashboard/components/track-chart';
import InsightsList from '@/app/dashboard/components/insights-carousel';
import { fetchLatestInsights } from '@/app/lib/data';

export default async function Page() {
  const insights = await fetchLatestInsights();

  return (
    <main className='min-h-screen p-6'>
      <div className='flex flex-col lg:flex-row gap-6'>
        {/* Main content */}
        <div className='flex-1 min-w-0'>
          <Leaderboard />
          <TrackChart />
          <LastEvents />
        </div>

        {/* Sidebar */}
        <aside className='lg:w-72 shrink-0'>
          <InsightsList insights={insights} />
        </aside>
      </div>
    </main>
  );
}
