'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Input,
  Button,
  Card,
  CardBody,
  Spinner,
} from '@heroui/react';
import PredictionPicker, {
  PickerOption,
} from '@/app/ui/my-predictions/prediction-picker';
import {
  EventPredictionsConfig,
  Driver,
  Team,
  EventsWithPredictionsConfig,
  EventResult,
} from '@/app/lib/definitions';
import {
  fetchNextEventPredictionsConfig,
  fetchDrivers,
  fetchTeams,
  fetchEventResults,
} from '@/app/lib/data';
import { saveEventResults, closeEvent } from '@/app/lib/actions';
import { CheckCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function EventResultsForm() {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<EventResult[]>([]);
  const [events, setEvents] = useState<EventsWithPredictionsConfig[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const fectchData = async () => {
      setLoading(true);
      const eventData = await fetchNextEventPredictionsConfig();
      const drivers = await fetchDrivers();
      const teams = await fetchTeams();
      const eventResults = await fetchEventResults();
      setEvents(eventData);
      setDrivers(drivers);
      setTeams(teams);
      setFormData(eventResults);
      setLoading(false);
    };
    fectchData();
  }, []);

  const driverOptions = useMemo<PickerOption[]>(
    () =>
      drivers.map((driver) => {
        const team = teams.find((t) => t.id === driver.team_id);
        return {
          key: driver.id.toString(),
          label: driver.name_acronym,
          sublabel: driver.full_name,
          imageUrl: driver.headshot_url,
          color: team?.colour,
        };
      }),
    [drivers, teams]
  );

  const teamOptions = useMemo<PickerOption[]>(
    () =>
      teams.map((team) => ({
        key: team.id.toString(),
        label: team.name,
        imageUrl: team.car_image,
        color: team.colour,
      })),
    [teams]
  );

  const handleSubmit = async (e: React.FormEvent, eventId: number) => {
    e.preventDefault();
    const eventResults = formData.filter(
      (result) => result.event_id === eventId
    );

    try {
      const result = await saveEventResults(eventResults);
      if (result?.message) {
        alert(result.message);
      } else {
        alert('Results saved and points calculated successfully');
      }
    } catch (error) {
      console.error('Error saving results:', error);
      alert('Error saving results');
    }
  };

  const handleCloseEvent = async (eventId: number) => {
    try {
      const result = await closeEvent(eventId);
      if (result?.message) {
        alert(result.message);
      } else {
        alert('Event closed successfully');
      }
    } catch (error) {
      console.error('Error closing event:', error);
      alert('Error closing event');
    }
  };

  const handleChange = (
    eventId: number,
    prediction: EventPredictionsConfig,
    value: string | number
  ) => {
    const existingPrediction = formData.find(
      (p) =>
        p.prediction_group_item_id === prediction.id && p.event_id === eventId
    );

    let updatedPrediction: EventResult;
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
      };
    } else {
      updatedPrediction = {
        event_id: eventId,
        prediction_group_item_id: prediction.id,
        driver_id: prediction.selection_type.startsWith('DRIVER')
          ? Number(value)
          : null,
        team_id: prediction.selection_type.startsWith('TEAM')
          ? Number(value)
          : null,
        position:
          prediction.selection_type === 'POSITION' ? Number(value) : null,
      };
    }

    setFormData((prev) => {
      if (existingPrediction) {
        return prev.map((p) =>
          p.prediction_group_item_id === prediction.id && p.event_id === eventId
            ? updatedPrediction
            : p
        );
      }
      return [...prev, updatedPrediction];
    });
  };

  const renderField = (eventId: number, prediction: EventPredictionsConfig) => {
    switch (prediction.selection_type) {
      case 'DRIVER_UNIQUE':
      case 'DRIVER_MULTIPLE':
        return (
          <PredictionPicker
            options={driverOptions}
            title={prediction.prediction_name}
            placeholder='Elegir piloto'
            searchOnDemand
            selectedKey={
              formData
                .find(
                  (p) =>
                    p.prediction_group_item_id === prediction.id &&
                    p.event_id === eventId
                )
                ?.driver_id?.toString() ?? null
            }
            onSelect={(key) => handleChange(eventId, prediction, key)}
          />
        );

      case 'TEAM_UNIQUE':
      case 'TEAM_MULTIPLE':
        return (
          <PredictionPicker
            options={teamOptions}
            title={prediction.prediction_name}
            placeholder='Elegir equipo'
            searchOnDemand
            selectedKey={
              formData
                .find(
                  (p) =>
                    p.prediction_group_item_id === prediction.id &&
                    p.event_id === eventId
                )
                ?.team_id?.toString() ?? null
            }
            onSelect={(key) => handleChange(eventId, prediction, key)}
          />
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
              handleChange(eventId, prediction, parseInt(e.target.value))
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

  if (loading) return <Spinner color='warning' label='Loading...' />;
  return (
    <div className='space-y-6'>
      {events.map((event) => (
        <Card key={event.id}>
          <CardBody>
            <h2 className='text-xl font-bold mb-4'>{event.name}</h2>
            <form
              onSubmit={(e) => handleSubmit(e, event.id)}
              className='space-y-6'
            >
              {event.predictions_config.map((prediction) => (
                <div key={prediction.id} className='space-y-2'>
                  <label className='block text-sm font-medium'>
                    {prediction.prediction_name}
                  </label>
                  {renderField(event.id, prediction)}
                </div>
              ))}

              <div className='flex gap-4'>
                <Button
                  type='submit'
                  className='flex-1'
                  startContent={<CheckCircleIcon className='w-5 h-5' />}
                >
                  Save Results
                </Button>
                <Button
                  color='warning'
                  className='flex-1'
                  onPress={() => handleCloseEvent(event.id)}
                  startContent={<LockClosedIcon className='w-5 h-5' />}
                >
                  Close Event
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
