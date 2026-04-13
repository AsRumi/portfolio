import { notFound } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import ProjectForm from "@/components/admin/ProjectForm";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/types";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase.from("projects").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <Link href="/admin/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Projects
          </Link>
          <h1 className="font-display text-3xl font-semibold mt-2">Edit Project</h1>
        </div>
        <ProjectForm mode="edit" initial={data as Project} />
      </div>
    </AdminLayout>
  );
}
