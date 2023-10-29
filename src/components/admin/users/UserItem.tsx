'use client';

import { useRouter } from 'next-nprogress-bar';
import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type FullUser from '@/types/fullUser';

export default function UserItem({ user }: { user: FullUser }) {
  const router = useRouter();
  return (
    <Card
      onClick={() => router.push(`/admin/users/${user.id}`)}
      className='cursor-pointer duration-300 hover:bg-muted'
    >
      <CardHeader>
        <CardTitle className='my-0 flex flex-row items-center gap-2'>
          <Avatar>
            <AvatarImage src={user.avatar ?? ''} alt='avatar image' />
            <AvatarFallback>
              {user.username?.slice(0, 1).toUpperCase() ??
                user.email?.slice(0, 1).toUpperCase() ??
                '?'}
            </AvatarFallback>
          </Avatar>
          <span className='text-lg font-semibold'>{user.username ?? user.email}</span>
        </CardTitle>
        <CardDescription>{user.id}</CardDescription>
      </CardHeader>
    </Card>
  );
}
