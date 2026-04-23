"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/research", label: "Research" },
  { href: "/timeline", label: "Timeline" },
];

// Mountain ridge confined to the right ~40% of the header
function MountainStrip() {
  return (
    <svg
      aria-hidden="true"
      preserveAspectRatio="none"
      viewBox="0 0 900 64"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full"
    >
      <defs>
        {/* Amber left → deep rust right — matches the original hero gradient tone */}
        <linearGradient id="nav-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F5A623" stopOpacity="1" />
          <stop offset="40%" stopColor="#D4622A" stopOpacity="1" />
          <stop offset="100%" stopColor="#5C1A0A" stopOpacity="1" />
        </linearGradient>
        {/* Mask that fades mountains in from ~55% to 100% */}
        <linearGradient id="mountain-fade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="50%" stopColor="white" stopOpacity="0" />
          <stop offset="72%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="1" />
        </linearGradient>
        <mask id="fade-mask">
          <rect width="900" height="64" fill="url(#mountain-fade)" />
        </mask>
      </defs>

      {/* Full-width gradient background */}
      <rect width="900" height="64" fill="url(#nav-grad)" />

      {/* Mountains masked to fade in from the right — no hard edge */}
      <g mask="url(#fade-mask)">
        {/* Back ridge */}
        <path
          d="M0,64 L0,54 L60,50 L120,46 L180,42 L230,48 L280,40 L330,44 L380,36 L420,40 L460,32 L500,38 L540,30 L570,36 L600,28 L630,34 L660,26 L700,32 L740,38 L780,34 L820,40 L860,36 L900,42 L900,64 Z"
          fill="rgba(15,5,1,0.30)"
        />
        {/* Front ridge */}
        <path
          d="M0,64 L0,58 L50,56 L100,52 L140,56 L180,48 L220,52 L260,44 L300,50 L340,42 L375,46 L410,38 L445,44 L480,36 L510,42 L540,34 L565,40 L590,32 L620,38 L650,30 L680,36 L720,42 L760,36 L800,42 L840,38 L880,44 L900,40 L900,64 Z"
          fill="rgba(30,10,2,0.50)"
        />
      </g>
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Only home page goes cream on scroll — inner pages always have the gradient header
  const homeScrolled = isHome && scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 overflow-hidden ${
        isHome
          ? scrolled
            ? "bg-[#2B1005] border-b border-[#2B1005] shadow-sm"
            : "bg-transparent border-b border-transparent"
          : ""
      }`}
    >
      {/* Mountain strip — inner pages only */}
      {!isHome && <MountainStrip />}

      <div className="relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between px-8">
        {/* Logo — dark on home-scrolled, white otherwise */}
        <Link
          href="/"
          className={`font-display font-semibold tracking-tight transition-colors ${
            isHome && !scrolled ? "text-2xl" : "text-lg"
          } ${homeScrolled ? "text-white" : "text-white"}`}
        >
          Mohammed Mutahar
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                homeScrolled
                  ? pathname === link.href
                    ? "text-[#3D2B1F] font-medium"
                    : "text-white hover:text-[#b3a49b]"
                  : pathname === link.href
                    ? "text-white font-medium"
                    : "text-white/75 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Resume CTA */}
          <a
            href="#"
            className={`text-sm px-4 py-1.5 rounded border transition-colors ${
              homeScrolled
                ? "border-white text-white hover:bg-[#b3a49b] hover:text-white"
                : "border-white/60 text-white hover:border-white hover:bg-white/15"
            }`}
          >
            Resume →
          </a>
        </nav>
      </div>
    </header>
  );
}
