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
  visualType:
    | "xray"
    | "spendsense"
    | "unfold"
    | "programmer-corner"
    | "happynest"
    | "skilltrace"
    | "star"
    | "portfolio"
    | "oil-grader";
}

export const projects: Project[] = [
  {
    id: "xray-portfolio",
    number: "01",
    title: "X-RAY PORTFOLIO",
    category: "Main Portfolio / WebGL / Fluid Simulation",
    tagline: "My main portfolio",
    overview:
      "My main portfolio. The cursor stirs a fluid simulation that turns the photo into an x-ray, and the autograph signs itself stroke by stroke, at the pace of a real hand.",
    impact:
      "It opens as a blueprint and develops into a photo; under the cursor the photo wipes back to the skeleton and the MacBook's M4 chip. Built with Vite and no framework, so the whole site ships as a small static bundle, and it respects Reduce Motion.",
    facts: [
      { label: "Role", value: "Solo Build" },
      { label: "Stack", value: "Vite + Three.js" },
      { label: "Status", value: "Live" },
    ],
    technologies: ["JavaScript", "Vite", "Three.js", "GLSL", "GSAP", "Lenis"],
    images: [
      {
        src: "/images/portfolio/xray-hero.jpg",
        alt: "The X-Ray Portfolio: Sofiyan Shaikh's photo half wiped back to an x-ray of the skull and a MacBook's insides",
        width: 1200,
        height: 630,
        label: "Hero",
      },
    ],
    demo: "https://xray-portfolio-five.vercel.app",
    github: "https://github.com/sofiyandev56-spec/xray-portfolio",
    visualType: "xray",
  },
  {
    id: "spendsense",
    number: "02",
    title: "SPENDSENSE",
    category: "Full-Stack / Personal Finance / AI Assistant",
    tagline: "Your money. Your language. Your control.",
    overview:
      "A personal finance manager for income, expenses, budgets, savings goals and reports, with an assistant you can type or talk to in English, Hindi or Hinglish. It answers only from your own records, and Postgres row-level security keeps each person’s data their own.",
    impact:
      "Live on Vercel, with the API on Render and the database on Supabase. Money is kept as exact decimals and periods follow the user’s time zone, every ₹ figure the assistant gives is checked against the records before it is shown, and it works with or without an AI model.",
    facts: [
      { label: "Stack", value: "Next.js + FastAPI" },
      { label: "Database", value: "Supabase Postgres" },
      { label: "Status", value: "Live" },
    ],
    technologies: [
      "TypeScript",
      "Next.js",
      "React",
      "Tailwind CSS",
      "Recharts",
      "TanStack Query",
      "Python",
      "FastAPI",
      "Supabase",
      "PostgreSQL",
    ],
    features: [
      "Income and expenses in ₹ with categories, payment methods, search and filters",
      "Monthly budgets with early warnings, and savings goals that never double-count",
      "Analytics and reports for any month, year or range, as PDF (₹ and Hindi rendered correctly) or CSV",
      "An assistant in English, हिंदी or Hinglish, by text or voice, answering only from your own records",
      "Row Level Security in Postgres, so each person can only ever read their own data",
    ],
    images: [
      {
        src: "/images/spendsense/landing.jpg",
        alt: "SpendSense's landing page: “Your money. Your language. Your control.”, with sign-up buttons and four feature cards",
        width: 1600,
        height: 900,
        label: "Landing",
      },
    ],
    demo: "https://spendsense-nine-delta.vercel.app",
    repoPrivate: true,
    visualType: "spendsense",
  },
  {
    id: "unfold",
    number: "03",
    title: "UNFOLD",
    category: "Native iOS App / Apple Intelligence",
    tagline: "A learning arcade for iPhone Duo",
    overview:
      "A learning arcade for Swift and Apple frameworks on iPhone Duo. Its four games use the hinge as the controller, and an on-device Apple Intelligence coach answers from the app's own lessons.",
    impact:
      "The games read the hinge through iOS 27.1's onHingeChange and reservedRegions APIs, and the coach runs on device with FoundationModels, grounded in the app's own curriculum.",
    facts: [
      { label: "Type", value: "Native iOS app" },
      { label: "Platform", value: "iPhone Duo" },
      { label: "Year", value: "2026" },
    ],
    technologies: ["Swift", "SwiftUI", "FoundationModels", "Liquid Glass", "Xcode"],
    images: [
      {
        src: "/images/unfold/arcade.webp",
        alt: "Unfold's Arcade on iPhone Duo's inner display: today's game, Swift Sprint, with a Liquid Glass sidebar",
        width: 1600,
        height: 1126,
        label: "Arcade",
      },
    ],
    github: "https://github.com/sofiyandev56-spec/Unfold",
    visualType: "unfold",
  },
  {
    id: "programmer-corner",
    number: "04",
    title: "PROGRAMMER CORNER",
    category: "Native iOS App / Learning",
    tagline: "A SwiftUI app for learning Swift",
    overview:
      "A SwiftUI app for learning Swift: 52 lessons across 8 topics, 8 mini-games, and XP, levels and badges. Designed with Liquid Glass, with VoiceOver and Reduce Motion support.",
    impact:
      "Every lesson carries code samples, and progress, XP and badges are saved on device. The Liquid Glass interface uses zoom transitions and haptics.",
    facts: [
      { label: "Type", value: "Native iOS app" },
      { label: "Platform", value: "iPhone" },
      { label: "Year", value: "2026" },
    ],
    technologies: ["Swift", "SwiftUI", "Liquid Glass", "Xcode"],
    images: [
      {
        src: "/images/programmer-corner/blueprint.jpg",
        alt: "Blueprint drawing of Programmer Corner: a phone with a lesson list, an XP bar and a badge",
        width: 1600,
        height: 900,
        label: "Blueprint",
      },
    ],
    github: "https://github.com/sofiyandev56-spec/iOS-Development-Workshop",
    visualType: "programmer-corner",
  },
  {
    id: "happynest-clinic",
    number: "05",
    title: "HAPPYNEST CLINIC",
    category: "Full-Stack Web App / Healthcare",
    tagline: "Pediatric Clinic Booking & Patient Management System",
    overview:
      "Booking and patient management for a pediatric clinic. Parents book slots and fill in intake forms from their phones; the doctor runs the day from one dashboard and signs off immunizations against the IAP checklist.",
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
    demo: "https://happy-nest-clinic.vercel.app",
    repoPrivate: true,
    images: [
      {
        src: "/images/happynest/dashboard.webp",
        alt: "HappyNest clinic dashboard: appointment timeline, patient queue, and immunization checklist",
        width: 1600,
        height: 900,
        label: "Dashboard",
      },
    ],
    visualType: "happynest",
  },
  {
    id: "skilltrace",
    number: "06",
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
      { label: "Role", value: "Team Lead of six" },
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
    id: "star-portfolio",
    number: "07",
    title: "STAR PORTFOLIO",
    category: "Portfolio / WebGL / Motion Design",
    tagline: "A star-guided scroll portfolio",
    overview:
      "A scroll portfolio guided by a mint star that answers the cursor, draws constellations between words and opens a portal for the name in the hero.",
    impact:
      "Built from scratch in Next.js with Three.js, GSAP and Lenis, with light and dark themes, and the CV and résumé generated from the same source.",
    facts: [
      { label: "Role", value: "Solo Build" },
      { label: "Stack", value: "Next.js + Three.js" },
      { label: "Status", value: "Live" },
    ],
    technologies: ["TypeScript", "Next.js", "React", "Three.js", "GSAP", "Lenis", "Tailwind CSS"],
    images: [
      {
        src: "/images/portfolio/star-hero.jpg",
        alt: "The Star Portfolio's hero: 'Sofiyan Shaikh' behind a dust portal with a mint star at its centre",
        width: 1440,
        height: 900,
        label: "Hero",
      },
    ],
    demo: "https://starportfolio-nu.vercel.app",
    visualType: "star",
  },
  {
    id: "modern-portfolio",
    number: "08",
    title: "3D MODEL PORTFOLIO",
    category: "Portfolio / 3D Web / Motion Design",
    tagline: "This site — my first portfolio",
    overview:
      "My first portfolio, and the site you are on, with a scanned 3D bust in the hero and scroll-driven animation. Simplifying the 1.4-million-triangle scan cut the hero from 39 MB to 2.4 MB.",
    impact:
      "Renders the scanned model in the browser alongside spring-based motion, smooth scrolling and an inertial project slider, all typed end to end and built as a static production bundle.",
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
    images: [
      {
        src: "/images/portfolio/showcase.webp",
        alt: "The 3D Model Portfolio: interactive WebGL scene, custom shaders and kinetic motion design",
        width: 1600,
        height: 900,
        label: "Showcase",
      },
    ],
    demo: "https://sofiyan-shaikh.vercel.app",
    github: "https://github.com/sofiyandev56-spec/modern-portfolio",
    visualType: "portfolio",
  },
  {
    id: "oil-grader",
    number: "09",
    title: "OIL GRADER",
    category: "IoT / ESP32 / Team Project",
    tagline: "Used cooking oil, graded in 30 seconds",
    overview:
      "A collector for used cooking oil. Pour it through the funnel and in about 30 seconds an ESP32 checks its temperature, darkness, water and thickness, then shows a green, yellow or red grade and credits points per litre to an RFID card. In progress, leading a team of six.",
    impact:
      "Gives street vendors and households a cheap answer, read by colour alone, to whether oil is safe to use again, and a reason not to pour it down the drain: points for every litre, and graded oil ready for collectors. Built to cost under ₹5,000; due December 2026 as a team semester project.",
    facts: [
      { label: "Role", value: "Team Lead of six" },
      { label: "Type", value: "Semester project" },
      { label: "Status", value: "In progress" },
    ],
    technologies: ["ESP32", "Arduino", "Internet of Things", "Sensors", "RFID"],
    features: [
      "Takes only cooled oil, below 40°C, checked by a waterproof temperature probe",
      "Finds water by conductivity between two steel electrodes",
      "Scores darkness with a colour sensor, and thickness by timing the flow past two IR sensors",
      "Shows the grade on green, yellow and red lights and a small screen",
      "Logs litres and points to an RFID card, and alerts the collector over Wi-Fi",
    ],
    images: [
      {
        src: "/images/oil-grader/blueprint.jpg",
        alt: "Blueprint drawing of Oil Grader: a funnel on a collector box with grade lights, a screen and an RFID card",
        width: 1600,
        height: 900,
        label: "Blueprint",
      },
    ],
    highlight: {
      src: "/images/oil-grader/how-it-connects.jpg",
      alt: "Diagram: a temperature probe, colour sensor, steel electrodes, two IR flow sensors, a level sensor and an RFID reader feed an ESP32, which drives an OLED screen, grade lights and a buzzer, a pump relay and a Wi-Fi alert",
      width: 1600,
      height: 900,
      caption:
        "How it connects: six sensors feed the ESP32, which grades the oil and drives the screen, the grade lights, the pump and a Wi-Fi alert to the collector.",
    },
    visualType: "oil-grader",
  },
];
