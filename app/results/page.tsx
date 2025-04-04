'use client';

import React from 'react';
import { Tabs, Tab } from '@heroui/react';
import ResultsTable from './components/results-table';
import PointsByEventTable from './components/points-by-event-table';

export default function ResultsPage() {
  const [selected, setSelected] = React.useState('results');

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Resultados</h1>
      <div className='flex w-full flex-col'>
        <Tabs
          aria-label='Results Options'
          selectedKey={selected}
          onSelectionChange={(key) => setSelected(key.toString())}
        >
          <Tab key='results' title='Ultimos Resultados'>
            <ResultsTable />
          </Tab>
          <Tab key='points' title='Puntos por Evento'>
            <PointsByEventTable />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
