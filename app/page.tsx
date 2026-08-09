const ventures = [
  {
    name: "DeveLearn",
    label: "Education",
    description:
      "Technology education, training, and academic programs across AI, data, software, and cybersecurity.",
  },
  {
    name: "Next Platforms",
    label: "Software & AI",
    description:
      "Software development, cloud applications, and AI systems for Indian and Japanese organizations.",
  },
  {
    name: "Zuma",
    label: "Learning products",
    description:
      "Building toward more personal, intelligent learning experiences for school students.",
  },
];

const currentFocus = [
  "Building Zuma AI",
  "Growing DeveLearn",
  "Developing software and AI systems through Next Platforms",
  "Exploring agentic AI and India–Japan technology opportunities",
];

const chapters = ["IIT Bombay", "Japan", "Sony", "Entrepreneurship", "AI & education"];

export default function Home() {
  const agentUrl = process.env.NEXT_PUBLIC_AGENT_URL;

  return (
    <main>
      <header className="site-header" aria-label="Primary navigation">
        <a className="wordmark" href="#top" aria-label="Akshat Kadam, home">
          AK
        </a>
        <nav className="desktop-nav">
          <a href="#work">Work</a>
          <a href="#now">Now</a>
          <a href="#about">About</a>
        </nav>
        <a className="header-action" href="#contact">
          Get in touch <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <p className="eyebrow">Mumbai, India · Japan</p>
        <h1 id="hero-title">Akshat Kadam</h1>
        <p className="hero-copy">
          Entrepreneur, technologist, and product builder working across
          education, AI, and India–Japan technology.
        </p>
        <div className="hero-links">
          <a href="#work">Explore the work <span aria-hidden="true">↓</span></a>
          <a href="#about">A little more about me <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section className="intro-grid" id="about" aria-labelledby="about-title">
        <p className="section-kicker">01 / Context</p>
        <div>
          <h2 id="about-title">Building with a wide lens.</h2>
          <p>
            I am an IIT Bombay alumnus based in Mumbai. My work moves between
            technology, education, research, product strategy, and cross-border
            business. Five formative years in Japan—including time at Sony—made
            that last part a lasting thread.
          </p>
          <p>
            This is a developing record of the companies, products, questions,
            and places that shape my work.
          </p>
        </div>
      </section>

      <section className="currently" id="now" aria-labelledby="now-title">
        <div className="section-heading">
          <div>
            <p className="section-kicker">02 / Currently</p>
            <h2 id="now-title">What has my attention.</h2>
          </div>
          <p className="updated">Updated August 2026</p>
        </div>
        <ol className="focus-list">
          {currentFocus.map((focus, index) => (
            <li key={focus}>
              <span>0{index + 1}</span>
              <p>{focus}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="work" id="work" aria-labelledby="work-title">
        <div className="section-heading">
          <div>
            <p className="section-kicker">03 / Ventures</p>
            <h2 id="work-title">Places I&apos;m building from.</h2>
          </div>
          <a className="text-link" href="#contact">View all work <span aria-hidden="true">↗</span></a>
        </div>
        <div className="venture-list">
          {ventures.map((venture, index) => (
            <article className="venture" key={venture.name}>
              <span className="venture-number">0{index + 1}</span>
              <div>
                <p className="venture-label">{venture.label}</p>
                <h3>{venture.name}</h3>
              </div>
              <p className="venture-description">{venture.description}</p>
              <span className="venture-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="agent" id="agent" aria-labelledby="agent-title">
        <p className="section-kicker">04 / In the workshop</p>
        <div className="agent-content">
          <div>
            <p className="agent-label">A separate build</p>
            <h2 id="agent-title">An AI assistant is taking shape.</h2>
          </div>
          <div>
            <p>
              A companion AI agent is being developed independently. This page
              is ready to become its home when the experience is ready to share.
            </p>
            {agentUrl ? (
              <a className="button" href={agentUrl}>
                Open the AI assistant <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <p className="agent-note">
                Connect it by setting <code>NEXT_PUBLIC_AGENT_URL</code>.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="chapters" aria-labelledby="chapters-title">
        <p className="section-kicker">05 / Chapters</p>
        <h2 id="chapters-title">A path still in motion.</h2>
        <div className="chapter-row">
          {chapters.map((chapter, index) => (
            <span key={chapter}>
              {chapter}
              {index < chapters.length - 1 && <i aria-hidden="true">·</i>}
            </span>
          ))}
        </div>
      </section>

      <footer className="site-footer" id="contact">
        <div>
          <p className="footer-name">Akshat Kadam</p>
          <p>Mumbai, India</p>
        </div>
        <p className="footer-statement">
          Building things across technology, education, and India ↔ Japan.
        </p>
        <div className="footer-links">
          <a href="mailto:hello@akshatkadam.com">Email</a>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </main>
  );
}
