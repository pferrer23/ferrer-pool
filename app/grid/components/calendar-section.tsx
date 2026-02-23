import Image from 'next/image';
import { Event } from '@/app/lib/definitions';

type Props = {
  events: Event[];
};

const STATUS_LABEL: Record<Event['status'], string> = {
  NOT_STARTED: 'Próximo',
  IN_PROGRESS: 'En curso',
  FINISHED: 'Finalizado',
};

const STATUS_COLORS: Record<Event['status'], string> = {
  NOT_STARTED: 'bg-blue-900 text-blue-300 border border-blue-700',
  IN_PROGRESS: 'bg-green-900 text-green-300 border border-green-700',
  FINISHED: 'bg-background-800 text-gray-400 border border-background-700',
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function groupByMonth(events: Event[]) {
  const groups: { label: string; events: Event[] }[] = [];
  const seen = new Map<string, number>();

  for (const event of events) {
    const date = new Date(event.date);
    const label = date.toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });
    const labelCapitalized = label.charAt(0).toUpperCase() + label.slice(1);
    if (!seen.has(labelCapitalized)) {
      seen.set(labelCapitalized, groups.length);
      groups.push({ label: labelCapitalized, events: [] });
    }
    groups[seen.get(labelCapitalized)!].events.push(event);
  }
  return groups;
}

export default function CalendarSection({ events }: Props) {
  const groups = groupByMonth(events);

  return (
    <section>
      <h2 className='text-2xl font-bold text-white mb-6'>Calendario {new Date().getFullYear()}</h2>
      <div className='flex flex-col gap-8'>
        {groups.map((group) => (
          <div key={group.label}>
            <h3 className='text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3'>
              {group.label}
            </h3>
            <div className='flex flex-col gap-3'>
              {group.events.map((event) => (
                <div
                  key={event.id}
                  className={`flex items-center gap-4 bg-background-900 border border-background-800 rounded-xl p-3 ${
                    event.status === 'FINISHED' ? 'opacity-50' : ''
                  }`}
                >
                  {/* Track image */}
                  <div className='relative w-16 h-12 flex-shrink-0'>
                    <Image
                      src={event.track_image}
                      alt={event.track}
                      fill
                      className='object-contain'
                      sizes='64px'
                    />
                  </div>

                  {/* Info */}
                  <div className='flex-1 min-w-0'>
                    <p className='font-semibold text-white text-sm truncate'>
                      {event.name}
                    </p>
                    <p className='text-xs text-gray-400'>{event.track}</p>
                    <p className='text-xs text-gray-500 mt-0.5'>
                      {formatDate(event.date)}
                    </p>
                  </div>

                  {/* Badges */}
                  <div className='flex flex-col items-end gap-1 flex-shrink-0'>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[event.status]}`}
                    >
                      {STATUS_LABEL[event.status]}
                    </span>
                    {event.has_sprint_race && (
                      <span className='text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-900 text-yellow-300 border border-yellow-700'>
                        Sprint
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
