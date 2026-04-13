"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { ResearchPaper } from "@/types";
import FileUploader from "./FileUploader";

type Props = {
  initial?: Partial<ResearchPaper>;
  mode: "new" | "edit";
};

export default function ResearchPaperForm({ initial = {}, mode }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title ?? "");
  const [authors, setAuthors] = useState(initial.authors ?? "");
  const [abstract, setAbstract] = useState(initial.abstract ?? "");
  const [venue, setVenue] = useState(initial.venue ?? "");
  const [year, setYear] = useState(initial.year?.toString() ?? "");
  const [pdfUrl, setPdfUrl] = useState(initial.pdf_url ?? "");
  const [externalUrl, setExternalUrl] = useState(initial.external_url ?? "");
  const [tags, setTags] = useState(initial.tags?.join(", ") ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    const supabase = createClient();

    const payload = {
      title,
      authors: authors || null,
      abstract: abstract || null,
      venue: venue || null,
      year: year ? parseInt(year) : null,
      pdf_url: pdfUrl || null,
      external_url: externalUrl || null,
      tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    };

    let err;
    if (mode === "new") {
      ({ error: err } = await supabase.from("research_papers").insert(payload));
    } else {
      ({ error: err } = await supabase.from("research_papers").update(payload).eq("id", initial.id!));
    }

    if (err) {
      setError(err.message);
      setSaving(false);
    } else {
      router.push("/admin/research");
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this paper? This cannot be undone.")) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("research_papers").delete().eq("id", initial.id!);
    router.push("/admin/research");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <Field label="Title *">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Paper title" className={inputClass} />
      </Field>

      <Field label="Authors">
        <input value={authors} onChange={(e) => setAuthors(e.target.value)} placeholder="Mohammed Mutahar, Co-Author Name" className={inputClass} />
      </Field>

      <Field label="Abstract">
        <textarea value={abstract} onChange={(e) => setAbstract(e.target.value)} placeholder="Paper abstract…" rows={5} className={inputClass} />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Venue">
          <input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="CVPR 2025" className={inputClass} />
        </Field>
        <Field label="Year">
          <input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2025" className={inputClass} />
        </Field>
      </div>

      <Field label="Tags (comma-separated)">
        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Medical Imaging, Deep Learning" className={inputClass} />
      </Field>

      <Field label="PDF">
        <FileUploader bucket="pdfs" accept=".pdf" label="Upload PDF" onUpload={(url) => setPdfUrl(url)} />
        {pdfUrl && (
          <div className="mt-2 flex items-center gap-3 text-sm">
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">View uploaded PDF ↗</a>
            <button onClick={() => setPdfUrl("")} className="text-xs text-destructive hover:underline">Remove</button>
          </div>
        )}
      </Field>

      <Field label="DOI / Publisher URL">
        <input value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} placeholder="https://doi.org/…" className={inputClass} />
      </Field>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button onClick={handleSave} disabled={saving || !title} className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity">
          {saving ? "Saving…" : mode === "new" ? "Add Paper" : "Save Changes"}
        </button>
        <button onClick={() => router.push("/admin/research")} className="rounded-md border border-border px-5 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
          Cancel
        </button>
        {mode === "edit" && (
          <button onClick={handleDelete} disabled={deleting} className="ml-auto rounded-md text-sm font-medium text-destructive hover:underline disabled:opacity-50">
            {deleting ? "Deleting…" : "Delete Paper"}
          </button>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}

const inputClass = "rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring transition w-full";
