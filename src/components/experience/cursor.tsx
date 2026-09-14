"use client";

import React, { useEffect, useRef, useState } from "react";
import { COARSE_OR_NARROW, useMediaQuery } from "@/lib/use-media-query";

/**
 * Custom cursor for pointer devices: a dot that tracks tightly, a ring that
 * trails it, three mint specks further behind, and a "visit" label that
 * appears over linked project cards. Elements with data-magnetic lean
 * towards the pointer when it is near. Hidden on touch devices.
 */
export function Cursor() {
  const coarse = useMediaQuery(COARSE_OR_NARROW);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const visitRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [mode, setMode] = useState<"default" | "hover" | "visit">("default");

  useEffect(() => {
    if (coarse) return;
    const html = document.documentElement;
    html.classList.add("has-cursor");

    const mouse = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    const trails = [0, 1, 2].map(() => ({ x: -100, y: -100 }));
    let magnet: HTMLElement | null = null;
    let raf = 0;

    const classify = (t: Element | null) => {
      const visit = t?.closest<HTMLElement>('[data-cursor="visit"]');
      const link = t?.closest<HTMLElement>("a, button");
      setMode(visit ? "visit" : link ? "hover" : "default");
    };
    // Scrolling moves things under a still pointer, so re-read what is there.
    const onScroll = () => {
      if (mouse.x < 0) return;
      classify(document.elementFromPoint(mouse.x, mouse.y));
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      const t = e.target as HTMLElement | null;
      classify(t);

      // Magnetic: lean towards the pointer within 40px of an element's edge.
      const next = t?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (magnet && magnet !== next) magnet.style.transform = "";
      magnet = next;
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const strength = Number(magnet.dataset.magnetic) || 6;
        const dx = ((e.clientX - (r.left + r.width / 2)) / r.width) * strength;
        const dy = ((e.clientY - (r.top + r.height / 2)) / r.height) * strength;
        magnet.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      }
    };
    const onLeave = () => {
      mouse.x = -100;
      mouse.y = -100;
    };
    const onOut = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const m = t?.closest<HTMLElement>("[data-magnetic]");
      if (m && !m.contains(e.relatedTarget as Node | null)) m.style.transform = "";
    };

    const tick = () => {
      ring.x += (mouse.x - ring.x) * 0.16;
      ring.y += (mouse.y - ring.y) * 0.16;
      let px = ring.x;
      let py = ring.y;
      trails.forEach((tr, i) => {
        tr.x += (px - tr.x) * (0.28 - i * 0.05);
        tr.y += (py - tr.y) * (0.28 - i * 0.05);
        px = tr.x;
        py = tr.y;
        const el = trailRefs.current[i];
        if (el) el.style.transform = `translate3d(${tr.x}px, ${tr.y}px, 0)`;
      });
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      if (visitRef.current) visitRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onOut, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      html.classList.remove("has-cursor");
      if (magnet) magnet.style.transform = "";
    };
  }, [coarse]);

  if (coarse) return null;

  return (
    <>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el;
          }}
          className="cur cur-trail"
          style={{ opacity: 0.45 - i * 0.12 }}
          aria-hidden="true"
        />
      ))}
      <div ref={ringRef} className={`cur cur-ring ${mode !== "default" ? "big" : ""}`} aria-hidden="true" />
      <div ref={dotRef} className={`cur cur-dot ${mode === "visit" ? "hide" : ""}`} aria-hidden="true" />
      <div ref={visitRef} className={`cur cur-visit ${mode === "visit" ? "show" : ""}`} aria-hidden="true">
        Visit
      </div>
    </>
  );
}
