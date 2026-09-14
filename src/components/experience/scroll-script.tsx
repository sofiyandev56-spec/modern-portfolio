"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { PHASES, scrollState, type Phase } from "@/lib/scroll-state";

/**
 * Turns the page's spacer sections into phase progress.
 *
 * Every element with a `data-phase` attribute is one act of the story; as it
 * travels from the top of the viewport to past it, its ScrollTrigger's
 * progress runs 0..1. Those progress values are copied into scrollState once
 * per frame rather than through callbacks: a ScrollTrigger refresh reverts
 * and restores its triggers with events suppressed, which would leave
 * callback-fed state stale, while `.progress` is always current.
 *
 * Also tracks the pointer for parallax. Renders nothing.
 */
export function ScrollScript() {
  useGSAP(() => {
    const triggers: Partial<Record<Phase, ScrollTrigger>> = {};
    PHASES.forEach((phase) => {
      const el = document.querySelector(`[data-phase="${phase}"]`);
      if (!el) return;
      triggers[phase] = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom top",
      });
    });
    const tick = () => {
      PHASES.forEach((phase) => {
        const t = triggers[phase];
        if (t) scrollState[phase] = t.progress;
      });
    };
    gsap.ticker.add(tick);
    ScrollTrigger.refresh();
    return () => gsap.ticker.remove(tick);
  });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      scrollState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
      scrollState.cursorX = e.clientX;
      scrollState.cursorY = e.clientY;
    };
    const onLeave = () => {
      scrollState.cursorX = -1000;
      scrollState.cursorY = -1000;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return null;
}
