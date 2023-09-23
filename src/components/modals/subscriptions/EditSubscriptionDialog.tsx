import { Icon } from '@iconify/react';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import * as z from 'zod';

import Axios from '@/lib/axios';
import useSubscriptionsStore from '@/stores/subscriptions';
import useUserStore from '@/stores/user';

import AutoForm from '../../ui/auto-form';
import { Button } from '../../ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog';

interface iProps {
  id: string;
  title: string;
  date: Date;
  cost: number;
}

const formSchema = z.object({
  title: z
    .string({ required_error: 'Назва підписки повинна бути заповнена' })
    .min(3, { message: 'Назва підписки повинна бути більша за 2 символа' })
    .max(50, { message: 'Назва підписки повинна бути менша за 50 символів' })
    .describe('Назва підписки'),
  date: z.coerce
    .date({ required_error: 'Дата повинна бути заповнена' })
    .min(new Date(), { message: 'Дата повинна не раніше ніж завтра' })
    .describe('Дата наступної оплати'),
  cost: z.coerce
    .number({ required_error: 'Ціна повинна бути заповнена' })
    .min(0, { message: 'Ціна повинна бути більша за 0' })
    .describe('Ціна'),
});

export default function EditSubscriptionDialog({ id, title, date, cost }: iProps) {
  const { updateSubscriptions, isLoading } = useSubscriptionsStore();
  const { updateUser } = useUserStore();
  const [open, setOpen] = useState<boolean>(false);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data = { ...values, cost: values.cost * 100 };
    try {
      await Axios.put(`/api/subscriptions/${id}`, data);
      await updateSubscriptions();
      await updateUser();
      return toast.success('Підписка оновлена');
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
        <Button variant='outline' disabled={isLoading}>
          <Icon icon='mdi:pencil' fontSize='20px' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редагування підписки</DialogTitle>
        </DialogHeader>
        <AutoForm
          formSchema={formSchema}
          onSubmit={onSubmit}
          values={{
            title,
            date,
            cost,
          }}
        >
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
              Змінити
            </Button>
          </DialogFooter>
        </AutoForm>
      </DialogContent>
    </Dialog>
  );
}
