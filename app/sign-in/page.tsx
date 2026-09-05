"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { Logo } from "@/components/Logo";
import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { OAuthButtons, PasskeySignInButton } from "@/components/AuthProviderButtons";
import { armConditionalPasskeySignIn } from "@/lib/passkey-autofill";

// Auth.js redirects back here with ?error=<code> on OAuth/callback failures —
// these codes are meant for logs, not users, so map the ones we can hit to
// plain language instead of leaving the raw code sitting in the URL unexplained.
const ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked:
    "That email is already used with a different sign-in method. Try signing in the way you originally created your account.",
  OAuthSignin: "Something went wrong connecting to that provider. Please try again.",
  OAuthCallback: "Something went wrong connecting to that provider. Please try again.",
  AccessDenied: "Access was denied.",
  Configuration: "Something's misconfigured on our end. Please try again later.",
  CredentialsSignin: "Invalid email or password.",
};

function SignInForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Also silently arms the browser's native autofill suggestion on the email
  // field, for anyone whose browser supports it — a bonus shortcut, not the
  // only way in. The button below is the primary, discoverable path.
  useEffect(() => {
    armConditionalPasskeySignIn("/dashboard").catch(() => {});
  }, []);

  useEffect(() => {
    const code = searchParams.get("error");
    if (code) setError(ERROR_MESSAGES[code] ?? "Something went wrong signing you in. Please try again.");
  }, [searchParams]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }
    window.location.href = "/dashboard";
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center bg-stone-50 px-4 py-12">
      <Link href="/" className="mb-8">
        <Logo />
      </Link>

      <div className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-8">
        <h1 className="mb-6 text-center text-xl font-semibold text-stone-900">Welcome back</h1>

        <OAuthButtons />

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <div className="mt-2">
          <PasskeySignInButton onError={setError} />
        </div>

        <div className="my-6 flex items-center gap-3 text-xs text-stone-400">
          <div className="h-px flex-1 bg-stone-200" />
          or
          <div className="h-px flex-1 bg-stone-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            className="input"
            autoComplete="username webauthn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            placeholder="Password"
            className="input"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-stone-500">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-medium text-amber-600 hover:text-amber-500">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
