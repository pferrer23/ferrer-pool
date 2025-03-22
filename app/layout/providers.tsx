'use client';

import { ReactNode } from 'react';
import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { SessionProvider } from 'next-auth/react';

const LayoutProviders = ({ children }: { children: ReactNode }) => {
  return (
    <HeroUIProvider>
      <ToastProvider />
      <SessionProvider>{children}</SessionProvider>
    </HeroUIProvider>
  );
};

export default LayoutProviders;
