"use client";

import { useState } from "react";
import Link from "next/link";
import type { TimelineEntry } from "@/types";

const CATEGORY_COLORS: Record<TimelineEntry["category"], string> = {
  project: "bg-blue-400",
  research: "bg-purple-400",
  job: "bg-green-400",
  education: "bg-yellow-400",
  milestone: "bg-red-400",
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
    <div className="flex flex-col gap-8">
      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => toggleCategory(cat)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeCategories.has(cat)
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[cat]}`} />
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="relative flex flex-col gap-0">
          {/* Vertical line */}
          <div className="absolute left-3 top-2 bottom-2 w-px bg-border" />

          {filtered.map((entry) => (
            <div key={entry.id} className="relative flex gap-6 pb-8">
              {/* Dot */}
              <div
                className={`relative z-10 mt-1.5 w-6 h-6 rounded-full shrink-0 flex items-center justify-center ${
                  entry.color_override ? "" : CATEGORY_COLORS[entry.category]
                }`}
                style={entry.color_override ? { backgroundColor: entry.color_override } : {}}
              />

              {/* Content */}
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-foreground">
                    {entry.related_url ? (
                      <Link href={entry.related_url} className="hover:text-accent transition-colors">
                        {entry.title}
                      </Link>
                    ) : (
                      entry.title
                    )}
                  </h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs text-white ${CATEGORY_COLORS[entry.category]}`}>
                    {CATEGORY_LABELS[entry.category]}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDate(entry.start_date)}
                  {entry.end_date
                    ? ` — ${formatDate(entry.end_date)}`
                    : " — Present"}
                </p>
                {entry.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {entry.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No entries match the selected filters.</p>
      )}
    </div>
  );
}
