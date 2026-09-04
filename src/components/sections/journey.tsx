"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronRight, Target } from "lucide-react";
import { journeyMilestones, JourneyMilestone } from "@/data/journey";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function Journey() {
  const [selectedMilestone, setSelectedMilestone] = useState<JourneyMilestone>(
    journeyMilestones[0]
  );
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
      gsap.from(".journey-header", {
        y: 35,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".journey-header",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // 2. Continuous Scrubbed Timeline Laser Spine
      gsap.to(".journey-laser-spine", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".journey-years-col",
          start: "top 75%",
          end: "bottom 60%",
          scrub: 1,
        },
      });

      // 3. Progressive Year Selectors Entrance
      gsap.from(".journey-year-btn", {
        x: -30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      // 4. Milestone Details Card Entrance
      gsap.from(".journey-detail-card", {
        x: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="journey"
      ref={containerRef}
      className="relative w-full py-28 md:py-36 bg-[#0A0A0C] border-b border-[#26262E]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="journey-header flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[#1C1C22] gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#E024C3] tracking-widest uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E024C3]" />
              06 // TRAJECTORY & ROADMAP
            </div>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase">
              ENGINEERING <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#8F909A]">
                JOURNEY.
              </span>
            </h2>
          </div>
          <div className="max-w-md">
            <p className="font-mono text-xs sm:text-sm text-[#8F909A] leading-relaxed">
              Transparent timeline starting from 2026 foundations to 2030 strategic objectives. Clearly distinguishing current active progress from future engineering goals.
            </p>
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Year Selectors with Continuous Laser Spine */}
          <div className="journey-years-col lg:col-span-5 relative pl-4 sm:pl-6 space-y-3">
            
            {/* Continuous Scrubbed Timeline Spine Track */}
            <div className="absolute left-0 top-3 bottom-3 w-[2px] bg-[#1C1C22] rounded-full overflow-hidden">
              <div className="journey-laser-spine w-full h-full bg-gradient-to-b from-[#E024C3] via-[#7928CA] to-[#22C55E] origin-top scale-y-0" />
            </div>

            {journeyMilestones.map((m) => {
              const isSelected = selectedMilestone.year === m.year;
              const isActive = m.type === "ACTIVE FOUNDATION";

              return (
                <button
                  key={m.year}
                  onClick={() => setSelectedMilestone(m)}
                  className={`journey-year-btn w-full p-5 rounded-2xl border text-left transition-colors duration-200 flex items-center justify-between cursor-pointer group ${
                    isSelected
                      ? "bg-[#18181E] border-[#E024C3] shadow-[0_8px_30px_rgba(224,36,195,0.15)]"
                      : "bg-[#121216] border-[#26262E] hover:border-[#3A3A46]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Node status indicator */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0A0A0C] border border-[#26262E]">
                      {isActive ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse" />
                      ) : (
                        <Target size={14} className="text-[#8F909A] group-hover:text-[#E024C3] transition-colors" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-2xl font-black text-white">
                          {m.year}
                        </span>
                        <span className="font-mono text-[10px] text-[#5A5B66]">
                          {m.stage}
                        </span>
                      </div>
                      <div className="font-mono text-xs text-[#8F909A] uppercase tracking-wider">
                        {m.type}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase font-semibold ${
                        isActive
                          ? "bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30"
                          : "bg-white/5 text-[#8F909A] border border-white/10"
                      }`}
                    >
                      {m.status}
                    </span>
                    <ChevronRight
                      size={16}
                      className={`text-[#5A5B66] group-hover:text-white transition-transform ${
                        isSelected ? "rotate-90 text-[#E024C3]" : ""
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Focus Card */}
          <div className="journey-detail-card lg:col-span-7 neo-card p-8 md:p-10 border border-[#26262E] bg-[#121216] flex flex-col justify-between min-h-[460px]">
            <div>
              {/* Card Meta Header */}
              <div className="flex items-center justify-between border-b border-[#26262E] pb-4 mb-6">
                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white font-bold">
                    YEAR {selectedMilestone.year}
                  </span>
                  <span className="text-[#8F909A]">{"// "}{selectedMilestone.stage}</span>
                </div>
                <div
                  className={`font-mono text-xs uppercase px-3 py-1 rounded-full border ${
                    selectedMilestone.type === "ACTIVE FOUNDATION"
                      ? "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30"
                      : "bg-[#E024C3]/10 text-[#E024C3] border-[#E024C3]/30"
                  }`}
                >
                  {selectedMilestone.type}
                </div>
              </div>

              {/* Headline */}
              <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-4">
                {selectedMilestone.headline}
              </h3>

              {/* Description */}
              <p className="text-base text-[#8F909A] leading-relaxed mb-8">
                {selectedMilestone.description}
              </p>

              {/* Focus Pillars */}
              <div className="space-y-3 mb-8">
                <div className="font-mono text-xs text-white uppercase tracking-wider">
                  {"// CORE FOCUS & OBJECTIVES"}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedMilestone.focusAreas.map((area, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#0A0A0C] border border-[#26262E] flex items-center gap-2.5 text-xs text-white"
                    >
                      <span className="text-[#E024C3] font-bold font-mono">›</span>
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Status Ticker */}
            <div className="pt-6 border-t border-[#26262E] flex items-center justify-between font-mono text-xs text-[#5A5B66]">
              <span>VERIFIED MILESTONE SCHEMA</span>
              <span className="text-white">STATUS: {selectedMilestone.status.toUpperCase()}</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
