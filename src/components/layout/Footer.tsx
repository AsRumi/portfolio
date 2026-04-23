"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const isHome = usePathname() === "/";

  if (!isHome) {
    return (
      <footer
        style={{ background: "#8B2E14" }}
        className="border-t border-white/15"
      >
        <div className="w-full px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Mohammed Mutahar. All rights reserved.</p>
          <div className="flex items-center gap-5 text-white/50">
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">Google Scholar</a>
            <a href="#" className="hover:text-white transition-colors">Resume ↗</a>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer style={{ background: "linear-gradient(180deg, #b84418 0%, #8B2E14 100%)" }} className="border-t border-white/15">
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
              <a href="#" className="hover:text-white transition-colors">GitHub ↗</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn ↗</a>
              <a href="#" className="hover:text-white transition-colors">Google Scholar ↗</a>
              <a href="mailto:mutahar.mo@northeastern.edu" className="hover:text-white transition-colors">Email ↗</a>
            </nav>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">
              Resources
            </p>
            <nav className="flex flex-col gap-2.5 text-sm text-white/65">
              <a href="#" className="hover:text-white transition-colors">Resume (PDF) ↗</a>
            </nav>
          </div>
        </div>

      </div>

      {/* Bottom bar — full width */}
      <div className="border-t border-white/15 w-full px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/35">
        <p>© {new Date().getFullYear()} Mohammed Mutahar. All rights reserved.</p>
        <p>Built with Next.js &amp; Tailwind CSS</p>
      </div>
    </footer>
  );
}
