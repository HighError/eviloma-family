import { create } from 'zustand';

import Axios from '@/lib/axios';
import progress from '@/lib/progressbar';
import { ISubscription } from '@/models/Subscription';

interface iStore {
  isPreLoaded: boolean;
  isLoading: boolean;
  isError: boolean;

  subscriptions: ISubscription[];

  updateSubscriptions: () => Promise<void>;
}

const useSubscriptionsStore = create<iStore>((set) => ({
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
