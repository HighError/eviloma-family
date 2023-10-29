'use client';

import { useRouter } from 'next-nprogress-bar';
import React, { useEffect, useMemo, useState } from 'react';

import DesktopMenu from '@/components/admin/users/DesktopMenu';
import Information from '@/components/admin/users/informations/Information';
import MobileMenu from '@/components/admin/users/MobileMenu';
import Subscriptions from '@/components/admin/users/subscriptions/Subscriptions';
import Transactions from '@/components/admin/users/transactions/Transactions';
import useSubscriptionsStore from '@/stores/subscriptions';
import useTempAdminStore from '@/stores/tempAdminUser';

const menuItems = [
  {
    slug: '',
    title: 'Відомості',
    icon: 'mdi:information',
  },
  {
    slug: 'subscriptions',
    title: 'Підписки',
    icon: 'mdi:format-list-bulleted-type',
  },
  {
    slug: 'transactions',
    title: 'Транзакції',
    icon: 'mdi:receipt-outline',
  },
];

export default function AdminUser({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [menu, setMenu] = useState<string>('');
  const { user, isLoading, isError, updateUser } = useTempAdminStore();
  const {
    isPreLoaded,
    isError: isErrorSubscriptions,
    updateSubscriptions,
  } = useSubscriptionsStore();

  useEffect(() => {
    async function update() {
      if (user?.id !== params.id) {
        if (!isPreLoaded || isErrorSubscriptions) {
          await updateSubscriptions();
        }
        await updateUser(params.id);
      }
    }
    update();
  }, []);

  const actionItems = useMemo(
    () => [
      {
        title: 'Оновити',
        icon: 'mdi:refresh',
        onClick: () => {
          updateUser(params.id);
        },
      },
      {
        title: 'Назад',
        icon: 'mdi:arrow-left',
        onClick: () => router.push('/admin/users'),
      },
    ],
    [params.id, router, updateUser]
  );

  return (
    <div>
      <h2>Упраління користувачем</h2>
      <MobileMenu
        menu={menu}
        setMenu={setMenu}
        isLoading={isLoading}
        menuItems={menuItems}
        actionItems={actionItems}
      />
      <div className='mt-2 flex w-full flex-row gap-8 md:mt-6'>
        <DesktopMenu
          menu={menu}
          setMenu={setMenu}
          isLoading={isLoading}
          menuItems={menuItems}
          actionItems={actionItems}
        />
        {!isLoading && isError && (
          <div className='w-full text-center'>Помилка завантаження користувача</div>
        )}
        {!isLoading && !isError && !user && (
          <div className='w-full text-center'>Помилка завантаження користувача</div>
        )}
        {!isLoading && !isError && user && menu === '' && <Information />}
        {!isLoading && !isError && user && menu === 'subscriptions' && <Subscriptions />}
        {!isLoading && !isError && user && menu === 'transactions' && <Transactions />}
      </div>
    </div>
  );
}
