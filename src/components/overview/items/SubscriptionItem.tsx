import { Icon } from '@iconify/react';
import React from 'react';

import type { subscriptionsSchema } from '@/db/schema';
import { subsCategory } from '@/lib/categoryList';

export default function SubscriptionItem({
  subscription,
}: {
  subscription: typeof subscriptionsSchema.$inferSelect;
}) {
  const category = subsCategory.find((x) => x.name === subscription.category);
  return (
    <div className='flex flex-row items-center justify-between'>
      <div className='flex flex-row items-center gap-2'>
        <Icon icon={category?.icon ?? ''} color={category?.color} className='text-xl' />
        <span className='text-left'>{subscription.title}</span>
      </div>
      <div className='text-right'>{(subscription.cost / 100).toFixed(2)}₴</div>
    </div>
  );
}
