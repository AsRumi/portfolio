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
    <div className="mx-auto max-w-7xl px-8 py-16 flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <h1 className="font-display text-5xl font-semibold">Blog</h1>
        <p className="text-muted-foreground max-w-xl">
          Writing on AI/ML research, engineering lessons, and ideas worth thinking through.
        </p>
      </div>

      <BlogGrid posts={posts as BlogPost[] ?? []} allTags={allTags} />
    </div>
  );
}
