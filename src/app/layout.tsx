import './globals.css';

import type { Metadata } from 'next';
import Script from 'next/script';
import React from 'react';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Eviloma Family',
  description: 'Eviloma Family - Ваш інструмент для ефективного управління сімейними підписками.',
  authors: [{ name: 'HighError', url: 'https://github.com/higherror' }],
  themeColor: '#6D28D9',
  creator: 'HighError',
  robots: '/robots.txt',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
  applicationName: 'Eviloma Family',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'eviloma Family',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    minimumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='uk' className='dark'>
      <head title='Eviloma Family'>
        <title>Eviloma Family</title>
        <Script async src='https://www.googletagmanager.com/gtag/js?id=G-B0V744G0SK' />
        <Script id='google-analytics'>{`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-B0V744G0SK');`}</Script>
      </head>
      <body className={`scrollbar-thin scrollbar-track-background scrollbar-thumb-primary`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
