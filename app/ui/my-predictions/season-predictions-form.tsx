'use client';

import { useState, useMemo } from 'react';
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

type PredictionGroup = {
  prediction_group_id: number;
  group_name: string;
  prediction_deadline: string;
  items: SeasonPredictionsConfig[];
};

export default function SeasonPredictionsForm({
  predictions,
  drivers,
  teams,
  userPredictions,
}: SeasonPredictionsFormProps) {
  const session = useSession();
  const userId = session?.data?.user?.id;

  const [formData, setFormData] = useState<UserPrediction[]>(userPredictions);

  const groups = useMemo(() => {
    const map = new Map<number, PredictionGroup>();
    for (const p of predictions) {
      if (!map.has(p.prediction_group_id)) {
        map.set(p.prediction_group_id, {
          prediction_group_id: p.prediction_group_id,
          group_name: p.group_name,
          prediction_deadline: p.prediction_deadline,
          items: [],
        });
      }
      map.get(p.prediction_group_id)!.items.push(p);
    }
    return Array.from(map.values());
  }, [predictions]);

  const isExpired = (deadline: string) => {
    if (!deadline) return false;
    return new Date() > new Date(deadline);
  };

  const formatDeadline = (deadline: string) => {
    if (!deadline) return '';
    return new Date(deadline).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSubmit = (groupItems: SeasonPredictionsConfig[]) => (e: React.FormEvent) => {
    e.preventDefault();
    const groupItemIds = new Set(groupItems.map((i) => i.id));
    const groupPredictions = formData.filter((p) =>
      groupItemIds.has(p.prediction_group_item_id)
    );
    saveUserPredictions(userId!, groupPredictions);
  };

  const handleChange = (
    prediction: SeasonPredictionsConfig,
    value: string | number
  ) => {
    const existingPrediction = formData.find(
      (p) => p.prediction_group_item_id === prediction.id
    );

    const updatedPrediction: UserPrediction = {
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

    setFormData((prev) => {
      if (existingPrediction) {
        return prev.map((p) =>
          p.prediction_group_item_id === prediction.id ? updatedPrediction : p
        );
      }
      return [...prev, updatedPrediction] as UserPrediction[];
    });
  };

  const renderField = (prediction: SeasonPredictionsConfig, disabled: boolean) => {
    switch (prediction.selection_type) {
      case 'DRIVER_UNIQUE':
      case 'DRIVER_MULTIPLE':
        return (
          <Select
            className='w-full'
            variant='bordered'
            size='sm'
            isDisabled={disabled}
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
            isDisabled={disabled}
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
            isDisabled={disabled}
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
      {groups.map((group) => {
        const expired = isExpired(group.prediction_deadline);
        return (
          <AccordionItem
            key={group.prediction_group_id}
            aria-label={group.group_name}
            title={group.group_name}
            subtitle={
              group.prediction_deadline
                ? expired
                  ? `Cerrado: ${formatDeadline(group.prediction_deadline)}`
                  : `Fecha limite: ${formatDeadline(group.prediction_deadline)}`
                : undefined
            }
          >
            <form onSubmit={handleSubmit(group.items)} className='space-y-6'>
              {group.items.map((prediction) => (
                <div key={prediction.id} className='space-y-2'>
                  <label className='block text-sm font-medium'>
                    {prediction.prediction_name}
                  </label>
                  {renderField(prediction, expired)}
                </div>
              ))}

              {!expired && (
                <Button type='submit' className='w-full'>
                  Guardar Predicciones
                </Button>
              )}
            </form>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
