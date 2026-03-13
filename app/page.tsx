"use client"

import Navbar from "./components/Navbar"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import BookSection from "./components/BookSection"
import {
  FaArrowRight, FaAngleLeft, FaAngleRight,
  FaBookOpen, FaFacebook, FaGlobe,
  FaInstagram, FaPlay, FaVideo, FaYoutube,
  FaQuoteLeft,
} from "react-icons/fa"

type HomeArticle = {
  slug: string
  category?: string
  title: { en: string }
  readTime?: string
  featuredImage?: string
  excerpt?: string
}

const VIDEOS = [
  { id: "Hs90ewhPAww", title: "Teaching Session 1" },
  { id: "LsfnbDBhxjM", title: "Teaching Session 2" },
  { id: "9QVnaoOZLe4", title: "Teaching Session 3" },
  { id: "f2ZrDTv8u5A", title: "Teaching Session 4" },
  { id: "Uy0vnC-8sOc", title: "Teaching Session 5" },
]

const SOCIAL = [
  { name: "YouTube",   count: "2.2K+", icon: <FaYoutube />,   href: "https://youtube.com/@gurujishrawan",   color: "#ff2b00" },
  { name: "Instagram", count: "1K+",   icon: <FaInstagram />, href: "https://instagram.com/gurujishrawan", color: "#c13584" },
  { name: "Facebook",  count: "3K",    icon: <FaFacebook />,  href: "https://facebook.com/gurujishrawan",  color: "#1877f2" },
  { name: "Total",     count: "6.2K+", icon: <FaGlobe />,     href: "https://youtube.com/@gurujishrawan",  color: "#c8551a" },
]

const STATS = [
  { label: "Books",           value: 1,    suffix: "",   icon: <FaBookOpen /> },
  { label: "Followers",       value: 6200, suffix: "+",  icon: <FaGlobe /> },
  { label: "YouTube Views",   value: 100,  suffix: "K+", icon: <FaYoutube /> },
  { label: "Articles",        value: 30,   suffix: "+",  icon: <FaBookOpen /> },
  { label: "Video Teachings", value: 120,  suffix: "+",  icon: <FaVideo /> },
]

const QUOTES = [
  { hi: "जब तक आप दूसरों की नज़र से खुद को देखते हैं, तब तक आप स्वतंत्र नहीं हैं।", en: "As long as you see yourself through others' eyes, you are not free." },
  { hi: "जागरूकता कोई अनुभव नहीं है।", en: "True understanding is not the accumulation of knowledge — it is the dissolution of confusion." },
  { hi: "स्वतंत्रता वहाँ से शुरू होती है जहाँ भय समाप्त होता है।", en: "Freedom begins where fear ends — not in the future, but right now." },
]

const TEACHINGS = [
  { icon: "🧘", title: "Vedanta & Self-Inquiry", desc: "Direct investigation into the nature of consciousness and the self." },
  { icon: "💡", title: "Modern Confusion", desc: "Fearless clarity on relationships, society and the anxious mind." },
  { icon: "📖", title: "Ancient Wisdom", desc: "Timeless teachings made alive for contemporary, practical living." },
  { icon: "🔥", title: "Inner Freedom", desc: "Liberation from blind belief, self-deception and unconscious living." },
]

/* ─── hooks ─── */
function useCounter(target, inView) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let raf = 0
    const start = performance.now()
    const run = (t) => {
      const p = Math.min((t - start) / 1400, 1)
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) raf = requestAnimationFrame(run)
    }
    raf = requestAnimationFrame(run)
    return () => cancelAnimationFrame(raf)
  }, [inView, target])
  return count
}

function useInView(threshold = 0.12) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function Reveal({ children, delay = 0, dir = "up", className = "" }) {
  const { ref, visible } = useInView(0.1)
  const transforms = { up: "translateY(36px)", left: "translateX(-32px)", right: "translateX(32px)" }
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : (transforms[dir] || "translateY(36px)"),
      transition: `opacity .7s ${delay}ms ease, transform .7s ${delay}ms ease`,
    }}>
      {children}
    </div>
  )
}

function StatCard({ item }) {
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

/* ══════════════════════════════════════
   HOME PAGE
══════════════════════════════════════ */
export default function HomePage() {
  const [qIdx, setQIdx]           = useState(0)
  const [qFade, setQFade]         = useState(true)
  const [articles, setArticles]   = useState([])
  const [vidSwiper, setVidSwiper] = useState(null)
  const [artSwiper, setArtSwiper] = useState(null)
  const [vidIdx, setVidIdx]       = useState(0)
  const [artIdx, setArtIdx]       = useState(0)
  const [heroLoaded, setHeroLoaded] = useState(false)

  useEffect(() => { setHeroLoaded(true) }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setQFade(false)
      setTimeout(() => { setQIdx(i => (i + 1) % QUOTES.length); setQFade(true) }, 400)
    }, 5000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    let alive = true
    fetch("/api/articles").then(r => r.json())
      .then(d => { if (alive && Array.isArray(d?.articles)) setArticles(d.articles.slice(0, 12)) })
      .catch(() => {})
    return () => { alive = false }
  }, [])

  return (
    <div id="home" className="hp">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

        :root {
          --o:#c8551a; --g:#b8841a; --bg:#faf7f2; --card:#ffffff;
          --border:#e8ddd0; --text:#1a1008; --muted:#8a7a6a;
          --sans:'Poppins',system-ui,sans-serif; --body:'Lora',Georgia,serif;
        }

        @keyframes hp-fadeUp   { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hp-fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes hp-slideR   { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes hp-ticker   { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes hp-pulse    { 0%{box-shadow:0 0 0 0 rgba(34,197,94,.45)} 70%{box-shadow:0 0 0 10px transparent} 100%{box-shadow:0 0 0 0 transparent} }
        @keyframes hp-gradMove { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes hp-lineGrow { from{width:0} to{width:100%} }
        @keyframes hp-quoteIn  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hp-scaleIn  { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }
        @keyframes hp-float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0 }

        .hp {
          background:var(--bg);
          font-family:var(--sans);
          color:var(--text);
          overflow-x:hidden;
        }

        /* ════════════════════════
           HERO — full viewport split
        ════════════════════════ */
        .hero {
          position:relative;
          min-height:100svh;
          display:grid;
          grid-template-columns:55% 45%;
          overflow:hidden;
        }

        /* left pane */
        .hero-l {
          display:flex;
          flex-direction:column;
          justify-content:center;
          padding:128px 64px 80px 72px;
          position:relative;
          z-index:2;
          background:var(--bg);
        }

        /* subtle vertical line left accent */
        .hero-l::before {
          content:'';
          position:absolute;
          left:0; top:0; bottom:0;
          width:3px;
          background:linear-gradient(to bottom, transparent 0%, var(--o) 40%, var(--g) 70%, transparent 100%);
          opacity:.35;
        }

        .hero-eyebrow {
          display:inline-flex;
          align-items:center;
          gap:10px;
          font-family:var(--sans);
          font-size:9px;
          font-weight:700;
          text-transform:uppercase;
          letter-spacing:.26em;
          color:var(--o);
          margin-bottom:22px;
          animation:${heroLoaded?"hp-fadeIn .8s .1s ease both":"none"};
        }
        .hero-eyebrow::before {
          content:'';
          display:block;
          width:30px;height:1.5px;
          background:var(--o);border-radius:1px;
        }

        .hero-h1 {
          font-family:var(--body);
          font-size:clamp(34px,4.2vw,62px);
          font-weight:700;
          color:var(--text);
          line-height:1.1;
          letter-spacing:-.025em;
          animation:${heroLoaded?"hp-fadeUp .9s .2s ease both":"none"};
        }
        .hero-h1 em { font-style:italic; color:var(--o); }

        /* animated underline on key word */
        .hero-underline {
          display:inline-block;
          position:relative;
        }
        .hero-underline::after {
          content:'';
          position:absolute;
          bottom:-3px; left:0;
          height:2.5px;
          background:linear-gradient(90deg,var(--o),var(--g));
          border-radius:1px;
          animation:${heroLoaded?"hp-lineGrow .9s .9s ease both":"none"};
          width:${heroLoaded?"100%":"0%"};
        }

        .hero-desc {
          font-family:var(--sans);
          font-size:15px;
          color:var(--muted);
          line-height:1.9;
          max-width:440px;
          margin-top:22px;
          animation:${heroLoaded?"hp-fadeUp .9s .4s ease both":"none"};
        }

        .hero-btns {
          display:flex;gap:12px;flex-wrap:wrap;
          margin-top:34px;
          animation:${heroLoaded?"hp-fadeUp .9s .55s ease both":"none"};
        }

        /* quote block */
        .hero-quote-block {
          margin-top:38px;
          padding:0;
          animation:${heroLoaded?"hp-fadeUp .9s .7s ease both":"none"};
        }
        .hero-quote-inner {
          display:flex;
          gap:16px;
          align-items:flex-start;
          padding:20px 22px;
          background:linear-gradient(135deg,rgba(200,85,26,.06),rgba(184,132,26,.04));
          border:1px solid rgba(200,85,26,.18);
          border-radius:0 16px 16px 0;
          border-left:3px solid var(--o);
          max-width:430px;
          transition:opacity .4s ease,transform .4s ease;
          opacity:${qFade?1:0};
          transform:${qFade?"translateY(0)":"translateY(6px)"};
        }
        .hero-quote-icon {
          color:var(--o);opacity:.6;margin-top:2px;flex-shrink:0;
        }
        .hero-quote-hi {
          font-family:var(--body);font-size:14px;font-style:italic;
          color:#5a3a1a;line-height:1.7;margin-bottom:6px;
        }
        .hero-quote-en {
          font-family:var(--sans);font-size:11px;color:var(--muted);
          line-height:1.6;
        }
        .hero-quote-dots {
          display:flex;gap:5px;margin-top:14px;
        }
        .hero-quote-dot {
          width:5px;height:5px;border-radius:50%;
          background:var(--border);
          transition:background .3s ease,transform .3s ease;
        }
        .hero-quote-dot.active {
          background:var(--o);
          transform:scale(1.3);
        }

        /* hero right — photo */
        .hero-r {
          position:relative;
          overflow:hidden;
        }
        /* edge fade into left pane */
        .hero-r::before {
          content:'';
          position:absolute;
          top:0;left:0;bottom:0;
          width:80px;
          background:linear-gradient(to right,var(--bg),transparent);
          z-index:2;pointer-events:none;
        }
        /* bottom fade */
        .hero-r::after {
          content:'';
          position:absolute;
          bottom:0;left:0;right:0;
          height:50%;
          background:linear-gradient(to top,rgba(26,16,8,.5),transparent);
          z-index:2;pointer-events:none;
        }
        .hero-badge {
          position:absolute;bottom:44px;left:60px;z-index:4;
          background:rgba(250,247,242,.94);
          backdrop-filter:blur(12px);
          border:1.5px solid var(--border);
          border-radius:14px;padding:13px 18px;
          box-shadow:0 8px 28px rgba(0,0,0,.12);
          animation:${heroLoaded?"hp-slideR .9s 1s ease both":"none"};
        }
        .hero-badge-live {
          display:flex;align-items:center;gap:7px;
          font-family:var(--sans);font-size:12px;font-weight:700;color:var(--text);
        }
        .hero-badge-dot {
          width:7px;height:7px;border-radius:50%;
          background:#22c55e;animation:hp-pulse 2s infinite;flex-shrink:0;
        }
        .hero-badge-sub {
          font-family:var(--sans);font-size:9px;font-weight:600;
          text-transform:uppercase;letter-spacing:.14em;
          color:var(--o);margin-top:3px;
        }

        /* scroll hint */
        .hero-scroll {
          position:absolute;bottom:36px;left:50%;
          transform:translateX(-50%);
          z-index:5;
          display:flex;flex-direction:column;align-items:center;gap:6px;
          animation:${heroLoaded?"hp-fadeIn 1s 1.2s ease both":"none"};
          opacity:${heroLoaded?1:0};
        }
        .hero-scroll-line {
          width:1px;height:40px;
          background:linear-gradient(to bottom,var(--o),transparent);
          animation:hp-float 2s ease-in-out infinite;
        }
        .hero-scroll-label {
          font-family:var(--sans);font-size:8px;font-weight:700;
          text-transform:uppercase;letter-spacing:.2em;color:var(--muted);
        }

        /* ── TICKER ── */
        .ticker {
          background:var(--o);overflow:hidden;padding:11px 0;
        }
        .ticker-track {
          display:flex;width:max-content;
          animation:hp-ticker 28s linear infinite;
        }
        .ticker-item {
          font-family:var(--sans);font-size:10px;font-weight:600;
          text-transform:uppercase;letter-spacing:.2em;
          color:rgba(255,255,255,.82);padding:0 30px;white-space:nowrap;
        }
        .ticker-sep { color:rgba(255,255,255,.28); margin:0 -12px; }

        /* ════════════════════════
           SECTION COMMONS
        ════════════════════════ */
        .sec { padding:96px 0; }
        .sec-inner { max-width:1160px;margin:0 auto;padding:0 28px; }
        .sec-eyebrow {
          display:inline-flex;align-items:center;gap:8px;
          font-family:var(--sans);font-size:9px;font-weight:700;
          text-transform:uppercase;letter-spacing:.24em;color:var(--o);
          margin-bottom:10px;
        }
        .sec-eyebrow::before,.sec-eyebrow::after {
          content:'';display:block;height:1.5px;
          background:var(--o);opacity:.3;border-radius:1px;
        }
        .sec-eyebrow::before{width:22px;} .sec-eyebrow::after{width:22px;}
        .sec-h2 {
          font-family:var(--body);
          font-size:clamp(26px,2.8vw,42px);
          font-weight:700;color:var(--text);
          line-height:1.18;letter-spacing:-.022em;
        }
        .sec-sub {
          font-family:var(--sans);font-size:14px;color:var(--muted);
          line-height:1.85;margin-top:10px;max-width:520px;
        }
        .divider {
          width:100%;height:1px;
          background:linear-gradient(90deg,transparent,var(--border),transparent);
        }
        .view-all-link {
          display:inline-flex;align-items:center;gap:7px;
          font-family:var(--sans);font-size:10px;font-weight:700;
          text-transform:uppercase;letter-spacing:.16em;color:var(--o);
          text-decoration:none;margin-top:20px;
          transition:gap .2s ease;
        }
        .view-all-link:hover{gap:12px;}

        /* ════════════════════════
           TEACHINGS GRID
        ════════════════════════ */
        .teach-grid {
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:16px;
          margin-top:44px;
        }
        .teach-card {
          background:var(--card);
          border:1.5px solid var(--border);
          border-radius:20px;
          padding:28px 22px;
          transition:transform .28s ease,box-shadow .28s ease,border-color .28s ease;
          position:relative;
          overflow:hidden;
        }
        .teach-card::before {
          content:'';
          position:absolute;
          top:0;left:0;right:0;
          height:3px;
          background:linear-gradient(90deg,var(--o),var(--g));
          transform:scaleX(0);
          transform-origin:left;
          transition:transform .3s ease;
        }
        .teach-card:hover::before { transform:scaleX(1); }
        .teach-card:hover {
          transform:translateY(-4px);
          box-shadow:0 14px 38px rgba(200,85,26,.1);
          border-color:rgba(200,85,26,.3);
        }
        .teach-emoji { font-size:28px;margin-bottom:14px;display:block; }
        .teach-title {
          font-family:var(--sans);font-size:13px;font-weight:700;
          color:var(--text);margin-bottom:8px;line-height:1.35;
        }
        .teach-desc {
          font-family:var(--sans);font-size:12px;color:var(--muted);line-height:1.75;
        }

        /* ════════════════════════
           DARK ABOUT STRIP
        ════════════════════════ */
        .about-dark {
          background:linear-gradient(135deg,#1a1008,#2a1608);
          padding:90px 0;
          position:relative;overflow:hidden;
        }
        .about-dark::before {
          content:'';position:absolute;inset:0;
          background:radial-gradient(ellipse 55% 80% at 85% 50%,rgba(200,85,26,.18),transparent);
          pointer-events:none;
        }
        /* large decorative OM */
        .about-dark::after {
          content:'ॐ';
          position:absolute;right:-40px;bottom:-80px;
          font-size:400px;
          color:rgba(255,255,255,.03);
          font-family:serif;
          pointer-events:none;
          user-select:none;
          line-height:1;
        }
        .about-grid {
          max-width:1160px;margin:0 auto;padding:0 28px;
          display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;
          position:relative;z-index:1;
        }
        .about-eyebrow {
          font-family:var(--sans);font-size:9px;font-weight:700;
          text-transform:uppercase;letter-spacing:.24em;color:var(--g);
          margin-bottom:14px;
        }
        .about-h2 {
          font-family:var(--body);
          font-size:clamp(26px,3vw,42px);
          font-weight:700;color:#fff;
          line-height:1.18;letter-spacing:-.022em;margin-bottom:18px;
        }
        .about-h2 em {font-style:italic;color:var(--g);}
        .about-p {
          font-family:var(--body);font-size:16px;font-style:italic;
          color:rgba(255,255,255,.68);line-height:1.95;margin-bottom:14px;
        }
        .about-link {
          display:inline-flex;align-items:center;gap:8px;
          font-family:var(--sans);font-size:11px;font-weight:700;
          text-transform:uppercase;letter-spacing:.16em;
          color:var(--o);text-decoration:none;
          margin-top:8px;
          border-bottom:1px solid rgba(200,85,26,.3);
          padding-bottom:2px;
          transition:gap .2s ease,border-color .2s ease;
        }
        .about-link:hover{gap:14px;border-color:var(--o);}
        .about-photo {
          position:relative;
          border-radius:24px;overflow:hidden;
          aspect-ratio:4/5;
          border:2px solid rgba(200,85,26,.22);
          box-shadow:0 40px 80px rgba(0,0,0,.4), 0 0 0 1px rgba(200,85,26,.1);
        }
        /* photo label overlay */
        .about-photo-label {
          position:absolute;bottom:20px;left:20px;right:20px;z-index:2;
          background:rgba(26,16,8,.82);backdrop-filter:blur(8px);
          border:1px solid rgba(255,255,255,.1);
          border-radius:12px;padding:14px 18px;
          display:flex;align-items:center;gap:12px;
        }
        .about-photo-dot {
          width:8px;height:8px;border-radius:50%;
          background:#22c55e;flex-shrink:0;animation:hp-pulse 2s infinite;
        }
        .about-photo-name {
          font-family:var(--sans);font-size:13px;font-weight:700;color:#fff;
        }
        .about-photo-role {
          font-family:var(--sans);font-size:10px;
          color:rgba(255,255,255,.55);font-weight:600;
          text-transform:uppercase;letter-spacing:.12em;margin-top:2px;
        }

        /* ════════════════════════
           STATS
        ════════════════════════ */
        .stats-grid {
          display:grid;grid-template-columns:repeat(5,1fr);
          gap:14px;margin-top:48px;
        }
        .stat-card {
          background:var(--card);border:1.5px solid var(--border);
          border-radius:20px;padding:28px 18px;text-align:center;
          transition:transform .25s ease,box-shadow .25s ease;
          position:relative;overflow:hidden;
        }
        .stat-card::after {
          content:'';position:absolute;
          bottom:0;left:0;right:0;height:3px;
          background:linear-gradient(90deg,var(--o),var(--g));
          transform:scaleX(0);transform-origin:left;
          transition:transform .3s ease;
        }
        .stat-card:hover::after{transform:scaleX(1);}
        .stat-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(200,85,26,.1);}
        .stat-icon {
          display:inline-flex;align-items:center;justify-content:center;
          width:44px;height:44px;border-radius:50%;
          background:rgba(200,85,26,.1);color:var(--o);
          font-size:16px;margin-bottom:14px;
        }
        .stat-num {
          font-family:var(--body);font-size:32px;font-weight:700;color:var(--text);
        }
        .stat-label {
          font-family:var(--sans);font-size:10px;color:var(--muted);
          font-weight:600;text-transform:uppercase;letter-spacing:.12em;margin-top:5px;
        }

        /* ════════════════════════
           CAROUSEL COMMONS
        ════════════════════════ */
        .carousel-head {
          display:flex;align-items:flex-end;justify-content:space-between;
          gap:16px;margin-bottom:28px;
        }
        .carousel-controls {display:flex;gap:8px;align-items:center;}
        .carousel-counter {
          font-family:var(--sans);font-size:12px;font-weight:600;
          color:var(--muted);min-width:36px;text-align:center;
        }
        .carousel-btn {
          width:42px;height:42px;border-radius:50%;
          border:1.5px solid var(--border);background:var(--card);
          color:var(--o);display:flex;align-items:center;justify-content:center;
          cursor:pointer;
          transition:background .22s ease,border-color .22s ease,transform .18s ease;
        }
        .carousel-btn:hover{background:rgba(200,85,26,.07);border-color:var(--o);transform:scale(1.08);}
        .carousel-btn:active{transform:scale(.93);}

        /* ════════════════════════
           VIDEO CARDS
        ════════════════════════ */
        .vc {
          display:block;text-decoration:none;
          border-radius:18px;overflow:hidden;
          background:var(--card);border:1.5px solid var(--border);
          transition:transform .28s ease,box-shadow .28s ease,border-color .28s ease;
        }
        .vc:hover {
          transform:translateY(-5px);
          box-shadow:0 18px 44px rgba(200,85,26,.15);
          border-color:rgba(200,85,26,.28);
        }
        .vc-thumb {
          position:relative;aspect-ratio:16/10;overflow:hidden;background:#e8ddd0;
        }
        .vc-thumb img { transition:transform .4s ease; }
        .vc:hover .vc-thumb img { transform:scale(1.06); }
        .vc-overlay {
          position:absolute;inset:0;
          background:linear-gradient(to top,rgba(26,16,8,.7) 0%,rgba(0,0,0,.1) 55%,transparent);
          transition:opacity .3s ease;
        }
        .vc:hover .vc-overlay{opacity:.9;}
        .vc-play {
          position:absolute;top:50%;left:50%;
          transform:translate(-50%,-50%);
          width:48px;height:48px;border-radius:50%;
          background:rgba(255,255,255,.92);color:var(--o);
          display:flex;align-items:center;justify-content:center;
          padding-left:2px;
          transition:transform .25s ease,box-shadow .25s ease;
          box-shadow:0 4px 16px rgba(0,0,0,.2);
        }
        .vc:hover .vc-play{transform:translate(-50%,-50%) scale(1.12);box-shadow:0 8px 24px rgba(200,85,26,.4);}
        .vc-yt { position:absolute;top:12px;right:12px;z-index:2;color:rgba(255,255,255,.7); }
        .vc-info {
          padding:14px 16px;display:flex;align-items:center;
          justify-content:space-between;gap:8px;
        }
        .vc-title {
          font-family:var(--sans);font-size:12px;font-weight:600;color:var(--text);
          white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;
        }
        .vc-cta {
          font-family:var(--sans);font-size:10px;font-weight:700;
          color:var(--o);text-transform:uppercase;letter-spacing:.1em;
          flex-shrink:0;white-space:nowrap;
        }

        /* ════════════════════════
           ARTICLE CARDS
        ════════════════════════ */
        .ac {
          display:flex;flex-direction:column;
          text-decoration:none;color:inherit;
          background:var(--card);border:1.5px solid var(--border);
          border-radius:20px;overflow:hidden;height:100%;
          transition:transform .28s ease,box-shadow .28s ease,border-color .28s ease;
        }
        .ac:hover{
          transform:translateY(-5px);
          box-shadow:0 18px 44px rgba(200,85,26,.12);
          border-color:rgba(200,85,26,.28);
        }
        .ac-img {position:relative;aspect-ratio:16/9;overflow:hidden;background:#e8ddd0;}
        .ac-img img{transition:transform .4s ease;}
        .ac:hover .ac-img img{transform:scale(1.07);}
        .ac-img-overlay {
          position:absolute;inset:0;
          background:linear-gradient(to top,rgba(26,16,8,.55),transparent 50%);
          pointer-events:none;
        }
        .ac-cat {
          position:absolute;bottom:12px;left:12px;z-index:2;
          font-family:var(--sans);font-size:9px;font-weight:700;
          text-transform:uppercase;letter-spacing:.17em;
          background:var(--o);color:#fff;
          padding:4px 11px;border-radius:99px;
        }
        .ac-body{padding:18px 20px 20px;flex:1;display:flex;flex-direction:column;}
        .ac-title {
          font-family:var(--sans);font-size:14px;font-weight:700;color:var(--text);
          line-height:1.5;flex:1;
          display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;
        }
        .ac-footer{display:flex;align-items:center;justify-content:space-between;margin-top:14px;}
        .ac-meta{font-family:var(--sans);font-size:11px;color:var(--muted);}
        .ac-arrow {
          width:30px;height:30px;border-radius:50%;
          background:rgba(200,85,26,.1);color:var(--o);
          display:flex;align-items:center;justify-content:center;
          transition:background .22s ease,transform .22s ease;flex-shrink:0;
        }
        .ac:hover .ac-arrow{background:var(--o);color:#fff;transform:translateX(2px);}

        /* ════════════════════════
           MEDIA STRIP (dark)
        ════════════════════════ */
        .media-wrap { padding:0 28px; }
        .media-strip {
          max-width:1160px;margin:0 auto;
          border-radius:28px;padding:60px 64px;
          background: linear-gradient(135deg, #1a1008, #2d1508 55%, #1a1008);
          background-size:200% 200%;
          animation:hp-gradMove 9s ease infinite;
          position:relative;overflow:hidden;
        }
        .media-strip::before {
          content:'';position:absolute;
          top:-80px;right:-80px;
          width:300px;height:300px;border-radius:50%;
          background:radial-gradient(circle,rgba(200,85,26,.3),transparent 70%);
          pointer-events:none;
        }
        .media-strip::after {
          content:'✦';
          position:absolute;bottom:-30px;left:44px;
          font-size:220px;color:rgba(255,255,255,.02);
          pointer-events:none;user-select:none;line-height:1;
        }
        .media-eyebrow {
          font-family:var(--sans);font-size:9px;font-weight:700;
          text-transform:uppercase;letter-spacing:.24em;color:var(--g);margin-bottom:14px;
        }
        .media-h2 {
          font-family:var(--body);
          font-size:clamp(26px,3vw,44px);
          font-weight:700;color:#fff;
          line-height:1.16;letter-spacing:-.022em;max-width:540px;
        }
        .media-h2 em{font-style:italic;color:var(--g);}
        .media-p{
          font-family:var(--sans);font-size:14px;color:rgba(255,255,255,.62);
          line-height:1.9;max-width:480px;margin-top:16px;
        }
        .media-btns{display:flex;gap:10px;flex-wrap:wrap;margin-top:28px;}

        /* ── BUTTONS ── */
        .btn-primary {
          display:inline-flex;align-items:center;gap:9px;
          padding:14px 28px;border-radius:99px;
          background:linear-gradient(135deg,var(--o),#8a2e06);
          color:#fff;font-family:var(--sans);font-size:13px;font-weight:700;
          text-decoration:none;border:none;cursor:pointer;
          box-shadow:0 6px 22px rgba(200,85,26,.35);
          transition:transform .22s ease,box-shadow .22s ease;
        }
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(200,85,26,.48);}
        .btn-gold {
          display:inline-flex;align-items:center;gap:9px;
          padding:14px 28px;border-radius:99px;
          background:linear-gradient(135deg,var(--g),#7a5010);
          color:#fff;font-family:var(--sans);font-size:13px;font-weight:700;
          text-decoration:none;border:none;cursor:pointer;
          box-shadow:0 6px 22px rgba(184,132,26,.32);
          transition:transform .22s ease,box-shadow .22s ease;
        }
        .btn-gold:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(184,132,26,.44);}
        .btn-secondary {
          display:inline-flex;align-items:center;gap:9px;
          padding:14px 28px;border-radius:99px;
          background:var(--card);color:var(--text);
          font-family:var(--sans);font-size:13px;font-weight:600;
          text-decoration:none;border:1.5px solid var(--border);cursor:pointer;
          transition:border-color .22s ease,color .22s ease,transform .22s ease;
        }
        .btn-secondary:hover{border-color:var(--o);color:var(--o);transform:translateY(-2px);}
        .btn-ghost {
          display:inline-flex;align-items:center;gap:9px;
          padding:14px 28px;border-radius:99px;
          background:transparent;color:rgba(255,255,255,.78);
          font-family:var(--sans);font-size:13px;font-weight:600;
          text-decoration:none;border:1.5px solid rgba(255,255,255,.18);cursor:pointer;
          transition:border-color .22s ease,color .22s ease;
        }
        .btn-ghost:hover{border-color:rgba(255,255,255,.45);color:#fff;}

        /* ════════════════════════
           SOCIAL
        ════════════════════════ */
        .social-grid {
          display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:36px;
        }
        .soc-card {
          background:var(--card);border:1.5px solid var(--border);border-radius:20px;
          padding:24px 20px;text-decoration:none;color:inherit;
          display:flex;align-items:center;justify-content:space-between;
          transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease;
        }
        .soc-card:hover{transform:translateY(-4px);box-shadow:0 12px 30px rgba(0,0,0,.08);border-color:rgba(200,85,26,.3);}
        .soc-name{font-family:var(--sans);font-size:14px;font-weight:700;color:var(--text);}
        .soc-count{font-family:var(--sans);font-size:12px;color:var(--muted);margin-top:3px;}
        .soc-icon{font-size:24px;transition:transform .25s ease;}
        .soc-card:hover .soc-icon{transform:scale(1.2) rotate(-5deg);}

        /* ════════════════════════
           RESPONSIVE
        ════════════════════════ */
        @media(max-width:1024px){
          .stats-grid{grid-template-columns:repeat(3,1fr);}
          .teach-grid{grid-template-columns:repeat(2,1fr);}
        }
        @media(max-width:860px){
          .hero{grid-template-columns:1fr;min-height:auto;}
          .hero-l{padding:96px 24px 40px;}
          .hero-r{height:68vw;min-height:320px;}
          .hero-r::before{width:40px;}
          .about-grid{grid-template-columns:1fr;gap:40px;}
          .about-photo{max-height:320px;}
          .social-grid{grid-template-columns:repeat(2,1fr);}
          .media-strip{padding:40px 28px;}
          .stats-grid{grid-template-columns:repeat(2,1fr);}
          .media-wrap{padding:0 16px;}
          .hero-scroll{display:none;}
        }
        @media(max-width:560px){
          .sec{padding:64px 0;}
          .social-grid{grid-template-columns:1fr 1fr;}
          .stats-grid{grid-template-columns:1fr 1fr;gap:10px;}
          .teach-grid{grid-template-columns:1fr;}
        }
      `}</style>

      <Navbar />

      {/* ═══════════════════════════════
          HERO
      ═══════════════════════════════ */}
      <section id="teachings" className="hero">
        <div className="hero-l">
          <div className="hero-eyebrow">Guruji Shrawan</div>
          <h1 className="hero-h1">
            Awakening<br/>
            <em><span className="hero-underline">Inner Clarity</span></em><br/>
            &amp; True Understanding
          </h1>
          <p className="hero-desc">
            Deep insights on life, spirituality, relationships, and modern confusion —
            through fearless inquiry and timeless wisdom.
          </p>
          <div className="hero-btns">
            <a href="#videos" className="btn-primary"><FaPlay size={10}/> Watch Teachings</a>
            <Link href="/articles" className="btn-secondary">Explore Articles <FaArrowRight size={10}/></Link>
          </div>

          {/* Rotating bilingual quote */}
          <div className="hero-quote-block">
            <div className="hero-quote-inner">
              <FaQuoteLeft size={16} className="hero-quote-icon"/>
              <div>
                <p className="hero-quote-hi">{QUOTES[qIdx].hi}</p>
                <p className="hero-quote-en">{QUOTES[qIdx].en}</p>
                <div className="hero-quote-dots">
                  {QUOTES.map((_, i) => (
                    <div key={i} className={`hero-quote-dot ${i === qIdx ? "active" : ""}`}
                      onClick={() => { setQFade(false); setTimeout(() => { setQIdx(i); setQFade(true) }, 300) }}
                      style={{cursor:"pointer"}}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Photo */}
        <div className="hero-r">
          <Image
            src="/images/guruji.jpg"
            alt="Guruji Shrawan"
            fill priority
            style={{ objectFit:"cover", objectPosition:"center top" }}
            sizes="(max-width:860px) 100vw, 45vw"
          />
          <div className="hero-badge">
            <div className="hero-badge-live">
              <span className="hero-badge-dot"/>
              Live Sessions Available
            </div>
            <div className="hero-badge-sub">Guruji Shrawan Foundation</div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll">
          <div className="hero-scroll-line"/>
          <span className="hero-scroll-label">Scroll</span>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-track">
          {[...Array(2)].map((_, ri) =>
            ["Truth","Liberation","Vedanta","Self-Inquiry","Consciousness","Relationships","Freedom","Bhakti","Awakening","Advaita","Meditation","Clarity"].map((t, i) => (
              <span key={`${ri}-${i}`} className="ticker-item">{t} <span className="ticker-sep">·</span></span>
            ))
          )}
        </div>
      </div>

      {/* ═══════════════════════════════
          TEACHING PILLARS
      ═══════════════════════════════ */}
      <section className="sec">
        <div className="sec-inner">
          <Reveal>
            <div className="sec-eyebrow">Core Teachings</div>
            <h2 className="sec-h2">What Guruji Explores</h2>
            <p className="sec-sub">Four pillars of inquiry that form the foundation of Guruji Shrawan's teachings.</p>
          </Reveal>
          <div className="teach-grid">
            {TEACHINGS.map((t, i) => (
              <Reveal key={t.title} delay={i * 80}>
                <div className="teach-card">
                  <span className="teach-emoji">{t.icon}</span>
                  <p className="teach-title">{t.title}</p>
                  <p className="teach-desc">{t.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="divider"/>

      {/* ═══════════════════════════════
          ABOUT DARK
      ═══════════════════════════════ */}
      <div className="about-dark">
        <div className="about-grid">
          <Reveal dir="left">
            <div>
              <p className="about-eyebrow">About Guruji Shrawan</p>
              <h2 className="about-h2">A Voice for<br/><em>Genuine Clarity</em></h2>
              <p className="about-p">
                Guruji Shrawan is a contemporary spiritual teacher sharing deep inquiry into
                truth, consciousness, and the nature of the mind. His teachings blend Vedanta,
                Buddhism, and practical wisdom to dissolve confusion.
              </p>
              <p className="about-p">
                With a growing community across India and beyond, his recorded sessions,
                books, and articles have touched thousands seeking understanding over mere belief.
              </p>
              <Link href="/biography" className="about-link">
                Read Full Biography <FaArrowRight size={10}/>
              </Link>
            </div>
          </Reveal>
          <Reveal dir="right" delay={160}>
            <div className="about-photo">
              <Image
                src="/images/guruji.jpg"
                alt="Guruji Shrawan"
                fill
                style={{ objectFit:"cover", objectPosition:"center" }}
                sizes="(max-width:860px) 90vw, 45vw"
              />
              <div className="about-photo-label">
                <div className="about-photo-dot"/>
                <div>
                  <div className="about-photo-name">Guruji Shrawan</div>
                  <div className="about-photo-role">Spiritual Teacher · Author</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ═══════════════════════════════
          STATS
      ═══════════════════════════════ */}
      <section className="sec">
        <div className="sec-inner">
          <Reveal>
            <div className="sec-eyebrow">Impact &amp; Reach</div>
            <h2 className="sec-h2">A Growing Movement</h2>
          </Reveal>
          <div className="stats-grid">
            {STATS.map((item, i) => (
              <Reveal key={item.label} delay={i * 70}>
                <StatCard item={item}/>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="divider"/>

      {/* ═══════════════════════════════
          BOOKS
      ═══════════════════════════════ */}
      <section id="books" style={{ paddingTop:0, paddingBottom:0 }}>
        <BookSection/>
      </section>

      <div className="divider"/>

      {/* ═══════════════════════════════
          VIDEOS
      ═══════════════════════════════ */}
      <section id="videos" className="sec">
        <div className="sec-inner">
          <Reveal>
            <div className="carousel-head">
              <div>
                <div className="sec-eyebrow">Video Teachings</div>
                <h2 className="sec-h2">Watch &amp; Listen</h2>
              </div>
              <div className="carousel-controls">
                <button className="carousel-btn" onClick={() => vidSwiper?.slidePrev()} aria-label="Prev"><FaAngleLeft size={14}/></button>
                <span className="carousel-counter">{vidIdx + 1} / {VIDEOS.length}</span>
                <button className="carousel-btn" onClick={() => vidSwiper?.slideNext()} aria-label="Next"><FaAngleRight size={14}/></button>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <Swiper
              onSwiper={setVidSwiper}
              onSlideChange={s => setVidIdx(s.realIndex)}
              spaceBetween={16} slidesPerView={1.15}
              breakpoints={{ 540:{slidesPerView:2.1}, 860:{slidesPerView:3.1}, 1200:{slidesPerView:4.1} }}
            >
              {VIDEOS.map(v => (
                <SwiperSlide key={v.id} style={{height:"auto"}}>
                  <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer" className="vc">
                    <div className="vc-thumb">
                      <Image src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`} alt={v.title} fill
                        sizes="(max-width:640px) 80vw, 25vw" style={{objectFit:"cover"}}/>
                      <div className="vc-overlay"/>
                      <div className="vc-play"><FaPlay size={12}/></div>
                      <div className="vc-yt"><FaYoutube size={15}/></div>
                    </div>
                    <div className="vc-info">
                      <span className="vc-title">{v.title}</span>
                      <span className="vc-cta">Watch →</span>
                    </div>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          </Reveal>
          <Reveal delay={180}>
            <div style={{textAlign:"right"}}>
              <a href="https://youtube.com/@gurujishrawan" target="_blank" rel="noopener noreferrer" className="view-all-link">
                All Videos on YouTube <FaArrowRight size={9}/>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════
          MEDIA STRIP
      ═══════════════════════════════ */}
      <section id="trending" style={{paddingBottom:96}}>
        <div className="media-wrap">
          <Reveal>
            <div className="media-strip">
              <div className="media-eyebrow">In Media · Trending Now</div>
              <h2 className="media-h2">Awakening<br/><em>Conscious Living</em></h2>
              <p className="media-p">
                A movement encouraging people to live with awareness, responsibility, and
                freedom from blind beliefs — bringing clarity to individuals facing confusion
                in modern society.
              </p>
              <div className="media-btns">
                <Link href="/biography" className="btn-gold">Know More <FaArrowRight size={10}/></Link>
                <a href="https://youtube.com/@gurujishrawan" target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  <FaYoutube/> YouTube Channel
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════
          ARTICLES
      ═══════════════════════════════ */}
      <section id="articles" className="sec" style={{paddingTop:0}}>
        <div className="sec-inner">
          <Reveal>
            <div className="carousel-head">
              <div>
                <div className="sec-eyebrow">Latest Articles</div>
                <h2 className="sec-h2">Wisdom in Writing</h2>
              </div>
              <div className="carousel-controls">
                <button className="carousel-btn" onClick={() => artSwiper?.slidePrev()} aria-label="Prev"><FaAngleLeft size={14}/></button>
                <span className="carousel-counter">{artIdx + 1} / {Math.max(articles.length, 1)}</span>
                <button className="carousel-btn" onClick={() => artSwiper?.slideNext()} aria-label="Next"><FaAngleRight size={14}/></button>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <Swiper
              onSwiper={setArtSwiper}
              onSlideChange={s => setArtIdx(s.realIndex)}
              spaceBetween={16} slidesPerView={1.1}
              breakpoints={{ 480:{slidesPerView:1.3}, 640:{slidesPerView:1.8}, 900:{slidesPerView:2.5}, 1100:{slidesPerView:3} }}
            >
              {(articles.length > 0
                ? articles
                : [{slug:"__",category:"Wisdom",title:{en:"New articles coming soon"},readTime:"",featuredImage:""}]
              ).map((a, i) => (
                <SwiperSlide key={a.slug} style={{height:"auto"}}>
                  <Link href={a.slug==="__"?"/articles":`/articles/${a.slug}`} className="ac">
                    <div className="ac-img">
                      <Image src={a.featuredImage||`/images/hero${(i%3)+1}.jpg`} alt={a.title?.en||"Article"}
                        fill sizes="(max-width:640px) 90vw, 30vw" style={{objectFit:"cover"}}/>
                      <div className="ac-img-overlay"/>
                      <div className="ac-cat">{a.category||"Wisdom"}</div>
                    </div>
                    <div className="ac-body">
                      <div className="ac-title">{a.title?.en}</div>
                      <div className="ac-footer">
                        <span className="ac-meta">{a.readTime ? `${a.readTime} read` : "Read article"}</span>
                        <div className="ac-arrow"><FaArrowRight size={10}/></div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </Reveal>
          <Reveal delay={180}>
            <div style={{textAlign:"right"}}>
              <Link href="/articles" className="view-all-link">Browse All Articles <FaArrowRight size={9}/></Link>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="divider"/>

      {/* ═══════════════════════════════
          SOCIAL
      ═══════════════════════════════ */}
      <section className="sec">
        <div className="sec-inner">
          <Reveal>
            <div className="sec-eyebrow">Social Presence</div>
            <h2 className="sec-h2">Follow the Journey</h2>
          </Reveal>
          <div className="social-grid">
            {SOCIAL.map((s, i) => (
              <Reveal key={s.name} delay={i * 65}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="soc-card">
                  <div>
                    <div className="soc-name">{s.name}</div>
                    <div className="soc-count">{s.count} followers</div>
                  </div>
                  <div className="soc-icon" style={{color:s.color}}>{s.icon}</div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}