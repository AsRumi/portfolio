"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

/**
 * Splits raw search input into individual terms. Commas and whitespace both
 * act as separators, so "llm, security" and "llm security" behave identically.
 */
export function parseTerms(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[,\s]+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

/**
 * Tag-based filtering shared by the blog and research pages.
 *
 * An item matches when *every* term is a substring of at least one of its
 * tags. Using AND rather than OR means each extra term narrows the results,
 * which is what people expect from a search box.
 */
export function useTagFilter<T extends { tags: string[] | null }>(items: T[]) {
  const [query, setQuery] = useState("");

  const terms = useMemo(() => parseTerms(query), [query]);

  const filtered = useMemo(() => {
    if (terms.length === 0) return items;
    return items.filter((item) => {
      const tags = (item.tags ?? []).map((t) => t.toLowerCase());
      return terms.every((term) => tags.some((tag) => tag.includes(term)));
    });
  }, [items, terms]);

  return { query, setQuery, terms, filtered };
}

type Props = {
  query: string;
  onQueryChange: (query: string) => void;
  /** Every tag present in the dataset — drives the typeahead suggestions. */
  allTags: string[];
  placeholder: string;
  ariaLabel: string;
  /** Shown under the input once the user has typed, e.g. "3 papers matching". */
  resultLabel?: string | null;
};

export default function TagSearch({
  query,
  onQueryChange,
  allTags,
  placeholder,
  ariaLabel,
  resultLabel,
}: Props) {
  const terms = useMemo(() => parseTerms(query), [query]);

  // Suggestions render only while the user is typing. That keeps the page
  // uncluttered by default while still making a long, non-obvious tag
  // vocabulary discoverable.
  const suggestions = useMemo(() => {
    if (terms.length === 0) return [];
    const last = terms[terms.length - 1];
    return allTags.filter((tag) => tag.toLowerCase().includes(last)).slice(0, 10);
  }, [allTags, terms]);

  return (
    <motion.div
      className="flex flex-col items-end gap-3"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative w-full max-w-md">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className="w-full rounded-full border border-white/25 bg-white/10 py-2.5 pl-11 pr-11 text-sm text-white outline-none backdrop-blur-sm transition-colors placeholder:text-white/50 hover:bg-white/15 focus:border-white/50 focus:bg-white/15 [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-white/60 transition-colors hover:bg-white/15 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap items-center justify-end gap-2">
          {suggestions.map((tag) => (
            <button
              key={tag}
              type="button"
              // Replace only the term being typed so earlier terms survive.
              onClick={() =>
                onQueryChange([...terms.slice(0, -1), tag].join(", ") + ", ")
              }
              className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-white/25"
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {resultLabel && <p className="text-xs text-white/60">{resultLabel}</p>}
    </motion.div>
  );
}
