'use client';

import { Accordion, AccordionItem, Avatar } from '@heroui/react';
import { Event, EventResultDetailed } from '@/app/lib/definitions';
import Image from 'next/image';

type EventWithResults = Event & {
  results: EventResultDetailed[];
};

export default function LastEvents({ events }: { events: EventWithResults[] }) {
  const itemClasses = {
    base: 'p-4 w-full bg-background-900',
    title: 'font-normal text-medium',
    trigger:
      'data-[hover=true]:bg-background-900 rounded-lg h-20 flex items-center bg-background-900',
    indicator: 'text-medium',
    content: 'text-small px-2',
  };

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-bold'>Last Events</h2>
      <Accordion
        variant='splitted'
        className='p-2 flex flex-col gap-1 w-full'
        itemClasses={itemClasses}
      >
        {events.map((event) => (
          <AccordionItem
            key={event.id}
            aria-label={event.name}
            title={
              <div className='flex items-center gap-4'>
                <Image
                  src={event.track_image}
                  alt={event.track}
                  width={60}
                  height={60}
                  className='rounded-lg'
                />
                <div className='text-left flex-1'>
                  <h3 className='font-semibold'>{event.name}</h3>
                  <p className='text-sm text-gray-500'>{event.track}</p>
                </div>
                {event.has_sprint_race && (
                  <span className='px-3 py-1 text-xs rounded-full bg-primary-600 text-white'>
                    Sprint
                  </span>
                )}
              </div>
            }
          >
            <div className='p-4 flex flex-row justify-around flex-wrap gap-10'>
              {event.results.map((result) => (
                <div
                  key={result.id}
                  className='flex flex-col items-center gap-2'
                >
                  <h4 className='font-medium text-gray-400'>
                    {result.pridiction_name}
                  </h4>
                  <div className='flex flex-col items-center gap-2'>
                    <Avatar
                      isBordered
                      radius='md'
                      src={result.driver_headshot_url}
                      alt={result.driver_name}
                      size='sm'
                    />
                    <span className='px-2 py-1 text-xs rounded-md bg-primary-800'>
                      {result.driver_acronym}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
