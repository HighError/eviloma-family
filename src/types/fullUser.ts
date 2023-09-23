import { ISubscription } from '@/models/Subscription';
import { ITransaction } from '@/models/Transaction';

type FullUser = {
  id: string; // id from database
  sub: string; // id from logto
  username: string | null; // username from logto
  email: string; // email from logto
  avatar: string | null; // avatar from logto
  balance: number; // balance from database
  paymentLink: string | null; // paymentLink from database
  telegramID: string | null; // telegramID from database
  subscriptions: ISubscription[]; // subscriptionCount from database
  transactions: ITransaction[]; // transactionCount from database
};

export default FullUser;
