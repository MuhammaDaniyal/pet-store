import "server-only";

import mongoose from "mongoose";

// Import all models to ensure they are registered
import "./models/Category";
import "./models/Product";
import "./models/User";
import "./models/Cart";
import "./models/Order";
import "./models/Review";
import "./models/SignupVerification";
import "./models/Coupon";
import "./models/Vet";
import "./models/Appointment";

type CachedMongoose = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: CachedMongoose | undefined;
}

const cached = globalThis.mongooseCache ?? { conn: null, promise: null };

globalThis.mongooseCache = cached;

export async function connectToDatabase() {
  const mongodbUri = process.env.MONGODB_URI;

  if (!mongodbUri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongodbUri);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}