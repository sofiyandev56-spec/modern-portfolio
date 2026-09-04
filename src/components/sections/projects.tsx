"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronDown, ExternalLink, ShieldCheck, Activity, Cpu, Sparkles } from "lucide-react";
import { GitHubIcon } from "@/components/icons";

interface ProjectItem {
  id: string;
  number: string;
  title: string;
  category: string;
  tagline: string;
  overview: string;
  impact: string;
  metrics: { label: string; value: string }[];
  technologies: string[];
  github: string;
  demo?: string;
  visualType: "smartdrive" | "spatial" | "edgetensor" | "neural";
}

const projectData: ProjectItem[] = [
  {
    id: "smartdrive",
    number: "01",
    title: "SMARTDRIVE",
    category: "Edge AI / Computer Vision / IoT",
    tagline: "Driver Drowsiness Detection & Edge Fleet Safety System",
    overview:
      "Autonomous edge AI system designed for real-time operator state monitoring using facial landmark regression and ocular aspect tracking.",
    impact:
      "Executes locally on ARM/ESP32 edge hardware under 18ms latency with 98.4% detection precision, triggering instant audible alarms and CAN-bus telemetry.",
    metrics: [
      { label: "Inference Latency", value: "< 18ms" },
      { label: "Detection Precision", value: "98.4%" },
      { label: "Target Architecture", value: "ARM / ESP32" },
    ],
    technologies: ["Python", "OpenCV", "MediaPipe", "ESP32-CAM", "MQTT", "CAN-Bus"],
    github: "https://github.com/sofiyandev56-spec",
    visualType: "smartdrive",
  },
  {
    id: "spatial-ai",
    number: "02",
    title: "SPATIAL-AI",
    category: "Generative AI / Spatial Computing",
    tagline: "Multimodal LLM Pipeline for 3D Latent Environments",
    overview:
      "Research architecture connecting multimodal foundation models with real-time WebGL viewports, compiling natural language intents into procedural 3D geometric transformations.",
    impact:
      "Supports 128k context windows with low-latency streaming Server-Sent Events, rendering dynamic spatial data manifolds directly in the browser.",
    metrics: [
      { label: "Context Window", value: "128k Tokens" },
      { label: "Renderer", value: "Three.js / WebGL" },
      { label: "Pipeline", value: "Multi-Agent RAG" },
    ],
    technologies: ["TypeScript", "Three.js", "Next.js", "Vector DBs", "FastAPI"],
    github: "https://github.com/sofiyandev56-spec",
    visualType: "spatial",
  },
  {
    id: "edge-tensor",
    number: "03",
    title: "EDGE-TENSOR ACCELERATOR",
    category: "Edge Hardware / Model Compression",
    tagline: "INT8 Quantization Toolchain for Microcontrollers",
    overview:
      "Post-training quantization and structured filter pruning framework built to deploy PyTorch neural networks onto severely constrained silicon.",
    impact:
      "Compresses memory footprint down to <256KB RAM with deterministic execution at approximately 1.2W power draw without cloud tethering.",
    metrics: [
      { label: "RAM Footprint", value: "< 256 KB" },
      { label: "Quantization", value: "INT8 Fixed-Point" },
      { label: "Power Draw", value: "~1.2W" },
    ],
    technologies: ["PyTorch", "TensorFlow Lite Micro", "INT8", "C++20", "CMSIS-NN"],
    github: "https://github.com/sofiyandev56-spec",
    visualType: "edgetensor",
  },
  {
    id: "neural-cognition",
    number: "04",
    title: "NEURAL COGNITION EXPERIMENTS",
    category: "Machine Learning / Research",
    tagline: "Latent Manifold Drift & Loss Surface Profiling",
    overview:
      "Algorithmic research suite analyzing representations across deep transformer layers, evaluating topological manifold clustering and empirical optimization stability.",
    impact:
      "Demonstrates manifold drift trajectories using high-dimensional projection algorithms, providing clear diagnostic views into attention layer representations.",
    metrics: [
      { label: "Analysis Method", value: "UMAP / t-SNE" },
      { label: "Evaluation", value: "Representation Drift" },
      { label: "Compute Stack", value: "PyTorch & CUDA" },
    ],
    technologies: ["Python", "PyTorch", "NumPy", "CUDA", "SciPy", "UMAP"],
    github: "https://github.com/sofiyandev56-spec",
    visualType: "neural",
  },
];

export function Projects() {
  const [expandedId, setExpandedId] = useState<string>("smartdrive");

  const toggleProject = (id: string) => {
    setExpandedId(expandedId === id ? "" : id);
  };

  const renderVisualMockup = (type: ProjectItem["visualType"]) => {
    switch (type) {
      case "smartdrive":
        return (
          <div className="w-full h-full flex flex-col justify-between">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-purple-400" />
                <span className="text-xs font-medium text-white">Edge Fleet Safety System</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Online • 99.8%</span>
              </div>
            </div>

            {/* Middle Dashboard Content */}
            <div className="my-auto py-5 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-medium">Inference Velocity</div>
                <div className="text-2xl font-bold font-mono text-white">16.4 ms</div>
                <div className="text-[11px] text-purple-300">Local ARM Execution</div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
                <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-medium">Driver State</div>
                <div className="text-2xl font-bold font-mono text-emerald-400">Nominal</div>
                <div className="text-[11px] text-zinc-400">98.4% Confidence Score</div>
              </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-3 border-t border-white/10 font-mono">
              <span>CAN-Bus Telemetry Bridge</span>
              <span className="text-zinc-300">Zero Cloud Dependency</span>
            </div>
          </div>
        );

      case "spatial":
        return (
          <div className="w-full h-full flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-cyan-400" />
                <span className="text-xs font-medium text-white">3D Latent Workspace</span>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-mono text-cyan-400">
                WebGL 60 FPS
              </div>
            </div>

            <div className="my-auto py-5 flex items-center justify-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 flex items-center justify-center relative shadow-lg">
                <div className="w-10 h-10 rounded-lg border border-dashed border-white/40 animate-spin" style={{ animationDuration: "14s" }} />
              </div>
              <div className="space-y-1.5 text-left">
                <div className="text-xs font-mono text-white font-medium">128k Token Pipeline</div>
                <div className="text-[11px] text-zinc-400">Multi-Agent SSE Stream</div>
                <div className="text-[11px] text-cyan-300 font-mono">Dynamic Manifold Rendering</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-3 border-t border-white/10 font-mono">
              <span>Procedural Geometry</span>
              <span className="text-zinc-300">FastAPI Vector Backend</span>
            </div>
          </div>
        );

      case "edgetensor":
        return (
          <div className="w-full h-full flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Cpu size={16} className="text-purple-400" />
                <span className="text-xs font-medium text-white">Quantization Compressor</span>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[11px] font-mono text-purple-400">
                INT8 Fixed-Point
              </div>
            </div>

            <div className="my-auto py-5 space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-400">Memory Reduction</span>
                  <span className="text-white font-mono font-bold">4.2x Compaction</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                <span>Power: ~1.2W</span>
                <span className="text-emerald-400 font-mono font-medium">&lt;256KB RAM</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-3 border-t border-white/10 font-mono">
              <span>ARM CMSIS-NN Kernels</span>
              <span className="text-zinc-300">Zero Dynamic Heap</span>
            </div>
          </div>
        );

      case "neural":
        return (
          <div className="w-full h-full flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-fuchsia-400" />
                <span className="text-xs font-medium text-white">Manifold Clustering Visualizer</span>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-[11px] font-mono text-fuchsia-400">
                CUDA Accelerated
              </div>
            </div>

            <div className="my-auto py-5 flex items-center justify-around">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-xs font-mono text-purple-300 font-bold">
                  H0-7
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">Syntactic</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-14 h-14 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/40 flex items-center justify-center text-xs font-mono text-fuchsia-300 font-bold">
                  H8-15
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">Semantic</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-xs font-mono text-blue-300 font-bold">
                  H16-23
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">Contextual</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-3 border-t border-white/10 font-mono">
              <span>Representation Drift</span>
              <span className="text-zinc-300">UMAP / t-SNE</span>
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
              Expandable cards highlighting production systems, embedded machine learning, and generative architectures.
            </p>
          </div>
        </div>

        {/* Expandable Project Accordion */}
        <div className="space-y-6 md:space-y-8">
          {projectData.map((project) => {
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
                                System Overview
                              </div>
                              <p className="text-base text-zinc-200 leading-relaxed">
                                {project.overview}
                              </p>
                            </div>

                            <div>
                              <div className="text-xs uppercase tracking-widest text-zinc-500 font-medium mb-2">
                                Real-World Impact
                              </div>
                              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-medium">
                                {project.impact}
                              </p>
                            </div>

                            {/* Key Metrics Grid */}
                            <div className="grid grid-cols-3 gap-3 pt-2">
                              {project.metrics.map((m, mIdx) => (
                                <div key={mIdx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                  <div className="text-[10px] text-zinc-500 uppercase">{m.label}</div>
                                  <div className="text-sm font-bold text-white mt-1">{m.value}</div>
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

                              <a
                                href={project.github}
                                target="_blank"
                                rel="noreferrer"
                                className="pill-btn pill-btn-secondary py-2.5 px-5 text-xs font-semibold group"
                              >
                                <ExternalLink size={14} />
                                <span>Live Demo / Spec</span>
                              </a>
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

