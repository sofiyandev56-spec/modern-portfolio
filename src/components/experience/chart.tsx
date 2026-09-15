"use client";

import React, { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollState, window01 } from "@/lib/scroll-state";
import { STAR_PATH } from "@/lib/site";
import { projects } from "@/data/projects";

/**
 * The chart: a drafting grid over the whole scene.
 *
 * Two vertical and two horizontal hairlines frame the viewport, with the
 * site's four-point star at each intersection and a mint line along the
 * bottom rule that fills with overall scroll progress. The rules draw
 * themselves in once the loader is done (CSS, gated by html.is-ready), dim
 * while the reader is inside the About act and the outro starfield so the
 * words and dust have the frame to themselves, and bend towards the pointer
 * when it comes near. During the projects a ruler of tick marks appears on
 * the right rule and a head travels down it, counting the card on stage.
 *
 * Geometry is measured once per resize and pushed to CSS variables on the
 * document root, so the marks, fill, ruler and the chapter rail share it
 * with the SVG paths.
 *
 * Also hosts the `soak` filter the hero name breaks up through (see
 * hero-layer.tsx), since a filter has to live somewhere in the document.
 */

const RULES = ["v1", "h1", "v2", "h2"] as const;
type Rule = (typeof RULES)[number];

/** How close the pointer must be (px) before a rule starts to bend. */
const WARP_REACH = 90;
/** Largest visible bend (px). The quadratic control point moves twice this. */
const WARP_BEND = 14;

interface Geometry {
  w: number;
  h: number;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

export function Chart() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const rules = root.querySelector<SVGSVGElement>(".chart-rules");
      const marks = root.querySelector<HTMLElement>(".chart-marks");
      const fill = root.querySelector<HTMLElement>(".chart-fill");
      const ruler = root.querySelector<HTMLElement>(".chart-ruler");
      const head = root.querySelector<HTMLElement>(".chart-ruler-head");
      const readout = root.querySelector<HTMLElement>(".chart-ruler-head b");
      if (!rules || !marks || !fill || !ruler || !head || !readout) return;
      const paths = {} as Record<Rule, SVGPathElement>;
      for (const r of RULES) {
        const el = rules.querySelector<SVGPathElement>(`[data-rule="${r}"]`);
        if (!el) return;
        paths[r] = el;
      }

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const canWarp = !reduce && window.matchMedia("(pointer: fine)").matches;

      const g: Geometry = { w: 0, h: 0, x1: 0, x2: 0, y1: 0, y2: 0 };
      const rulePos = (r: Rule) =>
        r === "v1" ? g.x1 : r === "v2" ? g.x2 : r === "h1" ? g.y1 : g.y2;

      // A straight rule, or one bowed towards `at` along its length by `bend`.
      const setPath = (r: Rule, bend: number, at: number) => {
        const p = rulePos(r);
        const vertical = r[0] === "v";
        let d: string;
        if (bend === 0) {
          d = vertical ? `M${p} 0L${p} ${g.h}` : `M0 ${p}L${g.w} ${p}`;
        } else {
          const c = (p + bend * 2).toFixed(1);
          const a = at.toFixed(1);
          d = vertical ? `M${p} 0Q${c} ${a} ${p} ${g.h}` : `M0 ${p}Q${a} ${c} ${g.w} ${p}`;
        }
        paths[r].setAttribute("d", d);
      };

      const measure = () => {
        const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        const mobile = window.innerWidth < 768;
        g.w = window.innerWidth;
        g.h = window.innerHeight;
        g.x1 = Math.round(g.w * 0.07);
        g.x2 = Math.round(g.w * 0.93);
        g.y1 = Math.round(4.6 * rem);
        // Phones keep the pill nav and the scroll arrow at the bottom; the
        // rule sits above both.
        g.y2 = Math.round(g.h - (mobile ? 6.6 : 4.6) * rem);
        rules.setAttribute("viewBox", `0 0 ${g.w} ${g.h}`);
        const html = document.documentElement.style;
        html.setProperty("--gx1", `${g.x1}px`);
        html.setProperty("--gx2", `${g.x2}px`);
        html.setProperty("--gy1", `${g.y1}px`);
        html.setProperty("--gy2", `${g.y2}px`);
        RULES.forEach((r) => setPath(r, 0, 0));
      };
      measure();
      window.addEventListener("resize", measure);

      const warp = RULES.map(() => ({ bend: 0, at: 0, bent: false }));
      let dim = 1;
      let lastDim = -1;
      let lastFill = -1;
      let lastRuler = -1;
      let lastHead = -1;
      let lastIndex = -1;

      const tick = (_t: number, deltaMs: number) => {
        const dt = Math.min(deltaMs / 1000, 1 / 20);
        const s = scrollState;

        // ── Dim: the frame steps back for the constellation and the starfield ──
        const aboutDim = window01(s.traverse, 0, 0.5) * (1 - window01(s.projHeader, 0, 0.4));
        const outroDim = window01(s.tail, 0, 1) * (1 - window01(s.outro, 0.55, 0.95));
        const dimTarget = 1 - 0.65 * Math.max(aboutDim, outroDim);
        dim = reduce ? dimTarget : dim + (dimTarget - dim) * (1 - Math.exp(-4 * dt));
        if (Math.abs(dim - lastDim) > 0.003) {
          lastDim = dim;
          rules.style.opacity = dim.toFixed(3);
          marks.style.opacity = dim.toFixed(3);
        }

        // ── Progress along the bottom rule ──
        if (Math.abs(s.total - lastFill) > 0.001) {
          lastFill = s.total;
          fill.style.transform = `scaleX(${s.total.toFixed(4)})`;
        }

        // ── Ruler: on for the projects act ──
        const rulerVis = window01(s.projHeader, 0.3, 0.8) * (1 - window01(s.tail, 0, 0.6));
        if (Math.abs(rulerVis - lastRuler) > 0.003) {
          lastRuler = rulerVis;
          ruler.style.opacity = rulerVis.toFixed(3);
          ruler.style.visibility = rulerVis > 0.01 ? "visible" : "hidden";
        }
        if (rulerVis > 0.01) {
          const p = (s.proj1 + s.proj2 + s.proj3) / 3;
          const y = p * (g.y2 - g.y1);
          if (Math.abs(y - lastHead) > 0.2) {
            lastHead = y;
            head.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
          }
          const index = s.proj3 > 0.02 ? 2 : s.proj2 > 0.02 ? 1 : 0;
          if (index !== lastIndex) {
            lastIndex = index;
            readout.textContent = `0${index + 1} / 0${projects.length}`;
          }
        }

        // ── Warp: rules bow towards a nearby pointer and spring back ──
        if (!canWarp) return;
        const cx = s.cursorX;
        const cy = s.cursorY;
        const present = cx >= 0;
        const k = 1 - Math.exp(-9 * dt);
        RULES.forEach((r, i) => {
          const vertical = r[0] === "v";
          const st = warp[i];
          let target = 0;
          if (present) {
            const d = (vertical ? cx : cy) - rulePos(r);
            const ad = Math.abs(d);
            if (ad < WARP_REACH) {
              const f = 1 - ad / WARP_REACH;
              target = Math.sign(d) * WARP_BEND * f * f;
              st.at = vertical ? cy : cx;
            }
          }
          st.bend += (target - st.bend) * k;
          if (Math.abs(st.bend) > 0.05) {
            st.bent = true;
            setPath(r, st.bend, st.at);
          } else if (st.bent) {
            st.bent = false;
            st.bend = 0;
            setPath(r, 0, 0);
          }
        });
      };
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        window.removeEventListener("resize", measure);
      };
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="layer chart" aria-hidden="true">
      <svg className="chart-rules" preserveAspectRatio="none">
        {RULES.map((r, i) => (
          <path key={r} data-rule={r} pathLength={1} style={{ "--i": i } as React.CSSProperties} />
        ))}
      </svg>
      <span className="chart-fill" />
      <div className="chart-marks">
        {["tl", "tr", "bl", "br"].map((corner, i) => (
          <i key={corner} className={`chart-mark ${corner}`} style={{ "--i": i } as React.CSSProperties}>
            <span>
              <svg viewBox="-1.2 -1.2 2.4 2.4">
                <path d={STAR_PATH} />
              </svg>
            </span>
          </i>
        ))}
      </div>
      <div className="chart-ruler">
        <i className="chart-ruler-ticks" />
        <i className="chart-ruler-head">
          <b>01 / 03</b>
        </i>
      </div>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="soak" x="-10%" y="-40%" width="120%" height="180%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.035" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    </div>
  );
}
