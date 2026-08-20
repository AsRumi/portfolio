"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { TimelineEntry } from "@/types";
import TimelineDetailPanel from "./TimelineDetailPanel";
import TimelineGantt from "./TimelineGantt";
import TimelineList from "./TimelineList";
import {
  ALL_CATEGORIES,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  fullDomain,
  recentDomain,
  type Category,
} from "./timeline-utils";

type Range = "all" | "recent";

const RANGE_LABELS: Record<Range, string> = {
  all: "All time",
  recent: "Last 2 years",
};

type Props = {
  entries: TimelineEntry[];
};

export default function TimelineView({ entries }: Props) {
  const [activeCategories, setActiveCategories] = useState<Set<Category>>(
    new Set(ALL_CATEGORIES),
  );
  const [range, setRange] = useState<Range>("recent");
  const [selected, setSelected] = useState<TimelineEntry | null>(null);

  function toggleCategory(cat: Category) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  const filtered = useMemo(
    () => entries.filter((e) => activeCategories.has(e.category)),
    [entries, activeCategories],
  );

  // The domain is derived from the *unfiltered* set so that toggling a
  // category doesn't rescale the axis under the user — the time window stays
  // put and bars simply appear or disappear.
  const domain = useMemo(
    () => (range === "all" ? fullDomain(entries) : recentDomain(24)),
    [entries, range],
  );

  // Only offer categories that actually exist in the data.
  const presentCategories = useMemo(() => {
    const present = new Set(entries.map((e) => e.category));
    return ALL_CATEGORIES.filter((c) => present.has(c));
  }, [entries]);

  return (
    <div className="flex w-full flex-col gap-8">
      {/* Controls: category legend/filters on the left, range toggle on the right */}
      <motion.div
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex flex-wrap gap-1.5">
          {presentCategories.map((cat) => {
            const active = activeCategories.has(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                aria-pressed={active}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs transition-colors ${
                  active
                    ? "bg-white font-medium text-[#a84010]"
                    : "bg-white/15 text-white/80 hover:bg-white/25"
                }`}
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[cat] }}
                />
                {CATEGORY_LABELS[cat]}
              </button>
            );
          })}
        </div>

        {/* Zooming to a recent window is what keeps a dense cluster of short
            entries legible once the full-history view gets crowded. */}
        <div className="hidden shrink-0 rounded-full border border-white/25 bg-white/10 p-0.5 md:flex">
          {(["all", "recent"] as Range[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              aria-pressed={range === r}
              className={`rounded-full px-3.5 py-1 text-xs transition-colors ${
                range === r
                  ? "bg-white font-medium text-[#a84010]"
                  : "text-white/75 hover:text-white"
              }`}
            >
              {RANGE_LABELS[r]}
            </button>
          ))}
        </div>
      </motion.div>

      {filtered.length > 0 ? (
        <>
          {/* Two viewports, two layouts. Rendering both and switching with
              Tailwind breakpoints (rather than measuring in JS) keeps the
              server and client markup identical, so there is no hydration
              mismatch or first-paint flash. */}
          <div className="hidden md:block">
            <TimelineGantt
              entries={filtered}
              domain={domain}
              selectedId={selected?.id ?? null}
              onSelect={setSelected}
            />
            <p className="mt-8 text-xs text-white/45">
              Select any bar for details. Bar length is duration; the white line
              marks today.
            </p>
          </div>

          <div className="md:hidden">
            <TimelineList
              entries={filtered}
              selectedId={selected?.id ?? null}
              onSelect={setSelected}
            />
          </div>
        </>
      ) : (
        <p className="text-sm text-white/70">
          No entries match the selected filters.
        </p>
      )}

      <TimelineDetailPanel entry={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
