'use client';

import { useState } from 'react';
import {
  Form,
  Input,
  Select,
  SelectItem,
  Button,
  DatePicker,
} from '@heroui/react';
import { CalendarIcon, CheckIcon } from '@heroicons/react/24/outline';
import { DateValue } from '@internationalized/date';
import { createPredictionGroup } from '@/app/lib/actions';
import { PredictionGroup } from '@/app/lib/definitions';

export default function NewGroupForm({
  onClose,
  refreshConfig,
}: {
  onClose: () => void;
  refreshConfig: () => Promise<void>;
}) {
  const [groupName, setGroupName] = useState<string>('');
  const [groupType, setGroupType] = useState<'SEASON' | 'RACE'>('RACE');
  const [deadline, setDeadline] = useState<DateValue | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const group: PredictionGroup = {
      name: groupName,
      group_type: groupType,
      prediction_deadline: deadline || null,
    };
    await createPredictionGroup(group);
    refreshConfig();
    onClose();
  };
  return (
    <Form
      className='w-full flex flex-col gap-4'
      onReset={onClose}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}
    >
      <Select
        isRequired
        label='Group Type'
        labelPlacement='outside'
        variant='bordered'
        selectedKeys={[groupType]}
        onChange={(e) => setGroupType(e.target.value as 'SEASON' | 'RACE')}
        errorMessage='Please select a group type'
      >
        <SelectItem key='RACE'>Race</SelectItem>
        <SelectItem key='SEASON'>Season</SelectItem>
      </Select>

      <Input
        isRequired
        type='text'
        label='Group Name'
        name='name'
        placeholder='Enter group name'
        variant='bordered'
        labelPlacement='outside'
        errorMessage='Please enter a group name'
        onChange={(e) => setGroupName(e.target.value)}
      />

      <DatePicker
        label='Prediction Deadline'
        labelPlacement='outside'
        value={deadline}
        onChange={setDeadline}
        variant='bordered'
        errorMessage='Please select a deadline'
      />
      <div className='flex gap-4 justify-end w-full pb-4'>
        <Button
          type='submit'
          color='primary'
          startContent={<CheckIcon className='h-5 w-5' />}
        >
          Save Group
        </Button>
        <Button type='reset' variant='flat'>
          Cancelar
        </Button>
      </div>
    </Form>
  );
}
