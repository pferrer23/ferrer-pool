'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectItem,
  Input,
  Button,
  Accordion,
  AccordionItem,
} from '@heroui/react';
import {
  SeasonPredictionsConfig,
  Driver,
  Team,
  UserPrediction,
} from '@/app/lib/definitions';
import { useSession } from 'next-auth/react';
import { saveUserPredictions } from '@/app/lib/actions';

interface SeasonPredictionsFormProps {
  predictions: SeasonPredictionsConfig[];
  drivers: Driver[];
  teams: Team[];
  userPredictions: UserPrediction[];
}

export default function SeasonPredictionsForm({
  predictions,
  drivers,
  teams,
  userPredictions,
}: SeasonPredictionsFormProps) {
  const session = useSession();
  const userId = session?.data?.user?.id;

  const [formData, setFormData] = useState<UserPrediction[]>(userPredictions);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
    saveUserPredictions(userId!, formData);
  };

  const handleChange = (
    prediction: SeasonPredictionsConfig,
    value: string | number
  ) => {
    const existingPrediction = formData.find(
      (p) => p.prediction_group_item_id === prediction.id
    );

    let updatedPrediction: UserPrediction;
    if (existingPrediction) {
      updatedPrediction = {
        ...existingPrediction,
        driver_id: prediction.selection_type.startsWith('DRIVER')
          ? Number(value)
          : null,
        team_id: prediction.selection_type.startsWith('TEAM')
          ? Number(value)
          : null,
        position:
          prediction.selection_type === 'POSITION' ? Number(value) : null,
        user_id: userId!,
        event_id: null,
        finished: false,
        points: 0,
        updated_at: null,
      };
    } else {
      updatedPrediction = {
        prediction_group_item_id: prediction.id,
        driver_id: prediction.selection_type.startsWith('DRIVER')
          ? Number(value)
          : null,
        team_id: prediction.selection_type.startsWith('TEAM')
          ? Number(value)
          : null,
        position:
          prediction.selection_type === 'POSITION' ? Number(value) : null,
        user_id: userId!,
        event_id: null,
        finished: false,
        points: 0,
        updated_at: null,
      };
    }

    setFormData((prev) => {
      if (existingPrediction) {
        return prev.map((p) =>
          p.prediction_group_item_id === prediction.id ? updatedPrediction : p
        );
      }
      return [...prev, updatedPrediction] as UserPrediction[];
    });
  };

  const renderField = (prediction: SeasonPredictionsConfig) => {
    switch (prediction.selection_type) {
      case 'DRIVER_UNIQUE':
      case 'DRIVER_MULTIPLE':
        return (
          <Select
            className='w-full'
            variant='bordered'
            size='sm'
            selectedKeys={[
              formData
                .find((p) => p.prediction_group_item_id === prediction.id)
                ?.driver_id?.toString() || '',
            ]}
            onChange={(e) => handleChange(prediction, e.target.value)}
          >
            {drivers.map((driver) => (
              <SelectItem key={driver.id}>{driver.full_name}</SelectItem>
            ))}
          </Select>
        );

      case 'TEAM_UNIQUE':
      case 'TEAM_MULTIPLE':
        return (
          <Select
            className='w-full'
            variant='bordered'
            size='sm'
            selectedKeys={[
              formData
                .find((p) => p.prediction_group_item_id === prediction.id)
                ?.team_id?.toString() || '',
            ]}
            onChange={(e) => handleChange(prediction, e.target.value)}
          >
            {teams.map((team) => (
              <SelectItem key={team.id}>{team.name}</SelectItem>
            ))}
          </Select>
        );

      case 'POSITION':
        return (
          <Input
            type='number'
            min={1}
            max={20}
            value={
              formData
                .find((p) => p.prediction_group_item_id === prediction.id)
                ?.position?.toString() || ''
            }
            onChange={(e) => handleChange(prediction, parseInt(e.target.value))}
            className='w-full'
            placeholder='Enter position'
            variant='bordered'
            size='sm'
          />
        );

      default:
        return null;
    }
  };

  return (
    <Accordion variant='splitted'>
      <AccordionItem aria-label={'season'} title={'Temporada'}>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {predictions.map((prediction) => (
            <div key={prediction.id} className='space-y-2'>
              <label className='block text-sm font-medium'>
                {prediction.prediction_name}
              </label>
              {renderField(prediction)}
            </div>
          ))}

          <Button type='submit' className='w-full'>
            Guardar Predicciones
          </Button>
        </form>
      </AccordionItem>
    </Accordion>
  );
}
