"use client";

import { useState } from "react";
import Link from "next/link";

type RelatedProject = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  tags?: string[] | null;
};

export default function RelatedCarousel({
  projects,
}: {
  projects: RelatedProject[];
}) {
  const [active, setActive] = useState(0);

  if (projects.length === 0) return null;

  function prev() {
    setActive((i) => (i - 1 + projects.length) % projects.length);
  }
  function next() {
    setActive((i) => (i + 1) % projects.length);
  }

  // Position each card: -1 = left, 0 = center, 1 = right, else hidden
  function getPosition(index: number) {
    const diff = (index - active + projects.length) % projects.length;
    if (diff === 0) return "center";
    if (diff === 1) return "right";
    if (diff === projects.length - 1) return "left";
    return "hidden";
  }

  const styleMap = {
    center: {
      transform: "translateX(0) scale(1)",
      zIndex: 10,
      opacity: 1,
    },
    left: {
      transform: "translateX(-72%) scale(0.82)",
      zIndex: 5,
      opacity: 0.6,
    },
    right: {
      transform: "translateX(72%) scale(0.82)",
      zIndex: 5,
      opacity: 0.6,
    },
    hidden: {
      transform: "translateX(0) scale(0.7)",
      zIndex: 0,
      opacity: 0,
      pointerEvents: "none" as const,
    },
  };

  return (
    <section className="flex flex-col gap-6 pt-8 border-t border-white/20">
      <h2 className="font-display text-2xl font-semibold text-white text-center">
        Related Projects
      </h2>

      {/* Carousel stage — arrows sit inside, centered vertically */}
      <div className="relative flex items-center justify-center h-52 overflow-hidden mx-auto w-full max-w-3xl">
        {projects.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-0 z-20 w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:text-white hover:border-white/60 transition-colors bg-black/10"
            >
              ←
            </button>
            <button
              onClick={next}
              className="absolute right-0 z-20 w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-white/70 hover:text-white hover:border-white/60 transition-colors bg-black/10"
            >
              →
            </button>
          </>
        )}
        {projects.map((r, i) => {
          const pos = getPosition(i);
          const style = styleMap[pos];
          const isCenter = pos === "center";
          const isHidden = pos === "hidden";

          return (
            <div
              key={r.id}
              onClick={() =>
                !isCenter &&
                (pos === "left" ? prev() : pos === "right" ? next() : null)
              }
              className="absolute w-72 h-44 cursor-pointer"
              style={{
                ...style,
                transition:
                  "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s ease",
                pointerEvents: isHidden ? "none" : "auto",
              }}
            >
              <Link
                href={`/projects/${r.slug}`}
                onClick={(e) => {
                  if (!isCenter) e.preventDefault();
                }}
                className={`flex flex-col gap-3 rounded-2xl border p-5 h-full transition-colors ${
                  isCenter
                    ? "border-white/40 bg-white/20 backdrop-blur-sm hover:bg-white/25"
                    : "border-white/20 bg-white/10"
                }`}
              >
                <h3 className="font-medium text-white leading-snug">
                  {r.title}
                </h3>
                {r.description && (
                  <p className="text-xs text-white/65 line-clamp-3 leading-relaxed">
                    {r.description}
                  </p>
                )}
                {r.tags && r.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {r.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-white/15 px-2 py-0.5 text-xs text-white/75"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </div>
          );
        })}
      </div>

      {/* Dot indicators */}
      {projects.length > 1 && (
        <div className="flex justify-center gap-1.5">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all ${
                i === active
                  ? "w-4 h-1.5 bg-white"
                  : "w-1.5 h-1.5 bg-white/35 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
