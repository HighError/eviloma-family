'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

import useUserStore from '@/stores/user';

import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import TransactionItem from './items/TransactionItem';

export default function LastTransactions() {
  const user = useUserStore((state) => state.user);
  return (
    <Card className='order-2 p-3 lg:order-1 lg:col-span-2'>
      <CardHeader>
        <span className='text-center text-lg font-semibold sm:text-xl'>Останні транзакції</span>
      </CardHeader>
      <CardContent className='px-2'>
        {!user?.transactions || user.transactions.length === 0 ? (
          <div className='text-center text-muted-foreground'>Транзакції відсутні</div>
        ) : (
          <div className='grid gap-3 gap-x-8 md:grid-cols-2'>
            {user.transactions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 10)
              .map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
          </div>
        )}
      </CardContent>
      <CardFooter
        className={twMerge(
          'text-sm text-muted-foreground',
          !user || !user.transactions || user.transactions.length === 0 ? 'hidden' : ''
        )}
      >
        Переглянути всі транзакції ви можете натиснувши на відповідний пункт в меню. Щоб відкрити
        меню, натисніть на ваш аватар зверху справа.
      </CardFooter>
    </Card>
  );
}
