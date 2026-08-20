import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import TableOfContents from "@/components/blog/TableOfContents";

// KaTeX ships its own stylesheet; without it, rendered math has no layout.
import "katex/dist/katex.min.css";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("title, excerpt, published_at")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "Post Not Found" };

  // See the note in the project detail page: the root layout's `openGraph` block
  // is merged into, not regenerated, so these have to be restated per post.
  const ogTitle = `${data.title} — Mutahar`;

  return {
    title: data.title,
    description: data.excerpt,
    openGraph: {
      type: "article",
      title: ogTitle,
      description: data.excerpt ?? undefined,
      url: `/blog/${slug}`,
      publishedTime: data.published_at ?? undefined,
      authors: ["Mohammed Mutahar"],
    },
    twitter: {
      title: ogTitle,
      description: data.excerpt ?? undefined,
    },
  };
}

/**
 * remark-math only treats `$$` as *display* math when the delimiters sit on
 * their own lines; a standalone `$$...$$` one-liner is parsed as inline math and
 * renders at body text size. Rewriting those lines into the fenced form gives
 * standalone equations proper centered display styling. Inline `$x$` inside a
 * sentence is untouched because the whole line must be the equation.
 */
function normalizeDisplayMath(content: string): string {
  return content.replace(
    /^[ \t]*\$\$[ \t]*(?!\s*$)([\s\S]*?)[ \t]*\$\$[ \t]*$/gm,
    (_match, expr: string) => `$$\n${expr.trim()}\n$$`
  );
}

function estimateReadTime(content: string | null): string {
  if (!content) return "1 min read";
  const words = content.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) notFound();

  const p = post as BlogPost;

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, #d6652a 0%, #c45520 40%, #b84418 100%)" }}
    >
      {/* Page header band */}
      <div className="border-b border-white/20">
        <div className="w-full px-5 sm:px-10 pt-20 sm:pt-24 pb-6 sm:pb-8 flex flex-col gap-3">
          <Link
            href="/blog"
            className="text-sm text-white/60 hover:text-white transition-colors w-fit"
          >
            ← Back to Blog
          </Link>

          {p.cover_image_url && (
            <img
              src={p.cover_image_url}
              alt={p.title}
              /* Matches the project detail page: object-contain + auto width
                 keeps the image's true aspect ratio instead of cropping it, and
                 the auto margins both center it and opt it out of the parent
                 flex column's stretch, so it never spans the full column */
              className="mx-auto max-w-full max-h-[70vh] w-auto h-auto rounded-2xl object-contain"
            />
          )}

          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white leading-tight max-w-4xl">
            {p.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-white/55">
            {p.published_at && (
              <span>
                {new Date(p.published_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
            <span>{estimateReadTime(p.content)}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="w-full px-5 sm:px-10 py-14">
        <div className="flex gap-16">
          {/* Markdown content */}
          <div className="flex-1 min-w-0">
            {p.content && (
              <article className="prose max-w-none
                prose-headings:font-display prose-headings:font-semibold prose-headings:text-white prose-headings:tracking-tight
                prose-p:text-white/80 prose-p:leading-relaxed
                prose-a:text-white prose-a:underline prose-a:decoration-white/40 hover:prose-a:decoration-white
                prose-strong:text-white
                prose-code:text-white prose-code:bg-white/15 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-white/10 prose-pre:border prose-pre:border-white/20
                prose-blockquote:border-white/40 prose-blockquote:text-white/65
                prose-li:text-white/80
                prose-img:rounded-xl
                prose-hr:border-white/20
                [&_.katex]:text-white [&_.katex-display]:my-6 [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden
              ">
                {/*
                  remark-math + rehype-katex render $inline$ and $$display$$ math.
                  rehype-raw parses inline HTML in the markdown source (e.g. <hr>,
                  <br>) into real elements instead of printing it as text — it must
                  run before rehype-katex so the math nodes survive the reparse.
                  Raw HTML is unsanitized, which is fine here because post content
                  is authored only by the admin panel owner.
                */}
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeRaw, rehypeKatex]}
                >
                  {normalizeDisplayMath(p.content)}
                </ReactMarkdown>
              </article>
            )}
          </div>

          {/* TOC sidebar */}
          <aside className="hidden lg:block w-52 shrink-0">
            <div className="sticky top-24">
              <TableOfContents content={p.content} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
