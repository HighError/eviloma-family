import { Document, model, models, Schema } from 'mongoose';

export interface ITempToken extends Document {
  user: string;
  token: string;
  date: string;
}

const tempToken = new Schema({
  user: {
    type: String,
    require: true,
  },
  token: {
    type: String,
    require: true,
  },
  date: {
    type: Schema.Types.Date,
    require: true,
  },
});

const TempToken = models.TempToken || model<ITempToken>('TempToken', tempToken);
export default TempToken;
