"use client"

import Navbar from "./components/Navbar"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import "swiper/css"
import BookSection from "./components/BookSection"
import {
  FaArrowRight, FaAngleLeft, FaAngleRight,
  FaBookOpen, FaFacebook, FaGlobe,
  FaInstagram, FaPlay, FaVideo, FaYoutube,
} from "react-icons/fa"

/* ─── TYPES ─── */
type NewsletterStatus = "idle" | "loading" | "success"
type HomeArticle = {
  slug: string
  category?: string
  title: { en: string }
  readTime?: string
  featuredImage?: string
}

/* ─── CONSTANTS ─── */
const VIDEOS = [
  { id: "Hs90ewhPAww", title: "Teaching Session 1" },
  { id: "LsfnbDBhxjM", title: "Teaching Session 2" },
  { id: "9QVnaoOZLe4", title: "Teaching Session 3" },
  { id: "f2ZrDTv8u5A", title: "Teaching Session 4" },
  { id: "Uy0vnC-8sOc", title: "Teaching Session 5" },
]

const SOCIAL = [
  { name: "YouTube",   count: "2.2K+", icon: <FaYoutube />,   href: "https://youtube.com/@gurujishrawan",   color: "#ff0000" },
  { name: "Instagram", count: "1K+",   icon: <FaInstagram />, href: "https://instagram.com/gurujishrawan", color: "#e1306c" },
  { name: "Facebook",  count: "3K",    icon: <FaFacebook />,  href: "https://facebook.com/gurujishrawan",  color: "#1877f2" },
  { name: "Total",     count: "6.2K+", icon: <FaGlobe />,     href: "https://youtube.com/@gurujishrawan",  color: "#c8551a" },
]

const STATS = [
  { label: "Books Published",    value: 1,    suffix: "",    icon: <FaBookOpen /> },
  { label: "Total Followers",    value: 6200, suffix: "+",   icon: <FaGlobe /> },
  { label: "YouTube Views",      value: 100,  suffix: "K+",  icon: <FaYoutube /> },
  { label: "Articles Published", value: 30,   suffix: "+",   icon: <FaBookOpen /> },
  { label: "Video Teachings",    value: 120,  suffix: "+",   icon: <FaVideo /> },
]

const QUOTES = [
  "जब तक आप दूसरों की नज़र से खुद को देखते हैं, तब तक आप स्वतंत्र नहीं हैं।",
  "True understanding is not the accumulation of knowledge — it is the dissolution of confusion.",
  "जागरूकता कोई अनुभव नहीं है — यह वह है जो सभी अनुभवों को देखती है।",
  "Freedom begins the moment you stop living according to what others think.",
]

const NAV_ITEMS = [
  { label: "Home",          href: "#home" },
  { label: "In Media",      href: "#trending" },
  { label: "YouTube",       href: "https://youtube.com/@gurujishrawan", external: true },
  { label: "Teachings",     href: "#teachings" },
  { label: "Live Sessions", href: "#videos" },
  { label: "Articles",      href: "/articles" },
  { label: "Books",         href: "#books" },
  { label: "Biography",     href: "/biography" },
]

/* ─── COUNTER HOOK ─── */
function useCounter(target: number, inView: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let raf = 0
    const start = performance.now()
    const dur = 1400
    const run = (t: number) => {
      const p = Math.min((t - start) / dur, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setCount(Math.floor(ease * target))
      if (p < 1) raf = requestAnimationFrame(run)
    }
    raf = requestAnimationFrame(run)
    return () => cancelAnimationFrame(raf)
  }, [inView, target])
  return count
}

/* ─── INTERSECTION HOOK ─── */
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

/* ─── STAT CARD ─── */
function StatCard({ item }: { item: typeof STATS[0] }) {
  const { ref, visible } = useInView()
  const count = useCounter(item.value, visible)
  return (
    <div ref={ref} className="stat-card">
      <div className="stat-icon">{item.icon}</div>
      <p className="stat-num">{count}{item.suffix}</p>
      <p className="stat-label">{item.label}</p>
    </div>
  )
}

/* ─── SECTION REVEAL ─── */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useInView(0.1)
  return (
    <div ref={ref} className={`reveal ${visible ? "revealed" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

/* ─── HOME PAGE ─── */
export default function HomePage() {
  const [email, setEmail]         = useState("")
  const [hindi, setHindi]         = useState(true)
  const [english, setEnglish]     = useState(true)
  const [status, setStatus]       = useState<NewsletterStatus>("idle")
  const [msg, setMsg]             = useState("")
  const [quoteIdx, setQuoteIdx]   = useState(0)
  const [articles, setArticles]   = useState<HomeArticle[]>([])
  const [vidSwiper, setVidSwiper] = useState<any>(null)
  const [artSwiper, setArtSwiper] = useState<any>(null)

  /* rotating quote */
  useEffect(() => {
    const t = setInterval(() => setQuoteIdx(i => (i + 1) % QUOTES.length), 4000)
    return () => clearInterval(t)
  }, [])

  /* fetch articles */
  useEffect(() => {
    let alive = true
    fetch("/api/articles")
      .then(r => r.json())
      .then(d => { if (alive && Array.isArray(d?.articles)) setArticles(d.articles.slice(0, 12)) })
      .catch(() => {})
    return () => { alive = false }
  }, [])

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    await new Promise(r => setTimeout(r, 400))
    setStatus("success")
    const langs = [hindi && "Hindi", english && "English"].filter(Boolean).join(" & ") || "updates"
    setMsg(`Subscribed ${email} for ${langs}.`)
    setEmail("")
  }

  return (
    <div id="home" className="hp-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

        /* ── TOKENS ── */
        :root {
          --orange: #c8551a;
          --gold:   #b8841a;
          --bg:     #faf7f2;
          --card:   #ffffff;
          --border: #e8ddd0;
          --text:   #1a1008;
          --muted:  #8a7a6a;
          --sans:   'Poppins', system-ui, sans-serif;
          --body:   'Lora', Georgia, serif;
        }

        @keyframes fadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes quoteOut { 0%{opacity:1;transform:translateY(0)} 40%{opacity:0;transform:translateY(-12px)} 60%{opacity:0;transform:translateY(12px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes gradShift{ 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes tickerL  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes pulseRing{ 0%{box-shadow:0 0 0 0 rgba(200,85,26,.4)} 70%{box-shadow:0 0 0 14px rgba(200,85,26,0)} 100%{box-shadow:0 0 0 0 rgba(200,85,26,0)} }
        @keyframes shimmer  { from{background-position:-200% 0} to{background-position:200% 0} }

        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0 }

        /* ── ROOT ── */
        .hp-root {
          background: var(--bg);
          font-family: var(--sans);
          color: var(--text);
          overflow-x: hidden;
        }

        /* ── REVEAL ANIMATION ── */
        .reveal {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity .65s ease, transform .65s ease;
        }
        .revealed {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── HERO ── */
        .hero {
          position: relative;
          min-height: 100svh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          overflow: hidden;
        }
        .hero-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 120px 60px 80px;
          position: relative;
          z-index: 2;
        }
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--sans);
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .22em;
          color: var(--orange);
          margin-bottom: 22px;
          animation: fadeIn .8s .1s ease both;
        }
        .hero-eyebrow::before {
          content: '';
          display: block;
          width: 28px;
          height: 1.5px;
          background: var(--orange);
          border-radius: 1px;
        }
        .hero-h1 {
          font-family: var(--body);
          font-size: clamp(32px, 3.8vw, 58px);
          font-weight: 700;
          color: var(--text);
          line-height: 1.13;
          letter-spacing: -.02em;
          animation: fadeUp .9s .2s ease both;
        }
        .hero-h1 em {
          font-style: italic;
          color: var(--orange);
        }
        .hero-desc {
          font-family: var(--sans);
          font-size: 15px;
          color: var(--muted);
          line-height: 1.85;
          max-width: 480px;
          margin-top: 22px;
          animation: fadeUp .9s .35s ease both;
        }
        .hero-btns {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 36px;
          animation: fadeUp .9s .5s ease both;
        }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          border-radius: 99px;
          background: linear-gradient(135deg, var(--orange), #8a2e06);
          color: #fff;
          font-family: var(--sans);
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: transform .22s ease, box-shadow .22s ease;
          box-shadow: 0 4px 18px rgba(200,85,26,.35);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(200,85,26,.45); }
        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          border-radius: 99px;
          background: var(--card);
          color: var(--text);
          font-family: var(--sans);
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          border: 1.5px solid var(--border);
          cursor: pointer;
          transition: border-color .22s ease, color .22s ease, transform .22s ease;
        }
        .btn-secondary:hover { border-color: var(--orange); color: var(--orange); transform: translateY(-2px); }

        /* quote ticker under buttons */
        .hero-quote {
          margin-top: 36px;
          padding: 16px 22px;
          background: linear-gradient(135deg, #fff8f2, #fff4e0);
          border-left: 3px solid var(--orange);
          border-radius: 0 10px 10px 0;
          font-family: var(--body);
          font-size: 14px;
          font-style: italic;
          color: #5a3a20;
          line-height: 1.65;
          max-width: 440px;
          animation: fadeUp .9s .65s ease both;
          transition: opacity .4s ease;
        }
        .hero-quote-key { animation: quoteOut .6s ease both; }

        /* hero right — photo */
        .hero-right {
          position: relative;
          overflow: hidden;
        }
        .hero-right::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(250,247,242,.18) 0%, transparent 60%);
          z-index: 1;
          pointer-events: none;
        }
        .hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          animation: fadeIn 1.2s .3s ease both;
        }
        /* warm overlay bottom */
        .hero-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 55%;
          background: linear-gradient(to top, rgba(26,16,8,.55), transparent);
          z-index: 1;
        }
        /* floating badge on photo */
        .hero-badge {
          position: absolute;
          bottom: 48px;
          left: 32px;
          z-index: 2;
          background: rgba(250,247,242,.96);
          backdrop-filter: blur(10px);
          border: 1.5px solid var(--border);
          border-radius: 14px;
          padding: 14px 20px;
          animation: fadeUp .9s .9s ease both;
        }
        .hero-badge-name {
          font-family: var(--sans);
          font-size: 13px;
          font-weight: 700;
          color: var(--text);
        }
        .hero-badge-sub {
          font-family: var(--sans);
          font-size: 10px;
          color: var(--orange);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .14em;
          margin-top: 2px;
        }
        .hero-badge-dot {
          display: inline-block;
          width: 7px; height: 7px;
          background: #22c55e;
          border-radius: 50%;
          margin-right: 5px;
          animation: pulseRing 2s infinite;
        }

        /* ── RUNNING TICKER ── */
        .ticker-wrap {
          background: var(--orange);
          overflow: hidden;
          padding: 10px 0;
          border-top: 1px solid rgba(255,255,255,.15);
          border-bottom: 1px solid rgba(255,255,255,.15);
        }
        .ticker-inner {
          display: flex;
          gap: 0;
          width: max-content;
          animation: tickerL 28s linear infinite;
        }
        .ticker-item {
          font-family: var(--sans);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .18em;
          color: rgba(255,255,255,.85);
          padding: 0 36px;
          white-space: nowrap;
        }
        .ticker-dot {
          color: rgba(255,255,255,.4);
          font-size: 18px;
          line-height: 1;
          margin: 0 -18px;
          position: relative;
          top: 1px;
        }

        /* ── SECTION COMMON ── */
        .section {
          padding: 88px 0;
        }
        .section-inner {
          max-width: 1160px;
          margin: 0 auto;
          padding: 0 28px;
        }
        .section-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--sans);
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .22em;
          color: var(--orange);
          margin-bottom: 12px;
        }
        .section-eyebrow::before,
        .section-eyebrow::after {
          content: '';
          display: block;
          height: 1.5px;
          background: var(--orange);
          opacity: .4;
          border-radius: 1px;
        }
        .section-eyebrow::before { width: 20px; }
        .section-eyebrow::after  { width: 20px; }
        .section-h2 {
          font-family: var(--body);
          font-size: clamp(26px, 3vw, 42px);
          font-weight: 700;
          color: var(--text);
          line-height: 1.2;
          letter-spacing: -.02em;
        }
        .section-sub {
          font-family: var(--sans);
          font-size: 14px;
          color: var(--muted);
          line-height: 1.8;
          margin-top: 12px;
          max-width: 560px;
        }

        /* ── ABOUT STRIP ── */
        .about-strip {
          background: linear-gradient(135deg, #1a1008, #2a1608);
          padding: 80px 0;
          position: relative;
          overflow: hidden;
        }
        .about-strip::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 60% 80% at 80% 50%, rgba(200,85,26,.18), transparent);
          pointer-events: none;
        }
        .about-strip-inner {
          max-width: 1160px;
          margin: 0 auto;
          padding: 0 28px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }
        .about-strip-text p {
          font-family: var(--body);
          font-size: 17px;
          font-style: italic;
          color: rgba(255,255,255,.78);
          line-height: 1.9;
          margin-bottom: 14px;
        }
        .about-strip-text a {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-family: var(--sans);
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .16em;
          color: var(--orange);
          text-decoration: none;
          margin-top: 8px;
          transition: gap .2s ease;
        }
        .about-strip-text a:hover { gap: 12px; }
        .about-strip-photo {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          aspect-ratio: 4/5;
          border: 2px solid rgba(200,85,26,.3);
        }

        /* ── STATS ── */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          margin-top: 48px;
        }
        .stat-card {
          background: var(--card);
          border: 1.5px solid var(--border);
          border-radius: 18px;
          padding: 28px 20px;
          text-align: center;
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(200,85,26,.1); }
        .stat-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px; height: 44px;
          border-radius: 50%;
          background: rgba(200,85,26,.1);
          color: var(--orange);
          font-size: 16px;
          margin-bottom: 14px;
        }
        .stat-num {
          font-family: var(--body);
          font-size: 32px;
          font-weight: 700;
          color: var(--text);
        }
        .stat-label {
          font-family: var(--sans);
          font-size: 11px;
          color: var(--muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .1em;
          margin-top: 5px;
        }

        /* ── VIDEO CARDS ── */
        .swiper-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
        }
        .swiper-nav-title {
          font-family: var(--body);
          font-size: clamp(24px, 2.5vw, 36px);
          font-weight: 700;
          color: var(--text);
        }
        .swiper-nav-btns { display: flex; gap: 8px; }
        .swiper-btn {
          width: 40px; height: 40px;
          border-radius: 50%;
          border: 1.5px solid var(--border);
          background: var(--card);
          color: var(--orange);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: border-color .22s ease, background .22s ease, transform .18s ease;
        }
        .swiper-btn:hover { border-color: var(--orange); background: rgba(200,85,26,.08); transform: scale(1.08); }

        .video-card {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          aspect-ratio: 16/10;
          background: #e8ddd0;
          display: block;
          text-decoration: none;
        }
        .video-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(26,16,8,.6), transparent 55%);
          transition: opacity .25s ease;
        }
        .video-card:hover::after { opacity: .8; }
        .video-card img { transition: transform .35s ease; }
        .video-card:hover img { transform: scale(1.05); }
        .video-play {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 46px; height: 46px;
          border-radius: 50%;
          background: rgba(255,255,255,.92);
          color: var(--orange);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          font-size: 14px;
          transition: transform .22s ease, box-shadow .22s ease;
        }
        .video-card:hover .video-play { transform: translate(-50%, -50%) scale(1.12); box-shadow: 0 6px 20px rgba(200,85,26,.4); }

        /* ── ARTICLE CARDS ── */
        .article-card {
          background: var(--card);
          border: 1.5px solid var(--border);
          border-radius: 18px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: transform .28s ease, box-shadow .28s ease;
          text-decoration: none;
          color: inherit;
        }
        .article-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(200,85,26,.13); }
        .article-img-wrap {
          position: relative;
          aspect-ratio: 16/10;
          overflow: hidden;
        }
        .article-img-wrap img { transition: transform .35s ease; }
        .article-card:hover .article-img-wrap img { transform: scale(1.06); }
        .article-body {
          padding: 18px 20px 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .article-cat {
          font-family: var(--sans);
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .18em;
          color: var(--orange);
          margin-bottom: 8px;
        }
        .article-title {
          font-family: var(--sans);
          font-size: 15px;
          font-weight: 700;
          color: var(--text);
          line-height: 1.45;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .article-meta {
          font-family: var(--sans);
          font-size: 11px;
          color: var(--muted);
          margin-top: 10px;
        }
        .article-read {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--sans);
          font-size: 12px;
          font-weight: 700;
          color: var(--orange);
          margin-top: 14px;
          transition: gap .2s ease;
        }
        .article-card:hover .article-read { gap: 10px; }

        /* ── TRENDING / MEDIA STRIP ── */
        .media-strip {
          background: linear-gradient(135deg, #1a1008 0%, #2a1608 60%, #1a1008 100%);
          background-size: 200% 200%;
          animation: gradShift 8s ease infinite;
          border-radius: 28px;
          padding: 60px 64px;
          position: relative;
          overflow: hidden;
        }
        .media-strip::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 280px; height: 280px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(200,85,26,.3), transparent 70%);
          pointer-events: none;
        }
        .media-strip-eyebrow {
          font-family: var(--sans);
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .22em;
          color: var(--gold);
          margin-bottom: 14px;
        }
        .media-strip-h2 {
          font-family: var(--body);
          font-size: clamp(26px, 3vw, 44px);
          font-weight: 700;
          color: #fff;
          line-height: 1.18;
          letter-spacing: -.02em;
          max-width: 560px;
        }
        .media-strip-h2 em { font-style: italic; color: var(--gold); }
        .media-strip-p {
          font-family: var(--sans);
          font-size: 14px;
          color: rgba(255,255,255,.68);
          line-height: 1.85;
          max-width: 480px;
          margin-top: 16px;
        }
        .media-strip-btns {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 28px;
        }
        .btn-gold {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 26px;
          border-radius: 99px;
          background: linear-gradient(135deg, var(--gold), #7a5010);
          color: #fff;
          font-family: var(--sans);
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: transform .22s ease, box-shadow .22s ease;
          box-shadow: 0 4px 18px rgba(184,132,26,.35);
        }
        .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(184,132,26,.45); }
        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 26px;
          border-radius: 99px;
          background: transparent;
          color: rgba(255,255,255,.8);
          font-family: var(--sans);
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          border: 1.5px solid rgba(255,255,255,.2);
          cursor: pointer;
          transition: border-color .22s ease, color .22s ease;
        }
        .btn-ghost:hover { border-color: rgba(255,255,255,.5); color: #fff; }

       

        /* ── SOCIAL ── */
        .social-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-top: 36px;
        }
        .social-card {
          background: var(--card);
          border: 1.5px solid var(--border);
          border-radius: 18px;
          padding: 24px 22px;
          text-decoration: none;
          color: inherit;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
        }
        .social-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,.07); border-color: rgba(200,85,26,.3); }
        .social-name {
          font-family: var(--sans);
          font-size: 14px;
          font-weight: 700;
          color: var(--text);
        }
        .social-count {
          font-family: var(--sans);
          font-size: 12px;
          color: var(--muted);
          margin-top: 3px;
        }
        .social-icon {
          font-size: 22px;
          transition: transform .22s ease;
        }
        .social-card:hover .social-icon { transform: scale(1.18); }

        /* ── DIVIDER ── */
        .divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--border), transparent);
          margin: 0;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(3, 1fr); }
          .about-strip-inner { grid-template-columns: 1fr; gap: 40px; }
          .about-strip-photo { max-height: 340px; }
        }
        @media (max-width: 860px) {
          .hero { grid-template-columns: 1fr; min-height: auto; }
          .hero-left { padding: 100px 28px 40px; }
          .hero-right { height: 60vw; min-height: 360px; }
          .hero-badge { bottom: 24px; left: 20px; }
          .social-grid { grid-template-columns: repeat(2, 1fr); }
          .media-strip { padding: 40px 28px; }
          .nl-section { padding: 40px 28px; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .section { padding: 60px 0; }
          .stats-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
          .social-grid { grid-template-columns: 1fr 1fr; }
          .hero-quote { max-width: 100%; }
        }
      `}</style>

      <Navbar />

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section id="teachings" className="hero">
        <div className="hero-left">
          <div className="hero-eyebrow">Guruji Shrawan</div>
          <h1 className="hero-h1">
            Awakening<br/>
            <em>Inner Clarity</em><br/>
            &amp; True Understanding
          </h1>
          <p className="hero-desc">
            Deep insights on life, spirituality, relationships, and modern confusion —
            through fearless inquiry and timeless wisdom. Freedom from blind belief,
            self-deception, and unconscious living.
          </p>
          <div className="hero-btns">
            <a href="#videos" className="btn-primary"><FaPlay size={11}/> Watch Teachings</a>
            <Link href="/articles" className="btn-secondary">Explore Articles <FaArrowRight size={11}/></Link>
          </div>
          <div className="hero-quote" key={quoteIdx}>
            "{QUOTES[quoteIdx]}"
          </div>
        </div>
        <div className="hero-right">
          <Image
            src="/images/guruji.jpg"
            alt="Guruji Shrawan"
            fill
            priority
            className="hero-img"
            style={{objectFit:"cover", objectPosition:"center top"}}
            sizes="(max-width:860px) 100vw, 50vw"
          />
          <div className="hero-overlay"/>
          <div className="hero-badge">
            <div className="hero-badge-name">
              <span className="hero-badge-dot"/>
              Live Sessions Available
            </div>
            <div className="hero-badge-sub">Guruji Shrawan Foundation</div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {[...Array(2)].map((_, ri) =>
            ["Truth","Liberation","Vedanta","Self-Inquiry","Consciousness","Relationships","Freedom","Bhakti","Buddha","Awakening"].map((t, i) => (
              <span key={`${ri}-${i}`} className="ticker-item">{t} <span className="ticker-dot">·</span></span>
            ))
          )}
        </div>
      </div>

      {/* ══════════════════════════════════
          ABOUT STRIP (dark)
      ══════════════════════════════════ */}
      <div className="about-strip">
        <div className="about-strip-inner">
          <Reveal>
            <div className="about-strip-text">
              <div style={{fontFamily:"var(--sans)",fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".22em",color:"var(--gold)",marginBottom:16}}>About Guruji Shrawan</div>
              <p>
                Guruji Shrawan is a contemporary spiritual teacher sharing deep inquiry into
                truth, consciousness, and the nature of the mind. His teachings blend Vedanta,
                Buddhism, and practical wisdom to dissolve confusion and bring authentic clarity.
              </p>
              <p>
                With a growing community across India and beyond, Guruji's recorded sessions,
                books, and articles have touched thousands seeking genuine understanding over
                mere belief.
              </p>
              <Link href="/biography" style={{display:"inline-flex",alignItems:"center",gap:7,fontFamily:"var(--sans)",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:".16em",color:"var(--orange)",textDecoration:"none",marginTop:8,transition:"gap .2s ease"}}>
                Read Biography <FaArrowRight size={10}/>
              </Link>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="about-strip-photo">
              <Image
                src="/images/guruji.jpg"
                alt="Guruji Shrawan portrait"
                fill
                style={{objectFit:"cover", objectPosition:"center"}}
                sizes="(max-width:860px) 90vw, 45vw"
              />
            </div>
          </Reveal>
        </div>
      </div>

      {/* ══════════════════════════════════
          STATS
      ══════════════════════════════════ */}
      <section className="section">
        <div className="section-inner">
          <Reveal>
            <div className="section-eyebrow">Impact &amp; Reach</div>
            <h2 className="section-h2">A Growing Movement of Clarity</h2>
          </Reveal>
          <div className="stats-grid">
            {STATS.map((item, i) => (
              <Reveal key={item.label} delay={i * 80}>
                <StatCard item={item}/>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="divider"/>

      {/* ══════════════════════════════════
          BOOKS
      ══════════════════════════════════ */}
      <section id="books" className="section">
        <div className="section-inner">
          <Reveal>
            <div className="section-eyebrow">Books</div>
            <h2 className="section-h2">Written Wisdom</h2>
            <p className="section-sub">Powerful books exploring Vedanta, self-inquiry, freedom from psychological suffering, and conscious living.</p>
          </Reveal>
        </div>
        <BookSection/>
      </section>

      <div className="divider"/>

      {/* ══════════════════════════════════
          VIDEOS
      ══════════════════════════════════ */}
      <section id="videos" className="section">
        <div className="section-inner">
          <Reveal>
            <div className="swiper-nav">
              <div>
                <div className="section-eyebrow">Video Teachings</div>
                <h2 className="swiper-nav-title">Watch &amp; Listen</h2>
              </div>
              <div className="swiper-nav-btns">
                <button className="swiper-btn" onClick={() => vidSwiper?.slidePrev()} aria-label="Prev"><FaAngleLeft/></button>
                <button className="swiper-btn" onClick={() => vidSwiper?.slideNext()} aria-label="Next"><FaAngleRight/></button>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <Swiper
              onSwiper={setVidSwiper}
              spaceBetween={16}
              slidesPerView={1.2}
              breakpoints={{ 640:{slidesPerView:2.2}, 900:{slidesPerView:3.2}, 1200:{slidesPerView:4.2} }}
            >
              {VIDEOS.map(v => (
                <SwiperSlide key={v.id}>
                  <a
                    href={`https://www.youtube.com/watch?v=${v.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="video-card"
                  >
                    <Image
                      src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                      alt={v.title}
                      fill
                      style={{objectFit:"cover"}}
                      sizes="(max-width:640px) 80vw, (max-width:1200px) 35vw, 25vw"
                    />
                    <div className="video-play"><FaPlay size={12}/></div>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          </Reveal>
          <Reveal delay={200}>
            <div style={{marginTop:20,textAlign:"right"}}>
              <a href="https://youtube.com/@gurujishrawan" target="_blank" rel="noopener noreferrer"
                style={{display:"inline-flex",alignItems:"center",gap:7,fontFamily:"var(--sans)",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:".14em",color:"var(--orange)",textDecoration:"none"}}>
                View All on YouTube <FaArrowRight size={10}/>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════
          MEDIA / TRENDING STRIP
      ══════════════════════════════════ */}
      <section id="trending" className="section" style={{paddingTop:0}}>
        <div className="section-inner">
          <Reveal>
            <div className="media-strip">
              <div className="media-strip-eyebrow">In Media · Trending Now</div>
              <h2 className="media-strip-h2">
                Awakening<br/><em>Conscious Living</em>
              </h2>
              <p className="media-strip-p">
                A movement encouraging people to live with awareness, responsibility, and
                freedom from blind beliefs — bringing clarity to individuals facing confusion
                in modern society.
              </p>
              <div className="media-strip-btns">
                <Link href="/biography" className="btn-gold">Know More <FaArrowRight size={10}/></Link>
                <a href="https://youtube.com/@gurujishrawan" target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  <FaYoutube/> YouTube Channel
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════
          ARTICLES
      ══════════════════════════════════ */}
      <section id="articles" className="section" style={{paddingTop:0}}>
        <div className="section-inner">
          <Reveal>
            <div className="swiper-nav">
              <div>
                <div className="section-eyebrow">Latest Articles</div>
                <h2 className="swiper-nav-title">Wisdom in Writing</h2>
              </div>
              <div className="swiper-nav-btns">
                <button className="swiper-btn" onClick={() => artSwiper?.slidePrev()} aria-label="Prev"><FaAngleLeft/></button>
                <button className="swiper-btn" onClick={() => artSwiper?.slideNext()} aria-label="Next"><FaAngleRight/></button>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <Swiper
              onSwiper={setArtSwiper}
              spaceBetween={16}
              slidesPerView={1.1}
              breakpoints={{ 480:{slidesPerView:1.3}, 640:{slidesPerView:1.8}, 900:{slidesPerView:2.5}, 1100:{slidesPerView:3} }}
            >
              {(articles.length > 0 ? articles : [{slug:"__",category:"Wisdom",title:{en:"New articles coming soon"},readTime:"",featuredImage:""}]).map((a, i) => (
                <SwiperSlide key={a.slug} style={{height:"auto"}}>
                  <Link href={a.slug === "__" ? "/articles" : `/articles/${a.slug}`} className="article-card">
                    <div className="article-img-wrap">
                      <Image
                        src={a.featuredImage || `/images/hero${(i%3)+1}.jpg`}
                        alt={a.title?.en || "Article"}
                        fill
                        style={{objectFit:"cover"}}
                        sizes="(max-width:640px) 90vw, (max-width:1100px) 45vw, 30vw"
                      />
                    </div>
                    <div className="article-body">
                      <div className="article-cat">{a.category || "Wisdom"}</div>
                      <div className="article-title">{a.title?.en}</div>
                      {a.readTime && <div className="article-meta">{a.readTime} read</div>}
                      <div className="article-read">Read article <FaArrowRight size={10}/></div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </Reveal>
          <Reveal delay={200}>
            <div style={{marginTop:20,textAlign:"right"}}>
              <Link href="/articles"
                style={{display:"inline-flex",alignItems:"center",gap:7,fontFamily:"var(--sans)",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:".14em",color:"var(--orange)",textDecoration:"none"}}>
                Browse All Articles <FaArrowRight size={10}/>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="divider"/>

      {/* ══════════════════════════════════
          NEWSLETTER
      ══════════════════════════════════ */}
      

      {/* ══════════════════════════════════
          SOCIAL
      ══════════════════════════════════ */}
      <section className="section" style={{paddingTop:0}}>
        <div className="section-inner">
          <Reveal>
            <div className="section-eyebrow">Social Presence</div>
            <h2 className="section-h2">Follow the Journey</h2>
          </Reveal>
          <div className="social-grid">
            {SOCIAL.map((s, i) => (
              <Reveal key={s.name} delay={i * 70}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="social-card">
                  <div>
                    <div className="social-name">{s.name}</div>
                    <div className="social-count">{s.count} followers</div>
                  </div>
                  <div className="social-icon" style={{color: s.color}}>{s.icon}</div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}