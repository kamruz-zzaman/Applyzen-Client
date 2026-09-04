"use client";

import { browserSupportsWebAuthnAutofill, startAuthentication } from "@simplewebauthn/browser";
import { getCsrfToken } from "next-auth/react";

// Standard passkey sign-in doesn't use a button — GitHub, Google, etc. surface
// the passkey as a native autofill suggestion on the existing username field
// (autocomplete="username webauthn") and silently authenticate when the user
// picks it. This replicates next-auth/webauthn's signIn() but with
// useBrowserAutofill enabled, which next-auth's own client doesn't expose.
//
// Call once on mount of a page that renders an
// <input autocomplete="username webauthn">. Resolves quietly (no-op) if the
// browser doesn't support it or the user never interacts with the prompt.
export async function armConditionalPasskeySignIn(callbackUrl: string): Promise<void> {
  if (typeof window === "undefined") return;
  if (!(await browserSupportsWebAuthnAutofill())) return;

  const optionsRes = await fetch("/api/auth/webauthn-options/passkey");
  if (!optionsRes.ok) return;
  const optionsData = await optionsRes.json();
  if (optionsData.action !== "authenticate") return;

  let credential;
  try {
    credential = await startAuthentication(optionsData.options, true);
  } catch {
    // User never interacted with the autofill prompt, or it was cancelled —
    // not an error, the password/OAuth paths remain available.
    return;
  }

  const csrfToken = await getCsrfToken();
  const res = await fetch("/api/auth/callback/passkey", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "X-Auth-Return-Redirect": "1" },
    body: new URLSearchParams({
      data: JSON.stringify(credential),
      action: "authenticate",
      csrfToken: csrfToken ?? "",
      callbackUrl,
    }),
  });
  if (!res.ok) return;

  const data = await res.json();
  window.location.href = data.url ?? callbackUrl;
}
