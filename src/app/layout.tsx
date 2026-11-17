import type { Metadata, Viewport } from "next";
import { Syne, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { FilmGrain } from "@/components/ui/film-grain";
import { PERSON_SCHEMA, siteUrl } from "@/lib/site";
import { THEME_INIT_SCRIPT } from "@/lib/theme-constants";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-syne",
  weight: ["600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
});

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Sofiyan Shaikh — iOS and web developer",
  description:
    "Sofiyan Shaikh is a first-year B.Tech CSE (AI & ML) Hons. student at UIT, Karnavati University, specialising in Generative AI with IBM, building iOS apps in Swift and SwiftUI and web interfaces in React, TypeScript and Three.js.",
  keywords: [
    "Sofiyan Shaikh",
    "B.Tech CSE AI ML",
    "Generative AI",
    "Python Developer",
    "Student Portfolio",
    "Prompt Engineering",
    "MySQL",
    "Portfolio",
  ],
  authors: [{ name: "Sofiyan Shaikh", url: "https://github.com/sofiyandev56-spec" }],
  creator: "Sofiyan Shaikh",
  openGraph: {
    title: "Sofiyan Shaikh — iOS and web developer",
    description:
      "Sofiyan Shaikh is a first-year B.Tech CSE (AI & ML) Hons. student at UIT, Karnavati University, specialising in Generative AI with IBM, building iOS apps in Swift and SwiftUI and web interfaces in React, TypeScript and Three.js.",
    type: "website",
    locale: "en_US",
    siteName: "Sofiyan Shaikh Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sofiyan Shaikh — iOS and web developer",
    description:
      "Sofiyan Shaikh is a first-year B.Tech CSE (AI & ML) Hons. student at UIT, Karnavati University, specialising in Generative AI with IBM, building iOS apps in Swift and SwiftUI and web interfaces in React, TypeScript and Three.js.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${inter.variable}`}
      // data-theme and the "js" class are set by THEME_INIT_SCRIPT before
      // hydration, so the attributes the client sees differ from the server
      // markup by design.
      suppressHydrationWarning
    >
      <head>
        {/* Applies the saved theme and the js marker before first paint — see src/lib/theme-constants.ts */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="bg-canvas text-fg antialiased font-sans">
        <CustomCursor />
        <FilmGrain />
        {/* Keyboard users land here first and can jump past the navbar. */}
        <a href="#hero" className="skip-link">
          Skip to content
        </a>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <script
          type="application/ld+json"
          // Tells search engines who this page is about, so a search for the
          // name can connect it to the GitHub and LinkedIn profiles.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
