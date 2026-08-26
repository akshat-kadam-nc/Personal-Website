import type { Metadata } from "next";
import { ProjectArchive } from "./project-archive";
import "./projects.css";

export const metadata: Metadata = {
  title: "Personal Projects | Akshat Kadam",
  description: "Rec Room, Dayforge, and Pokémon Destiny: significant personal projects by Akshat Kadam.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Personal Projects | Akshat Kadam",
    description: "Rec Room, Dayforge, and Pokémon Destiny: significant personal projects by Akshat Kadam.",
    url: "/projects",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Personal Projects | Akshat Kadam",
    description: "Rec Room, Dayforge, and Pokémon Destiny: significant personal projects by Akshat Kadam.",
  },
};

export default function ProjectsPage() {
  return <ProjectArchive />;
}
