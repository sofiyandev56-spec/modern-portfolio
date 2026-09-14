"use client";

import dynamic from "next/dynamic";

/**
 * The cosmos is WebGL and probes for it at first render, so it must never be
 * server-rendered. Nothing is shown in its place: the page is black anyway.
 */
export const CosmosClient = dynamic(
  () => import("@/components/experience/cosmos").then((m) => m.Cosmos),
  { ssr: false }
);
