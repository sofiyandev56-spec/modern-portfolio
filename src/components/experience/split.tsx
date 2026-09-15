import React from "react";

/**
 * Text split for masked reveals.
 *
 * `Words` wraps each word in a mask (`.w`, overflow hidden) with the word
 * itself (`.w > i`) free to slide up into view; `Line` masks one whole line.
 * Each inner element carries `--i`, its index, for staggers. Both render as
 * plain spans on the server; how they move is decided by the consumer —
 * a CSS transition on a class, or a transform written every frame from
 * scroll progress. Styles live under "Masked text" in globals.css.
 */
export function Words({ text, from = 0 }: { text: string; from?: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          {i > 0 && " "}
          <span className="w" style={{ "--i": from + i } as React.CSSProperties}>
            <i>{word}</i>
          </span>
        </React.Fragment>
      ))}
    </>
  );
}

export function Line({ children, index = 0 }: { children: React.ReactNode; index?: number }) {
  return (
    <span className="ln" style={{ "--i": index } as React.CSSProperties}>
      <i>{children}</i>
    </span>
  );
}
