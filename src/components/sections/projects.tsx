"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronDown, ExternalLink, Lock, CalendarCheck, Boxes, Trophy } from "lucide-react";
import { GitHubIcon } from "@/components/icons";
import { projects, type Project } from "@/data/projects";

/**
 * Real screenshots of a running product. The main frame can be switched when a
 * project supplies more than one image; the optional highlight strip beneath it
 * stays fixed so the project's key figure is always in view.
 */
function ScreenshotPanel({ project }: { project: Project }) {
  const images = project.images ?? [];
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];
  if (!current) return null;

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="rounded-xl border border-line overflow-hidden bg-fill">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Image
              src={current.src}
              alt={current.alt}
              width={current.width}
              height={current.height}
              sizes="(max-width: 1024px) 100vw, 640px"
              className="w-full h-auto block"
              priority={false}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className="flex flex-wrap gap-2" role="tablist" aria-label={`${project.title} screenshots`}>
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`text-xs px-3 py-1.5 pointer-coarse:min-h-11 pointer-coarse:px-4 rounded-full border transition-colors cursor-pointer ${
                i === active
                  ? "border-accent-line-strong bg-accent-soft text-accent-text"
                  : "border-line bg-fill text-fg-secondary hover:text-fg hover:border-line-strong"
              }`}
            >
              {img.label ?? `Screen ${i + 1}`}
            </button>
          ))}
        </div>
      )}

      {project.highlight && (
        <figure className="rounded-xl border border-line overflow-hidden bg-fill">
          <Image
            src={project.highlight.src}
            alt={project.highlight.alt}
            width={project.highlight.width}
            height={project.highlight.height}
            sizes="(max-width: 1024px) 100vw, 640px"
            className="w-full h-auto block"
          />
          <figcaption className="px-4 py-3 text-xs sm:text-[13px] leading-relaxed text-fg-secondary border-t border-line">
            {project.highlight.caption}
          </figcaption>
        </figure>
      )}
    </div>
  );
}

export function Projects() {
  const [expandedId, setExpandedId] = useState<string>(projects[0].id);

  const toggleProject = (id: string) => {
    setExpandedId(expandedId === id ? "" : id);
  };

  const renderVisualMockup = (type: Project["visualType"]) => {
    switch (type) {
      case "skilltrace":
        // SkillTrace ships real screenshots, so this branch is never reached.
        return null;
      case "happynest":
        return (
          <div className="w-full h-full flex flex-col justify-between">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <CalendarCheck size={16} className="text-accent-text-strong" />
                <span className="text-xs font-medium text-fg">Clinic Booking Portal</span>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-accent-soft border border-accent-line text-[11px] font-mono text-accent-text">
                Mobile-First
              </div>
            </div>

            {/* Middle Content */}
            <div className="my-auto py-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-4 rounded-xl bg-fill border border-line-faint space-y-2">
                <div className="text-[11px] text-fg-secondary uppercase tracking-wider font-medium">Appointments</div>
                <div className="text-sm font-semibold text-fg">Slot Scheduling</div>
                <div className="text-[11px] text-accent-text">Parent intake forms</div>
              </div>
              <div className="p-4 rounded-xl bg-fill border border-line-faint space-y-2">
                <div className="text-[11px] text-fg-secondary uppercase tracking-wider font-medium">Doctor View</div>
                <div className="text-sm font-semibold text-fg">Sign-Off Queue</div>
                <div className="text-[11px] text-fg-secondary">Immunization checklist</div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex items-center justify-between text-[11px] text-fg-secondary pt-3 border-t border-line font-mono">
              <span>Supabase Auth &amp; Database</span>
              <span className="text-fg-soft">TanStack Start</span>
            </div>
          </div>
        );

      case "portfolio":
        return (
          <div className="w-full h-full flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Boxes size={16} className="text-info" />
                <span className="text-xs font-medium text-fg">3D Scene &amp; Motion Layer</span>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-info-soft border border-info-line text-[11px] font-mono text-info">
                WebGL Canvas
              </div>
            </div>

            <div className="my-auto py-5 flex items-center justify-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-info-line flex items-center justify-center shadow-lg">
                <div
                  className="w-10 h-10 rounded-lg border border-dashed border-line-strong animate-spin"
                  style={{ animationDuration: "14s" }}
                />
              </div>
              <div className="space-y-1.5 text-left">
                <div className="text-xs font-mono text-fg font-medium">React Three Fiber</div>
                <div className="text-[11px] text-fg-secondary">Custom 3D model + lighting</div>
                <div className="text-[11px] text-info font-mono">Framer Motion transitions</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-fg-secondary pt-3 border-t border-line font-mono">
              <span>Next.js App Router</span>
              <span className="text-fg-soft">Typed End to End</span>
            </div>
          </div>
        );
    }
  };

  // Facts, stack and links. For projects with real screenshots this sits under
  // the images so the two columns balance and the call to action comes last.
  const renderMeta = (project: Project) => (
    <>
      {/* At a Glance */}
      <div
        className={`grid grid-cols-1 gap-3 pt-2 ${
          project.facts.length === 4 ? "sm:grid-cols-2" : "sm:grid-cols-3"
        }`}
      >
        {project.facts.map((f, fIdx) => (
          <div key={fIdx} className="p-3 rounded-xl bg-fill-faint border border-line-faint">
            <div className="text-[10px] text-fg-muted uppercase">{f.label}</div>
            <div className="text-sm font-bold text-fg mt-1">{f.value}</div>
          </div>
        ))}
      </div>

      {/* Technologies */}
      <div className="pt-2">
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((t, tIdx) => (
            <span
              key={tIdx}
              className="text-xs px-3 py-1 rounded-full bg-fill border border-line text-fg-soft"
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
          <span className="inline-flex items-center gap-2 py-2.5 px-4 rounded-full border border-line bg-fill-faint text-xs font-medium text-fg-secondary">
            <Lock size={13} />
            <span>Private repository</span>
          </span>
        )}
      </div>

    </>
  );

  return (
    <section
      id="projects"
      className="relative w-full md:min-h-screen flex flex-col justify-center py-20 sm:py-24 md:py-40 lg:py-48 bg-canvas border-t border-line-faint overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 w-full my-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 md:mb-24 pb-6 sm:pb-8 border-b border-line gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fill border border-line text-xs font-medium tracking-wide text-fg-secondary mb-4">
              <span>Selected Work</span>
            </div>
            <h2 className="font-display text-[clamp(1.5rem,7.2vw,2.25rem)] sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-fg">
              FEATURED <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-heading-from via-heading-via to-heading-to">
                PROJECTS.
              </span>
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-base sm:text-lg text-fg-secondary leading-relaxed">
              Three things I have actually shipped — a hackathon prototype for tracking government skilling outcomes, a clinic booking application, and the site you are on right now.
            </p>
          </div>
        </div>

        {/* Expandable Project Accordion */}
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {projects.map((project) => {
            const isExpanded = expandedId === project.id;
            const hasImages = !!project.images?.length;

            return (
              <motion.div
                key={project.id}
                layout
                transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                className={`rounded-2xl border transition-colors overflow-hidden ${
                  isExpanded
                    ? "border-line-strong bg-elevated shadow-[0_20px_50px_var(--shadow)]"
                    : "border-line bg-fill-faint hover:border-line-strong hover:bg-fill"
                }`}
              >
                {/* Collapsed Header Bar */}
                <button
                  onClick={() => toggleProject(project.id)}
                  className="w-full p-5 sm:p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 text-left cursor-pointer group"
                  aria-expanded={isExpanded}
                  aria-controls={`${project.id}-panel`}
                  id={`${project.id}-trigger`}
                >
                  <div className="flex items-center gap-6 sm:gap-8">
                    {/* Index Number */}
                    <span className="font-mono text-sm font-bold text-fg-muted group-hover:text-accent-text-strong transition-colors">
                      {project.number}
                    </span>

                    {/* Title & Category */}
                    <div className="min-w-0">
                      {project.hackathon && (
                        <span className="inline-flex items-center gap-1.5 mb-2 px-2.5 py-1 rounded-full bg-accent-soft border border-accent-line text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-accent-text">
                          <Trophy size={11} aria-hidden="true" />
                          {project.hackathon}
                        </span>
                      )}
                      <h3 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-fg group-hover:text-accent-text transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-fg-secondary font-medium mt-1">
                        {project.category}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Pill */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                    <span
                      className={`text-xs font-semibold transition-colors ${
                        isExpanded ? "text-accent-text-strong" : "text-fg-secondary group-hover:text-fg"
                      }`}
                    >
                      {isExpanded ? "Collapse" : "View Project"}
                    </span>
                    <div
                      className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 ${
                        isExpanded
                          ? "border-accent-line-strong bg-accent-soft text-accent-text-strong rotate-180"
                          : "border-line bg-fill text-fg group-hover:border-line-strong"
                      }`}
                    >
                      <ChevronDown size={18} aria-hidden="true" />
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
                      className="overflow-hidden border-t border-line"
                      id={`${project.id}-panel`}
                      role="region"
                      aria-labelledby={`${project.id}-trigger`}
                    >
                      <div className="p-5 sm:p-8 md:p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-10 lg:gap-16 items-start">
                          
                          {/* Left: Overview, Impact, & Tech Pills (col-span-5) */}
                          <div className="lg:col-span-5 space-y-6">
                            <div>
                              <div className="text-xs uppercase tracking-widest text-fg-muted font-medium mb-2">
                                Overview
                              </div>
                              <p className="text-base text-fg leading-relaxed">
                                {project.overview}
                              </p>
                            </div>

                            <div>
                              <div className="text-xs uppercase tracking-widest text-fg-muted font-medium mb-2">
                                What It Does
                              </div>
                              <p className="text-sm sm:text-base text-fg-soft leading-relaxed font-medium">
                                {project.impact}
                              </p>
                            </div>

                            {project.features && project.features.length > 0 && (
                              <div>
                                <div className="text-xs uppercase tracking-widest text-fg-muted font-medium mb-2">
                                  Key Features
                                </div>
                                <ul className="space-y-2">
                                  {project.features.map((f, fIdx) => (
                                    <li key={fIdx} className="flex items-start gap-2.5 text-sm text-fg-soft leading-relaxed">
                                      <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-accent shrink-0" aria-hidden="true" />
                                      <span>{f}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {!hasImages && renderMeta(project)}
                          </div>

                          {/* Right: real screenshots when available, otherwise a decorative mockup (col-span-7) */}
                          <div className="lg:col-span-7 lg:self-start">
                            {project.images && project.images.length > 0 ? (
                              <motion.div
                                initial={{ scale: 0.98, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1], delay: 0.08 }}
                              >
                                <ScreenshotPanel project={project} />
                                <div className="mt-6 space-y-6">{renderMeta(project)}</div>
                              </motion.div>
                            ) : (
                              <motion.div
                                aria-hidden="true"
                                initial={{ scale: 0.96, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1], delay: 0.08 }}
                                className="rounded-xl border border-line overflow-hidden aspect-[4/3] sm:aspect-video bg-fill p-4 sm:p-6 md:p-8 backdrop-blur-sm flex flex-col justify-between"
                              >
                                {renderVisualMockup(project.visualType)}
                              </motion.div>
                            )}
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
