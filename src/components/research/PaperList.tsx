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
    <div className="flex flex-col gap-10">
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
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
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="flex flex-col">
          {filtered.map((paper, i) => (
            <div
              key={paper.id}
              className={`py-8 flex flex-col gap-4 ${
                i !== 0 ? "border-t border-white/20" : ""
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <h3 className="font-medium text-white leading-snug max-w-2xl">
                  {paper.title}
                </h3>
                {paper.year && (
                  <span className="text-sm text-white/60 shrink-0 font-medium">
                    {paper.year}
                  </span>
                )}
              </div>

              {paper.authors && (
                <p className="text-sm text-white/70">{paper.authors}</p>
              )}

              {paper.venue && (
                <p className="text-sm text-white/55 italic">{paper.venue}</p>
              )}

              {paper.tags && paper.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {paper.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs text-white/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {paper.abstract && (
                <div>
                  <button
                    onClick={() => toggleAbstract(paper.id)}
                    className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-1"
                  >
                    {expandedIds.has(paper.id) ? "Hide abstract ↑" : "Show abstract ↓"}
                  </button>
                  {expandedIds.has(paper.id) && (
                    <p className="mt-4 text-sm text-white/65 leading-relaxed border-l-2 border-white/30 pl-4">
                      {paper.abstract}
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-1">
                {paper.pdf_url && (
                  <a
                    href={paper.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-[#a84010] hover:bg-white/90 transition-opacity"
                  >
                    Download PDF ↓
                  </a>
                )}
                {paper.external_url && (
                  <a
                    href={paper.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/50 px-4 py-1.5 text-xs font-medium text-white hover:bg-white/15 transition-colors"
                  >
                    DOI / Publisher ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-white/70">No papers match the selected filter.</p>
      )}
    </div>
  );
}
