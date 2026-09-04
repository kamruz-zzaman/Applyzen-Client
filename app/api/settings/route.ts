import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { findUserById } from "@/lib/users";
import { getLinkedProviders, getPasskeys } from "@/lib/security";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const [user, providers, passkeys] = await Promise.all([
    findUserById(session.user.id),
    getLinkedProviders(session.user.id),
    getPasskeys(session.user.id),
  ]);

  return NextResponse.json({
    name: user?.name ?? "",
    email: user?.email ?? session.user.email,
    image: user?.image ?? null,
    hasPassword: Boolean(user?.passwordHash),
    providers,
    passkeys,
  });
}
