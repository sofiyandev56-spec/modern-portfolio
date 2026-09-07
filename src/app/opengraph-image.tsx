import { ImageResponse } from "next/og";

export const alt = "Sofiyan Shaikh — B.Tech CSE (AI & ML) Student";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #09090b 0%, #17111f 55%, #1d1030 100%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 24,
            color: "#a1a1aa",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#c084fc",
              display: "flex",
            }}
          />
          <div style={{ display: "flex" }}>B.Tech CSE (AI &amp; ML) Hons.</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 118,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: -4,
              lineHeight: 1.05,
            }}
          >
            SOFIYAN SHAIKH
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 22,
              fontSize: 34,
              color: "#d4d4d8",
              lineHeight: 1.35,
            }}
          >
            Specializing in Generative AI with IBM
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {["Python", "C / C++", "MySQL", "Prompt Engineering", "React"].map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                padding: "10px 24px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(255,255,255,0.05)",
                color: "#e4e4e7",
                fontSize: 24,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
