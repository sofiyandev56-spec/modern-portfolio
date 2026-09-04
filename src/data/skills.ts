export interface Skill {
  name: string;
  category: SkillCategory;
}

export type SkillCategory =
  | "Languages"
  | "Web Technologies"
  | "AI / ML"
  | "Tools & Platforms";

export const skills: Skill[] = [
  // Languages
  { name: "Python", category: "Languages" },
  { name: "C", category: "Languages" },
  { name: "C++", category: "Languages" },
  { name: "JavaScript", category: "Languages" },
  { name: "TypeScript", category: "Languages" },
  { name: "SQL", category: "Languages" },

  // Web Technologies
  { name: "HTML / CSS", category: "Web Technologies" },
  { name: "React", category: "Web Technologies" },
  { name: "Next.js", category: "Web Technologies" },
  { name: "REST APIs", category: "Web Technologies" },

  // AI / ML
  { name: "Machine Learning", category: "AI / ML" },
  { name: "Generative AI", category: "AI / ML" },
  { name: "LLMs", category: "AI / ML" },

  // Tools & Platforms
  { name: "Git / GitHub", category: "Tools & Platforms" },
  { name: "MySQL", category: "Tools & Platforms" },
];

export const skillCategories: SkillCategory[] = [
  "Languages",
  "Web Technologies",
  "AI / ML",
  "Tools & Platforms",
];
