"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slugify";
import type { BlogPost } from "@/types";
import MarkdownEditor from "./MarkdownEditor";
import FileUploader from "./FileUploader";

type Props = {
  initial?: Partial<BlogPost>;
  mode: "new" | "edit";
};

export default function BlogPostForm({ initial = {}, mode }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title ?? "");
  const [slug, setSlug] = useState(initial.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial.excerpt ?? "");
  const [content, setContent] = useState(initial.content ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(initial.cover_image_url ?? "");
  const [tags, setTags] = useState(initial.tags?.join(", ") ?? "");
  const [featured, setFeatured] = useState(initial.featured ?? false);
  const [status, setStatus] = useState<"published" | "draft">(initial.status ?? "draft");
  const [publishedAt, setPublishedAt] = useState(
    initial.published_at ? initial.published_at.slice(0, 10) : ""
  );
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
      excerpt: excerpt || null,
      content: content || null,
      cover_image_url: coverImageUrl || null,
      tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      featured,
      status,
      // Set published_at to now when first publishing if not already set
      published_at: publishedAt
        ? new Date(publishedAt).toISOString()
        : status === "published"
        ? new Date().toISOString()
        : null,
      updated_at: new Date().toISOString(),
    };

    let err;
    if (mode === "new") {
      ({ error: err } = await supabase.from("blog_posts").insert(payload));
    } else {
      ({ error: err } = await supabase
        .from("blog_posts")
        .update(payload)
        .eq("id", initial.id!));
    }

    if (err) {
      setError(err.message);
      setSaving(false);
    } else {
      router.push("/admin/blog");
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("blog_posts").delete().eq("id", initial.id!);
    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Title *">
          <input value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Post title" className={inputClass} />
        </Field>
        <Field label="Slug *">
          <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="post-slug" className={inputClass} />
        </Field>
      </div>

      <Field label="Excerpt">
        <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short summary shown in post cards." rows={2} className={inputClass} />
      </Field>

      <Field label="Content (Markdown)">
        <MarkdownEditor value={content} onChange={setContent} height={480} />
      </Field>

      <Field label="Tags (comma-separated)">
        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="AI, Research, Tutorial" className={inputClass} />
      </Field>

      <Field label="Cover Image">
        <FileUploader bucket="thumbnails" label="Upload cover image" onUpload={(url) => setCoverImageUrl(url)} />
        {coverImageUrl && (
          <div className="mt-2 flex items-center gap-3">
            <img src={coverImageUrl} alt="Cover preview" className="h-20 w-32 object-cover rounded-md border border-border" />
            <button onClick={() => setCoverImageUrl("")} className="text-xs text-destructive hover:underline">Remove</button>
          </div>
        )}
      </Field>

      <div className="flex flex-wrap gap-6 items-center">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="accent-primary w-4 h-4" />
          Featured on home page
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm">Status:</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as "published" | "draft")} className="rounded-md border border-input bg-background px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-ring">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <Field label="Publish Date">
          <input type="date" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className={inputClass + " w-auto"} />
        </Field>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button onClick={handleSave} disabled={saving || !title || !slug} className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity">
          {saving ? "Saving…" : mode === "new" ? "Create Post" : "Save Changes"}
        </button>
        <button onClick={() => router.push("/admin/blog")} className="rounded-md border border-border px-5 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
          Cancel
        </button>
        {mode === "edit" && (
          <button onClick={handleDelete} disabled={deleting} className="ml-auto rounded-md text-sm font-medium text-destructive hover:underline disabled:opacity-50">
            {deleting ? "Deleting…" : "Delete Post"}
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
