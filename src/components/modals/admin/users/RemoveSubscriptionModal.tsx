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
import useTempAdminStore from '@/stores/tempAdminUser';
import useUserStore from '@/stores/user';

interface iProps {
  id: string;
  title: string;
}

export default function RemoveSubscriptionModal({ id, title }: iProps) {
  const [open, setOpen] = useState<boolean>(false);
  const { user, updateUser } = useTempAdminStore();
  const { id: meID, updateUser: updateMe } = useUserStore();

  async function deleteSubscription() {
    try {
      await Axios.delete(`/api/user/${user?.id}/subscription/${id}`);
      await updateUser(user?.id);
      if (user?.id === meID) {
        await updateMe();
      }
      toast.success('Підписку видалено у користувача');
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
        <Button color='danger' variant='destructive'>
          <Icon icon='mdi:delete' fontSize='20px' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Видалення підписки у користувача</DialogTitle>
          <DialogDescription>
            Ви дійсно хочете видалити підписку <span className='font-semibold'>{title}</span> у
            цього користувача?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex-wrap gap-2'>
          <Button variant='outline' onClick={() => setOpen(false)}>
            Скасувати
          </Button>
          <Button variant='destructive' onClick={() => deleteSubscription()}>
            Видалити
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
