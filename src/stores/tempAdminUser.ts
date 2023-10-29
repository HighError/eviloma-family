import { create } from 'zustand';

import type { transactionsSchema } from '@/db/schema';
import Axios from '@/lib/axios';
import progress from '@/lib/progressbar';
import type FullUser from '@/types/fullUser';

type Store = {
  isLoading: boolean;
  isError: boolean;

  user: FullUser | null;

  updateUser: (id?: string) => Promise<void>;
};

const useTempAdminStore = create<Store>((set) => ({
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
            (
              a: typeof transactionsSchema.$inferSelect,
              b: typeof transactionsSchema.$inferSelect
            ) => new Date(b.date).getTime() - new Date(a.date).getTime()
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
