import type { Metadata } from "next";
import { ProjectArchive } from "./project-archive";

export const metadata: Metadata = {
  title: "Personal Projects — Akshat Kadam",
  description: "Side projects, prototypes, game-development attempts, and experiments from Akshat Kadam.",
};

export default function ProjectsPage() {
  return <ProjectArchive />;
}
