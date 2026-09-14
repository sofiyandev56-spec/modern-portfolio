import { ImageResponse } from "next/og";

export const alt = "Sofiyan Shaikh — AI & ML · Code · Web";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Link preview in the site's own language: black, tracked caps, a mint star. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          fontFamily: "sans-serif",
          color: "#f5f5f5",
        }}
      >
        <svg width="120" height="120" viewBox="-1.2 -1.2 2.4 2.4" style={{ marginBottom: 36 }}>
          <path
            d="M0 -1.15 C0.06 -0.5 0.45 -0.07 0.95 0 C0.45 0.07 0.06 0.5 0 1.15 C-0.06 0.5 -0.45 0.07 -0.95 0 C-0.45 -0.07 -0.06 -0.5 0 -1.15 Z"
            fill="#2ee6a0"
          />
        </svg>
        <div
          style={{
            display: "flex",
            fontSize: 92,
            fontWeight: 800,
            letterSpacing: 10,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          SOFIYAN SHAIKH
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontSize: 22,
            letterSpacing: 9,
            color: "#c5c5c5",
          }}
        >
          GENERATIVE AI · CODE · WEB
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 26,
            fontStyle: "italic",
            color: "#8a8a8a",
          }}
        >
          B.Tech CSE (AI &amp; ML) Hons. · Generative AI with IBM
        </div>
      </div>
    ),
    size
  );
}
