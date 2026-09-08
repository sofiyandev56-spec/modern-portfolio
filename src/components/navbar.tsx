"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

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
          className={`pointer-events-auto flex items-center justify-between gap-6 sm:gap-8 px-5 py-2.5 rounded-full border border-white/10 bg-[#09090b]/80 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] transition-all duration-300 ${
            scrolled ? "border-white/20 shadow-[0_16px_50px_rgba(0,0,0,0.8)] scale-[0.98]" : ""
          }`}
        >
          {/* Brand Mark */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, "#hero")}
            className="flex items-center gap-2.5 min-h-11 font-display text-base font-extrabold tracking-tight text-white hover:text-[#d946ef] transition-colors"
          >
            <span>SOFIYAN</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" />
          </a>

          {/* Nav Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-full border border-white/5">
            {navLinks.map((item) => {
              const targetId = item.href.replace("#", "");
              const isCurrent = activeSection === targetId;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`relative px-4 py-1.5 text-xs font-medium tracking-wide transition-all duration-200 rounded-full ${
                    isCurrent
                      ? "text-white bg-white/15 shadow-sm"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Right Action: Get in Touch Button */}
          <div className="hidden sm:flex items-center">
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="pill-btn pill-btn-primary px-4 py-1.5 text-xs font-semibold shadow-md group"
            >
              <span>Get in Touch</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </nav>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#09090b]/95 backdrop-blur-2xl md:hidden flex flex-col justify-between p-8 pt-28 animate-in fade-in duration-200">
          <div className="flex flex-col gap-6">
            <div className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
              Navigation
            </div>
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-3xl font-display font-extrabold text-white hover:text-[#d946ef] transition-colors py-2 border-b border-white/5"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10">
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
