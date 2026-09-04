import { ObjectId } from "mongodb";
import { clientPromise } from "./mongodb";

// "accounts" is managed by the base MongoDBAdapter, which stores userId as an
// ObjectId (see its format.to()). "authenticators" is our own collection
// (lib/auth-adapter.ts) where we store userId as the plain hex string Auth.js
// hands us — the two collections are intentionally inconsistent with each
// other, so each query below matches its own collection's actual shape.

export async function getLinkedProviders(userId: string): Promise<string[]> {
  const client = await clientPromise;
  const accounts = await client
    .db()
    .collection("accounts")
    .find({ userId: new ObjectId(userId) })
    .toArray();
  return accounts.map((a) => a.provider as string);
}

export interface PasskeySummary {
  credentialID: string;
  credentialDeviceType: string;
  createdAt: string | null;
}

export async function getPasskeys(userId: string): Promise<PasskeySummary[]> {
  const client = await clientPromise;
  const docs = await client.db().collection("authenticators").find({ userId }).toArray();
  return docs.map((d) => ({
    credentialID: d.credentialID as string,
    credentialDeviceType: d.credentialDeviceType as string,
    createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : null,
  }));
}

export async function deletePasskey(userId: string, credentialID: string): Promise<boolean> {
  const client = await clientPromise;
  const result = await client
    .db()
    .collection("authenticators")
    .deleteOne({ userId, credentialID });
  return result.deletedCount > 0;
}
