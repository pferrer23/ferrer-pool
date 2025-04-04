'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import {
  HomeIcon,
  CheckCircleIcon,
  Cog6ToothIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

export default function SideNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  type MenuItem = {
    name: string;
    href: string | null;
    icon: React.ElementType;
  };

  const menuItems: MenuItem[] = [
    {
      name: 'Inicio',
      href: '/dashboard',
      icon: HomeIcon,
    },
    {
      name: 'Mis Predicciones',
      href: '/my-predictions',
      icon: CheckCircleIcon,
    },
    {
      name: 'Resultados',
      href: '/results',
      icon: TrophyIcon,
    },
  ];

  if (session?.user?.id === 1) {
    menuItems.push({
      name: 'Admin',
      href: '/admin',
      icon: Cog6ToothIcon,
    });
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className='hidden lg:flex flex-col w-64 bg-background-900 border-r border-background-800'>
        <div className='flex items-center justify-center py-3'>
          <Link href='/dashboard' className='px-6 py-4'>
            <Image
              src='/images/ferrer.png'
              alt='Ferrer Logo'
              width={150}
              height={40}
              priority
            />
          </Link>
        </div>
        <nav className='flex-1 space-y-1 px-2 mt-4'>
          {menuItems.map((menuItem) => (
            <Link
              key={menuItem.name}
              href={menuItem.href ?? ''}
              className={clsx(
                'flex items-center px-4 py-3 text-sm rounded-lg gap-4',
                pathname === menuItem.href
                  ? 'bg-primary-600 text-white'
                  : 'text-background-100 hover:bg-background-800'
              )}
            >
              <menuItem.icon className='w-5 h-5' />
              <span>{menuItem.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile bottom navigation */}
      <nav className='lg:hidden fixed bottom-0 left-0 right-0 bg-background-900 border-t border-background-800 z-50'>
        <div className='flex justify-around px-2 py-3'>
          {menuItems.map((menuItem) => (
            <Link
              key={menuItem.name}
              href={menuItem.href ?? ''}
              className={clsx(
                'flex flex-col items-center justify-center',
                pathname === menuItem.href
                  ? 'text-primary-600'
                  : 'text-background-100'
              )}
            >
              <menuItem.icon className='w-6 h-6' />
              <span className='text-xs mt-1'>{menuItem.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
