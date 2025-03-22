import React from 'react';
import SignInButton from '@/app/ui/components/sign-in-button';

export default function Header() {
  return (
    <header className='bg-background-900 border-b border-background-800 py-4 px-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          {/* Add header content here */}
        </div>
        <div className='flex items-center space-x-4'>
          <SignInButton />
        </div>
      </div>
    </header>
  );
}
