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

export async function findUserById(userId: string) {
  const users = await usersCollection();
  return users.findOne({ _id: new ObjectId(userId) });
}

export async function updateUserName(userId: string, name: string) {
  const users = await usersCollection();
  await users.updateOne({ _id: new ObjectId(userId) }, { $set: { name } });
}

export async function updateUserImage(userId: string, image: string) {
  const users = await usersCollection();
  await users.updateOne({ _id: new ObjectId(userId) }, { $set: { image } });
}

export async function setPassword(userId: string, newPassword: string, currentPassword?: string) {
  const users = await usersCollection();
  const user = await users.findOne({ _id: new ObjectId(userId) });
  if (!user) throw new Error("User not found");

  if (user.passwordHash) {
    if (!currentPassword) throw new Error("Current password is required");
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) throw new Error("Current password is incorrect");
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await users.updateOne({ _id: new ObjectId(userId) }, { $set: { passwordHash } });
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
