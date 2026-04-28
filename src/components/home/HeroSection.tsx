"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const mountains = [
  {
    // Layer 1 — farthest, lightest
    background: "rgba(120, 60, 20, 0.35)",
    clipPath:
      "polygon(0% 100%, 0% 72%, 4% 68%, 8% 64%, 13% 58%, 18% 52%, 22% 55%, 26% 48%, 30% 42%, 35% 46%, 39% 40%, 43% 44%, 47% 38%, 52% 32%, 56% 37%, 60% 44%, 64% 38%, 68% 43%, 72% 36%, 76% 41%, 80% 47%, 84% 42%, 88% 48%, 92% 54%, 96% 60%, 100% 64%, 100% 100%)",
    delay: 0.1,
    rise: "18%",
  },
  {
    // Layer 2
    background: "rgba(90, 40, 10, 0.45)",
    clipPath:
      "polygon(0% 100%, 0% 78%, 3% 74%, 7% 70%, 11% 65%, 15% 60%, 19% 64%, 23% 57%, 28% 52%, 32% 56%, 36% 50%, 40% 54%, 44% 48%, 48% 43%, 52% 47%, 57% 42%, 61% 47%, 65% 53%, 69% 48%, 73% 44%, 77% 49%, 81% 55%, 85% 50%, 89% 56%, 93% 62%, 97% 68%, 100% 72%, 100% 100%)",
    delay: 0.25,
    rise: "14%",
  },
  {
    // Layer 3 — midground
    background: "rgba(60, 25, 5, 0.55)",
    clipPath:
      "polygon(0% 100%, 0% 84%, 5% 79%, 9% 75%, 14% 70%, 18% 75%, 22% 68%, 27% 62%, 31% 67%, 35% 61%, 40% 56%, 44% 61%, 48% 55%, 53% 60%, 57% 65%, 61% 59%, 65% 64%, 70% 70%, 74% 65%, 78% 60%, 82% 65%, 86% 71%, 90% 66%, 94% 72%, 98% 78%, 100% 82%, 100% 100%)",
    delay: 0.4,
    rise: "10%",
  },
  {
    // Layer 4 — closest, darkest
    background: "rgba(30, 10, 2, 0.75)",
    clipPath:
      "polygon(0% 100%, 0% 90%, 4% 86%, 8% 82%, 12% 87%, 16% 82%, 20% 77%, 24% 82%, 29% 76%, 33% 81%, 37% 75%, 41% 80%, 45% 74%, 50% 79%, 54% 84%, 58% 78%, 62% 83%, 66% 88%, 70% 82%, 74% 77%, 78% 82%, 82% 87%, 86% 82%, 90% 78%, 94% 83%, 97% 88%, 100% 92%, 100% 100%)",
    delay: 0.55,
    rise: "6%",
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

      {/* Mountain layers — each rises up from below, staggered back-to-front */}
      {mountains.map((m, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={{ y: m.rise, opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          transition={{
            delay: m.delay,
            duration: 1.6,
            ease: [0.16, 1, 0.3, 1], // expo out — fast rise, graceful settle
          }}
          style={{
            background: m.background,
            clipPath: m.clipPath,
          }}
        />
      ))}

      {/* Hero text — fades up after mountains settle */}
      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-8 pt-48 pb-32 flex flex-col gap-8"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex flex-col gap-4 max-w-2xl">
          <motion.p
            className="text-sm font-medium text-white/60 uppercase tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.8 }}
          >
            AI/ML Engineer &amp; Researcher
          </motion.p>
          <motion.h1
            className="font-display text-6xl sm:text-8xl font-semibold text-white leading-[1.05]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            Building AI
            <br />
            that matters.
          </motion.h1>
          <motion.p
            className="text-base text-white/75 leading-relaxed max-w-lg"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            Master&apos;s student in Computer Science (AI/ML) at Northeastern
            University. I build production-grade AI systems at the
            intersection of computer vision, multimodal learning, and
            generative AI.
          </motion.p>
        </div>

        {/* CTA links */}
        <motion.div
          className="flex flex-wrap gap-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8, ease: "easeOut" }}
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
      </motion.div>
    </section>
  );
}
