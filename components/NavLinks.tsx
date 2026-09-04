"use client";

import Link from "next/link";
import { LayoutDashboard, ListChecks, Settings } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: ListChecks },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex-1 space-y-1 px-3">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive ? "bg-amber-50 text-amber-700" : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
