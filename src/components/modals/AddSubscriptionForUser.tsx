import { Icon } from '@iconify/react';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import * as z from 'zod';

import AutoForm from '@/components/ui/auto-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { subscriptionsSchema } from '@/db/schema';
import Axios from '@/lib/axios';
import getNonExistSubscriptions from '@/lib/getNonExistSubscriptions';
import useSubscriptionsStore from '@/stores/subscriptions';
import useTempAdminStore from '@/stores/tempAdminUser';
import useUserStore from '@/stores/user';

export default function AddSubscriptionForUser() {
  const { subscriptions } = useSubscriptionsStore();
  const { user, updateUser } = useTempAdminStore();
  const { user: activeUser, updateUser: updateMe } = useUserStore();
  const [nonExistSubscriptions, setNonExistSubscriptions] = useState<
    (typeof subscriptionsSchema.$inferSelect)[]
  >([]);

  useEffect(() => {
    setNonExistSubscriptions(
      getNonExistSubscriptions(subscriptions, user?.subscriptions.map((e) => e.subscription) ?? [])
    );
  }, [user, subscriptions]);

  const subscriptionsList: readonly [string, ...string[]] = [
    nonExistSubscriptions[0]?.title ?? '',
    ...nonExistSubscriptions.slice(1).map((x) => x.title),
  ];

  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formSchema = z.object({
    subscription: z
      .enum(subscriptionsList, {
        required_error: 'Підписка повинна бути вибрана',
      })
      .describe('Підписка'),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const subID = nonExistSubscriptions.find((x) => x.title === values.subscription);
    if (!subID) {
      return toast.error('Помилка вибору підписки');
    }
    try {
      setIsLoading(true);
      await Axios.put(`/api/user/${user?.id}/subscription/${subID.id}`);
      toast.success('Підписку додано');
      await updateUser(user?.id);
      if (user?.id === activeUser?.id) {
        await updateMe();
      }
      return setOpen(false);
    } catch (err) {
      if (err instanceof AxiosError) {
        return toast.error(err.response?.data.error ?? 'Помилка сервера');
      }
      return toast.error('Невідома помилка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' disabled={nonExistSubscriptions.length < 1}>
          <Icon icon='mdi:plus-circle-outline' fontSize='20px' className='mr-2' />
          Додати
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Додавання підписки користувачу</DialogTitle>
        </DialogHeader>
        <AutoForm formSchema={formSchema} onSubmit={onSubmit}>
          <DialogFooter className='flex-wrap gap-2'>
            <Button
              type='button'
              onClick={() => setOpen(false)}
              variant='outline'
              disabled={isLoading}
            >
              Скасувати
            </Button>
            <Button type='submit' disabled={isLoading}>
              Додати
            </Button>
          </DialogFooter>
        </AutoForm>
      </DialogContent>
    </Dialog>
  );
}
