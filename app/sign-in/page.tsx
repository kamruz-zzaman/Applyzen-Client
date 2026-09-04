"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { Logo } from "@/components/Logo";
import { useEffect, useState, type FormEvent } from "react";
import { OAuthButtons, PasskeySignInButton } from "@/components/AuthProviderButtons";
import { armConditionalPasskeySignIn } from "@/lib/passkey-autofill";

export default function SignInPage() {
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
