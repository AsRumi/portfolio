import { createClient } from "@/lib/supabase/server";
import type { TimelineEntry } from "@/types";
import TimelineView from "@/components/timeline/TimelineView";

export const metadata = {
  title: "Timeline",
};

export default async function TimelinePage() {
  const supabase = await createClient();

  const { data: entries } = await supabase
    .from("timeline_entries")
    .select("*")
    .order("start_date", { ascending: false });

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #d6652a 0%, #c45520 40%, #b84418 100%)" }}>
      <div className="border-b border-white/20">
        <div className="w-full px-5 sm:px-10 pt-24 sm:pt-32 pb-10 sm:pb-12 flex flex-col gap-4">
          <p className="text-xs font-medium text-white/60 uppercase tracking-widest">
            History
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-white">
            Timeline
          </h1>
          <p className="text-white/75 max-w-xl leading-relaxed">
            A chronological view of projects, research, roles, and milestones.
          </p>
        </div>
      </div>

      <div className="w-full px-5 sm:px-10 py-16">
        <TimelineView entries={entries as TimelineEntry[] ?? []} />
      </div>
    </div>
  );
}
