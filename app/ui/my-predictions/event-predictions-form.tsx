'use client';

import { useState } from 'react';
import {
  EventsWithPredictionsConfig,
  EventPredictionsConfig,
  Driver,
  Team,
  UserPrediction,
  PredictionTemplate,
} from '@/app/lib/definitions';
import { useSession } from 'next-auth/react';
import {
  Accordion,
  AccordionItem,
  Autocomplete,
  AutocompleteItem,
  Input,
  Button,
  Chip,
  addToast,
} from '@heroui/react';
import {
  saveUserPredictions,
  saveUserPredictionsAndTemplate,
} from '@/app/lib/actions';

interface EventPredictionsFormProps {
  predictions: EventsWithPredictionsConfig[];
  drivers: Driver[];
  teams: Team[];
  userPredictions: UserPrediction[];
  templatePredictions: PredictionTemplate[];
  hasTemplate: boolean;
}

export default function EventPredictionsForm({
  predictions,
  drivers,
  teams,
  userPredictions,
  templatePredictions,
  hasTemplate,
}: EventPredictionsFormProps) {
  const [formData, setFormData] = useState<UserPrediction[]>(userPredictions);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [localHasTemplate, setLocalHasTemplate] = useState(hasTemplate);
  const session = useSession();
  const userId = session?.data?.user?.id;

  const handleSubmit = async (event: EventsWithPredictionsConfig) => {
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

  const handleSubmitAndSaveTemplate = async (
    event: EventsWithPredictionsConfig
  ) => {
    setIsSavingTemplate(true);
    const data_to_save = formData.filter((p) => p.event_id === event.id);
    const result = await saveUserPredictionsAndTemplate(userId!, data_to_save);

    if (result.success) {
      setLocalHasTemplate(true);
      addToast({
        title: 'Guardado y Plantilla Actualizada',
        description: 'Predicciones guardadas y plantilla actualizada',
        color: 'success',
      });
    } else {
      addToast({
        title: 'Error Guardando',
        description: 'Por favor avisar',
        color: 'danger',
      });
    }
    setIsSavingTemplate(false);
  };

  const handleLoadTemplate = (eventId: number) => {
    setFormData((prev) => {
      const updated = [...prev];

      templatePredictions.forEach((tmpl) => {
        const existingIndex = updated.findIndex(
          (p) =>
            p.prediction_group_item_id === tmpl.prediction_group_item_id &&
            p.event_id === eventId
        );

        const newEntry: UserPrediction = {
          prediction_group_item_id: tmpl.prediction_group_item_id,
          event_id: eventId,
          driver_id: tmpl.driver_id,
          team_id: tmpl.team_id,
          position: tmpl.position,
          user_id: userId!,
          finished: false,
          points: 0,
          updated_at: null,
        };

        if (existingIndex !== -1) {
          updated[existingIndex] = { ...updated[existingIndex], ...newEntry };
        } else {
          updated.push(newEntry);
        }
      });

      return updated;
    });

    addToast({
      title: 'Plantilla Cargada',
      description: 'Los valores de tu plantilla fueron cargados. Guardá para confirmar.',
      color: 'primary',
    });
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
          <Autocomplete
            className='w-full'
            variant='bordered'
            size='sm'
            selectedKey={
              formData
                .find(
                  (p) =>
                    p.prediction_group_item_id === prediction.id &&
                    p.event_id === eventId
                )
                ?.driver_id?.toString() ?? null
            }
            onSelectionChange={(key) =>
              key && handleChange(prediction, eventId, key)
            }
            isDisabled={!isEventEnabled}
          >
            {drivers.map((driver) => (
              <AutocompleteItem key={driver.id}>
                {driver.full_name}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        );

      case 'TEAM_UNIQUE':
      case 'TEAM_MULTIPLE':
        return (
          <Autocomplete
            className='w-full'
            variant='bordered'
            size='sm'
            selectedKey={
              formData
                .find(
                  (p) =>
                    p.prediction_group_item_id === prediction.id &&
                    p.event_id === eventId
                )
                ?.team_id?.toString() ?? null
            }
            onSelectionChange={(key) =>
              key && handleChange(prediction, eventId, key)
            }
            isDisabled={!isEventEnabled}
          >
            {teams.map((team) => (
              <AutocompleteItem key={team.id}>{team.name}</AutocompleteItem>
            ))}
          </Autocomplete>
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

  const nextEventId = predictions.find((e) => isEventEnabled(e))?.id ?? null;

  return (
    <Accordion variant='splitted'>
      {predictions.map((event) => (
        <AccordionItem
          key={event.id}
          aria-label={event.name}
          title={
            <div className='flex justify-between items-center'>
              <div className='flex items-center gap-2'>
                <Chip
                  color={isEventEnabled(event) ? 'success' : 'danger'}
                  size='sm'
                >
                  {event.name}
                </Chip>
                {event.has_sprint_race && (
                  <Chip color='warning' size='sm' variant='flat'>
                    Sprint
                  </Chip>
                )}
              </div>
              {event.quali_start_at && (
                <span className='ml-2 text-xs text-gray-500'>
                  Cierra: {new Date(event.quali_start_at).toLocaleString()}
                </span>
              )}
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
            {localHasTemplate && event.id === nextEventId && (
              <Button
                type='button'
                color='warning'
                className='w-full'
                onPress={() => handleLoadTemplate(event.id)}
              >
                Cargar plantilla
              </Button>
            )}
            {Object.entries(
              event.predictions_config.reduce<
                Record<string, EventPredictionsConfig[]>
              >((groups, prediction) => {
                const key = prediction.group_name;
                if (!groups[key]) groups[key] = [];
                groups[key].push(prediction);
                return groups;
              }, {})
            ).map(([groupName, items]) => (
              <div key={`${groupName}-${event.id}`} className='space-y-3'>
                <p className='text-xs font-semibold uppercase tracking-wider text-gray-400'>
                  {groupName}
                </p>
                <div className='space-y-3'>
                  {items.map((prediction) => (
                    <div
                      key={`${prediction.id}-${event.id}`}
                      className='space-y-1'
                    >
                      <label className='block text-sm font-medium'>
                        {prediction.prediction_name}
                      </label>
                      {renderField(prediction, event.id, isEventEnabled(event))}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className='flex gap-2'>
              <Button type='submit' className='flex-1' isLoading={isSaving}>
                Guardar Predicciones
              </Button>
              <Button
                type='button'
                className='flex-1'
                color='secondary'
                isLoading={isSavingTemplate}
                onPress={() => handleSubmitAndSaveTemplate(event)}
              >
                Guardar y Actualizar Plantilla
              </Button>
            </div>
          </form>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
