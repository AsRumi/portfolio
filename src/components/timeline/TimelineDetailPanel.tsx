"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import type { TimelineEntry } from "@/types";
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  formatDuration,
  formatRange,
} from "./timeline-utils";

type Props = {
  entry: TimelineEntry | null;
  onClose: () => void;
};

/**
 * Right-hand drawer showing the full detail for one entry. Rendered as an
 * overlay rather than an inline expansion so the chart stays visible and the
 * user can click straight through from one entry to the next without the
 * layout shifting underneath them.
 */
export default function TimelineDetailPanel({ entry, onClose }: Props) {
  // Escape-to-close is registered globally because focus may still be on the
  // bar in the chart behind the panel.
  useEffect(() => {
    if (!entry) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [entry, onClose]);

  const color = entry
    ? (entry.color_override ?? CATEGORY_COLORS[entry.category])
    : undefined;

  return (
    <AnimatePresence>
      {entry && (
        <>
          <motion.div
            key="scrim"
            onClick={onClose}
            // Header is z-50, so the panel layer has to clear it.
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />

          <motion.aside
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label={entry.title}
            className="fixed right-0 top-0 z-[61] flex h-full w-full flex-col overflow-y-auto border-l border-white/20 bg-[#a84010] p-6 sm:w-[420px] sm:p-8"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{ backgroundColor: `${color}30`, color }}
              >
                {CATEGORY_LABELS[entry.category]}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close details"
                className="-mr-1 -mt-1 rounded-full p-2 text-white/70 transition-colors hover:bg-white/15 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <h2 className="font-display text-2xl font-semibold leading-snug text-white">
              {entry.title}
            </h2>

            <p className="mt-2 text-sm font-medium text-white/65">
              {formatRange(entry)}
              <span className="text-white/40">
                {" · "}
                {formatDuration(entry)}
              </span>
            </p>

            <div
              aria-hidden="true"
              className="mt-6 h-1 w-12 rounded-full"
              style={{ backgroundColor: color }}
            />

            {entry.description && (
              <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-white/80">
                {entry.description}
              </p>
            )}

            {entry.related_url && (
              <Link
                href={entry.related_url}
                className="mt-8 inline-flex items-center gap-2 self-start rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
              >
                View more
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
