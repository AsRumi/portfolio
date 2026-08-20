"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import type { BlogPost } from "@/types";

function estimateReadTime(content: string | null): string {
  if (!content) return "1 min read";
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

type Props = {
  posts: BlogPost[];
  allTags: string[];
};

/**
 * Splits the raw search input into individual terms. Commas and whitespace both
 * act as separators so "llm, security" and "llm security" behave identically.
 */
function parseTerms(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[,\s]+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

export default function BlogGrid({ posts, allTags }: Props) {
  const [query, setQuery] = useState("");

  const terms = useMemo(() => parseTerms(query), [query]);

  // A post matches when *every* term is a substring of at least one of its tags.
  // This makes multi-term input narrow the results (AND) rather than widen them.
  const filtered = useMemo(() => {
    if (terms.length === 0) return posts;
    return posts.filter((p) => {
      const tags = (p.tags ?? []).map((t) => t.toLowerCase());
      return terms.every((term) => tags.some((tag) => tag.includes(term)));
    });
  }, [posts, terms]);

  // Suggestions are only rendered while the user is typing, which keeps the
  // page uncluttered by default but still lets tags be discovered.
  const suggestions = useMemo(() => {
    if (terms.length === 0) return [];
    const last = terms[terms.length - 1];
    return allTags
      .filter((tag) => tag.toLowerCase().includes(last))
      .slice(0, 10);
  }, [allTags, terms]);

  return (
    <div className="flex flex-col gap-10">
      {allTags.length > 0 && (
        <motion.div
          className="flex flex-col items-end gap-3"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative w-full max-w-md">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by tag — e.g. llm evaluation, ai security"
              aria-label="Filter posts by tag"
              className="w-full rounded-full border border-white/25 bg-white/10 backdrop-blur-sm py-2.5 pl-11 pr-11 text-sm text-white placeholder:text-white/50 outline-none transition-colors hover:bg-white/15 focus:border-white/50 focus:bg-white/15 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
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
                  // Replace only the term being typed so earlier terms survive.
                  onClick={() =>
                    setQuery(
                      [...terms.slice(0, -1), tag].join(", ") + ", "
                    )
                  }
                  className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-white/25"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {terms.length > 0 && (
            <p className="text-xs text-white/60">
              {filtered.length} {filtered.length === 1 ? "post" : "posts"} matching
            </p>
          )}
        </motion.div>
      )}

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, scale: 1.02 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                delay: 0.1 + (i % 3) * 0.13,
                duration: 1.0,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm overflow-hidden hover:bg-white/20 hover:border-white/40 transition-all h-full"
              >
                <div className="aspect-video w-full bg-white/10 overflow-hidden flex items-center justify-center text-xs text-white/50">
                  {post.cover_image_url ? (
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    "No cover image"
                  )}
                </div>
                <div className="flex flex-col gap-3 p-5 flex-1">
                  <h3 className="font-display text-xl sm:text-2xl font-semibold leading-snug tracking-tight text-white group-hover:text-white/80 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-white/65 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/15 text-xs text-white/55">
                    <span>
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Unpublished"}
                    </span>
                    <span>{estimateReadTime(post.content)}</span>
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs text-white/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-white/70">
          {terms.length > 0
            ? `No posts have a tag matching "${query.trim()}".`
            : "No posts yet."}
        </p>
      )}
    </div>
  );
}
