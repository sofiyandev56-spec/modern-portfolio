"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    number: "01",
    title: "COMPUTER VISION & EDGE AI",
    description:
      "Real-time spatial tracking, driver drowsiness detection, facial landmark regression, and sub-20ms embedded camera pipelines.",
    tags: ["OpenCV", "MediaPipe", "ESP32-CAM", "Edge Inference"],
  },
  {
    number: "02",
    title: "MACHINE LEARNING & DEEP LEARNING",
    description:
      "Custom neural network training, model quantization (INT8/FP16), weight pruning, and high-throughput inference optimization.",
    tags: ["PyTorch", "TensorRT", "CUDA", "Model Pruning"],
  },
  {
    number: "03",
    title: "GENERATIVE AI & LLMS",
    description:
      "High-recall RAG pipelines, fine-tuned foundational models, autonomous multi-agent systems, and vector embedding workflows.",
    tags: ["LangChain", "Vector DBs", "Fine-Tuning", "Agent Workflows"],
  },
  {
    number: "04",
    title: "FULL-STACK & HARDWARE INTEGRATION",
    description:
      "High-throughput web architectures, sensor telemetry pipelines, and end-to-end edge-to-cloud deployments.",
    tags: ["Next.js", "FastAPI", "MQTT", "NVIDIA Jetson"],
  },
];

export function Services() {
  return (
    <section
      id="services"
      className="relative w-full min-h-screen flex flex-col justify-center py-32 md:py-40 lg:py-48 bg-[#09090b] border-t border-white/5 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 w-full my-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 pb-8 border-b border-white/10 gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium tracking-wide text-zinc-400 mb-6">
              <span>Core Disciplines</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white">
              SERVICES & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                CAPABILITIES.
              </span>
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-base md:text-lg text-zinc-400 leading-relaxed">
              Specialized engineering domains combining mathematical model design, low-latency edge deployment, and production-grade software.
            </p>
          </div>
        </div>

        {/* Clean Numbered List with Scroll Reveal and Spring Hover */}
        <div className="divide-y divide-white/10 border-b border-white/10">
          {services.map((item, idx) => (
            <motion.div
              key={item.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.6,
                delay: idx * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover="hover"
              className="py-10 md:py-14 px-4 sm:px-8 rounded-2xl transition-colors duration-300 hover:bg-white/[0.03] flex flex-col lg:flex-row lg:items-center justify-between gap-8 md:gap-16 group cursor-pointer"
            >
              {/* Number and Title */}
              <div className="flex items-baseline gap-6 sm:gap-8 lg:w-5/12">
                <motion.span
                  variants={{
                    hover: { x: 6, color: "#c084fc" },
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="font-mono text-sm sm:text-base font-bold text-zinc-500 transition-colors"
                >
                  {item.number}
                </motion.span>
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <div className="lg:w-4/12">
                <p className="text-base md:text-lg leading-relaxed text-zinc-400 max-w-xl">
                  {item.description}
                </p>
              </div>

              {/* Technology Tags & Spring Animated Arrow */}
              <div className="lg:w-3/12 flex items-center justify-between lg:justify-end gap-5">
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-xs px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <motion.div
                  variants={{
                    hover: {
                      rotate: 45,
                      borderColor: "rgba(168, 85, 247, 0.4)",
                      backgroundColor: "rgba(168, 85, 247, 0.15)",
                      color: "#ffffff",
                    },
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-11 h-11 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-zinc-400 transition-colors shrink-0"
                >
                  <ArrowUpRight size={20} />
                </motion.div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
