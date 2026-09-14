"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollState, window01 } from "@/lib/scroll-state";
import { projects, type Project } from "@/data/projects";

/**
 * The projects act: a title, then one card per scroll segment.
 *
 * Cards alternate left and right while the star swings to the opposite side
 * (see cosmos.tsx). Each card blurs in over the first part of its segment,
 * holds, and blurs out at the end; while hidden it is also `visibility:
 * hidden` so its link cannot take keyboard focus off-screen.
 */
export function ProjectStage() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const title = root.querySelector<HTMLElement>(".proj-title");
      const cards = Array.from(root.querySelectorAll<HTMLElement>(".pcard-anim"));
      if (!title) return;

      const apply = (el: HTMLElement, vis: number, dir: number, interactive: boolean) => {
        if (vis <= 0.001) {
          if (el.style.visibility !== "hidden") {
            el.style.visibility = "hidden";
            el.style.opacity = "0";
            el.style.pointerEvents = "none";
          }
          return;
        }
        const blur = (1 - vis) * 8;
        el.style.visibility = "visible";
        el.style.opacity = String(vis);
        el.style.filter = blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : "none";
        el.style.transform = `translate3d(0, ${((1 - vis) * 30 * dir).toFixed(1)}px, 0)`;
        el.style.pointerEvents = interactive && vis > 0.6 ? "auto" : "none";
      };

      const tick = () => {
        const s = scrollState;
        // Title: in during the header beat, out as the first card arrives.
        const tIn = window01(s.projHeader, 0.12, 0.5);
        const tOut = window01(s.proj1, 0, 0.25);
        apply(title, tIn * (1 - tOut), tOut > 0 ? -1 : 1, false);

        const phases = [s.proj1, s.proj2, s.proj3];
        cards.forEach((card, i) => {
          const p = phases[i];
          const cIn = window01(p, 0.06, 0.32);
          const cOut = window01(p, 0.74, 0.98);
          apply(card, cIn * (1 - cOut), cOut > 0 ? -1 : 1, true);
        });
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="layer proj-stage">
      <div className="proj-title serif" aria-hidden="true">
        Projects
      </div>
      {projects.map((project, i) => (
        <div key={project.id} className={`pcard-slot ${i % 2 === 0 ? "left" : "right"}`}>
          <div className="pcard-anim">
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
    <div className="pframe">
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
        <span className="psur">{project.label}</span>
        <h3 className="serif">{project.title}</h3>
        <p className="pdesc">{project.blurb}</p>
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
