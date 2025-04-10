import { fetchLastEvents } from '@/app/lib/data';
import LastEvents from '@/app/dashboard/components/last-events';

export default async function LastEventServer() {
  const events = await fetchLastEvents();
  return <LastEvents events={events} />;
}
