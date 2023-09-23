import React from 'react';

import { cn } from '@/lib/utils';

export function HorizontalDivider({ className }: { className?: string }) {
  return <div className={cn('my-2 h-[1px] border-[1px] border-muted', className)} />;
}
