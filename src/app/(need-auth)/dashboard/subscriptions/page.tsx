'use client';

import React from 'react';

import SubscriptionItem from '@/components/SubscriptionItem';
import useUserStore from '@/stores/user';

export default function SubscriptionsPage() {
  const { subscriptions } = useUserStore();
  return (
    <>
      <h2 className='mb-3 text-center text-2xl font-semibold md:text-3xl'>Мої підписки</h2>
      {!subscriptions ||
        (subscriptions.length === 0 && <div className='text-center'>У вас відсутні підписки.</div>)}
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {subscriptions?.map((item) => (
          <SubscriptionItem
            key={item._id}
            title={item.title}
            categoryID={item.category}
            cost={item.cost / 100}
            date={new Date(item.date)}
          />
        ))}
      </div>
    </>
  );
}
