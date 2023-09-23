import React from 'react';

import AuthProvider from '@/components/AuthProvider';
import CustomNavBar from '@/components/navbar/NavBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CustomNavBar />
      <div className='mt-2 px-3 pb-4'>{children}</div>
    </AuthProvider>
  );
}
