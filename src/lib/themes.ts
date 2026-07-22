// Home-page color "moods".
//
// The home page can wear one of two palettes. `sunset` is the default warm look;
// `midnight` is the cool night-time variant. Which one shows is driven by the
// persona the visitor picks in the hero dropdown (see PERSONA_THEME below) — the
// research and ops personas go midnight, the rest stay sunset.
//
// SCOPE: only the home hero + the body directly under it consume these tokens.
// The shared header/footer and the other routes keep the fixed sunset chrome,
// because the persona selection is local state on the home page and never leaves
// it. Widening this to the whole site would mean lifting the choice into global
// state — deliberately out of scope here.
//
// Keeping every color the home page needs in one object means switching moods is
// a single lookup, and re-tuning either palette later happens in exactly one file.

import type { PersonaId } from "@/lib/personas";

export type ThemeId = "sunset" | "midnight";

export type HomeTheme = {
  id: ThemeId;
  /** Full-height hero sky gradient (top → bottom). */
  skyGradient: string;
  /** Four mountain ridge fills, farthest/lightest → closest/darkest. */
  mountainFills: [string, string, string, string];
  /** Gradient behind the featured / writing / research sections below the hero. */
  bodyGradient: string;
  /** Background for the role dropdown popover — rgba baked to ~0.95 alpha. */
  dropdownBg: string;
  /** Solid header background once the home page is scrolled past the hero. */
  headerScrolledBg: string;
  /** Gradient behind the home page footer. */
  footerGradient: string;
  /** Gradient behind the full-screen mobile nav overlay. */
  menuGradient: string;
};

export const THEMES: Record<ThemeId, HomeTheme> = {
  // Warm dusk — amber sky settling into deep maroon, earthy mountain ridges.
  sunset: {
    id: "sunset",
    skyGradient:
      "linear-gradient(180deg, #F5A623 0%, #E8832A 25%, #D4622A 50%, #B8451F 70%, #8B2E14 85%, #5C1A0A 100%)",
    mountainFills: [
      "rgba(120, 60, 20, 0.35)",
      "rgba(90, 40, 10, 0.45)",
      "rgba(60, 25, 5, 0.55)",
      "rgba(30, 10, 2, 0.75)",
    ],
    bodyGradient:
      "linear-gradient(180deg, #8B2E14 0%, #a84010 15%, #d6652a 40%, #c45520 70%, #b84418 100%)",
    dropdownBg: "rgba(92, 26, 10, 0.95)",
    headerScrolledBg: "#2B1005",
    footerGradient: "linear-gradient(180deg, #b84418 0%, #8B2E14 100%)",
    menuGradient:
      "linear-gradient(180deg, #5C1A0A 0%, #8B2E14 50%, #b84418 100%)",
  },
  // Night — twilight-blue sky deepening to near-black, cool blue-grey ridges.
  // Alpha values mirror the sunset ridges so the layered depth reads the same.
  midnight: {
    id: "midnight",
    skyGradient:
      "linear-gradient(180deg, #24365F 0%, #1B2A49 25%, #142138 50%, #0D1728 70%, #080F1D 85%, #03060D 100%)",
    mountainFills: [
      "rgba(70, 92, 140, 0.35)",
      "rgba(44, 62, 104, 0.45)",
      "rgba(26, 38, 70, 0.6)",
      "rgba(10, 16, 32, 0.8)",
    ],
    bodyGradient:
      "linear-gradient(180deg, #0B1220 0%, #101d33 15%, #16273f 40%, #12213a 70%, #0d1a30 100%)",
    dropdownBg: "rgba(13, 22, 40, 0.95)",
    headerScrolledBg: "#0A1220",
    // Picks up where the body gradient ends and deepens toward black.
    footerGradient: "linear-gradient(180deg, #0d1a30 0%, #080f1d 100%)",
    menuGradient:
      "linear-gradient(180deg, #03060D 0%, #0d1a30 50%, #16273f 100%)",
  },
};

// Which mood each persona wears. Typed as a full Record<PersonaId, …> on purpose:
// add a persona in personas.ts and TypeScript forces you to assign its mood here.
const PERSONA_THEME: Record<PersonaId, ThemeId> = {
  "ai-engineer": "sunset",
  "ml-researcher": "midnight",
  "data-scientist": "sunset",
  mlops: "midnight",
};

/** The palette the home page should wear for a given persona. */
export function themeForPersona(persona: PersonaId): HomeTheme {
  return THEMES[PERSONA_THEME[persona]];
}
