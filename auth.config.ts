import type { NextAuthConfig } from "next-auth";

// Exact-match public routes — "/" is the marketing landing page, not the app.
const PUBLIC_PATHS = ["/", "/sign-in", "/sign-up"];

// Edge-safe subset of the auth config — used by middleware, which can't load
// bcrypt/MongoDB (Node-only). The full config with providers lives in auth.ts.
export const authConfig = {
  pages: { signIn: "/sign-in" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isPublicPath = PUBLIC_PATHS.includes(request.nextUrl.pathname);

      if (!isLoggedIn && !isPublicPath) return false;
      if (isLoggedIn && isPublicPath) {
        return Response.redirect(new URL("/dashboard", request.nextUrl.origin));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
