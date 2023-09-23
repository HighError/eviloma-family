'use client';

import Image from 'next/image';
import { useRouter } from 'next-nprogress-bar';
import React from 'react';

import { Button } from '@/components/ui/button';

export const getStaticProps = async () => {
  return {
    statusCode: 404,
  };
};

export default function NotFound() {
  const router = useRouter();
  return (
    <div className='flex h-[100dvh] w-full flex-col items-center gap-3 pt-10'>
      <Image src='/404.png' alt='404' width={320} height={320} priority />
      <h2 className='text-5xl font-bold'>404</h2>
      <h3 className='text-2xl'>Сторінку не знайдено</h3>
      <Button onClick={() => router.push('/dashboard')}>Додому</Button>
    </div>
  );
}
