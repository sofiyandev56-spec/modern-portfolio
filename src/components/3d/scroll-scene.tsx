"use client";

import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useTheme } from "@/lib/theme";
import { setSceneStatus } from "@/lib/scene-store";
import { CanvasErrorBoundary } from "@/components/3d/canvas-fallback";
import {
  Bust,
  CAMERA_FOV,
  GroundShadow,
  HERO_CAMERA_Z,
  MODEL_BASE_Y,
  StudioLights,
} from "@/components/3d/scene-contents";
import { FluidPlanesScene } from "@/components/webgl/FluidImagePlane";

/**
 * The desktop presentation of the bust: one fixed, full-viewport canvas that
 * sits behind the page and carries the model from section to section.
 *
 * How it moves
 * ------------
 * The scroll position never drives the model directly. Each narrative beat is
 * a `Pose` — where the model sits on screen, how it is turned, how far the
 * camera stands back — and a ScrollTrigger scrub per section boundary reports
 * how far the reader has travelled between one pose and the next. The render
 * loop reads that progress, interpolates the two poses, and then damps the
 * live camera and model towards the result every frame. Scrolling fast makes
 * the bust lag and swing into place; stopping lets it settle. Nothing is
 * snapped, so there is no per-frame stutter to hide.
 *
 * Where it lands
 * --------------
 * Screen positions are viewport fractions (-0.5..0.5 from the centre) so a
 * pose means the same thing at every aspect ratio. The hero pose is the one
 * exception: it is measured from the hero's empty placeholder slot in the DOM
 * so the model lands exactly where the grid puts it, at every breakpoint, and
 * is re-measured whenever ScrollTrigger refreshes.
 *
 * Phones, tablets and reduced-motion users never mount this; they get the
 * inline ComputationalCore in the hero instead.
 */

interface Pose {
  /** Model centre as a fraction of the viewport, origin at the centre. */
  fx: number;
  fy: number;
  /** Model depth. Negative recedes. */
  mz: number;
  /** Model rotation in radians. */
  rx: number;
  ry: number;
  rz: number;
  /** Scale multiplier on the measured hero size. */
  s: number;
  /** Camera distance and height, and the height it looks at. */
  cz: number;
  cy: number;
  ly: number;
  /** Weights for the cursor parallax and the idle float, 0..1. */
  parallax: number;
  float: number;
}

type PoseName = "hero" | "aboutHead" | "aboutGrid" | "skills" | "projects" | "exit";

const POSES: Record<PoseName, Pose> = {
  // Front-facing in the hero's right column. fx/fy/s are measured at runtime.
  hero: { fx: 0.24, fy: 0.02, mz: 0, rx: 0, ry: 0, rz: 0, s: 1, cz: HERO_CAMERA_Z, cy: 0, ly: 0, parallax: 1, float: 1 },
  // Behind the "ABOUT ME." heading: camera dollies in and drops slightly so
  // it looks up at the bust, which turns to a three-quarter angle.
  aboutHead: { fx: 0, fy: 0.05, mz: 0.25, rx: 0.06, ry: -0.62, rz: 0.03, s: 1.3, cz: 4.15, cy: -0.28, ly: 0.18, parallax: 0.4, float: 0.6 },
  // Drifts right, behind the frosted domain cards, turned the other way.
  aboutGrid: { fx: 0.27, fy: -0.03, mz: 0, rx: -0.04, ry: 0.55, rz: -0.03, s: 1.06, cz: HERO_CAMERA_Z, cy: 0.1, ly: -0.04, parallax: 0.25, float: 0.5 },
  // Supporting position in the left margin while the skill cards stack.
  skills: { fx: -0.34, fy: 0.08, mz: -0.3, rx: 0.05, ry: 0.95, rz: 0.04, s: 0.9, cz: 4.8, cy: 0, ly: 0, parallax: 0.15, float: 0.5 },
  // Recedes to the lower-left corner so the project showcases lead.
  projects: { fx: -0.38, fy: -0.27, mz: -0.8, rx: 0.08, ry: 1.25, rz: 0.06, s: 0.62, cz: 5.2, cy: 0.15, ly: 0, parallax: 0, float: 0.4 },
  // Slips off the bottom-left edge as the contact section arrives.
  exit: { fx: -0.55, fy: -0.55, mz: -1.2, rx: 0.1, ry: 1.6, rz: 0.1, s: 0.4, cz: 5.6, cy: 0.2, ly: 0, parallax: 0, float: 0 },
};

/** A sweep from the previous pose to `to`, scrubbed over a scroll range. */
interface Segment {
  to: PoseName;
  trigger: string;
  start: string;
  end: string;
}

const SEGMENTS: Segment[] = [
  { to: "aboutHead", trigger: "#about", start: "top 95%", end: "top 10%" },
  { to: "aboutGrid", trigger: '[data-scene-anchor="about-grid"]', start: "top 90%", end: "top 30%" },
  { to: "skills", trigger: "#services", start: "top bottom", end: "top 15%" },
  { to: "projects", trigger: "#projects", start: "top bottom", end: "top top" },
  { to: "exit", trigger: "#contact", start: "top bottom", end: "top 45%" },
];

/** Shared between the scroll triggers (writers) and the render loop (reader). */
interface Choreography {
  hero: Pose;
  /** Progress 0..1 through each segment, in scroll order. */
  segments: { p: number }[];
  /** Model scale that makes it fill the hero slot, from the slot's measured height. */
  k: number;
}

const POSE_KEYS = Object.keys(POSES.hero) as (keyof Pose)[];

/** Per-property damping rates: rotation carries more inertia than position. */
const LAMBDA: Record<keyof Pose, number> = {
  fx: 5, fy: 5, mz: 5,
  rx: 3.5, ry: 3.5, rz: 3.5,
  s: 5,
  cz: 4, cy: 4, ly: 4,
  parallax: 5, float: 5,
};

function resolveTarget(choreo: Choreography, out: Pose) {
  let from: Pose = choreo.hero;
  let to: Pose = choreo.hero;
  let p = 0;
  for (let i = 0; i < SEGMENTS.length; i++) {
    const sp = choreo.segments[i].p;
    if (sp <= 0) break;
    from = i === 0 ? choreo.hero : POSES[SEGMENTS[i - 1].to];
    to = POSES[SEGMENTS[i].to];
    p = sp;
  }
  // Smoothstep so each sweep eases in and out of its section boundary.
  const e = p * p * (3 - 2 * p);
  for (const key of POSE_KEYS) {
    out[key] = from[key] + (to[key] - from[key]) * e;
  }
}

const FOV_TAN = Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV) / 2);

// ── Render loop: damps the live scene towards the resolved pose ──
function Choreographer({
  choreoRef,
  isLight,
  onReady,
}: {
  choreoRef: React.RefObject<Choreography | null>;
  isLight: boolean;
  onReady: () => void;
}) {
  const model = useRef<THREE.Group>(null);
  const shadow = useRef<THREE.Group>(null);
  // Starts slightly small so the bust settles into place as it fades in.
  const current = useRef<Pose>({ ...POSES.hero, s: 0.82 });
  const target = useRef<Pose>({ ...POSES.hero });
  const pointer = useRef({ x: 0, y: 0 });
  const parallaxRot = useRef({ x: 0, y: 0 });
  const time = useRef(0);

  // The canvas ignores pointer events so the page underneath stays usable,
  // which means the cursor has to be tracked at the window.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    if (!model.current || !shadow.current || !choreoRef.current) return;
    // A long frame after a tab switch would otherwise fling the damping.
    const dt = Math.min(delta, 1 / 20);
    time.current += dt;

    const cur = current.current;
    const tgt = target.current;
    resolveTarget(choreoRef.current, tgt);
    for (const key of POSE_KEYS) {
      cur[key] = THREE.MathUtils.damp(cur[key], tgt[key], LAMBDA[key], dt);
    }

    // Cursor parallax has its own, slower inertia.
    const pr = parallaxRot.current;
    pr.x = THREE.MathUtils.damp(pr.x, -pointer.current.y * 0.22 * cur.parallax, 4, dt);
    pr.y = THREE.MathUtils.damp(pr.y, pointer.current.x * 0.35 * cur.parallax, 4, dt);

    // Viewport fractions -> world units at the model's depth.
    const { width, height } = state.size;
    const k = (choreoRef.current?.k ?? 0.5) * cur.s;
    const worldH = 2 * FOV_TAN * (cur.cz - cur.mz);
    const worldW = worldH * (width / height);
    const mx = cur.fx * worldW;
    const my = cur.fy * worldH;
    const floatY = Math.sin(time.current * 1.6) * 0.06 * k * cur.float;

    model.current.position.set(mx, my + floatY, cur.mz);
    model.current.rotation.set(cur.rx + pr.x, cur.ry + pr.y, cur.rz);
    model.current.scale.setScalar(k);

    // The shadow follows position and size but not rotation or float, so it
    // reads as a ground plane the bust hovers over.
    shadow.current.position.set(mx, my + MODEL_BASE_Y * k, cur.mz);
    shadow.current.scale.setScalar(k);

    state.camera.position.set(0, cur.cy, cur.cz);
    state.camera.lookAt(0, cur.ly, 0);
  });

  return (
    <>
      <Bust ref={model} onReady={onReady} />
      <GroundShadow ref={shadow} isLight={isLight} />
    </>
  );
}

// ── Fixed canvas + scroll triggers ──
export function ScrollScene() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const isLight = useTheme() === "light";
  // Rendering stops once the exit sweep has faded the canvas out, so a reader
  // lingering on the contact form is not paying for an invisible bust.
  const [active, setActive] = useState(true);

  const choreoRef = useRef<Choreography>({
    hero: { ...POSES.hero },
    segments: SEGMENTS.map(() => ({ p: 0 })),
    k: 0.5,
  });

  const { contextSafe } = useGSAP(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Hero pose from the placeholder slot's document position, i.e. where it
    // sits in the viewport at scroll 0. The slot is above every pin, so pin
    // spacing never shifts it.
    const measure = () => {
      const slot = document.querySelector<HTMLElement>('[data-scene-slot="hero"]');
      if (!slot) return;
      const W = wrapper.clientWidth;
      const H = wrapper.clientHeight;
      if (!W || !H) return;
      const r = slot.getBoundingClientRect();
      const top = r.top + window.scrollY;
      const hero = choreoRef.current.hero;
      hero.fx = (r.left + r.width / 2) / W - 0.5;
      hero.fy = 0.5 - (top + r.height / 2) / H;
      choreoRef.current.k = r.height / H;
    };
    measure();
    ScrollTrigger.addEventListener("refreshInit", measure);

    // One scrub per section boundary. Each only writes its own progress, so
    // the render loop, not GSAP, decides which sweep is current — robust to
    // refreshes and to triggers being created in any order.
    SEGMENTS.forEach((segment, i) => {
      const trigger = document.querySelector(segment.trigger);
      if (!trigger) return;
      gsap.to(choreoRef.current.segments[i], {
        p: 1,
        ease: "none",
        scrollTrigger: {
          trigger,
          start: segment.start,
          end: segment.end,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });

    // Exit: fade the whole canvas as the contact section arrives, then stop
    // rendering. `will-change` is only held while this scrub is live.
    const contact = document.querySelector("#contact");
    if (contact) {
      gsap.to(wrapper, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: contact,
          start: "top bottom",
          end: "top 45%",
          scrub: true,
          onToggle: (self) => {
            wrapper.style.willChange = self.isActive ? "opacity" : "";
          },
          onLeave: () => setActive(false),
          onEnterBack: () => setActive(true),
        },
      });
    }

    return () => ScrollTrigger.removeEventListener("refreshInit", measure);
  });

  const handleReady = useCallback(
    () =>
      contextSafe(() => {
        setSceneStatus("ready");
        gsap.to(introRef.current, { opacity: 1, duration: 1.2, ease: "power2.out" });
      })(),
    [contextSafe]
  );

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    >
      <div ref={introRef} className="w-full h-full opacity-0">
        {/* On failure the hero slot shows the static graphic; nothing belongs here. */}
        <CanvasErrorBoundary fallback={null} onError={() => setSceneStatus("failed")}>
          <Canvas
            camera={{ position: [0, 0, HERO_CAMERA_Z], fov: CAMERA_FOV }}
            dpr={[1, 2]}
            frameloop={active ? "always" : "never"}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
            className="w-full h-full pointer-events-none"
            style={{ pointerEvents: "none" }}
          >
            <StudioLights isLight={isLight} isMobile={false} />
            <Suspense fallback={null}>
              <Choreographer choreoRef={choreoRef} isLight={isLight} onReady={handleReady} />
              <FluidPlanesScene />
            </Suspense>
          </Canvas>
        </CanvasErrorBoundary>
      </div>
    </div>
  );
}
