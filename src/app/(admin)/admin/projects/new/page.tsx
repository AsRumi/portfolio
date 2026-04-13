import AdminLayout from "@/components/layout/AdminLayout";
import ProjectForm from "@/components/admin/ProjectForm";
import Link from "next/link";

export default function NewProjectPage() {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <Link href="/admin/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Projects
          </Link>
          <h1 className="font-display text-3xl font-semibold mt-2">New Project</h1>
        </div>
        <ProjectForm mode="new" />
      </div>
    </AdminLayout>
  );
}
