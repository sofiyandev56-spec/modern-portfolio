"use client";

import React from "react";
import { track } from "@vercel/analytics";

/**
 * Link to the CV that records a "cv_download" event.
 *
 * Downloads are the one action on this site that signals real interest, and a
 * plain <a> is invisible to page-view analytics, so report it explicitly.
 */
export function CVLink({
  className,
  children,
  location,
}: {
  className?: string;
  children: React.ReactNode;
  /** Which part of the page the click came from, e.g. "hero". */
  location: string;
}) {
  return (
    <a
      href="/sofiyan-shaikh-cv.pdf"
      target="_blank"
      rel="noreferrer"
      className={className}
      onClick={() => track("cv_download", { location })}
    >
      {children}
    </a>
  );
}
