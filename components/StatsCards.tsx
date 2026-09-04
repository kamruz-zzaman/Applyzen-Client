import { Award, Briefcase, TrendingUp, XCircle } from "lucide-react";
import type { JobApplication, StatsResponse } from "@/lib/types";

function countThisWeek(applications: JobApplication[]): number {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return applications.filter((a) => new Date(a.dateApplied).getTime() >= weekAgo).length;
}

export function StatsCards({ stats, applications }: { stats: StatsResponse; applications: JobApplication[] }) {
  const active = stats.byStatus
    .filter((s) => !["Rejected", "Withdrawn", "Ghosted", "Accepted"].includes(s._id))
    .reduce((sum, s) => sum + s.count, 0);
  const offers = stats.byStatus.find((s) => s._id === "Offer")?.count ?? 0;
  const rejected = stats.byStatus.find((s) => s._id === "Rejected")?.count ?? 0;
  const thisWeek = countThisWeek(applications);

  const cards = [
    {
      label: "Total Applications",
      value: stats.total,
      delta: thisWeek > 0 ? `+${thisWeek} this week` : undefined,
      icon: Briefcase,
      color: "bg-amber-50 text-amber-600",
    },
    { label: "Active", value: active, icon: TrendingUp, color: "bg-blue-50 text-blue-600" },
    { label: "Offers", value: offers, icon: Award, color: "bg-emerald-50 text-emerald-600" },
    { label: "Rejected", value: rejected, icon: XCircle, color: "bg-red-50 text-red-600" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-stone-200 bg-white p-4">
          <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${card.color}`}>
            <card.icon className="h-4 w-4" />
          </div>
          <p className="text-sm text-stone-500">{card.label}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-2xl font-semibold text-stone-900">{card.value}</p>
            {card.delta && <span className="text-xs font-medium text-emerald-600">{card.delta}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
