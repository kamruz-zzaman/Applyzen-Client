"use client";

import { useState } from "react";
import type { JobApplication } from "@/lib/types";
import { PIPELINE_STATUS_COLORS } from "@/lib/status-colors";

// Horizontal bar list (not a donut — a part-to-whole pie is hard to compare
// precisely; a bar per category makes magnitude directly comparable). Fixed
// status order + fixed color per status, always — so the chart looks the
// same shape every time you open it, rather than reshuffling by count.
export function PipelineBreakdownChart({ applications }: { applications: JobApplication[] }) {
  const [hovered, setHovered] = useState<string | null>(null);

  const rows = PIPELINE_STATUS_COLORS.map(({ status, hex }) => ({
    status,
    hex,
    count: applications.filter((a) => a.status === status).length,
  })).filter((row) => row.count > 0);

  const max = Math.max(...rows.map((r) => r.count), 1);

  if (rows.length === 0) {
    return (
      <div className="flex h-full min-h-[180px] items-center justify-center text-sm text-gray-400">
        No active applications right now.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div
          key={row.status}
          className="group flex items-center gap-3"
          onMouseEnter={() => setHovered(row.status)}
          onMouseLeave={() => setHovered(null)}
          onFocus={() => setHovered(row.status)}
          onBlur={() => setHovered(null)}
          tabIndex={0}
          role="img"
          aria-label={`${row.status}: ${row.count} application${row.count === 1 ? "" : "s"}`}
        >
          <span className="w-28 shrink-0 truncate text-sm text-gray-600">{row.status}</span>
          <div className="relative h-4 flex-1 rounded-sm bg-gray-100">
            <div
              className="h-4 rounded-sm transition-[filter] duration-100"
              style={{
                width: `${(row.count / max) * 100}%`,
                backgroundColor: row.hex,
                filter: hovered === row.status ? "brightness(0.9)" : undefined,
              }}
            />
          </div>
          <span className="w-6 shrink-0 text-right text-sm font-medium tabular-nums text-gray-900">
            {row.count}
          </span>
        </div>
      ))}
    </div>
  );
}
