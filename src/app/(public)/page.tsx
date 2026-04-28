import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Project, BlogPost } from "@/types";
import HeroSection from "@/components/home/HeroSection";
import FadeInView from "@/components/ui/FadeInView";

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
      <HeroSection />

      {/* ─── Orange body starts here ──────────────────────────────────── */}
      <div
        className="flex flex-col"
        style={{
          background:
            "linear-gradient(180deg, #8B2E14 0%, #a84010 15%, #d6652a 40%, #c45520 70%, #b84418 100%)",
        }}
      >
        {/* ─── Featured Projects ──────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-8 py-24 flex flex-col gap-12 w-full">
          <FadeInView className="flex items-end justify-between">
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
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </FadeInView>

          {featuredProjects && featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(featuredProjects as Project[]).map((project, i) => (
                <FadeInView key={project.id} delay={i * 0.08}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group flex flex-col gap-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-5 hover:bg-white/20 hover:border-white/40 transition-all h-full"
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
                </FadeInView>
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
            <FadeInView className="flex items-end justify-between">
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
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </FadeInView>

            {latestPosts && latestPosts.length > 0 ? (
              <div className="flex flex-col">
                {(latestPosts as BlogPost[]).map((post, i) => (
                  <FadeInView key={post.id} delay={i * 0.1}>
                    <Link
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
                            ? new Date(post.published_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : "Draft"}
                        </span>
                        <span className="text-xs text-white/50 group-hover:text-white transition-colors">
                          →
                        </span>
                      </div>
                    </Link>
                  </FadeInView>
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
