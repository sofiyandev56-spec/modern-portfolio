"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { ArrowDownRight, ArrowUpRight, Download } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Dynamically load the Three.js 3D computational core
const ComputationalCore = dynamic(
  () =>
    import("@/components/3d/computational-core").then(
      (mod) => mod.ComputationalCore
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[360px] flex items-center justify-center">
        <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-purple-500/20 to-fuchsia-500/10 blur-2xl animate-pulse" />
      </div>
    ),
  }
);

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

// Magnetic Pull Pill Button with Mount Scale-Up & Shimmer Overlay
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
      className="inline-block"
    >
      <button onClick={onClick} className={`relative overflow-hidden ${className}`}>
        {children}
        <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.22)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </button>
    </motion.div>
  );
}

export function Hero() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const winWithLenis = window as unknown as { __lenis?: { scrollTo: (target: Element, opts: { offset: number; duration: number }) => void } };
      if (winWithLenis.__lenis) {
        winWithLenis.__lenis.scrollTo(el, { offset: 0, duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section
      id="hero"
      className="relative min-h-[92dvh] w-full flex flex-col justify-between pt-32 sm:pt-40 md:pt-44 pb-12 sm:pb-16 md:pb-24 overflow-hidden bg-[#09090b]"
    >
      {/* Soft Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-radial from-purple-600/15 via-fuchsia-600/5 to-transparent blur-3xl pointer-events-none z-0" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[450px] h-[450px] bg-radial from-blue-600/10 via-purple-600/5 to-transparent blur-3xl pointer-events-none z-0" />

      {/* Main Hero Container */}
      <div className="relative max-w-6xl mx-auto w-full px-6 md:px-12 flex-1 flex flex-col justify-start pt-12 sm:pt-16 md:pt-0 md:justify-center z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Punchy Typography & Motion Storytelling */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col items-start z-10"
          >
            {/* Domain Tag */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium tracking-wide text-zinc-300 mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-fuchsia-400" />
              <span>B.Tech CSE (AI &amp; ML) Student</span>
            </motion.div>

            {/* Massive Bold Greeting */}
            <motion.h1
              variants={itemVariants}
              className="font-display text-[clamp(2.5rem,11.5vw,3rem)] sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-[0.95] mb-6"
            >
              HI, I&apos;M <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                SOFIYAN.
              </span>
            </motion.h1>

            {/* Clear, Human-Readable Subheading */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-zinc-400 font-normal leading-relaxed max-w-xl mb-10"
            >
              B.Tech CSE (AI &amp; ML) Hons. student specializing in Generative AI with IBM. I learn by building — writing C, C++ and Python for the fundamentals, and shipping real web applications on top of them.
            </motion.p>

            {/* Action Buttons with Magnetic Pull */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-4"
            >
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

              <a
                href="/sofiyan-shaikh-cv.pdf"
                target="_blank"
                rel="noreferrer"
                className="pill-btn pill-btn-secondary group"
              >
                <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
                <span>Download CV</span>
              </a>
            </motion.div>

          </motion.div>

          {/* Right: 3D Holographic Centerpiece */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:col-span-5 relative flex items-center justify-center min-h-[260px] sm:min-h-[340px] lg:min-h-[480px]"
          >
            <div className="w-full max-w-[440px] aspect-square relative flex items-center justify-center">
              <ComputationalCore className="w-full h-full" />
            </div>
          </motion.div>

        </div>
      </div>

      {/* Clean Monochrome Tech Stack Marquee */}
      <div className="w-full mt-20 pt-8 border-t border-white/5 overflow-hidden z-10 select-none">
        <div className="max-w-6xl mx-auto px-6 mb-3 text-center">
          <span className="text-[11px] uppercase tracking-widest text-zinc-500 font-medium">
            Languages, Tools &amp; Currently Learning
          </span>
        </div>

        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-marquee-left flex items-center gap-8 py-3">
            {[...techStack, ...techStack, ...techStack].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-8 text-xs sm:text-sm font-medium tracking-wide text-zinc-400 hover:text-white transition-colors whitespace-nowrap"
              >
                <span>{item}</span>
                <span className="text-zinc-700">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
