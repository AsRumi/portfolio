import { createClient } from "@/lib/supabase/server";
import type { TimelineEntry } from "@/types";
import TimelineView from "@/components/timeline/TimelineView";

export const metadata = {
  title: "Timeline — Mohammed Mutahar",
};

export default async function TimelinePage() {
  const supabase = await createClient();

  const { data: entries } = await supabase
    .from("timeline_entries")
    .select("*")
    .order("start_date", { ascending: false });

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <h1 className="font-display text-5xl font-semibold">Timeline</h1>
        <p className="text-muted-foreground max-w-xl">
          A chronological view of projects, research, roles, and milestones.
        </p>
      </div>
      <TimelineView entries={entries as TimelineEntry[] ?? []} />
    </div>
  );
}
