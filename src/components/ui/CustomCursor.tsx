"use client";

import React, { useEffect, useRef, useState } from "react";
import { COARSE_OR_NARROW, useMediaQuery } from "@/lib/use-media-query";

type CursorMode = "default" | "pointer" | "drag" | "view";

export function CustomCursor() {
  const isTouch = useMediaQuery(COARSE_OR_NARROW);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const mouse = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  const [mode, setMode] = useState<CursorMode>("default");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isTouch) return;

    let animId: number;
    let activeMagnetic: HTMLElement | null = null;

    const handlePointerMove = (e: PointerEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Check context morphing
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const dragEl = target.closest<HTMLElement>('[data-cursor="drag"]');
      const viewEl = target.closest<HTMLElement>('[data-cursor="view"]');
      const interactiveEl = target.closest<HTMLElement>(
        'a, button, [role="button"], input, textarea, [data-magnetic]'
      );

      if (dragEl) {
        setMode("drag");
      } else if (viewEl) {
        setMode("view");
      } else if (interactiveEl) {
        setMode("pointer");
      } else {
        setMode("default");
      }

      // Check magnetic snapping within 40px
      const magnetics = Array.from(
        document.querySelectorAll<HTMLElement>("[data-magnetic]")
      );

      let closest: HTMLElement | null = null;
      let minDistance = 40; // 40px snapping radius

      for (const el of magnetics) {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        if (dist < minDistance) {
          minDistance = dist;
          closest = el;
        }
      }

      activeMagnetic = closest;
    };

    const handlePointerLeave = () => {
      setIsVisible(false);
      activeMagnetic = null;
    };

    const handlePointerEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave);
    document.addEventListener("mouseenter", handlePointerEnter);

    // Physics loop: dual-element follower with lerp
    const tick = () => {
      let targetX = mouse.current.x;
      let targetY = mouse.current.y;

      // If snapped to a magnetic element, attract target to element centroid
      if (activeMagnetic) {
        const rect = activeMagnetic.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        // Dampened magnetic pull
        targetX += (cx - mouse.current.x) * 0.65;
        targetY += (cy - mouse.current.y) * 0.65;
      }

      // Dot follows briskly
      dotPos.current.x += (targetX - dotPos.current.x) * 0.35;
      dotPos.current.y += (targetY - dotPos.current.y) * 0.35;

      // Outer ring follows via lerp(0.12)
      ringPos.current.x += (targetX - ringPos.current.x) * 0.12;
      ringPos.current.y += (targetY - ringPos.current.y) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
      document.removeEventListener("mouseenter", handlePointerEnter);
    };
  }, [isTouch, isVisible]);

  if (isTouch) return null;

  const isDrag = mode === "drag";
  const isView = mode === "view";
  const isPointer = mode === "pointer";
  const isPill = isDrag || isView;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden="true"
    >
      {/* Center Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full pointer-events-none transition-all duration-200 ${
          isPointer || isPill ? "opacity-0 scale-50" : "opacity-100 scale-100 bg-accent shadow-sm"
        }`}
        style={{ willChange: "transform" }}
      />

      {/* Trailing Outer Ring / Pill Follower */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 pointer-events-none flex items-center justify-center transition-[width,height,border-radius,background-color,border-color,opacity] duration-300 ease-out ${
          isPill
            ? "-ml-11 -mt-5 w-[88px] h-10 rounded-full bg-accent text-accent-fg font-display text-[11px] font-bold tracking-widest shadow-lg shadow-accent/25"
            : isPointer
            ? "-ml-6 -mt-6 w-12 h-12 rounded-full border border-accent bg-accent/20 backdrop-blur-[1px] mix-blend-difference"
            : "-ml-4 -mt-4 w-8 h-8 rounded-full border border-fg/30 bg-transparent"
        }`}
        style={{ willChange: "transform" }}
      >
        {isPill && (
          <span ref={textRef} className="select-none animate-in fade-in duration-200 uppercase">
            {isDrag ? "DRAG" : "VIEW"}
          </span>
        )}
      </div>
    </div>
  );
}
