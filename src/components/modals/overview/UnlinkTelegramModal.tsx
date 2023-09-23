import { Icon } from '@iconify/react';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

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
import useUserStore from '@/stores/user';

export default function UnlinkTelegramModal() {
  const [open, setOpen] = useState<boolean>(false);
  const { updateUser } = useUserStore();

  async function unlink() {
    try {
      await Axios.delete(`/api/telegram`);
      await updateUser();
      toast.success("Телеграм успішно від'язано");
    } catch (err) {
      if (err instanceof AxiosError) {
        return toast.error(err.response?.data.error ?? 'Помилка сервера');
      }
      return toast.error('Невідома помилка');
    } finally {
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>
          <Icon icon='simple-icons:telegram' fontSize='20px' className='mr-2' />
          Відв&apos;язати телеграм
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Відв&apos;язка телеграм</DialogTitle>
          <DialogDescription>Ви дійсно хочете відв&apos;язати телеграм?</DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex-wrap gap-2'>
          <Button variant='outline' onClick={() => setOpen(false)}>
            Скасувати
          </Button>
          <Button variant='destructive' onClick={() => unlink()}>
            Відв&apos;язати
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
