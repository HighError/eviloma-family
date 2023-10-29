import { create } from 'zustand';

import type { subscriptionsSchema } from '@/db/schema';
import Axios from '@/lib/axios';
import progress from '@/lib/progressbar';

type Store = {
  isPreLoaded: boolean;
  isLoading: boolean;
  isError: boolean;

  subscriptions: (typeof subscriptionsSchema.$inferSelect)[];

  updateSubscriptions: () => Promise<void>;
};

const useSubscriptionsStore = create<Store>((set) => ({
  isPreLoaded: false,
  isLoading: true,
  isError: false,
  subscriptions: [],

  updateSubscriptions: async () => {
    try {
      progress.start();
      set({
        isPreLoaded: true,
        isError: false,
        isLoading: true,
        subscriptions: [],
      });
      const response = await Axios.get('/api/subscriptions');
      set({
        isLoading: false,
        isError: false,
        subscriptions: response.data,
      });
    } catch (err) {
      set({ isError: true, isLoading: false });
    } finally {
      progress.finish();
    }
  },
}));

export default useSubscriptionsStore;
