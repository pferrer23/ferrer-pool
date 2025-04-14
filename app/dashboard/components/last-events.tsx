'use client';

import {
  Accordion,
  AccordionItem,
  Avatar,
  Chip,
  Card,
  CardHeader,
  CardBody,
  Spinner,
} from '@heroui/react';
import { Event, EventResultDetailed } from '@/app/lib/definitions';
import { fetchLastEvents } from '@/app/lib/data';
import Image from 'next/image';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

type EventWithResults = Event & {
  results: any;
};

export default function LastEvents() {
  const [events, setEvents] = useState<EventWithResults[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchLastEvents();
        setEvents(data);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const itemClasses = {
    base: 'p-4 w-full bg-background-900',
    title: 'font-normal text-medium',
    trigger:
      'data-[hover=true]:bg-background-900 rounded-lg h-20 flex items-center bg-background-900',
    indicator: 'text-medium',
    content: 'text-small px-2',
  };

  if (loading) {
    return <Spinner color='warning' label='Loading...' />;
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-bold'>Últimos Eventos</h2>
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
            <div className='p-4 flex flex-row justify-around flex-wrap gap-5'>
              {Object.entries(event.results).map(
                ([groupName, results]: [string, any]) => (
                  <div
                    key={groupName}
                    className='bg-background-900 p-3 rounded-lg border border-background-800 w-full max-w-sm'
                  >
                    <div className='mb-2'>
                      <h4 className='font-medium'>{groupName}</h4>
                    </div>
                    <div className='flex flex-row flex-wrap justify-around gap-4'>
                      {results.map((result: any) => (
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
                            <Chip
                              classNames={{
                                content: clsx(
                                  'text-white text-xs sm:text-sm',
                                  'font-semibold'
                                ),
                                dot: `bg-[#${result.team_color}]`,
                              }}
                              size='sm'
                              variant='dot'
                            >
                              {result.driver_acronym}
                            </Chip>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
