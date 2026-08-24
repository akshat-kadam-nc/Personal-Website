"use client";

import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, type PointerEvent, useEffect, useRef, useState } from "react";

const projects = [
  { id:"rec-room", issue:"01", title:"REC ROOM", status:"LIVE / ACTIVE", summary:"A multi-tenant home for the things people make, watch, read, play, and keep.", story:"Rec Room began as a personal digital recreation room, then grew into a product that can give each person their own space. It brings writing, recommendations, books, film, television, games, music, and saved links under one roof.", detail:"The interesting problem is not another tracker. It is making a room feel inhabited while keeping publishing and administration practical.", stack:["Next.js","TypeScript","MongoDB","Auth"], repo:"https://github.com/akshat-kadam-nc/Rec-Room", live:"https://rec-room-inky.vercel.app" },
  { id:"dayforge", issue:"02", title:"DAYFORGE", status:"LIVE / FEATURE COMPLETE", summary:"A time-management PWA that shows where the day is going and how much remains.", story:"Dayforge turns a day into a live operating surface: time budgets, concurrent timers, timeboxing, chores, interruptions, goals, delegation, reports, and Google Calendar sync.", detail:"The central experiment was visibility. Plans are useful, but a truthful real-time picture of the day changes how the next hour gets used.", stack:["MERN","TypeScript","PWA","Google Calendar"], repo:"https://github.com/akshat-kadam-nc/Dayforge", live:"https://dayforge-server.vercel.app" },
  { id:"pokemon-destiny", issue:"03", title:"POKÉMON DESTINY", status:"WORK IN PROGRESS", summary:"A fan-made Pokémon adventure set in the original Norse-inspired region of Volua.", story:"Pokémon Destiny is a non-commercial fan game built with Pokémon Essentials and RPG Maker XP. Its first polished slice runs from the prologue on Eyjaf Island to Ibitha City, with early maps, encounters, and following Pokémon in place.", detail:"This is the long game: worldbuilding, mapping, pacing, systems, and original art meeting inside one playable place.", stack:["RPG Maker XP","Pokémon Essentials","Ruby","Worldbuilding"], repo:"https://github.com/AkshatKadam/Pokemon-Destiny" },
] as const;
type Project = (typeof projects)[number];

function Cover({project,active,offset,onSelect,onNavigate}:{project:Project;active:boolean;offset:number;onSelect:()=>void;onNavigate:(direction:number)=>void}) {
  const style={"--offset":offset,"--depth":Math.abs(offset)} as CSSProperties;
  const art=project.id==="rec-room"?"/rec-room-window-desktop.webp":project.id==="dayforge"?"/projects-dayforge-bg.webp":"/projects-pokemon-destiny-map.webp";
  return <button className={"quest-cover quest-cover--"+project.id+(active?" is-active":"")} style={style} onClick={onSelect} onKeyDown={event=>{if(event.key==="ArrowLeft")onNavigate(-1);if(event.key==="ArrowRight")onNavigate(1)}} aria-pressed={active}>
    <span className="cover-issue">SIDE QUEST / {project.issue}</span><span className="cover-art" aria-hidden="true"><Image src={art} alt="" fill sizes="(max-width: 700px) 68vw, 30vw"/></span><strong>{project.title}</strong><span className="cover-status">{project.status}</span>
  </button>;
}

function ChapterArt({project}:{project:Project}) {
  if(project.id==="rec-room") return <div className="chapter-art rec-room-art"><Image src="/rec-room-diorama-desktop.webp" alt="A miniature recreation room with books, records, games, and a writing desk" fill sizes="(max-width: 900px) 100vw, 64vw"/><span>ROOM 01</span><div className="chapter-insets" aria-hidden="true"><i/><i/><i/></div></div>;
  if(project.id==="dayforge") return <div className="chapter-art dayforge-art"><Image src="/projects-dayforge-bg.webp" alt="Dayforge interface artwork" fill sizes="(max-width: 900px) 100vw, 64vw"/><div className="dayforge-dial"><b>24</b><span>HOURS<br/>IN VIEW</span></div><Image className="dayforge-mark" src="/projects-dayforge-wordmark.webp" alt="Dayforge" width={360} height={100}/><div className="time-shards" aria-hidden="true"><i>00:25:00</i><i>15 / TODAY</i></div></div>;
  return <div className="chapter-art destiny-art"><Image src="/projects-pokemon-destiny-map.webp" alt="Map from the Volua region in Pokémon Destiny" fill sizes="(max-width: 900px) 100vw, 64vw"/><Image className="destiny-mark" src="/projects-pokemon-destiny-title.webp" alt="Pokémon Destiny" width={420} height={190}/><span>VOLUA REGION</span><div className="route-line" aria-hidden="true"><i/><i/><i/><i/></div></div>;
}

export function ProjectArchive() {
  const [active,setActive]=useState(0);
  const pointerStart=useRef<number|null>(null);
  const chapterRef=useRef<HTMLElement>(null);
  const project=projects[active];
  useEffect(()=>{const id=new URLSearchParams(window.location.search).get("project");const found=projects.findIndex(item=>item.id===id);if(found>=0)window.setTimeout(()=>setActive(found),0)},[]);
  const select=(index:number)=>{const next=(index+projects.length)%projects.length;setActive(next);window.history.replaceState(null,"","?project="+projects[next].id)};
  const openChapter=()=>chapterRef.current?.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
  const onPointerUp=(event:PointerEvent<HTMLDivElement>)=>{if(pointerStart.current===null)return;const movement=event.clientX-pointerStart.current;if(Math.abs(movement)>45)select(active+(movement<0?1:-1));pointerStart.current=null};
  return <main className="projects-page" id="projects-main"><a className="projects-skip" href="#quests-heading">Skip to projects</a>
    <header className="projects-nav"><Link className="issue-mark" href="/" aria-label="Akshat Kadam, home"><Image src="/favicon.svg" alt="" width={48} height={48}/></Link><p>PERSONAL WORK / ISSUE 01</p><nav aria-label="Projects navigation"><Link href="/bookshelf">Bookshelf</Link><Link href="/">Main issue</Link></nav></header>
    <section className="quest-library" aria-labelledby="quests-heading">
      <div className="quest-heading"><span>SELECTED PERSONAL WORK</span><h1 id="quests-heading">Side Quests</h1><p>Three projects worth keeping. Browse the covers, then open a chapter.</p></div>
      <div className="carousel-shell"><button type="button" className="carousel-arrow carousel-arrow--previous" onClick={()=>select(active-1)} aria-label="Previous project">←</button>
        <div className="quest-carousel" role="group" aria-roledescription="carousel" aria-label="Personal projects" onPointerDown={event=>{pointerStart.current=event.clientX}} onPointerUp={onPointerUp}>
          {projects.map((item,index)=>{let offset=index-active;if(offset>1)offset-=projects.length;if(offset < -1)offset+=projects.length;return <Cover key={item.id} project={item} active={index===active} offset={offset} onSelect={()=>select(index)} onNavigate={direction=>select(active+direction)}/>})}
        </div><button type="button" className="carousel-arrow carousel-arrow--next" onClick={()=>select(active+1)} aria-label="Next project">→</button></div>
      <div className="quest-caption" aria-live="polite"><span>{project.issue} / 03</span><div><strong>{project.title}</strong><p>{project.summary}</p></div><button type="button" onClick={openChapter}>Open chapter <span aria-hidden="true">↘</span></button></div>
    </section>
    <section className={"project-chapter project-chapter--"+project.id} ref={chapterRef} id={"chapter-"+project.id} aria-labelledby="chapter-title">
      <ChapterArt project={project}/><article className="chapter-copy"><div className="chapter-kicker"><span>CHAPTER {project.issue}</span><b>{project.status}</b></div><h2 id="chapter-title">{project.title}</h2><p className="chapter-lede">{project.story}</p><p>{project.detail}</p><ul aria-label="Technology and disciplines">{project.stack.map(item=><li key={item}>{item}</li>)}</ul><div className="chapter-actions">{"live" in project&&<Link href={project.live} target="_blank" rel="noreferrer">Visit live <span aria-hidden="true">↗</span></Link>}<Link href={project.repo} target="_blank" rel="noreferrer">View repository <span aria-hidden="true">↗</span></Link></div>{project.id==="pokemon-destiny"&&<small>Non-commercial fan project. Pokémon is owned by Nintendo, Game Freak, and The Pokémon Company.</small>}</article>
    </section>
    <footer className="projects-footer"><span>AK! / SIDE QUESTS</span><p>Only the side quests worth keeping.</p><Link href="/">Return to main issue →</Link></footer>
  </main>;
}
