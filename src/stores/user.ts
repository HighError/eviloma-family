import { create } from 'zustand';

import Axios from '@/lib/axios';
import progress from '@/lib/progressbar';
import type FullUser from '@/types/fullUser';

type Store = {
  isLoading: boolean;
  isError: boolean;
  isAuth: boolean;
  user?: FullUser;

  updateUser: () => Promise<void>;
};

const useUserStore = create<Store>((set) => ({
  isLoading: true,
  isError: false,

  isAuth: false,

  updateUser: async () => {
    try {
      progress.start();
      const response = await Axios.get('/api/user');

      const { data } = response;
      set({ isLoading: false, isError: false, isAuth: data.isAuth, user: data.user });
    } catch (err) {
      set({ isError: true, isLoading: false });
    } finally {
      progress.finish();
    }
  },
}));

export default useUserStore;
