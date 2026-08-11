// Per-post share card. Wears the midnight palette so writing reads as visually
// distinct from projects at a glance in a feed.

import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";
import { OgCard, OG_SIZE, OG_CONTENT_TYPE, loadOgFonts } from "@/lib/og";

export const alt = "Writing — Mohammed Mutahar";
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
    .from("blog_posts")
    .select("title, excerpt, tags")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  return new ImageResponse(
    (
      <OgCard
        eyebrow="Writing"
        title={data?.title ?? "Writing"}
        subtitle={data?.excerpt}
        tags={data?.tags}
        theme="midnight"
      />
    ),
    { ...size, fonts: await loadOgFonts() },
  );
}
