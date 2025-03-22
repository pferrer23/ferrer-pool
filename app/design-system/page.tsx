'use client';
import React from 'react';
import {
  Button,
  Autocomplete,
  AutocompleteItem,
  Checkbox,
  DatePicker,
  DateRangePicker,
  Input,
  Select,
  SelectItem,
  Chip,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableColumn,
  TableCell,
} from '@heroui/react';

export default function DesignSystem() {
  const colors = [
    {
      name: 'Primary',
      shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
      baseClass: 'bg-primary',
    },
    {
      name: 'Gray',
      shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
      baseClass: 'bg-gray',
    },
    {
      name: 'Red',
      shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
      baseClass: 'bg-red',
    },
    {
      name: 'Orange',
      shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
      baseClass: 'bg-orange',
    },
    {
      name: 'Yellow',
      shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
      baseClass: 'bg-yellow',
    },
    {
      name: 'Green',
      shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
      baseClass: 'bg-green',
    },
    {
      name: 'Teal',
      shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
      baseClass: 'bg-teal',
    },
    {
      name: 'Indigo',
      shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
      baseClass: 'bg-indigo',
    },
    {
      name: 'Purple',
      shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
      baseClass: 'bg-purple',
    },
    {
      name: 'Pink',
      shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
      baseClass: 'bg-pink',
    },
  ];

  const tableClassNames = React.useMemo(
    () => ({
      th: ['bg-primary-100', 'text-default-500'],
    }),
    []
  );
  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-4xl font-bold text-gray-900 mb-12'>
          Design System
        </h1>

        {/* Colors */}
        <section className='mb-16'>
          <h2 className='text-2xl font-semibold text-gray-900 mb-6'>Colors</h2>
          <div className='grid grid-cols-5 gap-6'>
            {colors.map((color) => (
              <div key={color.name}>
                <div className='font-medium text-sm text-gray-700 mb-2'>
                  {color.name}
                </div>
                <div className='flex flex-row flex-wrap gap-2'>
                  {color.shades.map((shade) => (
                    <div
                      key={`${color.name}-${shade}`}
                      className={`w-8 h-8 rounded-md ${color.baseClass}-${shade}`}
                      title={`${shade}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Buttons */}
        <section className='mb-16'>
          <h2 className='text-2xl font-semibold text-gray-900 mb-6'>Buttons</h2>
          <div className='space-y-4'>
            <div className='flex flex-wrap gap-4'>
              <Button color='primary'>Primary</Button>
              <Button color='secondary'>Secondary</Button>
              <Button color='success'>Success</Button>
              <Button color='warning'>Warning</Button>
              <Button color='danger'>Danger</Button>
            </div>
            <div className='flex flex-wrap gap-4'>
              <Button variant='solid'>Solid</Button>
              <Button variant='bordered'>Bordered</Button>
              <Button variant='light'>Light</Button>
              <Button variant='flat'>Flat</Button>
              <Button variant='ghost'>Ghost</Button>
            </div>
            <div className='flex flex-wrap gap-4'>
              <Button size='lg'>Large</Button>
              <Button size='md'>Medium</Button>
              <Button size='sm'>Small</Button>
            </div>
          </div>
        </section>

        {/* Inputs */}
        <section className='mb-16'>
          <h2 className='text-2xl font-semibold text-gray-900 mb-6'>Inputs</h2>
          <div className='flex gap-4'>
            <Checkbox defaultSelected color='default'>
              Default
            </Checkbox>
            <Checkbox defaultSelected color='primary'>
              Primary
            </Checkbox>
            <Checkbox defaultSelected color='secondary'>
              Secondary
            </Checkbox>
            <Checkbox defaultSelected color='success'>
              Success
            </Checkbox>
            <Checkbox defaultSelected color='warning'>
              Warning
            </Checkbox>
            <Checkbox defaultSelected color='danger'>
              Danger
            </Checkbox>
          </div>
          <div className='pt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='flex gap-4'>
              <Input
                className='max-w-xs'
                label='Input'
                placeholder='Type...'
                variant='bordered'
                labelPlacement='outside'
              />
            </div>
            <div className='flex gap-4'>
              <Autocomplete
                className='max-w-xs'
                label='Autocomplete'
                placeholder='Type to search...'
                variant='bordered'
                labelPlacement='outside'
              >
                {['Option 1', 'Option 2', 'Option 3'].map((item) => (
                  <AutocompleteItem key={item} textValue={item}>
                    {item}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
            <div className='flex gap-4'>
              <Select
                className='max-w-xs'
                label='Select'
                placeholder='Select an option'
                variant='bordered'
                labelPlacement='outside'
              >
                {['Option 1', 'Option 2', 'Option 3'].map((item) => (
                  <SelectItem key={item} textValue={item}>
                    {item}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className='flex gap-4'>
              <Select
                className='max-w-xs'
                isMultiline={true}
                label='Multi Select'
                placeholder='Select options'
                variant='bordered'
                labelPlacement='outside'
                selectionMode='multiple'
                items={[
                  { key: 'Option 1', value: 'Option 1' },
                  { key: 'Option 2', value: 'Option 2' },
                  { key: 'Option 3', value: 'Option 3' },
                ]}
                renderValue={(items) => {
                  return (
                    <div className='flex flex-wrap gap-2'>
                      {items.map((item) => (
                        <Chip key={item.key} radius='sm'>
                          {item.data?.value}
                        </Chip>
                      ))}
                    </div>
                  );
                }}
              >
                {(item) => (
                  <SelectItem key={item.key} textValue={item.value}>
                    {item.value}
                  </SelectItem>
                )}
              </Select>
            </div>

            <div className='flex gap-4'>
              <DatePicker
                className='max-w-xs'
                label='Date Picker'
                variant='bordered'
                labelPlacement='outside'
              />
            </div>
            <div className='flex gap-4'>
              <DateRangePicker
                className='max-w-xs'
                label='Date Range Picker'
                variant='bordered'
                labelPlacement='outside'
              />
            </div>
          </div>
        </section>

        {/* Table */}
        <section className='mb-16'>
          <h2 className='text-2xl font-semibold text-gray-900 mb-6'>Table</h2>
          <div className='overflow-x-auto'>
            <Table
              aria-label='Example static collection table'
              classNames={tableClassNames}
            >
              <TableHeader className='bg-blue-100'>
                <TableColumn>NAME</TableColumn>
                <TableColumn>ROLE</TableColumn>
                <TableColumn>STATUS</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow key='1'>
                  <TableCell>Tony Reichert</TableCell>
                  <TableCell>CEO</TableCell>
                  <TableCell>Active</TableCell>
                </TableRow>
                <TableRow key='2'>
                  <TableCell>Zoey Lang</TableCell>
                  <TableCell>Technical Lead</TableCell>
                  <TableCell>Paused</TableCell>
                </TableRow>
                <TableRow key='3'>
                  <TableCell>Jane Fisher</TableCell>
                  <TableCell>Senior Developer</TableCell>
                  <TableCell>Active</TableCell>
                </TableRow>
                <TableRow key='4'>
                  <TableCell>William Howard</TableCell>
                  <TableCell>Community Manager</TableCell>
                  <TableCell>Vacation</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </div>
  );
}
