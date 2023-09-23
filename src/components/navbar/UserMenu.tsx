'use client';

import { Icon } from '@iconify/react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';
import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useUserStore from '@/stores/user';

export default function UserMenu() {
  const { avatar, username, email, isAdmin } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className='cursor-pointer duration-100 hover:border-[1px] hover:border-muted'>
          <AvatarImage src={avatar ?? ''} alt='avatar image' />
          <AvatarFallback>
            {username?.slice(0, 1).toUpperCase() ?? email?.slice(0, 1).toUpperCase() ?? '?'}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel className='font-semibold'>
          <div>Ви увійшли як</div>
          <div>{username ?? email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup title='Мій аккаунт'>
          <DropdownMenuItem
            onClick={() => {
              if (pathname != '/dashboard') router.push('/dashboard');
            }}
          >
            <Icon icon='mdi:view-dashboard-outline' fontSize='18px' className='mr-2' />
            Панель управління
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (pathname != '/dashboard/subscriptions') router.push('/dashboard/subscriptions');
            }}
          >
            <Icon icon='mdi:format-list-bulleted-type' fontSize='18px' className='mr-2' />
            Мої підписки
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (pathname != '/dashboard/transactions') router.push('/dashboard/transactions');
            }}
          >
            <Icon icon='mdi:receipt-outline' fontSize='18px' className='mr-2' />
            Мої транзакції
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuGroup>
        <DropdownMenuGroup title='Адмін-панель' className={!isAdmin ? 'hidden' : ''}>
          <DropdownMenuItem
            onClick={() => {
              if (pathname != '/admin/subscriptions') router.push('/admin/subscriptions');
            }}
          >
            <Icon icon='mdi:playlist-edit' fontSize='18px' className='mr-2' />
            Управління підписками
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (pathname != '/admin/users') router.push('/admin/users');
            }}
          >
            <Icon icon='mdi:account-edit' fontSize='18px' className='mr-2' />
            Управління користувачами
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuGroup>
        <DropdownMenuGroup title='Налаштування'>
          <DropdownMenuItem onClick={() => router.push('/api/logto/sign-out')}>
            <Icon icon='mdi:logout' fontSize='18px' className='mr-2' />
            Вийти
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
