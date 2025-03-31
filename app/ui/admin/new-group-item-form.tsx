'use client';

import { useState } from 'react';
import { Form, Input, Select, SelectItem, Button } from '@heroui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import {
  PredictionGroupConfig,
  PredictionGroupItem,
} from '@/app/lib/definitions';
import { createPredictionGroupItem } from '@/app/lib/actions';

export default function NewGroupItemForm({
  onClose,
  refreshConfig,
  predictionGroups,
}: {
  onClose: () => void;
  refreshConfig: () => Promise<void>;
  predictionGroups: PredictionGroupConfig[];
}) {
  const [groupId, setGroupId] = useState<number | null>(null);
  const [itemName, setItemName] = useState<string>('');
  const [selectionType, setSelectionType] = useState<
    | 'DRIVER_UNIQUE'
    | 'TEAM_UNIQUE'
    | 'DRIVER_MULTIPLE'
    | 'TEAM_MULTIPLE'
    | 'POSITION'
  >('DRIVER_UNIQUE');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!groupId) return;

    const item: Partial<PredictionGroupItem> = {
      prediction_group_id: groupId,
      name: itemName,
      selection_type: selectionType,
    };
    await createPredictionGroupItem(item);
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
        type='text'
        label='Item Name'
        name='name'
        placeholder='Enter item name'
        variant='bordered'
        labelPlacement='outside'
        errorMessage='Please enter an item name'
        onChange={(e) => setItemName(e.target.value)}
      />

      <Select
        isRequired
        label='Selection Type'
        labelPlacement='outside'
        variant='bordered'
        selectedKeys={[selectionType]}
        onChange={(e) =>
          setSelectionType(e.target.value as typeof selectionType)
        }
        errorMessage='Please select a selection type'
      >
        <SelectItem key='DRIVER_UNIQUE'>Driver (Unique)</SelectItem>
        <SelectItem key='TEAM_UNIQUE'>Team (Unique)</SelectItem>
        <SelectItem key='DRIVER_MULTIPLE'>Driver (Multiple)</SelectItem>
        <SelectItem key='TEAM_MULTIPLE'>Team (Multiple)</SelectItem>
        <SelectItem key='POSITION'>Position</SelectItem>
      </Select>

      <div className='flex gap-4 justify-end w-full pb-4'>
        <Button
          type='submit'
          color='primary'
          startContent={<CheckIcon className='h-5 w-5' />}
        >
          Save Item
        </Button>
        <Button type='reset' variant='flat'>
          Cancel
        </Button>
      </div>
    </Form>
  );
}
