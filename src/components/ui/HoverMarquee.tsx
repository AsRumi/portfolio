"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  text: string;
  /** Classes applied to the scrolling text itself (font size, color, etc.). */
  className?: string;
  /** Scroll speed in pixels per second. */
  speed?: number;
};

/**
 * Single-line text that stays clipped at rest and slides sideways on hover so
 * the full string can be read, then slides back on leave.
 *
 * The shift distance can't be expressed in CSS alone (it depends on how far the
 * text overflows its container), so it is measured and handed to the stylesheet
 * as a custom property. The animation itself still runs as a CSS transition
 * driven by `group-hover`, which keeps it on the compositor and means the
 * component has no per-frame JS.
 *
 * When the text fits, no overflow is measured and it renders as ordinary
 * truncated text — no mask, no motion.
 */
export default function HoverMarquee({
  text,
  className = "",
  speed = 45,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [overflow, setOverflow] = useState(0);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const span = textRef.current;
    if (!container || !span) return;
    // A trailing gap keeps the last word clear of the fade mask at the edge.
    const distance = span.scrollWidth - container.clientWidth;
    setOverflow(distance > 1 ? distance + 16 : 0);
  }, []);

  useEffect(() => {
    measure();
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;
    // Re-measure on layout changes (viewport resize, font swap, persona switch).
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [measure, text]);

  const scrolls = overflow > 0;

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${
        // Fade the trailing edge only when there is hidden text, so the clip
        // reads as intentional rather than as a hard cut mid-word.
        scrolls
          ? "[mask-image:linear-gradient(to_right,black_92%,transparent)]"
          : ""
      }`}
    >
      <span
        ref={textRef}
        style={
          {
            "--marquee-shift": `-${overflow}px`,
            // Longer excerpts take proportionally longer, so the reading pace
            // stays constant regardless of how much text is hidden.
            "--marquee-duration": `${Math.round((overflow / speed) * 1000)}ms`,
          } as React.CSSProperties
        }
        className={`block whitespace-nowrap ${
          scrolls ? "" : "text-ellipsis overflow-hidden"
        } ${
          scrolls
            ? "transition-transform duration-500 ease-out group-hover:duration-[var(--marquee-duration)] group-hover:ease-linear group-hover:[transform:translateX(var(--marquee-shift))]"
            : ""
        } ${className}`}
      >
        {text}
      </span>
    </div>
  );
}
