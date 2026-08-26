import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found | Akshat Kadam",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-sheet">
        <p>ARCHIVE ERROR / 404</p>
        <strong aria-hidden="true">?</strong>
        <h1>This page isn&apos;t in the archive.</h1>
        <p>The chapter may have moved, or the address may be incomplete.</p>
        <nav aria-label="Page not found options">
          <Link href="/">Return to main issue</Link>
          <Link href="/projects">Browse projects</Link>
        </nav>
      </div>
    </main>
  );
}