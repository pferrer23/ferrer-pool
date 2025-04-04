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
} from '@heroui/react';
import { fetchUserPointsByEvent } from '@/app/lib/data';
import { UserPointsByEvent } from '@/app/lib/definitions';

const columns = [
  { name: 'EVENTO', uid: 'event_name' },
  { name: 'USUARIO', uid: 'user' },
  { name: 'PUNTOS', uid: 'points' },
];

export default function PointsByEventTable() {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<UserPointsByEvent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchUserPointsByEvent();
      setResults(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const renderCell = (result: UserPointsByEvent, columnKey: React.Key) => {
    switch (columnKey) {
      case 'event_name':
        return (
          <div className='flex items-center gap-3'>
            <img
              src={result.track_image}
              alt={result.event_name}
              className='hidden sm:block w-12 h-8 object-contain'
            />
            <span>{result.event_name}</span>
          </div>
        );

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

      case 'points':
        return <div className='font-semibold'>{result.points}</div>;

      default:
        return null;
    }
  };

  if (loading) return <Spinner color='warning' label='Loading...' />;

  return (
    <Table aria-label='Points by event table'>
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align='start'>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={results}>
        {(item) => (
          <TableRow key={`${item.event_id}-${item.user_id}`}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
