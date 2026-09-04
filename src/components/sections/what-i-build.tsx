"use client";

import React, { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { buildDomains } from "@/data/what-i-build";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function WhatIBuild() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);
  const [expandedIndex, setExpandedIndex] = useState<number>(0);
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
      gsap.from(".build-header", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".build-header",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // 2. Sequential Mechanical Inflow of Numbered Rows
      gsap.from(".build-row", {
        x: -35,
        y: 15,
        opacity: 0,
        stagger: 0.09,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".build-list",
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? -1 : idx);
  };

  return (
    <section
      id="build"
      ref={containerRef}
      className="relative w-full py-28 md:py-36 bg-[#0A0A0C] border-b border-[#26262E]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="build-header flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[#1C1C22] gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#E024C3] tracking-widest uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E024C3]" />
              04 // CAPABILITY MANIFOLD
            </div>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white uppercase">
              WHAT I <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#8F909A]">
                BUILD.
              </span>
            </h2>
          </div>
          <div className="max-w-md">
            <p className="font-mono text-xs sm:text-sm text-[#8F909A] leading-relaxed">
              Six computational domains focused on intelligent systems, high-speed perception, and embedded silicon.
            </p>
          </div>
        </div>

        {/* Interactive Numbered List / Accordion */}
        <div className="build-list border-t border-[#26262E]">
          {buildDomains.map((domain, idx) => {
            const isExpanded = expandedIndex === idx;
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={domain.number}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`build-row group border-b border-[#26262E] transition-colors duration-300 ${
                  isExpanded
                    ? "bg-[#121216]/60 border-l-2 border-l-[#E024C3]"
                    : isHovered
                    ? "bg-white/[0.02] border-l-2 border-l-[#E024C3]/50"
                    : ""
                }`}
              >
                {/* Header Row */}
                <button
                  onClick={() => toggleExpand(idx)}
                  className="w-full py-8 md:py-10 px-4 md:px-6 flex items-center justify-between text-left cursor-pointer transition-all"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-baseline gap-6 md:gap-12">
                    {/* Domain Index */}
                    <span className="font-mono text-xs sm:text-sm md:text-base font-bold text-[#8F909A] group-hover:text-[#E024C3] transition-colors">
                      {domain.number}
                    </span>

                    {/* Domain Title */}
                    <div>
                      <h3 className="font-display text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-white group-hover:translate-x-2 transition-transform duration-300">
                        {domain.title}
                      </h3>
                      <div className="hidden sm:block font-mono text-xs text-[#8F909A] mt-1.5">
                        {domain.subtitle}
                      </div>
                    </div>
                  </div>

                  {/* Interactive Toggle Pill */}
                  <div className="flex items-center gap-4">
                    <span className="hidden lg:inline-block font-mono text-[11px] text-[#5A5B66] uppercase px-3 py-1 rounded-full border border-transparent group-hover:border-[#26262E]">
                      {domain.metricsText}
                    </span>
                    <div
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center transition-all duration-300 ${
                        isExpanded
                          ? "bg-[#E024C3] border-[#E024C3] text-white rotate-45"
                          : "border-[#26262E] bg-[#121216] text-[#8F909A] group-hover:border-white group-hover:text-white"
                      }`}
                    >
                      <Plus size={18} />
                    </div>
                  </div>
                </button>

                {/* Expanded Information Drawer */}
                {isExpanded && (
                  <div className="px-4 md:px-6 pb-10 pt-2 transition-all">
                    <div className="max-w-5xl pl-0 sm:pl-16 md:pl-24 grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-t border-[#1C1C22] pt-6">
                      
                      {/* Left: Summary & Capabilities */}
                      <div className="md:col-span-7 space-y-4">
                        <p className="text-sm sm:text-base text-[#8F909A] leading-relaxed">
                          {domain.description}
                        </p>

                        <div className="space-y-2 pt-2">
                          <div className="font-mono text-[11px] text-white uppercase tracking-wider">
                            {"// CORE CAPABILITIES"}
                          </div>
                          {domain.capabilities.map((cap, cIdx) => (
                            <div key={cIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#8F909A]">
                              <span className="text-[#E024C3] font-bold">›</span>
                              <span>{cap}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Technologies & Stack Pills */}
                      <div className="md:col-span-5 flex flex-col justify-between h-full bg-[#0A0A0C] p-5 rounded-2xl border border-[#26262E]">
                        <div>
                          <div className="font-mono text-[11px] text-[#8F909A] uppercase tracking-wider mb-3">
                            TECHNOLOGY TOKENS
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {domain.technologies.map((tech, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-3 py-1 rounded-full bg-[#121216] border border-[#26262E] font-mono text-xs text-white"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-[#1C1C22] flex items-center justify-between text-[10px] font-mono text-[#5A5B66]">
                          <span>SPEC_COMPLIANCE</span>
                          <span className="text-[#22C55E]">OPTIMIZED FOR RUNTIME</span>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
