'use client';

import Image from 'next/image';
import { useRouter } from 'next-nprogress-bar';
import React from 'react';

import { Button } from '@/components/ui/button';
import useUserStore from '@/stores/user';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuth } = useUserStore();
  const router = useRouter();
  if (!isAuth) {
    return (
      <div className='flex h-[100dvh] w-full flex-col items-center gap-2 pt-10'>
        <Image src='/auth.png' alt='401' width={320} height={320} priority />
        <h2 className='text-5xl font-bold'>401</h2>
        <h3 className='text-2xl'>Необхідна авторизація</h3>
        <div className='flex flex-row gap-3'>
          <Button onClick={() => router.push('/')}>Додому</Button>
          <Button onClick={() => router.push('/api/logto/sign-in')}>Увійти</Button>
        </div>
      </div>
    );
  }
  return children;
}
