import { Icon } from '@iconify/react';
import type { Dispatch, SetStateAction } from 'react';
import React from 'react';

import { Button } from '@/components/ui/button';

interface IProps {
  menu: string;
  setMenu: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
  menuItems: {
    slug: string;
    title: string;
    icon: string;
  }[];
  actionItems: {
    title: string;
    icon: string;
    onClick: () => void;
  }[];
}

export default function MobileMenu({ menu, setMenu, isLoading, menuItems, actionItems }: IProps) {
  return (
    <div className='mt-2 flex flex-row items-center justify-between gap-2 md:hidden'>
      <Button variant='outline' size='icon' onClick={actionItems[1].onClick} disabled={isLoading}>
        <Icon icon={actionItems[1].icon} fontSize='20px' />
      </Button>
      <div className='flex flex-row gap-2'>
        {menuItems.map((item) => (
          <Button
            key={item.title}
            variant={menu === item.slug ? 'secondary' : 'ghost'}
            size='icon'
            disabled={isLoading}
            onClick={() => setMenu(item.slug)}
          >
            <Icon icon={item.icon} fontSize='20px' />
          </Button>
        ))}
      </div>
      <Button variant='outline' size='icon' onClick={actionItems[0].onClick} disabled={isLoading}>
        <Icon icon={actionItems[0].icon} fontSize='20px' />
      </Button>
    </div>
  );
}
