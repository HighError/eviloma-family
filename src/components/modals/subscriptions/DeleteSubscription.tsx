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
import type { subscriptionsSchema } from '@/db/schema';
import Axios from '@/lib/axios';
import useSubscriptionsStore from '@/stores/subscriptions';
import useUserStore from '@/stores/user';

export default function DeleteSubscription({
  subscription,
}: {
  subscription: typeof subscriptionsSchema.$inferSelect;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const { updateSubscriptions, isLoading } = useSubscriptionsStore();
  const { updateUser } = useUserStore();

  const deleteSubscription = async () => {
    try {
      await Axios.delete(`/api/subscriptions/${subscription.id}`);
      toast.success('Підписка видалена');
      await updateSubscriptions();
      return await updateUser();
    } catch (err) {
      if (err instanceof AxiosError) {
        return toast.error(err.response?.data.error ?? 'Помилка сервера');
      }
      return toast.error('Невідома помилка');
    } finally {
      setOpen(false);
    }
  };
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
            Ви дійсно хочете видалити підписку{' '}
            <span className='font-semibold'>{subscription.title}</span>? Цю дію не можна відмінити!
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
