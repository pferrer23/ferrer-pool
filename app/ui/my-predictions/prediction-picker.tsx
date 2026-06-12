'use client';

import { useMemo, useState } from 'react';
import {
  Avatar,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from '@heroui/react';

export type PickerOption = {
  key: string;
  label: string;
  sublabel?: string;
  imageUrl?: string;
  color?: string; // hex without leading '#'
};

interface PredictionPickerProps {
  options: PickerOption[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
  isDisabled?: boolean;
  placeholder?: string;
  title?: string;
}

export default function PredictionPicker({
  options,
  selectedKey,
  onSelect,
  isDisabled = false,
  placeholder = 'Seleccionar',
  title = 'Seleccionar',
}: PredictionPickerProps) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [query, setQuery] = useState('');

  const selected = useMemo(
    () => options.find((o) => o.key === selectedKey) ?? null,
    [options, selectedKey]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.sublabel?.toLowerCase().includes(q) ?? false)
    );
  }, [options, query]);

  const handleOpen = () => {
    if (isDisabled) return;
    setQuery('');
    onOpen();
  };

  const handlePick = (key: string) => {
    onSelect(key);
    onClose();
  };

  return (
    <>
      <button
        type='button'
        onClick={handleOpen}
        disabled={isDisabled}
        className={`flex w-full items-center gap-3 rounded-medium border-2 border-default-200 bg-default-50 px-3 py-2 text-left transition ${
          isDisabled
            ? 'cursor-not-allowed opacity-50'
            : 'hover:border-default-400 active:scale-[0.99]'
        }`}
      >
        {selected ? (
          <>
            <div
              className='shrink-0 rounded-full p-[2px]'
              style={
                selected.color
                  ? { boxShadow: `0 0 0 2px #${selected.color}` }
                  : undefined
              }
            >
              <Avatar
                src={selected.imageUrl}
                name={selected.label}
                size='sm'
                className='bg-default-200'
              />
            </div>
            <div className='flex min-w-0 flex-col'>
              <span className='truncate text-sm font-semibold text-gray-100'>
                {selected.label}
              </span>
              {selected.sublabel && (
                <span className='truncate text-xs text-gray-400'>
                  {selected.sublabel}
                </span>
              )}
            </div>
          </>
        ) : (
          <span className='text-sm text-gray-500'>{placeholder}</span>
        )}
        <svg
          className='ml-auto h-4 w-4 shrink-0 text-gray-500'
          viewBox='0 0 20 20'
          fill='currentColor'
          aria-hidden='true'
        >
          <path
            fillRule='evenodd'
            d='M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'
            clipRule='evenodd'
          />
        </svg>
      </button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement='center'
        scrollBehavior='inside'
        size='lg'
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className='flex flex-col gap-3'>
                <span>{title}</span>
                <Input
                  autoFocus
                  variant='bordered'
                  size='sm'
                  placeholder='Buscar por nombre...'
                  value={query}
                  onValueChange={setQuery}
                  isClearable
                  onClear={() => setQuery('')}
                />
              </ModalHeader>
              <ModalBody className='pb-6'>
                {filtered.length === 0 ? (
                  <p className='py-8 text-center text-sm text-gray-500'>
                    Sin resultados
                  </p>
                ) : (
                  <div className='grid grid-cols-3 gap-2 sm:grid-cols-4'>
                    {filtered.map((opt) => {
                      const isSelected = opt.key === selectedKey;
                      return (
                        <button
                          key={opt.key}
                          type='button'
                          onClick={() => handlePick(opt.key)}
                          className={`flex flex-col items-center gap-1.5 rounded-large p-2 transition ${
                            isSelected
                              ? 'bg-default-100 ring-2 ring-primary'
                              : 'hover:bg-default-100'
                          }`}
                        >
                          <div
                            className='rounded-full p-[2px]'
                            style={
                              opt.color
                                ? { boxShadow: `0 0 0 2px #${opt.color}` }
                                : undefined
                            }
                          >
                            <Avatar
                              src={opt.imageUrl}
                              name={opt.label}
                              size='lg'
                              className='bg-default-200'
                            />
                          </div>
                          <span className='text-center text-xs font-semibold leading-tight text-gray-100'>
                            {opt.label}
                          </span>
                          {opt.sublabel && (
                            <span className='line-clamp-2 text-center text-[10px] leading-tight text-gray-400'>
                              {opt.sublabel}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
