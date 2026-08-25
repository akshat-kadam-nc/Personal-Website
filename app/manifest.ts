import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Akshat Kadam | Personal Archive",
    short_name: "Akshat Kadam",
    description:
      "Akshat Kadam's personal archive of work, projects, writing, and interests.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f0e8",
    theme_color: "#111111",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
