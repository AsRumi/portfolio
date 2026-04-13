import { notFound } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import ResearchPaperForm from "@/components/admin/ResearchPaperForm";
import { createClient } from "@/lib/supabase/server";
import type { ResearchPaper } from "@/types";
import Link from "next/link";

type Props = { params: Promise<{ id: string }> };

export default async function EditResearchPaperPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("research_papers").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <Link href="/admin/research" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Research</Link>
          <h1 className="font-display text-3xl font-semibold mt-2">Edit Paper</h1>
        </div>
        <ResearchPaperForm mode="edit" initial={data as ResearchPaper} />
      </div>
    </AdminLayout>
  );
}
