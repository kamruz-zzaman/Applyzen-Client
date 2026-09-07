"use client";

import { KeyRound } from "lucide-react";
import { signIn } from "next-auth/react";
import { signIn as signInWithPasskey } from "next-auth/webauthn";
import { useState } from "react";
import { GitHubIcon, GoogleIcon, MicrosoftIcon } from "./icons";

const OAUTH_PROVIDERS = [
  { id: "google", label: "Continue with Google", Icon: GoogleIcon },
  { id: "microsoft-entra-id", label: "Continue with Microsoft", Icon: MicrosoftIcon },
  { id: "github", label: "Continue with GitHub", Icon: GitHubIcon },
];

export function OAuthButtons() {
  return (
    <div className="space-y-2">
      {OAUTH_PROVIDERS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => signIn(id, { callbackUrl: "/dashboard" })}
          className="btn-secondary w-full"
        >
          <Icon />
          {label}
        </button>
      ))}
    </div>
  );
}

// Sign-in (unlike sign-up) needs no email up front — a passkey's userHandle
// already identifies the account, so this opens the browser's native
// passkey picker directly on click. No shared/ambiguous field involved.
export function PasskeySignInButton({ onError }: { onError: (message: string) => void }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      // redirect: false is required here — the default (true) makes next-auth
      // hard-navigate to Auth.js's raw /api/auth/error page on failure (e.g. a
      // passkey your browser remembers but the server has no record of),
      // bypassing this component's error handling entirely.
      const result = await signInWithPasskey("passkey", { callbackUrl: "/dashboard", redirect: false });
      if (result?.error) {
        onError(
          "That passkey isn't recognized for any account here. Try a different sign-in method, or add a fresh passkey from Settings once you're signed in."
        );
        return;
      }
      window.location.href = result?.url ?? "/dashboard";
    } catch {
      onError("Passkey sign-in failed or was cancelled.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button type="button" onClick={handleClick} disabled={loading} className="btn-secondary w-full">
      <KeyRound className="h-4 w-4" />
      {loading ? "Waiting for passkey..." : "Sign in with a passkey"}
    </button>
  );
}
