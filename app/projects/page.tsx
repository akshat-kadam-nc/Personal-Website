import type { Metadata } from "next";
import { ProjectArchive } from "./project-archive";
import "./projects.css";

export const metadata: Metadata = {
  title: "Personal Projects | Akshat Kadam",
  description: "Rec Room, Dayforge, and Pokémon Destiny: significant personal projects by Akshat Kadam.",
};

export default function ProjectsPage() {
  return <ProjectArchive />;
}
