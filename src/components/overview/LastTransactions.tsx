'use client';

import React from 'react';

import useUserStore from '@/stores/user';

import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import TransactionItem from './items/TransactionItem';

export default function LastTransactions() {
  const { transactions } = useUserStore();
  return (
    <Card className='order-2 p-3 lg:order-1 lg:col-span-2'>
      <CardHeader>
        <span className='text-center text-lg font-semibold sm:text-xl'>Останні транзакції</span>
      </CardHeader>
      <CardContent className='px-2'>
        {(!transactions || transactions.length === 0) && (
          <div className='text-center text-muted-foreground'>Транзакції відсутні</div>
        )}
        {transactions && transactions.length > 0 && (
          <div className='grid gap-3 gap-x-8 md:grid-cols-2'>
            {transactions.slice(0, 10).map((x) => (
              <TransactionItem
                key={x._id}
                title={x.title}
                categoryID={x.category}
                date={new Date(x.date)}
                summa={x.suma / 100}
              />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter
        className={`text-sm text-muted-foreground ${
          !transactions || transactions.length === 0 ? 'hidden' : ''
        }`}
      >
        Переглянути всі транзакції ви можете натиснувши на відповідний пункт в меню. Щоб відкрити
        меню, натисніть на ваш аватар зверху справа.
      </CardFooter>
    </Card>
  );
}
