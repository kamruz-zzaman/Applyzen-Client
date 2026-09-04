import { Award, Briefcase, TrendingUp, XCircle } from "lucide-react";
import type { StatsResponse } from "@/lib/types";

export function StatsCards({ stats }: { stats: StatsResponse }) {
  const active = stats.byStatus
    .filter((s) => !["Rejected", "Withdrawn", "Ghosted", "Accepted"].includes(s._id))
    .reduce((sum, s) => sum + s.count, 0);
  const offers = stats.byStatus.find((s) => s._id === "Offer")?.count ?? 0;
  const rejected = stats.byStatus.find((s) => s._id === "Rejected")?.count ?? 0;

  const cards = [
    { label: "Total Applications", value: stats.total, icon: Briefcase, color: "bg-indigo-50 text-indigo-600" },
    { label: "Active", value: active, icon: TrendingUp, color: "bg-blue-50 text-blue-600" },
    { label: "Offers", value: offers, icon: Award, color: "bg-emerald-50 text-emerald-600" },
    { label: "Rejected", value: rejected, icon: XCircle, color: "bg-red-50 text-red-600" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${card.color}`}>
            <card.icon className="h-4 w-4" />
          </div>
          <p className="text-sm text-gray-500">{card.label}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
