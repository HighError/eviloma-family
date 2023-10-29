'use client';

import React from 'react';

import SubscriptionItem from '@/components/SubscriptionItem';
import useUserStore from '@/stores/user';

export default function SubscriptionsPage() {
  const user = useUserStore((state) => state.user);
  return (
    <>
      <h2>Мої підписки</h2>
      {!user?.subscriptions ||
        (user.subscriptions.length === 0 ? (
          <div className='text-center'>У вас відсутні підписки.</div>
        ) : (
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {user.subscriptions?.map(({ subscription }) => (
              <SubscriptionItem key={subscription.id} subscription={subscription} />
            ))}
          </div>
        ))}
    </>
  );
}
