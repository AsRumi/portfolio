"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { TimelineEntry } from "@/types";

const CATEGORY_COLORS: Record<TimelineEntry["category"], string> = {
  project: "#60A5FA",
  research: "#C084FC",
  job: "#4ADE80",
  education: "#FCD34D",
  milestone: "#F87171",
};

const CATEGORY_LABELS: Record<TimelineEntry["category"], string> = {
  project: "Project",
  research: "Research",
  job: "Job",
  education: "Education",
  milestone: "Milestone",
};

const ALL_CATEGORIES: TimelineEntry["category"][] = [
  "project", "research", "job", "education", "milestone",
];

type Props = {
  entries: TimelineEntry[];
};

export default function TimelineView({ entries }: Props) {
  const [activeCategories, setActiveCategories] = useState<Set<TimelineEntry["category"]>>(
    new Set(ALL_CATEGORIES)
  );

  function toggleCategory(cat: TimelineEntry["category"]) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }

  const filtered = entries.filter((e) => activeCategories.has(e.category));

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="flex flex-col gap-5 mx-auto w-full max-w-2xl">
      {/* Category filters */}
      <motion.div
        className="flex flex-wrap gap-1.5"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      >
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => toggleCategory(cat)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs transition-colors ${
              activeCategories.has(cat)
                ? "bg-white text-[#a84010] font-medium"
                : "bg-white/15 text-white/80 hover:bg-white/25"
            }`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: CATEGORY_COLORS[cat] }}
            />
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </motion.div>

      {filtered.length > 0 ? (
        <div className="relative flex flex-col gap-0">
          {/* Vertical line */}
          <div className="absolute left-3 top-2 bottom-2 w-px bg-white/25" />

          {filtered.map((entry, i) => (
            <motion.div
              key={entry.id}
              className="relative flex gap-8 pb-10"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                delay: 0.1 + i * 0.12,
                duration: 1.0,
                ease: [0.16, 1, 0.3, 1],
              }}
            >

              {/* Dot */}
              <div
                className="relative z-10 mt-1.5 w-6 h-6 rounded-full shrink-0 border-2 border-white/30 shadow-sm"
                style={{
                  backgroundColor: entry.color_override ?? CATEGORY_COLORS[entry.category],
                }}
              />

              {/* Content card */}
              <motion.div
                whileHover={{ y: -3, scale: 1.01 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex flex-col gap-2 flex-1 bg-white/10 border border-white/20 rounded-2xl p-5 hover:bg-white/20 hover:border-white/35 transition-colors backdrop-blur-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-white">
                    {entry.related_url ? (
                      <Link
                        href={entry.related_url}
                        className="hover:text-white/75 transition-colors"
                      >
                        {entry.title}
                      </Link>
                    ) : (
                      entry.title
                    )}
                  </h3>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{
                      backgroundColor: `${CATEGORY_COLORS[entry.category]}30`,
                      color: CATEGORY_COLORS[entry.category],
                    }}
                  >
                    {CATEGORY_LABELS[entry.category]}
                  </span>
                </div>

                <p className="text-xs text-white/55 font-medium">
                  {formatDate(entry.start_date)}
                  {entry.end_date
                    ? ` — ${formatDate(entry.end_date)}`
                    : " — Present"}
                </p>

                {entry.description && (
                  <p className="text-sm text-white/65 leading-relaxed">
                    {entry.description}
                  </p>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-white/70">No entries match the selected filters.</p>
      )}
    </div>
  );
}
