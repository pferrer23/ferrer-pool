'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectItem,
  Input,
  Button,
  Card,
  CardBody,
  Spinner,
} from '@heroui/react';
import {
  SeasonPredictionsConfig,
  Driver,
  Team,
  Event,
  SeasonResult,
} from '@/app/lib/definitions';
import {
  fetchSeasonPredictionsConfig,
  fetchDrivers,
  fetchTeams,
  fetchSeasonResults,
} from '@/app/lib/data';
import { saveSeasonResults } from '@/app/lib/actions';
import { CheckCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function SeasonResultsForm() {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<SeasonResult[]>([]);
  const [seasonPredictionsConfig, setSeasonPredictionsConfig] = useState<
    SeasonPredictionsConfig[]
  >([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const seasonPredictionsConfig = await fetchSeasonPredictionsConfig();
      const drivers = await fetchDrivers();
      const teams = await fetchTeams();
      const seasonResults = await fetchSeasonResults();

      setDrivers(drivers);
      setTeams(teams);
      setSeasonPredictionsConfig(seasonPredictionsConfig);
      setFormData(seasonResults);
      setLoading(false);
    };
    getData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSeasonResults(formData);
  };

  const handleCloseSeason = async () => {
    console.log('close season');
  };

  const handleChange = (
    prediction: SeasonPredictionsConfig,
    value: string | number
  ) => {
    const existingPrediction = formData.find(
      (p) => p.prediction_group_item_id === prediction.id
    );

    let updatedPrediction: SeasonResult;
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
          p.prediction_group_item_id === prediction.id ? updatedPrediction : p
        );
      }
      return [...prev, updatedPrediction] as SeasonResult[];
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

  if (loading) return <Spinner color='warning' label='Loading...' />;
  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {seasonPredictionsConfig.map((prediction) => (
            <div key={prediction.id} className='space-y-2'>
              <label className='block text-sm font-medium'>
                {prediction.prediction_name}
              </label>
              {renderField(prediction)}
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
              onPress={handleCloseSeason}
              startContent={<LockClosedIcon className='w-5 h-5' />}
            >
              Close Season
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
