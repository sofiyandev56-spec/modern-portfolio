"use client";

import React, { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollState, smooth, window01 } from "@/lib/scroll-state";
import { constellation, type ConstellationItem } from "@/data/constellation";

/**
 * The About act: qualities and tools drifting around the star.
 *
 * Each word owns a window of the About phase. It blurs in over the first
 * part of its window, drifts upward with scroll at a rate set by its depth
 * (nearer words move more, like parallax), and blurs out again at the end.
 * The pointer nudges the whole field a little, again by depth.
 *
 * Beneath the words, an SVG draws the constellation itself: a hairline from
 * each word to the next, drawn out as the pair appears and retracted as it
 * fades, with a mint dot where it meets each word. The line ends come from
 * the same numbers the words are placed with, pulled back to the edge of
 * each word's box (measured once per resize), so the loop reads no layout.
 */
export function Constellation() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const els = Array.from(root.querySelectorAll<HTMLElement>(".cword"));
      const svg = root.querySelector<SVGSVGElement>(".clines");
      const lines = Array.from(root.querySelectorAll<SVGLineElement>(".clines line"));
      const dots = Array.from(root.querySelectorAll<SVGCircleElement>(".clines circle"));
      if (!svg) return;
      const items = constellation;
      let px = 0;
      let py = 0;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Viewport size and which set of positions applies (see data/constellation).
      let W = 0;
      let H = 0;
      let wide = true;
      const measure = () => {
        W = window.innerWidth;
        H = window.innerHeight;
        wide = W >= 768;
      };
      measure();
      window.addEventListener("resize", measure);

      const cx = new Float32Array(items.length);
      const cy = new Float32Array(items.length);
      const vis = new Float32Array(items.length);
      // Half-extents of each word's box, plus breathing room for the line.
      const hw = new Float32Array(items.length);
      const hh = new Float32Array(items.length);
      const PAD = 14;
      const measureWords = () => {
        els.forEach((el, i) => {
          const r = el.getBoundingClientRect();
          hw[i] = r.width / 2 + PAD;
          hh[i] = r.height / 2 + PAD;
        });
      };
      measureWords();
      window.addEventListener("resize", measureWords);
      document.fonts?.ready.then(measureWords);
      let svgShown = true;

      const tick = () => {
        const a = scrollState.about;
        const t = gsap.ticker.time;
        px += (scrollState.pointerX - px) * 0.06;
        py += (scrollState.pointerY - py) * 0.06;
        let any = false;
        els.forEach((el, i) => {
          const item = items[i];
          const [start, end] = item.at;
          const span = end - start;
          const fadeIn = window01(a, start, start + span * 0.28);
          const fadeOut = window01(a, end - span * 0.28, end);
          const v = fadeIn * (1 - fadeOut);
          vis[i] = v;
          if (v <= 0.001) {
            if (el.style.visibility !== "hidden") {
              el.style.visibility = "hidden";
              el.style.opacity = "0";
            }
            return;
          }
          any = true;
          // Drift: from below its rest position to above it across its window,
          // plus a slow idle sway so the field never sits perfectly still.
          const u = (a - start) / span;
          const drift = (0.5 - u) * 140 * item.depth;
          const sway = reduce ? 0 : Math.sin(t * 0.6 + i * 1.7) * 6 * item.depth;
          const swayX = reduce ? 0 : Math.cos(t * 0.45 + i * 2.3) * 4 * item.depth;
          const tx = px * 18 * item.depth + swayX;
          const ty = drift + py * -12 * item.depth + sway;
          cx[i] = ((wide ? item.dx : item.mx) / 100) * W + tx;
          cy[i] = ((wide ? item.dy : item.my) / 100) * H + ty;
          const blur = (1 - v) * 10;
          el.style.visibility = "visible";
          el.style.opacity = String(v);
          el.style.filter = blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : "none";
          el.style.transform = `translate(-50%, -50%) translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px)`;
        });

        if (!any) {
          if (svgShown) {
            svgShown = false;
            svg.style.visibility = "hidden";
          }
          return;
        }
        if (!svgShown) {
          svgShown = true;
          svg.style.visibility = "visible";
        }
        lines.forEach((line, i) => {
          // The line from word i to word i + 1 exists while both are on.
          const v = Math.min(vis[i], vis[i + 1]);
          const a = dots[i * 2];
          const b = dots[i * 2 + 1];
          if (v <= 0.001) {
            line.style.opacity = "0";
            a.style.opacity = "0";
            b.style.opacity = "0";
            return;
          }
          const dx = cx[i + 1] - cx[i];
          const dy = cy[i + 1] - cy[i];
          // Where the centre-to-centre segment leaves each word's box.
          const t1 = Math.min(hw[i] / Math.max(1e-3, Math.abs(dx)), hh[i] / Math.max(1e-3, Math.abs(dy)));
          const t2 = Math.min(hw[i + 1] / Math.max(1e-3, Math.abs(dx)), hh[i + 1] / Math.max(1e-3, Math.abs(dy)));
          if (t1 + t2 >= 1) {
            // The boxes overlap: nothing to draw between them.
            line.style.opacity = "0";
            a.style.opacity = "0";
            b.style.opacity = "0";
            return;
          }
          const x1 = cx[i] + dx * t1;
          const y1 = cy[i] + dy * t1;
          const x2 = cx[i + 1] - dx * t2;
          const y2 = cy[i + 1] - dy * t2;
          const len = Math.hypot(x2 - x1, y2 - y1);
          const drawn = reduce ? 1 : smooth(v);
          line.setAttribute("x1", x1.toFixed(1));
          line.setAttribute("y1", y1.toFixed(1));
          line.setAttribute("x2", x2.toFixed(1));
          line.setAttribute("y2", y2.toFixed(1));
          line.style.strokeDasharray = len.toFixed(1);
          line.style.strokeDashoffset = (len * (1 - drawn)).toFixed(1);
          line.style.opacity = Math.min(1, v * 1.5).toFixed(3);
          a.setAttribute("cx", x1.toFixed(1));
          a.setAttribute("cy", y1.toFixed(1));
          a.style.opacity = Math.min(1, v * 1.5).toFixed(3);
          // The far dot lands as the line reaches it.
          b.setAttribute("cx", x2.toFixed(1));
          b.setAttribute("cy", y2.toFixed(1));
          b.style.opacity = (window01(drawn, 0.85, 1) * Math.min(1, v * 1.5)).toFixed(3);
        });
      };
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        window.removeEventListener("resize", measure);
        window.removeEventListener("resize", measureWords);
      };
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="layer constellation" aria-hidden="true">
      <svg className="clines">
        {constellation.slice(1).map((_, i) => (
          <React.Fragment key={i}>
            <line />
            <circle r="1.6" />
            <circle r="1.6" />
          </React.Fragment>
        ))}
      </svg>
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
