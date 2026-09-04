export interface Achievement {
  title: string;
  description: string;
  category: "hackathon" | "certification" | "milestone";
  date?: string;
}

/**
 * Add your achievements here. They will render as cards
 * in the Achievements section.
 *
 * Example:
 * {
 *   title: "HackAI 2025 — Top 10",
 *   description: "Built an AI-powered health assistant in 36 hours.",
 *   category: "hackathon",
 *   date: "March 2025",
 * }
 */
export const achievements: Achievement[] = [];
