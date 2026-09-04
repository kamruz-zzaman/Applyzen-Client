"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const STANDALONE_PATHS = ["/", "/sign-in", "/sign-up"];

export function HeaderNav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Landing and auth pages render their own nav to match their own layout —
  // this bar is only for the signed-in app shell.
  if (STANDALONE_PATHS.includes(pathname)) return null;
  if (status !== "authenticated") return null;

  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/dashboard" className="text-lg font-semibold tracking-tight text-gray-900">
          Job Application Tracker
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-gray-500 sm:inline">
            {session.user.email ?? session.user.name}
          </span>
          <Link
            href="/dashboard"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:inline"
          >
            Dashboard
          </Link>
          <Link href="/applications/new" className="btn-primary">
            + Add Application
          </Link>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-secondary">
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
