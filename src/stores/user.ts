import { create } from 'zustand';

import Axios from '@/lib/axios';
import progress from '@/lib/progressbar';
import { ISubscription } from '@/models/Subscription';
import { ITransaction } from '@/models/Transaction';

interface iStore {
  isLoading: boolean;
  isError: boolean;

  isAuth: boolean;
  isAdmin: boolean;

  id: string | null;
  sub: string | null;
  email: string | null;
  username: string | null;
  avatar: string | null;

  balance: number | null;
  paymentLink: string | null;
  telegram: string | null;
  subscriptions: ISubscription[] | null;
  transactions: ITransaction[] | null;

  updateUser: () => Promise<void>;
}

const useUserStore = create<iStore>((set) => ({
  isLoading: true,
  isError: false,

  isAuth: false,
  isAdmin: false,

  id: null,
  sub: null,
  email: null,
  username: null,
  avatar: null,

  balance: null,
  paymentLink: null,
  subscriptions: null,
  telegram: null,
  transactions: null,

  updateUser: async () => {
    try {
      progress.start();
      const response = await Axios.get('/api/user');

      const { data } = response;
      set({
        isLoading: false,
        isAuth: data.isAuth,
        isAdmin: data.isAdmin ?? false,
        id: data.id,
        sub: data.sub,
        email: data.email,
        username: data.username,
        avatar: data.avatar,
        balance: data.data?.balance,
        paymentLink: data.data?.paymentLink,
        telegram: data.data?.telegram,
        subscriptions: data.data?.subscriptions,
        transactions: data.data?.transactions.sort(
          (a: ITransaction, b: ITransaction) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
      });
    } catch (err) {
      set({ isError: true, isLoading: false });
    } finally {
      progress.finish();
    }
  },
}));

export default useUserStore;
