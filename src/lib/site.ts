/**
 * Single source of truth for the site's public URL and identity.
 *
 * Set NEXT_PUBLIC_SITE_URL once a custom domain is in place. On Vercel the
 * production URL is detected automatically, so link previews, robots.txt and
 * the sitemap all resolve correctly without any configuration.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Sofiyan Shaikh",
  url: siteUrl,
  jobTitle: "iOS and web developer",
  description:
    "Sofiyan Shaikh is a first-year B.Tech CSE (AI & ML) Hons. student at UIT, Karnavati University, specialising in Generative AI with IBM, building iOS apps in Swift and SwiftUI and web interfaces in React, TypeScript and Three.js.",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Unitedworld Institute of Technology, Karnavati University",
  },
  email: "mailto:sofiyan.dev56@gmail.com",
  nationality: "Indian",
  knowsAbout: [
    "Generative AI",
    "Prompt Engineering",
    "Python",
    "C",
    "C++",
    "Swift",
    "SwiftUI",
    "iOS Development",
    "MySQL",
    "React",
    "TypeScript",
    "Next.js",
    "Three.js",
  ],
  sameAs: [
    "https://github.com/sofiyandev56-spec",
    "https://www.linkedin.com/in/sofiyan-shaikh-838328404/",
    "https://www.instagram.com/sofiyan_shaikh08/",
    "https://xray-portfolio-five.vercel.app",
    "https://starportfolio-nu.vercel.app",
  ],
} as const;
