import React from 'react';
import SignInButton from '@/app/ui/components/sign-in-button';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className='bg-background-900 border-b border-background-800 py-4 px-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <div className='md:hidden'>
            <Link href='/dashboard'>
              <Image
                src='/images/ferrer.png'
                alt='Ferrer Logo'
                width={150}
                height={40}
                priority
              />
            </Link>
          </div>
        </div>
        <div className='flex items-center space-x-4'>
          <SignInButton />
        </div>
      </div>
    </header>
  );
}
