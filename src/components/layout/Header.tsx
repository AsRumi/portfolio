"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/research", label: "Research" },
  { href: "/timeline", label: "Timeline" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="w-full border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        {/* Logo / Name */}
        <Link
          href="/"
          className="font-display text-xl font-semibold text-foreground hover:text-accent transition-colors"
        >
          Mohammed Mutahar
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors hover:text-foreground ${
                pathname === link.href
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
