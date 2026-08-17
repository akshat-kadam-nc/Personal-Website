import type { Metadata } from "next";
import { Bookshelf } from "./bookshelf";

export const metadata: Metadata = {
  title: "Bookshelf — Akshat Kadam",
  description: "Akshat Kadam's shelf of recommendations, ideas, interests, and side stories.",
};

export default function BookshelfPage() {
  return <Bookshelf />;
}
