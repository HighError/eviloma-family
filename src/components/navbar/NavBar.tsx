'use client';

import Link from 'next/link';
import React from 'react';

import { buttonVariants } from '@/components/ui/button';
import useUserStore from '@/stores/user';

import UserMenu from './UserMenu';

export default function CustomNavBar() {
  const isAuth = useUserStore((state) => state.isAuth);
  return (
    <div className='supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur'>
      <div className='container flex h-14 items-center justify-between'>
        <Link href='/' className='text-xl font-bold'>
          Eviloma Family
        </Link>
        {isAuth && <UserMenu />}
        {!isAuth && (
          <Link href='/api/logto/sign-in' className={buttonVariants({ variant: 'outline' })}>
            Увійти
          </Link>
        )}
      </div>
    </div>
  );
}
