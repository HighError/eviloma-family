import './globals.css';
import '@mantine/core/styles.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { type Metadata } from 'next';
import { Raleway } from 'next/font/google';
import React from 'react';

import NavBar from '@/components/navbar/NavBar';
import theme from '@/utils/theme';

const raleway = Raleway({ subsets: ['cyrillic-ext', 'latin-ext'] });

export const metadata: Metadata = {
  description: 'Generated by create next app',
  title: 'Create Next App',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='uk'>
      <head>
        <ColorSchemeScript defaultColorScheme='dark' forceColorScheme='dark' />
      </head>
      <body className={raleway.className}>
        <MantineProvider theme={theme} defaultColorScheme='dark' forceColorScheme='dark' withGlobalClasses>
          <NavBar />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
