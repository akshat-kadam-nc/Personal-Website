"use client";

import Image from "next/image";
import { type CSSProperties, type PointerEvent as ReactPointerEvent, type TouchEvent as ReactTouchEvent, type WheelEvent as ReactWheelEvent, useEffect, useRef, useState } from "react";

const areas = [
  { label: "Fitness / lifting", share: 20, start: 0, end: 20 },
  { label: "Building side projects", share: 15, start: 20, end: 35, href: "/projects" },
  { label: "Gaming, OTT and infotainment / YouTube", share: 30, start: 35, end: 65, href: "/bookshelf" },
  { label: "Exploring agentic AI, product systems, and new technical possibilities", share: 25, start: 65, end: 90 },
  { label: "Doomscrolling. A work in progress.", share: 10, start: 90, end: 100 },
] as const;

export function AfterHours() {
  const [active, setActive] = useState<number | null>(null);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const sectionRef = useRef<HTMLElement>(null);
  const touchStartY = useRef<number | null>(null);
  const sectionVisible = useRef(false);
  const reversing = active === 4 || scrollDirection === "up";

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(([entry]) => {
      sectionVisible.current = entry.isIntersecting && entry.intersectionRatio > 0.18;
    }, { threshold: [0, 0.18, 0.5] });
    observer.observe(section);

    const readKeyboardDirection = (event: KeyboardEvent) => {
      if (!sectionVisible.current) return;
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select, [contenteditable='true']")) return;
      if (["ArrowUp", "PageUp", "Home"].includes(event.key) || (event.key === " " && event.shiftKey)) setScrollDirection("up");
      if (["ArrowDown", "PageDown", "End"].includes(event.key) || (event.key === " " && !event.shiftKey)) setScrollDirection("down");
    };
    window.addEventListener("keydown", readKeyboardDirection);
    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", readKeyboardDirection);
    };
  }, []);


  const readScrollDirection = (event: ReactWheelEvent<HTMLElement>) => {
    if (event.deltaY === 0) return;
    const next = event.deltaY < 0 ? "up" : "down";
    setScrollDirection((current) => current === next ? current : next);
  };

  const rememberTouch = (event: ReactTouchEvent<HTMLElement>) => {
    touchStartY.current = event.changedTouches[0]?.clientY ?? null;
  };

  const readTouchDirection = (event: ReactTouchEvent<HTMLElement>) => {
    const start = touchStartY.current;
    const end = event.changedTouches[0]?.clientY;
    touchStartY.current = null;
    if (start === null || end === undefined || Math.abs(end - start) < 24) return;
    setScrollDirection(end > start ? "up" : "down");
  };

  const toggleTouchArea = (event: ReactPointerEvent<HTMLElement>, index: number) => {
    if (event.pointerType !== "touch") return;
    event.preventDefault();
    setActive((current) => current === index ? null : index);
  };

  return <section ref={sectionRef} onTouchStart={rememberTouch} onTouchEnd={readTouchDirection} className={"now-spread after-hours" + (reversing ? " is-reversing" : "")} id="now" aria-labelledby="now-title" onWheel={readScrollDirection}>
    <div className="after-hours-visual" onMouseLeave={() => setActive(null)}>
      <div className="after-hours-poster-layer after-hours-poster-dio"><Image className="after-hours-poster-media" src="/home-59-poster-bw.webp" alt="A black-and-white manga poster" fill sizes="(max-width: 900px) 100vw, 54vw" /></div>
      <div className="after-hours-poster-layer after-hours-poster-killer"><Image className="after-hours-poster-media" src="/home-59-killer-queen-bw.webp" alt="Killer Queen rendered as a black-and-white manga poster" fill sizes="(max-width: 900px) 100vw, 54vw" /></div>
      <div className="watch-assembly">
        <div className="watch-shift">
        <div className="watch-image-shell" aria-hidden="true"><Image className="after-hours-watch" src="/home-59-watch-cutout-v2.webp" alt="" fill sizes="(max-width: 900px) 88vw, 45vw" /></div>
        <div className={"watch-interface" + (active === null ? "" : " has-active")} aria-label="Explore the off-hours watch">
          <div className="watch-orbits" aria-hidden="true">
            {areas.map((item, index) => <span key={item.label} className={"watch-orbit watch-orbit-" + (index + 1) + (active === index ? " is-active" : "")} style={{ "--arc-start": item.start + "%", "--arc-end": item.end + "%" } as CSSProperties} />)}
          </div>
          <span className="watch-motion-ring watch-motion-ring-outer" aria-hidden="true" />
          <span className="watch-motion-ring watch-motion-ring-inner" aria-hidden="true" />
          <span className="watch-hand watch-hand-hour" aria-hidden="true" />
          <span className="watch-hand watch-hand-minute" aria-hidden="true" />
          <span className="watch-pin" aria-hidden="true" />
          {areas.map((item, index) => {
            const midpoint = (item.start + item.end) / 2;
            const angle = (midpoint - 10) * 3.6 * Math.PI / 180;
            const markerStyle = {
              left: 50 + 47 * Math.sin(angle) + "%",
              top: 50 - 47 * Math.cos(angle) + "%",
            } as CSSProperties;
            const shared = { className: "watch-marker" + (active === index ? " is-active" : ""), style: markerStyle, onMouseEnter: () => setActive(index), onFocus: () => setActive(index), onBlur: () => setActive(null), "aria-label": item.label };
            return "href" in item
              ? <a key={item.label} href={item.href} {...shared}><span>{index + 1}</span></a>
              : <button key={item.label} type="button" {...shared} onPointerDown={(event) => toggleTouchArea(event, index)}><span>{index + 1}</span></button>;
          })}
          <span className="watch-centre" aria-hidden="true"><b>5-9</b><small>OFF THE CLOCK</small></span>
        </div>
        </div>
      </div>
      <span className="after-hours-proof" aria-hidden="true">夜</span>
      <p>AN IMPERFECT ACCOUNTING OF TIME</p>
    </div>
    <div className="after-hours-copy">
      <p className="chapter-label">5-9 / WHAT&apos;S NOT IN MY RESUME</p>
      <h2 id="now-title">After hours.</h2>
      <ol>{areas.map((item, index) => <li key={item.label} className={"after-hours-item after-hours-item-" + (index + 1) + (active === index ? " is-active" : "")}>
        {"href" in item
          ? <a href={item.href} onMouseEnter={() => setActive(index)} onMouseLeave={() => setActive(null)} onFocus={() => setActive(index)} onBlur={() => setActive(null)}><span aria-hidden="true">0{index + 1}</span><strong>{item.label}</strong><i aria-hidden="true">↗</i></a>
          : <button type="button" onMouseEnter={() => setActive(index)} onMouseLeave={() => setActive(null)} onFocus={() => setActive(index)} onBlur={() => setActive(null)} onPointerDown={(event) => toggleTouchArea(event, index)}><span aria-hidden="true">0{index + 1}</span><strong>{item.label}</strong>{index === 4 && <small className="doom-warning">DO NOT APPROACH</small>}</button>}
      </li>)}</ol>
    </div>
  </section>;
}





