"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/section-heading";
import { achievements } from "@/data/achievements";
import { Trophy, Award, Flag } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const categoryIcons = {
  hackathon: Trophy,
  certification: Award,
  milestone: Flag,
};

export function Achievements() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !gridRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".achievement-card", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
          once: true,
        },
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  const hasAchievements = achievements.length > 0;

  return (
    <section id="achievements" className="section">
      <div className="container">
        <SectionHeading
          label="// Achievements"
          title="Milestones & Recognition"
          description="Hackathons, certifications, and milestones along the way."
        />

        <div ref={gridRef}>
          {hasAchievements ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => {
                const Icon = categoryIcons[achievement.category];
                return (
                  <div
                    key={index}
                    className="achievement-card card p-6 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-10 h-10 rounded-lg bg-[var(--primary-glow)] flex items-center justify-center">
                        <Icon
                          size={18}
                          className="text-[var(--primary-light)]"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                          {achievement.description}
                        </p>
                        {achievement.date && (
                          <span
                            className="text-xs text-[var(--text-tertiary)] mt-2 block font-mono"
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            {achievement.date}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="achievement-card card p-10 md:p-14 text-center">
              <div className="flex justify-center mb-5">
                <div className="w-14 h-14 rounded-2xl bg-[var(--primary-glow)] flex items-center justify-center">
                  <Trophy size={24} className="text-[var(--primary-light)]" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                Building Track Record
              </h3>
              <p className="text-[var(--text-secondary)] max-w-md mx-auto text-sm leading-relaxed">
                Actively participating in hackathons, earning certifications,
                and reaching new milestones. This section will grow as I
                continue my journey.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
