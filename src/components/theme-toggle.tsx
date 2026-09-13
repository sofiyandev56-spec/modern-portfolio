"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { setTheme, useTheme } from "@/lib/theme";

/**
 * Light / dark switch, styled as one of the navbar's pill controls.
 *
 * A single button with role="switch": "on" means light mode. The knob slides
 * between the two icons; the inactive icon stays visible so both states are
 * always legible. Touch devices get a 44px hit area via pointer-coarse.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      title={isLight ? "Switch to dark mode" : "Switch to light mode"}
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className={`group relative inline-flex items-center h-8 w-[60px] shrink-0 rounded-full border border-line bg-fill p-[3px] transition-colors hover:border-line-strong hover:bg-fill-hover pointer-coarse:h-11 pointer-coarse:w-[76px] pointer-coarse:p-1 cursor-pointer ${className}`}
    >
      {/* Sliding knob */}
      <motion.span
        aria-hidden="true"
        layout
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 500, damping: 32, mass: 0.6 }
        }
        className={`absolute top-[3px] bottom-[3px] pointer-coarse:top-1 pointer-coarse:bottom-1 aspect-square rounded-full bg-elevated border border-line-strong shadow-[0_2px_8px_-2px_var(--shadow-soft)] ${
          isLight ? "right-[3px] pointer-coarse:right-1" : "left-[3px] pointer-coarse:left-1"
        }`}
      />

      {/* Icons sit above the knob; the active one is coloured. */}
      <span className="relative z-10 flex w-full items-center justify-between px-[5px] pointer-coarse:px-2">
        <Moon
          size={13}
          strokeWidth={2.25}
          aria-hidden="true"
          className={`transition-colors ${isLight ? "text-fg-muted" : "text-accent-text-strong"}`}
        />
        <Sun
          size={13}
          strokeWidth={2.25}
          aria-hidden="true"
          className={`transition-colors ${isLight ? "text-accent-text-strong" : "text-fg-muted"}`}
        />
      </span>
    </button>
  );
}
