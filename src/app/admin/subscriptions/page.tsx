'use client';

import { Icon } from '@iconify/react';
import React, { useEffect } from 'react';

import SubscriptionItem from '@/components/admin/subscriptions/SubscriptionItem';
import NewSubscriptionModal from '@/components/modals/subscriptions/NewSubscriptionModal';
import { Button } from '@/components/ui/button';
import useSubscriptionsStore from '@/stores/subscriptions';

export default function Subscriptions() {
  const { subscriptions, updateSubscriptions, isPreLoaded, isError, isLoading } =
    useSubscriptionsStore();

  useEffect(() => {
    if (!isPreLoaded) {
      updateSubscriptions();
    }
  }, [isPreLoaded, updateSubscriptions]);

  return (
    <div>
      <h2 className='mb-3 text-center text-2xl font-semibold md:text-3xl'>Управління підписками</h2>
      <div className='my-4 flex flex-row items-center justify-center sm:justify-end'>
        <div className='flex flex-row gap-2'>
          <Button
            variant='outline'
            color='secondary'
            disabled={isLoading}
            onClick={() => updateSubscriptions()}
          >
            <Icon icon='mdi:refresh' fontSize='20px' className='mr-2' /> Оновити
          </Button>
          <NewSubscriptionModal />
        </div>
      </div>
      {!isLoading && isError && (
        <div className='text-center'>Помилка завантаження. Спробуйте ще раз.</div>
      )}
      {!isLoading && !isError && (!subscriptions || subscriptions.length === 0) && (
        <div className='text-center'>Підписок не знайдено.</div>
      )}
      {!isLoading && !isError && subscriptions && subscriptions.length > 0 && (
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {subscriptions.map((item) => (
            <SubscriptionItem
              key={item._id}
              id={item._id}
              title={item.title}
              categoryID={item.category}
              cost={item.cost / 100}
              date={new Date(item.date)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
