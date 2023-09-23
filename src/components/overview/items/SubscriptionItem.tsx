import { Icon } from '@iconify/react';
import React from 'react';

import { subsCategory } from '@/lib/categoryList';

interface iProps {
  title: string;
  categoryID: string;
  cost: number;
}

export default function SubscriptionItem({ title, categoryID, cost }: iProps) {
  const category = subsCategory.find((x) => x.name === categoryID);
  return (
    <div className='flex flex-row items-center justify-between'>
      <div className='flex flex-row items-center gap-2'>
        <Icon icon={category?.icon ?? ''} color={category?.color} className='text-xl' />
        <span className='text-left truncate-1-lines'>{title}</span>
      </div>
      <div className='text-right truncate-1-lines'>{(cost / 100).toFixed(2)}₴</div>
    </div>
  );
}
