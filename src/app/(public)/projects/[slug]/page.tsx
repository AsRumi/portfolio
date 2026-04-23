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
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, #d6652a 0%, #c45520 40%, #b84418 100%)" }}
    >
      {/* Page header band */}
      <div className="border-b border-white/20">
        <div className="w-full px-10 pt-24 pb-8 flex flex-col gap-3">
          <Link
            href="/projects"
            className="text-sm text-white/60 hover:text-white transition-colors w-fit"
          >
            ← Back to Projects
          </Link>

          <h1 className="font-display text-4xl font-semibold text-white leading-tight max-w-4xl">
            {p.title}
          </h1>

          {p.description && (
            <p className="text-base text-white/70 max-w-2xl leading-relaxed">
              {p.description}
            </p>
          )}

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

          <div className="flex gap-3">
            {p.demo_url && (
              <a
                href={p.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2 text-sm font-medium text-[#a84010] hover:bg-white/90 transition-opacity"
              >
                Live Demo ↗
              </a>
            )}
            {p.github_url && (
              <a
                href={p.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/50 px-5 py-2 text-sm font-medium text-white hover:bg-white/15 transition-colors"
              >
                GitHub ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="w-full px-10 py-14 flex flex-col gap-12">
        {/* Thumbnail */}
        {p.thumbnail_url && (
          <img
            src={p.thumbnail_url}
            alt={p.title}
            className="w-full rounded-2xl object-cover max-h-96"
          />
        )}

        {/* Markdown content */}
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

        {/* Related Projects */}
        {related && related.length > 0 && (
          <section className="flex flex-col gap-6 pt-8 border-t border-white/20">
            <h2 className="font-display text-2xl font-semibold text-white">
              Related Projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(related as Partial<Project>[]).map((r) => (
                <Link
                  key={r.id}
                  href={`/projects/${r.slug}`}
                  className="rounded-2xl border border-white/20 bg-white/10 p-5 hover:bg-white/20 hover:border-white/40 transition-all flex flex-col gap-2"
                >
                  <h3 className="font-medium text-sm text-white">{r.title}</h3>
                  {r.description && (
                    <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                      {r.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
