"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, BrainCircuit, Code2, Bike, Trophy, Activity, Smartphone } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { COARSE_OR_NARROW, REDUCED_MOTION, useMediaQuery } from "@/lib/use-media-query";
import { RevealItem, RevealText } from "@/components/motion/reveal";
import { VelocitySkew } from "@/components/motion/velocity-skew";

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
  // Phones and reduced-motion users get static cards: the looping drift costs
  // battery and makes the stacked mobile layout look unsettled.
  const isTouchOrNarrow = useMediaQuery(COARSE_OR_NARROW);
  const prefersReducedMotion = useMediaQuery(REDUCED_MOTION);
  const animate = !isTouchOrNarrow && !prefersReducedMotion;

  const domains = [
    {
      icon: BrainCircuit,
      title: "Generative AI",
      tag: "SPECIALIZATION",
      description:
        "My honours specialisation, taken with IBM. Learning how foundation models are built, prompted and applied — and using them daily as a build partner.",
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
      icon: Code2,
      title: "Core Programming",
      tag: "FOUNDATIONS",
      description:
        "C, C++ and Python — the fundamentals I keep sharpening through data structures, algorithms and consistent problem solving.",
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
      icon: Smartphone,
      title: "iPhone & The Web",
      tag: "BUILDING",
      description:
        "Native iOS apps in Swift and SwiftUI, web interfaces in React, TypeScript and Three.js, and MySQL and Supabase for the data — put together in the projects below.",
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

  const facts: [string, string][] = [
    ["Based in", "Gandhinagar, Gujarat"],
    ["Studying", "B.Tech CSE (AI & ML) Hons., Generative AI with IBM, 2026 to 2030"],
    ["College", "Unitedworld Institute of Technology, Karnavati University"],
    ["Working with", "Swift, SwiftUI, React, TypeScript, Next.js, Three.js, Python, C, C++, MySQL, Supabase"],
    ["Open to", "Internships and project work in AI, web and iOS"],
  ];

  const record: [string, string][] = [
    [
      "Team leader, Tech Titans",
      "Smart India Hackathon 2026. Led six people through a 36-hour build of SkillTrace, owned the architecture and the proposal, and ran task distribution and API design reviews.",
    ],
    [
      "Independent research",
      "A 47-page self-directed analysis of foundation models, AI inference economics and multimodal architectures.",
    ],
    [
      "DocLens AI",
      "Concept and pitch for a document-intelligence tool that redacts ID details on the device. Led the design and the pitch.",
    ],
    [
      "LinkedIn Learning",
      "19 Nov 2026. Artificial Intelligence Foundations: Thinking Machines; Complete Guide to C Programming Foundations; and Leadership through Feedback.",
    ],
    [
      "iOS Application Development Workshop",
      "29 to 30 Oct 2026. Two days of Swift, SwiftUI and Xcode with Apple Authorised mentors at UIT's Apple Authorised Training Centre for Education.",
    ],
    [
      "Smart India Hackathon 2026 certificate",
      "10 to 11 Sep 2026. Certificate of participation in the preliminary round at Karnavati University, with Team Tech Titans.",
    ],
    [
      "AI Classroom Foundation Course",
      "Sep 2026. The foundation course of Jio Institute’s AI Classroom programme, powered by JioPC.",
    ],
  ];

  const interests = [
    { icon: Trophy, label: "Cricket" },
    { icon: Bike, label: "Cycling" },
    { icon: Activity, label: "Football" },
  ];

  return (
    <section
      id="about"
      className="relative w-full md:min-h-screen flex flex-col justify-center py-20 sm:py-24 md:py-40 lg:py-48 border-t border-line-faint overflow-hidden"
    >
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-radial from-ambient-3 via-ambient-2 to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 md:px-12">
        
        {/* Section Header — the bust sweeps in behind this on desktop */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 md:mb-24">
          <RevealItem className="mb-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-fill border border-line text-xs font-medium tracking-wide text-fg-secondary">
              Who I Am &amp; How I Learn
            </span>
          </RevealItem>
          <VelocitySkew max={2}>
            <RevealText
              as="h2"
              className="font-display text-[clamp(2.25rem,10vw,3rem)] sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-fg mb-6"
              lines={["ABOUT", "ME."]}
            />
          </VelocitySkew>
          {/* A soft scrim keeps the paragraph legible over the model. */}
          <RevealItem
            as="p"
            delay={0.15}
            className="relative text-base sm:text-lg md:text-xl text-fg-soft font-normal leading-relaxed scene:[text-shadow:0_0_24px_var(--bg),0_0_8px_var(--bg)]"
          >
            I’m a first-year B.Tech Computer Science (AI &amp; ML) Hons. student at UIT, Karnavati University, specialising in Generative AI with IBM. I have a solid grip on C, C++, Python and MySQL, and I build iOS apps in Swift and SwiftUI and web interfaces in React, TypeScript and Three.js.
            <br />
            <br />
            So far I’ve shipped five web applications and built two native iOS apps. I led a six-person team at Smart India Hackathon 2026, and I’m looking for internships and project work in AI, web and iOS development.
          </RevealItem>
        </div>

        {/* Centerpiece Layout: 3D Tilt Portrait & Floating Glass Domain Badges */}
        <div
          data-scene-anchor="about-grid"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center max-w-5xl mx-auto mb-12 sm:mb-20"
        >
          
          {/* Left: 3D Tilt Portrait Glass Card */}
          <RevealItem className="lg:col-span-5 flex justify-center">
            <TiltProfileCard>
              <div className="relative w-full h-full rounded-3xl overflow-hidden border border-line bg-surface shadow-2xl group">
                <Image
                  src="/images/profile-about.jpg"
                  alt="Sofiyan Shaikh"
                  fill
                  priority
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                {/* Sits over the photo's dark gradient in both themes, so its colours stay constant. */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-zinc-300 font-medium">Sofiyan Shaikh</div>
                    <div className="text-sm font-semibold text-white">iOS and web developer</div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              </div>
            </TiltProfileCard>
          </RevealItem>

          {/* Right: 3 Floating Domain Cards with Asynchronous Sinusoidal Drift */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {domains.map((item, idx) => {
              const Icon = item.icon;
              return (
                <RevealItem key={idx} delay={0.1 + idx * 0.1}>
                <VelocitySkew max={1.5}>
                <motion.div
                  animate={animate ? item.floatingAnimation : undefined}
                  className="glass-card p-5 sm:p-6 md:p-7 flex items-start gap-4 sm:gap-5 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-fill border border-line flex items-center justify-center text-fg-soft group-hover:text-accent-text-strong group-hover:border-accent-line transition-colors shrink-0">
                    <Icon size={22} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <h3 className="text-base sm:text-lg font-bold text-fg group-hover:text-accent-text transition-colors">
                        {item.title}
                      </h3>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-fill text-fg-secondary border border-line">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-sm text-fg-secondary leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
                </VelocitySkew>
                </RevealItem>
              );
            })}
          </div>

        </div>

        {/* Facts and record: the same on all three portfolios */}
        <RevealItem className="relative max-w-3xl mx-auto mb-12 sm:mb-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-left scene:[text-shadow:0_0_24px_var(--bg),0_0_8px_var(--bg)]">
          <dl className="space-y-3">
            {facts.map(([label, value]) => (
              <div key={label} className="border-b border-line-faint pb-3">
                <dt className="text-[11px] uppercase tracking-widest text-fg-muted font-medium">{label}</dt>
                <dd className="text-sm sm:text-base text-fg-soft mt-1">{value}</dd>
              </div>
            ))}
          </dl>
          <div>
            <span className="text-[11px] uppercase tracking-widest text-fg-muted font-medium">
              Leadership, Research &amp; Certificates
            </span>
            <ul className="mt-3 space-y-3">
              {record.map(([title, detail]) => (
                <li key={title} className="border-b border-line-faint pb-3">
                  <div className="text-sm sm:text-base font-semibold text-fg">{title}</div>
                  <p className="text-sm text-fg-secondary leading-relaxed mt-1">{detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </RevealItem>

        {/* Away From The Keyboard */}
        <RevealItem className="flex flex-col items-center gap-4 mb-10 sm:mb-16">
          <span className="text-[11px] uppercase tracking-widest text-fg-muted font-medium">
            Away From The Keyboard
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {interests.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fill border border-line text-sm font-medium text-fg-soft hover:text-fg hover:border-line-strong transition-colors"
                >
                  <Icon size={15} className="text-accent-text-strong" />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </RevealItem>

        {/* Bottom Call to Action */}
        <RevealItem delay={0.1} className="flex justify-center items-center gap-4">
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
        </RevealItem>

      </div>
    </section>
  );
}
