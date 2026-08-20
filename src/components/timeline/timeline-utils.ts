import type { TimelineEntry } from "@/types";

export type Category = TimelineEntry["category"];

export const CATEGORY_COLORS: Record<Category, string> = {
  project: "#60A5FA",
  research: "#C084FC",
  job: "#4ADE80",
  education: "#FCD34D",
  milestone: "#F87171",
};

export const CATEGORY_LABELS: Record<Category, string> = {
  project: "Project",
  research: "Research",
  job: "Job",
  education: "Education",
  milestone: "Milestone",
};

export const ALL_CATEGORIES: Category[] = [
  "project",
  "research",
  "job",
  "education",
  "milestone",
];

/* ------------------------------------------------------------------ *
 * Date helpers
 *
 * Supabase returns `date` columns as bare "YYYY-MM-DD" strings. We parse
 * them into UTC timestamps and format them back with `timeZone: "UTC"`
 * throughout, so a viewer in a negative-offset timezone doesn't see
 * "2020-09-01" render as "Aug 2020".
 * ------------------------------------------------------------------ */

export function parseDate(value: string): number {
  const [y, m, d] = value.split("-").map(Number);
  return Date.UTC(y, (m ?? 1) - 1, d ?? 1);
}

export function formatMonthYear(ms: number): string {
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** "Mar 2026 — Apr 2026" / "Sep 2025 — Present" */
export function formatRange(entry: TimelineEntry): string {
  const start = formatMonthYear(parseDate(entry.start_date));
  const end = entry.end_date
    ? formatMonthYear(parseDate(entry.end_date))
    : "Present";
  return `${start} — ${end}`;
}

/** Approximate human duration, e.g. "1 yr 2 mo", "3 mo", "<1 mo". */
export function formatDuration(entry: TimelineEntry): string {
  const start = parseDate(entry.start_date);
  const end = entry.end_date ? parseDate(entry.end_date) : Date.now();
  const months = Math.round((end - start) / (1000 * 60 * 60 * 24 * 30.44));
  if (months < 1) return "<1 mo";
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (years === 0) return `${months} mo`;
  if (rem === 0) return `${years} yr`;
  return `${years} yr ${rem} mo`;
}

/** The timestamp an entry effectively ends at — open-ended entries run to today. */
export function effectiveEnd(entry: TimelineEntry): number {
  return entry.end_date ? parseDate(entry.end_date) : Date.now();
}

export function yearOf(entry: TimelineEntry): number {
  return new Date(parseDate(entry.start_date)).getUTCFullYear();
}

/* ------------------------------------------------------------------ *
 * Domain (the horizontal time window the chart renders)
 * ------------------------------------------------------------------ */

export type Domain = { start: number; end: number };

/**
 * Full-history domain, snapped outward to whole calendar years so the year
 * gridlines land on clean boundaries instead of mid-column.
 */
export function fullDomain(entries: TimelineEntry[]): Domain {
  const now = Date.now();
  if (entries.length === 0) {
    const y = new Date(now).getUTCFullYear();
    return { start: Date.UTC(y, 0, 1), end: Date.UTC(y + 1, 0, 1) };
  }
  const min = Math.min(...entries.map((e) => parseDate(e.start_date)));
  const max = Math.max(now, ...entries.map(effectiveEnd));
  return {
    start: Date.UTC(new Date(min).getUTCFullYear(), 0, 1),
    end: Date.UTC(new Date(max).getUTCFullYear() + 1, 0, 1),
  };
}

/** Trailing window ending one month past today, snapped to month starts. */
export function recentDomain(months: number): Domain {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  return {
    start: Date.UTC(y, m - months + 1, 1),
    end: Date.UTC(y, m + 2, 1),
  };
}

/* ------------------------------------------------------------------ *
 * Axis ticks
 * ------------------------------------------------------------------ */

export type Tick = { ms: number; label: string; major: boolean };

/**
 * Long spans get one labelled tick per year; shorter spans get quarterly
 * ticks so a two-year window doesn't collapse to two lonely labels.
 */
export function buildTicks(domain: Domain): Tick[] {
  const spanYears =
    (domain.end - domain.start) / (1000 * 60 * 60 * 24 * 365.25);
  const ticks: Tick[] = [];

  const startYear = new Date(domain.start).getUTCFullYear();
  const endYear = new Date(domain.end).getUTCFullYear();

  if (spanYears >= 4) {
    for (let y = startYear; y <= endYear; y++) {
      const ms = Date.UTC(y, 0, 1);
      if (ms < domain.start || ms > domain.end) continue;
      ticks.push({ ms, label: String(y), major: true });
    }
    return ticks;
  }

  for (let y = startYear; y <= endYear; y++) {
    for (const month of [0, 3, 6, 9]) {
      const ms = Date.UTC(y, month, 1);
      if (ms < domain.start || ms > domain.end) continue;
      ticks.push({
        ms,
        // January carries the year; the other quarters just name the month.
        label:
          month === 0
            ? String(y)
            : new Date(ms).toLocaleDateString("en-US", {
                month: "short",
                timeZone: "UTC",
              }),
        major: month === 0,
      });
    }
  }
  return ticks;
}

/* ------------------------------------------------------------------ *
 * Lane packing
 * ------------------------------------------------------------------ */

export type PackedBar = {
  entry: TimelineEntry;
  lane: number;
  /** Pixel offset from the left edge of the plot area. */
  left: number;
  width: number;
  /**
   * Where the title is drawn: inside the bar when it fits, otherwise beside
   * it. Bars close to the right edge flip their label to the left so it never
   * overflows the plot and forces the page to scroll sideways.
   */
  labelSide: "inside" | "right" | "left";
  /** The bar has no end date, so it reads as continuing. */
  ongoing: boolean;
};

const MIN_BAR_PX = 30; // keeps single-month bars clickable
const LANE_GAP_PX = 14; // breathing room between neighbours in a lane
const CHAR_PX = 6.6; // rough advance width of the label font at 12px
const LABEL_PAD_PX = 22;

function estimateLabelWidth(title: string): number {
  return title.length * CHAR_PX + LABEL_PAD_PX;
}

/**
 * Greedy interval packing: walk entries left-to-right and drop each into the
 * first lane whose content has already finished. This collapses the chart from
 * one-row-per-entry down to the minimum number of rows, which is what makes
 * concurrent work visible side by side instead of stacked vertically.
 *
 * Reserved width includes the label, because a label rendered outside its bar
 * would otherwise be overlapped by the next bar in the same lane.
 */
export function packBars(
  entries: TimelineEntry[],
  domain: Domain,
  plotWidth: number,
): { bars: PackedBar[]; laneCount: number } {
  const span = domain.end - domain.start;
  if (span <= 0 || plotWidth <= 0) return { bars: [], laneCount: 0 };

  const toPx = (ms: number) => ((ms - domain.start) / span) * plotWidth;

  const visible = entries
    .map((entry) => ({
      entry,
      rawStart: parseDate(entry.start_date),
      rawEnd: effectiveEnd(entry),
    }))
    // Drop anything entirely outside the window (matters for "Last 2 years").
    .filter(
      ({ rawStart, rawEnd }) =>
        rawEnd >= domain.start && rawStart <= domain.end,
    )
    .sort((a, b) => a.rawStart - b.rawStart || a.rawEnd - b.rawEnd);

  // laneEnds[i] = the x-coordinate past which lane i is free again.
  const laneEnds: number[] = [];
  const bars: PackedBar[] = [];

  for (const { entry, rawStart, rawEnd } of visible) {
    const clampedStart = Math.max(rawStart, domain.start);
    const clampedEnd = Math.min(rawEnd, domain.end);

    const left = toPx(clampedStart);
    const width = Math.max(toPx(clampedEnd) - left, MIN_BAR_PX);

    const labelWidth = estimateLabelWidth(entry.title);

    let labelSide: PackedBar["labelSide"];
    if (width >= labelWidth) labelSide = "inside";
    else if (left + width + labelWidth <= plotWidth) labelSide = "right";
    else labelSide = "left";

    // The horizontal span this entry actually occupies, label included.
    const occupiedStart = labelSide === "left" ? left - labelWidth : left;
    const occupiedEnd =
      left + width + (labelSide === "right" ? labelWidth : 0) + LANE_GAP_PX;

    let lane = laneEnds.findIndex((end) => end <= occupiedStart);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(occupiedEnd);
    } else {
      laneEnds[lane] = occupiedEnd;
    }

    bars.push({
      entry,
      lane,
      left,
      width,
      labelSide,
      ongoing: entry.end_date === null,
    });
  }

  return { bars, laneCount: laneEnds.length };
}
