"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, BrainCircuit, Code2, Database, Bike, Trophy, Activity } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// 3D Tilt Profile Card Component
function TiltProfileCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative w-full max-w-sm aspect-[4/5] rounded-3xl [perspective:1000px] cursor-pointer"
    >
      <div className="w-full h-full" style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </motion.div>
  );
}

export function About() {
  const domains = [
    {
      icon: BrainCircuit,
      title: "Generative AI",
      tag: "SPECIALIZATION",
      description:
        "My honours track, taken with IBM. Learning how foundation models are built, prompted and applied — and using them daily as a build partner.",
      floatingAnimation: {
        y: [0, -12, 0],
        rotate: [-1, 1, -1],
        transition: {
          duration: 4.2,
          ease: "easeInOut" as const,
          repeat: Infinity,
        },
      },
    },
    {
      icon: Code2,
      title: "Core Programming",
      tag: "FOUNDATIONS",
      description:
        "C, C++ and Python — the fundamentals I keep sharpening through data structures, algorithms and consistent problem solving.",
      floatingAnimation: {
        y: [0, 10, 0],
        rotate: [1, -1.5, 1],
        transition: {
          duration: 5.1,
          delay: 0.5,
          ease: "easeInOut" as const,
          repeat: Infinity,
        },
      },
    },
    {
      icon: Database,
      title: "Databases & The Web",
      tag: "BUILDING",
      description:
        "MySQL for structured data, HTML and modern JavaScript frameworks for the interface — put together in the projects below.",
      floatingAnimation: {
        y: [0, -8, 0],
        rotate: [-0.5, 1, -0.5],
        transition: {
          duration: 3.8,
          delay: 1.0,
          ease: "easeInOut" as const,
          repeat: Infinity,
        },
      },
    },
  ];

  const interests = [
    { icon: Trophy, label: "Cricket" },
    { icon: Bike, label: "Cycling" },
    { icon: Activity, label: "Football" },
  ];

  return (
    <section
      id="about"
      className="relative w-full min-h-screen flex flex-col justify-center py-32 md:py-40 lg:py-48 bg-[#09090b] border-t border-white/5 overflow-hidden"
    >
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-radial from-purple-900/15 via-fuchsia-900/5 to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium tracking-wide text-zinc-400 mb-6">
            <span>Who I Am &amp; How I Learn</span>
          </div>
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white mb-6">
            ABOUT ME.
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-zinc-300 font-normal leading-relaxed">
            I am a B.Tech Computer Science (AI &amp; ML) Hons. student on a Generative AI track with IBM. I am early in the journey and honest about that — what I have so far is a solid grip on C, C++, Python and MySQL, a habit of solving problems until they give way, and two applications I built end to end rather than only read about.
          </p>
        </div>

        {/* Centerpiece Layout: 3D Tilt Portrait & Floating Glass Domain Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-5xl mx-auto mb-20">
          
          {/* Left: 3D Tilt Portrait Glass Card */}
          <div className="lg:col-span-5 flex justify-center">
            <TiltProfileCard>
              <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 bg-[#121216] shadow-2xl group">
                <Image
                  src="/images/profile-about.png"
                  alt="Sofiyan Shaikh"
                  fill
                  priority
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-zinc-400 font-medium">Sofiyan Shaikh</div>
                    <div className="text-sm font-semibold text-white">B.Tech CSE (AI &amp; ML) Student</div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>
            </TiltProfileCard>
          </div>

          {/* Right: 3 Floating Domain Cards with Asynchronous Sinusoidal Drift */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {domains.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  animate={item.floatingAnimation}
                  className="glass-card p-6 md:p-7 flex items-start gap-5 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-purple-400 group-hover:border-purple-500/30 transition-colors shrink-0">
                    <Icon size={22} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                        {item.title}
                      </h3>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/10">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* Away From The Keyboard */}
        <div className="flex flex-col items-center gap-4 mb-16">
          <span className="text-[11px] uppercase tracking-widest text-zinc-500 font-medium">
            Away From The Keyboard
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {interests.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 text-sm font-medium text-zinc-300 hover:text-white hover:border-white/20 transition-colors"
                >
                  <Icon size={15} className="text-purple-400" />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="flex justify-center items-center gap-4">
          <a
            href="#contact"
            className="pill-btn pill-btn-primary group"
          >
            <span>Let&apos;s Talk</span>
            <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
          <a
            href="https://github.com/sofiyandev56-spec"
            target="_blank"
            rel="noreferrer"
            className="pill-btn pill-btn-secondary"
          >
            <span>GitHub Profile</span>
          </a>
        </div>

      </div>
    </section>
  );
}
