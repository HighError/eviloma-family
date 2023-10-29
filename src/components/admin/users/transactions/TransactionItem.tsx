'use client';

import { Icon } from '@iconify/react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import React from 'react';

import IconWithBackground from '@/components/IconWithBackground';
import RemoveTransaction from '@/components/modals/admin/users/RemoveTransaction';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import type { transactionsSchema } from '@/db/schema';
import { transactionCategory } from '@/lib/categoryList';
import { getMoneyFormat } from '@/lib/moneyFormat';

export default function TransactionItem({
  transaction,
}: {
  transaction: typeof transactionsSchema.$inferSelect;
}) {
  const category = transactionCategory.find((item) => item.name === transaction.category);
  return (
    <Card>
      <CardHeader>
        <div className='flex flex-row items-center gap-3 text-xl font-semibold'>
          <IconWithBackground icon={category?.icon} color={category?.color} />
          <span>{transaction.title}</span>
        </div>
      </CardHeader>
      <CardContent className='flex flex-col gap-2'>
        <div className='flex flex-row items-center gap-1'>
          <Icon icon='mdi:identifier' fontSize='20px' />
          <span>{transaction.id}</span>
        </div>
        <div className='flex flex-row items-center gap-1'>
          <Icon icon='mdi:shape-outline' fontSize='20px' />
          <span>Категорія: {category?.name}</span>
        </div>
        <div className='flex flex-row items-center gap-1'>
          <Icon icon='mdi:calendar-range' fontSize='20px' />
          <span>
            Дата оплати: {format(new Date(transaction.date), 'dd MMMM yyyy HH:mm', { locale: uk })}
          </span>
        </div>
        <div className='flex flex-row items-center gap-1'>
          <Icon icon='mdi:cash' fontSize='20px' />
          <span>
            {`Сума: `}
            <span className={transaction.suma < 0 ? 'text-red-500' : ''}>
              {getMoneyFormat(true).format(transaction.suma / 100)}
            </span>
          </span>
        </div>
      </CardContent>
      <CardFooter className='flex flex-wrap justify-end gap-2'>
        <RemoveTransaction transaction={transaction} />
      </CardFooter>
    </Card>
  );
}
