"use client";

import Link from "next/link";
import { FolderOpen, LayoutGrid, Table2, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { deleteApplication, fetchApplications, updateApplication } from "@/lib/api";
import { APPLICATION_STATUSES, type ApplicationStatus, type JobApplication } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { KanbanBoard } from "@/components/KanbanBoard";
import { avatarColorClasses, initials } from "@/lib/avatar-color";

type SortKey = "companyName" | "jobTitle" | "dateApplied" | "status";
type ViewMode = "table" | "board";

function formatSalary(app: JobApplication): string {
  const { salaryRangeMin, salaryRangeMax, salaryCurrency } = app;
  if (!salaryRangeMin && !salaryRangeMax) return "—";
  const parts = [salaryRangeMin, salaryRangeMax].filter((v) => v !== undefined) as number[];
  return `${salaryCurrency} ${parts.map((v) => v.toLocaleString()).join(" – ")}`;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>("table");
  const [sortKey, setSortKey] = useState<SortKey>("dateApplied");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchApplications({ status: status || undefined, search: search || undefined })
      .then((apps) => !cancelled && (setApplications(apps), setError(null)))
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [status, search]);

  const sorted = useMemo(() => {
    const copy = [...applications];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "dateApplied") cmp = new Date(a.dateApplied).getTime() - new Date(b.dateApplied).getTime();
      else cmp = String(a[sortKey]).localeCompare(String(b[sortKey]));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [applications, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this job application? This cannot be undone.")) return;
    await deleteApplication(id);
    setApplications((prev) => prev.filter((a) => a._id !== id));
  }

  async function handleStatusChange(id: string, newStatus: ApplicationStatus) {
    const previous = applications;
    setApplications((prev) => prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a)));
    try {
      await updateApplication(id, { status: newStatus });
    } catch {
      setApplications(previous);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900">Applications</h1>
          <p className="mt-1 text-sm text-stone-500">Search, filter, and manage every application.</p>
        </div>
        <Link href="/applications/new" className="btn-primary self-start whitespace-nowrap sm:self-auto">
          + Add Application
        </Link>
      </div>

      {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-3">
          <input
            className="input max-w-xs"
            placeholder="Search company or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="input max-w-[180px]" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {APPLICATION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex rounded-lg border border-stone-300 bg-white p-0.5">
          <button
            onClick={() => setView("table")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium ${
              view === "table" ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-50"
            }`}
          >
            <Table2 className="h-4 w-4" />
            Table
          </button>
          <button
            onClick={() => setView("board")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium ${
              view === "board" ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-50"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            Board
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-stone-500">Loading…</div>
      ) : sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-stone-200 bg-white py-16">
          <FolderOpen className="h-8 w-8 text-stone-300" />
          <p className="text-sm text-stone-500">No applications yet.</p>
          <Link href="/applications/new" className="btn-primary">
            + Add Application
          </Link>
        </div>
      ) : view === "board" ? (
        <KanbanBoard applications={sorted} onStatusChange={handleStatusChange} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
          <table className="min-w-full divide-y divide-stone-200 text-sm">
            <thead className="bg-stone-50">
              <tr>
                <SortableTh label="Company" sortKey="companyName" active={sortKey} dir={sortDir} onClick={toggleSort} />
                <SortableTh label="Role" sortKey="jobTitle" active={sortKey} dir={sortDir} onClick={toggleSort} />
                <Th>Location</Th>
                <SortableTh label="Applied" sortKey="dateApplied" active={sortKey} dir={sortDir} onClick={toggleSort} />
                <SortableTh label="Status" sortKey="status" active={sortKey} dir={sortDir} onClick={toggleSort} />
                <Th>Salary Range</Th>
                <Th>Proposed</Th>
                <Th />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sorted.map((app) => (
                <tr key={app._id} className="group hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <Link href={`/applications/${app._id}`} className="flex items-center gap-2.5">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarColorClasses(app.companyName)}`}
                      >
                        {initials(app.companyName)}
                      </span>
                      <span className="font-medium text-stone-900 hover:underline">{app.companyName}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-stone-700">{app.jobTitle}</td>
                  <td className="px-4 py-3 text-stone-700">{app.companyLocation || "—"}</td>
                  <td className="px-4 py-3 text-stone-700">{new Date(app.dateApplied).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-4 py-3 text-stone-700">{formatSalary(app)}</td>
                  <td className="px-4 py-3 text-stone-700">
                    {app.proposedSalary ? `${app.salaryCurrency} ${app.proposedSalary.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(app._id)}
                      className="invisible rounded-md p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 group-hover:visible"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">{children}</th>
  );
}

function SortableTh({
  label,
  sortKey,
  active,
  dir,
  onClick,
}: {
  label: string;
  sortKey: SortKey;
  active: SortKey;
  dir: "asc" | "desc";
  onClick: (key: SortKey) => void;
}) {
  const isActive = active === sortKey;
  return (
    <th
      onClick={() => onClick(sortKey)}
      className="cursor-pointer select-none px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500 hover:text-stone-700"
    >
      {label}
      {isActive && <span className="ml-1">{dir === "asc" ? "↑" : "↓"}</span>}
    </th>
  );
}
