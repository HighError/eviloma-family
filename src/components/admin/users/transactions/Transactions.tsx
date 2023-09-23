import React from 'react';

import AddNewTransactionModal from '@/components/modals/admin/users/AddNewTransactionModal';
import { HorizontalDivider } from '@/components/ui/divider';
import useTempAdminStore from '@/stores/tempAdminUser';

import TransactionItem from './TransactionItem';

export default function Transactions() {
  const { user } = useTempAdminStore();
  return (
    <div className='w-full'>
      <h3 className='mb-2 text-center text-xl font-semibold'>Транзакції</h3>
      <HorizontalDivider />
      <div className='mt-4 flex flex-row items-center justify-end'>
        <AddNewTransactionModal />
      </div>
      <div className='mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3'>
        {user?.transactions.map((x) => (
          <TransactionItem
            key={x._id}
            id={x._id}
            title={x.title}
            categoryID={x.category}
            date={new Date(x.date)}
            suma={x.suma / 100}
          />
        ))}
      </div>
    </div>
  );
}
