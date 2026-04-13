"use client";

import { useState } from "react";
import type { ResearchPaper } from "@/types";

type Props = {
  papers: ResearchPaper[];
  allTags: string[];
};

export default function PaperList({ papers, allTags }: Props) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const filtered = activeTag
    ? papers.filter((p) => p.tags?.includes(activeTag))
    : papers;

  function toggleAbstract(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-8">
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

      {filtered.length > 0 ? (
        <div className="flex flex-col divide-y divide-border">
          {filtered.map((paper) => (
            <div key={paper.id} className="py-6 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <h3 className="font-medium text-foreground">{paper.title}</h3>
                {paper.year && (
                  <span className="text-sm text-muted-foreground shrink-0">{paper.year}</span>
                )}
              </div>
              {paper.authors && (
                <p className="text-sm text-muted-foreground">{paper.authors}</p>
              )}
              {paper.venue && (
                <p className="text-sm text-accent italic">{paper.venue}</p>
              )}
              {paper.tags && paper.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {paper.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Collapsible abstract */}
              {paper.abstract && (
                <div>
                  <button
                    onClick={() => toggleAbstract(paper.id)}
                    className="text-xs text-accent hover:text-foreground transition-colors"
                  >
                    {expandedIds.has(paper.id) ? "Hide abstract ↑" : "Show abstract ↓"}
                  </button>
                  {expandedIds.has(paper.id) && (
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed border-l-2 border-border pl-4">
                      {paper.abstract}
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                {paper.pdf_url && (
                  <a
                    href={paper.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity"
                  >
                    Download PDF ↓
                  </a>
                )}
                {paper.external_url && (
                  <a
                    href={paper.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    DOI / Publisher ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No papers match the selected filter.</p>
      )}
    </div>
  );
}
