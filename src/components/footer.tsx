"use client";

import React from "react";
import { ArrowUp, ArrowUpRight, Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon, InstagramIcon } from "@/components/icons";

export function Footer() {
  const scrollToTop = () => {
    const winWithLenis = window as unknown as { __lenis?: { scrollTo: (target: number | Element, opts: { duration: number }) => void } };
    if (winWithLenis.__lenis) {
      winWithLenis.__lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const socialBadges = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/sofiyan-shaikh-838328404/",
      icon: LinkedInIcon,
    },
    {
      name: "GitHub",
      url: "https://github.com/sofiyandev56-spec",
      icon: GitHubIcon,
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/sofiyan_shaikh08",
      icon: InstagramIcon,
    },
    {
      name: "Email",
      url: "mailto:sofiyandev56@gmail.com",
      icon: Mail,
    },
  ];

  return (
    <footer className="relative w-full bg-canvas border-t border-line-faint mt-20 md:mt-28 py-16 md:py-20 text-fg overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12 w-full">
        
        {/* Main Footer Block */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-line-faint">
          
          {/* Signature Branding */}
          <div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-fg mb-2">
              SOFIYAN SHAIKH
            </h1>
            <p className="text-sm sm:text-base text-fg-secondary font-normal">
              B.Tech CSE (AI &amp; ML) Student • Generative AI with IBM
            </p>
          </div>

          {/* Social Links Styled as Clean Pill Badges */}
          <div className="flex flex-wrap items-center gap-3">
            {socialBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <a
                  key={badge.name}
                  href={badge.url}
                  target="_blank"
                  rel="noreferrer"
                  className="pill-btn pill-btn-secondary px-4 py-2 text-xs font-medium group"
                >
                  <Icon size={14} />
                  <span>{badge.name}</span>
                  <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              );
            })}
          </div>

        </div>

        {/* Bottom Utility Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-fg-muted">
          <div>
            © {new Date().getFullYear()} Sofiyan Shaikh. Built with Next.js, React Three Fiber and Framer Motion.
          </div>

          <button
            onClick={scrollToTop}
            className="pill-btn pill-btn-secondary px-3.5 py-1.5 text-xs text-fg-secondary hover:text-fg group"
          >
            <span>Back to Top</span>
            <ArrowUp size={13} className="group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </footer>
  );
}
