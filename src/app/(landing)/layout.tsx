import React from 'react';

import CustomNavBar from '@/components/navbar/NavBar';

export default function HomePageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomNavBar />
      <div className='mt-2 px-3 pb-4'>{children}</div>
    </>
  );
}
