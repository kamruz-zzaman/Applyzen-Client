import mongoose from "mongoose";

const uri = process.env.JOB_APPLICATIONS_MONGODB_URI;
if (!uri) throw new Error("JOB_APPLICATIONS_MONGODB_URI is not set");

// Reuse the connection across hot reloads in dev so we don't open a new
// connection pool on every file change (mirrors client/lib/mongodb.ts).
const globalForMongoose = globalThis as unknown as { _mongoosePromise?: Promise<typeof mongoose> };

mongoose.set("strictQuery", true);

export const dbPromise = globalForMongoose._mongoosePromise ?? mongoose.connect(uri);

if (process.env.NODE_ENV === "development") {
  globalForMongoose._mongoosePromise = dbPromise;
}
