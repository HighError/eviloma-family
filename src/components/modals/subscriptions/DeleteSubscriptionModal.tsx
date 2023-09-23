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
import useSubscriptionsStore from '@/stores/subscriptions';
import useUserStore from '@/stores/user';

interface iProps {
  id: string;
  title: string;
}

export default function DeleteSubscriptionModal({ id, title }: iProps) {
  const [open, setOpen] = useState<boolean>(false);
  const { updateSubscriptions, isLoading } = useSubscriptionsStore();
  const { updateUser } = useUserStore();

  async function deleteSubscription() {
    try {
      await Axios.delete(`/api/subscriptions/${id}`);
      await updateSubscriptions();
      await updateUser();
      toast.success('Підписка видалена');
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
        <Button color='danger' variant='destructive' disabled={isLoading}>
          <Icon icon='mdi:delete' fontSize='20px' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Видалення підписки</DialogTitle>
          <DialogDescription>
            Ви дійсно хочете видалити підписку <span className='font-semibold'>{title}</span>? Цю
            дію не можна відмінити!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex-wrap gap-2'>
          <Button variant='outline' onClick={() => setOpen(false)} disabled={isLoading}>
            Скасувати
          </Button>
          <Button variant='destructive' onClick={() => deleteSubscription()} disabled={isLoading}>
            Видалити
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
