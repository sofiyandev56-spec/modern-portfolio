"use client";

import React, { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollState, window01 } from "@/lib/scroll-state";

/**
 * The hero text, pinned over the cosmos.
 *
 * The name sits behind the portal at 55% white so the star shows through it.
 * As the reader begins to fly (the traverse phase) the name grows and blurs
 * out like something passed on the way in; the sub line and tag leave a
 * little earlier, the arrow as soon as scrolling starts.
 */
export function HeroLayer({ name, sub, tag }: { name: string; sub: string[]; tag: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const nameEls = root.querySelectorAll<HTMLElement>(".hero-name");
      const subEl = root.querySelector<HTMLElement>(".hero-sub");
      const tagEl = root.querySelector<HTMLElement>(".hero-tag");
      const arrow = root.querySelector<HTMLElement>(".hero-arrow");
      if (!subEl || !tagEl || !arrow) return;

      let intro = 0;
      const tick = () => {
        const s = scrollState;
        // Ease in after the loader; ~1.4s to settle.
        intro += ((s.ready ? 1 : 0) - intro) * 0.045;
        const leave = window01(s.traverse, 0, 0.45);
        const leaveSoon = window01(s.traverse, 0, 0.28);
        const nameScale = 1 + 0.35 * s.traverse;
        const nameOpacity = intro * (1 - leave);
        const blur = (1 - intro) * 14 + leave * 14;

        nameEls.forEach((el) => {
          el.style.opacity = String(nameOpacity);
          el.style.transform = `translate(-50%, ${(1 - intro) * 24}px) scale(${nameScale})`;
          el.style.filter = blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : "none";
          el.style.visibility = nameOpacity > 0.01 ? "visible" : "hidden";
        });
        const subOpacity = intro * (1 - leaveSoon);
        subEl.style.opacity = String(subOpacity);
        subEl.style.transform = `translate(-50%, ${(1 - intro) * 18 - leaveSoon * 26}px)`;
        subEl.style.visibility = subOpacity > 0.01 ? "visible" : "hidden";
        tagEl.style.opacity = String(intro * (1 - leaveSoon));
        tagEl.style.transform = `translate(-50%, ${(1 - intro) * 18 - leaveSoon * 30}px)`;
        tagEl.style.visibility = subOpacity > 0.01 ? "visible" : "hidden";
        const arrowOpacity = intro * (1 - window01(s.hero, 0, 0.35));
        arrow.style.opacity = String(arrowOpacity);
        arrow.style.visibility = arrowOpacity > 0.01 ? "visible" : "hidden";
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: ref }
  );

  return (
    <div ref={ref} aria-hidden="true">
      {/* Glow copy behind the name, then the name itself. */}
      <div className="hero-pin hero-name hero-name-glow" style={{ opacity: 0 }}>
        {name}
      </div>
      <div className="hero-pin hero-name" style={{ opacity: 0 }}>
        {name}
      </div>
      <div className="hero-pin hero-sub" style={{ opacity: 0 }}>
        {sub.map((line, i) => (
          <React.Fragment key={line}>
            {i > 0 && <span className="sub-dot"> · </span>}
            <span className="sub-line">{line}</span>
          </React.Fragment>
        ))}
      </div>
      <div className="hero-pin hero-tag serif" style={{ opacity: 0 }}>
        {tag}
      </div>
      <div className="hero-pin hero-arrow" style={{ opacity: 0 }}>
        <svg viewBox="0 0 22 12" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
          <path d="M1 1l10 10L21 1" />
        </svg>
      </div>
    </div>
  );
}
