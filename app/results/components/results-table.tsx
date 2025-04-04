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
} from '@heroui/react';
import { fetchUserFullResults } from '@/app/lib/data';
import clsx from 'clsx';
import { UserResultByEvent } from '@/app/lib/definitions';

const columns = [
  { name: 'EVENT', uid: 'event_name' },
  { name: 'USER', uid: 'user' },
  { name: 'PREDICTION NAME', uid: 'prediction_name' },
  { name: 'PREDICTION', uid: 'prediction' },
  { name: 'RESULT', uid: 'result' },
  { name: 'POINTS', uid: 'points' },
];

export default function ResultsTable() {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<UserResultByEvent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchUserFullResults();
      setResults(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const renderCell = (result: any, columnKey: React.Key) => {
    switch (columnKey) {
      case 'event_name':
        return <div>{result.event_name}</div>;

      case 'user':
        return (
          <>
            <div className='hidden sm:block'>
              <User
                name={result.user_name}
                avatarProps={{
                  src: result.user_avatar,
                }}
              />
            </div>
            <div className='sm:hidden'>{result.user_name}</div>
          </>
        );

      case 'prediction_name':
        return <div>{result.prediction_name}</div>;

      case 'prediction':
        return (
          <div className='flex items-center gap-2'>
            {result.driver_avatar && (
              <img
                src={result.driver_avatar}
                alt={result.driver_acronym}
                className='hidden sm:block w-8 h-8 rounded-full'
              />
            )}
            <Chip
              classNames={{
                content: clsx('text-white', 'font-semibold'),
                dot: `bg-[#${result.driver_color}]`,
              }}
              size='sm'
              variant='dot'
            >
              {result.driver_acronym}
            </Chip>
          </div>
        );

      case 'result':
        return (
          <div className='flex items-center gap-2'>
            {result.result_driver_avatar && (
              <img
                src={result.result_driver_avatar}
                alt={result.result_driver_acronym}
                className='hidden sm:block w-8 h-8 rounded-full'
              />
            )}
            <Chip
              classNames={{
                content: clsx('text-white', 'font-semibold'),
                dot: `bg-[#${result.result_driver_color}]`,
              }}
              size='sm'
              variant='dot'
            >
              {result.result_driver_acronym}
            </Chip>
          </div>
        );

      case 'points':
        return <div className='font-semibold'>{result.points}</div>;

      default:
        return null;
    }
  };

  if (loading) return <Spinner color='warning' label='Loading...' />;

  return (
    <Table aria-label='Results table'>
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align='start'>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={results}>
        {(item) => (
          <TableRow key={`${item.event_id}-${item.user_id}-${item.item_id}`}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
