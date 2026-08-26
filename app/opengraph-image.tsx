import { ImageResponse } from "next/og";

export const alt = "Akshat Kadam personal archive";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background: "#efe6d5",
        color: "#15151b",
        border: "20px solid #15151b",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ width: 34, height: "100%", background: "#cb4b36" }} />
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "58px 64px", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, fontWeight: 700, letterSpacing: 4 }}>
          <span>PERSONAL ARCHIVE</span>
          <span>AK!</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ color: "#cb4b36", fontSize: 34, fontWeight: 800, letterSpacing: 5 }}>THE STORY SO FAR</span>
          <span style={{ fontSize: 116, lineHeight: 0.82, fontWeight: 900, letterSpacing: -8 }}>AKSHAT</span>
          <span style={{ fontSize: 116, lineHeight: 0.82, fontWeight: 900, letterSpacing: -8 }}>KADAM</span>
        </div>
        <span style={{ fontSize: 25, fontWeight: 700 }}>ENTREPRENEUR / TECHNOLOGIST / PRODUCT BUILDER</span>
      </div>
      <div style={{ position: "absolute", width: 250, height: 250, borderRadius: 999, border: "15px solid #15151b", background: "#cb4b36", right: -70, top: 100 }} />
    </div>,
    size,
  );
}