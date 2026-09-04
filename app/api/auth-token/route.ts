import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { mintApiToken } from "@/lib/mint-api-token";

// Mints a short-lived, plainly-signed JWT for the Express API to verify.
// Auth.js's own session cookie is an encrypted JWE meant only for itself,
// so the client fetches this instead and sends it as a Bearer token.
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const token = await mintApiToken(session.user.id);
    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }
}
