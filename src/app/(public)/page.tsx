import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Project, BlogPost } from "@/types";

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch featured projects
  const { data: featuredProjects } = await supabase
    .from("projects")
    .select("*")
    .eq("featured", true)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(3);

  // Fetch latest blog posts
  const { data: latestPosts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);

  return (
    <div className="mx-auto max-w-7xl px-8 py-16 flex flex-col gap-24">
      {/* Hero */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-accent uppercase tracking-widest">
            AI/ML Engineer & Researcher
          </p>
          <h1 className="font-display text-5xl sm:text-7xl font-semibold text-foreground leading-tight">
            Mohammed
            <br />
            Mutahar
          </h1>
        </div>
        <p className="max-w-xl text-base text-muted-foreground leading-relaxed">
          Master's student in Computer Science (AI/ML) at Northeastern
          University. I build production-grade AI systems at the intersection of
          computer vision, multimodal learning, and generative AI. Previously an
          AI Engineer with deployments in medical imaging and enterprise NLP.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            View Projects
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Read Blog
          </Link>
        </div>
      </section>

      {/* Links bar */}
      <section className="flex flex-wrap gap-6 text-sm text-muted-foreground border-y border-border py-5">
        <a href="#" className="hover:text-foreground transition-colors">
          GitHub ↗
        </a>
        <a href="#" className="hover:text-foreground transition-colors">
          LinkedIn ↗
        </a>
        <a href="#" className="hover:text-foreground transition-colors">
          Google Scholar ↗
        </a>
        <a href="#" className="hover:text-foreground transition-colors">
          Resume (PDF) ↗
        </a>
      </section>

      {/* Featured Projects */}
      <section className="flex flex-col gap-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl font-semibold">
            Featured Projects
          </h2>
          <Link
            href="/projects"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            All projects →
          </Link>
        </div>

        {featuredProjects && featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(featuredProjects as Project[]).map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 hover:border-accent transition-colors"
              >
                {/* Thumbnail placeholder */}
                <div className="aspect-video w-full rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
                  {project.thumbnail_url ? (
                    <img
                      src={project.thumbnail_url}
                      alt={project.title}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    "No thumbnail"
                  )}
                </div>
                <h3 className="font-medium text-foreground group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                )}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
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
          <p className="text-muted-foreground text-sm">
            No featured projects yet. Add some from the{" "}
            <Link href="/admin/projects" className="underline">
              admin panel
            </Link>
            .
          </p>
        )}
      </section>

      {/* Latest Blog Posts */}
      <section className="flex flex-col gap-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl font-semibold">
            Latest Writing
          </h2>
          <Link
            href="/blog"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            All posts →
          </Link>
        </div>

        {latestPosts && latestPosts.length > 0 ? (
          <div className="flex flex-col divide-y divide-border">
            {(latestPosts as BlogPost[]).map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 hover:bg-muted/40 -mx-3 px-3 rounded-md transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <h3 className="font-medium text-foreground group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {post.excerpt}
                    </p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Draft"}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            No posts published yet. Add some from the{" "}
            <Link href="/admin/blog" className="underline">
              admin panel
            </Link>
            .
          </p>
        )}
      </section>
    </div>
  );
}
