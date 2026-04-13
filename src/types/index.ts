export type Project = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  tags: string[] | null;
  demo_url: string | null;
  github_url: string | null;
  thumbnail_url: string | null;
  featured: boolean;
  status: "published" | "draft";
  created_at: string;
  updated_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  tags: string[] | null;
  featured: boolean;
  status: "published" | "draft";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ResearchPaper = {
  id: string;
  title: string;
  authors: string | null;
  abstract: string | null;
  venue: string | null;
  year: number | null;
  pdf_url: string | null;
  external_url: string | null;
  tags: string[] | null;
  created_at: string;
};

export type TimelineEntry = {
  id: string;
  title: string;
  description: string | null;
  category: "project" | "research" | "job" | "education" | "milestone";
  start_date: string;
  end_date: string | null;
  related_url: string | null;
  color_override: string | null;
  created_at: string;
};
