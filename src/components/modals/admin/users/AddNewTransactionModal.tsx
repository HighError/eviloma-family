import { Icon } from '@iconify/react';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
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
import Axios from '@/lib/axios';
import { transactionCategory } from '@/lib/categoryList';
import useTempAdminStore from '@/stores/tempAdminUser';
import useUserStore from '@/stores/user';

const transactionCategoryList: readonly [string, ...string[]] = [
  transactionCategory[0].name,
  ...transactionCategory.slice(1).map((x) => x.name),
];

const formSchema = z.object({
  title: z
    .string({ required_error: 'Назва транзакції повинна бути заповнена' })
    .min(3, { message: 'Назва транзакції повинна бути більша за 2 символа' })
    .max(50, { message: 'Назва підписки повинна бути менша за 50 символів' })
    .describe('Назва підписки'),
  category: z
    .enum(transactionCategoryList, {
      required_error: 'Категорія повинна бути заповнена',
    })
    .describe('Категорія'),
  date: z.coerce.date().describe('Дата'),
  suma: z.coerce.number({ required_error: 'Сума повинна бути заповнена' }).describe('Сума'),
});

export default function AddNewTransactionModal() {
  const { user, updateUser } = useTempAdminStore();
  const { id, updateUser: updateMe } = useUserStore();

  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    values = { ...values, suma: values.suma * 100 };
    try {
      setIsLoading(true);
      await Axios.post(`/api/user/${user?.id}/transaction`, values);
      await updateUser(user?.id);
      if (user?.id === id) {
        await updateMe();
      }
      setOpen(false);
      return toast.success('Транзакцію додано');
    } catch (err) {
      if (err instanceof AxiosError) {
        return toast.error(err.response?.data.error ?? 'Помилка сервера');
      }
      return toast.error('Невідома помилка');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>
          <Icon icon='mdi:plus-circle-outline' fontSize='20px' className='mr-2' />
          Додати
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Додавання транзакції</DialogTitle>
        </DialogHeader>
        <AutoForm
          formSchema={formSchema}
          onSubmit={onSubmit}
          fieldConfig={{
            date: {
              fieldType: 'datetime',
            },
            suma: {
              description: `Сума транзакції в гривнях. Введіть від'ємне значення, якщо транзакція повинна знімати гроші з рахунку користувача.`,
            },
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
              Додати
            </Button>
          </DialogFooter>
        </AutoForm>
      </DialogContent>
    </Dialog>
  );
}
