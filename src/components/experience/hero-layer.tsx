"use client";

import React, { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollState, window01 } from "@/lib/scroll-state";
import { Words } from "@/components/experience/split";

/**
 * The hero text, pinned over the cosmos.
 *
 * The name sits behind the portal at 55% white so the star shows through it.
 * Above it, a second copy of the name is split into letters and carries a
 * mint text-shadow: each letter's opacity follows its distance to the star
 * (and to the cursor), so the star lights the letters it drifts past and the
 * pointer leaves a soft glow where it hovers.
 *
 * The sub line and the tag arrive word by word after the loader (a CSS
 * transition on html.is-ready; see split.tsx). As the reader begins to fly
 * (the traverse phase) the name grows and fades like something passed on the
 * way in; the sub line and tag leave a little earlier, the arrow as soon as
 * scrolling starts. Everything here moves with transform and opacity only.
 */
export function HeroLayer({ name, sub, tag }: { name: string; sub: string[]; tag: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const nameEl = root.querySelector<HTMLElement>(".hero-name:not(.hero-name-glow)");
      const glowEl = root.querySelector<HTMLElement>(".hero-name-glow");
      const subEl = root.querySelector<HTMLElement>(".hero-sub");
      const tagEl = root.querySelector<HTMLElement>(".hero-tag");
      const arrow = root.querySelector<HTMLElement>(".hero-arrow");
      if (!nameEl || !glowEl || !subEl || !tagEl || !arrow) return;
      const letters = Array.from(glowEl.querySelectorAll<HTMLElement>(".gl"));

      // Letter centres are measured once (and again on resize or when the
      // fonts finish loading) relative to the name's centre, then placed each
      // frame by arithmetic from the current scale and offset — no layout
      // reads inside the loop.
      const base: { dx: number; dy: number }[] = letters.map(() => ({ dx: 0, dy: 0 }));
      let elCX = 0;
      let elCY = 0;
      let dirty = true;
      const measure = (sc: number, ty: number) => {
        const r = glowEl.getBoundingClientRect();
        elCX = r.left + r.width / 2;
        elCY = r.top + r.height / 2 - ty;
        letters.forEach((el, i) => {
          const lr = el.getBoundingClientRect();
          base[i].dx = (lr.left + lr.width / 2 - elCX) / sc;
          base[i].dy = (lr.top + lr.height / 2 - (elCY + ty)) / sc;
        });
        dirty = false;
      };
      const markDirty = () => {
        dirty = true;
      };
      window.addEventListener("resize", markDirty);
      window.addEventListener("orientationchange", markDirty);
      document.fonts?.ready.then(markDirty);
      const lastGlow = letters.map(() => -1);
      const falloff = (d: number, r: number) => {
        const t = 1 - Math.min(1, Math.max(0, (d - r * 0.2) / (r * 0.8)));
        return t * t;
      };

      let intro = 0;
      const tick = () => {
        const s = scrollState;
        intro += ((s.ready ? 1 : 0) - intro) * 0.045;
        const leave = window01(s.traverse, 0, 0.45);
        const leaveSoon = window01(s.traverse, 0, 0.28);
        const nameScale = 1 + 0.35 * s.traverse;
        const nameOpacity = intro * (1 - leave);
        const ty = (1 - intro) * 24;
        const nameTransform = `translate(-50%, ${ty.toFixed(2)}px) scale(${nameScale.toFixed(4)})`;
        const visible = nameOpacity > 0.01;

        nameEl.style.opacity = String(nameOpacity);
        nameEl.style.transform = nameTransform;
        nameEl.style.visibility = visible ? "visible" : "hidden";
        glowEl.style.transform = nameTransform;
        glowEl.style.visibility = visible ? "visible" : "hidden";

        if (visible) {
          if (dirty) measure(nameScale, ty);
          const starR = Math.max(120, s.starRadiusPx * 2.2);
          const hasStar = s.starRadiusPx > 0;
          const hasCursor = s.cursorX >= 0;
          for (let i = 0; i < letters.length; i++) {
            const cx = elCX + base[i].dx * nameScale;
            const cy = elCY + ty + base[i].dy * nameScale;
            let g = 0;
            if (hasStar) {
              g = falloff(Math.hypot(cx - s.starPx, cy - s.starPy), starR);
            }
            if (hasCursor) {
              g = Math.max(g, 0.7 * falloff(Math.hypot(cx - s.cursorX, cy - s.cursorY), 190));
            }
            const v = Math.round(g * nameOpacity * 40) / 40;
            if (v !== lastGlow[i]) {
              lastGlow[i] = v;
              letters[i].style.opacity = String(v);
            }
          }
        }

        const subOpacity = intro * (1 - leaveSoon);
        subEl.style.opacity = String(subOpacity);
        subEl.style.transform = `translate(-50%, ${((1 - intro) * 18 - leaveSoon * 26).toFixed(2)}px)`;
        subEl.style.visibility = subOpacity > 0.01 ? "visible" : "hidden";
        tagEl.style.opacity = String(subOpacity);
        tagEl.style.transform = `translate(-50%, ${((1 - intro) * 18 - leaveSoon * 30).toFixed(2)}px)`;
        tagEl.style.visibility = subOpacity > 0.01 ? "visible" : "hidden";
        const arrowOpacity = intro * (1 - window01(s.hero, 0, 0.35));
        arrow.style.opacity = String(arrowOpacity);
        arrow.style.visibility = arrowOpacity > 0.01 ? "visible" : "hidden";
      };
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        window.removeEventListener("resize", markDirty);
        window.removeEventListener("orientationchange", markDirty);
      };
    },
    { scope: ref }
  );

  return (
    <div ref={ref} aria-hidden="true">
      {/* The name, then the glow copy split into letters above it. */}
      <div className="hero-pin hero-name" style={{ opacity: 0 }}>
        {name}
      </div>
      <div className="hero-pin hero-name hero-name-glow" style={{ visibility: "hidden" }}>
        {Array.from(name).map((ch, i) => (
          <span key={i} className="gl" style={{ opacity: 0 }}>
            {ch === " " ? "\u00A0" : ch}
          </span>
        ))}
      </div>
      <div className="hero-pin hero-sub" style={{ opacity: 0 }}>
        {sub.map((line, i) => (
          <React.Fragment key={line}>
            {i > 0 && (
              <>
                {" "}
                <span className="w sub-dot" style={{ "--i": i * 4 - 1 } as React.CSSProperties}>
                  <i>·</i>
                </span>{" "}
              </>
            )}
            <span className="sub-line">
              <Words text={line} from={i * 4} />
            </span>
          </React.Fragment>
        ))}
      </div>
      <div className="hero-pin hero-tag serif" style={{ opacity: 0 }}>
        <Words text={tag} from={sub.length * 4} />
      </div>
      <div className="hero-pin hero-arrow" style={{ opacity: 0 }}>
        <svg viewBox="0 0 22 12" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
          <path d="M1 1l10 10L21 1" />
        </svg>
      </div>
    </div>
  );
}
