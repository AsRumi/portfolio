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
    title: `${data.title} — Mohammed Mutahar`,
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
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex gap-12">

        {/* Main content */}
        <div className="flex-1 flex flex-col gap-8 min-w-0">
          <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Blog
          </Link>

          {/* Post header */}
          <div className="flex flex-col gap-4">
            {p.cover_image_url && (
              <img
                src={p.cover_image_url}
                alt={p.title}
                className="w-full rounded-xl object-cover max-h-72"
              />
            )}
            <h1 className="font-display text-5xl font-semibold leading-tight">{p.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
                  <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Markdown body */}
          {p.content && (
            <article className="prose prose-sm max-w-none text-foreground prose-headings:font-display prose-headings:text-foreground prose-a:text-accent">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{p.content}</ReactMarkdown>
            </article>
          )}
        </div>

        {/* TOC sidebar — hidden on mobile */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-8">
            <TableOfContents content={p.content} />
          </div>
        </aside>

      </div>
    </div>
  );
}
