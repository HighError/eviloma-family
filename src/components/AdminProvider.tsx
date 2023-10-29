'use client';

import Image from 'next/image';
import { useRouter } from 'next-nprogress-bar';
import React from 'react';

import { Button } from '@/components/ui/button';
import useUserStore from '@/stores/user';

export default function AdminProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUserStore();
  const router = useRouter();
  if (!user || user.role === 'default') {
    return (
      <div className='flex h-[100dvh] w-full flex-col items-center gap-2 pt-10'>
        <Image src='/admin.png' alt='403' width={320} height={320} priority />
        <h2 className='text-5xl font-bold'>403</h2>
        <h3 className='text-2xl'>Для доступу недостатньо прав</h3>
        <Button onClick={() => router.push('/dashboard')}>Додому</Button>
      </div>
    );
  }
  return children;
}
