"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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

export default function BlogGrid({ posts, allTags }: Props) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? posts.filter((p) => p.tags?.includes(activeTag))
    : posts;

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
                  <h3 className="font-medium text-white group-hover:text-white/80 transition-colors line-clamp-2">
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
        <p className="text-sm text-white/70">No posts match the selected filter.</p>
      )}
    </div>
  );
}
