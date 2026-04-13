"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slugify";
import type { Project } from "@/types";
import MarkdownEditor from "./MarkdownEditor";
import FileUploader from "./FileUploader";

type Props = {
  initial?: Partial<Project>;
  mode: "new" | "edit";
};

export default function ProjectForm({ initial = {}, mode }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title ?? "");
  const [slug, setSlug] = useState(initial.slug ?? "");
  const [description, setDescription] = useState(initial.description ?? "");
  const [content, setContent] = useState(initial.content ?? "");
  const [tags, setTags] = useState(initial.tags?.join(", ") ?? "");
  const [demoUrl, setDemoUrl] = useState(initial.demo_url ?? "");
  const [githubUrl, setGithubUrl] = useState(initial.github_url ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(initial.thumbnail_url ?? "");
  const [featured, setFeatured] = useState(initial.featured ?? false);
  const [status, setStatus] = useState<"published" | "draft">(initial.status ?? "draft");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (mode === "new") setSlug(slugify(val));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    const supabase = createClient();

    const payload = {
      title,
      slug,
      description: description || null,
      content: content || null,
      tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      demo_url: demoUrl || null,
      github_url: githubUrl || null,
      thumbnail_url: thumbnailUrl || null,
      featured,
      status,
      updated_at: new Date().toISOString(),
    };

    let err;
    if (mode === "new") {
      ({ error: err } = await supabase.from("projects").insert(payload));
    } else {
      ({ error: err } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", initial.id!));
    }

    if (err) {
      setError(err.message);
      setSaving(false);
    } else {
      router.push("/admin/projects");
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("projects").delete().eq("id", initial.id!);
    router.push("/admin/projects");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Title + Slug */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Title *">
          <input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="My Project"
            className={inputClass}
          />
        </Field>
        <Field label="Slug *">
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="my-project"
            className={inputClass}
          />
        </Field>
      </div>

      {/* Description */}
      <Field label="Short Description">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="One or two sentences shown in project cards."
          rows={2}
          className={inputClass}
        />
      </Field>

      {/* Markdown content */}
      <Field label="Full Content (Markdown)">
        <MarkdownEditor value={content} onChange={setContent} height={380} />
      </Field>

      {/* Tags */}
      <Field label="Tags (comma-separated)">
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="PyTorch, FastAPI, Computer Vision"
          className={inputClass}
        />
      </Field>

      {/* URLs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Demo URL">
          <input value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} placeholder="https://…" className={inputClass} />
        </Field>
        <Field label="GitHub URL">
          <input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/…" className={inputClass} />
        </Field>
      </div>

      {/* Thumbnail */}
      <Field label="Thumbnail">
        <FileUploader
          bucket="thumbnails"
          label="Upload thumbnail image"
          onUpload={(url) => setThumbnailUrl(url)}
        />
        {thumbnailUrl && (
          <div className="mt-2 flex items-center gap-3">
            <img src={thumbnailUrl} alt="Thumbnail preview" className="h-20 w-32 object-cover rounded-md border border-border" />
            <button onClick={() => setThumbnailUrl("")} className="text-xs text-destructive hover:underline">Remove</button>
          </div>
        )}
      </Field>

      {/* Toggles */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="accent-primary w-4 h-4"
          />
          Featured on home page
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm">Status:</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "published" | "draft")}
            className="rounded-md border border-input bg-background px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Action buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving || !title || !slug}
          className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {saving ? "Saving…" : mode === "new" ? "Create Project" : "Save Changes"}
        </button>
        <button
          onClick={() => router.push("/admin/projects")}
          className="rounded-md border border-border px-5 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        {mode === "edit" && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="ml-auto rounded-md text-sm font-medium text-destructive hover:underline disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete Project"}
          </button>
        )}
      </div>
    </div>
  );
}

// Small helper for labeled form fields
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring transition w-full";
