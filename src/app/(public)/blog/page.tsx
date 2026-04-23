import { createClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/types";
import BlogGrid from "@/components/blog/BlogGrid";

export const metadata = {
  title: "Blog — Mohammed Mutahar",
};

export default async function BlogPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const allTags = Array.from(
    new Set((posts as BlogPost[] ?? []).flatMap((p) => p.tags ?? []))
  ).sort();

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #d6652a 0%, #c45520 40%, #b84418 100%)" }}>
      <div className="border-b border-white/20">
        <div className="mx-auto max-w-7xl px-8 pt-32 pb-12 flex flex-col gap-4">
          <p className="text-xs font-medium text-white/60 uppercase tracking-widest">
            Writing
          </p>
          <h1 className="font-display text-5xl font-semibold text-white">
            Blog
          </h1>
          <p className="text-white/75 max-w-xl leading-relaxed">
            Writing on AI/ML research, engineering lessons, and ideas worth
            thinking through.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-8 py-16">
        <BlogGrid posts={posts as BlogPost[] ?? []} allTags={allTags} />
      </div>
    </div>
  );
}
