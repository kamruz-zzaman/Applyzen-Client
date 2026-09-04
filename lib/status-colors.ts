import type { ApplicationStatus } from "./types";

// Validated categorical palette (dataviz skill, references/palette.md) — the
// first 5 slots of the documented default order, which passes every CVD /
// contrast gate in that exact order (a prefix of a validated adjacent-ordered
// sequence keeps all of its internal adjacency guarantees).
//
// Only the "active pipeline" statuses get a chart color here — terminal
// outcomes (Accepted/Rejected/Withdrawn/Ghosted) are already surfaced by the
// stat cards on Overview, so this chart isn't a second place they're counted.
export const PIPELINE_STATUS_COLORS: { status: ApplicationStatus; hex: string }[] = [
  { status: "Applied", hex: "#2a78d6" },
  { status: "Phone Screen", hex: "#eb6834" },
  { status: "Interviewing", hex: "#1baf7a" },
  { status: "Technical Test", hex: "#eda100" },
  { status: "Offer", hex: "#e87ba4" },
];

// Sequential hue, single series (applications-over-time) — step 450 of the
// documented blue ramp; same hex as categorical slot 1, by design.
export const SEQUENTIAL_BLUE = "#2a78d6";
