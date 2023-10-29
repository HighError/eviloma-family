import type { subscriptionsSchema, transactionsSchema, usersSchema } from '@/db/schema';

type FullUser = typeof usersSchema.$inferSelect & {
  subscriptions: {
    subscription: typeof subscriptionsSchema.$inferSelect;
  }[];
  transactions: (typeof transactionsSchema.$inferSelect)[];
  email: string;
  username: string | null;
  avatar: string | null;
};

export default FullUser;
