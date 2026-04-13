import AdminLayout from "@/components/layout/AdminLayout";
import BlogPostForm from "@/components/admin/BlogPostForm";
import Link from "next/link";

export default function NewBlogPostPage() {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <Link href="/admin/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Blog
          </Link>
          <h1 className="font-display text-3xl font-semibold mt-2">New Post</h1>
        </div>
        <BlogPostForm mode="new" />
      </div>
    </AdminLayout>
  );
}
