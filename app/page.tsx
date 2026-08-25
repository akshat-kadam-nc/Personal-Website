import Image from "next/image";
import { AssistantPanel } from "./assistant-panel";
import { AgeIssue } from "./age-issue";
import { CoverReader } from "./cover-reader";
import "./home-95.css";

const ventures = [
  { name: "DeveLearn", tag: "EDUCATION", copy: "Technology education, training, and academic programs across AI, data, software, and cybersecurity.", image: "/home-95-develearn.webp", href: "https://develearn.in" },
  { name: "Next Platforms", tag: "SOFTWARE / AI", copy: "Software development, cloud applications, and AI systems for teams and organizations across markets.", image: "/home-95-next-platforms.webp", href: "https://nextplatforms.in" },
  { name: "Zuma", tag: "LEARNING", copy: "Building toward more personal, intelligent learning experiences for school students.", image: "/home-95-zuma.webp", href: "https://zuma.co.in" },
];
const focus = ["Building Zuma AI", "Growing DeveLearn", "Making software and AI systems through Next Platforms", "Exploring agentic AI, product systems, and new technical possibilities"];

const chapterOne = [
  {
    label: "THE CHILDHOOD ARC",
    title: "Curiosity learns its shape.",
    place: "SCHOOL → IIT BOMBAY",
    copy: "Growing up and studying in Mumbai, then college at IIT Bombay—the years that turned curiosity into discipline and made building feel possible.",
    image: "/chapter-1-left.webp",
  },
  {
    label: "THE PROFESSIONAL START",
    title: "The work becomes real.",
    place: "TOKYO",
    copy: "Professional life began in Tokyo: learning how ambitious technology takes shape through teams, constraints, patience, and craft.",
    image: "/chapter-1-middle.webp",
  },
  {
    label: "THE ADULT CHAPTER",
    title: "Building on my own terms.",
    place: "INDIA · NOW",
    copy: "The current chapter is based in India—building companies, products, and experiments across education, software, and AI.",
    image: "/chapter-1-right.webp",
  },
];

export default function Home() {
  return <main id="top">
    <header className="issue-nav" aria-label="Primary navigation"><a className="issue-mark" href="#top" aria-label="Akshat Kadam, home"><img src="/favicon.svg" alt="" /></a><p className="issue-number">PERSONAL ARCHIVE / ISSUE <AgeIssue /></p><nav><a href="#origin">My Story</a><a href="#work">9–5</a><a href="#now">5–9</a><a href="/projects">Projects</a><a href="/bookshelf">Bookshelf</a></nav></header>
    <CoverReader />
    <section className="origin-spread" id="origin" aria-labelledby="origin-title"><div className="spread-heading"><p>MY STORY</p><span id="origin-title">HOW&apos;D WE GOT HERE ANYWAY?</span><p>PAGE 004</p></div><div className="life-panels">{chapterOne.map((panel, index) => <article className="life-panel" key={panel.label}><div className="life-panel-image"><img src={panel.image} alt="" /></div><div className="life-panel-copy"><div className="life-panel-meta"><span>0{index + 1}</span><p>{panel.label}</p></div><h2>{panel.title}</h2><strong>{panel.place}</strong><p>{panel.copy}</p></div></article>)}</div></section>
    <section className="arc-section work-battle" id="work" aria-labelledby="work-title">
      <header className="work-battle-header"><p>9–5 / HUSTLE AND BUSTLE</p><h2 id="work-title">The work.</h2></header>
      <div className="work-battle-panels">
        {ventures.map((venture, index) => <article className={`work-front work-front-${index + 1}`} key={venture.name}>
          <Image src={venture.image} alt="" fill sizes={index === 1 ? "46vw" : "30vw"} />
          <div className="work-front-copy"><span>0{index + 1} / {venture.tag}</span><h3>{venture.name}</h3><p>{venture.copy}</p><a href={venture.href} target="_blank" rel="noreferrer">Visit website <i aria-hidden="true">↗</i></a></div>
        </article>)}
        <div className="work-ink-rupture" aria-hidden="true" />
      </div>
    </section>
    <section className="now-spread" id="now" aria-labelledby="now-title"><div className="now-art" aria-hidden="true"><span>5–9</span><i>✦</i><b>2026</b></div><div className="now-copy"><p className="chapter-label">5–9 / WHAT&apos;S NOT IN MY RESUME</p><h2 id="now-title">What&apos;s got<br />my attention.</h2><ol>{focus.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ol></div></section>
    <section className="interlude" aria-labelledby="interlude-title"><p className="chapter-label">EXTRA PAGES / INNER LIFE</p><h2 id="interlude-title">Manga. Anime.<br />Pokémon. <em>Always.</em></h2><p>The things that make a life vivid belong in the record too. This issue will keep growing—new projects, new places, and side stories included.</p><span className="interlude-sound">ドン!</span></section>
    <AssistantPanel />
    <footer className="issue-footer" id="contact"><div><p>AKSHAT KADAM</p><span>ENTREPRENEUR · TECHNOLOGIST</span></div><p>THE STORY IS STILL<br />BEING DRAWN.</p><div className="footer-links"><a href="mailto:hello@akshatkadam.com">Email ↗</a><a href="#top">Back to cover ↑</a></div></footer>
  </main>;
}
