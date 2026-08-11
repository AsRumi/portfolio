// Central definition of every outbound link on the site.
//
// The header CTA and both footer variants read from here rather than hardcoding
// URLs, so updating a profile — or pointing the resume somewhere else — is a
// one-line edit instead of a hunt across three components.
//
// IMPORTANT: every href must be absolute (protocol included). A bare
// "www.github.com/AsRumi" is parsed by the browser as a *relative* path and
// resolves to "https://yourdomain.com/www.github.com/AsRumi" — a 404 on your own
// site rather than a trip to GitHub.

export type ExternalLink = {
  label: string;
  href: string;
  /**
   * True for links that leave the site over http(s), which get opened in a new
   * tab. `mailto:` is deliberately false — handing a mail client an orphaned
   * blank tab is just clutter.
   */
  opensNewTab: boolean;
};

/** Mohammed's contact address, shared by the footer link and any future use. */
export const EMAIL = "mutahar.mo@northeastern.edu";

/**
 * Resume PDF, served from the public `pdfs` Supabase Storage bucket.
 *
 * The filename is intentionally fixed. To publish a new version, delete this
 * file in the Supabase dashboard and re-upload with the same name — the URL
 * never changes, so no code edit or redeploy is needed. (Storage sits behind a
 * CDN with a ~1 hour cache, so an overwrite can serve the old PDF briefly.)
 */
export const RESUME_URL =
  "https://zyemzjiyamsnfdmvyqww.supabase.co/storage/v1/object/public/pdfs/resume.pdf";

/**
 * Profile links, in display order. Google Scholar is deliberately absent —
 * there's no profile to point at, and an absent link beats a dead one.
 */
export const SOCIAL_LINKS: ExternalLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/AsRumi",
    opensNewTab: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mohammed-mutahar-695b6a221/",
    opensNewTab: true,
  },
  {
    label: "Email",
    href: `mailto:${EMAIL}`,
    opensNewTab: false,
  },
];

/**
 * Anchor props for a link that leaves the site. `rel="noopener noreferrer"` is
 * the security-relevant half: without `noopener`, the opened page gets a
 * `window.opener` handle back into this one and can redirect it.
 */
export const NEW_TAB_PROPS = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

/** Spreadable anchor props for a `SOCIAL_LINKS` entry. */
export function linkTargetProps(link: ExternalLink) {
  return link.opensNewTab ? NEW_TAB_PROPS : {};
}
