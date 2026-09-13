"use client";

import React, { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { gsap, useGSAP } from "@/lib/gsap";
import { MOTION_OK } from "@/lib/use-media-query";
import { RevealItem, RevealText } from "@/components/motion/reveal";
import { VelocitySkew } from "@/components/motion/velocity-skew";

const services = [
  {
    number: "01",
    title: "GENERATIVE AI",
    description:
      "My honours specialization, studied with IBM. Understanding how foundation models work, and writing the prompts and workflows that get useful output from them.",
    tags: ["Generative AI", "Prompt Engineering", "IBM Track"],
  },
  {
    number: "02",
    title: "CORE PROGRAMMING",
    description:
      "C, C++ and Python as the foundation — data structures, algorithms, and the kind of consistent practice that turns syntax into problem solving.",
    tags: ["C", "C++", "Python", "Problem Solving"],
  },
  {
    number: "03",
    title: "DATABASES",
    description:
      "Designing and querying relational schemas with MySQL, and connecting them to real applications instead of leaving them on paper.",
    tags: ["MySQL", "SQL", "Schema Design"],
  },
  {
    number: "04",
    title: "BUILDING FOR THE WEB",
    description:
      "Taking an idea to a working, deployed application — using AI tooling as a build partner while staying responsible for how the code fits together.",
    tags: ["HTML", "React", "Git & GitHub", "AI-Assisted Builds"],
  },
];

/** Must match .stack-card in globals.css: 6.5rem top, 1.25rem per card. */
const STACK_TOP_REM = 6.5;
const STACK_STEP_REM = 1.25;

/**
 * Skills as a card stack. Each card sticks near the top of the viewport (CSS
 * sticky, see .stack-card) and, as the next card slides up over it, scales
 * down to 0.92, dims and softens. The fall-off is a scrub keyed to the next
 * card's travel from where the current one stuck to its own resting offset,
 * so a card never starts receding before it has actually settled.
 */
export function Services() {
  const listRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const list = listRef.current;
      const cards = gsap.utils.toArray<HTMLElement>(".stack-card", list);
      if (!list || cards.length < 2) return;
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const restTop = (i: number) => (STACK_TOP_REM + i * STACK_STEP_REM) * rem;
      // Sticky cards report shifted positions once stuck, so the triggers are
      // expressed as offsets from the (never sticky) list container: a card's
      // flow position is the heights and gaps of the cards before it.
      const gap = () => parseFloat(getComputedStyle(list).rowGap) || 0;
      const flowTop = (i: number) =>
        cards.slice(0, i).reduce((sum, c) => sum + c.offsetHeight + gap(), 0);

      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: MOTION_OK,
          // Blur is a filter, not a transform; keep it off phone GPUs.
          fine: "(pointer: fine)",
        },
        (ctx) => {
          const { motion, fine } = ctx.conditions as { motion: boolean; fine: boolean };
          if (!motion) return;

          cards.forEach((card, i) => {
            const next = cards[i + 1];
            if (!next) return;
            gsap.to(card, {
              scale: 0.92,
              opacity: 0.45,
              filter: fine ? "blur(4px)" : "none",
              ease: "none",
              scrollTrigger: {
                trigger: list,
                // From the moment this card sticks — the next one's top is one
                // card height plus the gap below it — until the next one rests.
                start: () => `top+=${flowTop(i + 1)} ${restTop(i) + card.offsetHeight + gap()}px`,
                end: () => `top+=${flowTop(i + 1)} ${restTop(i + 1)}px`,
                scrub: true,
                invalidateOnRefresh: true,
                onToggle: (self) => {
                  card.style.willChange = self.isActive ? "transform, opacity" : "";
                },
              },
            });
          });
        }
      );
    },
    { scope: listRef }
  );

  return (
    <section
      id="services"
      className="relative w-full py-20 sm:py-24 md:py-40 lg:py-48 border-t border-line-faint overflow-x-clip"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 w-full">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 md:mb-24 pb-6 sm:pb-8 border-b border-line gap-6 sm:gap-8">
          <div>
            <RevealItem className="mb-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-fill border border-line text-xs font-medium tracking-wide text-fg-secondary">
                What I Study &amp; Build
              </span>
            </RevealItem>
            <VelocitySkew max={2}>
              <RevealText
                as="h2"
                className="font-display text-[clamp(1.5rem,7.2vw,2.25rem)] sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-fg"
                lines={[
                  "SKILLS &",
                  <span
                    key="cap"
                    className="text-transparent bg-clip-text bg-gradient-to-r from-heading-from via-heading-via to-heading-to"
                  >
                    CAPABILITIES.
                  </span>,
                ]}
              />
            </VelocitySkew>
          </div>
          <RevealItem delay={0.2} className="max-w-md">
            <p className="text-base md:text-lg text-fg-secondary leading-relaxed">
              The four areas my degree and my side projects actually cover right now — the foundations I am building on, not a service menu.
            </p>
          </RevealItem>
        </div>

        {/* Card Stack */}
        <div ref={listRef} className="flex flex-col gap-8 md:gap-10">
          {services.map((item, idx) => (
            <div
              key={item.number}
              className="stack-card"
              style={{ "--stack-index": idx } as React.CSSProperties}
            >
              <VelocitySkew max={1.5}>
                <motion.article
                  whileHover="hover"
                  className="glass-card p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8 md:gap-16 group cursor-default lg:min-h-[34vh] shadow-[0_24px_60px_-30px_var(--shadow)]"
                >
                  {/* Number and Title */}
                  <div className="flex items-baseline gap-3 sm:gap-8 lg:w-5/12 min-w-0 lg:min-w-min">
                    <motion.span
                      variants={{ hover: { x: 6 } }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="font-mono text-sm sm:text-base font-bold text-fg-muted group-hover:text-accent-text-strong transition-colors"
                    >
                      {item.number}
                    </motion.span>
                    <div className="min-w-0 lg:min-w-min">
                      <h3 className="font-display text-[clamp(1rem,4.8vw,1.25rem)] sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-fg group-hover:text-accent-text transition-colors">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="lg:w-4/12">
                    <p className="text-base md:text-lg leading-relaxed text-fg-secondary max-w-xl">
                      {item.description}
                    </p>
                  </div>

                  {/* Technology Tags & Spring Animated Arrow */}
                  <div className="lg:w-3/12 flex items-center justify-between lg:justify-end gap-5">
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-xs px-3 py-1 rounded-full bg-fill border border-line text-fg-soft"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <motion.div
                      variants={{ hover: { rotate: 45 } }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-11 h-11 rounded-full border border-line bg-fill-faint flex items-center justify-center text-fg-secondary group-hover:text-fg group-hover:border-accent-line group-hover:bg-accent-soft transition-colors shrink-0"
                    >
                      <ArrowUpRight size={20} />
                    </motion.div>
                  </div>
                </motion.article>
              </VelocitySkew>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
