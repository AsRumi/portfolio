import AdminLayout from "@/components/layout/AdminLayout";
import ResearchPaperForm from "@/components/admin/ResearchPaperForm";
import Link from "next/link";

export default function NewResearchPaperPage() {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <Link href="/admin/research" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Research</Link>
          <h1 className="font-display text-3xl font-semibold mt-2">Add Paper</h1>
        </div>
        <ResearchPaperForm mode="new" />
      </div>
    </AdminLayout>
  );
}
