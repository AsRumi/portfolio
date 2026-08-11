import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

const SITE_NAME = "Mohammed Mutahar";
const SITE_DESCRIPTION =
  "Personal portfolio of Mohammed Mutahar, AI/ML Engineer and Master's student at Northeastern University.";

// Resolved from the environment so the same code works on a Vercel preview, on
// the production domain, and locally. Every relative URL in the metadata tree —
// including the generated opengraph-image routes — is expanded against this, and
// crawlers reject relative og:image values, so it has to be absolute.
//
// Set NEXT_PUBLIC_SITE_URL in the Vercel dashboard. VERCEL_URL is Vercel's own
// per-deployment hostname and covers preview builds where the var isn't set.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mutahar — AI Engineer",
    template: "%s — Mutahar",
  },
  description: SITE_DESCRIPTION,
  // Defaults for every route. Per-page `generateMetadata` overrides title and
  // description; the image comes from the nearest opengraph-image file.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "Mohammed Mutahar — AI/ML Engineer & Researcher",
    description: SITE_DESCRIPTION,
    url: siteUrl,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohammed Mutahar — AI/ML Engineer & Researcher",
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
