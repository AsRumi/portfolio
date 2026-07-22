"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { ThemeId } from "@/lib/themes";

// Shares the home page's chosen mood (sunset / midnight) with the shared header
// and footer. Those live in the (public) layout as siblings of the page, so they
// can't read the hero's local persona state directly — the home page pushes its
// mood in here and they read it out.
//
// Default is "sunset", and the home page resets to it on unmount, so every other
// route — which never sets a mood — stays on the warm palette. This is scoped on
// purpose: it carries one enum, not a full site-wide theming system.

type ThemeContextValue = {
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

// Stable fallback for the (never-expected) case of a consumer outside the
// provider — a module constant so its setter identity doesn't churn effect deps.
const FALLBACK: ThemeContextValue = { themeId: "sunset", setThemeId: () => {} };

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>("sunset");
  return (
    <ThemeContext.Provider value={{ themeId, setThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useHomeTheme(): ThemeContextValue {
  return useContext(ThemeContext) ?? FALLBACK;
}
