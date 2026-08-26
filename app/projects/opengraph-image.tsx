import { ImageResponse } from "next/og";

export const alt = "Personal projects by Akshat Kadam";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function ProjectsOpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 70px",
        background: "#151412",
        color: "#eee5d0",
        border: "20px solid #d64732",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 23, fontWeight: 700, letterSpacing: 4 }}>
        <span>AKSHAT KADAM</span>
        <span>PERSONAL PROJECTS</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ color: "#d64732", fontSize: 34, fontWeight: 800, letterSpacing: 5 }}>THREE CHAPTERS</span>
        <span style={{ fontSize: 132, lineHeight: 0.84, fontWeight: 900, letterSpacing: -8 }}>SIDE QUESTS</span>
      </div>
      <div style={{ display: "flex", gap: 26, fontSize: 24, fontWeight: 700 }}>
        <span>REC ROOM</span><span>/</span><span>DAYFORGE</span><span>/</span><span>POKÉMON DESTINY</span>
      </div>
    </div>,
    size,
  );
}