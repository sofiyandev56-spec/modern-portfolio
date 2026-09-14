import {
  siCplusplus,
  siMysql,
  siNextdotjs,
  siPython,
  siReact,
  siSupabase,
  siTypescript,
} from "simple-icons";

/**
 * The words that drift around the star in the About act.
 *
 * Positions are viewport percentages: dx/dy on desktop, mx/my on phones.
 * `at` is the window of the About phase (0..1) during which the word is on
 * screen; `depth` scales its parallax so nearer words move more.
 */
export type ConstellationItem =
  | { kind: "serif" | "sans"; text: string; dx: number; dy: number; mx: number; my: number; depth: number; at: [number, number] }
  | { kind: "logo"; name: string; path: string; dx: number; dy: number; mx: number; my: number; depth: number; at: [number, number] };

export const constellation: ConstellationItem[] = [
  { kind: "serif", text: "Curiosity", dx: 17, dy: 76, mx: 22, my: 88, depth: 1, at: [0.02, 0.3] },
  { kind: "sans", text: "Rigour", dx: 80, dy: 24, mx: 78, my: 12, depth: 0.7, at: [0.05, 0.32] },
  { kind: "logo", name: "Python", path: siPython.path, dx: 24, dy: 22, mx: 22, my: 12, depth: 0.5, at: [0.08, 0.34] },
  { kind: "serif", text: "Persistence", dx: 80, dy: 78, mx: 74, my: 90, depth: 0.9, at: [0.22, 0.5] },
  { kind: "sans", text: "Foundations", dx: 14, dy: 36, mx: 24, my: 78, depth: 0.6, at: [0.26, 0.54] },
  { kind: "logo", name: "C++", path: siCplusplus.path, dx: 85, dy: 60, mx: 80, my: 12, depth: 0.5, at: [0.3, 0.56] },
  { kind: "logo", name: "MySQL", path: siMysql.path, dx: 12, dy: 58, mx: 18, my: 30, depth: 0.45, at: [0.36, 0.62] },
  { kind: "serif", text: "Honesty", dx: 20, dy: 24, mx: 26, my: 14, depth: 0.85, at: [0.44, 0.72] },
  { kind: "sans", text: "Problem solving", dx: 79, dy: 40, mx: 70, my: 84, depth: 0.7, at: [0.48, 0.76] },
  { kind: "logo", name: "React", path: siReact.path, dx: 30, dy: 84, mx: 30, my: 92, depth: 0.5, at: [0.52, 0.78] },
  { kind: "logo", name: "TypeScript", path: siTypescript.path, dx: 70, dy: 14, mx: 76, my: 24, depth: 0.45, at: [0.56, 0.82] },
  { kind: "serif", text: "Craft", dx: 82, dy: 74, mx: 70, my: 88, depth: 1, at: [0.66, 0.94] },
  { kind: "sans", text: "Building", dx: 16, dy: 44, mx: 22, my: 16, depth: 0.65, at: [0.7, 0.96] },
  { kind: "logo", name: "Next.js", path: siNextdotjs.path, dx: 60, dy: 88, mx: 50, my: 94, depth: 0.5, at: [0.72, 0.96] },
  { kind: "logo", name: "Supabase", path: siSupabase.path, dx: 40, dy: 12, mx: 48, my: 10, depth: 0.45, at: [0.74, 0.97] },
];

export const ABOUT_TEXT =
  "About: I am a B.Tech Computer Science (AI & ML) Hons. student on a Generative AI track with IBM. Early in the journey and honest about it, with a solid grip on C, C++, Python and MySQL, a habit of solving problems until they give way, and three applications shipped. Tools: Python, C++, MySQL, React, TypeScript, Next.js, Supabase.";
