import { fetchLastEvents } from '@/app/lib/data';
import LastEvents from '@/app/ui/dashboard/last-events';

export default async function LastEventServer() {
  const events = await fetchLastEvents();
  return <LastEvents events={events} />;
}
