export interface ProjectImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Short label used when the image can be switched between (e.g. tabs). */
  label?: string;
}

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
  /** Set for hackathon work: shown as an eyebrow above the title. */
  hackathon?: string;
  /** Concrete capabilities, rendered as a list when present. */
  features?: string[];
  /** Real screenshots of the running product. */
  images?: ProjectImage[];
  /** A wide detail crop shown beneath the screenshots, with its caption. */
  highlight?: ProjectImage & { caption: string };
  visualType: "skilltrace" | "happynest" | "portfolio";
}

export const projects: Project[] = [
  {
    id: "skilltrace",
    number: "01",
    title: "SKILLTRACE",
    category: "GovTech / Full-Stack / Data Integrity",
    tagline: "Skilling-outcomes tracking for government training programmes",
    hackathon: "Smart India Hackathon 2026 · Internal Hackathon",
    overview:
      "Government skilling programmes record enrolment, attendance and certification — but rarely what happens afterwards. Trainees change phone numbers, employers report inconsistently, and a placement letter gets counted as a job. Without credible post-training data, nobody can tell which centres actually work.",
    impact:
      "SkillTrace follows trainees after the course ends and attaches an evidence tier to every figure. Employment counts only after three months at the same employer, and each number shows how much of it is bank-verified, corroborated, self-reported or stale. When an employer and a trainee disagree, the record is held out of the totals until a reviewer rules on it.",
    features: [
      "Reported placement vs verified employment shown side by side — on the seeded demo data, 50% on record drops to 6.6% after the 3-month rule, and the dashboard says so",
      "Four evidence tiers (Verified, Corroborated, Self-reported, Stale) with a click-through breakdown on every figure",
      "Disputed records held with both claims visible, excluded from outcomes until resolved or sent for field verification",
      "Consent withdrawal that removes a person from every aggregate immediately, with a before/after receipt",
      "Messaging-style check-in simulator, a public no-login employer confirmation page, and a follow-up queue for unreachable trainees",
      "Government-portal interface in English, Hindi and Marathi, with text-size and high-contrast controls, policy and accessibility pages",
    ],
    facts: [
      { label: "Hackathon", value: "SIH 2026 · Internal" },
      { label: "Role", value: "Team Lead" },
      { label: "Team", value: "Tech Titans" },
      { label: "Status", value: "Prototype" },
    ],
    technologies: [
      "React 18",
      "Vite",
      "React Router",
      "Recharts",
      "FastAPI",
      "SQLAlchemy",
      "SQLite",
      "JWT Auth",
    ],
    images: [
      {
        src: "/images/skilltrace/dashboard.webp",
        alt: "SkillTrace governance dashboard: filters for cohort, course, centre, district and demographic, with reported placement rate and verified employment rate shown side by side",
        width: 1600,
        height: 1000,
        label: "Dashboard",
      },
      {
        src: "/images/skilltrace/disputes.webp",
        alt: "SkillTrace disputed records screen: a table of open disputes with Assign field officer and Resolve actions",
        width: 1600,
        height: 1000,
        label: "Disputes",
      },
    ],
    highlight: {
      src: "/images/skilltrace/verified-rule.webp",
      alt: "Reported placement rate 50% next to verified employment rate 6.6%, joined by an 'after the 3-month rule' filter, with a note that 6,499 trainees reported as placed cannot be shown to have held the job for three months",
      width: 1600,
      height: 354,
      caption:
        "The figure the system exists to expose: 50% reported placement becomes 6.6% verified employment once the 3-month rule is applied.",
    },
    github: "https://github.com/sofiyandev56-spec/skilltrace-sih2026",
    visualType: "skilltrace",
  },
  {
    id: "happynest-clinic",
    number: "02",
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
      { label: "Status", value: "Deployed" },
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
    number: "03",
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
