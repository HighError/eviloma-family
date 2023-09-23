'use client';

import { Icon } from '@iconify/react';
import { useRouter } from 'next-nprogress-bar';
import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getMoneyFormat } from '@/lib/moneyFormat';

interface iProps {
  id: string;
  sub: string;
  username: string | null;
  email: string;
  avatar: string | null;
  balance: number;
  subscriptionsCount: number;
  transactionsCount: number;
}

export default function UserItem({
  id,
  sub,
  username,
  email,
  avatar,
  balance,
  subscriptionsCount,
  transactionsCount,
}: iProps) {
  const router = useRouter();
  return (
    <Card
      onClick={() => router.push(`/admin/users/${id}`)}
      className='cursor-pointer duration-300 hover:bg-muted'
    >
      <CardHeader className='flex flex-row items-center gap-2'>
        <Avatar>
          <AvatarImage src={avatar ?? ''} alt='avatar image' />
          <AvatarFallback>
            {username?.slice(0, 1).toUpperCase() ?? email?.slice(0, 1).toUpperCase() ?? '?'}
          </AvatarFallback>
        </Avatar>
        <span className='text-lg font-semibold'>{username ?? email}</span>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-row items-center gap-1'>
            <Icon icon='mdi:identifier' fontSize='20px' className='inline' />
            <span>{id}</span>
          </div>
          <div className='flex flex-row items-center gap-1'>
            <Icon icon='mdi:identifier' fontSize='20px' className='inline' />
            <span>{sub}</span>
          </div>
          {username && (
            <div className='flex flex-row items-center gap-1'>
              <Icon icon='mdi:email' fontSize='20px' className='inline' />
              <span>{`Email: ${email}`}</span>
            </div>
          )}
          <div className='flex flex-row items-center gap-1'>
            <Icon icon='mdi:cash' fontSize='20px' className='inline' />
            <span>
              Баланс:{' '}
              <span className={balance < 0 ? 'text-red-500' : ''}>
                {getMoneyFormat(false).format(balance)}
              </span>
            </span>
          </div>
          <div className='flex flex-row items-center gap-1'>
            <Icon icon='mdi:format-list-bulleted-type' fontSize='20px' className='inline' />
            <span>{`Кількість підписок: ${subscriptionsCount}`}</span>
          </div>
          <div className='flex flex-row items-center gap-1'>
            <Icon icon='mdi:receipt-outline' fontSize='20px' className='inline' />
            <span>{`Кількість транзакцій: ${transactionsCount}`}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
