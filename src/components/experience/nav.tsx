"use client";

import React from "react";
import { CVLink } from "@/components/cv-link";

const LINKS = [
  { id: "about", label: "About", href: "#about" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "contact", label: "Contact", href: "#contact" },
];

/**
 * Brand and the CV at the top. On desktop the chapter rail (rail.tsx) is the
 * navigation; on phones these three links become the pill at the bottom of
 * the screen, and the rail marks whichever one matches the current act.
 */
export function Nav() {
  return (
    <nav className="nav" aria-label="Primary">
      <a className="nav-brand" href="#hero" data-magnetic="6">
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
