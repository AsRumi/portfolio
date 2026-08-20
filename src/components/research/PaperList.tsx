"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ResearchPaper } from "@/types";
import TagSearch, { useTagFilter } from "@/components/ui/TagSearch";

type Props = {
  papers: ResearchPaper[];
  allTags: string[];
};

export default function PaperList({ papers, allTags }: Props) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Tags are still what the filter matches on, they're just no longer rendered
  // as chips — the vocabulary is surfaced through the search typeahead instead.
  const { query, setQuery, terms, filtered } = useTagFilter(papers);

  function toggleAbstract(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-10">
      {allTags.length > 0 && (
        <TagSearch
          query={query}
          onQueryChange={setQuery}
          allTags={allTags}
          placeholder="Search by topic — e.g. medical imaging, style transfer"
          ariaLabel="Filter papers by tag"
          resultLabel={
            terms.length > 0
              ? `${filtered.length} ${filtered.length === 1 ? "paper" : "papers"} matching`
              : null
          }
        />
      )}

      {filtered.length > 0 ? (
        <div className="flex flex-col">
          {filtered.map((paper, i) => (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                delay: 0.1 + i * 0.12,
                duration: 1.0,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`py-8 flex flex-col gap-4 ${i !== 0 ? "border-t border-white/20" : ""}`}
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

              {paper.abstract && (
                <div>
                  <button
                    onClick={() => toggleAbstract(paper.id)}
                    className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-1"
                  >
                    {expandedIds.has(paper.id)
                      ? "Hide abstract ↑"
                      : "Show abstract ↓"}
                  </button>
                  {expandedIds.has(paper.id) && (
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="mt-4 text-sm text-white/65 leading-relaxed border-l-2 border-white/30 pl-4"
                    >
                      {paper.abstract}
                    </motion.p>
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
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-white/70">
          No papers match your search.
        </p>
      )}
    </div>
  );
}
