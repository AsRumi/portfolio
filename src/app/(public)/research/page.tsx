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
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #d6652a 0%, #c45520 40%, #b84418 100%)" }}>
      <div className="border-b border-white/20">
        <div className="w-full px-10 pt-32 pb-12 flex flex-col gap-4">
          <p className="text-xs font-medium text-white/60 uppercase tracking-widest">
            Publications
          </p>
          <h1 className="font-display text-5xl font-semibold text-white">
            Research
          </h1>
          <p className="text-white/75 max-w-xl leading-relaxed">
            Published papers and ongoing research in medical imaging, deep
            learning, and multimodal AI.
          </p>
        </div>
      </div>

      <div className="w-full px-10 py-16">
        <PaperList papers={papers as ResearchPaper[] ?? []} allTags={allTags} />
      </div>
    </div>
  );
}
