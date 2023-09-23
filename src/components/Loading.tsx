import Image from 'next/image';
import React from 'react';

export default function Loading() {
  return (
    <div className='relative flex h-[100dvh] w-full items-center justify-center'>
      <div className='absolute h-60 w-60 animate-spin rounded-full border-y-4 border-purple-500' />
      <Image
        src='/loading.png'
        className='h-48 w-48 p-3'
        height={192}
        width={192}
        alt='loading'
        priority
      />
      <div className='absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-36 text-3xl font-semibold'>
        Завантаження
      </div>
    </div>
  );
}
