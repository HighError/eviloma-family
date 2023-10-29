'use client';

import { Icon } from '@iconify/react';
import React, { useEffect } from 'react';

import SubscriptionItem from '@/components/admin/subscriptions/SubscriptionItem';
import NewSubscriptionModal from '@/components/sheets/NewSubscription';
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
      <h2>Управління підписками</h2>
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
          {subscriptions.map((subscription) => (
            <SubscriptionItem key={subscription.id} subscription={subscription} />
          ))}
        </div>
      )}
    </div>
  );
}
