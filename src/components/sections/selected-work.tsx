"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Camera,
  Radio,
  ShieldCheck,
} from "lucide-react";
import { GitHubIcon } from "@/components/icons";
import { projects } from "@/data/projects";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SelectedWork() {
  const smartdrive = projects.find((p) => p.id === "smartdrive") || projects[0];
  const [activeSimulation, setActiveSimulation] = useState<"nominal" | "fatigue">("nominal");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Header Reveal
      gsap.from(".work-header", {
        y: 40,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".work-header",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // 2. Physical Docking: Left Specs Block & Right Telemetry Block
      gsap.from(".work-left-col", {
        x: -40,
        opacity: 0,
        duration: 0.95,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".work-left-col",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".work-right-col", {
        x: 40,
        opacity: 0,
        duration: 0.95,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".work-right-col",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // 3. Staggered Telemetry Metrics
      gsap.from(".work-metric-item", {
        y: 20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".work-left-col",
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });

      // 4. Subtle HUD Depth Parallax
      gsap.to(".hud-depth-element", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="work"
      ref={containerRef}
      className="relative w-full py-24 md:py-32 bg-[#0A0A0C] border-b border-[#26262E]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="work-header flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[#1C1C22] gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#E024C3] tracking-widest uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E024C3]" />
              02 // SELECTED WORK SHOWCASE
            </div>
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase">
              FLAGSHIP <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#8F909A]">
                ENGINEERING.
              </span>
            </h2>
          </div>
          <div className="max-w-md">
            <p className="font-mono text-xs sm:text-sm text-[#8F909A] leading-relaxed">
              Hardware-integrated computer vision system deployed at the edge to solve driver fatigue and fleet collision risks in real time.
            </p>
          </div>
        </div>

        {/* Flagship Feature Grid: SMARTDRIVE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Project Thesis & Technical Specs */}
          <div className="work-left-col lg:col-span-5 flex flex-col justify-between neo-card p-8 md:p-10 border border-[#26262E] bg-[#121216]">
            <div>
              {/* Category Pill */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <span className="px-3 py-1 rounded-full font-mono text-xs font-semibold tracking-wider bg-[#E024C3]/10 text-[#E024C3] border border-[#E024C3]/30">
                  {smartdrive.category}
                </span>
                <span className="font-mono text-xs text-[#8F909A]">
                  INDEX: 01
                </span>
              </div>

              {/* Title & Tagline */}
              <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-3">
                {smartdrive.title}
              </h3>
              <p className="font-mono text-xs sm:text-sm text-[#8F909A] uppercase tracking-wider mb-6">
                {smartdrive.tagline}
              </p>

              <p className="text-[#8F909A] text-sm leading-relaxed mb-8">
                {smartdrive.description}
              </p>

              {/* Engineering Metrics Matrix */}
              <div className="grid grid-cols-2 gap-4 py-6 border-y border-[#26262E] mb-8">
                {smartdrive.metrics?.map((metric, idx) => (
                  <div key={idx} className="work-metric-item flex flex-col">
                    <span className="font-mono text-[11px] text-[#5A5B66] uppercase">
                      {metric.label}
                    </span>
                    <span className="font-display text-xl sm:text-2xl font-bold text-white mt-1">
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Architecture Highlights */}
              <div className="space-y-3 mb-8">
                <div className="font-mono text-xs text-white uppercase tracking-wider">
                  {"// PIPELINE PHASES"}
                </div>
                {smartdrive.architecture?.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-[#8F909A]">
                    <span className="font-mono text-[#E024C3] font-bold">0{idx + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-[#26262E]">
              <a
                href={smartdrive.github}
                target="_blank"
                rel="noreferrer"
                className="neo-pill-primary sheen-effect flex items-center gap-2 px-6 py-3 font-mono text-xs font-bold tracking-wider group"
              >
                <GitHubIcon size={15} />
                <span>INSPECT REPO</span>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-[#26262E] font-mono text-[11px] text-[#8F909A]">
                <ShieldCheck size={13} className="text-[#22C55E]" />
                <span>CAN-BUS READY</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Fidelity Biometric Telemetry & HUD */}
          <div className="work-right-col lg:col-span-7 neo-card p-6 md:p-8 border border-[#26262E] bg-[#0E0E12] flex flex-col justify-between">
            
            {/* Top HUD Bar */}
            <div className="flex items-center justify-between border-b border-[#1C1C22] pb-4 mb-6">
              <div className="flex items-center gap-3 font-mono text-xs text-white">
                <Radio size={14} className="text-[#E024C3] animate-pulse" />
                <span>EDGE_TELEMETRY_FEED // ACTIVE</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSimulation("nominal")}
                  className={`px-3 py-1 rounded-full font-mono text-[11px] transition-all cursor-pointer ${
                    activeSimulation === "nominal"
                      ? "bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40"
                      : "text-[#8F909A] hover:text-white border border-[#26262E]"
                  }`}
                >
                  SIM: NOMINAL
                </button>
                <button
                  onClick={() => setActiveSimulation("fatigue")}
                  className={`px-3 py-1 rounded-full font-mono text-[11px] transition-all cursor-pointer ${
                    activeSimulation === "fatigue"
                      ? "bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40 animate-pulse"
                      : "text-[#8F909A] hover:text-white border border-[#26262E]"
                  }`}
                >
                  SIM: DROWSINESS
                </button>
              </div>
            </div>

            {/* Simulated Biometric Vision Mesh & HUD Canvas */}
            <div className="hud-depth-element relative aspect-video w-full rounded-xl border border-[#26262E] bg-[#070709] overflow-hidden p-6 flex flex-col justify-between">
              
              {/* Corner Reticles */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#E024C3]/70" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#E024C3]/70" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#E024C3]/70" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#E024C3]/70" />

              {/* Status Header inside HUD */}
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Camera size={13} className="text-[#8F909A]" />
                  <span className="text-[#8F909A]">IR_SENSOR: 60 FPS // 1080P</span>
                </div>
                <div className="flex items-center gap-2">
                  {activeSimulation === "nominal" ? (
                    <span className="text-[#22C55E] font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#22C55E]" /> DRIVER ALERT
                    </span>
                  ) : (
                    <span className="text-[#EF4444] font-bold flex items-center gap-1.5">
                      <AlertTriangle size={14} className="text-[#EF4444]" /> FATIGUE DETECTED
                    </span>
                  )}
                </div>
              </div>

              {/* Center Vector Schematic: Ocular Landmark & EAR Visualization */}
              <div className="relative my-auto flex flex-col items-center justify-center">
                <div className="relative w-48 h-32 flex items-center justify-around">
                  {/* Left Eye Bounding Landmark */}
                  <div
                    className={`relative w-18 h-10 border rounded-full flex items-center justify-center transition-all duration-300 ${
                      activeSimulation === "nominal"
                        ? "border-[#22C55E]/60 bg-[#22C55E]/5 scale-y-100"
                        : "border-[#EF4444] bg-[#EF4444]/15 scale-y-25"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full transition-all ${
                        activeSimulation === "nominal"
                          ? "bg-[#22C55E] opacity-80"
                          : "bg-[#EF4444] opacity-20 scale-50"
                      }`}
                    />
                    <span className="absolute -bottom-5 font-mono text-[9px] text-[#8F909A]">
                      P_OCULAR_L
                    </span>
                  </div>

                  {/* Right Eye Bounding Landmark */}
                  <div
                    className={`relative w-18 h-10 border rounded-full flex items-center justify-center transition-all duration-300 ${
                      activeSimulation === "nominal"
                        ? "border-[#22C55E]/60 bg-[#22C55E]/5 scale-y-100"
                        : "border-[#EF4444] bg-[#EF4444]/15 scale-y-25"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full transition-all ${
                        activeSimulation === "nominal"
                          ? "bg-[#22C55E] opacity-80"
                          : "bg-[#EF4444] opacity-20 scale-50"
                      }`}
                    />
                    <span className="absolute -bottom-5 font-mono text-[9px] text-[#8F909A]">
                      P_OCULAR_R
                    </span>
                  </div>
                </div>

                {/* EAR Math HUD Display */}
                <div className="mt-4 px-4 py-2 rounded-lg bg-black/60 border border-[#1C1C22] font-mono text-center">
                  <div className="text-[11px] text-[#8F909A]">
                    EAR CALCULATION: <span className="text-white">||p2-p6|| + ||p3-p5|| / 2||p1-p4||</span>
                  </div>
                  <div className="text-xs mt-1">
                    CURRENT VALUE:{" "}
                    <span
                      className={`font-bold ${
                        activeSimulation === "nominal"
                          ? "text-[#22C55E]"
                          : "text-[#EF4444] text-sm animate-pulse"
                      }`}
                    >
                      {activeSimulation === "nominal" ? "0.33 (THRESHOLD: > 0.22)" : "0.14 (DROWSINESS ALARM TRIGGERED)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Telemetry Bar */}
              <div className="flex items-center justify-between border-t border-[#1C1C22] pt-3 text-[10px] font-mono text-[#8F909A]">
                <span>LATENCY: 16.4ms</span>
                <span>INTR_BUZZER: {activeSimulation === "nominal" ? "STANDBY" : "ACTIVE (85dB)"}</span>
                <span>TELEMETRY_SYNC: 100%</span>
              </div>
            </div>

            {/* Hardware Stack Chips */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {smartdrive.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-md border border-[#26262E] bg-[#121216] text-[11px] font-mono text-[#8F909A]"
                >
                  {tech}
                </span>
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* Horizontal Telemetry Marquee Rail */}
      <div className="w-full mt-16 border-y border-[#1C1C22] bg-[#0E0E12] py-3 overflow-hidden select-none">
        <div className="animate-marquee-right flex items-center gap-8 text-xs font-mono text-[#8F909A] tracking-wider whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="text-white font-semibold">
                [SMARTDRIVE TELEMETRY]
              </span>
              <span>EAR_SCORE: 0.33</span>
              <span className="text-[#26262E]">•</span>
              <span>INFERENCE: 16.8MS</span>
              <span className="text-[#26262E]">•</span>
              <span>EDGE_ACCEL: ESP32/JETSON</span>
              <span className="text-[#26262E]">•</span>
              <span>CAN_BUS_SYNC: NOMINAL</span>
              <span className="text-[#E024C3]">{"///"}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
