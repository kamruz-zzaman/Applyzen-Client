import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not set");

// Reuse the client across hot reloads in dev so we don't open a new
// connection pool on every file change.
const globalForMongo = globalThis as unknown as { _mongoClientPromise?: Promise<MongoClient> };

const client = new MongoClient(uri);
export const clientPromise = globalForMongo._mongoClientPromise ?? client.connect();

if (process.env.NODE_ENV === "development") {
  globalForMongo._mongoClientPromise = clientPromise;
}
