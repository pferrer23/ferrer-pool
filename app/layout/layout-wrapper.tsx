'use client';

import { usePathname } from 'next/navigation';
import SideNav from '@/app/layout/sidenav';
import Header from '@/app/layout/header';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <main className='h-screen bg-background-950'>{children}</main>;
  }

  return (
    <div className='flex h-screen bg-background-950'>
      <SideNav />
      <div className='flex flex-col flex-1 overflow-hidden'>
        <Header />
        <main className='flex-1 overflow-y-auto p-4 md:p-6 mb-[60px] md:mb-0'>
          {children}
        </main>
      </div>
    </div>
  );
}
