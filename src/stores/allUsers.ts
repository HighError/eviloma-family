import { create } from 'zustand';

import Axios from '@/lib/axios';
import progress from '@/lib/progressbar';
import type FullUser from '@/types/fullUser';

type Store = {
  isPreLoaded: boolean;
  isLoading: boolean;
  isError: boolean;

  users: FullUser[];

  updateUsers: () => void;
};

const useUsersStore = create<Store>((set) => ({
  isPreLoaded: false,
  isLoading: true,
  isError: false,

  users: [],

  updateUsers: async () => {
    try {
      progress.start();
      set({
        isPreLoaded: true,
        isError: false,
        isLoading: true,
        users: [],
      });
      const response = await Axios.get('/api/users');
      set({
        isLoading: false,
        isError: false,
        users: response.data,
      });
    } catch (err) {
      set({ isError: true, isLoading: false });
    } finally {
      progress.finish();
    }
  },
}));

export default useUsersStore;
