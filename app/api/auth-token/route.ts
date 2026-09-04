import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { auth } from "@/auth";

// Mints a short-lived, plainly-signed JWT for the Express API to verify.
// Auth.js's own session cookie is an encrypted JWE meant only for itself,
// so the client fetches this instead and sends it as a Bearer token.
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.user.id)
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(new TextEncoder().encode(secret));

  return NextResponse.json({ token });
}
