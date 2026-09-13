"use client";

import React, { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/use-media-query";

/**
 * Kinetic typography primitives.
 *
 * RevealText splits a heading into masked lines: each line is an
 * overflow-hidden box and the text slides up into it from below, staggered,
 * when the element enters the viewport (or on mount). RevealItem is the
 * companion for blocks that are not text lines — badges, paragraphs, button
 * rows — which fade and rise as one.
 *
 * Both rely on globals.css for the hidden start state so the first paint is
 * already hidden (no flash) and on `html.js` so the text is visible without
 * JavaScript. Under prefers-reduced-motion nothing is hidden or animated.
 */

interface RevealOptions {
  /** "scroll" plays once when the element enters the viewport; "mount" plays immediately. */
  trigger?: "scroll" | "mount";
  /** Seconds before the first line starts. */
  delay?: number;
  /** Seconds between lines. */
  stagger?: number;
  /** ScrollTrigger start position. */
  start?: string;
}

function useReveal(
  ref: React.RefObject<HTMLElement | null>,
  getTargets: (root: HTMLElement) => HTMLElement[],
  from: gsap.TweenVars,
  { trigger = "scroll", delay = 0, stagger = 0.03, start = "top 88%" }: RevealOptions
) {
  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const targets = getTargets(root);
        if (!targets.length) return;
        gsap.fromTo(
          targets,
          { ...from, willChange: "transform" },
          {
            yPercent: 0,
            y: 0,
            rotateZ: 0,
            opacity: 1,
            duration: 1.15,
            ease: "power4.out",
            stagger,
            delay,
            scrollTrigger:
              trigger === "scroll" ? { trigger: root, start, once: true } : undefined,
            // The compositor hint only helps while the transform is moving.
            onComplete: () => gsap.set(targets, { clearProps: "willChange" }),
          }
        );
      });
    },
    { scope: ref }
  );
}

type RevealTag = "h1" | "h2" | "h3" | "p" | "div" | "span";

interface RevealTextProps extends RevealOptions {
  as?: RevealTag;
  /** One entry per visual line. Pass a styled span for a gradient line. */
  lines: React.ReactNode[];
  className?: string;
  id?: string;
}

export function RevealText({
  as = "div",
  lines,
  className = "",
  id,
  stagger = 0.03,
  ...options
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  useReveal(
    ref,
    (root) => gsap.utils.toArray<HTMLElement>(".reveal-inner", root),
    { yPercent: 110, y: 0, rotateZ: 3, opacity: 1 },
    { stagger, ...options }
  );
  const Tag = as;

  return (
    <Tag ref={ref as React.Ref<never>} id={id} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="reveal-line">
          <span className="reveal-inner">{line}</span>
        </span>
      ))}
    </Tag>
  );
}

interface RevealItemProps extends RevealOptions {
  as?: RevealTag;
  className?: string;
  children: React.ReactNode;
}

/** A single block that fades in and rises when it enters. */
export function RevealItem({
  as = "div",
  className = "",
  children,
  ...options
}: RevealItemProps) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, (root) => [root], { y: 28, opacity: 0, yPercent: 0 }, options);
  const Tag = as;

  return (
    <Tag ref={ref as React.Ref<never>} className={`reveal-item ${className}`}>
      {children}
    </Tag>
  );
}
