import { MongoDBAdapter, defaultCollections, format } from "@auth/mongodb-adapter";
import type { Adapter, AdapterAuthenticator } from "@auth/core/adapters";
import { clientPromise } from "./mongodb";

const AUTHENTICATORS_COLLECTION = "authenticators";

// @auth/mongodb-adapter@3.x doesn't implement the WebAuthn (passkey) or
// getAccount adapter methods yet, so we bolt them on ourselves — storing
// authenticators in their own collection and reusing the adapter's
// document <-> plain-object `format` helpers for the rest.
export function buildAuthAdapter(): Adapter {
  const base = MongoDBAdapter(clientPromise);

  async function db() {
    const client = await clientPromise;
    return client.db();
  }

  return {
    ...base,

    async getAccount(providerAccountId, provider) {
      const database = await db();
      const account = await database
        .collection(defaultCollections.Accounts)
        .findOne({ providerAccountId, provider });
      return account && format.from(account);
    },

    async getAuthenticator(credentialID) {
      const database = await db();
      const doc = await database.collection(AUTHENTICATORS_COLLECTION).findOne({ credentialID });
      if (!doc) return null;
      const { _id, ...authenticator } = doc;
      return authenticator as AdapterAuthenticator;
    },

    async createAuthenticator(authenticator) {
      const database = await db();
      await database.collection(AUTHENTICATORS_COLLECTION).insertOne({ ...authenticator });
      return authenticator;
    },

    async listAuthenticatorsByUserId(userId) {
      const database = await db();
      const docs = await database.collection(AUTHENTICATORS_COLLECTION).find({ userId }).toArray();
      return docs.map(({ _id, ...authenticator }) => authenticator as AdapterAuthenticator);
    },

    async updateAuthenticatorCounter(credentialID, newCounter) {
      const database = await db();
      const doc = await database
        .collection(AUTHENTICATORS_COLLECTION)
        .findOneAndUpdate({ credentialID }, { $set: { counter: newCounter } }, { returnDocument: "after" });
      if (!doc) throw new Error("Authenticator not found");
      const { _id, ...authenticator } = doc;
      return authenticator as AdapterAuthenticator;
    },
  };
}
