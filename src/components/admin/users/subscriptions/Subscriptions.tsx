import React from 'react';

import AddSubscriptionForUser from '@/components/modals/AddSubscriptionForUser';
import { HorizontalDivider } from '@/components/ui/divider';
import useTempAdminStore from '@/stores/tempAdminUser';

import SubscriptionItem from './SubscriptionItem';

export default function Subscriptions() {
  const { user } = useTempAdminStore();
  return (
    <div className='w-full'>
      <h3>Підписки</h3>
      <HorizontalDivider />
      <div className='mt-4 flex flex-row items-center justify-end'>
        <AddSubscriptionForUser />
      </div>
      <div className='mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3'>
        {user?.subscriptions.map(({ subscription }) => (
          <SubscriptionItem key={subscription.id} subscription={subscription} />
        ))}
      </div>
    </div>
  );
}
