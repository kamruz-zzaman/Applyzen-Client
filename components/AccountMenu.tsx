"use client";

import Link from "next/link";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/Avatar";

export function AccountMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const name = session?.user?.name ?? session?.user?.email ?? "";

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-stone-100"
      >
        <Avatar image={session?.user?.image} name={name} size={30} />
        <span className="hidden max-w-[10rem] truncate text-sm font-medium text-stone-700 sm:inline">{name}</span>
        <ChevronDown className="h-3.5 w-3.5 text-stone-400" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-stone-200 bg-white py-1 shadow-lg">
          <Link
            href="/settings?tab=profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
          >
            <User className="h-4 w-4" />
            Profile
          </Link>
          <Link
            href="/settings?tab=security"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <div className="my-1 border-t border-stone-100" />
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
