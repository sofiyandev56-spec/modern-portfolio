"use client";

import React, { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";

/**
 * Inertia micro-effect: elements shear a few degrees in the direction of fast
 * scrolling and settle back when the page rests.
 *
 * Every wrapped element registers with one shared ticker so there is a single
 * velocity read and a single damping pass per frame, not one per element.
 * Velocity comes from Lenis (pixels per frame); where Lenis is not running —
 * touch devices, reduced motion — it is always zero and nothing moves, which
 * is the behaviour those devices should have anyway.
 */

interface Entry {
  max: number;
  set: (value: number) => void;
  el: HTMLElement;
  active: boolean;
}

const entries = new Set<Entry>();
let current = 0;
let ticking = false;

function tick() {
  const lenis = getLenis();
  const velocity = lenis?.velocity ?? 0;
  // ~40px/frame is a brisk flick; that maps to full skew.
  const target = gsap.utils.clamp(-1, 1, velocity / 40);
  current += (target - current) * 0.12;
  if (Math.abs(current) < 0.002 && target === 0) current = 0;

  entries.forEach((entry) => {
    const active = current !== 0;
    if (active !== entry.active) {
      // Hold the compositor hint only while the element is actually moving.
      entry.el.style.willChange = active ? "transform" : "";
      entry.active = active;
    }
    entry.set(current * entry.max);
  });
}

function register(entry: Entry) {
  entries.add(entry);
  if (!ticking) {
    gsap.ticker.add(tick);
    ticking = true;
  }
  return () => {
    entries.delete(entry);
    entry.set(0);
    entry.el.style.willChange = "";
    if (entries.size === 0 && ticking) {
      gsap.ticker.remove(tick);
      ticking = false;
    }
  };
}

interface VelocitySkewProps {
  as?: "div" | "section" | "span" | "li" | "article";
  className?: string;
  /** Maximum shear in degrees. Clamped to [-3, 3]. */
  max?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function VelocitySkew({
  as = "div",
  className,
  max = 3,
  children,
  style,
}: VelocitySkewProps) {
  const ref = useRef<HTMLElement>(null);
  const clampedMax = Math.min(Math.max(max, 0), 3);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const set = gsap.quickSetter(el, "skewY", "deg") as (value: number) => void;
    return register({ el, max: clampedMax, set, active: false });
  });

  const Tag = as;
  return (
    <Tag ref={ref as React.Ref<never>} className={className} style={style}>
      {children}
    </Tag>
  );
}
