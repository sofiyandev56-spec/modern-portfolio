"use client";

import React, { useEffect, useRef, useState } from "react";
import Lenis from "lenis";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Lenis only smooths wheel input, which touch devices never produce, but it
    // still runs a requestAnimationFrame loop every frame for the life of the
    // page. On a phone that is pure battery cost, and its 1.2s animated anchor
    // scroll is slower than the native jump. Native scrolling plus the
    // scroll-margin-top in globals.css gives the same result for free.
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (!prefersReducedMotion && !isTouch) {
      const lenis = new Lenis({
        lerp: 0.08,
        wheelMultiplier: 0.9,
        smoothWheel: true,
      });

      lenisRef.current = lenis;
      (window as unknown as { __lenis: Lenis | null }).__lenis = lenis;

      // Smooth RAF loop
      let rafId: number;
      function raf(time: number) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);

      // Handle anchor links smoothly
      const handleAnchorClick = (e: MouseEvent) => {
        const target = (e.target as HTMLElement)?.closest("a");
        if (!target) return;
        const href = target.getAttribute("href");
        if (href && href.startsWith("#") && href.length > 1) {
          const element = document.querySelector(href);
          if (element) {
            e.preventDefault();
            lenis.scrollTo(element as HTMLElement, {
              offset: 0,
              duration: 1.2,
            });
          }
        }
      };

      document.addEventListener("click", handleAnchorClick);

      return () => {
        cancelAnimationFrame(rafId);
        document.removeEventListener("click", handleAnchorClick);
        (window as unknown as { __lenis: Lenis | null }).__lenis = null;
        lenis.destroy();
        lenisRef.current = null;
      };
    }
  }, []);

  // Ambient mouse-following spotlight tracker
  useEffect(() => {
    if (typeof window === "undefined") return;
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
            background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(168, 85, 247, 0.07), transparent 75%)`,
          }}
        />
      )}
      {children}
    </>
  );
}
