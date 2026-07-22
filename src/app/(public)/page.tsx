import { createClient } from "@/lib/supabase/server";
import type { Project, BlogPost, ResearchPaper } from "@/types";
import HomeExperience from "@/components/home/HomeExperience";

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch an unfiltered pool for each content type; HomeExperience slices these
  // per selected persona on the client. We over-fetch (limit 12) so a persona
  // filter still has enough items to fill its 3-card sections.
  const [{ data: projects }, { data: posts }, { data: research }] =
    await Promise.all([
      supabase
        .from("projects")
        .select("*")
        .eq("featured", true)
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(12),
      supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(12),
      supabase
        .from("research_papers")
        .select("*")
        .order("year", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false })
        .limit(12),
    ]);

  return (
    <HomeExperience
      projects={(projects as Project[]) ?? []}
      posts={(posts as BlogPost[]) ?? []}
      research={(research as ResearchPaper[]) ?? []}
    />
  );
}
