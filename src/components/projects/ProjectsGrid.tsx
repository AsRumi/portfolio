"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/types";

type Props = {
  projects: Project[];
  allTags: string[];
};

export default function ProjectsGrid({ projects, allTags }: Props) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? projects.filter((p) => p.tags?.includes(activeTag))
    : projects;

  return (
    <div className="flex flex-col gap-10">
      {allTags.length > 0 && (
        <motion.div
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            onClick={() => setActiveTag(null)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              activeTag === null
                ? "bg-white text-[#a84010]"
                : "bg-white/15 text-white hover:bg-white/25"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                activeTag === tag
                  ? "bg-white text-[#a84010]"
                  : "bg-white/15 text-white hover:bg-white/25"
              }`}
            >
              {tag}
            </button>
          ))}
        </motion.div>
      )}

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                delay: 0.1 + (i % 3) * 0.13,
                duration: 1.0,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
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
                <div className="flex flex-col gap-2 flex-1">
                  <h3 className="font-medium text-white group-hover:text-white/80 transition-colors">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="text-sm text-white/65 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  )}
                </div>
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs text-white/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-4 text-xs text-white/60 pt-1 border-t border-white/15">
                  {project.demo_url && (
                    <span
                      onClick={(e) => { e.preventDefault(); window.open(project.demo_url!, "_blank"); }}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      Live Demo ↗
                    </span>
                  )}
                  {project.github_url && (
                    <span
                      onClick={(e) => { e.preventDefault(); window.open(project.github_url!, "_blank"); }}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      GitHub ↗
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-white/70 text-sm">No projects match the selected filter.</p>
      )}
    </div>
  );
}
