// Site-wide default share card.
//
// Living at the app root means every route inherits this unless it ships its own
// `opengraph-image` — so /projects, /blog, /research, /timeline and the home page
// are all covered by this one file, while individual projects and posts override
// it with their own card.

import { ImageResponse } from "next/og";
import { OgCard, OG_SIZE, OG_CONTENT_TYPE, loadOgFonts } from "@/lib/og";

export const alt = "Mohammed Mutahar — AI/ML Engineer & Researcher";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return new ImageResponse(
    (
      <OgCard
        eyebrow="Portfolio"
        title="Mohammed Mutahar"
        subtitle="AI/ML Engineer & Researcher — Northeastern University, Khoury College."
        tags={["Computer Vision", "Generative AI", "Multimodal"]}
        attribution={null}
      />
    ),
    { ...size, fonts: await loadOgFonts() },
  );
}
