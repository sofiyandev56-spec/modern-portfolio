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
  jobTitle: "B.Tech CSE (AI & ML) Student",
  description:
    "B.Tech Computer Science (AI & ML) Hons. student specializing in Generative AI with IBM.",
  email: "mailto:sofiyandev56@gmail.com",
  nationality: "Indian",
  knowsAbout: [
    "Generative AI",
    "Prompt Engineering",
    "Python",
    "C",
    "C++",
    "MySQL",
    "React",
    "TypeScript",
  ],
  sameAs: [
    "https://github.com/sofiyandev56-spec",
    "https://www.linkedin.com/in/sofiyan-shaikh-838328404/",
  ],
} as const;
