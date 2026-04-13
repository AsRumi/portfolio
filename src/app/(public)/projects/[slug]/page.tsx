import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("title, description")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "Project Not Found" };
  return {
    title: `${data.title} — Mohammed Mutahar`,
    description: data.description,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!project) notFound();

  const p = project as Project;

  // Related projects with overlapping tags
  const { data: related } = p.tags?.length
    ? await supabase
        .from("projects")
        .select("id, title, slug, description, tags")
        .eq("status", "published")
        .neq("id", p.id)
        .overlaps("tags", p.tags)
        .limit(3)
    : { data: [] };

  return (
    <div className="mx-auto max-w-5xl px-8 py-16 flex flex-col gap-12">
      {/* Back */}
      <Link
        href="/projects"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back to Projects
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="font-display text-5xl font-semibold leading-tight">
          {p.title}
        </h1>
        {p.description && (
          <p className="text-lg text-muted-foreground">{p.description}</p>
        )}
        {p.tags && p.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {p.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-3">
          {p.demo_url && (
            <a
              href={p.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Live Demo ↗
            </a>
          )}
          {p.github_url && (
            <a
              href={p.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              GitHub ↗
            </a>
          )}
        </div>
      </div>

      {/* Thumbnail */}
      {p.thumbnail_url && (
        <img
          src={p.thumbnail_url}
          alt={p.title}
          className="w-full rounded-xl object-cover max-h-96"
        />
      )}

      {/* Markdown Content */}
      {p.content && (
        <article className="prose prose-stone max-w-none prose-headings:font-display prose-headings:text-foreground prose-headings:font-semibold prose-p:text-foreground prose-p:leading-relaxed prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-accent prose-blockquote:text-muted-foreground prose-li:text-foreground prose-img:rounded-xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{p.content}</ReactMarkdown>
        </article>
      )}

      {/* Related Projects */}
      {related && related.length > 0 && (
        <section className="flex flex-col gap-6 pt-8 border-t border-border">
          <h2 className="font-display text-2xl font-semibold">
            Related Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(related as Partial<Project>[]).map((r) => (
              <Link
                key={r.id}
                href={`/projects/${r.slug}`}
                className="rounded-lg border border-border bg-card p-4 hover:border-accent transition-colors flex flex-col gap-2"
              >
                <h3 className="font-medium text-sm text-foreground">
                  {r.title}
                </h3>
                {r.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {r.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
