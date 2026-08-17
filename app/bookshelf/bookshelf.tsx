"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BookshelfScene } from "./bookshelf-scene";
import { cabinetNames, libraryVolumes, type LibraryVolume } from "./library-data";

export function Bookshelf() {
  const [cabinet, setCabinet] = useState(0);
  const [selected, setSelected] = useState<LibraryVolume | null>(null);
  const [substackPosts, setSubstackPosts] = useState<Array<{ link: string; summary: string; title: string; type: string }>>([]);
  const selectVolume = useCallback((volume: LibraryVolume) => setSelected(volume), []);
  const changeCabinet = (direction: number) => {
    setSelected(null);
    setCabinet((current) => (current + direction + cabinetNames.length) % cabinetNames.length);
  };
  useEffect(() => {
    fetch("/api/library").then((response) => response.ok ? response.json() : null).then((data) => setSubstackPosts(data?.posts ?? [])).catch(() => undefined);
  }, []);
  const currentPost = selected?.source === "SUBSTACK" ? substackPosts.find((post) => post.type === selected.id) ?? substackPosts[0] : undefined;

  return <main className="library-page">
    <header className="library-nav"><Link className="issue-mark" href="/" aria-label="Akshat Kadam, home">AK<span>!</span></Link><p>PERSONAL ARCHIVE / THE LIBRARY</p><Link href="/">← Back to the story</Link></header>
    <section className="library-header"><div><p>SIDE STORY 01 / THE PERSONAL CANON</p><h1>THE LIBRARY</h1></div><p>Essays, philosophies, and notes arrive from Substack. Everything else is catalogued here.</p></section>
    <section className="library-stage" aria-label="Akshat's library">
      <BookshelfScene cabinet={cabinet} onSelect={selectVolume} selectedId={selected?.id ?? null} />
      <div className="cabinet-label"><span>BOOKCASE 0{cabinet + 1}</span><strong>{cabinetNames[cabinet]}</strong></div>
      <button className="cabinet-arrow cabinet-prev" type="button" onClick={() => changeCabinet(-1)} aria-label="Previous bookcase">←</button>
      <button className="cabinet-arrow cabinet-next" type="button" onClick={() => changeCabinet(1)} aria-label="Next bookcase">→</button>
      <div className="cabinet-dots" aria-label="Choose bookcase">{cabinetNames.map((name, index) => <button key={name} className={index === cabinet ? "is-active" : ""} type="button" onClick={() => { setSelected(null); setCabinet(index); }} aria-label={`Open ${name} bookcase`} />)}</div>
      <p className="library-hint">CLICK A TITLED SPINE · PULL OUT A VOLUME</p>
      {selected && <article className="reading-overlay" aria-live="polite">
        <button type="button" className="reading-close" onClick={() => setSelected(null)} aria-label="Return volume to shelf">×</button>
        <div className={`reading-cover reading-${selected.color}`}><span>VOL. {selected.number}</span><b>{selected.title}</b><i>私<br />物</i><small>AKSHAT KADAM</small></div>
        <div className="reading-gutter" aria-hidden="true" />
        <div className="reading-page"><div className="reading-meta"><span>{selected.type}</span><span>{selected.source === "SUBSTACK" ? "SYNCED FROM SUBSTACK" : "PORTFOLIO CMS"}</span></div><p>{selected.kicker}</p><h2>{currentPost?.title ?? selected.title}</h2><div className="reading-rule"><span>{selected.number}</span></div>{currentPost ? <p className="reading-summary">{currentPost.summary}</p> : <ol>{selected.notes.map((note, index) => <li key={note}><span>0{index + 1}</span>{note}</li>)}</ol>}{currentPost ? <a className="reading-action" href={currentPost.link} target="_blank" rel="noreferrer">READ ON SUBSTACK ↗</a> : selected.source === "SUBSTACK" ? <span className="reading-status">ADD SUBSTACK_FEED_URL TO SYNC</span> : <span className="reading-status">CATALOGUE IN PROGRESS</span>}</div>
      </article>}
    </section>
    <section className="library-index"><p>CATALOGUE / 12 FEATURED VOLUMES</p><div>{libraryVolumes.map((volume) => <button key={volume.id} type="button" onClick={() => { setCabinet(volume.cabinet); window.setTimeout(() => setSelected(volume), 420); }}><span>{volume.number}</span><strong>{volume.title}</strong><i>{volume.source}</i></button>)}</div></section>
    <footer className="shelf-footer"><span>図書館 / TOSHOKAN</span><p>MORE SHELVES.<br />MORE SIDE STORIES.</p><Link href="/">Return to Issue →</Link></footer>
  </main>;
}
