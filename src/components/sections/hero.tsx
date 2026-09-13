"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { ArrowDownRight, ArrowUpRight, Download } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { CVLink } from "@/components/cv-link";
import { CanvasFallback } from "@/components/3d/canvas-fallback";
import { RevealItem, RevealText } from "@/components/motion/reveal";
import { gsap, useGSAP } from "@/lib/gsap";
import { getLenis, scrollToTarget } from "@/lib/lenis";
import { useSceneMode, useSceneStatus } from "@/lib/scene-store";
import { MOTION_OK } from "@/lib/use-media-query";

// The inline canvas, for viewports that do not get the fixed scroll scene.
const ComputationalCore = dynamic(
  () =>
    import("@/components/3d/computational-core").then(
      (mod) => mod.ComputationalCore
    ),
  { ssr: false, loading: () => <LoadingPulse /> }
);

function LoadingPulse() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-purple-500/20 to-fuchsia-500/10 blur-2xl animate-pulse" />
    </div>
  );
}

const techStack = [
  "Python",
  "C",
  "C++",
  "MySQL",
  "HTML",
  "Git & GitHub",
  "Prompt Engineering",
  "Generative AI",
  "TypeScript",
  "React",
  "Next.js",
  "Supabase",
];

// Magnetic Pull Pill Button with Shimmer Overlay
function MagneticPillButton({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 180, mass: 0.1 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    mouseX.set((clientX - centerX) * 0.3);
    mouseY.set((clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="inline-block"
    >
      <button onClick={onClick} className={`relative overflow-hidden ${className}`}>
        {children}
        <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.22)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </button>
    </motion.div>
  );
}

/**
 * The slot the bust occupies in the hero grid.
 *
 * On desktop it is deliberately empty: the fixed ScrollScene measures this
 * box and draws the model exactly here, then carries it off through the page.
 * Phones, tablets and reduced-motion users get the canvas inline instead.
 */
function SceneSlot() {
  const mode = useSceneMode();
  const status = useSceneStatus();

  let content: React.ReactNode = null;
  if (mode === "inline") {
    content = (
      <RevealItem className="w-full h-full" trigger="mount" delay={0.2}>
        <ComputationalCore className="w-full h-full" />
      </RevealItem>
    );
  } else if (mode === "fallback" || (mode === "fixed" && status === "failed")) {
    content = <CanvasFallback />;
  } else if (mode === "pending" || status === "loading") {
    content = <LoadingPulse />;
  }

  return (
    <div
      data-scene-slot="hero"
      className="w-full max-w-[440px] aspect-square relative flex items-center justify-center"
    >
      {content}
    </div>
  );
}

/**
 * Tech-stack marquee driven by GSAP so its speed can follow scroll velocity:
 * a fast flick of the wheel whips the ticker along, and it eases back to its
 * idle pace when the page rests.
 */
function TechMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const hovered = useRef(false);

  useGSAP(() => {
    const track = trackRef.current;
    if (!track) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      // Three copies of the list; shifting by one copy loops seamlessly.
      const loop = gsap.to(track, {
        xPercent: -100 / 3,
        ease: "none",
        duration: 32,
        repeat: -1,
      });
      let speed = 1;
      const tick = () => {
        const velocity = Math.abs(getLenis()?.velocity ?? 0);
        const target = hovered.current ? 0 : 1 + gsap.utils.clamp(0, 3, velocity / 25);
        speed += (target - speed) * 0.08;
        loop.timeScale(speed);
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    });
  });

  return (
    <div
      className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      onMouseEnter={() => (hovered.current = true)}
      onMouseLeave={() => (hovered.current = false)}
    >
      <div ref={trackRef} className="flex w-max items-center gap-8 py-3 will-change-transform">
        {[...techStack, ...techStack, ...techStack].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-8 text-xs sm:text-sm font-medium tracking-wide text-fg-secondary hover:text-fg transition-colors whitespace-nowrap"
          >
            <span>{item}</span>
            <span className="text-line-strong">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) scrollToTarget(el);
  };

  return (
    <section
      id="hero"
      className="relative min-h-[92dvh] w-full flex flex-col justify-between pt-32 sm:pt-40 md:pt-44 pb-12 sm:pb-16 md:pb-24 overflow-hidden"
    >
      {/* Soft Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-radial from-ambient-1 via-ambient-2 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[450px] h-[450px] bg-radial from-ambient-2 via-ambient-1 to-transparent blur-3xl pointer-events-none z-0" />

      {/* Main Hero Container */}
      <div className="relative max-w-6xl mx-auto w-full px-6 md:px-12 flex-1 flex flex-col justify-start pt-12 sm:pt-16 md:pt-0 md:justify-center z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Kinetic Typography — masked line reveals on load */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            {/* Domain Tag */}
            <RevealItem trigger="mount" delay={0.1} className="mb-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-fill border border-line text-xs font-medium tracking-wide text-fg-soft">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-fuchsia-400" />
                <span>B.Tech CSE (AI &amp; ML) Student</span>
              </span>
            </RevealItem>

            {/* Massive Bold Greeting */}
            <RevealText
              as="h1"
              trigger="mount"
              delay={0.25}
              stagger={0.12}
              className="font-display text-[clamp(2.5rem,11.5vw,3rem)] sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-fg leading-[0.95] mb-6"
              lines={[
                "HI, I’M",
                <span
                  key="name"
                  className="text-transparent bg-clip-text bg-gradient-to-r from-heading-from via-heading-via to-heading-to"
                >
                  SOFIYAN.
                </span>,
              ]}
            />

            {/* Clear, Human-Readable Subheading */}
            <RevealItem
              as="p"
              trigger="mount"
              delay={0.55}
              className="text-base sm:text-lg md:text-xl text-fg-secondary font-normal leading-relaxed max-w-xl mb-10"
            >
              B.Tech CSE (AI &amp; ML) Hons. student specializing in Generative AI with IBM. I learn by building — writing C, C++ and Python for the fundamentals, and shipping real web applications on top of them.
            </RevealItem>

            {/* Action Buttons with Magnetic Pull */}
            <RevealItem trigger="mount" delay={0.7} className="flex flex-wrap items-center gap-4">
              <MagneticPillButton
                onClick={() => scrollToSection("projects")}
                className="pill-btn pill-btn-primary group"
              >
                <span>Explore Work</span>
                <ArrowDownRight size={16} className="group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
              </MagneticPillButton>

              <MagneticPillButton
                onClick={() => scrollToSection("contact")}
                className="pill-btn pill-btn-secondary group"
              >
                <span>Contact Me</span>
                <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </MagneticPillButton>

              <CVLink location="hero" className="pill-btn pill-btn-secondary group">
                <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
                <span>Download CV</span>
              </CVLink>
            </RevealItem>
          </div>

          {/* Right: 3D Centerpiece (drawn here by the fixed scene on desktop) */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[260px] sm:min-h-[340px] lg:min-h-[480px]">
            <SceneSlot />
          </div>

        </div>
      </div>

      {/* Clean Monochrome Tech Stack Marquee */}
      <div className="w-full mt-20 pt-8 border-t border-line-faint overflow-hidden z-10 select-none">
        <div className="max-w-6xl mx-auto px-6 mb-3 text-center">
          <span className="text-[11px] uppercase tracking-widest text-fg-muted font-medium">
            Languages, Tools &amp; Currently Learning
          </span>
        </div>
        <TechMarquee />
      </div>
    </section>
  );
}
