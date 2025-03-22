'use client';

import { useState } from 'react';
import { Select, SelectItem, Input, Button } from '@heroui/react';
import { SeasonPredictionsConfig, Driver, Team } from '@/app/lib/definitions';

interface SeasonPredictionsFormProps {
  predictions: SeasonPredictionsConfig[];
  drivers: Driver[];
  teams: Team[];
}

export default function SeasonPredictionsForm({
  predictions,
  drivers,
  teams,
}: SeasonPredictionsFormProps) {
  const [formData, setFormData] = useState<{ [key: number]: string | number }>(
    {}
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  const handleChange = (predictionId: number, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [predictionId]: value,
    }));
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
            value={formData[prediction.id]?.toString()}
            onChange={(e) => handleChange(prediction.id, e.target.value)}
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
            value={formData[prediction.id]?.toString()}
            onChange={(e) => handleChange(prediction.id, e.target.value)}
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
            value={formData[prediction.id]?.toString() || ''}
            onChange={(e) =>
              handleChange(prediction.id, parseInt(e.target.value))
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
        Save Predictions
      </Button>
    </form>
  );
}
