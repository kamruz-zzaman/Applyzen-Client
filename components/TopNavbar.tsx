"use client";

import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { AccountMenu } from "@/components/AccountMenu";
import { Logo } from "@/components/Logo";
import { NavLinks } from "@/components/NavLinks";

export function TopNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="flex shrink-0 items-center justify-between border-b border-stone-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="rounded-md p-1.5 text-stone-600 hover:bg-stone-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Logo />
        </div>
        <div className="hidden md:block" />
        <AccountMenu />
      </div>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-stone-900/40" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between px-5 py-5">
              <Logo />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="rounded-md p-1.5 text-stone-500 hover:bg-stone-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
