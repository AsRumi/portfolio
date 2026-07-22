"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Project, BlogPost, ResearchPaper } from "@/types";
import {
  DEFAULT_PERSONA,
  RESEARCH_PERSONA,
  matchesPersona,
  type PersonaId,
} from "@/lib/personas";
import { THEMES, themeForPersona } from "@/lib/themes";
import { useHomeTheme } from "@/lib/theme-context";
import HeroSection from "./HeroSection";
import FadeInView from "@/components/ui/FadeInView";

type Props = {
  projects: Project[];
  posts: BlogPost[];
  research: ResearchPaper[];
};

// Client shell for the home page. It owns the selected-persona state (driven by
// the dropdown in the hero) and re-filters the featured sections below the fold.
// The server page fetches an unfiltered pool; we slice per-persona here so the
// selector can switch instantly without re-fetching.
export default function HomeExperience({ projects, posts, research }: Props) {
  const [persona, setPersona] = useState<PersonaId>(DEFAULT_PERSONA);

  // Active mood for this persona. Drives the body background below (the hero
  // reads it independently). `isMidnight` toggles the crossfade overlay.
  const theme = themeForPersona(persona);
  const isMidnight = theme.id === "midnight";

  // Publish the mood so the shared header/footer can match it. Reset to sunset
  // when leaving the home page so other routes keep the warm palette.
  const { setThemeId } = useHomeTheme();
  useEffect(() => {
    setThemeId(theme.id);
  }, [theme.id, setThemeId]);
  useEffect(() => {
    return () => setThemeId("sunset");
  }, [setThemeId]);

  // Untagged items match every persona (see matchesPersona), so nothing vanishes
  // until it's explicitly narrowed to specific roles in the admin panel.
  const featuredProjects = projects
    .filter((p) => matchesPersona(p.roles, persona))
    .slice(0, 3);
  const latestPosts = posts
    .filter((p) => matchesPersona(p.roles, persona))
    .slice(0, 3);

  // Research only surfaces on the home page for the ML Engineer & Researcher role.
  const showResearch = persona === RESEARCH_PERSONA;
  const researchPapers = showResearch
    ? research.filter((r) => matchesPersona(r.roles, persona)).slice(0, 3)
    : [];

  return (
    <div className="flex flex-col">
      <HeroSection selected={persona} onSelect={setPersona} />

      {/* ─── Body below the hero ─────────────────────────────────────────
          Two stacked gradient layers mirror the hero's sky: sunset is the base,
          midnight crossfades over it as the persona changes, so the page shifts
          mood as one. Content sits in a relative z-10 wrapper so the absolute
          background layers stay behind it. */}
      <div className="relative flex flex-col">
        <div
          className="absolute inset-0"
          style={{ background: THEMES.sunset.bodyGradient }}
        />
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: isMidnight ? 1 : 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          style={{ background: THEMES.midnight.bodyGradient }}
        />
        <div className="relative z-10 flex flex-col">
        {/* ─── Featured Projects ──────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-24 flex flex-col gap-10 sm:gap-12 w-full">
          <FadeInView className="flex items-end justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-white/50 uppercase tracking-widest">
                Work
              </p>
              <h2 className="font-display text-4xl font-semibold text-white">
                Featured Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-1.5 text-sm text-white/70 border-b border-white/30 pb-0.5 hover:text-white hover:border-white transition-colors"
            >
              All projects
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </FadeInView>

          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project, i) => (
                <FadeInView key={project.id} delay={i * 0.08} hover>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group flex flex-col gap-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-5 hover:bg-white/20 hover:border-white/40 transition-all h-full"
                  >
                    <div className="aspect-video w-full rounded-xl bg-white/10 overflow-hidden flex items-center justify-center text-xs text-white/50">
                      {project.thumbnail_url ? (
                        <img
                          src={project.thumbnail_url}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        "No thumbnail"
                      )}
                    </div>
                    <h3 className="font-medium text-white group-hover:text-white/75 transition-colors">
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-white/65 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    )}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs text-white/80"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </FadeInView>
              ))}
            </div>
          ) : (
            <p className="text-white/60 text-sm">
              No featured projects for this role yet.
            </p>
          )}
        </section>

        {/* ─── Latest Writing ─────────────────────────────────────────── */}
        <section className="border-t border-white/15">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-24 flex flex-col gap-10 sm:gap-12 w-full">
            <FadeInView className="flex items-end justify-between">
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium text-white/50 uppercase tracking-widest">
                  Writing
                </p>
                <h2 className="font-display text-4xl font-semibold text-white">
                  Latest Posts
                </h2>
              </div>
              <Link
                href="/blog"
                className="group inline-flex items-center gap-1.5 text-sm text-white/70 border-b border-white/30 pb-0.5 hover:text-white hover:border-white transition-colors"
              >
                All posts
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </FadeInView>

            {latestPosts.length > 0 ? (
              <div className="flex flex-col">
                {latestPosts.map((post, i) => (
                  <FadeInView key={post.id} delay={i * 0.1}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className={`group py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-white/10 -mx-4 px-4 rounded-xl transition-colors ${
                        i !== 0 ? "border-t border-white/15" : ""
                      }`}
                    >
                      <div className="flex flex-col gap-1">
                        <h3 className="font-medium text-white group-hover:text-white/75 transition-colors">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-sm text-white/60 line-clamp-1">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-xs text-white/50">
                          {post.published_at
                            ? new Date(post.published_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : "Draft"}
                        </span>
                        <span className="text-xs text-white/50 group-hover:text-white transition-colors">
                          →
                        </span>
                      </div>
                    </Link>
                  </FadeInView>
                ))}
              </div>
            ) : (
              <p className="text-white/60 text-sm">
                No posts for this role yet.
              </p>
            )}
          </div>
        </section>

        {/* ─── Selected Research ──────────────────────────────────────────
            Only rendered for the ML Engineer & Researcher persona. */}
        {showResearch && (
          <section className="border-t border-white/15">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-24 flex flex-col gap-10 sm:gap-12 w-full">
              <FadeInView className="flex items-end justify-between">
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-medium text-white/50 uppercase tracking-widest">
                    Research
                  </p>
                  <h2 className="font-display text-4xl font-semibold text-white">
                    Selected Research
                  </h2>
                </div>
                <Link
                  href="/research"
                  className="group inline-flex items-center gap-1.5 text-sm text-white/70 border-b border-white/30 pb-0.5 hover:text-white hover:border-white transition-colors"
                >
                  All research
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </FadeInView>

              {researchPapers.length > 0 ? (
                <div className="flex flex-col">
                  {researchPapers.map((paper, i) => {
                    const { href, external } = researchHref(paper);
                    const meta = [paper.venue, paper.year]
                      .filter(Boolean)
                      .join(" · ");
                    return (
                      <FadeInView key={paper.id} delay={i * 0.1}>
                        <a
                          href={href}
                          {...(external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                          className={`group py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-white/10 -mx-4 px-4 rounded-xl transition-colors ${
                            i !== 0 ? "border-t border-white/15" : ""
                          }`}
                        >
                          <div className="flex flex-col gap-1">
                            <h3 className="font-medium text-white group-hover:text-white/75 transition-colors">
                              {paper.title}
                            </h3>
                            {paper.authors && (
                              <p className="text-sm text-white/60 line-clamp-1">
                                {paper.authors}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-4 shrink-0">
                            {meta && (
                              <span className="text-xs text-white/50">
                                {meta}
                              </span>
                            )}
                            <span className="text-xs text-white/50 group-hover:text-white transition-colors">
                              →
                            </span>
                          </div>
                        </a>
                      </FadeInView>
                    );
                  })}
                </div>
              ) : (
                <p className="text-white/60 text-sm">
                  No research for this role yet.
                </p>
              )}
            </div>
          </section>
        )}
        </div>
      </div>
    </div>
  );
}

// Where a home-page research row links: prefer the DOI/publisher link, then the
// PDF, and finally fall back to the on-site research page.
function researchHref(r: ResearchPaper): { href: string; external: boolean } {
  if (r.external_url) return { href: r.external_url, external: true };
  if (r.pdf_url) return { href: r.pdf_url, external: true };
  return { href: "/research", external: false };
}
