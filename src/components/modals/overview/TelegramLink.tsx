import { Icon } from '@iconify/react';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

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
import Axios from '@/lib/axios';

export default function TelegramLink() {
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  async function getToken(): Promise<string | null> {
    setIsLoading(true);
    try {
      const res = await Axios.post('/api/telegram');
      setIsLoading(false);
      return res.data.token ?? null;
    } catch (e) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.error ?? 'Помилка сервера');
      } else {
        toast.error('Невідома помилка');
      }
      setIsLoading(false);
      return null;
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>
          <Icon icon='simple-icons:telegram' fontSize='20px' className='mr-2' />
          Прив&apos;язати телеграм
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Прив&apos;язка телеграм</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Для прив&apos;язки телеграм, натисніть на кнопку нижче. Для вас буде згенеровано
          унікальний токен, який буде дійсний на протязі 15 хвилин. Після того як ви натисните
          кнопку, ви будете перенаправлені в телеграм бота.
        </DialogDescription>
        <DialogFooter className='flex-wrap gap-2'>
          <Button variant='outline' disabled={isLoading} onClick={() => setOpen(false)}>
            Скасувати
          </Button>
          <Button
            disabled={isLoading}
            onClick={() => {
              getToken().then((e) => {
                if (e)
                  window.open(`${process.env.NEXT_PUBLIC_TELEGRAM_BOT_LINK}?start=${e}`, '_blank');
              });
            }}
          >
            Прив&apos;язати
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
