import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** A tiny four-point star on black: the site's mark. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          borderRadius: 7,
        }}
      >
        <svg width="24" height="24" viewBox="-1.2 -1.2 2.4 2.4">
          <path
            d="M0 -1.15 C0.06 -0.5 0.45 -0.07 0.95 0 C0.45 0.07 0.06 0.5 0 1.15 C-0.06 0.5 -0.45 0.07 -0.95 0 C-0.45 -0.07 -0.06 -0.5 0 -1.15 Z"
            fill="#2ee6a0"
          />
        </svg>
      </div>
    ),
    size
  );
}
