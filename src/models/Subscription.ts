import { Document, model, models, Schema } from 'mongoose';

export interface ISubscription extends Document {
  title: string;
  category: string;
  cost: number;
  date: Date;
}

const subscriptionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const Subscription =
  models.Subscription || model<ISubscription>('Subscription', subscriptionSchema);
export default Subscription;
