'use client';

import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import React from 'react';

import IconWithBackground from '@/components/IconWithBackground';
import type { transactionsSchema } from '@/db/schema';
import { transactionCategory } from '@/lib/categoryList';
import { getMoneyFormat } from '@/lib/moneyFormat';

export default function TransactionItem({
  transaction,
}: {
  transaction: typeof transactionsSchema.$inferSelect;
}) {
  const category = transactionCategory.find((x) => x.name === transaction.category);
  return (
    <div className='flex flex-row items-center justify-between gap-2'>
      <div className='flex flex-row items-center gap-2'>
        <IconWithBackground icon={category?.icon} color={category?.color} />
        <div className='flex flex-col items-start justify-evenly'>
          <div className='text-left text-sm md:text-base'>{transaction.title}</div>
          <div className='text-sm text-muted-foreground md:text-xs'>
            {format(new Date(transaction.date), 'dd.MM.yyyy HH:mm', { locale: uk })}
          </div>
        </div>
      </div>
      <div className='text-sm md:text-base'>
        {getMoneyFormat(true).format(transaction.suma / 100)}
      </div>
    </div>
  );
}
