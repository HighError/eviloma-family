import React from 'react';

import AdminProvider from '@/components/AdminProvider';
import AuthProvider from '@/components/AuthProvider';
import CustomNavBar from '@/components/navbar/NavBar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminProvider>
        <CustomNavBar />
        <div className='mt-2 px-3 pb-4'>{children}</div>
      </AdminProvider>
    </AuthProvider>
  );
}
