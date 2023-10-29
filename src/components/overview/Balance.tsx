'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

import Deposit from '@/components/modals/overview/Deposit';
import TelegramLink from '@/components/modals/overview/TelegramLink';
import UnlinkTelegram from '@/components/modals/overview/UnlinkTelegram';
import { getMoneyFormat } from '@/lib/moneyFormat';
import useUserStore from '@/stores/user';

import { Card, CardContent, CardHeader } from '../ui/card';
import { HorizontalDivider } from '../ui/divider';
import SubscriptionItem from './items/SubscriptionItem';

export default function Balance() {
  const user = useUserStore((state) => state.user);
  return (
    <Card className='order-1 lg:order-2 lg:row-span-2'>
      <CardHeader />
      <CardContent className='flex flex-col gap-3 md:grid md:grid-cols-2 md:items-center lg:flex lg:flex-col lg:items-stretch'>
        <div className='flex flex-col items-center'>
          <div
            className={twMerge(
              'text-4xl font-semibold',
              user?.balance && user.balance < 0 ? 'text-red-500' : ''
            )}
          >
            {getMoneyFormat(false).format((user?.balance ?? 0) / 100)}
          </div>
          <div className='text-muted-foreground'>Доступний баланс</div>
        </div>
        <div className='flex flex-col gap-2'>
          <Deposit />
          {user?.telegramID ? <UnlinkTelegram /> : <TelegramLink />}
        </div>
        <HorizontalDivider className='block md:hidden lg:block' />
        <div>
          <h4 className='mb-3 text-center text-xl'>Підписки</h4>
          <div className='flex flex-col gap-2'>
            {!user?.subscriptions || user.subscriptions.length === 0 ? (
              <div className='text-muted-foreground'>Підписки відстутні</div>
            ) : (
              user.subscriptions.map(({ subscription }) => (
                <SubscriptionItem key={subscription.id} subscription={subscription} />
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
