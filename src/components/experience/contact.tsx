"use client";

import React, { useRef, useState } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { socialLinks } from "@/data/social";

const EMAIL = "sofiyandev56@gmail.com";

/**
 * The last act, in normal flow so the page has a real end: an invitation,
 * the email (click copies it), the socials and the sign-off. Fades in with a
 * blur once the starfield has settled.
 */
export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      const inner = ref.current?.querySelector<HTMLElement>(".fade-blur");
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
      <div className="fade-blur">
        <div className="line serif">Have a project in mind? Let&rsquo;s talk.</div>
        <span className="mail-wrap">
          <span className={`copy-toast ${copied ? "show" : ""}`} role="status">
            Copied ✓
          </span>
          <a className="mail" href={`mailto:${EMAIL}`} onClick={copy} data-magnetic="6">
            {EMAIL}
          </a>
        </span>
        <div className="mail-hint">click to copy</div>
        <div className="socials">
          {socials.map((s, i) => (
            <React.Fragment key={s.name}>
              {i > 0 && <span aria-hidden="true">·</span>}
              <a href={s.url} target="_blank" rel="noopener noreferrer" data-magnetic="6">
                {s.name}
              </a>
            </React.Fragment>
          ))}
        </div>
      </div>
      <footer>© {new Date().getFullYear()} Sofiyan Shaikh. AI &amp; ML · Code · Craft</footer>
    </section>
  );
}
