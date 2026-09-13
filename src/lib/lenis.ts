"use client";

import type Lenis from "lenis";

/**
 * The live Lenis instance, when smooth scrolling is running.
 *
 * SmoothScrollProvider owns the instance; everything else reads it from here.
 * It is null on touch devices and under prefers-reduced-motion, where the page
 * scrolls natively, so callers must always handle the fallback.
 */
let instance: Lenis | null = null;
let currentVelocity = 0;

export function setLenisInstance(lenis: Lenis | null) {
  instance = lenis;
  if (!lenis) currentVelocity = 0;
}

export function updateScrollVelocity(vel: number) {
  currentVelocity = vel;
}

export function getLenis(): Lenis | null {
  return instance;
}

/**
 * Returns current smoothed scroll velocity without triggering per-frame React re-renders.
 */
export function getScrollVelocity(): number {
  if (instance) {
    return instance.velocity ?? currentVelocity;
  }
  return currentVelocity;
}

/**
 * Hook exposing stable scroll velocity getter for shaders, kinetic skew, and canvas loops.
 */
export function useScrollVelocity(): () => number {
  return getScrollVelocity;
}

/**
 * Scrolls to an element or a pixel offset, through Lenis when it is running and
 * through the native API otherwise. Native scrolling is instant under reduced
 * motion, matching what Lenis does with `respectReducedMotion`.
 */
export function scrollToTarget(
  target: Element | number,
  { duration = 1.2, offset = 0 }: { duration?: number; offset?: number } = {}
) {
  if (instance) {
    instance.scrollTo(target as HTMLElement | number, { offset, duration });
    return;
  }

  const behavior: ScrollBehavior = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches
    ? "auto"
    : "smooth";

  if (typeof target === "number") {
    window.scrollTo({ top: target + offset, behavior });
    return;
  }

  const top = target.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior });
}
