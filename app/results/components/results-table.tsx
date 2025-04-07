'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Spinner,
  Chip,
  Card,
  CardHeader,
  CardBody,
  Select,
  SelectItem,
  Avatar,
} from '@heroui/react';
import { fetchEventDashboardData, fetchFinishedEvents } from '@/app/lib/data';
import clsx from 'clsx';

export default function ResultsTable() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>([]);
  const [events, setEvents] = useState<any>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const finishedEvents = await fetchFinishedEvents();
      setEvents(finishedEvents);

      if (finishedEvents.length > 0) {
        setSelectedEvent(finishedEvents[0].id.toString());
        const dashboardData = await fetchEventDashboardData(
          finishedEvents[0].id
        );
        setDashboardData(dashboardData);
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  const handleEventChange = async (value: string) => {
    setLoading(true);
    setSelectedEvent(value);
    const dashboardData = await fetchEventDashboardData(parseInt(value));
    setDashboardData(dashboardData);
    setLoading(false);
  };

  if (loading) return <Spinner color='warning' label='Loading...' />;

  return (
    <div className='flex flex-col gap-4'>
      <div className='my-4'>
        <Select
          label='Gran Premio'
          labelPlacement='outside'
          selectedKeys={[selectedEvent]}
          onChange={(e) => handleEventChange(e.target.value)}
        >
          {events.map((event: any) => (
            <SelectItem key={event.id}>{event.name}</SelectItem>
          ))}
        </Select>
      </div>
      <div className='flex flex-wrap gap-2 mb-4'>
        {dashboardData[0]?.event_user_points?.map((userPoints: any) => (
          <Card key={userPoints.user_id} className='px-4 py-2'>
            <div className='flex items-center gap-2'>
              <Avatar
                src={userPoints.user_avatar}
                alt={userPoints.user_name}
                size='sm'
              />
              <div className='flex flex-col'>
                <span className='text-sm font-medium'>
                  {userPoints.user_name
                    .split(' ')
                    .map((part: string, i: number, arr: string[]) =>
                      i === arr.length - 1 ? part : part[0] + '.'
                    )
                    .join(' ')}
                </span>
                <span className='text-xs text-gray-500'>
                  {userPoints.points} pts
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {dashboardData[0]?.prediction_groups.map(
        (group: any) =>
          group.results.length > 0 && (
            <Card key={group.id}>
              <CardHeader>
                <div className='flex flex-col md:flex-row gap-4 items-start md:items-center md:justify-between w-full px-3'>
                  <h3 className='text-xl font-bold'>{group.name}</h3>
                  <div className='flex flex-col md:flex-row gap-2 w-full md:w-auto md:ml-auto'>
                    <span className='text-lg text-gray-500'>Resultados</span>
                    <div className='flex flex-wrap gap-2'>
                      {group.results.map((result: any) => (
                        <div
                          key={result.id}
                          className='flex items-center gap-2'
                        >
                          <span className='font-medium text-sm'>
                            {result.item_name}:
                          </span>
                          {result.driver_avatar && (
                            <img
                              src={result.driver_avatar}
                              alt={result.driver_acronym}
                              className='hidden sm:block w-8 h-8 rounded-full'
                            />
                          )}
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
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <Table aria-label={`${group.name} predictions table`}>
                  <TableHeader>
                    <TableColumn>User</TableColumn>
                    {group.prediction_names.map((name: any) => (
                      <TableColumn key={name}>{name}</TableColumn>
                    ))}
                    <TableColumn align='end'>Points</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {group.predictions.map((prediction: any) => (
                      <TableRow key={`${prediction.user_id}`}>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <img
                              src={prediction.user_avatar}
                              alt={prediction.user_name}
                              className='hidden sm:block w-8 h-8 rounded-full'
                            />
                            <span>{prediction.user_name}</span>
                          </div>
                        </TableCell>
                        {group.prediction_names.map((name: any) => (
                          <TableCell key={name}>
                            <div className='flex items-center gap-2'>
                              {prediction[`${name}_driver_avatar`] && (
                                <img
                                  src={prediction[`${name}_driver_avatar`]}
                                  alt={prediction[`${name}_driver_acronym`]}
                                  className='hidden sm:block w-8 h-8 rounded-full'
                                />
                              )}
                              <Chip
                                classNames={{
                                  content: clsx('text-white', 'font-semibold'),
                                  dot: `bg-[#${
                                    prediction[`${name}_team_color`]
                                  }]`,
                                }}
                                size='sm'
                                variant='dot'
                              >
                                {prediction[`${name}_driver_acronym`]}
                              </Chip>
                            </div>
                          </TableCell>
                        ))}
                        <TableCell>
                          <span className='font-semibold text-end'>
                            {prediction.total_points}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
          )
      )}
    </div>
  );
}
