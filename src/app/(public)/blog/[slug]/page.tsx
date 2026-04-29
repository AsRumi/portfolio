import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TableOfContents from "@/components/blog/TableOfContents";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "Post Not Found" };
  return {
    title: data.title,
    description: data.excerpt,
  };
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
              className="w-full rounded-2xl object-cover max-h-72"
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

          {p.tags && p.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {p.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/15 px-3 py-1 text-xs text-white/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
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
              ">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{p.content}</ReactMarkdown>
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
