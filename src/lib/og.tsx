/* eslint-disable @next/next/no-img-element */
// Shared renderer for Open Graph preview cards (the image LinkedIn, Slack,
// iMessage and friends show when someone pastes a link to this site).
//
// Cards are generated on demand by `ImageResponse` rather than being hand-designed
// PNGs, so every project and blog post gets its own branded card for free — add a
// project in the admin panel and its share card exists immediately.
//
// SATORI CONSTRAINTS — the renderer behind ImageResponse is not a browser:
//   • Every element holding more than one child needs an explicit `display: flex`.
//     Without it Satori throws at render time rather than falling back.
//   • Fonts must be supplied as raw TTF/OTF/WOFF buffers. `next/font` is a build
//     step for the browser and is invisible here, and WOFF2 is unsupported —
//     hence the checked-in static TTFs in ./og-fonts.
//   • No `gap`, no CSS custom properties. Spacing is done with explicit margins.

import { readFile } from "node:fs/promises";
import path from "node:path";
import { THEMES } from "@/lib/themes";

/** LinkedIn renders a 1.91:1 card; 1200×630 is the universal safe size. */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const FONT_DIR = path.join(process.cwd(), "src", "lib", "og-fonts");

/**
 * Load the two brand faces as buffers for Satori.
 *
 * Read straight off disk rather than via `fetch(new URL(...))` — fetching a
 * `file:` URL is unimplemented in Node's undici and fails the build outright.
 *
 * Because `process.cwd()` is resolved at runtime the bundler can't see this
 * dependency, so `outputFileTracingIncludes` in next.config.ts pins the font
 * directory into the deployment. Without that entry it works locally and 500s on
 * Vercel — the classic version of this bug.
 *
 * Memoised at module scope: the buffers are immutable and a warm lambda would
 * otherwise re-read ~340 KB from disk on every crawl.
 */
let fontsPromise: ReturnType<typeof readOgFonts> | null = null;

async function readOgFonts() {
  const [display, body] = await Promise.all([
    readFile(path.join(FONT_DIR, "CormorantGaramond-SemiBold.ttf")),
    readFile(path.join(FONT_DIR, "DMSans-Regular.ttf")),
  ]);

  return [
    { name: "Cormorant", data: display, style: "normal" as const, weight: 600 as const },
    { name: "DM Sans", data: body, style: "normal" as const, weight: 400 as const },
  ];
}

export function loadOgFonts() {
  fontsPromise ??= readOgFonts();
  return fontsPromise;
}

/** Hard-clip overlong DB copy so it can't overflow the fixed 630px canvas. */
function clamp(text: string, max: number) {
  const trimmed = text.trim();
  return trimmed.length <= max ? trimmed : `${trimmed.slice(0, max - 1).trimEnd()}…`;
}

type CardProps = {
  /** Small uppercase kicker above the title, e.g. "Project" or "Writing". */
  eyebrow: string;
  title: string;
  /** Optional supporting line — a project description or post excerpt. */
  subtitle?: string | null;
  /** Optional chips along the bottom, typically tags. Capped at three. */
  tags?: string[] | null;
  /** Which home-page mood the card wears. Defaults to the warm sunset palette. */
  theme?: "sunset" | "midnight";
  /**
   * Byline in the bottom-left. Pass `null` on the site card, where the title is
   * already the name and repeating it just reads as a mistake.
   */
  attribution?: string | null;
};

/**
 * The card itself. Deliberately reuses `themes.ts` gradients and the site's
 * mountain-ridge motif so a shared link is visually continuous with the page it
 * opens — the palette is never redefined here.
 */
export function OgCard({
  eyebrow,
  title,
  subtitle,
  tags,
  theme = "sunset",
  attribution = "Mohammed Mutahar",
}: CardProps) {
  const palette = THEMES[theme];
  const visibleTags = (tags ?? []).filter(Boolean).slice(0, 3);

  // Long titles get a smaller face so they stay on the canvas without wrapping
  // into the ridge artwork below.
  const titleSize = title.length > 42 ? 68 : title.length > 26 ? 84 : 96;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        backgroundImage: palette.skyGradient,
        fontFamily: "DM Sans",
        position: "relative",
      }}
    >
      {/* Ridge motif, echoing the site header. Anchored to the bottom edge and
          kept low-contrast so the copy above always wins the eye. */}
      <svg
        width={OG_SIZE.width}
        height={200}
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        style={{ position: "absolute", bottom: 0, left: 0 }}
      >
        <path
          d="M0,200 L0,150 L80,138 L160,126 L240,140 L320,112 L400,128 L480,100 L560,118 L640,88 L720,110 L800,80 L880,104 L960,74 L1040,98 L1120,86 L1200,104 L1200,200 Z"
          fill={palette.mountainFills[1]}
        />
        <path
          d="M0,200 L0,172 L80,164 L160,152 L240,166 L320,142 L400,156 L480,132 L560,148 L640,122 L720,140 L800,116 L880,134 L960,110 L1040,130 L1120,120 L1200,136 L1200,200 Z"
          fill={palette.mountainFills[3]}
        />
      </svg>

      {/* Top block — eyebrow, title, rule, subtitle */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.65)",
            marginBottom: 24,
          }}
        >
          {eyebrow}
        </div>

        <div
          style={{
            fontFamily: "Cormorant",
            fontSize: titleSize,
            lineHeight: 1.05,
            color: "#FFFFFF",
            letterSpacing: -1,
          }}
        >
          {clamp(title, 70)}
        </div>

        <div
          style={{
            width: 120,
            height: 3,
            backgroundColor: "rgba(255,255,255,0.5)",
            marginTop: 28,
            marginBottom: 28,
          }}
        />

        {subtitle ? (
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.82)",
              maxWidth: 880,
            }}
          >
            {clamp(subtitle, 130)}
          </div>
        ) : null}
      </div>

      {/* Bottom block — attribution left, tag chips right */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Cormorant",
            fontSize: 34,
            color: "#FFFFFF",
          }}
        >
          {attribution ?? ""}
        </div>

        {visibleTags.length > 0 ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            {visibleTags.map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  fontSize: 22,
                  color: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(255,255,255,0.4)",
                  borderRadius: 999,
                  padding: "8px 20px",
                  marginLeft: 12,
                }}
              >
                {clamp(tag, 22)}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
