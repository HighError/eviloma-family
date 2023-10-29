'use client';

import React from 'react';

import TransactionItem from '@/components/TransactionItem';
import useUserStore from '@/stores/user';

export default function TransactionPage() {
  const user = useUserStore((state) => state.user);
  return (
    <>
      <h2>Мої транзакції</h2>
      {!user?.transactions ||
        (user.transactions.length === 0 ? (
          <div className='text-center'>У вас відсутні трнзакції.</div>
        ) : (
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {user.transactions
              ?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
              ))}
          </div>
        ))}
    </>
  );
}
