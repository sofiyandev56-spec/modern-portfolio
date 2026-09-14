import type { Metadata, Viewport } from "next";
import { Manrope, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { Cursor } from "@/components/experience/cursor";
import { PERSON_SCHEMA, siteUrl } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["300", "400", "500", "700", "800"],
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument",
  weight: "400",
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Sofiyan Shaikh | AI & ML · Code · Web",
  description:
    "Portfolio of Sofiyan Shaikh, a B.Tech Computer Science (AI & ML) Hons. student specializing in Generative AI with IBM. Python, C, C++, MySQL, and web applications built end to end.",
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
    title: "Sofiyan Shaikh | AI & ML · Code · Web",
    description:
      "B.Tech CSE (AI & ML) Hons. student specializing in Generative AI with IBM. Python, C, C++, MySQL, and web applications built end to end.",
    type: "website",
    locale: "en_US",
    siteName: "Sofiyan Shaikh Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sofiyan Shaikh | AI & ML · Code · Web",
    description:
      "B.Tech CSE (AI & ML) Hons. student specializing in Generative AI with IBM. Python, C, C++, MySQL, and web applications built end to end.",
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
    <html lang="en" className={`${manrope.variable} ${instrument.variable}`}>
      <body>
        {/* Keyboard users land here first and can jump past the fixed layers. */}
        <a href="#about" className="skip-link sr-only">
          Skip to content
        </a>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <Cursor />
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
