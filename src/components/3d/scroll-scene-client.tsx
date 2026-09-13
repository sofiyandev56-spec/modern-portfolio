"use client";

import React, { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { useSceneMode } from "@/lib/scene-store";

const ScrollSceneImpl = dynamic(
  () => import("@/components/3d/scroll-scene").then((mod) => mod.ScrollScene),
  { ssr: false }
);

function subscribe() {
  return () => {};
}

export function ScrollSceneClient() {
  const isMounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
  const mode = useSceneMode();

  if (!isMounted || mode !== "fixed") return null;

  return <ScrollSceneImpl />;
}
