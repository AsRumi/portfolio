import AdminLayout from "@/components/layout/AdminLayout";
import { createClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/types";
import Link from "next/link";

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold">Blog Posts</h1>
            <p className="text-sm text-muted-foreground mt-1">{posts?.length ?? 0} total</p>
          </div>
          <Link
            href="/admin/blog/new"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            + New Post
          </Link>
        </div>

        {posts && posts.length > 0 ? (
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="px-4 py-3 font-medium text-foreground">Title</th>
                  <th className="px-4 py-3 font-medium text-foreground">Status</th>
                  <th className="px-4 py-3 font-medium text-foreground">Published</th>
                  <th className="px-4 py-3 font-medium text-foreground">Tags</th>
                  <th className="px-4 py-3 font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(posts as BlogPost[]).map((post) => (
                  <tr key={post.id} className="bg-card hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{post.title}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        post.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {post.tags?.slice(0, 3).join(", ") ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <Link href={`/admin/blog/${post.id}/edit`} className="text-accent hover:underline text-xs">Edit</Link>
                        <Link href={`/blog/${post.slug}`} target="_blank" className="text-muted-foreground hover:text-foreground text-xs">View ↗</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground text-sm">
            No posts yet.{" "}
            <Link href="/admin/blog/new" className="text-accent hover:underline">Write your first post.</Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
