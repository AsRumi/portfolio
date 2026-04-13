"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { TimelineEntry } from "@/types";

type Props = {
  initial?: Partial<TimelineEntry>;
  mode: "new" | "edit";
};

const CATEGORIES: TimelineEntry["category"][] = [
  "project", "research", "job", "education", "milestone",
];

export default function TimelineEntryForm({ initial = {}, mode }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title ?? "");
  const [description, setDescription] = useState(initial.description ?? "");
  const [category, setCategory] = useState<TimelineEntry["category"]>(initial.category ?? "project");
  const [startDate, setStartDate] = useState(initial.start_date ?? "");
  const [endDate, setEndDate] = useState(initial.end_date ?? "");
  const [relatedUrl, setRelatedUrl] = useState(initial.related_url ?? "");
  const [colorOverride, setColorOverride] = useState(initial.color_override ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    const supabase = createClient();

    const payload = {
      title,
      description: description || null,
      category,
      start_date: startDate,
      end_date: endDate || null,
      related_url: relatedUrl || null,
      color_override: colorOverride || null,
    };

    let err;
    if (mode === "new") {
      ({ error: err } = await supabase.from("timeline_entries").insert(payload));
    } else {
      ({ error: err } = await supabase.from("timeline_entries").update(payload).eq("id", initial.id!));
    }

    if (err) {
      setError(err.message);
      setSaving(false);
    } else {
      router.push("/admin/timeline");
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this entry? This cannot be undone.")) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("timeline_entries").delete().eq("id", initial.id!);
    router.push("/admin/timeline");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <Field label="Title *">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Started AffectSync" className={inputClass} />
      </Field>

      <Field label="Description">
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description of this entry…" rows={3} className={inputClass} />
      </Field>

      <Field label="Category *">
        <select value={category} onChange={(e) => setCategory(e.target.value as TimelineEntry["category"])} className={inputClass}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Start Date *">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
        </Field>
        <Field label="End Date (leave blank for 'Present')">
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
        </Field>
      </div>

      <Field label="Related URL (optional)">
        <input value={relatedUrl} onChange={(e) => setRelatedUrl(e.target.value)} placeholder="https://…" className={inputClass} />
      </Field>

      <Field label="Custom Color (optional hex, overrides category color)">
        <div className="flex items-center gap-3">
          <input value={colorOverride} onChange={(e) => setColorOverride(e.target.value)} placeholder="#997E67" className={inputClass + " max-w-xs"} />
          {colorOverride && (
            <div className="w-6 h-6 rounded-full border border-border" style={{ backgroundColor: colorOverride }} />
          )}
        </div>
      </Field>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button onClick={handleSave} disabled={saving || !title || !startDate} className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity">
          {saving ? "Saving…" : mode === "new" ? "Create Entry" : "Save Changes"}
        </button>
        <button onClick={() => router.push("/admin/timeline")} className="rounded-md border border-border px-5 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
          Cancel
        </button>
        {mode === "edit" && (
          <button onClick={handleDelete} disabled={deleting} className="ml-auto rounded-md text-sm font-medium text-destructive hover:underline disabled:opacity-50">
            {deleting ? "Deleting…" : "Delete Entry"}
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
