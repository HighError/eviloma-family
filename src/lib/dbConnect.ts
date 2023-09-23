import '@/models/Subscription';
import '@/models/Transaction';
import '@/models/User';

import mongoose, { Mongoose } from 'mongoose';

interface IMongoose {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const { MONGODB_URI } = process.env;

const globalWithMongoose = global as typeof globalThis & {
  mongoose: IMongoose;
};

let cached = globalWithMongoose.mongoose;

if (!cached) {
  globalWithMongoose.mongoose = { conn: null, promise: null };
  cached = globalWithMongoose.mongoose;
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((db) => db);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
