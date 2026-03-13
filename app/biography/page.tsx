"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { FaArrowLeft, FaArrowRight, FaYoutube, FaBookOpen, FaUsers, FaPlay } from "react-icons/fa"

/* ─── TIMELINE DATA ─── */
const CHAPTERS = [
  {
    year: "1990",
    era: "The Beginning",
    title: "Born into Stillness",
    location: "Bhagalpur, Bihar",
    body: [
      "In the ancient city of Bhagalpur, along the banks of the Ganges, a child was born who would one day ask the questions most people spend a lifetime avoiding.",
      "From his earliest years, Shrawan was different — not in the way prodigies are different, but in the way that truly quiet people are different. He watched. He listened. He felt the weight of unspoken things.",
    ],
    image: "/images/hero1.jpg",
    accent: "Birth",
    side: "left",
  },
  {
    year: "Early\nYears",
    era: "The Questioning",
    title: "A Mind That Could Not Accept",
    location: "Bihar, India",
    body: [
      "While other children absorbed the world around them, the young Shrawan questioned it. Not with rebellion — but with a deep, aching sincerity. Why do we fear? Why do we pretend? Why do we live as if life is something that will begin tomorrow?",
      "He studied the behaviour of people around him with the same attention a scientist gives to an experiment — watching how fear shaped decisions, how love turned possessive, how tradition often masked unexamined hurt.",
    ],
    image: "/images/hero2.jpg",
    accent: "Inquiry",
    side: "right",
  },
  {
    year: "Inner\nJourney",
    era: "The Turning",
    title: "The Discovery of Vedanta",
    location: "Within",
    body: [
      "Somewhere between adolescence and early adulthood, the texts of Vedanta entered his life — not as religion, but as a mirror. The Upanishads, the Bhagavad Gita, the dialogues of Ramana Maharshi — he read them not to believe, but to investigate.",
      "The question 'Who am I?' ceased to be philosophical and became viscerally personal. He sat with it. He let it eat him. And in that dissolution of the certain self, something else — something quieter and more steady — began to emerge.",
    ],
    image: "/images/guruji.jpg",
    accent: "Vedanta",
    side: "left",
  },
  {
    year: "2010s",
    era: "The Emergence",
    title: "The First Words Spoken Aloud",
    location: "Small Gatherings, Bihar",
    body: [
      "What begins in silence eventually demands to be spoken. Guruji's first dialogues were small — a few friends, a handful of seekers, a room that barely fit ten people. But the quality of his inquiry was unmistakable.",
      "He did not preach. He did not give answers. He asked questions that sat in the listener's chest for days. People found that they left his conversations different from how they arrived — not with more beliefs, but with fewer illusions.",
    ],
    image: "/images/hero1.jpg",
    accent: "Speaking",
    side: "right",
  },
  {
    year: "2020",
    era: "The Reach",
    title: "A Voice for the Digital Age",
    location: "YouTube · India & Beyond",
    body: [
      "The pandemic silenced the world — and into that silence, Guruji's voice found its way through screens and speakers into homes across India and beyond. His YouTube channel became a quiet gathering place for those who had lost direction.",
      "Students, professionals, parents, the young and the middle-aged — people who had never sat in a satsang found themselves watching one video, then another, then staying. Something in his directness felt like a cool hand on a feverish forehead.",
    ],
    image: "/images/hero2.jpg",
    accent: "Digital",
    side: "left",
  },
  {
    year: "2024",
    era: "The Book",
    title: "Baccho Ki Parvarish",
    location: "Published, India",
    body: [
      "His first book arrived quietly — as honest things tend to. 'Baccho Ki Parvarish' is not a parenting manual. It is an honest look at what happens inside the adult when they stand before a child: the projections, the fears, the unresolved hungers that masquerade as love.",
      "The book became an invitation to examine oneself before examining one's child. It sold not because of marketing, but because readers felt, on every page, that they were being truly seen.",
    ],
    image: "/images/guruji.jpg",
    accent: "Book",
    side: "right",
  },
  {
    year: "Now",
    era: "The Presence",
    title: "Still Asking. Still Here.",
    location: "Everywhere the Question Lives",
    body: [
      "Guruji Shrawan does not claim to have arrived anywhere. That, perhaps, is the most trustworthy thing about him. He continues to speak, to write, to sit with difficult questions — and to invite others to do the same.",
      "A growing community. A second book in progress. Live sessions, video dialogues, written teachings. But underneath all of it: the same boy from Bhagalpur who refused to stop wondering.",
    ],
    image: "/images/hero1.jpg",
    accent: "Present",
    side: "left",
  },
]

const STATS = [
  { val: "6.2K+", lbl: "Followers Worldwide" },
  { val: "100K+", lbl: "YouTube Views" },
  { val: "30+",   lbl: "Articles Published" },
  { val: "1",     lbl: "Book in Print" },
]

/* ─── HOOKS ─── */
function useInView(threshold = 0.12) {
  const ref = useRef(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setV(true); obs.disconnect() }
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, v }
}

/* ─── CHAPTER COMPONENT ─── */
function Chapter({ item, index }) {
  const { ref, v } = useInView(0.08)
  const isLeft = item.side === "left"

  return (
    <div ref={ref} className={`ch ${v ? "ch-visible" : ""} ch-${item.side}`}
      style={{ transitionDelay: `${index * 60}ms` }}>

      {/* giant year watermark */}
      <div className="ch-year-bg" aria-hidden="true">
        {item.year.split("\n").map((line, i) => (
          <span key={i}>{line}</span>
        ))}
      </div>

      {/* era label */}
      <div className="ch-era">{String(index + 1).padStart(2, "0")} — {item.era}</div>

      <div className="ch-grid">

        {/* text block */}
        <div className="ch-text-col">
          <div className="ch-accent-pill">{item.accent}</div>
          <h2 className="ch-title">{item.title}</h2>
          <div className="ch-location">
            <span className="ch-loc-line" />
            <span className="ch-loc-text">{item.location}</span>
          </div>
          {item.body.map((p, i) => (
            <p key={i} className="ch-body">{p}</p>
          ))}
        </div>

        {/* image block */}
        <div className="ch-img-col">
          <div className="ch-img-frame">
            <Image
              src={item.image}
              alt={item.title}
              fill
              style={{ objectFit: "cover", objectPosition: "center top" }}
              sizes="(max-width:768px) 90vw, 40vw"
            />
            <div className="ch-img-overlay" />
            {/* decorative corner accents */}
            <div className="ch-corner ch-corner-tl" />
            <div className="ch-corner ch-corner-br" />
          </div>
        </div>

      </div>

      {/* chapter separator */}
      {index < CHAPTERS.length - 1 && (
        <div className="ch-sep">
          <div className="ch-sep-line" />
          <div className="ch-sep-diamond" />
          <div className="ch-sep-line" />
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════
   PAGE
════════════════════════════════ */
export default function BiographyPage() {
  const [loaded, setLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setLoaded(true)
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const heroParallax = Math.min(scrollY * 0.35, 140)

  return (
    <main className="bp">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&family=Poppins:wght@300;400;500;600;700&display=swap');

        :root {
          --ink:   #0e0b07;
          --ink2:  #1a1208;
          --ink3:  #261a0e;
          --parch: #f5ede0;
          --parch2:#ede0cc;
          --parch3:#d8c9b0;
          --o:     #c8551a;
          --g:     #b8841a;
          --og:    linear-gradient(135deg, #c8551a, #b8841a);
          --cream: #faf6ef;
          --muted: #8a7060;
          --display: 'Cormorant Garamond', Georgia, serif;
          --body:  'Lora', Georgia, serif;
          --sans:  'Poppins', system-ui, sans-serif;
        }

        @keyframes bp-fadeUp  { from{opacity:0;transform:translateY(50px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bp-fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes bp-lineW   { from{width:0;opacity:0} to{width:100%;opacity:1} }
        @keyframes bp-ticker  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes bp-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes bp-pulse   { 0%{opacity:1} 50%{opacity:.4} 100%{opacity:1} }
        @keyframes bp-scanIn  { from{transform:scaleY(0);transform-origin:top} to{transform:scaleY(1);transform-origin:top} }
        @keyframes bp-chIn    { from{opacity:0;transform:translateY(60px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bp-imgIn   { from{opacity:0;transform:scale(1.04)} to{opacity:1;transform:scale(1)} }
        @keyframes bp-gradMv  { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes bp-yearIn  { from{opacity:0;transform:translateX(-40px)} to{opacity:.06;transform:translateX(0)} }
        @keyframes bp-rightYearIn{from{opacity:0;transform:translateX(40px)}to{opacity:.06;transform:translateX(0)}}

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .bp {
          background: var(--ink);
          color: var(--parch);
          font-family: var(--sans);
          overflow-x: hidden;
          min-height: 100vh;
        }

        /* ══════════════════════
           TOP NAV
        ══════════════════════ */
        .bp-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 48px;
          height: 68px;
          background: rgba(14,11,7,.85);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(245,237,224,.08);
          animation: ${loaded ? "bp-fadeIn .6s ease both" : "none"};
        }
        .bp-nav-back {
          display: inline-flex; align-items: center; gap: 9px;
          font-family: var(--sans); font-size: 11px; font-weight: 600;
          text-transform: uppercase; letter-spacing: .2em;
          color: rgba(245,237,224,.5); text-decoration: none;
          transition: color .22s ease, gap .22s ease;
        }
        .bp-nav-back:hover { color: var(--o); gap: 14px; }
        .bp-nav-logo {
          font-family: var(--display);
          font-size: 20px; font-weight: 700;
          color: var(--parch);
          letter-spacing: .03em;
        }
        .bp-nav-cta {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: var(--sans); font-size: 11px; font-weight: 600;
          text-transform: uppercase; letter-spacing: .16em;
          color: var(--parch); text-decoration: none;
          border: 1px solid rgba(245,237,224,.2);
          padding: 9px 20px; border-radius: 99px;
          transition: background .22s ease, border-color .22s ease, color .22s ease;
        }
        .bp-nav-cta:hover {
          background: var(--o); border-color: var(--o); color: #fff;
        }

        /* ══════════════════════
           HERO — full bleed cinematic
        ══════════════════════ */
        .bp-hero {
          position: relative;
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          overflow: hidden;
          padding-top: 68px;
        }

        /* full bleed photo */
        .bp-hero-photo {
          position: absolute;
          inset: 0;
          will-change: transform;
        }
        /* multi-layer darkening: bottom heavy, left vignette */
        .bp-hero-grad {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background:
            linear-gradient(to top, rgba(14,11,7,1) 0%, rgba(14,11,7,.72) 30%, rgba(14,11,7,.18) 65%, rgba(14,11,7,.4) 100%),
            linear-gradient(to right, rgba(14,11,7,.7) 0%, transparent 55%);
        }
        /* noise grain overlay for film texture */
        .bp-hero-grain {
          position: absolute; inset: 0; z-index: 2; pointer-events: none;
          opacity: .045;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          background-size: 200px 200px;
        }

        /* content over photo */
        .bp-hero-content {
          position: relative; z-index: 3;
          padding: 0 72px 80px;
          max-width: 900px;
        }
        .bp-hero-pre {
          font-family: var(--sans); font-size: 9px; font-weight: 700;
          text-transform: uppercase; letter-spacing: .3em;
          color: var(--o);
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 20px;
          animation: ${loaded ? "bp-fadeIn .8s .3s ease both" : "none"};
          opacity: ${loaded ? 1 : 0};
        }
        .bp-hero-pre::before {
          content: ''; display: block;
          width: 36px; height: 1.5px;
          background: var(--o); border-radius: 1px;
        }
        .bp-hero-name {
          font-family: var(--display);
          font-size: clamp(64px, 10vw, 140px);
          font-weight: 300;
          color: var(--parch);
          line-height: .92;
          letter-spacing: -.02em;
          animation: ${loaded ? "bp-fadeUp 1s .4s ease both" : "none"};
          opacity: ${loaded ? 1 : 0};
        }
        .bp-hero-name em {
          font-style: italic;
          color: var(--o);
        }
        /* animated rule under name */
        .bp-hero-rule {
          height: 1.5px; margin: 28px 0;
          background: linear-gradient(to right, var(--o), var(--g), transparent);
          border-radius: 1px;
          animation: ${loaded ? "bp-lineW 1.2s .9s ease both" : "none"};
          width: ${loaded ? "100%" : "0%"};
          opacity: ${loaded ? 1 : 0};
        }
        .bp-hero-desc {
          font-family: var(--body);
          font-size: clamp(16px, 1.8vw, 21px);
          font-style: italic;
          color: rgba(245,237,224,.72);
          line-height: 1.75;
          max-width: 580px;
          animation: ${loaded ? "bp-fadeUp .9s .7s ease both" : "none"};
          opacity: ${loaded ? 1 : 0};
        }
        .bp-hero-meta {
          display: flex; align-items: center; gap: 32px; flex-wrap: wrap;
          margin-top: 40px;
          animation: ${loaded ? "bp-fadeUp .9s .85s ease both" : "none"};
          opacity: ${loaded ? 1 : 0};
        }
        .bp-hero-meta-item {}
        .bp-hero-meta-val {
          font-family: var(--display); font-size: 28px; font-weight: 600;
          color: var(--o);
        }
        .bp-hero-meta-lbl {
          font-family: var(--sans); font-size: 9px; font-weight: 600;
          text-transform: uppercase; letter-spacing: .18em;
          color: rgba(245,237,224,.4); margin-top: 2px;
        }
        .bp-hero-vsep {
          width: 1px; height: 40px;
          background: rgba(245,237,224,.15);
          flex-shrink: 0;
        }
        .bp-hero-btns {
          display: flex; gap: 12px; flex-wrap: wrap; margin-top: 36px;
          animation: ${loaded ? "bp-fadeUp .9s 1s ease both" : "none"};
          opacity: ${loaded ? 1 : 0};
        }
        .bp-btn-primary {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 15px 32px; border-radius: 0;
          background: linear-gradient(135deg, var(--o), #8a2e06);
          color: #fff; font-family: var(--sans); font-size: 12px; font-weight: 700;
          text-decoration: none; letter-spacing: .1em; text-transform: uppercase;
          box-shadow: 0 6px 24px rgba(200,85,26,.3);
          transition: transform .22s ease, box-shadow .22s ease;
          clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
        }
        .bp-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(200,85,26,.48); }
        .bp-btn-ghost {
          display: inline-flex; align-items: center; gap: 9px;
          padding: 15px 32px; border-radius: 0;
          background: transparent; color: rgba(245,237,224,.78);
          font-family: var(--sans); font-size: 12px; font-weight: 600;
          text-decoration: none; letter-spacing: .1em; text-transform: uppercase;
          border: 1px solid rgba(245,237,224,.25);
          transition: border-color .22s ease, color .22s ease, background .22s ease;
          clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
        }
        .bp-btn-ghost:hover { border-color: rgba(245,237,224,.6); color: #fff; background: rgba(255,255,255,.05); }

        /* scroll cue */
        .bp-scroll-cue {
          position: absolute; bottom: 36px; right: 60px; z-index: 3;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          animation: ${loaded ? "bp-fadeIn 1s 1.4s ease both" : "none"};
          opacity: ${loaded ? 1 : 0};
        }
        .bp-scroll-label {
          font-family: var(--sans); font-size: 8px; font-weight: 600;
          text-transform: uppercase; letter-spacing: .22em;
          color: rgba(245,237,224,.35); writing-mode: vertical-lr;
        }
        .bp-scroll-line {
          width: 1px; height: 48px;
          background: linear-gradient(to bottom, rgba(200,85,26,.8), transparent);
          animation: bp-float 2.2s ease-in-out infinite;
        }

        /* ══════════════════════
           CHAPTER INTRO BAND
        ══════════════════════ */
        .bp-intro-band {
          background: var(--o);
          padding: 20px 0;
          overflow: hidden;
        }
        .bp-intro-track {
          display: flex; width: max-content;
          animation: bp-ticker 24s linear infinite;
        }
        .bp-intro-item {
          font-family: var(--display); font-size: 15px; font-weight: 700;
          font-style: italic; letter-spacing: .08em;
          color: rgba(255,255,255,.78); padding: 0 32px; white-space: nowrap;
        }
        .bp-intro-sep { color: rgba(255,255,255,.3); margin: 0 -16px; }

        /* ══════════════════════
           CHAPTERS WRAPPER
        ══════════════════════ */
        .bp-chapters {
          background: var(--ink);
          position: relative;
        }
        /* long vertical timeline spine */
        .bp-spine {
          position: absolute;
          left: 50%;
          top: 0; bottom: 0;
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(245,237,224,.08) 5%, rgba(245,237,224,.08) 95%, transparent);
          transform: translateX(-50%);
          pointer-events: none;
        }

        /* ── CHAPTER ── */
        .ch {
          position: relative;
          padding: 100px 0 60px;
          overflow: hidden;
        }
        .ch-visible { animation: bp-chIn .9s ease both; }

        /* enormous year watermark */
        .ch-year-bg {
          position: absolute;
          top: 50%; transform: translateY(-50%);
          font-family: var(--display);
          font-size: clamp(160px, 22vw, 320px);
          font-weight: 700;
          line-height: .85;
          letter-spacing: -.04em;
          color: var(--parch);
          opacity: 0;
          display: flex; flex-direction: column; align-items: flex-start;
          pointer-events: none; user-select: none;
          z-index: 0;
        }
        .ch-left .ch-year-bg {
          right: 3%;
          text-align: right; align-items: flex-end;
          animation: bp-yearIn 1s ease both;
        }
        .ch-right .ch-year-bg {
          left: 3%;
          animation: bp-rightYearIn 1s ease both;
        }
        .ch-year-bg.visible { opacity: .06; }

        /* era tag */
        .ch-era {
          text-align: center;
          font-family: var(--sans); font-size: 9px; font-weight: 700;
          text-transform: uppercase; letter-spacing: .3em;
          color: var(--o); margin-bottom: 48px;
          position: relative; z-index: 1;
        }

        /* 2-col grid — alternates direction */
        .ch-grid {
          max-width: 1200px; margin: 0 auto; padding: 0 60px;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 72px; align-items: center;
          position: relative; z-index: 1;
        }
        .ch-right .ch-grid { direction: rtl; }
        .ch-right .ch-grid > * { direction: ltr; }

        /* text col */
        .ch-text-col {}

        .ch-accent-pill {
          display: inline-block;
          font-family: var(--sans); font-size: 9px; font-weight: 700;
          text-transform: uppercase; letter-spacing: .22em;
          color: var(--o);
          border: 1px solid rgba(200,85,26,.4);
          padding: 5px 14px; border-radius: 0;
          margin-bottom: 18px;
          clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
          background: rgba(200,85,26,.08);
        }

        .ch-title {
          font-family: var(--display);
          font-size: clamp(30px, 3.8vw, 52px);
          font-weight: 600;
          color: var(--parch);
          line-height: 1.1;
          letter-spacing: -.02em;
          margin-bottom: 18px;
        }
        .ch-title em { font-style: italic; color: var(--o); }

        .ch-location {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 24px;
        }
        .ch-loc-line {
          display: block; width: 28px; height: 1px;
          background: linear-gradient(to right, var(--o), var(--g));
          border-radius: 1px; flex-shrink: 0;
        }
        .ch-loc-text {
          font-family: var(--sans); font-size: 10px; font-weight: 600;
          text-transform: uppercase; letter-spacing: .2em;
          color: rgba(245,237,224,.4);
        }

        .ch-body {
          font-family: var(--body);
          font-size: clamp(15px, 1.4vw, 17px);
          font-style: italic;
          color: rgba(245,237,224,.68);
          line-height: 1.95;
          margin-bottom: 16px;
        }
        .ch-body:last-child { margin-bottom: 0; }
        /* drop-cap on first paragraph */
        .ch-body:first-of-type::first-letter {
          font-family: var(--display);
          font-size: 4.2em;
          font-weight: 700;
          color: var(--o);
          float: left;
          line-height: .78;
          margin-right: 6px;
          margin-top: 6px;
        }

        /* image col */
        .ch-img-col { position: relative; }
        .ch-img-frame {
          position: relative;
          aspect-ratio: 3/4;
          overflow: hidden;
          border-radius: 0;
          /* cut corners */
          clip-path: polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px));
        }
        .ch-img-frame:hover img { transform: scale(1.04) !important; }
        .ch-img-overlay {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: linear-gradient(135deg, rgba(200,85,26,.15), transparent 55%),
                      linear-gradient(to bottom, transparent 50%, rgba(14,11,7,.5));
        }
        /* corner bracket decorations */
        .ch-corner {
          position: absolute; z-index: 2;
          width: 24px; height: 24px;
          pointer-events: none;
        }
        .ch-corner-tl {
          top: 10px; left: 10px;
          border-top: 1.5px solid var(--o);
          border-left: 1.5px solid var(--o);
        }
        .ch-corner-br {
          bottom: 10px; right: 10px;
          border-bottom: 1.5px solid var(--o);
          border-right: 1.5px solid var(--o);
        }

        /* separator between chapters */
        .ch-sep {
          display: flex; align-items: center; gap: 0;
          margin: 72px auto 0;
          max-width: 600px; padding: 0 60px;
          position: relative; z-index: 1;
        }
        .ch-sep-line {
          flex: 1; height: 1px;
          background: linear-gradient(to right, transparent, rgba(245,237,224,.12), transparent);
        }
        .ch-sep-diamond {
          width: 8px; height: 8px;
          background: var(--o);
          transform: rotate(45deg);
          flex-shrink: 0; margin: 0 12px;
        }

        /* ══════════════════════
           PHILOSOPHY DARK BAND
        ══════════════════════ */
        .bp-phil {
          background: var(--ink2);
          border-top: 1px solid rgba(245,237,224,.06);
          border-bottom: 1px solid rgba(245,237,224,.06);
          padding: 100px 0;
          position: relative; overflow: hidden;
        }
        .bp-phil::after {
          content: 'ॐ';
          position: absolute; right: -20px; bottom: -80px;
          font-size: 500px; color: rgba(245,237,224,.02);
          font-family: serif; pointer-events: none; user-select: none; line-height: 1;
        }
        .bp-phil-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 60px;
          position: relative; z-index: 1;
        }
        .bp-phil-header {
          display: grid; grid-template-columns: 1fr 2fr;
          gap: 60px; align-items: end; margin-bottom: 64px;
        }
        .bp-phil-eyebrow {
          font-family: var(--sans); font-size: 9px; font-weight: 700;
          text-transform: uppercase; letter-spacing: .28em; color: var(--g);
          margin-bottom: 12px;
        }
        .bp-phil-h2 {
          font-family: var(--display);
          font-size: clamp(36px, 4vw, 60px);
          font-weight: 300; font-style: italic;
          color: var(--parch); line-height: 1.1; letter-spacing: -.02em;
        }
        .bp-phil-desc {
          font-family: var(--body); font-size: 16px; font-style: italic;
          color: rgba(245,237,224,.5); line-height: 1.9;
          align-self: end;
        }
        .bp-phil-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
          border: 1px solid rgba(245,237,224,.08);
        }
        .bp-phil-cell {
          padding: 36px 32px;
          border-right: 1px solid rgba(245,237,224,.08);
          position: relative; overflow: hidden;
          transition: background .3s ease;
        }
        .bp-phil-cell:nth-child(3n) { border-right: none; }
        .bp-phil-cell:hover { background: rgba(200,85,26,.07); }
        .bp-phil-cell::before {
          content: attr(data-n);
          position: absolute; top: -8px; right: 16px;
          font-family: var(--display); font-size: 72px; font-weight: 700;
          color: rgba(245,237,224,.04); line-height: 1;
          pointer-events: none;
        }
        .bp-phil-cell-title {
          font-family: var(--sans); font-size: 12px; font-weight: 700;
          text-transform: uppercase; letter-spacing: .16em;
          color: var(--o); margin-bottom: 12px;
        }
        .bp-phil-cell-body {
          font-family: var(--body); font-size: 14px; font-style: italic;
          color: rgba(245,237,224,.55); line-height: 1.85;
        }

        /* ══════════════════════
           QUOTE MONUMENT
        ══════════════════════ */
        .bp-quote-monument {
          padding: 120px 60px;
          background: var(--ink);
          text-align: center;
          position: relative; overflow: hidden;
        }
        .bp-quote-monument::before {
          content: '"';
          position: absolute; top: -60px; left: 50%; transform: translateX(-50%);
          font-family: var(--display); font-size: 600px; font-weight: 700;
          color: rgba(200,85,26,.03); line-height: 1;
          pointer-events: none; user-select: none;
        }
        .bp-monument-text {
          font-family: var(--display);
          font-size: clamp(28px, 4vw, 58px);
          font-weight: 300; font-style: italic;
          color: var(--parch);
          line-height: 1.4; letter-spacing: -.01em;
          max-width: 900px; margin: 0 auto;
          position: relative; z-index: 1;
        }
        .bp-monument-text em { color: var(--o); font-style: italic; }
        .bp-monument-attr {
          font-family: var(--sans); font-size: 11px; font-weight: 600;
          text-transform: uppercase; letter-spacing: .24em;
          color: rgba(245,237,224,.35); margin-top: 36px;
          position: relative; z-index: 1;
          display: flex; align-items: center; justify-content: center; gap: 16px;
        }
        .bp-monument-attr::before, .bp-monument-attr::after {
          content: ''; display: block; width: 48px; height: 1px;
          background: linear-gradient(to right, transparent, rgba(245,237,224,.3));
        }
        .bp-monument-attr::after { transform: scaleX(-1); }

        /* ══════════════════════
           STATS BAND
        ══════════════════════ */
        .bp-stats-band {
          background: var(--ink2);
          border-top: 1px solid rgba(245,237,224,.06);
          padding: 72px 0;
        }
        .bp-stats-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 60px;
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }
        .bp-stat {
          padding: 32px; text-align: center;
          border-right: 1px solid rgba(245,237,224,.07);
          transition: background .25s ease;
        }
        .bp-stat:last-child { border-right: none; }
        .bp-stat:hover { background: rgba(200,85,26,.06); }
        .bp-stat-val {
          font-family: var(--display); font-size: clamp(40px, 5vw, 64px);
          font-weight: 600; color: var(--o); line-height: 1;
        }
        .bp-stat-lbl {
          font-family: var(--sans); font-size: 10px; font-weight: 600;
          text-transform: uppercase; letter-spacing: .18em;
          color: rgba(245,237,224,.35); margin-top: 10px;
        }

        /* ══════════════════════
           FINAL CTA
        ══════════════════════ */
        .bp-final {
          position: relative; overflow: hidden;
          min-height: 70vh;
          display: flex; align-items: flex-end;
        }
        .bp-final-photo { position: absolute; inset: 0; }
        .bp-final-grad {
          position: absolute; inset: 0; z-index: 1;
          background:
            linear-gradient(to top, rgba(14,11,7,1) 0%, rgba(14,11,7,.7) 40%, rgba(14,11,7,.2) 100%),
            linear-gradient(to right, rgba(14,11,7,.8), transparent 60%);
        }
        .bp-final-content {
          position: relative; z-index: 2;
          max-width: 1200px; margin: 0 auto; padding: 80px 60px;
          width: 100%;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: end;
        }
        .bp-final-eyebrow {
          font-family: var(--sans); font-size: 9px; font-weight: 700;
          text-transform: uppercase; letter-spacing: .28em; color: var(--g);
          margin-bottom: 16px;
        }
        .bp-final-h2 {
          font-family: var(--display);
          font-size: clamp(36px, 4.5vw, 64px);
          font-weight: 300; font-style: italic;
          color: var(--parch); line-height: 1.12; letter-spacing: -.02em;
        }
        .bp-final-h2 strong { font-weight: 600; font-style: normal; color: var(--o); }
        .bp-final-p {
          font-family: var(--body); font-size: 16px; font-style: italic;
          color: rgba(245,237,224,.6); line-height: 1.9;
          margin-bottom: 32px;
        }
        .bp-final-btns { display: flex; gap: 12px; flex-wrap: wrap; }

        /* ══════════════════════
           RESPONSIVE
        ══════════════════════ */
        @media (max-width: 960px) {
          .ch-grid { grid-template-columns: 1fr; gap: 44px; padding: 0 32px; }
          .ch-right .ch-grid { direction: ltr; }
          .ch-year-bg { font-size: 28vw; opacity: 0 !important; }
          .bp-hero-content { padding: 0 32px 60px; }
          .bp-phil-header { grid-template-columns: 1fr; gap: 20px; }
          .bp-phil-grid { grid-template-columns: 1fr 1fr; }
          .bp-stats-inner { grid-template-columns: 1fr 1fr; }
          .bp-stat { border-right: none; border-bottom: 1px solid rgba(245,237,224,.07); }
          .bp-final-content { grid-template-columns: 1fr; gap: 32px; }
          .bp-phil-inner { padding: 0 32px; }
          .bp-stats-inner { padding: 0 32px; }
          .bp-final-content { padding: 60px 32px; }
          .bp-nav { padding: 0 24px; }
          .bp-scroll-cue { display: none; }
        }
        @media (max-width: 600px) {
          .bp-hero-name { font-size: 52px; }
          .ch { padding: 72px 0 40px; }
          .bp-phil-grid { grid-template-columns: 1fr; }
          .bp-stats-inner { grid-template-columns: 1fr 1fr; }
          .ch-sep { padding: 0 32px; }
          .bp-quote-monument { padding: 80px 28px; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className="bp-nav">
        <Link href="/" className="bp-nav-back"><FaArrowLeft size={11}/> Back to Home</Link>
        <div className="bp-nav-logo">Guruji Shrawan</div>
        <Link href="/articles" className="bp-nav-cta">Articles <FaArrowRight size={9}/></Link>
      </nav>

      {/* ══════════════════════════════
          HERO — full bleed cinematic
      ══════════════════════════════ */}
      <section className="bp-hero">
        <div className="bp-hero-photo" style={{ transform: `translateY(${heroParallax}px)` }}>
          <Image
            src="/images/guruji.jpg"
            alt="Guruji Shrawan"
            fill priority
            style={{ objectFit: "cover", objectPosition: "center top" }}
            sizes="100vw"
          />
        </div>
        <div className="bp-hero-grad" />
        <div className="bp-hero-grain" />

        <div className="bp-hero-content">
          <div className="bp-hero-pre">Biography</div>
          <h1 className="bp-hero-name">
            Guruji<br/>
            <em>Shrawan</em>
          </h1>
          <div className="bp-hero-rule" />
          <p className="bp-hero-desc">
            The story of a man from the banks of the Ganges who refused to live
            an unexamined life — and who now invites others to do the same.
          </p>
          <div className="bp-hero-meta">
            <div className="bp-hero-meta-item">
              <div className="bp-hero-meta-val">1990</div>
              <div className="bp-hero-meta-lbl">Bhagalpur, Bihar</div>
            </div>
            <div className="bp-hero-vsep" />
            <div className="bp-hero-meta-item">
              <div className="bp-hero-meta-val">6.2K+</div>
              <div className="bp-hero-meta-lbl">Followers</div>
            </div>
            <div className="bp-hero-vsep" />
            <div className="bp-hero-meta-item">
              <div className="bp-hero-meta-val">100K+</div>
              <div className="bp-hero-meta-lbl">YouTube Views</div>
            </div>
            <div className="bp-hero-vsep" />
            <div className="bp-hero-meta-item">
              <div className="bp-hero-meta-val">1</div>
              <div className="bp-hero-meta-lbl">Book Published</div>
            </div>
          </div>
          <div className="bp-hero-btns">
            <a href="#story" className="bp-btn-primary">Read the Story <FaArrowRight size={10}/></a>
            <a href="https://youtube.com/@gurujishrawan" target="_blank" rel="noopener noreferrer" className="bp-btn-ghost">
              <FaYoutube size={13}/> Watch Teachings
            </a>
          </div>
        </div>

        <div className="bp-scroll-cue">
          <span className="bp-scroll-label">Scroll</span>
          <div className="bp-scroll-line" />
        </div>
      </section>

      {/* RUNNING BAND */}
      <div className="bp-intro-band">
        <div className="bp-intro-track">
          {[...Array(2)].map((_, ri) =>
            ["Truth","Liberation","Vedanta","Self-Inquiry","Consciousness","Relationships","Bihar","Bhakti","Awakening","Advaita","1990","Clarity","Guruji Shrawan"].map((t, i) => (
              <span key={`${ri}-${i}`} className="bp-intro-item">
                {t} <span className="bp-intro-sep">✦</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* ══════════════════════════════
          TIMELINE CHAPTERS
      ══════════════════════════════ */}
      <div id="story" className="bp-chapters">
        <div className="bp-spine" />
        {CHAPTERS.map((item, i) => (
          <Chapter key={item.year + i} item={item} index={i} />
        ))}
      </div>

      {/* ══════════════════════════════
          PHILOSOPHY GRID
      ══════════════════════════════ */}
      <section className="bp-phil">
        <div className="bp-phil-inner">
          <Reveal>
            <div className="bp-phil-header">
              <div>
                <p className="bp-phil-eyebrow">Core Philosophy</p>
                <h2 className="bp-phil-h2">What He<br/>Truly Teaches</h2>
              </div>
              <p className="bp-phil-desc">
                Not a system of belief. Not a religion. A way of looking
                that dissolves the confusion most people never question.
              </p>
            </div>
          </Reveal>
          <div className="bp-phil-grid">
            {[
              { n:"01", t:"Direct Inquiry",        d:"Not belief, not tradition — direct observation of one's own thought, fear and identity is the only path to clarity." },
              { n:"02", t:"Freedom from Conditioning", d:"Most suffering comes from unconsciously inherited patterns. Seeing them clearly is already the beginning of freedom." },
              { n:"03", t:"Practical Vedanta",     d:"Ancient wisdom is only valuable when it dissolves real confusion in real life — not when it becomes another layer of belief." },
              { n:"04", t:"Relationships",         d:"Our deepest patterns reveal themselves in relationship. Understanding them brings genuinely different, more conscious engagement." },
              { n:"05", t:"Youth & Modern Anxiety", d:"Guruji speaks directly to the confusion and aimlessness of modern youth — with brutal honesty, not comforting platitude." },
              { n:"06", t:"Silence & Presence",    d:"True understanding is not loud. It is the quiet recognition of what is actually happening in this very moment." },
            ].map((c, i) => (
              <Reveal key={c.n} delay={i * 60}>
                <div className="bp-phil-cell" data-n={c.n}>
                  <div className="bp-phil-cell-title">{c.t}</div>
                  <div className="bp-phil-cell-body">{c.d}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          QUOTE MONUMENT
      ══════════════════════════════ */}
      <Reveal>
        <div className="bp-quote-monument">
          <p className="bp-monument-text">
            "Understanding oneself is not a destination.<br/>
            It is the <em>quality of attention</em> you bring<br/>
            to this very moment."
          </p>
          <p className="bp-monument-attr">Guruji Shrawan</p>
        </div>
      </Reveal>

      {/* ══════════════════════════════
          STATS BAND
      ══════════════════════════════ */}
      <div className="bp-stats-band">
        <div className="bp-stats-inner">
          {STATS.map((s, i) => (
            <Reveal key={s.lbl} delay={i * 80}>
              <div className="bp-stat">
                <div className="bp-stat-val">{s.val}</div>
                <div className="bp-stat-lbl">{s.lbl}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════
          FINAL CTA
      ══════════════════════════════ */}
      <section className="bp-final">
        <div className="bp-final-photo">
          <Image
            src="/images/hero2.jpg"
            alt="Guruji Shrawan"
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            sizes="100vw"
          />
        </div>
        <div className="bp-final-grad" />
        <div className="bp-final-content">
          <Reveal dir="left">
            <div>
              <p className="bp-final-eyebrow">Continue the Journey</p>
              <h2 className="bp-final-h2">
                The story<br/>is still<br/><strong>being written.</strong>
              </h2>
            </div>
          </Reveal>
          <Reveal dir="right" delay={150}>
            <div>
              <p className="bp-final-p">
                Explore Guruji's articles, videos and books — teachings that cut
                through confusion and invite genuine self-understanding, in Hindi and English.
              </p>
              <div className="bp-final-btns">
                <Link href="/articles" className="bp-btn-primary">Read Articles <FaArrowRight size={10}/></Link>
                <a href="https://youtube.com/@gurujishrawan" target="_blank" rel="noopener noreferrer" className="bp-btn-ghost">
                  <FaYoutube size={13}/> YouTube Channel
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    </main>
  )
}

/* ─── SHARED REVEAL ─── */
function Reveal({ children, delay = 0, dir = "up" }) {
  const ref = useRef(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setV(true); obs.disconnect() }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  const transforms = { up: "translateY(40px)", left: "translateX(-36px)", right: "translateX(36px)" }
  return (
    <div ref={ref} style={{
      opacity: v ? 1 : 0,
      transform: v ? "none" : (transforms[dir] || transforms.up),
      transition: `opacity .75s ${delay}ms ease, transform .75s ${delay}ms ease`,
    }}>
      {children}
    </div>
  )
}