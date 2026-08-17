import { AssistantPanel } from "./assistant-panel";
import { AgeIssue } from "./age-issue";
import { CoverReader } from "./cover-reader";

const ventures = [
  { name: "DeveLearn", tag: "ARC 01 · EDUCATION", copy: "Technology education, training, and academic programs across AI, data, software, and cybersecurity.", tone: "sun" },
  { name: "Next Platforms", tag: "ARC 02 · SOFTWARE / AI", copy: "Software development, cloud applications, and AI systems for teams and organizations across markets.", tone: "blue" },
  { name: "Zuma", tag: "ARC 03 · LEARNING", copy: "Building toward more personal, intelligent learning experiences for school students.", tone: "red" },
];
const focus = ["Building Zuma AI", "Growing DeveLearn", "Making software and AI systems through Next Platforms", "Exploring agentic AI, product systems, and new technical possibilities"];

const chapterOne = [
  {
    label: "THE CHILDHOOD ARC",
    title: "Curiosity learns its shape.",
    place: "SCHOOL → IIT BOMBAY",
    copy: "Growing up and studying in Mumbai, then college at IIT Bombay—the years that turned curiosity into discipline and made building feel possible.",
    image: "/chapter-1-left.webp?v=20260817-1",
  },
  {
    label: "THE PROFESSIONAL START",
    title: "The work becomes real.",
    place: "TOKYO",
    copy: "Professional life began in Tokyo: learning how ambitious technology takes shape through teams, constraints, patience, and craft.",
    image: "/chapter-1-middle.webp?v=20260817-1",
  },
  {
    label: "THE ADULT CHAPTER",
    title: "Building on my own terms.",
    place: "INDIA · NOW",
    copy: "The current chapter is based in India—building companies, products, and experiments across education, software, and AI.",
    image: "/chapter-1-right.webp?v=20260817-1",
  },
];

export default function Home() {
  const assistantApiUrl = process.env.NEXT_PUBLIC_ASSISTANT_API_URL;
  return <main id="top">
    <header className="issue-nav" aria-label="Primary navigation"><a className="issue-mark" href="#top" aria-label="Akshat Kadam, home">AK<span>!</span></a><p className="issue-number">PERSONAL ARCHIVE / ISSUE <AgeIssue /></p><nav><a href="#origin">Origin</a><a href="#work">Arcs</a><a href="#now">Now</a></nav></header>
    <CoverReader />
    <section className="origin-spread" id="origin" aria-labelledby="origin-title"><div className="spread-heading"><p>CHAPTER 01</p><span id="origin-title">THREE TIMES, ONE LIFE</span><p>PAGE 004</p></div><div className="life-panels">{chapterOne.map((panel, index) => <article className="life-panel" key={panel.label}><div className="life-panel-image"><img src={panel.image} alt="" /></div><div className="life-panel-copy"><div className="life-panel-meta"><span>0{index + 1}</span><p>{panel.label}</p></div><h2>{panel.title}</h2><strong>{panel.place}</strong><p>{panel.copy}</p></div></article>)}</div></section>
    <section className="arc-section" id="work" aria-labelledby="work-title"><div className="section-ribbon"><span>THE BUILDER ARC</span><span>THE BUILDER ARC</span><span>THE BUILDER ARC</span></div><div className="arc-intro"><p className="chapter-label">CHAPTER 02 / BUILDING</p><h2 id="work-title">Three things<br /><em>in motion.</em></h2><p>Companies and products are not trophies here. They are ongoing storylines: problems worth staying with, people worth building for, and experiments still unfolding.</p></div><div className="venture-panels">{ventures.map((venture, index) => <article className={`venture-panel ${venture.tone}`} key={venture.name}><div className="venture-top"><span>{venture.tag}</span><b>0{index + 1}</b></div><h3>{venture.name}</h3><p>{venture.copy}</p><span className="venture-action">Open this arc <i aria-hidden="true">↗</i></span></article>)}</div></section>
    <section className="now-spread" id="now" aria-labelledby="now-title"><div className="now-art" aria-hidden="true"><span>NOW</span><i>✦</i><b>2026</b></div><div className="now-copy"><p className="chapter-label">CHAPTER 03 / THE PRESENT TENSE</p><h2 id="now-title">What&apos;s got<br />my attention.</h2><ol>{focus.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ol></div></section>
    <section className="interlude" aria-labelledby="interlude-title"><p className="chapter-label">EXTRA PAGES / INNER LIFE</p><h2 id="interlude-title">Manga. Anime.<br />Pokémon. <em>Always.</em></h2><p>The things that make a life vivid belong in the record too. This issue will keep growing—new projects, new places, and side stories included.</p><span className="interlude-sound">ドン!</span></section>
    <AssistantPanel apiBaseUrl={assistantApiUrl} />
    <footer className="issue-footer" id="contact"><div><p>AKSHAT KADAM</p><span>ENTREPRENEUR · TECHNOLOGIST</span></div><p>THE STORY IS STILL<br />BEING DRAWN.</p><div className="footer-links"><a href="mailto:hello@akshatkadam.com">Email ↗</a><a href="#top">Back to cover ↑</a></div></footer>
  </main>;
}
