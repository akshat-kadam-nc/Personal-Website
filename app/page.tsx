import Image from "next/image";
import { AgeIssue } from "./age-issue";
import { AfterHours } from "./after-hours";
import { CoverReader } from "./cover-reader";
import "./home-95.css";
import "./home-59.css";
import "./home-inner-life.css";
import "./home-nav.css";

const ventures = [
  { name: "DeveLearn", tag: "EDUCATION", copy: "Technology education, training, and academic programs across AI, data, software, and cybersecurity.", image: "/home-95-develearn.webp", href: "https://develearn.in" },
  { name: "Next Platforms", tag: "SOFTWARE / AI", copy: "Software development, cloud applications, and AI systems for teams and organizations across markets.", image: "/home-95-next-platforms-startup.webp", href: "https://nextplatforms.in" },
  { name: "Zuma", tag: "LEARNING", copy: "Building toward more personal, intelligent learning experiences for school students.", image: "/home-95-zuma.webp", href: "https://zuma.co.in" },
];

const chapterOne = [
  {
    label: "THE CHILDHOOD ARC",
    title: "Curiosity learns its shape.",
    place: "SCHOOL → IIT BOMBAY",
    copy: "Growing up and studying in Mumbai, then college at IIT Bombay. Those years turned curiosity into discipline and made building feel possible.",
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
    copy: "The current chapter is based in India, building companies, products, and experiments across education, software, and AI.",
    image: "/chapter-1-right.webp",
  },
];

export default function Home() {
  return <main id="top">
    <a className="site-skip" href="#origin">Skip to story</a>
    <header className="issue-nav" aria-label="Primary navigation">
      <a className="issue-mark" href="#top" aria-label="Akshat Kadam, home"><Image src="/favicon.svg" alt="" width={48} height={48} /></a>
      <p className="issue-number">PERSONAL ARCHIVE / ISSUE <AgeIssue /></p>
      <nav className="issue-nav-primary"><a href="/projects">Projects</a><a href="https://rec-room.life/akshat" target="_blank" rel="noreferrer">Rec Room</a></nav>
      <details className="issue-menu">
        <summary aria-label="Open navigation"><span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" /></summary>
        <nav aria-label="Mobile navigation"><a href="/projects">Projects</a><a href="https://rec-room.life/akshat" target="_blank" rel="noreferrer">Rec Room</a></nav>
      </details>
    </header>
    <CoverReader />
    <section className="origin-spread" id="origin" aria-labelledby="origin-title"><div className="spread-heading"><p>MY STORY</p><h2 id="origin-title">HOW&apos;D WE GOT HERE ANYWAY?</h2><p>PAGE 004</p></div><div className="life-panels">{chapterOne.map((panel, index) => <article className="life-panel" key={panel.label}><div className="life-panel-image"><Image src={panel.image} alt="" fill sizes="(max-width: 800px) 100vw, 33vw" /></div><div className="life-panel-copy"><div className="life-panel-meta"><span>0{index + 1}</span><p>{panel.label}</p></div><h2>{panel.title}</h2><strong>{panel.place}</strong><p>{panel.copy}</p></div></article>)}</div></section>
    <section className="arc-section work-battle" id="work" aria-labelledby="work-title">
      <header className="work-battle-header"><p>9–5 / HUSTLE AND BUSTLE</p><h2 id="work-title">The work.</h2></header>
      <div className="work-battle-panels">
        {ventures.map((venture, index) => <article className={`work-front work-front-${index + 1}`} key={venture.name}>
          <Image src={venture.image} alt="" fill sizes={index === 1 ? "46vw" : "30vw"} />
          <div className="work-front-copy"><span>0{index + 1} / {venture.tag}</span><h3>{venture.name}</h3><p>{venture.copy}</p><a href={venture.href} target="_blank" rel="noreferrer">Visit website <i aria-hidden="true">↗</i></a></div>
        </article>)}
      </div>
    </section>
    <AfterHours />
    <section className="interlude inner-life" aria-labelledby="interlude-title">
      <Image
        className="inner-life-art"
        src="/home-inner-life-nika.webp"
        alt="Nika floating beneath a night sky filled with lanterns"
        fill
        sizes="100vw"
      />
      <div className="inner-life-ink" aria-hidden="true" />
      <div className="inner-life-copy">
        <p className="chapter-label" id="interlude-title">EXTRA PAGES / INNER LIFE</p>
        <p>This issue will keep growing: new projects, new places, and side stories included.</p>
      </div>
      <span className="interlude-sound" aria-hidden="true">ドン!</span>
    </section>
    <footer className="issue-footer" id="contact"><div><p>AKSHAT KADAM</p><span>ENTREPRENEUR · TECHNOLOGIST</span></div><p>THE STORY IS STILL<br />BEING DRAWN.</p><div className="footer-links"><a href="mailto:hello@akshatkadam.com">Email ↗</a><a href="#top">Back to cover ↑</a></div></footer>
  </main>;
}
