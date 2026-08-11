// Per-project share card. Overrides the root card for /projects/[slug], so
// sharing a specific project on LinkedIn previews that project by name.

import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";
import { OgCard, OG_SIZE, OG_CONTENT_TYPE, loadOgFonts } from "@/lib/og";

export const alt = "Project — Mohammed Mutahar";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("projects")
    .select("title, description, tags")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  // A missing row still has to return an image — crawlers follow og:image blindly
  // and a 500 here shows up as a broken card rather than a graceful fallback.
  return new ImageResponse(
    (
      <OgCard
        eyebrow="Project"
        title={data?.title ?? "Project"}
        subtitle={data?.description}
        tags={data?.tags}
      />
    ),
    { ...size, fonts: await loadOgFonts() },
  );
}
