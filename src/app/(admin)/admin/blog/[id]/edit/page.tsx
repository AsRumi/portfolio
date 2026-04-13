import { notFound } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import BlogPostForm from "@/components/admin/BlogPostForm";
import { createClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/types";
import Link from "next/link";

type Props = { params: Promise<{ id: string }> };

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("blog_posts").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <Link href="/admin/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Blog
          </Link>
          <h1 className="font-display text-3xl font-semibold mt-2">Edit Post</h1>
        </div>
        <BlogPostForm mode="edit" initial={data as BlogPost} />
      </div>
    </AdminLayout>
  );
}
