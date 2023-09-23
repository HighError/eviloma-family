'use client';
import React from 'react';

import DepositModal from '@/components/modals/overview/DepositModal';
import TelegramLinkModal from '@/components/modals/overview/TelegramLinkModal';
import UnlinkTelegramModal from '@/components/modals/overview/UnlinkTelegramModal';
import { getMoneyFormat } from '@/lib/moneyFormat';
import useUserStore from '@/stores/user';

import { Card, CardContent, CardHeader } from '../ui/card';
import { HorizontalDivider } from '../ui/divider';
import SubscriptionItem from './items/SubscriptionItem';

export default function Balance() {
  const { balance, subscriptions, telegram } = useUserStore();
  return (
    <Card className='order-1 lg:order-2 lg:row-span-2'>
      <CardHeader />
      <CardContent className='flex flex-col gap-3 md:grid md:grid-cols-2 md:items-center lg:flex lg:flex-col lg:items-stretch'>
        <div className='flex flex-col items-center'>
          <div className={`text-4xl font-semibold ${balance && balance < 0 ? 'text-red-500' : ''}`}>
            {getMoneyFormat(false).format((balance ?? 0) / 100)}
          </div>
          <div className='text-muted-foreground'>Доступний баланс</div>
        </div>
        <div className='flex flex-col gap-2'>
          <DepositModal />
          {!telegram && <TelegramLinkModal />}
          {telegram && <UnlinkTelegramModal />}
        </div>
        <HorizontalDivider className='block md:hidden lg:block' />
        <div>
          <h4 className='mb-3 text-center text-xl'>Підписки</h4>
          <div className='flex flex-col gap-2'>
            {(!subscriptions || subscriptions.length === 0) && (
              <div className='text-muted-foreground'>Підписки відстутні</div>
            )}
            {subscriptions &&
              subscriptions.length > 0 &&
              subscriptions.map((item) => (
                <SubscriptionItem
                  key={item._id}
                  title={item.title}
                  categoryID={item.category}
                  cost={item.cost}
                />
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
