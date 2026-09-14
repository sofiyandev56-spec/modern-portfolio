"use client";

import React, { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollState } from "@/lib/scroll-state";
import { CVLink } from "@/components/cv-link";

const LINKS = [
  { id: "about", label: "About", href: "#about" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "contact", label: "Contact", href: "#contact" },
];

/**
 * Brand, three links and the CV. A mint dot slides under whichever link
 * matches the act the reader is in; nothing is highlighted in the hero.
 */
export function Nav() {
  const ref = useRef<HTMLElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const links = ref.current?.querySelectorAll<HTMLAnchorElement>(".nav-links a");
      const dot = dotRef.current;
      if (!links || !dot) return;
      let current = "";

      const place = (id: string) => {
        const link = Array.from(links).find((l) => l.dataset.nav === id);
        links.forEach((l) => l.classList.toggle("on", l === link));
        if (!link || window.innerWidth < 768) {
          gsap.to(dot, { opacity: 0, duration: 0.3 });
          return;
        }
        const r = link.getBoundingClientRect();
        gsap.to(dot, {
          left: r.left + r.width / 2,
          top: r.bottom + 6,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
        });
      };

      const tick = () => {
        const s = scrollState;
        let next = "";
        if (s.outro > 0.55 || s.contact > 0) next = "contact";
        else if (s.projHeader > 0.05) next = "projects";
        else if (s.traverse > 0.6) next = "about";
        if (next !== current) {
          current = next;
          place(next);
        }
      };
      gsap.ticker.add(tick);
      const onResize = () => current && place(current);
      window.addEventListener("resize", onResize);
      return () => {
        gsap.ticker.remove(tick);
        window.removeEventListener("resize", onResize);
      };
    },
    { scope: ref }
  );

  return (
    <>
      <nav ref={ref} className="nav" aria-label="Primary">
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
      <span ref={dotRef} className="nav-dot" aria-hidden="true" />
    </>
  );
}
