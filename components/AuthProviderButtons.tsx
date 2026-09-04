"use client";

import { signIn } from "next-auth/react";
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
