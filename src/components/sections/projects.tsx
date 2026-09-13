"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Lock,
  Trophy,
  X,
  Sparkles,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { GitHubIcon } from "@/components/icons";
import { projects, type Project } from "@/data/projects";
import { registerFluidCard, updateFluidCardHover } from "@/lib/fluid-store";
import { RevealItem, RevealText } from "@/components/motion/reveal";
import { VelocitySkew } from "@/components/motion/velocity-skew";

/**
 * Rapid Number Tumbler transition for active card index
 */
function NumberTumbler({ current, total }: { current: number; total: number }) {
  const currentFormatted = String(current + 1).padStart(2, "0");
  const totalFormatted = String(total).padStart(2, "0");

  return (
    <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold tracking-widest text-fg">
      <span className="text-accent">[</span>
      <div className="relative h-5 w-6 overflow-hidden inline-flex items-center justify-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={currentFormatted}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center text-accent"
          >
            {currentFormatted}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-fg-muted">/</span>
      <span className="text-fg-secondary">{totalFormatted}</span>
      <span className="text-accent">]</span>
    </div>
  );
}

/**
 * Individual Card in the Inertial Horizontal Slider
 */
function ProjectSliderCard({
  project,
  index,
  activeIndex,
  onSelect,
  onOpenDetails,
}: {
  project: Project;
  index: number;
  activeIndex: number;
  onSelect: () => void;
  onOpenDetails: () => void;
}) {
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const isCenter = index === activeIndex;
  const dist = Math.abs(index - activeIndex);

  // Register image DOM element with WebGL FluidImagePlane
  useEffect(() => {
    const el = imageFrameRef.current;
    const imgUrl = project.images?.[0]?.src;
    if (!el || !imgUrl) return;

    const unregister = registerFluidCard({
      id: project.id,
      element: el,
      imageUrl: imgUrl,
    });

    return () => unregister();
  }, [project.id, project.images]);

  const handleMouseEnter = () => {
    updateFluidCardHover(project.id, true);
  };

  const handleMouseLeave = () => {
    updateFluidCardHover(project.id, false);
  };

  const primaryImage = project.images?.[0];

  const scale = isCenter ? 1 : Math.max(0.88, 1 - dist * 0.08);
  const translateZ = isCenter ? 0 : -Math.min(60, dist * 30);

  return (
    <div
      onClick={onSelect}
      className={`relative shrink-0 select-none transition-all duration-500 cursor-pointer ${
        isCenter ? "z-20 opacity-100" : "z-10 opacity-70 hover:opacity-90"
      }`}
      style={{
        width: "min(84vw, 760px)",
        transform: `perspective(1000px) scale(${scale}) translateZ(${translateZ}px)`,
        transformOrigin: "center center",
      }}
      data-cursor="view"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="glass-card rounded-2xl md:rounded-3xl p-5 sm:p-7 md:p-8 flex flex-col gap-6 shadow-[0_30px_70px_-25px_var(--shadow)] border border-line overflow-hidden group">
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-accent px-2.5 py-1 rounded-md bg-accent-soft border border-accent-line">
              {project.number}
            </span>
            {project.hackathon && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
                <Trophy size={12} />
                <span>{project.hackathon}</span>
              </span>
            )}
          </div>
          <span className="text-xs font-mono uppercase text-fg-muted tracking-wider hidden sm:inline-block">
            {project.category}
          </span>
        </div>

        {/* Media Frame (Tracked by FluidImagePlane WebGL Quad) */}
        <div
          ref={imageFrameRef}
          className="relative w-full aspect-[16/9] rounded-xl sm:rounded-2xl overflow-hidden bg-fill border border-line-faint shadow-inner"
        >
          {primaryImage ? (
            <Image
              src={primaryImage.src}
              alt={primaryImage.alt}
              fill
              sizes="(max-width: 768px) 85vw, 760px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              priority={index === 0}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-fg-muted">
              <Layers size={36} className="opacity-40" />
            </div>
          )}

          {/* Liquid hover shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />

          {/* Prompt to View Details */}
          <div className="absolute bottom-4 right-4 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails();
              }}
              data-magnetic
              className="px-3.5 py-1.5 rounded-full bg-fg/90 text-canvas font-medium text-xs flex items-center gap-1.5 shadow-lg backdrop-blur-md hover:bg-fg transition-all"
            >
              <span>Explore Case Study</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-fg group-hover:text-accent-text transition-colors">
              {project.title}
            </h3>
            <span className="text-xs sm:text-sm text-fg-secondary font-medium">
              {project.tagline}
            </span>
          </div>

          <p className="text-xs sm:text-sm md:text-base text-fg-secondary leading-relaxed line-clamp-2">
            {project.overview}
          </p>

          {/* Action Links & Tech Preview */}
          <div className="pt-3 border-t border-line flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 4).map((tech, tIdx) => (
                <span
                  key={tIdx}
                  className="text-[11px] px-2.5 py-0.5 rounded-md bg-fill border border-line text-fg-soft"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="text-[11px] px-2 py-0.5 rounded-md text-fg-muted">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  data-magnetic
                  className="p-2 rounded-full border border-line bg-fill hover:border-accent-line hover:text-accent transition-colors"
                  aria-label={`${project.title} GitHub repository`}
                >
                  <GitHubIcon className="w-4 h-4" />
                </a>
              )}

              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  data-magnetic
                  className="p-2 rounded-full border border-line bg-fill hover:border-accent-line hover:text-accent transition-colors"
                  aria-label={`${project.title} live demo`}
                >
                  <ExternalLink size={16} />
                </a>
              )}

              {project.repoPrivate && (
                <span
                  className="p-2 text-fg-muted cursor-help"
                  title="Client project repository is private"
                >
                  <Lock size={15} />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Full Case Study Modal Drawer
 */
function ProjectDetailsModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-md"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 24 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-canvas border border-line rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl z-10 custom-scrollbar"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          data-magnetic
          className="absolute top-6 right-6 p-2 rounded-full bg-fill border border-line text-fg-secondary hover:text-fg hover:border-accent-line transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="space-y-3 mb-8 pr-10">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-accent px-2.5 py-1 rounded bg-accent-soft border border-accent-line">
              {project.number}
            </span>
            <span className="text-xs font-mono uppercase text-fg-secondary">
              {project.category}
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase text-fg">
            {project.title}
          </h2>
          <p className="text-base sm:text-lg text-fg-secondary font-medium">
            {project.tagline}
          </p>
        </div>

        {/* Screenshots if multiple */}
        {project.images && project.images.length > 0 && (
          <div className="space-y-4 mb-8">
            <div className="rounded-2xl border border-line overflow-hidden bg-fill">
              <Image
                src={project.images[0].src}
                alt={project.images[0].alt}
                width={project.images[0].width}
                height={project.images[0].height}
                className="w-full h-auto object-cover"
              />
            </div>
            {project.highlight && (
              <figure className="rounded-2xl border border-line overflow-hidden bg-fill">
                <Image
                  src={project.highlight.src}
                  alt={project.highlight.alt}
                  width={project.highlight.width}
                  height={project.highlight.height}
                  className="w-full h-auto object-cover"
                />
                <figcaption className="p-3.5 text-xs text-fg-secondary border-t border-line">
                  {project.highlight.caption}
                </figcaption>
              </figure>
            )}
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-line">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-fg-muted mb-2">
                The Problem &amp; Overview
              </h4>
              <p className="text-sm sm:text-base text-fg-secondary leading-relaxed">
                {project.overview}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-fg-muted mb-2">
                Real-World Impact
              </h4>
              <p className="text-sm sm:text-base text-fg-secondary leading-relaxed">
                {project.impact}
              </p>
            </div>

            {project.features && (
              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-fg-muted mb-3">
                  Core Implementation Features
                </h4>
                <ul className="space-y-2">
                  {project.features.map((feat, idx) => (
                    <li
                      key={idx}
                      className="text-xs sm:text-sm text-fg-secondary flex items-start gap-2.5"
                    >
                      <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Facts sidebar */}
          <div className="space-y-6">
            <div className="glass-card p-5 rounded-2xl border border-line space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-widest text-fg-muted">
                Quick Facts
              </h4>
              {project.facts.map((fact, fIdx) => (
                <div key={fIdx} className="flex justify-between items-center text-xs">
                  <span className="text-fg-muted">{fact.label}</span>
                  <span className="font-semibold text-fg">{fact.value}</span>
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-fg-muted mb-3">
                Technologies
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-xs px-3 py-1 rounded-full bg-fill border border-line text-fg"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Links */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                data-magnetic
                className="px-5 py-2.5 rounded-full bg-fill border border-line text-fg hover:border-accent-line flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <GitHubIcon className="w-4 h-4" />
                <span>View Source Code</span>
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                data-magnetic
                className="px-5 py-2.5 rounded-full bg-accent text-accent-fg hover:opacity-90 flex items-center gap-2 text-sm font-semibold transition-opacity"
              >
                <span>Live Deployment</span>
                <ExternalLink size={16} />
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-xs text-fg-muted hover:text-fg transition-colors"
          >
            Close preview
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Main Projects Section with Inertial Horizontal Slider
 */
export function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [detailedProject, setDetailedProject] = useState<Project | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Drag physics state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentDragDelta = useRef(0);
  const lastX = useRef(0);
  const velocity = useRef(0);

  const total = projects.length;

  const goToSlide = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(total - 1, idx));
      setActiveIndex(clamped);
    },
    [total]
  );

  const nextSlide = useCallback(() => {
    goToSlide(activeIndex + 1);
  }, [activeIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(activeIndex - 1);
  }, [activeIndex, goToSlide]);

  // Pointer drag listeners for Momentum Drag
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag with primary mouse button or touch
    if (e.button !== 0) return;
    isDragging.current = true;
    startX.current = e.clientX;
    lastX.current = e.clientX;
    currentDragDelta.current = 0;
    velocity.current = 0;

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const delta = e.clientX - lastX.current;
    velocity.current = delta;
    lastX.current = e.clientX;
    currentDragDelta.current = e.clientX - startX.current;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    const delta = currentDragDelta.current;
    const vel = velocity.current;

    // Fling threshold
    if (delta < -50 || vel < -2) {
      nextSlide();
    } else if (delta > 50 || vel > 2) {
      prevSlide();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  const activeProject = projects[activeIndex];

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative w-full min-h-screen py-24 sm:py-32 md:py-40 flex flex-col justify-between overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-radial from-ambient-1 via-ambient-2 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Section Header with Kinetic Typography */}
      <div className="relative max-w-6xl mx-auto px-6 md:px-12 w-full mb-12 sm:mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <RevealItem className="mb-4">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-fill border border-line text-xs font-medium tracking-wide text-fg-secondary">
                <Sparkles size={13} className="text-accent" />
                <span>Featured Engineering Work</span>
              </span>
            </RevealItem>

            <VelocitySkew max={2}>
              <RevealText
                as="h2"
                className="font-display text-[clamp(1.75rem,7.5vw,2.75rem)] sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-fg"
                lines={[
                  "SELECTED",
                  <span
                    key="works"
                    className="text-transparent bg-clip-text bg-gradient-to-r from-heading-from via-heading-via to-heading-to"
                  >
                    PROJECTS.
                  </span>,
                ]}
              />
            </VelocitySkew>
          </div>

          <RevealItem delay={0.2} className="max-w-md">
            <p className="text-sm sm:text-base md:text-lg text-fg-secondary leading-relaxed">
              Drag or use arrows to navigate through the interactive showcase. Each card features real-time WebGL liquid image shaders.
            </p>
          </RevealItem>
        </div>
      </div>

      {/* Inertial Horizontal Slider Track */}
      <div
        className="relative w-full py-6 cursor-grab active:cursor-grabbing overflow-hidden"
        data-cursor="drag"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          ref={trackRef}
          className="flex items-center transition-transform duration-500 ease-out"
          style={{
            // Center the active card precisely
            transform: `translate3d(calc(50vw - min(42vw, 380px) - ${activeIndex} * (min(84vw, 760px) + 2rem)), 0, 0)`,
            gap: "2rem",
            paddingLeft: "0rem",
          }}
        >
          {projects.map((project, idx) => (
            <ProjectSliderCard
              key={project.id}
              project={project}
              index={idx}
              activeIndex={activeIndex}
              onSelect={() => goToSlide(idx)}
              onOpenDetails={() => setDetailedProject(project)}
            />
          ))}
        </div>
      </div>

      {/* Floating Meta Badges & Navigation Footer */}
      <div className="relative max-w-6xl mx-auto px-6 md:px-12 w-full mt-10 sm:mt-14">
        <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border border-line">
          {/* Tumbler Index & Category */}
          <div className="flex items-center gap-4 sm:gap-6">
            <NumberTumbler current={activeIndex} total={total} />
            <div className="h-4 w-px bg-line" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-fg font-semibold">
                {activeProject.title}
              </span>
              <span className="text-xs text-fg-muted hidden sm:inline-block">
                — {activeProject.category}
              </span>
            </div>
          </div>

          {/* Active Stack Tags */}
          <div className="hidden lg:flex items-center gap-1.5">
            {activeProject.technologies.slice(0, 5).map((tech, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-0.5 rounded-full bg-fill border border-line text-fg-secondary"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Slider Prev / Next Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              disabled={activeIndex === 0}
              data-magnetic
              className="p-2.5 rounded-full border border-line bg-fill hover:border-accent-line hover:text-accent disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              aria-label="Previous project"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextSlide}
              disabled={activeIndex === total - 1}
              data-magnetic
              className="p-2.5 rounded-full border border-line bg-fill hover:border-accent-line hover:text-accent disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              aria-label="Next project"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Full Case Study Modal */}
      <AnimatePresence>
        {detailedProject && (
          <ProjectDetailsModal
            project={detailedProject}
            onClose={() => setDetailedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
