import React from 'react';

import AddNewSubscriptionModal from '@/components/modals/admin/users/AddNewSubscriptionModal';
import { HorizontalDivider } from '@/components/ui/divider';
import useTempAdminStore from '@/stores/tempAdminUser';

import SubscriptionItem from './SubscriptionItem';

export default function Subscriptions() {
  const { user } = useTempAdminStore();
  return (
    <div className='w-full'>
      <h3 className='mb-2 text-center text-xl font-semibold'>Підписки</h3>
      <HorizontalDivider />
      <div className='mt-4 flex flex-row items-center justify-end'>
        <AddNewSubscriptionModal />
      </div>
      <div className='mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3'>
        {user?.subscriptions.map((x) => (
          <SubscriptionItem
            key={x._id}
            id={x._id}
            title={x.title}
            categoryID={x.category}
            cost={x.cost / 100}
            date={new Date(x.date)}
          />
        ))}
      </div>
    </div>
  );
}
