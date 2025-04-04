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
  Chip,
  addToast,
} from '@heroui/react';
import { saveUserPredictions } from '@/app/lib/actions';

interface EventPredictionsFormProps {
  predictions: EventsWithPredictionsConfig[];
  drivers: Driver[];
  teams: Team[];
  userPredictions: UserPrediction[];
}

export default function EventPredictionsForm({
  predictions,
  drivers,
  teams,
  userPredictions,
}: EventPredictionsFormProps) {
  const [formData, setFormData] = useState<UserPrediction[]>(userPredictions);
  const [isSaving, setIsSaving] = useState(false);
  const session = useSession();
  const userId = session?.data?.user?.id;

  const handleSubmit = async (event: EventsWithPredictionsConfig) => {
    // Handle form submission
    setIsSaving(true);
    const data_to_save = formData.filter((p) => p.event_id === event.id);
    console.log(data_to_save);
    const result = await saveUserPredictions(userId!, data_to_save);

    if (result.success) {
      addToast({
        title: 'Guardado Exitoso',
        description: 'Gracias por participar',
        color: 'success',
      });
    } else {
      addToast({
        title: 'Error Guardando',
        description: 'Por favor avisar',
        color: 'danger',
      });
    }
    setIsSaving(false);
  };

  const handleChange = (
    prediction: EventPredictionsConfig,
    eventId: number,
    value: string | number
  ) => {
    const existingPrediction = formData.find(
      (p) =>
        p.prediction_group_item_id === prediction.id && p.event_id === eventId
    );

    console.log(existingPrediction);

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

      setFormData((prev) => {
        return prev.map((p) =>
          p.prediction_group_item_id === prediction.id && p.event_id === eventId
            ? updatedPrediction
            : p
        );
      });
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

      setFormData((prev) => {
        return [...prev, updatedPrediction] as UserPrediction[];
      });
    }
  };

  const renderField = (
    prediction: EventPredictionsConfig,
    eventId: number,
    isEventEnabled: boolean
  ) => {
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
            isDisabled={!isEventEnabled}
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
            isDisabled={!isEventEnabled}
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
            isDisabled={!isEventEnabled}
          />
        );

      default:
        return null;
    }
  };

  const isEventEnabled = (event: EventsWithPredictionsConfig) => {
    if (event.quali_start_at) {
      return new Date(event.quali_start_at) > new Date();
    }
    return true;
  };

  return (
    <Accordion variant='splitted'>
      {predictions.map((event, index) => (
        <AccordionItem
          key={event.id}
          aria-label={event.name}
          title={
            <div className='flex justify-between items-center'>
              <Chip
                color={isEventEnabled(event) ? 'success' : 'danger'}
                size='sm'
              >
                {event.name}
              </Chip>
              {event.quali_start_at && (
                <span className='text-sm text-warning-500'>
                  {event.quali_start_at && (
                    <span className='ml-2 text-xs text-gray-500'>
                      Cierra: {new Date(event.quali_start_at).toLocaleString()}
                    </span>
                  )}
                </span>
              )}
              {!event.quali_start_at && <span>{event.name}</span>}
            </div>
          }
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(event);
            }}
            className='space-y-6'
          >
            {event.predictions_config.map((prediction) => (
              <div key={`${prediction.id}-${event.id}`} className='space-y-2'>
                <label className='block text-sm font-medium'>
                  {prediction.prediction_name}
                </label>
                {renderField(prediction, event.id, isEventEnabled(event))}
              </div>
            ))}

            <Button type='submit' className='w-full' isLoading={isSaving}>
              Guardar Predicciones
            </Button>
          </form>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
