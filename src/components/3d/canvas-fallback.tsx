import React from "react";

/**
 * Shown instead of the 3D scene when WebGL is unavailable or the canvas fails.
 *
 * Budget Android devices, locked-down browsers and lost GPU contexts all end up
 * here. It should read as a deliberate graphic rather than a broken element, so
 * it reuses the hero's own palette.
 */
export function CanvasFallback() {
  return (
    <div
      className="w-full h-full min-h-[260px] flex items-center justify-center"
      role="img"
      aria-label="Decorative graphic representing Sofiyan Shaikh's 3D portrait"
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-purple-600/30 via-fuchsia-500/20 to-blue-500/10 blur-3xl" />
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm flex items-center justify-center">
          <span className="font-display text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-500">
            S
          </span>
        </div>
      </div>
    </div>
  );
}

interface BoundaryProps {
  children: React.ReactNode;
}

interface BoundaryState {
  failed: boolean;
}

/**
 * Catches render errors thrown by the 3D scene (a lost WebGL context, a model
 * that fails to parse) so a hardware problem degrades to a graphic instead of
 * taking down the whole page.
 */
export class CanvasErrorBoundary extends React.Component<
  BoundaryProps,
  BoundaryState
> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("3D scene failed, showing static fallback:", error);
  }

  render() {
    if (this.state.failed) return <CanvasFallback />;
    return this.props.children;
  }
}

/** Feature-detects WebGL without keeping the test context around. */
export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    if (!gl) return false;
    // Free the probe context immediately; browsers cap how many can exist.
    const lose = (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context");
    lose?.loseContext();
    return true;
  } catch {
    return false;
  }
}
