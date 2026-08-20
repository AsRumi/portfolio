"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { motion } from "framer-motion";
import type { TimelineEntry } from "@/types";
import {
  CATEGORY_COLORS,
  buildTicks,
  formatRange,
  packBars,
  type Domain,
} from "./timeline-utils";

const ROW_HEIGHT = 46;
const BAR_HEIGHT = 26;
const AXIS_HEIGHT = 28;

/* The "today" marker only needs the mount-time clock, but useSyncExternalStore
 * requires a snapshot that is referentially stable across calls — returning a
 * fresh Date.now() each time would loop. Hence the one-shot cache. */
let cachedNow: number | null = null;
const subscribeNever = () => () => {};
const getNow = () => (cachedNow ??= Date.now());
const getNowOnServer = () => null;

type Props = {
  entries: TimelineEntry[];
  domain: Domain;
  selectedId: string | null;
  onSelect: (entry: TimelineEntry) => void;
};

/**
 * Swimlane / gantt view of the timeline. Bars are positioned by their real
 * dates against a shared time axis, so duration and overlap are readable at a
 * glance rather than inferred from a sequential list.
 *
 * Layout is measured rather than percentage-based: the packing algorithm needs
 * to know how many pixels a label will consume in order to decide whether two
 * entries can share a lane, and that is only knowable from the rendered width.
 */
export default function TimelineGantt({
  entries,
  domain,
  selectedId,
  onSelect,
}: Props) {
  const plotRef = useRef<HTMLDivElement>(null);
  const [plotWidth, setPlotWidth] = useState(0);

  // The clock is an external, non-React source, so it is read through
  // useSyncExternalStore: the server snapshot is null (no marker rendered) and
  // the client snapshot is cached so the value stays stable across re-renders.
  const now = useSyncExternalStore(subscribeNever, getNow, getNowOnServer);

  useEffect(() => {
    const node = plotRef.current;
    if (!node) return;

    // ResizeObserver fires once immediately on observe(), which delivers the
    // initial measurement without a synchronous setState in the effect body.
    const observer = new ResizeObserver(([entry]) => {
      setPlotWidth(entry.contentRect.width);
    });
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const { bars, laneCount } = useMemo(
    () => packBars(entries, domain, plotWidth),
    [entries, domain, plotWidth],
  );

  const ticks = useMemo(() => buildTicks(domain), [domain]);

  const span = domain.end - domain.start;
  const toPct = (ms: number) => ((ms - domain.start) / span) * 100;

  const nowInView = now !== null && now >= domain.start && now <= domain.end;

  return (
    <div className="relative">
      {/* Axis labels sit above the plot and share its coordinate space. */}
      <div className="relative" style={{ height: AXIS_HEIGHT }} aria-hidden="true">
        <div className="relative h-full" ref={plotRef}>
          {ticks.map((tick) => (
            <span
              key={tick.ms}
              className={`absolute top-0 -translate-x-1/2 whitespace-nowrap text-xs tabular-nums ${
                tick.major
                  ? "font-semibold text-white/80"
                  : "font-medium text-white/45"
              }`}
              style={{ left: `${toPct(tick.ms)}%` }}
            >
              {tick.label}
            </span>
          ))}
        </div>
      </div>

      {/* Plot area */}
      <div
        className="relative"
        style={{ height: Math.max(laneCount, 1) * ROW_HEIGHT }}
      >
        {/* Vertical gridlines, one per tick */}
        {ticks.map((tick) => (
          <div
            key={tick.ms}
            aria-hidden="true"
            className={`absolute top-0 bottom-0 w-px ${
              tick.major ? "bg-white/20" : "bg-white/10"
            }`}
            style={{ left: `${toPct(tick.ms)}%` }}
          />
        ))}

        {/* "Today" marker — anchors open-ended bars to a real reference point */}
        {nowInView && (
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 z-0 w-px bg-white/60"
            style={{ left: `${toPct(now)}%` }}
          >
            <span className="absolute -top-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white" />
          </div>
        )}

        {/* Bars */}
        {bars.map(({ entry, lane, left, width, labelSide, ongoing }, i) => {
          const color = entry.color_override ?? CATEGORY_COLORS[entry.category];
          const isSelected = selectedId === entry.id;

          const delay = Math.min(i * 0.045, 0.5);

          return (
            <motion.button
              key={entry.id}
              type="button"
              onClick={() => onSelect(entry)}
              title={`${entry.title} · ${formatRange(entry)}`}
              aria-label={`${entry.title}, ${formatRange(entry)}`}
              className={`group absolute z-10 flex items-center rounded-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                // Clipping is only safe when the label lives inside the bar;
                // an outside label has to be allowed to escape the box.
                labelSide === "inside" ? "overflow-hidden" : ""
              }`}
              style={{
                left,
                width,
                top: lane * ROW_HEIGHT + (ROW_HEIGHT - BAR_HEIGHT) / 2,
                height: BAR_HEIGHT,
                boxShadow: isSelected
                  ? `0 0 0 2px rgba(255,255,255,0.9), 0 6px 20px -6px ${color}`
                  : undefined,
              }}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* The fill is a separate layer from the label so the scaleX
                  entrance grows the bar without stretching its text. */}
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 rounded-full"
                style={{
                  // Grow from the bar's start date rather than its midpoint,
                  // so bars appear to extend forward through time.
                  transformOrigin: "left center",
                  // Open-ended entries fade out at their right edge instead of
                  // ending in a hard cap, reading as "still going".
                  backgroundImage: ongoing
                    ? `linear-gradient(to right, ${color} 0%, ${color} calc(100% - 22px), ${color}00 100%)`
                    : undefined,
                  backgroundColor: ongoing ? undefined : color,
                }}
                initial={{ scaleX: 0.35, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              />

              <motion.span
                className={
                  labelSide === "inside"
                    ? "relative min-w-0 truncate px-3 text-xs font-semibold text-black/80"
                    : `pointer-events-none absolute whitespace-nowrap text-xs font-medium text-white/85 transition-colors group-hover:text-white ${
                        labelSide === "right"
                          ? "left-full ml-2.5"
                          : "right-full mr-2.5"
                      }`
                }
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 0.2, duration: 0.5 }}
              >
                {entry.title}
              </motion.span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
