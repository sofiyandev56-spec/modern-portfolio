"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ["hero", "about", "services", "projects", "contact"];
      const scrollPosition = window.scrollY + 250;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const winWithLenis = window as unknown as { __lenis?: { scrollTo: (target: Element, opts: { offset: number; duration: number }) => void } };
      if (winWithLenis.__lenis) {
        winWithLenis.__lenis.scrollTo(target, { offset: 0, duration: 1.2 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <>
      {/* Desktop Floating Pill Navbar */}
      <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav
          className={`pointer-events-auto flex items-center justify-between gap-6 sm:gap-8 px-5 py-2.5 rounded-full border border-line bg-nav backdrop-blur-xl shadow-[0_12px_40px_var(--shadow-soft)] transition-all duration-300 ${
            scrolled ? "border-line-strong shadow-[0_16px_50px_var(--shadow)] scale-[0.98]" : ""
          }`}
        >
          {/* Brand Mark */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, "#hero")}
            className="flex items-center gap-2.5 min-h-11 font-display text-base font-extrabold tracking-tight text-fg hover:text-accent-2 transition-colors"
          >
            <span>SOFIYAN</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          </a>

          {/* Nav Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1 bg-fill p-1 rounded-full border border-line-faint">
            {navLinks.map((item) => {
              const targetId = item.href.replace("#", "");
              const isCurrent = activeSection === targetId;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`relative px-4 py-1.5 pointer-coarse:min-h-11 pointer-coarse:inline-flex pointer-coarse:items-center text-xs font-medium tracking-wide transition-all duration-200 rounded-full ${
                    isCurrent
                      ? "text-fg bg-fill-active shadow-sm"
                      : "text-fg-secondary hover:text-fg hover:bg-fill-hover"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Right Action: theme switch + Get in Touch */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="pill-btn pill-btn-primary px-4 py-1.5 text-xs font-semibold shadow-md group"
            >
              <span>Get in Touch</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile: theme switch + menu button */}
          <div className="flex sm:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center w-11 h-11 rounded-full bg-fill-hover text-fg hover:bg-fill-active transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
          {/* Tablet (sm..md): menu button only; the theme switch is in the right cluster */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="hidden sm:flex md:hidden items-center justify-center w-11 h-11 rounded-full bg-fill-hover text-fg hover:bg-fill-active transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </nav>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-overlay backdrop-blur-2xl md:hidden flex flex-col justify-between p-8 pt-28 animate-in fade-in duration-200">
          <div className="flex flex-col gap-6">
            <div className="text-xs uppercase tracking-widest text-fg-muted font-medium">
              Navigation
            </div>
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-3xl font-display font-extrabold text-fg hover:text-accent-2 transition-colors py-2 border-b border-line-faint"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="pt-6 border-t border-line">
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="pill-btn pill-btn-primary w-full justify-center py-3.5 text-sm font-semibold"
            >
              <span>Get in Touch</span>
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
