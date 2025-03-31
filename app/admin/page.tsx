'use client';

import React from 'react';
import { Tabs, Tab, Card, CardBody } from '@heroui/react';
import SeasonResults from '@/app/ui/admin/season-results';
import EventResults from '@/app/ui/admin/event-results';
import PointingsConfigForm from '@/app/ui/admin/pointings-config';

export default function AdminPage() {
  const [selected, setSelected] = React.useState('season');

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Administrador</h1>
      <div className='flex w-full flex-col'>
        <Tabs
          aria-label='Admin Options'
          selectedKey={selected}
          onSelectionChange={(key) => setSelected(key.toString())}
        >
          <Tab key='season' title='Temporada'>
            <SeasonResults />
          </Tab>
          <Tab key='events' title='Eventos'>
            <EventResults />
          </Tab>
          <Tab key='pointing' title='Puntuaciones'>
            <PointingsConfigForm />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
