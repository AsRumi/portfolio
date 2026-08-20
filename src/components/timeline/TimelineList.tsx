"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { TimelineEntry } from "@/types";
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  formatDuration,
  formatRange,
  parseDate,
  yearOf,
} from "./timeline-utils";

type Props = {
  entries: TimelineEntry[];
  selectedId: string | null;
  onSelect: (entry: TimelineEntry) => void;
};

/**
 * Mobile fallback for the gantt view. A time axis needs horizontal room that a
 * phone doesn't have, so on small screens we keep the same data and the same
 * detail panel but group entries under year headings — dense and scannable
 * without any horizontal scrolling.
 */
export default function TimelineList({ entries, selectedId, onSelect }: Props) {
  const groups = useMemo(() => {
    const byYear = new Map<number, TimelineEntry[]>();
    for (const entry of entries) {
      const year = yearOf(entry);
      const bucket = byYear.get(year);
      if (bucket) bucket.push(entry);
      else byYear.set(year, [entry]);
    }
    return Array.from(byYear.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([year, items]) => ({
        year,
        items: items.sort(
          (a, b) => parseDate(b.start_date) - parseDate(a.start_date),
        ),
      }));
  }, [entries]);

  return (
    <div className="flex flex-col gap-8">
      {groups.map(({ year, items }) => (
        <div key={year} className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-3 border-b border-white/20 pb-2">
            <h2 className="font-display text-2xl font-semibold tabular-nums text-white">
              {year}
            </h2>
            <span className="text-xs font-medium text-white/55">
              {items.length} {items.length === 1 ? "entry" : "entries"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {items.map((entry, i) => {
              const color =
                entry.color_override ?? CATEGORY_COLORS[entry.category];
              const isSelected = selectedId === entry.id;

              return (
                <motion.button
                  key={entry.id}
                  type="button"
                  onClick={() => onSelect(entry)}
                  className={`flex flex-col gap-1.5 rounded-2xl border p-4 text-left backdrop-blur-sm transition-colors ${
                    isSelected
                      ? "border-white/60 bg-white/25"
                      : "border-white/20 bg-white/10 hover:border-white/40 hover:bg-white/20"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    delay: Math.min(i * 0.06, 0.3),
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <div className="flex items-start gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm font-semibold leading-snug text-white">
                      {entry.title}
                    </span>
                  </div>
                  <p className="pl-4 text-xs font-medium text-white/60">
                    {formatRange(entry)}
                    <span className="text-white/40">
                      {" · "}
                      {formatDuration(entry)}
                    </span>
                  </p>
                  <p className="pl-4 text-[11px] font-medium uppercase tracking-wide text-white/40">
                    {CATEGORY_LABELS[entry.category]}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
