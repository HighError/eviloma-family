'use client';

import { Icon } from '@iconify/react';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import * as z from 'zod';

import AutoForm from '@/components/ui/auto-form';
import { Button } from '@/components/ui/button';
import Axios from '@/lib/axios';
import { subsCategory } from '@/lib/categoryList';
import useSubscriptionsStore from '@/stores/subscriptions';

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';

const subsCategoryList: readonly [string, ...string[]] = [
  subsCategory[0].name,
  ...subsCategory.slice(1).map((x) => x.name),
];

const formSchema = z.object({
  id: z
    .string({ required_error: 'ID підписки повинна бути заповнена' })
    .min(3, { message: 'ID підписки повинна бути більша за 2 символа' })
    .max(50, { message: 'ID підписки повинна бути менша за 50 символів' })
    .describe('ID підписки')
    .default(''),
  title: z
    .string({ required_error: 'Назва підписки повинна бути заповнена' })
    .min(3, { message: 'Назва підписки повинна бути більша за 2 символа' })
    .max(50, { message: 'Назва підписки повинна бути менша за 50 символів' })
    .describe('Назва підписки')
    .default(''),
  category: z
    .enum(subsCategoryList, {
      required_error: 'Категорія повинна бути заповнена',
    })
    .describe('Категорія'),
  date: z.coerce
    .date({ required_error: 'Дата повинна бути заповнена' })
    .min(new Date(), { message: 'Дата повинна не раніше ніж завтра' })
    .describe('Дата наступної оплати')
    .default(new Date()),
  cost: z.coerce
    .number({ required_error: 'Ціна повинна бути заповнена' })
    .min(0.01, { message: 'Ціна повинна бути більша за 0' })
    .describe('Ціна')
    .default(0),
});

export default function NewSubscription() {
  const { updateSubscriptions, isLoading } = useSubscriptionsStore();
  const [open, setOpen] = useState<boolean>(false);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const data = {
      ...values,
      cost: values.cost * 100,
    };
    try {
      await Axios.post('/api/subscriptions', data);
      await updateSubscriptions();
      setOpen(false);
      return toast.success('Підписка створена');
    } catch (err) {
      if (err instanceof AxiosError) {
        return toast.error(err.response?.data.error ?? 'Помилка сервера');
      }
      return toast.error('Невідома помилка');
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant='outline'>
          <Icon icon='mdi:plus-circle-outline' fontSize='20px' className='mr-2' />
          Створити
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Створення нової підписки</SheetTitle>
        </SheetHeader>
        <AutoForm
          formSchema={formSchema}
          onSubmit={onSubmit}
          fieldConfig={{
            category: {
              description: 'Ви не зможете змінити категорію пізніше',
            },
          }}
        >
          <SheetFooter className='flex-wrap gap-2'>
            <Button
              type='button'
              onClick={() => setOpen(false)}
              variant='outline'
              disabled={isLoading}
            >
              Скасувати
            </Button>
            <Button type='submit' disabled={isLoading}>
              Створити
            </Button>
          </SheetFooter>
        </AutoForm>
      </SheetContent>
    </Sheet>
  );
}
