import AdminLayout from "@/components/layout/AdminLayout";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/types";
import Link from "next/link";

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold">Projects</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {projects?.length ?? 0} total
            </p>
          </div>
          <Link
            href="/admin/projects/new"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            + New Project
          </Link>
        </div>

        {projects && projects.length > 0 ? (
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="px-4 py-3 font-medium text-foreground">Title</th>
                  <th className="px-4 py-3 font-medium text-foreground">Status</th>
                  <th className="px-4 py-3 font-medium text-foreground">Featured</th>
                  <th className="px-4 py-3 font-medium text-foreground">Tags</th>
                  <th className="px-4 py-3 font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(projects as Project[]).map((project) => (
                  <tr key={project.id} className="bg-card hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{project.title}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          project.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {project.featured ? "✓" : "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {project.tags?.slice(0, 3).join(", ") ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="text-accent hover:underline text-xs"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/projects/${project.slug}`}
                          target="_blank"
                          className="text-muted-foreground hover:text-foreground text-xs"
                        >
                          View ↗
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground text-sm">
            No projects yet.{" "}
            <Link href="/admin/projects/new" className="text-accent hover:underline">
              Create your first one.
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
