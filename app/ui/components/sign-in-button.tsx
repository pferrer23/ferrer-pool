'use client';
import { useSession, signIn, signOut } from 'next-auth/react';
import {
  Avatar,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const SignInButton = () => {
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  if (session && session.user) {
    return (
      <Dropdown className='flex items-center'>
        <DropdownTrigger>
          <div className='flex gap-2 items-center'>
            <Avatar
              src={session.user.image || ''}
              alt={session.user.name}
              size='sm'
            />
            <span className='hidden md:flex text-sm font-medium'>
              {session.user.name}
            </span>
            <ChevronDownIcon className='w-5 h-5' />
          </div>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem
            key='description'
            className='gap-2 py-2'
            showDivider
            textValue='Profile'
            isReadOnly
          >
            <p className='font-bold'>Signed in as</p>
            <p className='text-sm text-gray-400'>{session.user.email}</p>
          </DropdownItem>
          <DropdownItem key='logout' onPress={handleLogout}>
            Logout
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  return (
    <Button
      onPress={() => signIn('google', { callbackUrl: '/dashboard' })}
      size='sm'
      color='primary'
    >
      Sign In with Google
    </Button>
  );
};

export default SignInButton;
