import type { ApplicationStatus } from "@/lib/types";

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Applied: "bg-blue-100 text-blue-800",
  "Phone Screen": "bg-indigo-100 text-indigo-800",
  Interviewing: "bg-purple-100 text-purple-800",
  "Technical Test": "bg-amber-100 text-amber-800",
  Offer: "bg-emerald-100 text-emerald-800",
  Accepted: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  Withdrawn: "bg-gray-100 text-gray-700",
  Ghosted: "bg-slate-200 text-slate-700",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
