"use client";

import React, { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollState, window01 } from "@/lib/scroll-state";
import { constellation, type ConstellationItem } from "@/data/constellation";

/**
 * The About act: qualities and tools drifting around the star.
 *
 * Each word owns a window of the About phase. It blurs in over the first
 * part of its window, drifts upward with scroll at a rate set by its depth
 * (nearer words move more, like parallax), and blurs out again at the end.
 * The pointer nudges the whole field a little, again by depth.
 */
export function Constellation() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const els = Array.from(root.querySelectorAll<HTMLElement>(".cword"));
      const items = constellation;
      let px = 0;
      let py = 0;

      const tick = () => {
        const a = scrollState.about;
        px += (scrollState.pointerX - px) * 0.06;
        py += (scrollState.pointerY - py) * 0.06;
        els.forEach((el, i) => {
          const item = items[i];
          const [start, end] = item.at;
          const span = end - start;
          const fadeIn = window01(a, start, start + span * 0.28);
          const fadeOut = window01(a, end - span * 0.28, end);
          const vis = fadeIn * (1 - fadeOut);
          if (vis <= 0.001) {
            if (el.style.visibility !== "hidden") {
              el.style.visibility = "hidden";
              el.style.opacity = "0";
            }
            return;
          }
          // Drift: from below its rest position to above it across its window.
          const t = (a - start) / span;
          const drift = (0.5 - t) * 140 * item.depth;
          const blur = (1 - vis) * 10;
          el.style.visibility = "visible";
          el.style.opacity = String(vis);
          el.style.filter = blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : "none";
          el.style.transform = `translate(-50%, -50%) translate(${(px * 18 * item.depth).toFixed(1)}px, ${(drift + py * -12 * item.depth).toFixed(1)}px)`;
        });
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="layer constellation" aria-hidden="true">
      {constellation.map((item, i) => (
        <Word key={i} item={item} />
      ))}
    </div>
  );
}

function Word({ item }: { item: ConstellationItem }) {
  const style = {
    "--dx": `${item.dx}%`,
    "--dy": `${item.dy}%`,
    "--mx": `${item.mx}%`,
    "--my": `${item.my}%`,
  } as React.CSSProperties;

  if (item.kind === "logo") {
    return (
      <span className="cword cw-logo" style={style} title={item.name}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d={item.path} />
        </svg>
      </span>
    );
  }
  return (
    <span className={`cword ${item.kind === "serif" ? "cw-serif" : "cw-sans"}`} style={style}>
      {item.text}
    </span>
  );
}
