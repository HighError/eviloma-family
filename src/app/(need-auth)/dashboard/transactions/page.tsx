'use client';

import React from 'react';

import TransactionItem from '@/components/TransactionItem';
import useUserStore from '@/stores/user';

export default function TransactionPage() {
  const { transactions } = useUserStore();
  return (
    <>
      <h2 className='mb-3 text-center text-2xl font-semibold md:text-3xl'>Мої транзакції</h2>
      {!transactions ||
        (transactions.length === 0 && <div className='text-center'>У вас відсутні трнзакції.</div>)}
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {transactions?.map((x) => (
          <TransactionItem
            key={x._id}
            title={x.title}
            categoryID={x.category}
            suma={x.suma / 100}
            date={new Date(x.date)}
          />
        ))}
      </div>
    </>
  );
}
