import { create } from 'zustand';

import Axios from '@/lib/axios';
import progress from '@/lib/progressbar';
import { ITransaction } from '@/models/Transaction';
import FullUser from '@/types/fullUser';

interface iStore {
  isLoading: boolean;
  isError: boolean;

  user: FullUser | null;

  updateUser: (id?: string) => Promise<void>;
}

const useTempAdminStore = create<iStore>((set) => ({
  isLoading: true,
  isError: false,

  user: null,

  updateUser: async (id?: string) => {
    if (!id) {
      return;
    }

    progress.start();
    set({
      isLoading: true,
      isError: false,
      user: null,
    });

    try {
      const response = await Axios.get(`/api/user/${id}`);
      set({
        isLoading: false,
        isError: false,
        user: {
          ...response.data,
          transactions: response.data.transactions.sort(
            (a: ITransaction, b: ITransaction) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          ),
        },
      });
    } catch (err) {
      set({ isError: true, isLoading: false });
    } finally {
      progress.finish();
    }
  },
}));

export default useTempAdminStore;
