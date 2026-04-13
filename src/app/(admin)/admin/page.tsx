import AdminLayout from "@/components/layout/AdminLayout";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: projectCount },
    { count: postCount },
    { count: paperCount },
    { count: timelineCount },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase.from("research_papers").select("*", { count: "exact", head: true }),
    supabase.from("timeline_entries").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Projects", count: projectCount ?? 0, href: "/admin/projects" },
    { label: "Blog Posts", count: postCount ?? 0, href: "/admin/blog" },
    { label: "Research Papers", count: paperCount ?? 0, href: "/admin/research" },
    { label: "Timeline Entries", count: timelineCount ?? 0, href: "/admin/timeline" },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage your portfolio content.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="rounded-xl border border-border bg-card p-5 flex flex-col gap-2 hover:border-accent transition-colors"
            >
              <span className="text-3xl font-semibold font-display">{stat.count}</span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </Link>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-3">
          <h2 className="font-medium">Quick Links</h2>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/" target="_blank" className="text-accent hover:underline">View Live Site ↗</Link>
            <Link href="/admin/projects" className="text-accent hover:underline">Add Project</Link>
            <Link href="/admin/blog" className="text-accent hover:underline">New Blog Post</Link>
            <Link href="/admin/research" className="text-accent hover:underline">Add Paper</Link>
            <Link href="/admin/timeline" className="text-accent hover:underline">Add Timeline Entry</Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
