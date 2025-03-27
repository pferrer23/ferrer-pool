'use client';

import { useState, useEffect } from 'react';
import {
  EventsWithPredictionsConfig,
  EventPredictionsConfig,
  Driver,
  Team,
  UserPrediction,
} from '@/app/lib/definitions';
import { useSession } from 'next-auth/react';
import {
  Accordion,
  AccordionItem,
  Select,
  SelectItem,
  Input,
  Button,
} from '@heroui/react';
// import { saveEventUserPredictions } from '@/app/lib/actions';

interface EventPredictionsFormProps {
  predictions: EventsWithPredictionsConfig[];
  drivers: Driver[];
  teams: Team[];
}

export default function EventPredictionsForm({
  predictions,
  drivers,
  teams,
}: EventPredictionsFormProps) {
  const [formData, setFormData] = useState<UserPrediction[]>([]);
  const session = useSession();
  const userId = session?.data?.user?.id;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
    // saveSeasonUserPredictions(userId!, formData);
  };

  const handleChange = (
    prediction: EventPredictionsConfig,
    eventId: number,
    value: string | number
  ) => {
    const existingPrediction = formData.find(
      (p) => p.prediction_group_item_id === prediction.id
    );

    let updatedPrediction: UserPrediction;
    if (existingPrediction) {
      updatedPrediction = {
        ...existingPrediction,
        event_id: eventId,
        driver_id: prediction.selection_type.startsWith('DRIVER')
          ? Number(value)
          : null,
        team_id: prediction.selection_type.startsWith('TEAM')
          ? Number(value)
          : null,
        position:
          prediction.selection_type === 'POSITION' ? Number(value) : null,
        user_id: userId!,
        finished: false,
        points: 0,
        updated_at: null,
      };
    } else {
      updatedPrediction = {
        prediction_group_item_id: prediction.id,
        event_id: eventId,
        driver_id: prediction.selection_type.startsWith('DRIVER')
          ? Number(value)
          : null,
        team_id: prediction.selection_type.startsWith('TEAM')
          ? Number(value)
          : null,
        position:
          prediction.selection_type === 'POSITION' ? Number(value) : null,
        user_id: userId!,
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

  const renderField = (prediction: EventPredictionsConfig, eventId: number) => {
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
                .find(
                  (p) =>
                    p.prediction_group_item_id === prediction.id &&
                    p.event_id === eventId
                )
                ?.driver_id?.toString() || '',
            ]}
            onChange={(e) => handleChange(prediction, eventId, e.target.value)}
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
                .find(
                  (p) =>
                    p.prediction_group_item_id === prediction.id &&
                    p.event_id === eventId
                )
                ?.team_id?.toString() || '',
            ]}
            onChange={(e) => handleChange(prediction, eventId, e.target.value)}
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
                .find(
                  (p) =>
                    p.prediction_group_item_id === prediction.id &&
                    p.event_id === eventId
                )
                ?.position?.toString() || ''
            }
            onChange={(e) =>
              handleChange(prediction, eventId, parseInt(e.target.value))
            }
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
      {predictions.map((event) => (
        <AccordionItem
          key={event.id}
          aria-label={event.name}
          title={event.name}
        >
          <form onSubmit={handleSubmit} className='space-y-6'>
            {event.predictions_config.map((prediction) => (
              <div key={`${prediction.id}-${event.id}`} className='space-y-2'>
                <label className='block text-sm font-medium'>
                  {prediction.prediction_name}
                </label>
                {renderField(prediction, event.id)}
              </div>
            ))}

            <Button type='submit' className='w-full'>
              Save Predictions
            </Button>
          </form>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
