import AdminLayout from "@/components/layout/AdminLayout";
import { createClient } from "@/lib/supabase/server";
import type { TimelineEntry } from "@/types";
import Link from "next/link";

export default async function AdminTimelinePage() {
  const supabase = await createClient();
  const { data: entries } = await supabase
    .from("timeline_entries")
    .select("*")
    .order("start_date", { ascending: false });

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold">Timeline</h1>
            <p className="text-sm text-muted-foreground mt-1">{entries?.length ?? 0} entries</p>
          </div>
          <Link
            href="/admin/timeline/new"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            + New Entry
          </Link>
        </div>

        {entries && entries.length > 0 ? (
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="px-4 py-3 font-medium text-foreground">Title</th>
                  <th className="px-4 py-3 font-medium text-foreground">Category</th>
                  <th className="px-4 py-3 font-medium text-foreground">Start Date</th>
                  <th className="px-4 py-3 font-medium text-foreground">End Date</th>
                  <th className="px-4 py-3 font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(entries as TimelineEntry[]).map((entry) => (
                  <tr key={entry.id} className="bg-card hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{entry.title}</td>
                    <td className="px-4 py-3 text-muted-foreground capitalize">{entry.category}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(entry.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {entry.end_date
                        ? new Date(entry.end_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                        : "Present"}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/timeline/${entry.id}/edit`} className="text-accent hover:underline text-xs">Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground text-sm">
            No timeline entries yet.{" "}
            <Link href="/admin/timeline/new" className="text-accent hover:underline">Add your first entry.</Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
