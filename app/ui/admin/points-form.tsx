'use client';

import { useState } from 'react';
import { Form, Input, Select, SelectItem, Button } from '@heroui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { PredictionGroupConfig, PointsDefinition } from '@/app/lib/definitions';
import { createPointsDefinition } from '@/app/lib/actions';

export default function PointsForm({
  onClose,
  refreshConfig,
  predictionGroups,
}: {
  onClose: () => void;
  refreshConfig: () => Promise<void>;
  predictionGroups: PredictionGroupConfig[];
}) {
  const [groupId, setGroupId] = useState<number | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [type, setType] = useState<
    'EXACT' | 'ANY_IN_ITEMS' | 'RESULTS_INCLUDES'
  >('EXACT');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!groupId) return;

    const pointsDefinition: Partial<PointsDefinition> = {
      prediction_group_id: groupId,
      points: points,
      type: type,
    };
    await createPointsDefinition(pointsDefinition);
    refreshConfig();
    onClose();
  };

  return (
    <Form
      className='w-full flex flex-col gap-4'
      onReset={onClose}
      onSubmit={handleSubmit}
    >
      <Select
        isRequired
        label='Prediction Group'
        labelPlacement='outside'
        variant='bordered'
        onChange={(e) => setGroupId(Number(e.target.value))}
        errorMessage='Please select a prediction group'
      >
        {predictionGroups.map((group) => (
          <SelectItem key={group.id}>{group.name}</SelectItem>
        ))}
      </Select>

      <Input
        isRequired
        type='number'
        label='Points'
        name='points'
        placeholder='Enter points value'
        variant='bordered'
        labelPlacement='outside'
        errorMessage='Please enter points value'
        onChange={(e) => setPoints(Number(e.target.value))}
      />

      <Select
        isRequired
        label='Points Type'
        labelPlacement='outside'
        variant='bordered'
        selectedKeys={[type]}
        onChange={(e) => setType(e.target.value as typeof type)}
        errorMessage='Please select a points type'
      >
        <SelectItem key='EXACT'>Exact Match</SelectItem>
        <SelectItem key='ANY_IN_ITEMS'>Any In Items</SelectItem>
        <SelectItem key='RESULTS_INCLUDES'>Results Includes</SelectItem>
      </Select>

      <div className='flex gap-4 justify-end w-full pb-4'>
        <Button
          type='submit'
          color='primary'
          startContent={<CheckIcon className='h-5 w-5' />}
        >
          Save Points Definition
        </Button>
        <Button type='reset' variant='flat'>
          Cancel
        </Button>
      </div>
    </Form>
  );
}
