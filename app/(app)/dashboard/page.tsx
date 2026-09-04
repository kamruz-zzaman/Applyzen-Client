"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchApplications, fetchStats } from "@/lib/api";
import type { JobApplication, StatsResponse } from "@/lib/types";
import { StatsCards } from "@/components/StatsCards";
import { StatusBadge } from "@/components/StatusBadge";
import { AttentionWidget } from "@/components/AttentionWidget";
import { PipelineBreakdownChart } from "@/components/charts/PipelineBreakdownChart";
import { ApplicationsOverTimeChart } from "@/components/charts/ApplicationsOverTimeChart";

export default function DashboardPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchApplications(), fetchStats()])
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
  }, []);

  const recent = [...applications]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  if (loading) {
    return <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-500 sm:px-6">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Overview</h1>
          <p className="mt-1 text-sm text-gray-500">Everything you&apos;ve applied to, in one place.</p>
        </div>
        <Link href="/applications/new" className="btn-primary">
          + Add Application
        </Link>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}. Is the API server running at{" "}
          <code>{process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}</code>?
        </div>
      )}

      {stats && <StatsCards stats={stats} applications={applications} />}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">Applications over time</h2>
          <ApplicationsOverTimeChart applications={applications} />
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">Active pipeline</h2>
          <PipelineBreakdownChart applications={applications} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-gray-900">Needs attention</h2>
          <AttentionWidget applications={applications} />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Recent activity</h2>
            <Link href="/applications" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="flex min-h-[140px] items-center justify-center text-sm text-gray-400">
              No applications yet.
            </p>
          ) : (
            <ul className="space-y-1">
              {recent.map((app) => (
                <li key={app._id}>
                  <Link
                    href={`/applications/${app._id}`}
                    className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-gray-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">{app.companyName}</p>
                      <p className="truncate text-xs text-gray-500">{app.jobTitle}</p>
                    </div>
                    <StatusBadge status={app.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
