import { Document, model, models, Schema } from 'mongoose';

import { ISubscription } from './Subscription';
import { ITransaction } from './Transaction';

export interface IUser extends Document {
  sub: string;
  balance: number;
  subscriptions: ISubscription[];
  transactions: ITransaction[];
  paymentLink: string;
  telegramID: string;
  isAdmin: boolean;
}

export const userSchema: Schema = new Schema({
  sub: {
    type: String,
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
  subscriptions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
    },
  ],
  transactions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
    },
  ],
  paymentLink: {
    type: String,
    default: '',
  },
  telegramID: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const User = models.User || model<IUser>('User', userSchema);
export default User;
