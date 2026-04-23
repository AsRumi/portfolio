import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Project, BlogPost } from "@/types";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: featuredProjects } = await supabase
    .from("projects")
    .select("*")
    .eq("featured", true)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(3);

  const { data: latestPosts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);

  return (
    <div className="flex flex-col">
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Sunset gradient sky */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #F5A623 0%, #E8832A 25%, #D4622A 50%, #B8451F 70%, #8B2E14 85%, #5C1A0A 100%)",
          }}
        />

        {/* Mountain layers — back to front using clip-path */}
        {/* Layer 1 — farthest, lightest */}
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(120, 60, 20, 0.35)",
            clipPath:
              "polygon(0% 100%, 0% 72%, 4% 68%, 8% 64%, 13% 58%, 18% 52%, 22% 55%, 26% 48%, 30% 42%, 35% 46%, 39% 40%, 43% 44%, 47% 38%, 52% 32%, 56% 37%, 60% 44%, 64% 38%, 68% 43%, 72% 36%, 76% 41%, 80% 47%, 84% 42%, 88% 48%, 92% 54%, 96% 60%, 100% 64%, 100% 100%)",
          }}
        />
        {/* Layer 2 */}
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(90, 40, 10, 0.45)",
            clipPath:
              "polygon(0% 100%, 0% 78%, 3% 74%, 7% 70%, 11% 65%, 15% 60%, 19% 64%, 23% 57%, 28% 52%, 32% 56%, 36% 50%, 40% 54%, 44% 48%, 48% 43%, 52% 47%, 57% 42%, 61% 47%, 65% 53%, 69% 48%, 73% 44%, 77% 49%, 81% 55%, 85% 50%, 89% 56%, 93% 62%, 97% 68%, 100% 72%, 100% 100%)",
          }}
        />
        {/* Layer 3 — midground */}
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(60, 25, 5, 0.55)",
            clipPath:
              "polygon(0% 100%, 0% 84%, 5% 79%, 9% 75%, 14% 70%, 18% 75%, 22% 68%, 27% 62%, 31% 67%, 35% 61%, 40% 56%, 44% 61%, 48% 55%, 53% 60%, 57% 65%, 61% 59%, 65% 64%, 70% 70%, 74% 65%, 78% 60%, 82% 65%, 86% 71%, 90% 66%, 94% 72%, 98% 78%, 100% 82%, 100% 100%)",
          }}
        />
        {/* Layer 4 — closest, darkest */}
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(30, 10, 2, 0.75)",
            clipPath:
              "polygon(0% 100%, 0% 90%, 4% 86%, 8% 82%, 12% 87%, 16% 82%, 20% 77%, 24% 82%, 29% 76%, 33% 81%, 37% 75%, 41% 80%, 45% 74%, 50% 79%, 54% 84%, 58% 78%, 62% 83%, 66% 88%, 70% 82%, 74% 77%, 78% 82%, 82% 87%, 86% 82%, 90% 78%, 94% 83%, 97% 88%, 100% 92%, 100% 100%)",
          }}
        />

        {/* Hero text content */}
        <div className="relative z-10 mx-auto max-w-7xl px-8 pt-48 pb-32 flex flex-col gap-8">
          <div className="flex flex-col gap-4 max-w-2xl">
            <p className="text-sm font-medium text-white/60 uppercase tracking-widest">
              AI/ML Engineer &amp; Researcher
            </p>
            <h1 className="font-display text-6xl sm:text-8xl font-semibold text-white leading-[1.05]">
              Building AI
              <br />
              that matters.
            </h1>
            <p className="text-base text-white/75 leading-relaxed max-w-lg">
              Master&apos;s student in Computer Science (AI/ML) at Northeastern
              University. I build production-grade AI systems at the intersection of
              computer vision, multimodal learning, and generative AI.
            </p>
          </div>

          {/* CTA links — Mistral underline style */}
          <div className="flex flex-wrap gap-8">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-white text-sm border-b border-white/40 pb-0.5 hover:border-white transition-colors"
            >
              View Projects
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/research"
              className="group inline-flex items-center gap-2 text-white text-sm border-b border-white/40 pb-0.5 hover:border-white transition-colors"
            >
              Read Research
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Orange body starts here ──────────────────────────────────── */}
      <div className="flex flex-col" style={{ background: "linear-gradient(180deg, #8B2E14 0%, #a84010 15%, #d6652a 40%, #c45520 70%, #b84418 100%)" }}>


        {/* ─── Featured Projects ──────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-8 py-24 flex flex-col gap-12 w-full">
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-white/50 uppercase tracking-widest">
                Work
              </p>
              <h2 className="font-display text-4xl font-semibold text-white">
                Featured Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-1.5 text-sm text-white/70 border-b border-white/30 pb-0.5 hover:text-white hover:border-white transition-colors"
            >
              All projects
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {featuredProjects && featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(featuredProjects as Project[]).map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="group flex flex-col gap-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-5 hover:bg-white/20 hover:border-white/40 transition-all"
                >
                  <div className="aspect-video w-full rounded-xl bg-white/10 overflow-hidden flex items-center justify-center text-xs text-white/50">
                    {project.thumbnail_url ? (
                      <img
                        src={project.thumbnail_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      "No thumbnail"
                    )}
                  </div>
                  <h3 className="font-medium text-white group-hover:text-white/75 transition-colors">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="text-sm text-white/65 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  )}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs text-white/80"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-white/60 text-sm">
              No featured projects yet.{" "}
              <Link href="/admin/projects" className="underline">
                Add some from the admin panel.
              </Link>
            </p>
          )}
        </section>

        {/* ─── Latest Writing ─────────────────────────────────────────── */}
        <section className="border-t border-white/15">
          <div className="mx-auto max-w-7xl px-8 py-24 flex flex-col gap-12 w-full">
            <div className="flex items-end justify-between">
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium text-white/50 uppercase tracking-widest">
                  Writing
                </p>
                <h2 className="font-display text-4xl font-semibold text-white">
                  Latest Posts
                </h2>
              </div>
              <Link
                href="/blog"
                className="group inline-flex items-center gap-1.5 text-sm text-white/70 border-b border-white/30 pb-0.5 hover:text-white hover:border-white transition-colors"
              >
                All posts
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            {latestPosts && latestPosts.length > 0 ? (
              <div className="flex flex-col">
                {(latestPosts as BlogPost[]).map((post, i) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className={`group py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-white/10 -mx-4 px-4 rounded-xl transition-colors ${
                      i !== 0 ? "border-t border-white/15" : ""
                    }`}
                  >
                    <div className="flex flex-col gap-1">
                      <h3 className="font-medium text-white group-hover:text-white/75 transition-colors">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm text-white/60 line-clamp-1">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-xs text-white/50">
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Draft"}
                      </span>
                      <span className="text-xs text-white/50 group-hover:text-white transition-colors">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-white/60 text-sm">
                No posts published yet.{" "}
                <Link href="/admin/blog" className="underline">
                  Add some from the admin panel.
                </Link>
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
