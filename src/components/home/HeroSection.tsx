"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PERSONAS, PERSONA_MAP, type PersonaId } from "@/lib/personas";
import { THEMES, themeForPersona } from "@/lib/themes";

// Ridge shapes only. Each layer's *color* now comes from the active theme
// (themeForPersona → mountainFills[i]), so the same silhouettes recolor between
// the sunset and midnight moods. Coords were converted from clip-path % to a
// 1440×800 viewBox: (x%, y%) → (x * 14.4, y * 8). Back-to-front.
const mountainLayers = [
  {
    // Layer 1 — farthest
    d: "M 0 800 L 0 576 L 58 544 L 115 512 L 187 464 L 259 416 L 317 440 L 374 384 L 432 336 L 504 368 L 562 320 L 619 352 L 677 304 L 749 256 L 806 296 L 864 352 L 922 304 L 979 344 L 1037 288 L 1094 328 L 1152 376 L 1210 336 L 1267 384 L 1325 432 L 1382 480 L 1440 512 L 1440 800 Z",
    delay: 0.1,
    rise: 80,
  },
  {
    // Layer 2
    d: "M 0 800 L 0 624 L 43 592 L 101 560 L 158 520 L 216 480 L 274 512 L 331 456 L 403 416 L 461 448 L 518 400 L 576 432 L 634 384 L 691 344 L 749 376 L 821 336 L 878 376 L 936 424 L 994 384 L 1051 352 L 1109 392 L 1166 440 L 1224 400 L 1282 448 L 1339 496 L 1397 544 L 1440 576 L 1440 800 Z",
    delay: 0.25,
    rise: 60,
  },
  {
    // Layer 3 — midground
    d: "M 0 800 L 0 672 L 72 632 L 130 600 L 202 560 L 259 600 L 317 544 L 389 496 L 446 536 L 504 488 L 576 448 L 634 488 L 691 440 L 763 480 L 821 520 L 878 472 L 936 512 L 1008 560 L 1066 520 L 1123 480 L 1181 520 L 1238 568 L 1296 528 L 1354 576 L 1411 624 L 1440 656 L 1440 800 Z",
    delay: 0.4,
    rise: 45,
  },
  {
    // Layer 4 — closest
    d: "M 0 800 L 0 720 L 58 688 L 115 656 L 173 696 L 230 656 L 288 616 L 346 656 L 418 608 L 475 648 L 533 600 L 590 640 L 648 592 L 720 632 L 778 672 L 835 624 L 893 664 L 950 704 L 1008 656 L 1066 616 L 1123 656 L 1181 696 L 1238 656 L 1296 624 L 1354 664 L 1397 704 L 1440 736 L 1440 800 Z",
    delay: 0.55,
    rise: 25,
  },
];

type Props = {
  selected: PersonaId;
  onSelect: (id: PersonaId) => void;
};

export default function HeroSection({ selected, onSelect }: Props) {
  const persona = PERSONA_MAP[selected];
  const theme = themeForPersona(selected);
  const isMidnight = theme.id === "midnight";

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/*
        Sky is two stacked layers. The sunset base handles the one-time cinematic
        fade-in on load; the midnight layer sits on top and crossfades its opacity
        in/out as the visitor switches persona. Gradients can't be tweened directly,
        so opacity-crossfading two fixed gradients is how the mood change animates.
      */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        style={{ background: THEMES.sunset.skyGradient }}
      />
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: isMidnight ? 1 : 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        style={{ background: THEMES.midnight.skyGradient }}
      />

      {/*
        Mountain SVG — viewBox 1440×800 with preserveAspectRatio="xMidYMax slice".
        "slice" fills the hero at every screen size.
        "YMax" anchors the mountain bases to the bottom — peaks scale proportionally
        instead of compressing into tall spires on narrow screens.
      */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 w-full h-full"
      >
        {mountainLayers.map((layer, i) => {
          const fill = theme.mountainFills[i];
          return (
            <motion.path
              key={i}
              d={layer.d}
              // fill lives in both initial and animate so it never tweens on the
              // first paint (same value); only a persona switch moves the target,
              // and the per-property transition below recolors it quickly while
              // the slow staggered rise stays reserved for the entrance.
              initial={{ y: layer.rise, opacity: 0, fill }}
              animate={{ y: 0, opacity: 1, fill }}
              transition={{
                default: {
                  delay: layer.delay,
                  duration: 1.6,
                  ease: [0.16, 1, 0.3, 1],
                },
                fill: { duration: 0.9, ease: "easeOut" },
              }}
            />
          );
        })}
      </svg>

      {/* Hero text — each element enters independently, staggered after mountains */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 pt-32 sm:pt-48 pb-20 sm:pb-32 flex flex-col gap-6 sm:gap-8">
        <div className="flex flex-col gap-4 max-w-4xl">

          {/* Eyebrow — fades in, no movement */}
          <motion.p
            className="text-sm font-medium text-white/60 uppercase tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1.2, ease: "easeOut" }}
          >
            Portfolio
          </motion.p>

          {/* Headline — rises from below. The role is an inline dropdown the
              visitor can switch, which re-filters the sections below. */}
          <motion.h1
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-semibold text-white leading-[1.08]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Meet Mohammed, {persona.article}{" "}
            <RoleDropdown selected={selected} onSelect={onSelect} />
          </motion.h1>

          {/* One-line role descriptor — crossfades when the persona changes.
              The outer wrapper handles the one-time entrance; the inner
              AnimatePresence handles the quick swap on selection. */}
          <motion.div
            className="min-h-[3.5rem]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={persona.id}
                className="text-base text-white/75 leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {persona.tagline}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* CTA links — last to appear, just a clean fade */}
        <motion.div
          className="flex flex-wrap gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.55, duration: 1.0, ease: "easeOut" }}
        >
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-white text-sm border-b border-white/40 pb-0.5 hover:border-white transition-colors"
          >
            View Projects
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="/research"
            className="group inline-flex items-center gap-2 text-white text-sm border-b border-white/40 pb-0.5 hover:border-white transition-colors"
          >
            Read Research
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// Inline dropdown rendered inside the headline <h1>. Since globals.css forces
// all headings into the serif display font, the popover menu explicitly resets
// to the body font at a normal size/tracking/leading so it reads as a menu, not
// a headline.
function RoleDropdown({ selected, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const persona = PERSONA_MAP[selected];
  // Match the popover to the active mood so it doesn't read sunset over a
  // midnight hero. Derived from `selected` — no extra prop drilling needed.
  const theme = themeForPersona(selected);

  return (
    <span
      className="relative inline-block align-baseline"
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline border-b-2 border-white/40 text-white transition-colors hover:border-white focus:outline-none focus-visible:border-white"
      >
        {persona.label}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`ml-[0.15em] inline-block h-[0.55em] w-[0.55em] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          style={{ verticalAlign: "0.08em" }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Full-viewport backdrop closes the menu on any outside click.
                `fixed` escapes the hero's overflow-hidden clip. */}
            <button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 cursor-default"
            />
            <motion.ul
              role="listbox"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: theme.dropdownBg }}
              className="absolute left-0 top-full z-50 mt-4 min-w-[18rem] overflow-hidden rounded-2xl border border-white/20 font-sans text-base font-normal leading-normal tracking-normal shadow-2xl backdrop-blur-md"
            >
              {PERSONAS.map((p) => {
                const active = p.id === selected;
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        onSelect(p.id);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center justify-between gap-6 px-5 py-3 text-left transition-colors ${
                        active
                          ? "bg-white/15 text-white"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span>{p.label}</span>
                      {active && <span aria-hidden="true">✓</span>}
                    </button>
                  </li>
                );
              })}
            </motion.ul>
          </>
        )}
      </AnimatePresence>
    </span>
  );
}
