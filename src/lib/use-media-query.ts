"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a CSS media query.
 *
 * Uses useSyncExternalStore rather than useState + useEffect so the correct
 * value is available on the first client render (no flash of the wrong layout)
 * and so it keeps up with changes such as device rotation or the user toggling
 * "reduce motion" while the page is open. Renders as `false` on the server.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

/** True on touch-first devices (phones, tablets) or narrow viewports. */
export const COARSE_OR_NARROW = "(pointer: coarse), (max-width: 767px)";

/** True when the OS is set to reduce motion. */
export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
