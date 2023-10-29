import React from 'react';

import CreateTransaction from '@/components/sheets/CreateTransaction';
import { HorizontalDivider } from '@/components/ui/divider';
import useTempAdminStore from '@/stores/tempAdminUser';

import TransactionItem from './TransactionItem';

export default function Transactions() {
  const { user } = useTempAdminStore();
  return (
    <div className='w-full'>
      <h3>Транзакції</h3>
      <HorizontalDivider />
      <div className='mt-4 flex flex-row items-center justify-end'>
        <CreateTransaction />
      </div>
      <div className='mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3'>
        {user?.transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
}
