"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchApplications, fetchStats } from "@/lib/api";
import { APPLICATION_STATUSES, type JobApplication, type StatsResponse } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { StatsCards } from "@/components/StatsCards";

function formatSalary(app: JobApplication): string {
  const { salaryRangeMin, salaryRangeMax, salaryCurrency } = app;
  if (!salaryRangeMin && !salaryRangeMax) return "—";
  const parts = [salaryRangeMin, salaryRangeMax].filter((v) => v !== undefined) as number[];
  return `${salaryCurrency} ${parts.map((v) => v.toLocaleString()).join(" – ")}`;
}

export default function DashboardPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([fetchApplications({ status: status || undefined, search: search || undefined }), fetchStats()])
      .then(([apps, statsResult]) => {
        if (cancelled) return;
        setApplications(apps);
        setStats(statsResult);
        setError(null);
      })
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [status, search]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Applications</h1>
        <p className="mt-1 text-sm text-gray-500">Everything you&apos;ve applied to, in one place.</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}. Is the API server running at{" "}
          <code>{process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}</code>?
        </div>
      )}

      {stats && <StatsCards stats={stats} />}

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
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <Th>Company</Th>
              <Th>Role</Th>
              <Th>Location</Th>
              <Th>Applied</Th>
              <Th>Status</Th>
              <Th>Salary Range</Th>
              <Th>Proposed</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && applications.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  No applications yet.{" "}
                  <Link href="/applications/new" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Add your first one
                  </Link>
                  .
                </td>
              </tr>
            )}
            {applications.map((app) => (
              <tr key={app._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">
                  <Link href={`/applications/${app._id}`} className="hover:underline">
                    {app.companyName}
                  </Link>
                  {app.companyLinkedIn && (
                    <a
                      href={app.companyLinkedIn}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-2 text-xs text-blue-600 hover:underline"
                    >
                      LinkedIn
                    </a>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-700">{app.jobTitle}</td>
                <td className="px-4 py-3 text-gray-700">{app.companyLocation || "—"}</td>
                <td className="px-4 py-3 text-gray-700">
                  {new Date(app.dateApplied).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-4 py-3 text-gray-700">{formatSalary(app)}</td>
                <td className="px-4 py-3 text-gray-700">
                  {app.proposedSalary ? `${app.salaryCurrency} ${app.proposedSalary.toLocaleString()}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
      {children}
    </th>
  );
}
