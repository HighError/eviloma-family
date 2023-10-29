'use client';

// https://github.com/vantezzen/auto-form/blob/main/src/components/ui/date-picker.tsx

import { Icon } from '@iconify/react';
import { format } from 'date-fns';
import uk from 'date-fns/locale/uk';
import { forwardRef } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/shadcn';

export const DatePicker = forwardRef<
  HTMLDivElement,
  {
    date?: Date;
    setDate: (date?: Date) => void;
  }
>(function DatePickerCmp({ date, setDate }, ref) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <Icon icon='mdi:calendar' fontSize='20px' className='mr-2 h-4 w-4' />
          {date ? format(date, 'dd MMMM yyyy', { locale: uk }) : <span>Виберіть дату</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar mode='single' selected={date} onSelect={setDate} initialFocus fixedWeeks />
      </PopoverContent>
    </Popover>
  );
});
