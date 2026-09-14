"use client";

/**
 * The page's scroll, as phase progress values.
 *
 * The experience is one long scroll cut into phases (hero, traverse, about,
 * the three projects, outro…). ScrollScript writes each phase's 0..1 progress
 * here as the reader moves; the cosmos canvas and the fixed text layers read
 * it every frame. Phases before the current one sit at 1 and later ones at 0,
 * so anything cumulative (the star's rotation, say) can simply sum them.
 *
 * A plain mutable object rather than React state: it changes every frame and
 * nothing here should re-render for it.
 */
export const PHASES = [
  "hero",
  "traverse",
  "about",
  "projHeader",
  "proj1",
  "proj2",
  "proj3",
  "tail",
  "outro",
  "contact",
] as const;

export type Phase = (typeof PHASES)[number];

export const scrollState: Record<Phase, number> & {
  /** Normalised pointer, -1..1, for parallax. */
  pointerX: number;
  pointerY: number;
  /** True once the loader has finished and the scene may move. */
  ready: boolean;
} = {
  hero: 0,
  traverse: 0,
  about: 0,
  projHeader: 0,
  proj1: 0,
  proj2: 0,
  proj3: 0,
  tail: 0,
  outro: 0,
  contact: 0,
  pointerX: 0,
  pointerY: 0,
  ready: false,
};

// Readable from the console while developing.
if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  (window as unknown as { __scroll: typeof scrollState }).__scroll = scrollState;
}

/** Smoothstep, for scroll-linked eases. */
export function smooth(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

/** Maps t from [a, b] to 0..1 with a smoothstep. */
export function window01(t: number, a: number, b: number) {
  return smooth((t - a) / (b - a));
}
