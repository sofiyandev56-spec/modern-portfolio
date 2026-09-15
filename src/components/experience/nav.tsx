"use client";

import React from "react";
import { CVLink } from "@/components/cv-link";
import { STAR_PATH } from "@/lib/site";

const LINKS = [
  { id: "about", label: "About", href: "#about" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "contact", label: "Contact", href: "#contact" },
];

/**
 * Brand and the CV at the top. The star before the name draws itself in
 * after the loader (CSS on html.is-ready). On desktop the chapter rail
 * (rail.tsx) is the navigation; on phones these three links become the pill
 * at the bottom of the screen, and the rail marks whichever one matches the
 * current act.
 */
export function Nav() {
  return (
    <nav className="nav" aria-label="Primary">
      <a className="nav-brand" href="#hero" data-magnetic="6">
        <svg className="brand-star" viewBox="-1.2 -1.2 2.4 2.4" aria-hidden="true">
          <path d={STAR_PATH} pathLength={1} />
        </svg>
        Sofiyan Shaikh
      </a>
      <div className="nav-links">
        {LINKS.map((l) => (
          <a key={l.id} href={l.href} data-nav={l.id} data-magnetic="6">
            {l.label}
          </a>
        ))}
      </div>
      <CVLink location="nav" className="nav-cv">
        CV ↗
      </CVLink>
    </nav>
  );
}
