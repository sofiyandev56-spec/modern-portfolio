"use client";

import React, { useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scrollToTarget, setLenisInstance, updateScrollVelocity } from "@/lib/lenis";

/**
 * Scroll physics for the whole page.
 *
 * Lenis smooths wheel input with a fixed-duration exponential ease, and it is
 * driven from GSAP's ticker rather than its own requestAnimationFrame loop, so
 * the scroll position, every ScrollTrigger scrub and the 3D scene's damping
 * all advance on the same clock. Lenis reports each frame's scroll to
 * ScrollTrigger directly, and lag smoothing is off so a dropped frame never
 * lets the two drift apart.
 *
 * Touch devices and users who prefer reduced motion scroll natively: Lenis
 * only smooths wheel events, and a permanent rAF loop is a pure battery cost
 * on a phone. ScrollTrigger listens to native scroll on its own, so the
 * scroll-driven sections still work there.
 */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const smooth = !prefersReducedMotion && !isTouch;

    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    if (smooth) {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      // Lenis -> ScrollTrigger: every smoothed frame is a scroll update.
      lenis.on("scroll", ScrollTrigger.update);

      // GSAP ticker -> Lenis: one clock for scroll, scrubs and the 3D scene.
      // The ticker reports seconds; Lenis expects milliseconds.
      tick = (time: number) => {
        lenis!.raf(time * 1000);
        updateScrollVelocity(lenis!.velocity ?? 0);
      };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      setLenisInstance(lenis);
    }

    // In-page anchors go through the same physics as everything else. Handled
    // here for every device so the CSS scroll-behavior rule is not needed —
    // that rule would fight Lenis's per-frame scroll writes.
    const handleAnchorClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("#") || href.length < 2) return;
      const element = document.querySelector(href);
      if (!element) return;
      e.preventDefault();
      scrollToTarget(element);
    };
    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      if (tick) gsap.ticker.remove(tick);
      setLenisInstance(null);
      lenis?.destroy();
    };
  }, []);

  // Ambient mouse-following spotlight tracker
  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    let scheduled = false;
    const handlePointerMove = (e: PointerEvent) => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(() => {
          setMousePos({ x: e.clientX, y: e.clientY });
          scheduled = false;
        });
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <>
      {/* Dynamic Ambient Spotlight Overlay (pointer devices only) */}
      {mousePos.x > -1000 && (
        <div
          className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-700"
          style={{
            background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, var(--ambient-1), transparent 75%)`,
          }}
        />
      )}
      {children}
    </>
  );
}
