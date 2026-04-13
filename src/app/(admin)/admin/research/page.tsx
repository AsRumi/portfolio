import AdminLayout from "@/components/layout/AdminLayout";
import { createClient } from "@/lib/supabase/server";
import type { ResearchPaper } from "@/types";
import Link from "next/link";

export default async function AdminResearchPage() {
  const supabase = await createClient();
  const { data: papers } = await supabase
    .from("research_papers")
    .select("*")
    .order("year", { ascending: false });

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold">Research Papers</h1>
            <p className="text-sm text-muted-foreground mt-1">{papers?.length ?? 0} total</p>
          </div>
          <Link
            href="/admin/research/new"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            + Add Paper
          </Link>
        </div>

        {papers && papers.length > 0 ? (
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="px-4 py-3 font-medium text-foreground">Title</th>
                  <th className="px-4 py-3 font-medium text-foreground">Venue</th>
                  <th className="px-4 py-3 font-medium text-foreground">Year</th>
                  <th className="px-4 py-3 font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(papers as ResearchPaper[]).map((paper) => (
                  <tr key={paper.id} className="bg-card hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground max-w-xs truncate">{paper.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{paper.venue ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{paper.year ?? "—"}</td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/research/${paper.id}/edit`} className="text-accent hover:underline text-xs">Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground text-sm">
            No papers yet.{" "}
            <Link href="/admin/research/new" className="text-accent hover:underline">Add your first paper.</Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
