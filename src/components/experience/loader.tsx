"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { scrollState } from "@/lib/scroll-state";

const WORDS = ["Curious", "Rigorous", "Persistent", "Building"];

/**
 * The opening: a word cycling in the centre, a serif counter running to 100
 * and a mint line filling along the bottom. Scrolling is locked until it is
 * done; then the black dissolves into a grid of shrinking dots (the mask in
 * globals.css) while the cosmos settles in beneath, and `html.is-ready`
 * starts the chrome drawing itself in. Under reduced motion it is dismissed
 * at once.
 */
export function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  const [word, setWord] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = ref.current;
    const count = root?.querySelector<HTMLElement>(".loader-count");
    const bar = root?.querySelector<HTMLElement>(".loader-bar");

    let finished = false;
    let dissolve: gsap.core.Tween | null = null;
    const finish = () => {
      if (finished) return;
      finished = true;
      scrollState.ready = true;
      document.documentElement.classList.remove("is-loading");
      document.documentElement.classList.add("is-ready");
      getLenis()?.start();
      if (reduce || !root) {
        setDone(true);
        return;
      }
      const dots = { go: 100 };
      dissolve = gsap.to(dots, {
        go: 0,
        duration: 0.9,
        ease: "power2.inOut",
        onUpdate: () => root.style.setProperty("--go", `${dots.go.toFixed(1)}%`),
        onComplete: () => setDone(true),
      });
    };

    if (reduce) {
      finish();
      return;
    }

    // The story starts at the top, even on reload.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    document.documentElement.classList.add("is-loading");
    window.scrollTo(0, 0);

    // A hidden or throttled tab starves the ticker; never hold the page
    // hostage to it — the loader is over within 3.5s whatever happens.
    const safety = window.setTimeout(finish, 3500);

    const state = { n: 0 };
    const tl = gsap.timeline({ onComplete: finish });
    tl.to(state, {
      n: 100,
      duration: 2.1,
      ease: "power2.inOut",
      onUpdate: () => {
        if (count) count.textContent = String(Math.round(state.n)).padStart(3, "0");
        if (bar) bar.style.transform = `scaleX(${state.n / 100})`;
      },
    });
    tl.to({}, { duration: 0.25 });

    const cycle = window.setInterval(() => setWord((w) => (w + 1) % WORDS.length), 420);

    return () => {
      tl.kill();
      dissolve?.kill();
      window.clearInterval(cycle);
      window.clearTimeout(safety);
      document.documentElement.classList.remove("is-loading");
    };
  }, []);

  return (
    <div ref={ref} className={`loader dither ${done ? "done" : ""}`} aria-hidden={done}>
      <span className="loader-brand">Sofiyan Shaikh</span>
      <span key={word} className="loader-word serif" aria-live="polite">
        {WORDS[word]}
      </span>
      <span className="loader-count serif">000</span>
      <span className="loader-bar" />
    </div>
  );
}
