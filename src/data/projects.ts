export interface Project {
  id: string;
  number: string;
  title: string;
  category: string;
  tagline: string;
  overview: string;
  impact: string;
  facts: { label: string; value: string }[];
  technologies: string[];
  github?: string;
  demo?: string;
  repoPrivate?: boolean;
  visualType: "happynest" | "portfolio";
}

export const projects: Project[] = [
  {
    id: "happynest-clinic",
    number: "01",
    title: "HAPPYNEST CLINIC",
    category: "Full-Stack Web App / Healthcare",
    tagline: "Pediatric Clinic Booking & Patient Management System",
    overview:
      "A mobile-first web application for a pediatric clinic, covering online appointment scheduling, parent and patient intake, and a dashboard the doctor uses to run the day.",
    impact:
      "Parents book a slot and submit intake details from their phone instead of calling the clinic. On the other side, the doctor gets a queue of upcoming appointments, an immunization checklist to sign off on, and walk-in handling with tiered consultation fees.",
    facts: [
      { label: "Role", value: "Team Project" },
      { label: "Stack", value: "TanStack + Supabase" },
      { label: "Status", value: "In Development" },
    ],
    technologies: [
      "TypeScript",
      "React",
      "TanStack Start",
      "TanStack Router",
      "Supabase",
      "Tailwind CSS",
      "Zod",
      "Vite",
    ],
    demo: "https://client-joy-book.lovable.app",
    repoPrivate: true,
    visualType: "happynest",
  },
  {
    id: "modern-portfolio",
    number: "02",
    title: "MODERN PORTFOLIO",
    category: "Frontend / 3D Web / Motion Design",
    tagline: "This Site — An Interactive 3D Developer Portfolio",
    overview:
      "The portfolio you are reading right now. Built from scratch to learn how a real 3D scene, scroll-driven motion, and a component-based design system fit together in one Next.js app.",
    impact:
      "Renders a custom Three.js model in the browser alongside spring-based motion, smooth scrolling, and an expandable project accordion — all typed end to end and built as a static production bundle.",
    facts: [
      { label: "Role", value: "Solo Build" },
      { label: "Stack", value: "Next.js + Three.js" },
      { label: "Rendering", value: "React Three Fiber" },
    ],
    technologies: [
      "TypeScript",
      "Next.js",
      "React",
      "Three.js",
      "React Three Fiber",
      "Framer Motion",
      "Tailwind CSS",
      "GSAP",
    ],
    github: "https://github.com/sofiyandev56-spec/modern-portfolio",
    visualType: "portfolio",
  },
];
