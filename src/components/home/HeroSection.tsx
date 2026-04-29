"use client";

import Link from "next/link";
import { motion } from "framer-motion";

// Each layer converted from clip-path % coords to SVG coords in a 1440×800 viewBox.
// (x%, y%) → (x * 14.4, y * 8). Back-to-front, lightest to darkest.
const mountainLayers = [
  {
    // Layer 1 — farthest, lightest
    d: "M 0 800 L 0 576 L 58 544 L 115 512 L 187 464 L 259 416 L 317 440 L 374 384 L 432 336 L 504 368 L 562 320 L 619 352 L 677 304 L 749 256 L 806 296 L 864 352 L 922 304 L 979 344 L 1037 288 L 1094 328 L 1152 376 L 1210 336 L 1267 384 L 1325 432 L 1382 480 L 1440 512 L 1440 800 Z",
    fill: "rgba(120, 60, 20, 0.35)",
    delay: 0.1,
    rise: 80,
  },
  {
    // Layer 2
    d: "M 0 800 L 0 624 L 43 592 L 101 560 L 158 520 L 216 480 L 274 512 L 331 456 L 403 416 L 461 448 L 518 400 L 576 432 L 634 384 L 691 344 L 749 376 L 821 336 L 878 376 L 936 424 L 994 384 L 1051 352 L 1109 392 L 1166 440 L 1224 400 L 1282 448 L 1339 496 L 1397 544 L 1440 576 L 1440 800 Z",
    fill: "rgba(90, 40, 10, 0.45)",
    delay: 0.25,
    rise: 60,
  },
  {
    // Layer 3 — midground
    d: "M 0 800 L 0 672 L 72 632 L 130 600 L 202 560 L 259 600 L 317 544 L 389 496 L 446 536 L 504 488 L 576 448 L 634 488 L 691 440 L 763 480 L 821 520 L 878 472 L 936 512 L 1008 560 L 1066 520 L 1123 480 L 1181 520 L 1238 568 L 1296 528 L 1354 576 L 1411 624 L 1440 656 L 1440 800 Z",
    fill: "rgba(60, 25, 5, 0.55)",
    delay: 0.4,
    rise: 45,
  },
  {
    // Layer 4 — closest, darkest
    d: "M 0 800 L 0 720 L 58 688 L 115 656 L 173 696 L 230 656 L 288 616 L 346 656 L 418 608 L 475 648 L 533 600 L 590 640 L 648 592 L 720 632 L 778 672 L 835 624 L 893 664 L 950 704 L 1008 656 L 1066 616 L 1123 656 L 1181 696 L 1238 656 L 1296 624 L 1354 664 L 1397 704 L 1440 736 L 1440 800 Z",
    fill: "rgba(30, 10, 2, 0.75)",
    delay: 0.55,
    rise: 25,
  },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Sky — fades in */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        style={{
          background:
            "linear-gradient(180deg, #F5A623 0%, #E8832A 25%, #D4622A 50%, #B8451F 70%, #8B2E14 85%, #5C1A0A 100%)",
        }}
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
        {mountainLayers.map((layer, i) => (
          <motion.path
            key={i}
            d={layer.d}
            fill={layer.fill}
            initial={{ y: layer.rise, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: layer.delay,
              duration: 1.6,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        ))}
      </svg>

      {/* Hero text — each element enters independently, staggered after mountains */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 pt-32 sm:pt-48 pb-20 sm:pb-32 flex flex-col gap-6 sm:gap-8">
        <div className="flex flex-col gap-4 max-w-2xl">

          {/* Eyebrow — fades in, no movement */}
          <motion.p
            className="text-sm font-medium text-white/60 uppercase tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1.2, ease: "easeOut" }}
          >
            AI/ML Engineer &amp; Researcher
          </motion.p>

          {/* Headline — rises from below with weight */}
          <motion.h1
            className="font-display text-5xl sm:text-7xl lg:text-8xl font-semibold text-white leading-[1.05]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Building AI
            <br />
            that matters.
          </motion.h1>

          {/* Body copy — softer, slightly later */}
          <motion.p
            className="text-base text-white/75 leading-relaxed max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Master&apos;s student in Computer Science (AI/ML) at Northeastern
            University. I build production-grade AI systems at the
            intersection of computer vision, multimodal learning, and
            generative AI.
          </motion.p>
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
