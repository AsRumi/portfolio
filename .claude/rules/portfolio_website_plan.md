# Mohammed's Portfolio Website — Master Planning Document

## Context for Claude

This document is the complete planning reference for building **Mohammed's personal portfolio website**. Mohammed is a first-year Master's student in Computer Science (AI/ML specialization) at Northeastern University's Khoury College (graduating Fall 2027), with prior professional experience as an AI Engineer. He has production deployments in Computer Vision and Generative AI, published research in medical imaging and deep learning, and AWS and Microsoft cloud certifications.

The portfolio needs to serve two audiences simultaneously:
- **Recruiters** — fast scannable signal: who he is, what he's built, his research, his resume
- **Peers & collaborators** — deeper engagement: blog posts, live project demos, research papers

---

## Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | **Next.js 14+ (App Router)** | SSR + static pages + API routes in one |
| Styling | **Tailwind CSS** | Spacing, layout, and responsive design — paired with design system below |
| Component Library | **shadcn/ui** | Beautifully crafted, minimal, accessible components built on Radix UI — the foundation of the premium aesthetic |
| Animation | **Framer Motion** | Fluid page transitions, scroll-triggered reveals, hover interactions — essential for the Apple-like feel |
| Typography | **next/font + Google Fonts** | Carefully chosen typeface pairing; typography is the #1 driver of perceived quality |
| Icons | **Lucide React** | Clean, consistent icon set that matches the minimal aesthetic |
| Database | **Supabase (PostgreSQL)** | Tables for blogs, projects, timeline entries |
| File Storage | **Supabase Storage** | PDFs for research papers, certificates |
| Auth | **Supabase Auth** | Admin panel access for content management |
| Hosting | **Vercel** | Auto-deploys on every GitHub push |
| Domain | **Custom domain via Namecheap** | Pointed to Vercel via DNS A + CNAME records |
| Language | **TypeScript** | Strict mode, production-quality codebase |

### Design Philosophy

The aesthetic target is **minimalist and modular** — think Apple.com. This means:
- Generous whitespace over information density
- A restrained color palette (near-white or near-black backgrounds, one accent color)
- Large, confident typography with clear hierarchy
- Smooth, purposeful animations — nothing gratuitous
- Components that feel like they were designed, not assembled
- Every page section feels like its own self-contained module with breathing room

**Critical instruction for Claude when building UI:** Do not default to generic layouts. Commit to a clear aesthetic direction. Use Framer Motion for entrance animations on scroll (`whileInView`), smooth page transitions, and subtle hover states. Use shadcn/ui components as the base but customize them to match the design language. Typography choices and spacing matter more than clever components — get those right first.

---

## Site Structure & Pages

```
/                        → Home (hero, quick bio, featured projects, links)
/projects                → All projects (filterable grid)
/projects/[slug]         → Individual project detail page
/blog                    → All blog posts (list/grid)
/blog/[slug]             → Individual blog post
/research                → Research papers + publications
/timeline                → Interactive timeline widget (optional, see below)
/admin                   → Protected admin dashboard (content management)
/admin/projects          → Add / edit / delete projects
/admin/blog              → Add / edit / delete blog posts
/admin/timeline          → Add / edit / delete timeline entries
/admin/research          → Upload / manage research papers
```

---

## Database Schema (Supabase)

> **Note for Claude:** The schemas below are a **reference direction, not a strict contract.** Claude has full freedom to adapt, extend, rename, or restructure any table, column, or relationship based on what makes the most sense architecturally as the build progresses. The goal of these schemas is to point in the right direction — not to constrain good engineering judgment. If a better structure emerges during implementation, use it.

### `projects` table
```sql
id              uuid primary key default gen_random_uuid()
title           text not null
slug            text unique not null
description     text                        -- short (used in cards)
content         text                        -- long markdown (used in detail page)
tags            text[]                      -- e.g. ["PyTorch", "FastAPI", "Multimodal"]
demo_url        text                        -- link to live demo
github_url      text                        -- link to GitHub repo
thumbnail_url   text                        -- image stored in Supabase Storage
featured        boolean default false       -- shows on home page if true
status          text default 'published'    -- 'published' | 'draft'
created_at      timestamptz default now()
updated_at      timestamptz default now()
```

### `blog_posts` table
```sql
id              uuid primary key default gen_random_uuid()
title           text not null
slug            text unique not null
excerpt         text                        -- short summary shown in list view
content         text                        -- full markdown content
cover_image_url text
tags            text[]
featured        boolean default false
status          text default 'draft'        -- 'published' | 'draft'
published_at    timestamptz
created_at      timestamptz default now()
updated_at      timestamptz default now()
```

### `research_papers` table
```sql
id              uuid primary key default gen_random_uuid()
title           text not null
authors         text                        -- comma-separated author list
abstract        text
venue           text                        -- journal or conference name
year            integer
pdf_url         text                        -- Supabase Storage URL
external_url    text                        -- DOI or publisher link
tags            text[]
created_at      timestamptz default now()
```

### `timeline_entries` table
```sql
id              uuid primary key default gen_random_uuid()
title           text not null              -- e.g. "Started AffectSync"
description     text                       -- markdown supported
category        text                       -- 'project' | 'research' | 'job' | 'education' | 'milestone'
start_date      date not null
end_date        date                       -- null = ongoing
related_url     text                       -- optional link to project/blog post
color_override  text                       -- optional hex for custom category color
created_at      timestamptz default now()
```

---

## Page-by-Page Specifications

### `/` — Home
- **Hero section:** Name, one-line role ("AI/ML Engineer & Researcher"), animated subtitle, CTA buttons (View Projects, Read Blog)
- **About blurb:** 3–4 sentence bio, photo
- **Featured Projects:** 3 cards (projects where `featured = true`), each with thumbnail, title, tags, and links to demo + GitHub
- **Latest Blog Posts:** 2–3 most recent published posts
- **Links bar:** GitHub, LinkedIn, Google Scholar, Resume (PDF download from Supabase Storage)

### `/projects`
- Filterable grid by tag (e.g., "Computer Vision", "NLP", "Multimodal")
- Each card: thumbnail, title, short description, tags, demo link, GitHub link
- Sort by: newest / featured first
- Data fetched from `projects` table (status = 'published')

### `/projects/[slug]`
- Full project detail: title, tags, long markdown content rendered as HTML
- Embedded demo link (button) + GitHub link
- Related projects (same tags) shown at bottom

### `/blog`
- List or masonry grid of all published posts
- Each card: cover image, title, excerpt, tags, date, read time estimate
- Tag filter bar at top

### `/blog/[slug]`
- Full markdown post rendered with syntax highlighting (use `rehype-highlight` or `shiki`)
- Table of contents sidebar (auto-generated from headings)
- Estimated read time in header
- Tags at bottom
- "Back to Blog" navigation

### `/research`
- List of research papers, sorted by year descending
- Each entry: title, authors, venue + year, abstract (collapsible), PDF download button, external DOI link
- Tag filter (e.g., "Medical Imaging", "Deep Learning")

---

## Timeline Widget — `/timeline` (Optional)

### Concept
An interactive horizontal or vertical scrollable timeline showing what Mohammed was working on month by month. Entries are stored in Supabase and managed via the admin panel — not hardcoded.

### Behavior
- **Axis:** Months, displayed chronologically left-to-right (horizontal scroll) or top-to-bottom (vertical)
- **Entries:** Each entry is a card/node on the timeline showing title, date range, category tag, and short description
- **Categories with color coding:**
  - 🔵 `project` — portfolio/side projects
  - 🟣 `research` — papers, lab work
  - 🟢 `job` — internships, co-ops, full-time roles
  - 🟡 `education` — coursework, certifications, degrees
  - 🔴 `milestone` — awards, publications, notable events
- **Interactions:**
  - Click/tap an entry to expand full description
  - Filter by category (toggle buttons above timeline)
  - Hover shows a tooltip with title + date range
- **Ongoing entries:** If `end_date` is null, the entry stretches to "Present"
- **Responsive:** Collapses to a vertical stacked list on mobile

### Tech Implementation
- Data fetched from `timeline_entries` Supabase table
- Rendered with a custom React component using **D3.js** or pure CSS/Tailwind positioning
- No hardcoded dates — all content managed via `/admin/timeline`
- Optionally linkable: each entry can have a `related_url` pointing to a project page or blog post

### Admin Panel for Timeline (`/admin/timeline`)
- Table view of all timeline entries
- Add / Edit form: title, description (markdown), category dropdown, start date, end date (optional), related URL
- Delete with confirmation
- Changes reflect immediately on `/timeline` (no rebuild needed — fetched at request time)

---

## Admin Panel — `/admin`

Protected by Supabase Auth (email + password). Only Mohammed can log in.

### Features per section:
- **Projects:** Rich text / markdown editor (use `@uiw/react-md-editor`), image upload to Supabase Storage, tag management, featured toggle, publish/draft toggle
- **Blog:** Same as projects — markdown editor, cover image upload, publish scheduling optional
- **Research:** Form fields for all metadata + PDF upload
- **Timeline:** Form-based entry management (described above)

---

## Content Management Notes

- All content (projects, blog posts, timeline entries, research) is stored in Supabase — **nothing is hardcoded**
- Updates happen through the admin panel at `/admin` — no redeployment needed for content changes
- Images and PDFs are stored in **Supabase Storage buckets** with public read access
- Slugs for projects and blog posts should be auto-generated from the title but editable

---

## SEO & Metadata

- Use Next.js `generateMetadata()` for dynamic OG tags per page
- Each project and blog post gets its own `og:image` (use thumbnail/cover image)
- Add `sitemap.xml` and `robots.txt` via Next.js route handlers
- Add JSON-LD structured data on the home page (Person schema)

---

## Component Architecture

```
/components
  /ui                    → Reusable primitives (Button, Card, Badge, Modal)
  /layout                → Header, Footer, Sidebar, AdminLayout
  /home                  → HeroSection, FeaturedProjects, LatestPosts
  /projects              → ProjectCard, ProjectGrid, ProjectFilter
  /blog                  → BlogCard, BlogGrid, BlogPost, TableOfContents
  /research              → PaperCard, PaperList
  /timeline              → TimelineView, TimelineEntry, TimelineFilter
  /admin                 → AdminTable, MarkdownEditor, ImageUploader, EntryForm
```

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server-side only, never expose to client
NEXT_PUBLIC_SITE_URL=             # your custom domain
```

---

## Build Order Recommendation

| Phase | What to Build | Why |
|-------|--------------|-----|
| 1 | Supabase schema + storage buckets setup | Foundation for everything |
| 2 | Home page (static, no DB yet) | Get something live and deployed fast |
| 3 | Projects page + project detail | Highest recruiter value |
| 4 | Admin panel — projects section | Unlock content management |
| 5 | Blog page + blog detail + admin | Second most valuable content type |
| 6 | Research page + admin | Important for academic credibility |
| 7 | Timeline widget + admin | Optional but distinctive |
| 8 | SEO, OG tags, sitemap | Polish pass before sharing widely |

---

## Notes for Claude When Building

- Mohammed prefers **modular, production-quality TypeScript** suitable for a public GitHub portfolio
- Explain non-obvious architectural decisions inline as comments
- Use **App Router** (not Pages Router) for all Next.js code
- All data fetching should use **server components** where possible for performance
- Admin routes must be protected — middleware should redirect unauthenticated users away from `/admin/*`
- Follow **mobile-first** responsive design throughout
- Python version for any backend ML work: **Python 3.11**
- **Design standard is premium and minimalist — Apple-level.** Use shadcn/ui + Framer Motion + deliberate typography as the core design toolkit. Prioritize whitespace, restraint, and visual clarity over feature density. When in doubt, do less, but do it beautifully.
- The database schemas provided are **reference only** — Claude should use good judgment and adapt them freely as implementation demands

---

*Document generated: April 2026 | Companion document: `portfolio_demo_projects.md`*
