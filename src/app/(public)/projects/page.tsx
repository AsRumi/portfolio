import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/types";
import ProjectsGrid from "@/components/projects/ProjectsGrid";

export const metadata = {
  title: "Projects — Mohammed Mutahar",
};

export default async function ProjectsPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  // Collect all unique tags across projects
  const allTags = Array.from(
    new Set((projects as Project[] ?? []).flatMap((p) => p.tags ?? []))
  ).sort();

  return (
    <div className="mx-auto max-w-7xl px-8 py-16 flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <h1 className="font-display text-5xl font-semibold">Projects</h1>
        <p className="text-muted-foreground max-w-xl">
          A collection of AI/ML projects spanning computer vision, multimodal learning,
          generative AI, and full-stack deployment.
        </p>
      </div>

      {/* Client component handles tag filtering */}
      <ProjectsGrid projects={projects as Project[] ?? []} allTags={allTags} />
    </div>
  );
}
