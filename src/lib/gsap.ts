"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * Single registration point for GSAP plugins.
 *
 * Every animated component imports `gsap`, `ScrollTrigger` and `useGSAP` from
 * here rather than from the packages directly, so the plugins are guaranteed to
 * be registered before the first ScrollTrigger is created, and so there is one
 * place to tune global ScrollTrigger behaviour.
 *
 * Registration is idempotent and safe during server rendering: GSAP checks for
 * `window` itself. The config call is guarded because it is only meaningful in
 * a browser.
 */
gsap.registerPlugin(ScrollTrigger, useGSAP);

if (typeof window !== "undefined") {
  ScrollTrigger.config({
    // The address bar showing and hiding on phones fires resize events; a full
    // ScrollTrigger refresh on each one makes pinned sections jump mid-scroll.
    ignoreMobileResize: true,
  });
}

export { gsap, ScrollTrigger, useGSAP };
