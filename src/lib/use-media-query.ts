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

/** True when motion is welcome. GSAP scroll effects are only created under this. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/**
 * Viewports that get the fixed, scroll-choreographed 3D scene. Phones and
 * tablets keep the model inline in the hero instead: a full-viewport canvas
 * that renders through every section is a battery cost they should not pay,
 * and a fixed model fights the stacked single-column layout.
 *
 * Mirrors the `scene:` variant in globals.css — keep the two in step.
 */
export const FIXED_SCENE_QUERY =
  "(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/**
 * Viewports that get the pinned horizontal projects scrub. Below this the
 * project panels stack vertically and scroll natively.
 *
 * Mirrors the `hscroll:` variant in globals.css — keep the two in step.
 */
export const HORIZONTAL_PROJECTS_QUERY =
  "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
