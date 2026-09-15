"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollState, window01 } from "@/lib/scroll-state";
import { REDUCED_MOTION } from "@/lib/use-media-query";
import { projects, type Project } from "@/data/projects";
import { Line, Words } from "@/components/experience/split";

/**
 * The projects act: a title, then one card per scroll segment.
 *
 * Cards alternate left and right while the star swings to the opposite side
 * (see cosmos.tsx). Over the first part of its segment a card's frame
 * resolves out of a grid of dots and its words rise into place one after
 * another; it holds; then the whole card dissolves back into dots at the
 * end (the .dither mask and the .w masks in globals.css). While hidden it
 * is also `visibility: hidden` so its link cannot take keyboard focus
 * off-screen. The title rises as one line and leaves the same way.
 */
export function ProjectStage() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const reduce = window.matchMedia(REDUCED_MOTION).matches;
      const title = root.querySelector<HTMLElement>(".proj-title");
      const titleLine = title?.querySelector<HTMLElement>(".ln > i");
      if (!title || !titleLine) return;
      const cards = Array.from(root.querySelectorAll<HTMLElement>(".pcard-anim")).map((el) => ({
        el,
        frame: el.querySelector<HTMLElement>(".pframe"),
        words: Array.from(el.querySelectorAll<HTMLElement>(".ptext .w > i")),
        shown: false,
      }));

      // Every value is cached so a frame with no change writes nothing.
      const last = new Map<HTMLElement, string>();
      const write = (el: HTMLElement, key: string, value: string, set: () => void) => {
        const k = key + value;
        if (last.get(el) === k) return;
        last.set(el, k);
        set();
      };
      const setGo = (el: HTMLElement, go: number) => {
        const v = `${go.toFixed(1)}%`;
        write(el, "go", v, () => el.style.setProperty("--go", v));
      };
      const setRise = (el: HTMLElement, t: number) => {
        const v = t >= 1 ? "none" : `translateY(${((1 - t) * 115).toFixed(1)}%)`;
        write(el, "rise", v, () => (el.style.transform = v));
      };
      const hide = (el: HTMLElement) => {
        el.style.visibility = "hidden";
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
      };
      const show = (el: HTMLElement) => {
        el.style.visibility = "visible";
        el.style.opacity = "1";
      };

      const tick = () => {
        const s = scrollState;
        // Title: in during the header beat, out as the first card arrives.
        const tIn = window01(s.projHeader, 0.12, 0.5);
        const tOut = window01(s.proj1, 0, 0.25);
        if (tIn <= 0.001 || tOut >= 0.999) {
          hide(title);
        } else {
          show(title);
          setRise(titleLine, reduce ? 1 : tIn);
          setGo(title, reduce ? 100 : (1 - tOut) * 100);
          title.style.transform = `translate3d(0, ${(-tOut * 20).toFixed(1)}px, 0)`;
        }

        const phases = [s.proj1, s.proj2, s.proj3];
        cards.forEach((c, i) => {
          const p = phases[i];
          const cIn = window01(p, 0.06, 0.32);
          const cOut = window01(p, 0.74, 0.98);
          if (cIn <= 0.001 || cOut >= 0.999) {
            if (c.shown) {
              c.shown = false;
              hide(c.el);
            }
            return;
          }
          c.shown = true;
          show(c.el);
          c.el.style.transform = `translate3d(0, ${((1 - cIn) * 20 - cOut * 30).toFixed(1)}px, 0)`;
          c.el.style.pointerEvents = cIn > 0.6 && cOut < 0.2 ? "auto" : "none";
          setGo(c.el, reduce ? 100 : (1 - cOut) * 100);
          if (c.frame) setGo(c.frame, reduce ? 100 : cIn * 100);
          // Words rise in order; the stagger is sized so the last word lands
          // exactly as the frame finishes resolving.
          const n = c.words.length;
          const stagger = Math.min(0.03, 0.6 / Math.max(1, n - 1));
          const spread = 1 + (n - 1) * stagger;
          for (let w = 0; w < n; w++) {
            const t = reduce ? 1 : Math.min(1, Math.max(0, cIn * spread - w * stagger));
            setRise(c.words[w], t);
          }
        });
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="layer proj-stage">
      <div className="proj-title serif dither" aria-hidden="true">
        <Line>Projects</Line>
      </div>
      {projects.map((project, i) => (
        <div key={project.id} className={`pcard-slot ${i % 2 === 0 ? "left" : "right"}`}>
          <div className="pcard-anim dither">
            <div className="card-mag" data-magnetic="10">
              <Card project={project} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Frame({ project }: { project: Project }) {
  return (
    <div className="pframe dither">
      <div className="pvisual">
        {project.image ? (
          <Image
            src={project.image.src}
            alt={project.image.alt}
            width={project.image.width}
            height={project.image.height}
            sizes="(max-width: 767px) 85vw, 576px"
          />
        ) : (
          <ClinicGraphic />
        )}
      </div>
      <div className="pveil" />
      <span className="pc tl" />
      <span className="pc tr" />
      <span className="pc bl" />
      <span className="pc br" />
    </div>
  );
}

/** Decorative stand-in: no screenshot of the clinic app is published. */
function ClinicGraphic() {
  return (
    <div className="pgraphic" aria-hidden="true">
      <div>
        <span>pediatric clinic · booking portal</span>
        <strong>Appointments, intake, sign-off</strong>
      </div>
      <div className="pgraphic-grid">
        <div>
          parents
          <strong>Book a slot</strong>
        </div>
        <div>
          doctor
          <strong>Run the day</strong>
        </div>
        <div>
          intake
          <strong>From the phone</strong>
        </div>
        <div>
          checklist
          <strong>Immunizations</strong>
        </div>
      </div>
      <div>tanstack start · supabase · typescript</div>
    </div>
  );
}

function Card({ project }: { project: Project }) {
  const body = (
    <>
      <Frame project={project} />
      <div className="ptext">
        <span className="psur">
          <Words text={project.label} />
        </span>
        <h3 className="serif">
          <Words text={project.title} />
        </h3>
        <p className="pdesc">
          <Words text={project.blurb} />
        </p>
      </div>
    </>
  );
  if (project.href) {
    return (
      <a
        className="pcard"
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="visit"
        aria-label={`${project.title} — open`}
      >
        {body}
      </a>
    );
  }
  return <div className="pcard">{body}</div>;
}
