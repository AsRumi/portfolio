"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { THEMES } from "@/lib/themes";
import { useHomeTheme } from "@/lib/theme-context";
import {
  SOCIAL_LINKS,
  RESUME_URL,
  NEW_TAB_PROPS,
  linkTargetProps,
} from "@/lib/links";

export default function Footer() {
  const isHome = usePathname() === "/";

  // Mood published by the home page. Only the home footer is themed; the compact
  // footer on other routes stays sunset (those routes never leave the default).
  const { themeId } = useHomeTheme();
  const isMidnight = themeId === "midnight";

  if (!isHome) {
    return (
      <footer
        style={{ background: "#8B2E14" }}
        className="border-t border-white/15"
      >
        <div className="w-full px-5 sm:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Mohammed Mutahar. All rights reserved.</p>
          <div className="flex items-center gap-5 text-white/50">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...linkTargetProps(link)}
                className="hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href={RESUME_URL}
              {...NEW_TAB_PROPS}
              className="hover:text-white transition-colors"
            >
              Resume ↗
            </a>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative border-t border-white/15">
      {/* Sunset base + midnight crossfade, matching the hero and body above. */}
      <div
        className="absolute inset-0"
        style={{ background: THEMES.sunset.footerGradient }}
      />
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: isMidnight ? 1 : 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        style={{ background: THEMES.midnight.footerGradient }}
      />
      <div className="relative z-10">
      <div className="mx-auto max-w-7xl px-8 py-16">
        {/* Top row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-12">
          {/* Brand column */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            <span className="font-display text-lg font-semibold text-white">
              Mohammed Mutahar
            </span>
            <p className="text-sm text-white/60 leading-relaxed">
              AI/ML Engineer &amp; Researcher.<br />
              Northeastern University, Khoury College.
            </p>
          </div>

          {/* Explore */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">
              Explore
            </p>
            <nav className="flex flex-col gap-2.5 text-sm text-white/65">
              <a href="/projects" className="hover:text-white transition-colors">Projects</a>
              <a href="/blog" className="hover:text-white transition-colors">Blog</a>
              <a href="/research" className="hover:text-white transition-colors">Research</a>
              <a href="/timeline" className="hover:text-white transition-colors">Timeline</a>
            </nav>
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">
              Connect
            </p>
            <nav className="flex flex-col gap-2.5 text-sm text-white/65">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  {...linkTargetProps(link)}
                  className="hover:text-white transition-colors"
                >
                  {link.label} ↗
                </a>
              ))}
            </nav>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">
              Resources
            </p>
            <nav className="flex flex-col gap-2.5 text-sm text-white/65">
              <a
                href={RESUME_URL}
                {...NEW_TAB_PROPS}
                className="hover:text-white transition-colors"
              >
                Resume (PDF) ↗
              </a>
            </nav>
          </div>
        </div>

      </div>

      {/* Bottom bar — full width */}
      <div className="border-t border-white/15 w-full px-5 sm:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/35">
        <p>© {new Date().getFullYear()} Mohammed Mutahar. All rights reserved.</p>
        <p>Built with Next.js &amp; Tailwind CSS</p>
      </div>
      </div>
    </footer>
  );
}
