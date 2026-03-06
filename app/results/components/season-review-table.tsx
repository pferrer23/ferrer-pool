'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Chip,
  Card,
  CardHeader,
  CardBody,
} from '@heroui/react';
import { fetchSeasonReviewData } from '@/app/lib/data';
import clsx from 'clsx';

function renderValue(item: any, prediction: any) {
  if (!prediction) return <span className='text-gray-500'>-</span>;

  const selType = item.selection_type;

  if (selType === 'POSITION') {
    return <span className='font-semibold'>P{prediction.position}</span>;
  }

  if (selType === 'TEAM_UNIQUE' || selType === 'TEAM_MULTIPLE') {
    return (
      <Chip
        classNames={{
          content: clsx('text-white', 'font-semibold'),
          dot: `bg-[#${prediction.team_color}]`,
        }}
        size='sm'
        variant='dot'
      >
        {prediction.team_name}
      </Chip>
    );
  }

  // DRIVER_UNIQUE or DRIVER_MULTIPLE
  return (
    <div className='flex items-center gap-2'>
      {prediction.driver_avatar && (
        <img
          src={prediction.driver_avatar}
          alt={prediction.driver_acronym}
          className='hidden sm:block w-8 h-8 rounded-full'
        />
      )}
      <Chip
        classNames={{
          content: clsx('text-white text-xs sm:text-sm', 'font-semibold'),
          dot: `bg-[#${prediction.team_color}]`,
        }}
        size='sm'
        variant='dot'
      >
        {prediction.driver_acronym}
      </Chip>
    </div>
  );
}

export default function SeasonReviewTable() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchSeasonReviewData();
        setData(result);
      } catch (error) {
        console.error('Error loading season review:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Spinner color='warning' label='Loading...' />;
  if (!data || data.groups.length === 0)
    return <p className='text-gray-400'>No hay datos de temporada.</p>;

  const { groups, users, predictions, virtualPoints } = data;

  return (
    <div className='flex flex-col gap-4'>
      {groups.map((group: any) => {
        const deadlineDate = group.prediction_deadline
          ? new Date(group.prediction_deadline)
          : null;
        const deadlineReached = deadlineDate && !isNaN(deadlineDate.getTime())
          ? deadlineDate <= new Date()
          : false;

        if (!deadlineReached) {
          return (
            <Card key={group.id}>
              <CardHeader>
                <h3 className='text-xl font-bold px-3'>{group.name}</h3>
              </CardHeader>
              <CardBody>
                <p className='text-gray-400 px-3 py-4'>
                  Las predicciones aun estan abiertas.
                  {deadlineDate && (
                    <>
                      {' '}Fecha limite:{' '}
                      <span className='text-yellow-400 font-semibold'>
                        {deadlineDate.toLocaleString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </>
                  )}
                </p>
              </CardBody>
            </Card>
          );
        }

        const userTotals = users.map((user: any) => {
          let total = 0;
          group.items.forEach((item: any) => {
            total += virtualPoints[`${item.id}_${user.user_id}`] ?? 0;
          });
          return { user_id: user.user_id, total };
        });

        const resultMaxTotal = group.items.reduce(
          (sum: number, item: any) => sum + (item.result ? item.max_points : 0),
          0
        );

        return (
          <Card key={group.id}>
            <CardHeader>
              <h3 className='text-xl font-bold px-3'>{group.name}</h3>
            </CardHeader>
            <CardBody>
              <Table aria-label={`${group.name} season review`}>
                <TableHeader>
                  <TableColumn>Apuesta</TableColumn>
                  <TableColumn>Resultado</TableColumn>
                  {users.map((user: any) => (
                    <TableColumn key={user.user_id}>
                      <div className='flex items-center gap-2'>
                        {user.user_avatar && (
                          <img
                            src={user.user_avatar}
                            alt={user.user_name}
                            className='hidden sm:block w-6 h-6 rounded-full'
                          />
                        )}
                        <span>
                          {user.user_name
                            .split(' ')
                            .map((n: string, i: number) =>
                              i === 0 ? `${n[0]}.` : n
                            )
                            .join(' ')}
                        </span>
                      </div>
                    </TableColumn>
                  ))}
                </TableHeader>
                <TableBody>
                  {[
                    ...group.items.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <span className='font-medium'>{item.name}</span>
                        </TableCell>
                        <TableCell>
                          {item.result
                            ? renderValue(item, item.result)
                            : <span className='text-gray-500'>-</span>}
                        </TableCell>
                        {users.map((user: any) => {
                          const pred =
                            predictions[`${item.id}_${user.user_id}`];
                          const vp =
                            virtualPoints[`${item.id}_${user.user_id}`] ?? 0;
                          return (
                            <TableCell key={user.user_id}>
                              <div className='flex items-center gap-1'>
                                {renderValue(item, pred)}
                                {vp > 0 && (
                                  <span className='text-xs text-yellow-400 font-semibold ml-1'>
                                    +{vp}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    )),
                    <TableRow key='totals' className='bg-yellow-900/20'>
                      <TableCell>
                        <span className='font-bold text-yellow-400'>Total</span>
                      </TableCell>
                      <TableCell>
                        <span className='font-bold text-yellow-400'>
                          {resultMaxTotal} pts
                        </span>
                      </TableCell>
                      {users.map((user: any) => {
                        const ut = userTotals.find(
                          (u: any) => u.user_id === user.user_id
                        );
                        return (
                          <TableCell key={user.user_id}>
                            <span className='font-bold text-yellow-400'>
                              {ut?.total ?? 0} pts
                            </span>
                          </TableCell>
                        );
                      })}
                    </TableRow>,
                  ]}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
