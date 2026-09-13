"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COARSE_OR_NARROW, REDUCED_MOTION, useMediaQuery } from "@/lib/use-media-query";
import { useTheme } from "@/lib/theme";
import { CanvasErrorBoundary } from "@/components/3d/canvas-fallback";
import {
  Bust,
  CanvasLoader,
  CAMERA_FOV,
  GroundShadow,
  HERO_CAMERA_Z,
  StudioLights,
} from "@/components/3d/scene-contents";

/**
 * The bust rendered inline inside the hero slot.
 *
 * This is the phone, tablet and reduced-motion presentation: the canvas is a
 * normal block in the hero grid, scrolls away with it, and stops rendering as
 * soon as it leaves the viewport. Desktop pointer devices use ScrollScene
 * instead, which draws the same model on a fixed canvas and choreographs it
 * through the page.
 */

// ── Idle motion: breathing float plus weighted cursor parallax ──
function ModelScene({ animate }: { animate: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const time = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current || !animate) return;
    const { pointer } = state;
    // Accumulate our own clock: the shared one resets when the loop is paused.
    time.current += delta;
    const t = time.current;

    // Subtle sinusoidal breathing / levitation
    const floatY = Math.sin(t * 1.6) * 0.06;

    // Interactive cursor parallax rotation
    const targetRotX = -pointer.y * 0.22;
    const targetRotY = pointer.x * 0.35;

    const g = groupRef.current;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetRotX, 4, delta);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetRotY, 4, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, floatY, 4, delta);
  });

  return <Bust ref={groupRef} />;
}

// ── Main Computational Core Component ──
export function ComputationalCore({ className = "" }: { className?: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Phone GPUs pay real battery and frame-rate cost for antialiasing, shadow
  // maps and a high-performance context, so scale the scene down on touch
  // devices. Decided once on mount: Canvas reads gl/dpr at creation time.
  const isMobile = useMediaQuery(COARSE_OR_NARROW);
  const reduceMotion = useMediaQuery(REDUCED_MOTION);
  const isLight = useTheme() === "light";

  // Only spend frames while the canvas is actually on screen.
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "80px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Reduced motion: render on demand, so the model is drawn once and then
  // only when the theme changes the lights.
  const frameloop = !inView ? "never" : reduceMotion ? "demand" : "always";

  return (
    <div ref={wrapperRef} className={`relative w-full h-full select-none ${className}`}>
      <CanvasErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, HERO_CAMERA_Z], fov: CAMERA_FOV }}
          dpr={isMobile ? [1, 1.5] : [1, 2]}
          frameloop={frameloop}
          gl={{
            antialias: !isMobile,
            alpha: true,
            powerPreference: isMobile ? "default" : "high-performance",
          }}
          className="w-full h-full"
        >
          <StudioLights isLight={isLight} isMobile={isMobile} />

          <Suspense fallback={<CanvasLoader />}>
            <ModelScene animate={!reduceMotion} />
            {!isMobile && <GroundShadow isLight={isLight} />}
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
