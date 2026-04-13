"use client";

import { useState } from "react";
import Link from "next/link";
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
    <div className="flex flex-col gap-8">
      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeTag === null
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeTag === tag
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 hover:border-accent transition-colors"
            >
              <div className="aspect-video w-full rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground overflow-hidden">
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
              <h3 className="font-medium text-foreground group-hover:text-accent transition-colors">
                {project.title}
              </h3>
              {project.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
              )}
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                  {project.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-3 text-xs text-muted-foreground pt-1">
                {project.demo_url && (
                  <span
                    onClick={(e) => { e.preventDefault(); window.open(project.demo_url!, "_blank"); }}
                    className="hover:text-foreground transition-colors cursor-pointer"
                  >
                    Live Demo ↗
                  </span>
                )}
                {project.github_url && (
                  <span
                    onClick={(e) => { e.preventDefault(); window.open(project.github_url!, "_blank"); }}
                    className="hover:text-foreground transition-colors cursor-pointer"
                  >
                    GitHub ↗
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">
          No projects match the selected filter.
        </p>
      )}
    </div>
  );
}
