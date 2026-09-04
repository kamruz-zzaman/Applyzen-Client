import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { clientPromise } from "@/lib/mongodb";
import { mintApiToken } from "@/lib/mint-api-token";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const token = await mintApiToken(userId);
    const res = await fetch(`${API_URL}/api/job-applications`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok && res.status !== 204) {
      throw new Error(`Failed to delete job applications (${res.status})`);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete account data";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const client = await clientPromise;
  const db = client.db();
  const objectId = new ObjectId(userId);

  await Promise.all([
    db.collection("users").deleteOne({ _id: objectId }),
    db.collection("accounts").deleteMany({ userId: objectId }),
    db.collection("sessions").deleteMany({ userId: objectId }),
    db.collection("authenticators").deleteMany({ userId }),
  ]);

  return NextResponse.json({ ok: true });
}
