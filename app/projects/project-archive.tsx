"use client";

import Link from "next/link";
import { useState } from "react";

const drawers = [
  { id: "games", number: "01", label: "GAME DEV", title: "Game-development attempts", status: "ACTIVE FILE", copy: "Playable ideas, mechanics tests, false starts, and the prototypes that taught me something useful.", marks: ["MECHANICS", "PROTOTYPES", "WORLDS"] },
  { id: "vibe", number: "02", label: "VIBE CODED", title: "Experiments made at speed", status: "OPEN FILE", copy: "Small software experiments built to chase an idea before the idea has time to become a planning document.", marks: ["WEEKEND BUILDS", "ROUGH EDGES", "FAST LOOPS"] },
  { id: "agents", number: "03", label: "AI / AGENTS", title: "Agentic AI prototypes", status: "IN PROGRESS", copy: "Tests around agents, interfaces, memory, tools, and what changes when software can take the next step itself.", marks: ["AGENTS", "INTERFACES", "SYSTEMS"] },
  { id: "tools", number: "04", label: "TOOLS", title: "Useful little machines", status: "OPEN FILE", copy: "Utilities and internal tools that began with a very specific annoyance and became worth keeping.", marks: ["AUTOMATION", "UTILITY", "WORKFLOW"] },
  { id: "web", number: "05", label: "WEB", title: "Interactive web studies", status: "VISUAL FILE", copy: "Interface studies, Three.js scenes, strange navigation ideas, and experiments that belong in a browser.", marks: ["3D", "INTERACTION", "MOTION"] },
  { id: "graveyard", number: "06", label: "ARCHIVE", title: "Abandoned but interesting", status: "CLOSED FILE", copy: "Projects that did not become products but still contain a useful decision, lesson, or fragment worth preserving.", marks: ["POSTMORTEMS", "FRAGMENTS", "LESSONS"] },
] as const;

export function ProjectArchive() {
  const [active, setActive] = useState(0);
  const drawer = drawers[active];
  return <main className="projects-page">
    <header className="projects-nav"><Link className="issue-mark" href="/" aria-label="Akshat Kadam, home">AK<span>!</span></Link><p>PERSONAL ARCHIVE / OFF-HOURS WORK</p><nav><Link href="/bookshelf">Bookshelf</Link><Link href="/">← Main issue</Link></nav></header>
    <section className="projects-hero">
      <div><p>5–9 / PERSONAL PROJECTS</p><h1>THE<br /><span>WORKSHOP</span></h1></div>
      <p>This is the work outside the company story: prototypes, side quests, failed attempts, useful tools, and whatever seemed worth making next.</p>
      <b aria-hidden="true">作</b>
    </section>
    <section className="project-files">
      <div className="drawer-stack" role="tablist" aria-label="Project archive sections">{drawers.map((item, index) => <button key={item.id} type="button" role="tab" aria-selected={active === index} className={active === index ? "is-active" : ""} onClick={() => setActive(index)}><span>{item.number}</span><strong>{item.label}</strong><i>{item.status}</i></button>)}</div>
      <article className="project-dossier" key={drawer.id} role="tabpanel">
        <div className="dossier-top"><span>FILE {drawer.number} / 06</span><b>{drawer.status}</b></div>
        <p>{drawer.label}</p><h2>{drawer.title}</h2><div className="dossier-rule" />
        <p>{drawer.copy}</p>
        <div className="dossier-marks">{drawer.marks.map((mark, index) => <span key={mark}>0{index + 1} · {mark}</span>)}</div>
        <div className="dossier-placeholder"><strong>PROJECT ENTRIES GO HERE</strong><p>The visual system is ready. Real project names, screenshots, links, and notes can replace this placeholder without redesigning the page.</p></div>
        <small>LAST UPDATED / CATALOGUE IN PROGRESS</small>
      </article>
    </section>
    <section className="project-strip"><span>BUILD</span><span>BREAK</span><span>LEARN</span><span>KEEP THE USEFUL PARTS</span></section>
    <footer className="shelf-footer"><span>作業場 / SAGYŌBA</span><p>PERSONAL WORK.<br />NO PITCH DECK REQUIRED.</p><Link href="/">Return to Issue →</Link></footer>
  </main>;
}
