"use client";

import { useState } from "react";
import type { JobApplication } from "@/lib/types";
import { SEQUENTIAL_BLUE } from "@/lib/status-colors";

const WEEKS = 8;
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

function weekLabel(start: Date): string {
  return start.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function ApplicationsOverTimeChart({ applications }: { applications: JobApplication[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  const now = new Date();
  const startOfThisWeek = new Date(now);
  startOfThisWeek.setHours(0, 0, 0, 0);
  startOfThisWeek.setDate(startOfThisWeek.getDate() - startOfThisWeek.getDay());

  const buckets = Array.from({ length: WEEKS }, (_, i) => {
    const start = new Date(startOfThisWeek.getTime() - (WEEKS - 1 - i) * MS_PER_WEEK);
    const end = new Date(start.getTime() + MS_PER_WEEK);
    const count = applications.filter((a) => {
      const applied = new Date(a.dateApplied).getTime();
      return applied >= start.getTime() && applied < end.getTime();
    }).length;
    return { start, count };
  });

  const max = Math.max(...buckets.map((b) => b.count), 1);
  const maxIndex = buckets.reduce((best, b, i) => (b.count > buckets[best].count ? i : best), 0);

  return (
    <div className="relative">
      {hovered !== null && (
        <div className="pointer-events-none absolute -top-8 left-0 right-0 text-center text-xs text-gray-500">
          Week of {weekLabel(buckets[hovered].start)} — {buckets[hovered].count} application
          {buckets[hovered].count === 1 ? "" : "s"}
        </div>
      )}
      <div className="flex h-32 items-end gap-2">
        {buckets.map((bucket, i) => {
          const heightPct = (bucket.count / max) * 100;
          const showLabel = bucket.count > 0 && (i === maxIndex || i === buckets.length - 1);
          return (
            <div
              key={bucket.start.toISOString()}
              className="flex flex-1 flex-col items-center justify-end gap-1"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              tabIndex={0}
              role="img"
              aria-label={`Week of ${weekLabel(bucket.start)}: ${bucket.count} applications`}
            >
              {showLabel && <span className="text-xs font-medium tabular-nums text-gray-700">{bucket.count}</span>}
              <div
                className="w-full max-w-[28px] rounded-t transition-[filter] duration-100"
                style={{
                  height: bucket.count === 0 ? 2 : `${Math.max(heightPct, 4)}%`,
                  backgroundColor: bucket.count === 0 ? "#e1e0d9" : SEQUENTIAL_BLUE,
                  filter: hovered === i ? "brightness(0.9)" : undefined,
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-2">
        {buckets.map((bucket) => (
          <span key={bucket.start.toISOString()} className="flex-1 text-center text-[10px] text-gray-400">
            {weekLabel(bucket.start)}
          </span>
        ))}
      </div>
    </div>
  );
}
