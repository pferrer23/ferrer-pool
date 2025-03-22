'use client';

import { Avatar, Button } from '@heroui/react';

interface AvatarProps {
  src: string;
  name: string;
  className?: string;
}

export default function DriverAvatar({ src, name, className }: AvatarProps) {
  return (
    <div className='flex flex-col items-center gap-2'>
      <Avatar
        isBordered
        radius='md'
        src={src}
        alt={name}
        className={className}
      />
      <Button color='primary' variant='bordered' size='sm'>
        {name}
      </Button>
    </div>
  );
}
