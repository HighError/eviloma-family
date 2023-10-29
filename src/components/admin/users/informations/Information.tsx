import { Icon } from '@iconify/react';
import { AxiosError } from 'axios';
import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { HorizontalDivider } from '@/components/ui/divider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Axios from '@/lib/axios';
import isValidUrl from '@/lib/isValidUrl';
import { getMoneyFormat } from '@/lib/moneyFormat';
import useTempAdminStore from '@/stores/tempAdminUser';
import useUserStore from '@/stores/user';

export default function Information() {
  const { user, updateUser } = useTempAdminStore();
  const { user: activeUser, updateUser: updateMe } = useUserStore();
  const [url, setUrl] = useState<string>(user?.paymentLink ?? '');

  async function updatePaymentLink() {
    if (!isValidUrl(url)) {
      return toast.error('Некоректний URL');
    }
    try {
      await Axios.put(`/api/user/${user?.id}/paymentlink`, { url });
      toast.success('Спосіб оплати оновлено');
      await updateUser(user?.id);
      if (activeUser?.id === user?.id) {
        await updateMe();
      }
      return null;
    } catch (err) {
      if (err instanceof AxiosError) {
        return toast.error(err.response?.data.error);
      }
      return toast.error('Не вдалося оновити спосіб оплати');
    }
  }

  return (
    <div className='w-full pb-5'>
      <h3>Інформація</h3>
      <HorizontalDivider />
      <div className='mt-4 flex max-w-3xl flex-col gap-6 md:gap-10'>
        <div className='space-y-2'>
          <Label htmlFor='id'>Eviloma ID</Label>
          <Input id='id' value={user?.id} readOnly />
          <p className='text-sm text-muted-foreground'>ID користувача в системі Eviloma.</p>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='email'>Email</Label>
          <Input id='sub' type='email' value={user?.email} readOnly />
          <p className='text-sm text-muted-foreground'>
            Email користувача. Користувач не може змінювати свій Email.
          </p>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='username'>Username</Label>
          <Input id='username' value={user?.username ?? ''} readOnly />
          <p className='text-sm text-muted-foreground'>
            Username користувача. Користувач може не мати Username, тоді це поле буде пусте, а в
            додатку буде використовуватись Email замість Username.
          </p>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='sub'>Аватар</Label>
          <div className='flex flex-row items-center gap-4'>
            <Avatar>
              <AvatarImage src={user?.avatar ?? ''} />
              <AvatarFallback>
                {user?.username?.slice(0, 1).toUpperCase() ??
                  user?.email?.slice(0, 1).toUpperCase() ??
                  '?'}
              </AvatarFallback>
            </Avatar>
            <Input id='sub' value={user?.avatar ?? ''} readOnly />
          </div>
          <p className='text-sm text-muted-foreground'>
            Аватар користувача. Поле з посиланням на аватар користувача може бути пустим, якщо
            користувач не додавав свій аватар. Якщо поле пусте, то буде використовуватись базовим
            аватар з двома першими літерами Username або Email.
          </p>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='balance'>Баланс</Label>
          <Input
            id='balance'
            value={getMoneyFormat(false).format((user?.balance ?? 0) / 100)}
            readOnly
          />
          <p className='text-sm text-muted-foreground'>
            Баланс користувача в гривнях. Зміна баланс повинна проходити лише за допомогою
            транзакцій.
          </p>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='balance'>Посилання для оплати</Label>
          <p className='text-sm'>
            Попереднє посилання:
            <Link href={user?.paymentLink ?? ''}>{` ${
              user?.paymentLink ?? '(посилання відсутнє)'
            }`}</Link>
          </p>
          <div className='flex flex-row gap-3'>
            <Input
              id='balance'
              type='url'
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
              }}
            />
            <Button size='icon' variant='outline' onClick={() => updatePaymentLink()}>
              <Icon icon='mdi:content-save' />
            </Button>
          </div>
          <p className='text-sm text-muted-foreground'>
            Посилання для оплати. Поле може бути пустим, якщо адміністратор не налаштував оплату,
            тоді користувач не зможе поповнити баланс.
          </p>
        </div>
      </div>
    </div>
  );
}
