import { Icon } from '@iconify/react';
import type { Dispatch, SetStateAction } from 'react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { HorizontalDivider } from '@/components/ui/divider';

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

export default function DesktopMenu({ menu, setMenu, isLoading, menuItems, actionItems }: IProps) {
  return (
    <div className='hidden w-64 flex-col gap-3 md:flex'>
      {menuItems.map((item) => (
        <Button
          key={item.title}
          variant={menu === item.slug ? 'secondary' : 'ghost'}
          disabled={isLoading}
          onClick={() => setMenu(item.slug)}
        >
          <Icon icon={item.icon} fontSize='20px' className='mr-2' />
          {item.title}
        </Button>
      ))}
      <HorizontalDivider />
      {actionItems.map((item) => (
        <Button key={item.title} variant='outline' onClick={item.onClick} disabled={isLoading}>
          <Icon icon={item.icon} fontSize='20px' className='mr-2' />
          {item.title}
        </Button>
      ))}
    </div>
  );
}
