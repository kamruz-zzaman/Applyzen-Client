import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { JobApplication } from "@/lib/types";

interface AttentionItem {
  applicationId: string;
  companyName: string;
  jobTitle: string;
  label: string;
  date: Date;
}

const WINDOW_DAYS = 7;

function collectAttentionItems(applications: JobApplication[]): AttentionItem[] {
  const now = new Date();
  const horizon = new Date(now.getTime() + WINDOW_DAYS * 24 * 60 * 60 * 1000);
  const items: AttentionItem[] = [];

  for (const app of applications) {
    const push = (rawDate: string | undefined, label: string) => {
      if (!rawDate) return;
      const date = new Date(rawDate);
      if (date <= horizon) {
        items.push({ applicationId: app._id, companyName: app.companyName, jobTitle: app.jobTitle, label, date });
      }
    };

    push(app.nextFollowUpDate, "Follow up");
    push(app.offerDeadline, "Offer deadline");
    for (const round of app.interviewRounds) {
      push(round.date, round.round || "Interview");
    }
  }

  return items.sort((a, b) => a.date.getTime() - b.date.getTime());
}

function formatDue(date: Date): { text: string; overdue: boolean } {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round((date.getTime() - startOfToday.getTime()) / (24 * 60 * 60 * 1000));

  if (diffDays < 0) return { text: `${Math.abs(diffDays)}d overdue`, overdue: true };
  if (diffDays === 0) return { text: "Today", overdue: false };
  if (diffDays === 1) return { text: "Tomorrow", overdue: false };
  return { text: `In ${diffDays}d`, overdue: false };
}

export function AttentionWidget({ applications }: { applications: JobApplication[] }) {
  const items = collectAttentionItems(applications);

  if (items.length === 0) {
    return (
      <div className="flex h-full min-h-[140px] flex-col items-center justify-center gap-2 text-center">
        <CheckCircle2 className="h-6 w-6 text-emerald-500" />
        <p className="text-sm text-gray-500">Nothing due in the next {WINDOW_DAYS} days.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-1">
      {items.map((item, i) => {
        const due = formatDue(item.date);
        return (
          <li key={`${item.applicationId}-${item.label}-${i}`}>
            <Link
              href={`/applications/${item.applicationId}`}
              className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-gray-50"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">
                  {item.label} — {item.companyName}
                </p>
                <p className="truncate text-xs text-gray-500">{item.jobTitle}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                  due.overdue ? "bg-red-50 text-red-700" : "bg-gray-100 text-gray-600"
                }`}
              >
                {due.text}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
