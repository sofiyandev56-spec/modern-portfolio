"use client";

import { useSyncExternalStore } from "react";
import { isWebGLAvailable } from "@/components/3d/canvas-fallback";
import { FIXED_SCENE_QUERY, useMediaQuery } from "@/lib/use-media-query";

/**
 * Where the 3D bust lives and whether it has loaded.
 *
 * On desktop the bust is drawn by one fixed canvas that the hero, about,
 * skills and projects sections all share, so the hero cannot simply own it.
 * This store is how the hero's placeholder slot learns that the shared scene
 * has streamed the model in and can drop its loading pulse.
 */
export type SceneStatus = "loading" | "ready" | "failed";

let status: SceneStatus = "loading";
const listeners = new Set<() => void>();

export function setSceneStatus(next: SceneStatus) {
  if (status === next) return;
  status = next;
  listeners.forEach((l) => l());
}

export function useSceneStatus(): SceneStatus {
  return useSyncExternalStore(
    (onChange) => {
      listeners.add(onChange);
      return () => listeners.delete(onChange);
    },
    () => status,
    () => "loading"
  );
}

/**
 * WebGL support, probed once per page and shared, so the hero slot and the
 * fixed scene agree without each spending a throwaway GL context. `null` until
 * the probe has run on the client; the server never knows.
 */
let webgl: boolean | null = null;
const webglListeners = new Set<() => void>();

function probeWebGL() {
  if (webgl !== null) return;
  webgl = isWebGLAvailable();
  webglListeners.forEach((l) => l());
}

export function useWebGLSupport(): boolean | null {
  return useSyncExternalStore(
    (onChange) => {
      webglListeners.add(onChange);
      // Probe lazily on the first subscriber, after hydration, so the server
      // and the first client render agree on `null`.
      if (webgl === null) queueMicrotask(probeWebGL);
      return () => webglListeners.delete(onChange);
    },
    () => webgl,
    () => null
  );
}

/**
 * Which presentation of the bust this client gets. `pending` until the WebGL
 * probe has run; the hero shows its loading pulse meanwhile.
 */
export type SceneMode = "pending" | "fixed" | "inline" | "fallback";

export function useSceneMode(): SceneMode {
  const fixed = useMediaQuery(FIXED_SCENE_QUERY);
  const webgl = useWebGLSupport();
  if (webgl === null) return "pending";
  if (!webgl) return "fallback";
  return fixed ? "fixed" : "inline";
}
