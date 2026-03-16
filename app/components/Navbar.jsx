"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { siteContent } from "../content/siteContent"
import { useLanguage } from "../context/LanguageContext"
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, BookOpen, Settings, Heart } from "lucide-react"
import { supabase } from "../lib/supabaseClient"

/* ── tokens ── */
const ORANGE = "#c8551a"
const GOLD   = "#b8841a"
const TEXT   = "#1a1008"
const MUTED  = "#8a7a6a"
const BORDER = "#e8ddd0"
const BG     = "#faf7f2"
const SANS   = "'Poppins', system-ui, sans-serif"

/* ── avatar ── */
function Avatar({ user, size = 32 }) {
  const photo   = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null
  const name    = user?.user_metadata?.full_name || user?.email || "U"
  const initial = name[0].toUpperCase()
  const COLS    = ["#c8551a","#7c3aed","#0891b2","#16a34a","#b8841a","#e11d48"]
  let h = 0
  for (let i = 0; i < (user?.id||"").length; i++) h = (user?.id||"").charCodeAt(i) + ((h<<5)-h)
  const bg = COLS[Math.abs(h) % COLS.length]
  const s  = { width:size, height:size, borderRadius:"50%", flexShrink:0 }

  return photo ? (
    <div style={{ ...s, overflow:"hidden", border:`2px solid ${BORDER}` }}>
      <Image src={photo} width={size} height={size} alt={name}
        style={{ objectFit:"cover", width:"100%", height:"100%", display:"block" }}
        referrerPolicy="no-referrer" unoptimized/>
    </div>
  ) : (
    <div style={{ ...s, background:bg, border:`2px solid ${BORDER}`, display:"flex",
      alignItems:"center", justifyContent:"center",
      fontFamily:SANS, fontSize:Math.round(size*0.38), fontWeight:700, color:"#fff" }}>
      {initial}
    </div>
  )
}

export default function Navbar() {
  const router   = useRouter()
  const pathname = usePathname()
  const { language, setLanguage } = useLanguage()
  const t = siteContent[language] || siteContent.en

  const [scrolled, setScrolled] = useState(false)
  const [drawer,   setDrawer]   = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [user,     setUser]     = useState(null)
  const [donateHover, setDonateHover] = useState(false)

  const langRef   = useRef(null)
  const userRef   = useRef(null)
  const drawerRef = useRef(null)

  /* scroll */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  /* auth */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  /* outside-click closes dropdowns */
  useEffect(() => {
    const fn = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false)
    }
    document.addEventListener("mousedown", fn)
    return () => document.removeEventListener("mousedown", fn)
  }, [])

  /* route change → close everything */
  useEffect(() => {
    setDrawer(false)
    setLangOpen(false)
    setUserOpen(false)
  }, [pathname])

  /* body scroll lock when drawer open */
  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [drawer])

  const closeDrawer = useCallback(() => setDrawer(false), [])
  const openDrawer  = useCallback(() => setDrawer(true),  [])

  const active = (h) => h === "/" ? pathname === "/" : pathname.startsWith(h)

  /* ── Language switch — updates context + forces re-render on all pages ── */
  const switchLang = useCallback((l) => {
    setLanguage(l)
    setLangOpen(false)
  }, [setLanguage])

  const NAV = [
    { label: t?.nav?.home      || "Home",        href: "/"             },
    { label: t?.nav?.articles  || "Articles",    href: "/articles"     },
    { label: "YouTube",                           href: "https://www.youtube.com/@gurujishrawan", external: true },
    { label: "Books",                             href: "/books"        },
    { label: "Video Series",                      href: "/video-series" },
    { label: t?.nav?.biography || "Biography",   href: "/biography"    },
  ]

  async function logout() {
    await supabase.auth.signOut()
    setUser(null); setUserOpen(false)
    router.push("/")
  }

  const displayName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || ""

  /* ── Language label ── */
  const langLabel = language === "hi" ? "हि" : "EN"

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

        @keyframes nbReveal  { from{opacity:0;transform:translateY(-100%)} to{opacity:1;transform:translateY(0)} }
        @keyframes nbDropIn  { from{opacity:0;transform:translateY(-8px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes nbFadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes nbSlideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }
        @keyframes nbLinkIn  { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }
        @keyframes nbHeartPop { 0%{transform:scale(1)} 50%{transform:scale(1.22)} 100%{transform:scale(1)} }

        /* ── ROOT BAR ── */
        .nb {
          position:sticky; top:0; z-index:600;
          font-family:${SANS};
          background:rgba(250,247,242,0.97);
          backdrop-filter:blur(20px) saturate(1.5);
          -webkit-backdrop-filter:blur(20px) saturate(1.5);
          border-bottom:1px solid ${BORDER};
          transition:box-shadow .3s ease, border-color .3s ease;
          animation:nbReveal .5s cubic-bezier(.16,1,.3,1) both;
        }
        .nb.up {
          box-shadow:0 2px 28px rgba(180,80,20,0.10);
          border-color:rgba(232,221,208,0.7);
        }
        .nb-in {
          max-width:1220px; margin:0 auto;
          padding:0 24px; height:68px;
          display:flex; align-items:center; gap:0;
        }

        /* ── LOGO ── */
        .nb-logo {
          display:flex; align-items:center;
          text-decoration:none; flex-shrink:0;
          margin-right:16px;
          transition:opacity .2s;
        }
        .nb-logo:hover { opacity:.8; }

        /* ── SEPARATOR ── */
        .nb-sep {
          width:1px; height:22px; background:${BORDER};
          margin-right:20px; flex-shrink:0;
        }

        /* ── DESKTOP NAV ── */
        .nb-nav {
          display:flex; align-items:center; gap:0;
          flex:1; overflow:hidden;
        }
        .nb-a {
          position:relative; display:inline-block;
          padding:6px 9px;
          font-size:13px; font-weight:500; color:#5a4a3a;
          text-decoration:none; letter-spacing:0.005em;
          transition:color .18s; white-space:nowrap;
        }
        .nb-a::after {
          content:'';
          position:absolute; left:12px; right:12px; bottom:-1px;
          height:2px; background:${ORANGE}; border-radius:99px;
          transform:scaleX(0); transform-origin:left;
          transition:transform .25s cubic-bezier(.34,1.56,.64,1);
        }
        .nb-a:hover { color:${ORANGE}; }
        .nb-a:hover::after { transform:scaleX(0.5); }
        .nb-a.on { color:${TEXT}; font-weight:600; }
        .nb-a.on::after { transform:scaleX(1); }

        /* ── RIGHT ACTIONS ── */
        .nb-right {
          display:flex; align-items:center; gap:6px;
          flex-shrink:0; margin-left:auto;
        }

        /* ── DONATE BUTTON ── */
        .nb-donate {
          display:inline-flex; align-items:center; gap:6px;
          padding:7px 14px; border-radius:99px;
          font-family:${SANS}; font-size:12.5px; font-weight:700;
          color:${ORANGE}; text-decoration:none;
          border:1.5px solid ${ORANGE};
          background:transparent;
          transition:background .2s ease, box-shadow .2s ease, transform .15s ease, color .2s ease;
          white-space:nowrap; letter-spacing:0.02em;
        }
        .nb-donate:hover {
          background:linear-gradient(135deg,${ORANGE},#8a2e06);
          color:#fff;
          box-shadow:0 4px 18px rgba(200,85,26,0.32);
          transform:translateY(-1px);
          border-color:transparent;
        }
        .nb-donate:hover .nb-donate-heart { animation:nbHeartPop .3s ease; }
        .nb-donate:active { transform:scale(.96); }
        .nb-donate-heart { display:inline-flex; align-items:center; transition:color .2s; }

        /* ── LANGUAGE ── */
        .nb-lang-btn {
          display:flex; align-items:center; gap:4px;
          padding:5px 9px; border-radius:7px;
          border:1.5px solid ${BORDER}; background:transparent;
          font-family:${SANS}; font-size:11px; font-weight:700;
          color:${MUTED}; cursor:pointer;
          transition:all .18s; letter-spacing:0.05em;
          white-space:nowrap;
        }
        .nb-lang-btn:hover { border-color:${ORANGE}; color:${ORANGE}; background:#fff8f3; }
        .nb-lang-btn.active { border-color:${ORANGE}; color:${ORANGE}; background:#fff0e6; }
        .nb-lang-chev { transition:transform .22s; flex-shrink:0; }
        .nb-lang-chev.flip { transform:rotate(180deg); }

        .nb-lang-drop {
          position:absolute; right:0; top:calc(100% + 10px);
          min-width:152px;
          background:#fff; border:1.5px solid ${BORDER}; border-radius:13px;
          box-shadow:0 12px 36px rgba(180,80,20,0.14);
          overflow:hidden; z-index:800;
          animation:nbDropIn .18s cubic-bezier(.16,1,.3,1);
        }
        .nb-lang-opt {
          width:100%; text-align:left;
          padding:11px 16px; border:none; background:transparent;
          font-family:${SANS}; font-size:13px; font-weight:500;
          color:#5a4a3a; cursor:pointer;
          transition:background .12s;
          display:flex; align-items:center; gap:10px;
        }
        .nb-lang-opt:hover { background:#fff8f3; }
        .nb-lang-opt.on { color:${ORANGE}; font-weight:700; background:#fff0e6; }
        .nb-lang-tick { color:${ORANGE}; font-size:12px; margin-left:auto; }

        /* ── AUTH BUTTONS ── */
        .nb-login {
          padding:6px 14px; border-radius:8px;
          font-family:${SANS}; font-size:12.5px; font-weight:600;
          color:${ORANGE}; background:transparent;
          border:1.5px solid ${ORANGE};
          text-decoration:none; transition:all .18s; white-space:nowrap;
        }
        .nb-login:hover { background:#fff0e6; }
        .nb-signup {
          padding:6px 16px; border-radius:8px;
          font-family:${SANS}; font-size:12.5px; font-weight:700;
          color:#fff;
          background:linear-gradient(135deg,${ORANGE},#8a2e06);
          border:none; text-decoration:none; white-space:nowrap;
          box-shadow:0 2px 12px rgba(200,85,26,0.28);
          transition:box-shadow .18s, transform .12s;
        }
        .nb-signup:hover { box-shadow:0 4px 18px rgba(200,85,26,0.38); transform:translateY(-1px); }

        /* ── USER BUTTON ── */
        .nb-user-btn {
          display:flex; align-items:center; gap:7px;
          padding:4px 10px 4px 4px;
          border-radius:99px; border:1.5px solid ${BORDER};
          background:transparent; cursor:pointer; transition:all .18s;
        }
        .nb-user-btn:hover { border-color:${ORANGE}; background:#fff8f3; }
        .nb-user-nm {
          font-family:${SANS}; font-size:12px; font-weight:600; color:${TEXT};
          max-width:80px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
        }

        /* ── USER DROPDOWN ── */
        .nb-u-drop {
          position:absolute; right:0; top:calc(100% + 10px);
          width:220px; background:#fff;
          border:1.5px solid ${BORDER}; border-radius:16px;
          box-shadow:0 12px 40px rgba(0,0,0,0.12);
          overflow:hidden; z-index:800;
          animation:nbDropIn .18s cubic-bezier(.16,1,.3,1);
        }
        .nb-u-head {
          padding:14px 16px 12px; border-bottom:1px solid #f0e8de;
          display:flex; gap:11px; align-items:center;
        }
        .nb-u-nm  { font-family:${SANS}; font-size:13px; font-weight:700; color:${TEXT}; }
        .nb-u-em  { font-family:${SANS}; font-size:11px; color:${MUTED};
                    overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .nb-d-item {
          display:flex; align-items:center; gap:10px;
          padding:10px 16px;
          font-family:${SANS}; font-size:13px; font-weight:500; color:#3a2a1a;
          text-decoration:none; border:none; background:none; width:100%;
          text-align:left; cursor:pointer; transition:background .12s;
        }
        .nb-d-item:hover { background:#fff8f3; }
        .nb-d-item.red { color:#dc2626; }
        .nb-d-item.red:hover { background:#fef2f2; }
        .nb-d-div { height:1px; background:#f0e8de; margin:4px 0; }

        /* ── HAMBURGER ── */
        .nb-ham {
          display:none;
          width:38px; height:38px; border-radius:8px;
          background:transparent; border:1.5px solid ${BORDER};
          align-items:center; justify-content:center;
          cursor:pointer; color:${TEXT}; flex-shrink:0;
          transition:all .18s; margin-left:8px;
        }
        .nb-ham:hover { border-color:${ORANGE}; color:${ORANGE}; background:#fff8f3; }
        .nb-ham svg { transition:transform .25s ease, opacity .18s ease; }
        .nb-ham.open svg { transform:rotate(90deg); }

        /* ── MOBILE OVERLAY ── */
        .nb-ov {
          position:fixed; inset:0; z-index:590;
          background:rgba(20,10,4,0.55);
          backdrop-filter:blur(5px);
          animation:nbFadeIn .22s ease-out;
          cursor:pointer;
        }

        /* ── MOBILE DRAWER ── */
        .nb-dw {
          position:fixed; top:0; right:0; bottom:0; z-index:595;
          width:min(300px,88vw);
          background:${BG};
          box-shadow:-8px 0 48px rgba(0,0,0,0.20);
          display:flex; flex-direction:column;
          animation:nbSlideIn .28s cubic-bezier(.16,1,.3,1);
          overflow-y:auto;
        }
        .nb-dw-hd {
          display:flex; align-items:center; justify-content:space-between;
          padding:16px 18px 14px;
          border-bottom:1px solid ${BORDER};
          flex-shrink:0;
        }
        .nb-dw-close {
          width:34px; height:34px; border-radius:8px;
          background:#fff0e6; border:1px solid #ffd4a8;
          cursor:pointer; display:flex; align-items:center;
          justify-content:center; color:${ORANGE};
          flex-shrink:0; transition:background .15s;
        }
        .nb-dw-close:hover { background:#ffe0c8; }

        .nb-dw-nav { padding:10px 14px 0; flex:1; }
        .nb-dw-a {
          display:flex; align-items:center;
          padding:13px 14px;
          border-bottom:1px solid #f0e8de;
          font-family:${SANS}; font-size:14px; font-weight:500; color:#3a2a1a;
          text-decoration:none; transition:color .15s, padding-left .15s;
          position:relative;
        }
        .nb-dw-a:last-child { border-bottom:none; }
        .nb-dw-a::before {
          content:'';
          position:absolute; left:0; top:50%; transform:translateY(-50%);
          width:3px; height:0;
          background:${ORANGE}; border-radius:0 2px 2px 0;
          transition:height .2s ease;
        }
        .nb-dw-a.on { color:${ORANGE}; font-weight:600; padding-left:20px; }
        .nb-dw-a.on::before { height:60%; }
        .nb-dw-a:hover:not(.on) { color:${ORANGE}; padding-left:18px; }

        .nb-dw-a:nth-child(1) { animation:nbLinkIn .25s .05s both }
        .nb-dw-a:nth-child(2) { animation:nbLinkIn .25s .09s both }
        .nb-dw-a:nth-child(3) { animation:nbLinkIn .25s .13s both }
        .nb-dw-a:nth-child(4) { animation:nbLinkIn .25s .17s both }
        .nb-dw-a:nth-child(5) { animation:nbLinkIn .25s .21s both }
        .nb-dw-a:nth-child(6) { animation:nbLinkIn .25s .25s both }

        .nb-dw-ft {
          padding:16px 18px 24px;
          border-top:1px solid ${BORDER};
          flex-shrink:0;
        }

        /* ── LANGUAGE TOGGLE (drawer) — pill style ── */
        .nb-dw-lng {
          display:flex; background:#fff; border:1.5px solid ${BORDER};
          border-radius:11px; padding:3px; gap:3px;
          margin-bottom:14px;
        }
        .nb-dw-lb {
          flex:1; padding:8px 6px; border-radius:8px;
          border:none; background:transparent;
          font-family:${SANS}; font-size:12px; font-weight:600;
          color:${MUTED}; cursor:pointer; transition:all .18s;
          letter-spacing:0.04em; text-align:center;
        }
        .nb-dw-lb.on {
          background:${ORANGE};
          color:#fff;
          box-shadow:0 2px 8px rgba(200,85,26,0.28);
        }

        /* ── DONATE in drawer ── */
        .nb-dw-donate {
          display:flex; align-items:center; justify-content:center; gap:7px;
          padding:12px; border-radius:12px; margin-bottom:10px;
          font-family:${SANS}; font-size:14px; font-weight:700;
          color:#fff; text-decoration:none;
          background:linear-gradient(135deg,${ORANGE},#8a2e06);
          box-shadow:0 4px 18px rgba(200,85,26,0.28);
          transition:opacity .15s, transform .15s;
          border:none; cursor:pointer;
        }
        .nb-dw-donate:hover { opacity:.88; transform:translateY(-1px); }
        .nb-dw-donate:active { transform:scale(.97); }

        /* auth ctas in drawer */
        .nb-dw-li {
          display:block; text-align:center; padding:11px;
          border-radius:10px; margin-bottom:8px;
          font-family:${SANS}; font-size:14px; font-weight:600;
          color:${ORANGE}; background:transparent;
          border:1.5px solid ${ORANGE}; text-decoration:none;
          transition:background .15s;
        }
        .nb-dw-li:hover { background:#fff0e6; }
        .nb-dw-si {
          display:block; text-align:center; padding:11px;
          border-radius:10px;
          font-family:${SANS}; font-size:14px; font-weight:700;
          color:#fff; background:linear-gradient(135deg,${ORANGE},#8a2e06);
          text-decoration:none; transition:opacity .15s;
          box-shadow:0 2px 12px rgba(200,85,26,0.28);
        }
        .nb-dw-si:hover { opacity:.88; }

        /* user section in drawer */
        .nb-dw-user {
          display:flex; align-items:center; gap:12px;
          padding:10px 0 14px; border-bottom:1px solid ${BORDER}; margin-bottom:8px;
        }
        .nb-dw-unm { font-family:${SANS}; font-size:14px; font-weight:700; color:${TEXT}; }
        .nb-dw-uem { font-family:${SANS}; font-size:11px; color:${MUTED}; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .nb-dw-act {
          display:flex; align-items:center; gap:9px;
          padding:10px 12px; border-radius:9px;
          font-family:${SANS}; font-size:13px; font-weight:500; color:#3a2a1a;
          text-decoration:none; border:none; background:none;
          width:100%; cursor:pointer; transition:all .15s; margin-bottom:2px;
        }
        .nb-dw-act:hover { background:#fff0e6; color:${ORANGE}; }
        .nb-dw-out {
          display:flex; align-items:center; gap:9px;
          padding:10px 12px; border-radius:9px;
          font-family:${SANS}; font-size:13px; font-weight:500;
          color:#dc2626; border:none; background:none; width:100%; cursor:pointer;
          margin-top:4px; transition:background .15s;
        }
        .nb-dw-out:hover { background:#fef2f2; }

        /* ── RESPONSIVE ── */
        @media (max-width:1100px) {
          .nb-a { padding:6px 7px; font-size:12.5px; }
          .nb-donate { padding:6px 11px; font-size:12px; }
        }
        @media (max-width:960px) {
          .nb-nav, .nb-right { display:none !important; }
          .nb-ham { display:flex !important; }
          .nb-in { padding:0 16px; }
        }
        @media (max-width:400px) {
          .nb-in { height:60px; }
        }
      `}</style>

      {/* ─── NAVBAR ─── */}
      <header className={`nb${scrolled ? " up" : ""}`}>
        <div className="nb-in">

          {/* Logo */}
          <Link href="/" className="nb-logo" aria-label="Guruji Shrawan Home">
            <Image
              src="/images/logo.png"
              alt="Guruji Shrawan"
              width={160}
              height={44}
              style={{ height:44, width:"auto", objectFit:"contain",
                filter:"invert(1) brightness(0.15)" }}
              priority
            />
          </Link>

          <div className="nb-sep"/>

          {/* Desktop nav links */}
          <nav className="nb-nav" aria-label="Main navigation">
            {NAV.map(({ label, href, external }) => (
              <Link
                key={href} href={href}
                className={`nb-a${active(href) ? " on" : ""}`}
                {...(external ? { target:"_blank", rel:"noopener noreferrer" } : {})}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop right */}
          <div className="nb-right">

            {/* ── DONATE button ── */}
            <Link href="/donate" className="nb-donate" aria-label="Donate to Guruji Shrawan Foundation">
              <span className="nb-donate-heart"><Heart size={13} fill="currentColor"/></span>
              Donate
            </Link>

            {/* ── Language switcher ── */}
            <div style={{ position:"relative" }} ref={langRef}>
              <button
                className={`nb-lang-btn${langOpen ? " active" : ""}`}
                onClick={() => setLangOpen(o => !o)}
                aria-expanded={langOpen}
                aria-haspopup="listbox"
                aria-label="Switch language"
              >
                <span>{langLabel}</span>
                <ChevronDown size={10} className={`nb-lang-chev${langOpen ? " flip" : ""}`}/>
              </button>
              {langOpen && (
                <div className="nb-lang-drop" role="listbox">
                  {[
                    { l:"en", flag:"🇬🇧", label:"English"  },
                    { l:"hi", flag:"🇮🇳", label:"हिंदी"    },
                  ].map(({ l, flag, label }) => (
                    <button
                      key={l}
                      className={`nb-lang-opt${language === l ? " on" : ""}`}
                      onClick={() => switchLang(l)}
                      role="option"
                      aria-selected={language === l}
                    >
                      <span>{flag}</span>
                      <span>{label}</span>
                      {language === l && <span className="nb-lang-tick">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Auth ── */}
            {!user ? (
              <>
                <Link href="/signin" className="nb-login">Sign In</Link>
                <Link href="/signup" className="nb-signup">Sign Up</Link>
              </>
            ) : (
              <div style={{ position:"relative" }} ref={userRef}>
                <button
                  className="nb-user-btn"
                  onClick={() => setUserOpen(o => !o)}
                  aria-expanded={userOpen}
                >
                  <Avatar user={user} size={28}/>
                  <span className="nb-user-nm">{displayName}</span>
                  <ChevronDown size={10} style={{ color:MUTED, transition:"transform .22s",
                    transform:userOpen?"rotate(180deg)":"none", flexShrink:0 }}/>
                </button>
                {userOpen && (
                  <div className="nb-u-drop">
                    <div className="nb-u-head">
                      <Avatar user={user} size={38}/>
                      <div style={{ minWidth:0 }}>
                        <div className="nb-u-nm">{user.user_metadata?.full_name || displayName}</div>
                        <div className="nb-u-em">{user.email}</div>
                      </div>
                    </div>
                    <div style={{ padding:"6px 0" }}>
                      <Link href="/dashboard"          className="nb-d-item" onClick={()=>setUserOpen(false)}><LayoutDashboard size={14} style={{color:MUTED,flexShrink:0}}/> Dashboard</Link>
                      <Link href="/dashboard/saved"    className="nb-d-item" onClick={()=>setUserOpen(false)}><BookOpen        size={14} style={{color:MUTED,flexShrink:0}}/> Saved Articles</Link>
                      <Link href="/dashboard/settings" className="nb-d-item" onClick={()=>setUserOpen(false)}><Settings        size={14} style={{color:MUTED,flexShrink:0}}/> Settings</Link>
                      <div className="nb-d-div"/>
                      <button className="nb-d-item red" onClick={logout}><LogOut size={14} style={{flexShrink:0}}/> Sign Out</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button
            type="button"
            className={`nb-ham${drawer ? " open" : ""}`}
            onClick={() => setDrawer(prev => !prev)}
            aria-label={drawer ? "Close menu" : "Open menu"}
          >
            {drawer ? <X size={18}/> : <Menu size={18}/>}
          </button>
        </div>
      </header>

      {/* ─── MOBILE DRAWER ─── */}
      {drawer && (
        <>
          <div className="nb-ov" onClick={closeDrawer} aria-hidden="true"/>

          <div className="nb-dw" role="dialog" aria-modal="true" aria-label="Navigation menu" ref={drawerRef}>

            {/* Drawer header */}
            <div className="nb-dw-hd">
              <Link href="/" className="nb-logo" onClick={closeDrawer} aria-label="Home">
                <Image
                  src="/images/logo.png" alt="Guruji Shrawan"
                  width={90} height={30}
                  style={{ height:30, width:"auto", objectFit:"contain",
                    filter:"invert(1) brightness(0.15)" }}
                  priority
                />
              </Link>
              <button type="button" className="nb-dw-close" onClick={closeDrawer} aria-label="Close menu">
                <X size={17}/>
              </button>
            </div>

            {/* Nav links */}
            <div className="nb-dw-nav">
              {NAV.map(({ label, href, external }) => (
                <Link
                  key={href} href={href}
                  className={`nb-dw-a${active(href) ? " on" : ""}`}
                  onClick={closeDrawer}
                  {...(external ? { target:"_blank", rel:"noopener noreferrer" } : {})}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Drawer footer */}
            <div className="nb-dw-ft">

              {/* ── Language toggle — pill switcher ── */}
              <div className="nb-dw-lng" role="group" aria-label="Language selection">
                {[
                  { l:"en", label:"🇬🇧  English" },
                  { l:"hi", label:"🇮🇳  हिंदी"   },
                ].map(({ l, label }) => (
                  <button
                    key={l}
                    type="button"
                    className={`nb-dw-lb${language === l ? " on" : ""}`}
                    onClick={() => { switchLang(l) }}
                    aria-pressed={language === l}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* ── Donate ── */}
              <Link href="/donate" className="nb-dw-donate" onClick={closeDrawer}>
                <Heart size={15} fill="currentColor"/>
                Donate to the Foundation
              </Link>

              {/* Auth */}
              {!user ? (
                <>
                  <Link href="/signin" className="nb-dw-li" onClick={closeDrawer}>Sign In</Link>
                  <Link href="/signup" className="nb-dw-si" onClick={closeDrawer}>Create Free Account</Link>
                </>
              ) : (
                <>
                  <div className="nb-dw-user">
                    <Avatar user={user} size={42}/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div className="nb-dw-unm">{user.user_metadata?.full_name || displayName}</div>
                      <div className="nb-dw-uem">{user.email}</div>
                    </div>
                  </div>
                  <Link href="/dashboard"          className="nb-dw-act" onClick={closeDrawer}><LayoutDashboard size={14}/> Dashboard</Link>
                  <Link href="/dashboard/saved"    className="nb-dw-act" onClick={closeDrawer}><BookOpen        size={14}/> Saved Articles</Link>
                  <Link href="/dashboard/settings" className="nb-dw-act" onClick={closeDrawer}><Settings        size={14}/> Settings</Link>
                  <button type="button" className="nb-dw-out" onClick={logout}><LogOut size={14}/> Sign Out</button>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}