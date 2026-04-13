import { notFound } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import TimelineEntryForm from "@/components/admin/TimelineEntryForm";
import { createClient } from "@/lib/supabase/server";
import type { TimelineEntry } from "@/types";
import Link from "next/link";

type Props = { params: Promise<{ id: string }> };

export default async function EditTimelineEntryPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("timeline_entries").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <Link href="/admin/timeline" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Timeline</Link>
          <h1 className="font-display text-3xl font-semibold mt-2">Edit Entry</h1>
        </div>
        <TimelineEntryForm mode="edit" initial={data as TimelineEntry} />
      </div>
    </AdminLayout>
  );
}
