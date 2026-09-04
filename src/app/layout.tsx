import type { Metadata, Viewport } from "next";
import { Syne, Inter } from "next/font/google";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
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
  title: "SOFIYAN SHAIKH — AI/ML & Edge Systems Engineer",
  description:
    "Personal portfolio of Sofiyan Shaikh — AI/ML & Edge Systems Engineer passionate about high-speed computer vision, generative architectures, and embedded silicon.",
  keywords: [
    "Sofiyan Shaikh",
    "AI/ML Engineer",
    "Computer Vision",
    "Edge AI",
    "Generative AI",
    "Embedded Systems",
    "SmartDrive",
    "Portfolio",
  ],
  authors: [{ name: "Sofiyan Shaikh", url: "https://github.com/sofiyandev56-spec" }],
  creator: "Sofiyan Shaikh",
  openGraph: {
    title: "SOFIYAN SHAIKH — AI/ML & Edge Systems Engineer",
    description:
      "AI/ML & Edge Systems Engineer passionate about high-speed computer vision, generative architectures, and embedded silicon.",
    type: "website",
    locale: "en_US",
    siteName: "Sofiyan Shaikh Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "SOFIYAN SHAIKH — AI/ML & Edge Systems Engineer",
    description:
      "AI/ML & Edge Systems Engineer passionate about high-speed computer vision, generative architectures, and embedded silicon.",
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
      className={`${syne.variable} ${inter.variable} dark`}
      suppressHydrationWarning
    >
      <body
        className="bg-[#09090b] text-[#f4f4f5] antialiased selection:bg-[#a855f7] selection:text-white font-sans"
      >
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
