import { Icon } from '@iconify/react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import useUserStore from '@/stores/user';

export default function Deposit() {
  const [open, setOpen] = useState<boolean>(false);
  const user = useUserStore((state) => state.user);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>
          <Icon icon='mdi:cash-fast' fontSize='20px' className='mr-2' />
          Поповнити рахунок
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Поповнення рахунку</DialogTitle>
        </DialogHeader>
        {user?.paymentLink ? (
          <DialogDescription className='flex flex-col gap-2'>
            <p>
              Для поповнення рахунку натисніть кнопку нижче. Це скопіює ваш ID та перенаправить вас
              на сторінку оплати.
            </p>
            <p>
              Виберіть бажану суму, спосіб оплати та введіть в поле{' '}
              <span className='font-bold text-primary'>коментар</span> ваш ID (без лишніх символів).
            </p>
            <p>
              Ваш ID: <span className='font-semibold'>{user.id}</span>
            </p>
          </DialogDescription>
        ) : (
          <DialogDescription>
            Нажаль у вас не встановлено посилання для оплати. Будь ласка зверніться до
            адміністратора.
          </DialogDescription>
        )}
        <DialogFooter className='flex-wrap gap-2'>
          <Button variant='outline' onClick={() => setOpen(false)}>
            Скасувати
          </Button>
          <Button
            disabled={!user?.paymentLink}
            onClick={() => {
              navigator.clipboard.writeText(user?.id ?? '').then(() => {
                window.open(user?.paymentLink ?? '', '_blank', 'noreferrer');
              });
            }}
          >
            Скопіювати ID та перейти
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
