# Mohammed's Portfolio Website — Implementation Plan

## System Prompt for Claude

> You are a senior full-stack web developer and UI engineer with deep expertise in Next.js, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, GSAP, and Three.js. You write production-quality, modular, well-commented code suitable for a public GitHub portfolio. You have a strong eye for design and understand the difference between a website that looks assembled and one that looks crafted. You are building a personal portfolio website for Mohammed, an AI/ML Engineer and Master's student at Northeastern University. Before starting any phase, read the full context documents provided and ask any clarifying questions you need. Do not over-engineer or over-style during early phases — follow the phase instructions precisely. When in doubt, do less and do it cleanly.

---

## Companion Documents

Always provide Claude with all three documents at the start of any session:
- `portfolio_website_plan.md` — full site architecture, pages, database schema, and design philosophy
- `portfolio_demo_projects.md` — the six interactive demo projects to be featured
- `portfolio_implementation_plan.md` — this document

---

## Phase Overview

| Phase | Name | Focus |
|-------|------|-------|
| 0 | Setup & Scaffolding | Project init, Supabase, env vars, folder structure |
| 1 | Content-First Build | All pages built with correct content, minimal styling |
| 2 | Visual Transformation | Convert crude pages to match reference inspiration |
| 3 | Motion & Animation | Scroll-triggered animations using Framer Motion / GSAP |
| 4 | 3D Graphics *(optional)* | Three.js or Spline integration |
| 5 | Polish & Refinement | Typography, micro-details, user review, final QA |

---

## Phase 0 — Setup & Scaffolding

### Goal
Get a working, deployable Next.js project with all dependencies installed, Supabase connected, and folder structure in place. Nothing visible to end users yet — this is pure infrastructure.

### What Claude will do
- Scaffold a new Next.js 14+ project with App Router and TypeScript strict mode
- Install and configure all dependencies:
  - `tailwindcss`, `shadcn/ui`, `framer-motion`
  - `@supabase/supabase-js`, `@supabase/ssr`
  - `lucide-react`
  - `@uiw/react-md-editor` (for admin markdown editing)
  - `rehype-highlight` + `remark` (for rendering markdown blog/project content)
  - `next/font` (for typography setup)
- Set up the `/components` folder architecture as defined in the plan
- Create `.env.local` template with all required environment variable keys
- Run the Supabase SQL to create all tables and storage buckets
- Set up Supabase Auth middleware to protect all `/admin/*` routes
- Deploy to Vercel and confirm the live URL works

### What the user provides
- Supabase project URL and API keys
- Vercel account connected to GitHub repo
- Preferred color theme (see note below)

### Color Theme Selection
During Phase 0, the user selects a base color theme. This will be wired into Tailwind's config and shadcn/ui's CSS variables so every subsequent phase builds on the same foundation. Claude should present 3–4 minimal options for the user to choose from (e.g., "off-white + charcoal", "true black + warm white", "light grey + deep navy") and implement whichever is chosen.

> **Important:** The color theme selected here is not final. It will be revisited and refined in Phase 5. The goal right now is simply to establish a consistent base so nothing looks completely unstyled during development.

### Deliverable
A live Vercel URL with a blank Next.js app, correct folder structure, all dependencies installed, Supabase tables created, and the chosen color theme wired into Tailwind config.

---

## Phase 1 — Content-First Build

### Goal
Build every page of the website with its correct, real content and structure — but without obsessing over styling. Pages should be **clean and readable**, not visually impressive. Think of this phase as building the skeleton: the right bones in the right places, with Tailwind used only for basic layout, spacing, and the color theme from Phase 0.

### Philosophy
This phase is about getting the content right, not getting the design right. A recruiter reading Phase 1 output should be able to find everything — your projects, your blog, your research, your links — even if it doesn't look beautiful yet. Every future phase layers on top of this foundation, so accuracy of content and correctness of routing matter far more than aesthetics here.

### What Claude will build
- **`/` (Home):** Hero with name + role, short bio, featured projects section (3 cards), latest blog posts (2–3), links bar (GitHub, LinkedIn, Google Scholar, Resume)
- **`/projects`:** Filterable grid of project cards pulled from Supabase
- **`/projects/[slug]`:** Full project detail page with markdown content rendered
- **`/blog`:** Grid of blog post cards with excerpt, date, tags
- **`/blog/[slug]`:** Full blog post with markdown rendered, table of contents, read time
- **`/research`:** List of research papers with abstract, PDF download, DOI link
- **`/timeline` *(optional)*:** Basic vertical list of timeline entries from Supabase
- **`/admin`:** Login page + protected dashboard with sections for projects, blog, research, timeline
- All admin sub-pages: full CRUD for each content type with markdown editor and file upload

### Styling rules for this phase
- ✅ Use Tailwind for layout, spacing, font size, and color from the Phase 0 theme
- ✅ Use shadcn/ui components where they fit naturally (buttons, inputs, cards, modals)
- ✅ Pages should be readable, consistent, and not broken on mobile
- ❌ Do not add custom animations, hover effects, or transitions
- ❌ Do not spend time on decorative elements, gradients, or visual flourishes
- ❌ Do not over-engineer component variants or exhaustive edge cases

### What the user provides
- Real content to populate the site with: bio text, project descriptions, research paper details, any existing blog posts
- A few placeholder images if real thumbnails aren't ready yet (Claude can note where images go)

### Deliverable
A fully functional, content-complete website deployed on Vercel. Every page works, every link routes correctly, the admin panel lets you add/edit/delete all content types, and the Supabase connection is live.

---

## Phase 2 — Visual Transformation

### Goal
Transform the content-complete but visually plain website into something that matches a design inspiration provided by the user. This is where the website starts looking like it was designed, not assembled.

### How it works
The user provides **reference images or URLs** of websites they find visually compelling — ideally 2–4 references. These don't need to be portfolio sites specifically; any website with a visual style the user wants to capture works. Claude will study these references and rewrite the visual layer of each page to match the aesthetic direction, while keeping the content, routing, and Supabase integration from Phase 1 completely intact.

### What the user provides
- 2–4 screenshots or URLs of websites with a visual style they like
- Any specific callouts: ("I love the way this site uses whitespace", "I want this kind of card style", "avoid this kind of layout")
- Confirmation that the Phase 0 color theme should be kept, or a revised palette if the references suggest something different

### What Claude will do
- Analyze the references and identify the key visual patterns: layout rhythm, spacing scale, typography treatment, card styles, navigation style, color usage
- Rewrite the Tailwind classes and component structure of each page to match the identified patterns
- Introduce shadcn/ui component customization where needed to align with the aesthetic
- Ensure the design is consistent across all pages — every section should feel like it belongs to the same visual system
- Implement a refined typography pairing using `next/font` (display font for headings, body font for prose)

### Styling rules for this phase
- ✅ Full creative freedom on layout, spacing, typography, color, shadows, borders
- ✅ Hover states on interactive elements (cards, buttons, links) are appropriate here
- ✅ Subtle CSS transitions on hover/focus are fine (no JS-based animation yet)
- ❌ No scroll-triggered animations yet — that comes in Phase 3
- ❌ Do not change content, routing, or database logic

### Deliverable
A visually redesigned website that reflects the user's provided references, deployed on Vercel. The site should look like a real, designed product at this point.

---

## Phase 3 — Motion & Animation

### Goal
Add purposeful, high-quality motion to the website using **Framer Motion** and/or **GSAP**. The goal is to make the website feel alive and premium — not busy or distracting. Every animation should serve a purpose: guiding attention, communicating hierarchy, or rewarding interaction.

### Animation principles
- **Entrance animations:** Elements animate in as the user scrolls them into view (`whileInView` in Framer Motion). Used on section headings, cards, and feature blocks.
- **Page transitions:** Smooth fade or slide transitions between routes using Framer Motion's `AnimatePresence`
- **Hero animation:** The hero section on the home page gets the most elaborate treatment — staggered text reveal, subtle background motion, or a signature entrance sequence
- **Micro-interactions:** Buttons, cards, and links get subtle scale/lift effects on hover (`whileHover`)
- **Stagger effects:** Lists of cards (projects, blog posts) animate in with a staggered delay so they cascade rather than all appearing at once

### Tool guidance
- **Framer Motion** is the default choice — it integrates naturally with React/Next.js and handles most animation needs elegantly
- **GSAP** is the better choice for complex timeline-based sequences, scroll-scrubbing effects (where an animation is tied to scroll position rather than just triggered by it), or if the hero requires something more orchestrated
- Claude should recommend which tool fits each specific animation rather than using one exclusively

### What the user provides
- Feedback on the Phase 2 design before animations are added (confirm the visual layer is right before motion is layered on)
- Any specific animation references or effects they want (e.g., "I like how this site's text reveals on scroll", "I want the hero to feel like an Apple product page")

### Deliverable
A fully animated website where every major section has intentional, smooth motion. The experience should feel significantly more polished than Phase 2.

---

## Phase 4 — 3D Graphics *(Optional)*

### Goal
Introduce three-dimensional visual elements into the website for maximum visual impact. This phase is entirely optional and should only be pursued if the user wants it and if it fits the overall aesthetic — 3D done wrong can look heavier than nothing at all.

### At the start of this phase, Claude will ask:
1. Do you want to add 3D elements to the website?
2. If yes: do you prefer **Three.js** (custom, code-based 3D) or **Spline** (design-tool-based 3D with an embed code)?
3. If Spline: please provide the embed code from [spline.design](https://spline.design) for the graphic you want to use

### Spline workflow
Spline is a browser-based 3D design tool that generates an embed snippet the user can copy and hand to Claude. Claude will integrate it into the appropriate section (typically the hero or a background element) and ensure it is responsive, doesn't block interaction, and falls back gracefully on low-end devices.

### Three.js workflow
If the user prefers Three.js, Claude will build a custom scene — typically a subtle animated background, a floating 3D object, or a particle system — that reinforces the site's visual identity without overwhelming it.

### Performance note
3D elements can significantly impact page load and frame rate. Claude will implement lazy loading, canvas size limits, and `will-change` optimizations to keep performance acceptable, and will disable the 3D element on mobile if needed.

### Deliverable
A 3D element integrated into the website at the agreed placement, performing well on desktop and gracefully handled on mobile.

---

## Phase 5 — Polish & Refinement

### Goal
The final phase is a careful, collaborative review of every detail. No major new features — only refinement of what exists. This is where the difference between "good" and "great" is made.

### How it works
Claude will go through the website section by section and present the user with a set of questions and options. The user reviews the live site, gives feedback, and Claude implements changes iteratively. Nothing is locked in — any decision from earlier phases can be revisited here.

### What Claude will review with the user

**Typography**
- Are you happy with the font pairing? (heading font + body font)
- Should any font sizes, weights, or line heights be adjusted?
- Does the typographic hierarchy feel clear on every page?

**Color & Contrast**
- Does the color palette still feel right after seeing the full site?
- Are there any sections where contrast feels off or colors clash?
- Should the accent color be adjusted?

**Spacing & Layout**
- Does any section feel too cramped or too spread out?
- Are there any pages that feel inconsistent with the rest of the site?

**Motion**
- Are any animations too fast, too slow, or too distracting?
- Are there any interactions that feel like they're missing a response?

**Mobile Experience**
- Full review of the site on mobile — layout, font sizes, touch targets, navigation
- Any components that need mobile-specific adjustments

**Final details**
- Favicon and browser tab title
- OG image for social sharing
- 404 page
- Loading states and empty states (e.g., blog with no posts yet)
- Any accessibility improvements (focus states, aria labels, color contrast ratios)

### Deliverable
A production-ready, fully polished website that the user is proud to put their name on and share with recruiters, collaborators, and the public.

---

## General Rules Across All Phases

- **One phase at a time.** Do not ask Claude to jump ahead. Complete and confirm each phase before starting the next.
- **Always provide all three context documents** at the start of a new Claude session, even if continuing a previous phase.
- **Version control every phase.** Commit to GitHub at the end of each phase with a clear commit message (e.g., `phase-1: content-first build complete`). This means you can always roll back.
- **Schema flexibility.** The database schemas in the plan document are reference directions. Claude has freedom to adapt them as implementation demands — this is expected and encouraged.
- **Ask before assuming.** If Claude is unsure about a design or content decision, it should ask rather than guess. A wrong assumption early compounds into rework later.

---

*Document generated: April 2026 | Companion documents: `portfolio_website_plan.md`, `portfolio_demo_projects.md`*
