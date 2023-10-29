'use client';

import { Icon } from '@iconify/react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import React from 'react';

import IconWithBackground from '@/components/IconWithBackground';
import RemoveSubscription from '@/components/modals/admin/users/RemoveSubscription';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import type { subscriptionsSchema } from '@/db/schema';
import { subsCategory } from '@/lib/categoryList';
import { getMoneyFormat } from '@/lib/moneyFormat';

export default function SubscriptionItem({
  subscription,
}: {
  subscription: typeof subscriptionsSchema.$inferSelect;
}) {
  const category = subsCategory.find((item) => item.name === subscription.category);
  return (
    <Card>
      <CardHeader>
        <div className='flex flex-row items-center gap-3 text-xl font-semibold'>
          <IconWithBackground icon={category?.icon} color={category?.color} />
          <span>{subscription.title}</span>
        </div>
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>
        <div className='flex flex-row items-center gap-1'>
          <Icon icon='mdi:identifier' fontSize='20px' />
          <span>{subscription.id}</span>
        </div>
        <div className='flex flex-row items-center gap-1'>
          <Icon icon='mdi:shape-outline' fontSize='20px' />
          <span>Категорія: {category?.name}</span>
        </div>
        <div className='flex flex-row items-center gap-1'>
          <Icon icon='mdi:calendar-range' fontSize='20px' />
          <span>
            Дата оплати: {format(new Date(subscription.date), 'dd MMMM yyyy', { locale: uk })}
          </span>
        </div>
        <div className='flex flex-row items-center gap-1'>
          <Icon icon='mdi:cash' fontSize='20px' />
          <span>Ціна: {getMoneyFormat(false).format(subscription.cost / 100)}/місяць</span>
        </div>
      </CardContent>
      <CardFooter className='flex flex-wrap justify-end gap-2'>
        <RemoveSubscription subscription={subscription} />
      </CardFooter>
    </Card>
  );
}
