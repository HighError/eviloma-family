'use client';

import React, { useEffect } from 'react';

import UserItem from '@/components/admin/users/UserItem';
import useUsersStore from '@/stores/allUsers';

export default function AdminUsers() {
  const { isPreLoaded, isLoading, isError, users, updateUsers } = useUsersStore();

  useEffect(() => {
    if (!isPreLoaded) {
      updateUsers();
    }
  }, [isPreLoaded, updateUsers]);

  return (
    <>
      <h2 className='mb-4 text-center text-2xl font-semibold'>Список користувачів</h2>
      {!isLoading && isError && (
        <div className='text-center'>Помилка при завантаженні підписок. Спробуйте ще раз...</div>
      )}
      {!isLoading && !isError && (
        <div className='grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3'>
          {users.map((user) => {
            return (
              <UserItem
                key={user.id}
                id={user.id}
                sub={user.sub}
                username={user.username}
                email={user.email}
                avatar={user.avatar}
                balance={user.balance / 100}
                subscriptionsCount={user.subscriptions.length}
                transactionsCount={user.transactions.length}
              />
            );
          })}
        </div>
      )}
    </>
  );
}
