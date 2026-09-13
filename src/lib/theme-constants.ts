/**
 * Theme constants that are safe to import from server components.
 * The hooks and setter live in ./theme.ts (client only).
 */

export type Theme = "dark" | "light";

export const STORAGE_KEY = "theme";
export const DEFAULT_THEME: Theme = "dark";

/** Colours for the browser chrome (<meta name="theme-color">). */
export const THEME_COLOR: Record<Theme, string> = {
  dark: "#09090b",
  light: "#f3f3f5",
};

/**
 * Runs in <head> before hydration. Kept tiny and dependency-free: it must not
 * throw when storage is blocked (private mode, strict privacy settings).
 *
 * It also marks <html class="js">. globals.css uses that class to give the
 * scroll-reveal text its hidden start state before the first paint, so the
 * reveal animations never flash the text on and off, while a browser without
 * JavaScript keeps everything visible.
 */
export const THEME_INIT_SCRIPT = `(function(){document.documentElement.classList.add("js");try{var t=localStorage.getItem(${JSON.stringify(
  STORAGE_KEY
)});if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`;
