"use client";

import React, { useRef, useState } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { socialLinks } from "@/data/social";
import { Line, Words } from "@/components/experience/split";

const EMAIL = "sofiyandev56@gmail.com";

/**
 * The last act, in normal flow so the page has a real end: an invitation,
 * the email (click copies it), the socials and the sign-off. Once the
 * starfield has settled it dithers in and its lines rise one after another
 * (CSS on `.visible`; see split.tsx).
 */
export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      const inner = ref.current?.querySelector<HTMLElement>(".contact-in");
      if (!inner) return;
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 60%",
        onEnter: () => inner.classList.add("visible"),
      });
    },
    { scope: ref }
  );

  const copy = async (e: React.MouseEvent) => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      e.preventDefault();
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: let the mailto link do its job.
    }
  };

  const socials = socialLinks.filter((s) => s.icon !== "mail");

  return (
    <section id="contact" ref={ref} className="contact" data-phase="contact">
      <div className="contact-in dither">
        <div className="line serif">
          <Words text="Have a project in mind? Let’s talk." />
        </div>
        <span className="mail-wrap">
          <span className={`copy-toast ${copied ? "show" : ""}`} role="status">
            Copied ✓
          </span>
          <Line index={7}>
            <a className="mail" href={`mailto:${EMAIL}`} onClick={copy} data-magnetic="6">
              {EMAIL}
            </a>
          </Line>
        </span>
        <div className="mail-hint">
          <Line index={9}>click or tap to copy</Line>
        </div>
        <div className="socials">
          {socials.map((s, i) => (
            <React.Fragment key={s.name}>
              {i > 0 && (
                <span className="soc-dot" aria-hidden="true">
                  ·
                </span>
              )}
              <Line index={10 + i}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" data-magnetic="6">
                  {s.name}
                </a>
              </Line>
            </React.Fragment>
          ))}
        </div>
      </div>
      <footer>© {new Date().getFullYear()} Sofiyan Shaikh. AI &amp; ML · Code · Craft</footer>
    </section>
  );
}
