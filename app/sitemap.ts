import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://akshatkadam.com/",
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://akshatkadam.com/projects",
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}