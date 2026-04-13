import { createClient } from "@/lib/supabase/server";
import type { ResearchPaper } from "@/types";
import PaperList from "@/components/research/PaperList";

export const metadata = {
  title: "Research — Mohammed Mutahar",
};

export default async function ResearchPage() {
  const supabase = await createClient();

  const { data: papers } = await supabase
    .from("research_papers")
    .select("*")
    .order("year", { ascending: false });

  const allTags = Array.from(
    new Set((papers as ResearchPaper[] ?? []).flatMap((p) => p.tags ?? []))
  ).sort();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <h1 className="font-display text-5xl font-semibold">Research</h1>
        <p className="text-muted-foreground max-w-xl">
          Published papers and ongoing research in medical imaging, deep learning, and multimodal AI.
        </p>
      </div>
      <PaperList papers={papers as ResearchPaper[] ?? []} allTags={allTags} />
    </div>
  );
}
