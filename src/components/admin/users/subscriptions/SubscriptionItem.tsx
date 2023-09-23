'use client';

import { Icon } from '@iconify/react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import React from 'react';

import IconWithBackground from '@/components/IconWithBackground';
import RemoveSubscriptionModal from '@/components/modals/admin/users/RemoveSubscriptionModal';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { subsCategory } from '@/lib/categoryList';
import { getMoneyFormat } from '@/lib/moneyFormat';

interface IProps {
  id: string;
  title: string;
  categoryID: string;
  cost: number;
  date: Date;
}

export default function SubscriptionItem({ id, title, categoryID, cost, date }: IProps) {
  const category = subsCategory.find((item) => item.name === categoryID);
  return (
    <Card>
      <CardHeader>
        <div className='flex flex-row items-center gap-3 text-xl font-semibold'>
          <IconWithBackground icon={category?.icon} color={category?.color} />
          <span>{title}</span>
        </div>
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>
        <div className='flex flex-row items-center gap-1'>
          <Icon icon='mdi:identifier' fontSize='20px' />
          <span>{id}</span>
        </div>
        <div className='flex flex-row items-center gap-1'>
          <Icon icon='mdi:shape-outline' fontSize='20px' />
          <span>Категорія: {category?.name}</span>
        </div>
        <div className='flex flex-row items-center gap-1'>
          <Icon icon='mdi:calendar-range' fontSize='20px' />
          <span>Дата оплати: {format(date, 'dd MMMM yyyy', { locale: uk })}</span>
        </div>
        <div className='flex flex-row items-center gap-1'>
          <Icon icon='mdi:cash' fontSize='20px' />
          <span>Ціна: {getMoneyFormat(false).format(cost)}/місяць</span>
        </div>
      </CardContent>
      <CardFooter className='flex flex-wrap justify-end gap-2'>
        <RemoveSubscriptionModal id={id} title={title} />
      </CardFooter>
    </Card>
  );
}
