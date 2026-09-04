"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { NavLinks } from "@/components/NavLinks";

// Desktop-only nav rail. The mobile drawer and the account menu both live in
// TopNavbar, which is present at every breakpoint (see (app)/layout.tsx).
export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-full w-60 shrink-0 flex-col border-r border-stone-200 bg-white md:flex">
      <div className="px-5 py-5">
        <Link href="/dashboard">
          <Logo />
        </Link>
      </div>
      <NavLinks pathname={pathname} />
    </aside>
  );
}
