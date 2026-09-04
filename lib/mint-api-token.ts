import { SignJWT } from "jose";

// Signs a short-lived JWT the Express API can verify with the shared
// AUTH_SECRET. Auth.js's own session cookie is an encrypted JWE meant only
// for itself, so server code that needs to call Express mints one of these
// instead — same approach the client uses via /api/auth-token.
export async function mintApiToken(userId: string): Promise<string> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");

  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(new TextEncoder().encode(secret));
}
