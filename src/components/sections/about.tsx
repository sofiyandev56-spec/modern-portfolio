"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, Cpu, Eye, Zap } from "lucide-react";
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
      icon: Eye,
      title: "Spatial Perception",
      tag: "VISION",
      description:
        "High-framerate facial landmark regression and ocular geometry for real-time spatial monitoring.",
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
      icon: Zap,
      title: "Sub-20ms Inference",
      tag: "LATENCY",
      description:
        "Quantized INT8/FP16 models optimized for deterministic execution on resource-constrained compute.",
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
      icon: Cpu,
      title: "Constrained Silicon",
      tag: "HARDWARE",
      description:
        "Zero-cloud autonomous deployment on ESP32 and NVIDIA Jetson platforms with direct sensor integration.",
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
            <span>Identity & Engineering Philosophy</span>
          </div>
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white mb-6">
            ABOUT ME.
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-zinc-300 font-normal leading-relaxed">
            I engineer intelligent systems that bridge mathematical algorithms to physical silicon. With a focus on real-time computer vision, low-latency edge inference, and generative neural architectures, I build production-grade models that operate reliably without cloud dependency.
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
                    <div className="text-sm font-semibold text-white">AI/ML & Edge Engineer</div>
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
