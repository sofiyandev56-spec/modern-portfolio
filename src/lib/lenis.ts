"use client";

import type Lenis from "lenis";

/**
 * The live Lenis instance, when smooth scrolling is running (pointer devices
 * without reduced motion). Null otherwise; callers handle the native fallback.
 */
let instance: Lenis | null = null;

export function setLenisInstance(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis(): Lenis | null {
  return instance;
}

/**
 * Scrolls to an element or a pixel offset through Lenis when it is running,
 * natively otherwise (instantly under reduced motion, as Lenis would).
 */
export function scrollToTarget(
  target: Element | number,
  { duration = 1.4, offset = 0 }: { duration?: number; offset?: number } = {}
) {
  if (instance) {
    instance.scrollTo(target as HTMLElement | number, { offset, duration });
    return;
  }
  const behavior: ScrollBehavior = window.matchMedia("(prefers-reduced-motion: reduce)")
    .matches
    ? "auto"
    : "smooth";
  const top =
    typeof target === "number"
      ? target + offset
      : target.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior });
}
