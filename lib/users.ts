import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { clientPromise } from "./mongodb";

// Shares the "users" collection with the Auth.js MongoDB adapter — OAuth
// sign-ins and email/password sign-ups both land here, keyed by email.
interface UserDoc {
  _id: ObjectId;
  email: string;
  name?: string;
  image?: string;
  passwordHash?: string;
  emailVerified?: Date | null;
}

async function usersCollection() {
  const client = await clientPromise;
  return client.db().collection<UserDoc>("users");
}

export async function findUserByEmail(email: string) {
  const users = await usersCollection();
  return users.findOne({ email: email.toLowerCase() });
}

export async function createUserWithPassword(email: string, password: string, name?: string) {
  const users = await usersCollection();
  const existing = await findUserByEmail(email);
  if (existing) throw new Error("An account with this email already exists");

  const passwordHash = await bcrypt.hash(password, 12);
  const result = await users.insertOne({
    _id: new ObjectId(),
    email: email.toLowerCase(),
    name,
    passwordHash,
    emailVerified: null,
  });
  return result.insertedId;
}

export async function verifyPassword(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user?.passwordHash) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  return valid ? user : null;
}
