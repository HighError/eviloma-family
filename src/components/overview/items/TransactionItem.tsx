'use client';

import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import React from 'react';

import IconWithBackground from '@/components/IconWithBackground';
import { transactionCategory } from '@/lib/categoryList';
import { getMoneyFormat } from '@/lib/moneyFormat';

interface iProps {
  title: string;
  categoryID: string;
  date: Date;
  summa: number;
}

export default function TransactionItem({ title, categoryID, date, summa }: iProps) {
  const category = transactionCategory.find((x) => x.name === categoryID);
  return (
    <div className='flex flex-row items-center justify-between gap-2'>
      <div className='flex flex-row items-center gap-2'>
        <IconWithBackground icon={category?.icon} color={category?.color} />
        <div className='flex flex-col items-start justify-evenly'>
          <div className='text-left text-sm truncate-1-lines md:text-base'>{title}</div>
          <div className='text-sm text-muted-foreground md:text-xs'>
            {format(date, 'dd.MM.yyyy HH:mm', { locale: uk })}
          </div>
        </div>
      </div>
      <div className='text-sm md:text-base'>{getMoneyFormat(true).format(summa)}</div>
    </div>
  );
}
