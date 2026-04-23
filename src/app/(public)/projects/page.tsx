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

  const allTags = Array.from(
    new Set((projects as Project[] ?? []).flatMap((p) => p.tags ?? []))
  ).sort();

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #d6652a 0%, #c45520 40%, #b84418 100%)" }}>
      {/* Page header */}
      <div className="border-b border-white/20">
        <div className="w-full px-10 pt-32 pb-12 flex flex-col gap-4">
          <p className="text-xs font-medium text-white/60 uppercase tracking-widest">
            Work
          </p>
          <h1 className="font-display text-5xl font-semibold text-white">
            Projects
          </h1>
          <p className="text-white/75 max-w-xl leading-relaxed">
            A collection of AI/ML projects spanning computer vision, multimodal
            learning, generative AI, and full-stack deployment.
          </p>
        </div>
      </div>

      <div className="w-full px-10 py-16">
        <ProjectsGrid projects={projects as Project[] ?? []} allTags={allTags} />
      </div>
    </div>
  );
}
