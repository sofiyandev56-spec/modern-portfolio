"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronDown, ExternalLink, Lock, CalendarCheck, Boxes } from "lucide-react";
import { GitHubIcon } from "@/components/icons";
import { projects, type Project } from "@/data/projects";

export function Projects() {
  const [expandedId, setExpandedId] = useState<string>(projects[0].id);

  const toggleProject = (id: string) => {
    setExpandedId(expandedId === id ? "" : id);
  };

  const renderVisualMockup = (type: Project["visualType"]) => {
    switch (type) {
      case "happynest":
        return (
          <div className="w-full h-full flex flex-col justify-between">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <CalendarCheck size={16} className="text-purple-400" />
                <span className="text-xs font-medium text-white">Clinic Booking Portal</span>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[11px] font-mono text-purple-300">
                Mobile-First
              </div>
            </div>

            {/* Middle Content */}
            <div className="my-auto py-5 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-medium">Appointments</div>
                <div className="text-sm font-semibold text-white">Slot Scheduling</div>
                <div className="text-[11px] text-purple-300">Parent intake forms</div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-medium">Doctor View</div>
                <div className="text-sm font-semibold text-white">Sign-Off Queue</div>
                <div className="text-[11px] text-zinc-400">Immunization checklist</div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-3 border-t border-white/10 font-mono">
              <span>Supabase Auth &amp; Database</span>
              <span className="text-zinc-300">TanStack Start</span>
            </div>
          </div>
        );

      case "portfolio":
        return (
          <div className="w-full h-full flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Boxes size={16} className="text-cyan-400" />
                <span className="text-xs font-medium text-white">3D Scene &amp; Motion Layer</span>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-mono text-cyan-300">
                WebGL Canvas
              </div>
            </div>

            <div className="my-auto py-5 flex items-center justify-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 flex items-center justify-center shadow-lg">
                <div
                  className="w-10 h-10 rounded-lg border border-dashed border-white/40 animate-spin"
                  style={{ animationDuration: "14s" }}
                />
              </div>
              <div className="space-y-1.5 text-left">
                <div className="text-xs font-mono text-white font-medium">React Three Fiber</div>
                <div className="text-[11px] text-zinc-400">Custom 3D model + lighting</div>
                <div className="text-[11px] text-cyan-300 font-mono">Framer Motion transitions</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-3 border-t border-white/10 font-mono">
              <span>Next.js App Router</span>
              <span className="text-zinc-300">Typed End to End</span>
            </div>
          </div>
        );
    }
  };

  return (
    <section
      id="projects"
      className="relative w-full min-h-screen flex flex-col justify-center py-32 md:py-40 lg:py-48 bg-[#09090b] border-t border-white/5 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 w-full my-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 pb-8 border-b border-white/10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium tracking-wide text-zinc-400 mb-4">
              <span>Selected Work</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white">
              FEATURED <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                PROJECTS.
              </span>
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
              Two things I have actually built end to end — a clinic booking application and the site you are on right now.
            </p>
          </div>
        </div>

        {/* Expandable Project Accordion */}
        <div className="space-y-6 md:space-y-8">
          {projects.map((project) => {
            const isExpanded = expandedId === project.id;

            return (
              <motion.div
                key={project.id}
                layout
                transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                className={`rounded-2xl border transition-colors overflow-hidden ${
                  isExpanded
                    ? "border-white/20 bg-[#111115] shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                    : "border-white/10 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.03]"
                }`}
              >
                {/* Collapsed Header Bar */}
                <button
                  onClick={() => toggleProject(project.id)}
                  className="w-full p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-left cursor-pointer group"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-6 sm:gap-8">
                    {/* Index Number */}
                    <span className="font-mono text-sm font-bold text-zinc-500 group-hover:text-purple-400 transition-colors">
                      {project.number}
                    </span>

                    {/* Title & Category */}
                    <div>
                      <h3 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-white group-hover:text-purple-300 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-400 font-medium mt-1">
                        {project.category}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Pill */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                    <span
                      className={`text-xs font-semibold transition-colors ${
                        isExpanded ? "text-purple-400" : "text-zinc-400 group-hover:text-white"
                      }`}
                    >
                      {isExpanded ? "Collapse" : "View Project"}
                    </span>
                    <div
                      className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 ${
                        isExpanded
                          ? "border-purple-500/60 bg-purple-500/10 text-purple-400 rotate-180"
                          : "border-white/10 bg-white/[0.04] text-white group-hover:border-white/20"
                      }`}
                    >
                      <ChevronDown size={18} />
                    </div>
                  </div>
                </button>

                {/* Animated Expanded Details Drawer */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                      className="overflow-hidden border-t border-white/10"
                    >
                      <div className="p-8 md:p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                          
                          {/* Left: Overview, Impact, & Tech Pills (col-span-5) */}
                          <div className="lg:col-span-5 space-y-6">
                            <div>
                              <div className="text-xs uppercase tracking-widest text-zinc-500 font-medium mb-2">
                                Overview
                              </div>
                              <p className="text-base text-zinc-200 leading-relaxed">
                                {project.overview}
                              </p>
                            </div>

                            <div>
                              <div className="text-xs uppercase tracking-widest text-zinc-500 font-medium mb-2">
                                What It Does
                              </div>
                              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-medium">
                                {project.impact}
                              </p>
                            </div>

                            {/* At a Glance */}
                            <div className="grid grid-cols-3 gap-3 pt-2">
                              {project.facts.map((f, fIdx) => (
                                <div key={fIdx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                  <div className="text-[10px] text-zinc-500 uppercase">{f.label}</div>
                                  <div className="text-sm font-bold text-white mt-1">{f.value}</div>
                                </div>
                              ))}
                            </div>

                            {/* Technologies */}
                            <div className="pt-2">
                              <div className="flex flex-wrap gap-2">
                                {project.technologies.map((t, tIdx) => (
                                  <span
                                    key={tIdx}
                                    className="text-xs px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-zinc-300"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-2 flex flex-wrap items-center gap-4">
                              {project.github && (
                                <a
                                  href={project.github}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="pill-btn pill-btn-primary py-2.5 px-5 text-xs font-semibold group"
                                >
                                  <GitHubIcon size={15} />
                                  <span>GitHub Repo</span>
                                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </a>
                              )}

                              {project.demo && (
                                <a
                                  href={project.demo}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="pill-btn pill-btn-secondary py-2.5 px-5 text-xs font-semibold group"
                                >
                                  <ExternalLink size={14} />
                                  <span>Live Demo</span>
                                </a>
                              )}

                              {project.repoPrivate && (
                                <span className="inline-flex items-center gap-2 py-2.5 px-4 rounded-full border border-white/10 bg-white/[0.02] text-xs font-medium text-zinc-400">
                                  <Lock size={13} />
                                  <span>Private repository</span>
                                </span>
                              )}
                            </div>

                          </div>

                          {/* Right: Visual Mockup Container (col-span-7) */}
                          <div className="lg:col-span-7">
                            <motion.div
                              initial={{ scale: 0.96, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1], delay: 0.08 }}
                              className="rounded-xl border border-white/10 overflow-hidden aspect-video bg-zinc-900/60 p-6 sm:p-8 backdrop-blur-sm flex flex-col justify-between"
                            >
                              {renderVisualMockup(project.visualType)}
                            </motion.div>
                          </div>

                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
