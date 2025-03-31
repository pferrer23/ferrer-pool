'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectItem,
  Input,
  Button,
  Spinner,
  Accordion,
  AccordionItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Chip,
  useDisclosure,
} from '@heroui/react';
import {
  PointsDefinition,
  PredictionGroupConfig,
  PredictionGroupItem,
} from '@/app/lib/definitions';
import { fetchPredictionGroupConfigs } from '@/app/lib/data';
import {
  PlusCircleIcon,
  UserGroupIcon,
  ListBulletIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import NewGroupForm from './new-group-form';
import {
  updatePointsDefinitions,
  updatePredictionGroupItems,
} from '@/app/lib/actions';
import NewGroupItemForm from '@/app/ui/admin/new-group-item-form';
import PointsForm from '@/app/ui/admin/points-form';

export default function PointingsConfigForm() {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<PredictionGroupConfig[] | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenItem,
    onOpen: onOpenItem,
    onOpenChange: onOpenItemChange,
  } = useDisclosure();
  const {
    isOpen: isOpenPoints,
    onOpen: onOpenPoints,
    onOpenChange: onOpenPointsChange,
  } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchPredictionGroupConfigs();
      setConfig(data as PredictionGroupConfig[]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const refreshConfig = async () => {
    setLoading(true);
    const data = await fetchPredictionGroupConfigs();
    setConfig(data as PredictionGroupConfig[]);
    setLoading(false);
  };
  const handleItemTypeChange = (
    configId: number,
    itemId: number,
    value:
      | 'DRIVER_UNIQUE'
      | 'TEAM_UNIQUE'
      | 'DRIVER_MULTIPLE'
      | 'TEAM_MULTIPLE'
      | 'POSITION'
  ) => {
    if (!config) return;
    setConfig(
      config.map((conf) =>
        conf.id === configId
          ? {
              ...conf,
              items: conf.items.map((item) =>
                item.id === itemId ? { ...item, selection_type: value } : item
              ),
            }
          : conf
      )
    );
  };

  const handlePointTypeChange = (
    configId: number,
    pointId: number,
    value: 'EXACT' | 'ANY_IN_ITEMS' | 'RESULTS_INCLUDES'
  ) => {
    if (!config) return;
    setConfig(
      config.map((conf) =>
        conf.id === configId
          ? {
              ...conf,
              points: conf.points.map((point) =>
                point.id === pointId ? { ...point, type: value } : point
              ),
            }
          : conf
      )
    );
  };

  const handlePointValueChange = (
    configId: number,
    pointId: number,
    value: string
  ) => {
    if (!config) return;

    setConfig(
      config.map((conf) =>
        conf.id === configId
          ? {
              ...conf,
              points: conf.points.map((point) =>
                point.id === pointId
                  ? { ...point, points: parseInt(value) }
                  : point
              ),
            }
          : conf
      )
    );
  };

  const handleItemNameChange = (
    configItem: PredictionGroupItem,
    value: string
  ) => {
    if (!config) return;

    setConfig(
      config.map((conf) =>
        conf.id === configItem.prediction_group_id
          ? {
              ...conf,
              items: conf.items.map((item) =>
                item.id === configItem.id ? { ...item, name: value } : item
              ),
            }
          : conf
      )
    );
  };

  const handleSaveItems = (configItems: PredictionGroupItem[]) => {
    updatePredictionGroupItems(configItems);
  };

  const handleSavePoints = (pointsDefinitions: PointsDefinition[]) => {
    updatePointsDefinitions(pointsDefinitions);
  };

  if (loading) return <Spinner color='warning' label='Loading...' />;

  return (
    <div className='space-y-6'>
      <div className='flex gap-4'>
        <Button
          color='primary'
          startContent={<UserGroupIcon className='h-5 w-5' />}
          onPress={onOpen}
        >
          Add Group
        </Button>
        <Button
          color='secondary'
          startContent={<ListBulletIcon className='h-5 w-5' />}
          onPress={onOpenItem}
        >
          Add Item
        </Button>
        <Button
          color='success'
          startContent={<StarIcon className='h-5 w-5' />}
          onPress={onOpenPoints}
        >
          Add Points
        </Button>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Add New Group
              </ModalHeader>
              <ModalBody>
                <NewGroupForm onClose={onClose} refreshConfig={refreshConfig} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenItem} onOpenChange={onOpenItemChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Add New Group Item
              </ModalHeader>
              <ModalBody>
                <NewGroupItemForm
                  onClose={onClose}
                  refreshConfig={refreshConfig}
                  predictionGroups={config || []}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenPoints} onOpenChange={onOpenPointsChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Add New Points deifnition
              </ModalHeader>
              <ModalBody>
                <PointsForm
                  onClose={onClose}
                  refreshConfig={refreshConfig}
                  predictionGroups={config || []}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      {config && (
        <Accordion variant='splitted'>
          {config?.map((configItem) => (
            <AccordionItem
              key={configItem.id}
              aria-label={configItem.name}
              title={
                <div className='flex justify-between items-center w-full'>
                  <span>{configItem.name}</span>
                  <Chip
                    color={
                      configItem.group_type === 'RACE' ? 'success' : 'primary'
                    }
                  >
                    {configItem.group_type}
                  </Chip>
                </div>
              }
            >
              <div className='grid grid-cols-2 gap-8'>
                {/* Left Column - Items */}
                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold'>Items Configuration</h3>
                  <form
                    className='space-y-4'
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveItems(configItem.items);
                    }}
                  >
                    {configItem.items.map((item) => (
                      <div key={item.id} className='space-y-2'>
                        <div className='flex gap-4'>
                          <Input
                            type='text'
                            className='flex-1'
                            size='sm'
                            variant='bordered'
                            value={item.name}
                            onChange={(e) =>
                              handleItemNameChange(item, e.target.value)
                            }
                          />
                          <Select
                            className='flex-1'
                            variant='bordered'
                            size='sm'
                            selectedKeys={[item.selection_type]}
                            onChange={(e) =>
                              handleItemTypeChange(
                                configItem.id || 0,
                                item.id,
                                e.target.value as
                                  | 'DRIVER_UNIQUE'
                                  | 'TEAM_UNIQUE'
                                  | 'DRIVER_MULTIPLE'
                                  | 'TEAM_MULTIPLE'
                                  | 'POSITION'
                              )
                            }
                          >
                            <SelectItem key='DRIVER_UNIQUE'>
                              Driver (Unique)
                            </SelectItem>
                            <SelectItem key='TEAM_UNIQUE'>
                              Team (Unique)
                            </SelectItem>
                            <SelectItem key='DRIVER_MULTIPLE'>
                              Driver (Multiple)
                            </SelectItem>
                            <SelectItem key='TEAM_MULTIPLE'>
                              Team (Multiple)
                            </SelectItem>
                            <SelectItem key='POSITION'>Position</SelectItem>
                          </Select>
                        </div>
                      </div>
                    ))}

                    {/* <div className='space-y-2'>
                      <div className='flex gap-4'>
                        <Input
                          type='text'
                          className='flex-1'
                          size='sm'
                          variant='bordered'
                          placeholder='Enter item name'
                        />
                        <Select
                          className='flex-1'
                          variant='bordered'
                          size='sm'
                          placeholder='Select new item type'
                        >
                          <SelectItem key='DRIVER_UNIQUE'>
                            Driver (Unique)
                          </SelectItem>
                          <SelectItem key='TEAM_UNIQUE'>
                            Team (Unique)
                          </SelectItem>
                          <SelectItem key='DRIVER_MULTIPLE'>
                            Driver (Multiple)
                          </SelectItem>
                          <SelectItem key='TEAM_MULTIPLE'>
                            Team (Multiple)
                          </SelectItem>
                          <SelectItem key='POSITION'>Position</SelectItem>
                        </Select>
                      </div>
                      <Button size='sm' className='w-full'>
                        Add New Item
                      </Button>
                    </div> */}

                    <Button type='submit' color='primary' className='w-full'>
                      Save Items Configuration
                    </Button>
                  </form>
                </div>

                {/* Right Column - Points */}
                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold'>
                    Points Configuration
                  </h3>
                  <form
                    className='space-y-4'
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSavePoints(configItem.points);
                    }}
                  >
                    {configItem.points.map((point) => (
                      <div key={point.id} className='flex gap-4 items-end'>
                        <div className='flex-1 space-y-2'>
                          <Select
                            className='w-full'
                            variant='bordered'
                            size='sm'
                            selectedKeys={[point.type]}
                            onChange={(e) =>
                              handlePointTypeChange(
                                configItem.id || 0,
                                point.id,
                                e.target.value as
                                  | 'EXACT'
                                  | 'ANY_IN_ITEMS'
                                  | 'RESULTS_INCLUDES'
                              )
                            }
                          >
                            <SelectItem key='EXACT'>Exact Match</SelectItem>
                            <SelectItem key='ANY_IN_ITEMS'>
                              Any in items
                            </SelectItem>
                            <SelectItem key='RESULTS_INCLUDES'>
                              Results includes
                            </SelectItem>
                          </Select>
                        </div>
                        <div className='flex-1 space-y-2'>
                          <Input
                            type='number'
                            value={point.points.toString()}
                            onChange={(e) =>
                              handlePointValueChange(
                                configItem.id || 0,
                                point.id,
                                e.target.value
                              )
                            }
                            className='w-full'
                            placeholder='Enter points'
                            variant='bordered'
                            size='sm'
                          />
                        </div>
                      </div>
                    ))}

                    {/* <div className='flex gap-4 items-end'>
                      <div className='flex-1'>
                        <Select
                          className='w-full'
                          variant='bordered'
                          size='sm'
                          placeholder='Select point type'
                        >
                          <SelectItem key='EXACT'>Exact Match</SelectItem>
                          <SelectItem key='ANY_IN_ITEMS'>
                            Any in items
                          </SelectItem>
                          <SelectItem key='RESULTS_INCLUDES'>
                            Results includes
                          </SelectItem>
                        </Select>
                      </div>
                      <div className='flex-1'>
                        <Input
                          type='number'
                          className='w-full'
                          placeholder='Enter points'
                          variant='bordered'
                          size='sm'
                        />
                      </div>
                    </div>
                    <Button size='sm' className='w-full'>
                      Add New Points Rule
                    </Button> */}

                    <Button type='submit' color='primary' className='w-full'>
                      Save Points Configuration
                    </Button>
                  </form>
                </div>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
