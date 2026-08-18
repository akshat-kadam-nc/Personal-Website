"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { RecRoomScene, type RoomHotspot } from "./rec-room-scene";

const hotspotCopy: Record<RoomHotspot, { eyebrow: string; title: string; body: string }> = {
  library: { eyebrow: "THE PERSONAL ARCHIVE", title: "Library", body: "Fixed category volumes for writing, ideas, recommendations, and collections. Chapters will scale inside each book." },
  watch: { eyebrow: "THE SCREENING ROOM", title: "Watch", body: "Films, television and anime recommendations, watchlists, and notes will live behind the television." },
  play: { eyebrow: "PLAYER ONE", title: "Play", body: "Video-game recommendations, wishlists, experiments, and remembered worlds will open from the console." },
  read: { eyebrow: "THE COMMONPLACE BOOK", title: "Read", body: "A coffee-table collection of essays, articles, and writing by other people worth returning to." },
};

export function RecRoom() {
  const [active, setActive] = useState<RoomHotspot | null>(null);
  const [loaded, setLoaded] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const openHotspot = useCallback((hotspot: RoomHotspot) => setActive(hotspot), []);
  const markLoaded = useCallback(() => setLoaded(true), []);

  useEffect(() => { if (active) closeButton.current?.focus(); }, [active]);
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => { if (event.key === "Escape") setActive(null); };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, []);

  return <main className="rec-room-page">
    <header className="rec-room-nav">
      <Link className="issue-mark" href="/" aria-label="Akshat Kadam, home"><img src="/favicon.svg" alt="" /></Link>
      <div><span>PERSONAL ARCHIVE / ROOM 01</span><strong>THE REC ROOM</strong></div>
      <nav><Link href="/bookshelf-archive">Previous concept</Link><Link href="/">Main issue</Link></nav>
    </header>
    <section className={`rec-room-stage ${loaded ? "is-loaded" : ""}`} aria-label="Interactive recreation room">
      <RecRoomScene active={active} onHotspot={openHotspot} onReady={markLoaded} />
      <div className="room-loading" role="status" aria-live="polite"><i /><span>PREPARING THE ROOM</span><strong>雨の夜 / MUMBAI</strong></div>
      <div className="room-weather"><span>MUMBAI / MONSOON STUDY</span><strong>RAIN AT THE WINDOW</strong></div>
      <div className="room-legend" aria-label="Interactive objects">
        {(["library", "watch", "play", "read"] as const).map((hotspot, index) => <button key={hotspot} type="button" onClick={() => openHotspot(hotspot)}><span>0{index + 1}</span>{hotspotCopy[hotspot].title}</button>)}
      </div>
      <p className="room-instruction">SELECT A MARKED OBJECT · ESC TO RETURN</p>
      {active && <article className="room-placeholder" role="dialog" aria-modal="true" aria-label={hotspotCopy[active].title}>
        <button ref={closeButton} type="button" onClick={() => setActive(null)} aria-label="Return to room">×</button>
        <span>{hotspotCopy[active].eyebrow}</span>
        <h1>{hotspotCopy[active].title}</h1>
        <p>{hotspotCopy[active].body}</p>
        <small>INTERFACE ARRIVES IN PHASE 02</small>
      </article>}
    </section>
  </main>;
}
