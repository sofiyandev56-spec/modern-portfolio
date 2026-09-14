/**
 * The three project cards. Each is one beat of the scroll: a framed visual,
 * a small label, a serif title and two sentences. Cards with an `href` are
 * links (the cursor says "visit"); the others are static.
 */
export interface Project {
  id: string;
  label: string;
  title: string;
  blurb: string;
  href?: string;
  /** A real capture of the product. Absent when none exists. */
  image?: { src: string; alt: string; width: number; height: number };
  /** Which decorative graphic to draw when there is no capture. */
  graphic?: "clinic";
}

export const projects: Project[] = [
  {
    id: "skilltrace",
    label: "Smart India Hackathon 2026 · Internal · Team lead",
    title: "SkillTrace",
    blurb:
      "Tracks what happens to trainees after government skilling programmes end. Every figure carries an evidence tier, and a placement only counts once it has held for three months.",
    href: "https://github.com/sofiyandev56-spec/skilltrace-sih2026",
    image: {
      src: "/images/skilltrace/dashboard.webp",
      alt: "SkillTrace governance dashboard with reported placement and verified employment shown side by side",
      width: 1600,
      height: 1000,
    },
  },
  {
    id: "happynest",
    label: "Team project · Healthcare",
    title: "HappyNest Clinic",
    blurb:
      "Booking and patient management for a pediatric clinic. Parents book and fill in intake from their phone; the doctor runs the day from one dashboard.",
    href: "https://client-joy-book.lovable.app",
    graphic: "clinic",
  },
  {
    id: "portfolio",
    label: "This site · 2026",
    title: "Modern Portfolio",
    blurb:
      "The site you are on. A scanned 3D bust, scroll choreography and a small design system, built from scratch in Next.js and React Three Fiber.",
    href: "https://github.com/sofiyandev56-spec/modern-portfolio",
    image: {
      src: "/images/portfolio/live-hero.jpg",
      alt: "The portfolio's hero: 'Hi, I'm Sofiyan' beside a scanned 3D bust",
      width: 1440,
      height: 900,
    },
  },
];
