import { Document, model, models, Schema } from 'mongoose';

export interface ITransaction extends Document {
  title: string;
  category: string;
  suma: number;
  date: string;
}

const transactionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    default: 'Other',
  },
  suma: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    require: true,
  },
});

const Transaction = models.Transaction || model<ITransaction>('Transaction', transactionSchema);
export default Transaction;
