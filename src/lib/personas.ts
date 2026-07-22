// Central definition of Mohammed's four professional "personas".
//
// Every content item (project, blog post, research paper) is tagged in the admin
// panel with zero or more persona IDs. The home page shows a persona selector in
// the hero; picking a persona re-filters the home page's featured sections to the
// items that belong to that persona.
//
// IMPORTANT: the `id` values below are the *stable keys* stored in the database
// `roles` columns. Never rename or remove an existing `id` — doing so would orphan
// every item already tagged with it. The `label`, `article`, and `tagline` fields
// are safe to edit freely (they are display-only).

export type PersonaId =
  | "ai-engineer"
  | "ml-researcher"
  | "data-scientist"
  | "mlops";

export type Persona = {
  id: PersonaId;
  /** Shown in the dropdown and in the headline: "Meet Mohammed, an {label}". */
  label: string;
  /** Grammatical article so the headline reads correctly ("a" / "an"). */
  article: "a" | "an";
  /** One-line descriptor under the headline. PLACEHOLDER copy — edit freely. */
  tagline: string;
};

// Order here = order in the dropdown. First entry is the default (see below).
export const PERSONAS: Persona[] = [
  {
    id: "ai-engineer",
    label: "AI Engineer",
    article: "an",
    tagline:
      "I have built and shipped production computer vision and generative AI systems, from image generation pipelines at Reap Studio to a local content detection tool using pretrained models and ONNX Runtime.",
  },
  {
    id: "ml-researcher",
    label: "ML Engineer & Researcher",
    article: "an",
    tagline:
      "I've published research applying CNNs to radiology and designed ML systems where the model's job is to explain its predictions.",
  },
  {
    id: "data-scientist",
    label: "Data Scientist",
    article: "a",
    tagline:
      "I have worked with multimodal data pipelines, fusing webcam facial analysis, audio transcription, and computer vision signals in AffectSync, and structured sports data in HalfCourt, to engineer features, compare model architectures, and surface interpretable insights through SHAP-driven analysis.",
  },
  {
    id: "mlops",
    label: "ML Ops Developer",
    article: "an",
    tagline:
      "Currently deep in Triton GPU kernel programming and building LLM infrastructure, including a semantic caching layer over Redis and FAISS, aimed at cutting inference costs by a significant margin.",
  },
];

/** The persona the home page opens on. */
export const DEFAULT_PERSONA: PersonaId = "ai-engineer";

/**
 * The only persona whose home page also surfaces research papers. Research stays
 * off the home page for every other persona (per product decision).
 */
export const RESEARCH_PERSONA: PersonaId = "ml-researcher";

/** Fast id → persona lookup for rendering. */
export const PERSONA_MAP: Record<PersonaId, Persona> = PERSONAS.reduce(
  (acc, p) => {
    acc[p.id] = p;
    return acc;
  },
  {} as Record<PersonaId, Persona>,
);

/**
 * Does a content item belong to the given persona?
 *
 * Items with no roles assigned are treated as universal (shown under every
 * persona), so existing/untagged content never silently disappears — you narrow
 * an item to specific personas by checking roles for it in the admin panel.
 */
export function matchesPersona(
  roles: string[] | null | undefined,
  persona: PersonaId,
): boolean {
  if (!roles || roles.length === 0) return true;
  return roles.includes(persona);
}
