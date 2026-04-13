import AdminLayout from "@/components/layout/AdminLayout";
import TimelineEntryForm from "@/components/admin/TimelineEntryForm";
import Link from "next/link";

export default function NewTimelineEntryPage() {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <Link href="/admin/timeline" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Timeline</Link>
          <h1 className="font-display text-3xl font-semibold mt-2">New Timeline Entry</h1>
        </div>
        <TimelineEntryForm mode="new" />
      </div>
    </AdminLayout>
  );
}
