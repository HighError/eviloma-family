'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

import Loading from '@/components/Loading';
import useUserStore from '@/stores/user';

export function Providers({ children }: { children: React.ReactNode }) {
  const { isLoading, isError, updateUser } = useUserStore();

  useEffect(() => {
    updateUser();
  }, [updateUser]);

  return (
    <>
      <Toaster
        position='top-center'
        toastOptions={{
          style: {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            border: '2px hsl(var(--border)) solid',
          },
        }}
      />

      <ProgressBar
        height='4px'
        color='hsl(var(--primary))'
        options={{ showSpinner: true }}
        shallowRouting
      />
      {!isLoading && !isError && children}
      {!isLoading && isError && <div>Error...</div>}
      {isLoading && <Loading />}
    </>
  );
}
