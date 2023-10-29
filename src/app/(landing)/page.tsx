import Link from 'next/link';
import React from 'react';

export default function HomePage() {
  return (
    <div className='flex h-full min-h-[calc(100vh-140px)] w-full flex-col items-center justify-center space-y-20 py-14 md:min-h-[calc(100vh-160px)] xl:py-24'>
      <div className='mx-auto w-full max-w-2xl'>
        <Link
          href='https://github.com/higherror/eviloma-family'
          title='Github repository'
          target='_blank'
          rel='noreferrer'
          className='mx-auto mb-5 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full bg-muted px-7 py-2 transition-colors duration-300 ease-linear animate-in slide-in-from-top'
        >
          We 💜 OpenSource
        </Link>
        <h1 className='bg-gradient-to-br from-[#5F0A87] to-[#A4508B] bg-clip-text text-center text-4xl font-bold leading-normal text-transparent duration-300 ease-linear animate-in zoom-in-50 md:text-7xl md:leading-normal'>
          Eviloma Family
        </h1>
        <p className='text-center text-muted-foreground md:text-xl'>
          Система управління сімейними підписками
        </p>
      </div>
    </div>
  );
}
