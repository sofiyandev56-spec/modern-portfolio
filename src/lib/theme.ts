"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Theme switching.
 *
 * The theme is a `data-theme` attribute on <html>: "light" or "dark". Dark is
 * the site's default identity, so a missing attribute means dark and there is
 * no system-preference override — an explicit choice is the only thing that
 * changes it. The choice persists in localStorage under STORAGE_KEY.
 *
 * Flash prevention: layout.tsx injects THEME_INIT_SCRIPT into <head>, which
 * reads localStorage and sets the attribute before the first paint. Because
 * that runs before React hydrates, the server-rendered markup never disagrees
 * with the DOM the client sees.
 */

import {
  DEFAULT_THEME,
  STORAGE_KEY,
  THEME_COLOR,
  type Theme,
} from "@/lib/theme-constants";

export type { Theme };

function readTheme(): Theme {
  if (typeof document === "undefined") return DEFAULT_THEME;
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

/**
 * Applies a theme to the document, persists it, and runs a short colour
 * cross-fade (skipped when the user prefers reduced motion).
 */
export function setTheme(theme: Theme) {
  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduced) {
    root.classList.add("theme-switching");
    window.setTimeout(() => root.classList.remove("theme-switching"), 320);
  }

  root.setAttribute("data-theme", theme);

  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = THEME_COLOR[theme];

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage unavailable: the choice still applies for this page view.
  }
}

/** Subscribes to the data-theme attribute so React state follows the DOM. */
export function useTheme(): Theme {
  const subscribe = useCallback((onChange: () => void) => {
    const observer = new MutationObserver(onChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return useSyncExternalStore(subscribe, readTheme, () => DEFAULT_THEME);
}
