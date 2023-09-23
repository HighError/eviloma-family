import React from 'react';

import Balance from '@/components/overview/Balance';
import LastTransactions from '@/components/overview/LastTransactions';

export default function DashboardPage() {
  return (
    <div className='grid gap-5 text-center lg:grid-cols-3'>
      <LastTransactions />
      <Balance />
    </div>
  );
}
