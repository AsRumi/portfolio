"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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
        <linearGradient id="nav-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F5A623" stopOpacity="1" />
          <stop offset="40%" stopColor="#D4622A" stopOpacity="1" />
          <stop offset="100%" stopColor="#5C1A0A" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="mountain-fade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="50%" stopColor="white" stopOpacity="0" />
          <stop offset="72%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="1" />
        </linearGradient>
        <mask id="fade-mask">
          <rect width="900" height="64" fill="url(#mountain-fade)" />
        </mask>
      </defs>
      <rect width="900" height="64" fill="url(#nav-grad)" />
      <g mask="url(#fade-mask)">
        <path
          d="M0,64 L0,54 L60,50 L120,46 L180,42 L230,48 L280,40 L330,44 L380,36 L420,40 L460,32 L500,38 L540,30 L570,36 L600,28 L630,34 L660,26 L700,32 L740,38 L780,34 L820,40 L860,36 L900,42 L900,64 Z"
          fill="rgba(15,5,1,0.30)"
        />
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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu when navigating
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const homeScrolled = isHome && scrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 overflow-hidden ${
          isHome
            ? scrolled
              ? "bg-[#2B1005] border-b border-[#2B1005] shadow-sm"
              : "bg-transparent border-b border-transparent"
            : ""
        }`}
      >
        {!isHome && <MountainStrip />}

        <div className="relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          {/* Logo */}
          <Link
            href="/"
            className={`font-display font-semibold tracking-tight transition-colors text-white ${
              isHome && !scrolled ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
            }`}
          >
            Mohammed Mutahar
          </Link>

          {/* Desktop nav — hidden below md */}
          <nav className="hidden md:flex items-center gap-8">
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

          {/* Hamburger — visible below md */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="md:hidden flex flex-col gap-1.5 p-2 -mr-2 z-50 relative"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="block w-6 h-0.5 bg-white origin-center"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="block w-6 h-0.5 bg-white"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="block w-6 h-0.5 bg-white origin-center"
            />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 md:hidden"
            style={{
              background:
                "linear-gradient(180deg, #5C1A0A 0%, #8B2E14 50%, #b84418 100%)",
            }}
          >
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.1, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-start gap-6 px-6 pt-28"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.4, ease: "easeOut" }}
                >
                  <Link
                    href={link.href}
                    className={`font-display text-3xl font-semibold tracking-tight ${
                      pathname === link.href ? "text-white" : "text-white/75"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.a
                href="#"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + navLinks.length * 0.06, duration: 0.4 }}
                className="mt-4 inline-block rounded border border-white/60 px-5 py-2 text-sm text-white"
              >
                Resume →
              </motion.a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
