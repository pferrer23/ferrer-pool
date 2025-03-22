import type { Metadata } from 'next';
import '@/app/ui/global.css';

import SideNav from '@/app/layout/sidenav';
import Header from '@/app/layout/header';
import { inter } from '@/app/ui/fonts';
import LayoutProviders from '@/app/layout/providers';
import LayoutWrapper from '@/app/layout/layout-wrapper';

export const metadata: Metadata = {
  title: 'Ferrer Pool',
  description: 'Ferrer Pool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${inter.className} dark antialiased`}>
        <LayoutProviders>
          <LayoutWrapper>{children}</LayoutWrapper>
        </LayoutProviders>
      </body>
    </html>
  );
}
