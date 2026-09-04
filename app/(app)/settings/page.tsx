"use client";

import { signIn as signInWithPasskey } from "next-auth/webauthn";
import { signOut, useSession } from "next-auth/react";
import { AlertTriangle, Camera, KeyRound, Shield, Trash2, User } from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { resizeImageToSquareDataUrl } from "@/lib/resize-image";
import { GitHubIcon, GoogleIcon, MicrosoftIcon } from "@/components/icons";

type Tab = "profile" | "security" | "danger";

interface SettingsData {
  name: string;
  email: string;
  image: string | null;
  hasPassword: boolean;
  providers: string[];
  passkeys: { credentialID: string; credentialDeviceType: string; createdAt: string | null }[];
}

const PROVIDER_ICONS: Record<string, { Icon: typeof GoogleIcon; label: string }> = {
  google: { Icon: GoogleIcon, label: "Google" },
  "microsoft-entra-id": { Icon: MicrosoftIcon, label: "Microsoft" },
  github: { Icon: GitHubIcon, label: "GitHub" },
};

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-8 text-sm text-stone-500 sm:px-6">Loading…</div>}>
      <SettingsPageContent />
    </Suspense>
  );
}

function SettingsPageContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as Tab | null) ?? "profile";
  const [tab, setTab] = useState<Tab>(initialTab);
  const [data, setData] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);

  function reload() {
    setLoading(true);
    fetch("/api/settings")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    reload();
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Settings</h1>
        <p className="mt-1 text-sm text-stone-500">Manage your profile, security, and account.</p>
      </div>

      <div className="flex gap-1 border-b border-stone-200">
        {[
          { id: "profile" as const, label: "Profile", icon: User },
          { id: "security" as const, label: "Security", icon: Shield },
          { id: "danger" as const, label: "Danger Zone", icon: AlertTriangle },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium ${
              tab === t.id ? "border-amber-600 text-amber-600" : "border-transparent text-stone-500 hover:text-stone-700"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {loading || !data ? (
        <p className="text-sm text-stone-500">Loading…</p>
      ) : tab === "profile" ? (
        <ProfileTab data={data} onSaved={reload} />
      ) : tab === "security" ? (
        <SecurityTab data={data} onChanged={reload} />
      ) : (
        <DangerZoneTab email={data.email} />
      )}
    </div>
  );
}

function ProfileTab({ data, onSaved }: { data: SettingsData; onSaved: () => void }) {
  const { update } = useSession();
  const [name, setName] = useState(data.name);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/settings/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setSaving(false);
    if (res.ok) {
      setMessage("Saved.");
      await update({ name });
      onSaved();
    } else {
      const body = await res.json().catch(() => ({ error: "Failed to save" }));
      setMessage(body.error);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setMessage(null);
    try {
      const dataUrl = await resizeImageToSquareDataUrl(file);
      const res = await fetch("/api/settings/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Failed to upload photo" }));
        setMessage(body.error);
        return;
      }
      await update({ image: dataUrl });
      onSaved();
    } catch {
      setMessage("Couldn't process that image.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6">
      <div className="mb-6 flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="group relative shrink-0 rounded-full"
          title="Change photo"
        >
          <Avatar image={data.image} name={name || data.email} size={56} />
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-stone-900/0 text-white opacity-0 transition-opacity group-hover:bg-stone-900/40 group-hover:opacity-100">
            <Camera className="h-5 w-5" />
          </span>
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        <div>
          <p className="text-sm font-medium text-stone-900">{data.email}</p>
          <p className="text-xs text-stone-400">
            {uploading ? "Uploading photo…" : "Click your photo to change it — email can't be changed here"}
          </p>
        </div>
      </div>

      <label className="block max-w-sm">
        <span className="text-sm font-medium text-stone-700">Display name</span>
        <input className="input mt-1" value={name} onChange={(e) => setName(e.target.value)} />
      </label>

      {message && <p className="mt-3 text-sm text-stone-600">{message}</p>}

      <button onClick={handleSave} disabled={saving || !name.trim()} className="btn-primary mt-4">
        {saving ? "Saving..." : "Save changes"}
      </button>
    </div>
  );
}

function SecurityTab({ data, onChanged }: { data: SettingsData; onChanged: () => void }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onlySignInMethod = !data.hasPassword && data.providers.length === 0 && data.passkeys.length === 1;

  async function handleSetPassword() {
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/settings/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: currentPassword || undefined, newPassword }),
    });
    setSaving(false);
    setCurrentPassword("");
    setNewPassword("");
    if (res.ok) {
      setMessage("Password updated.");
      onChanged();
    } else {
      const body = await res.json().catch(() => ({ error: "Failed to update password" }));
      setMessage(body.error);
    }
  }

  async function handleAddPasskey() {
    try {
      await signInWithPasskey("passkey", { action: "register", callbackUrl: "/settings" });
    } catch {
      setMessage("Adding a passkey failed or was cancelled.");
    }
  }

  async function handleRemovePasskey(credentialID: string) {
    if (onlySignInMethod) {
      if (!confirm("This is your only sign-in method. Removing it may lock you out. Remove anyway?")) return;
    } else if (!confirm("Remove this passkey?")) {
      return;
    }
    const res = await fetch(`/api/settings/passkeys/${encodeURIComponent(credentialID)}`, { method: "DELETE" });
    if (res.ok) onChanged();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-stone-900">{data.hasPassword ? "Change password" : "Set a password"}</h2>
        <div className="mt-3 max-w-sm space-y-3">
          {data.hasPassword && (
            <input
              type="password"
              placeholder="Current password"
              className="input"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          )}
          <input
            type="password"
            placeholder="New password (min. 8 characters)"
            className="input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {message && <p className="text-sm text-stone-600">{message}</p>}
          <button
            onClick={handleSetPassword}
            disabled={saving || newPassword.length < 8 || (data.hasPassword && !currentPassword)}
            className="btn-primary"
          >
            {saving ? "Saving..." : data.hasPassword ? "Change password" : "Set password"}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-stone-900">Connected accounts</h2>
        {data.providers.length === 0 ? (
          <p className="mt-2 text-sm text-stone-500">No OAuth providers connected.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {data.providers.map((provider) => {
              const entry = PROVIDER_ICONS[provider];
              return (
                <li key={provider} className="flex items-center gap-2.5 text-sm text-stone-700">
                  {entry ? <entry.Icon /> : null}
                  {entry?.label ?? provider}
                  <span className="ml-auto rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
                    Connected
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-stone-900">Passkeys</h2>
          <button onClick={handleAddPasskey} className="btn-secondary text-xs">
            <KeyRound className="h-3.5 w-3.5" />
            Add a passkey
          </button>
        </div>
        {data.passkeys.length === 0 ? (
          <p className="mt-2 text-sm text-stone-500">No passkeys added yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {data.passkeys.map((pk) => (
              <li key={pk.credentialID} className="flex items-center justify-between gap-3 text-sm text-stone-700">
                <span>
                  {pk.credentialDeviceType === "multiDevice" ? "Synced passkey" : "Device passkey"}
                  {pk.createdAt && (
                    <span className="text-stone-400"> — added {new Date(pk.createdAt).toLocaleDateString()}</span>
                  )}
                </span>
                <button
                  onClick={() => handleRemovePasskey(pk.credentialID)}
                  className="rounded-md p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600"
                  title="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function DangerZoneTab({ email }: { email: string }) {
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    const res = await fetch("/api/settings/delete-account", { method: "POST" });
    if (res.ok) {
      await signOut({ callbackUrl: "/" });
      return;
    }
    setDeleting(false);
    const body = await res.json().catch(() => ({ error: "Failed to delete account" }));
    setError(body.error);
  }

  return (
    <div className="rounded-xl border border-red-200 bg-red-50/40 p-6">
      <h2 className="text-sm font-semibold text-red-900">Delete account</h2>
      <p className="mt-1 text-sm text-red-800">
        This permanently deletes your account and every job application you&apos;ve tracked. This cannot be undone.
      </p>
      <label className="mt-4 block max-w-sm">
        <span className="text-sm font-medium text-red-900">
          Type <span className="font-mono">{email}</span> to confirm
        </span>
        <input className="input mt-1" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
      </label>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      <button
        onClick={handleDelete}
        disabled={confirmText !== email || deleting}
        className="mt-4 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
      >
        {deleting ? "Deleting..." : "Permanently delete my account"}
      </button>
    </div>
  );
}
