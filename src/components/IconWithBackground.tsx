'use client';

import { Icon } from '@iconify/react';
import React from 'react';

export default function IconWithBackground({ icon, color }: { icon?: string; color?: string }) {
  return (
    <div className='h-10 w-10 min-w-[40px] rounded-lg bg-muted'>
      <Icon icon={icon ?? ''} className='m-auto block h-full text-2xl' color={color} />
    </div>
  );
}
