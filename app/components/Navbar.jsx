"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { siteContent } from "../content/siteContent"
import { useLanguage } from "../context/LanguageContext"
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, BookOpen, Settings } from "lucide-react"
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
  const router    = useRouter()
  const pathname  = usePathname()
  const { language, setLanguage } = useLanguage()
  const t = siteContent[language] || siteContent.en

  const [scrolled, setScrolled] = useState(false)
  const [drawer,   setDrawer]   = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [user,     setUser]     = useState(null)

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

  /* route change → close drawer + dropdowns */
  useEffect(() => {
    setDrawer(false)
    setLangOpen(false)
    setUserOpen(false)
  }, [pathname])

  /* body scroll lock */
  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [drawer])

  /* close drawer — stable ref so button onClick always works */
  const closeDrawer = useCallback(() => setDrawer(false), [])
  const openDrawer  = useCallback(() => setDrawer(true),  [])

  const active = (h) => h === "/" ? pathname === "/" : pathname.startsWith(h)

  const NAV = [
    { label: t?.nav?.home      || "Home",        href: "/"             },
    { label: t?.nav?.articles  || "Articles",    href: "/articles"     },
    { label: "YouTube",                           href: "/youtube"      },
    { label: "Books",                             href: "/books"        },
    { label: "Video Series",                      href: "/video-series" },
    { label: t?.nav?.biography || "Biography",   href: "/biography"    },
  ]

  async function logout() {
    await supabase.auth.signOut()
    setUser(null); setUserOpen(false)
    router.push("/")
  }

  function switchLang(l) {
    setLanguage(l)
    setLangOpen(false)
  }

  const displayName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || ""

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');

        /* ── KEYFRAMES ── */
        @keyframes nbReveal {
          from { opacity:0; transform:translateY(-100%) }
          to   { opacity:1; transform:translateY(0) }
        }
        @keyframes nbDropIn {
          from { opacity:0; transform:translateY(-10px) scale(.97) }
          to   { opacity:1; transform:translateY(0)  scale(1) }
        }
        @keyframes nbFadeIn {
          from { opacity:0 }
          to   { opacity:1 }
        }
        @keyframes nbSlideIn {
          from { transform:translateX(100%) }
          to   { transform:translateX(0) }
        }
        @keyframes nbLinkIn {
          from { opacity:0; transform:translateX(18px) }
          to   { opacity:1; transform:translateX(0) }
        }
        @keyframes spin { to { transform:rotate(360deg) } }

        /* ── ROOT BAR ── */
        .nb {
          position: sticky; top: 0; z-index: 600;
          font-family: ${SANS};
          background: rgba(250,247,242,0.96);
          backdrop-filter: blur(18px) saturate(1.4);
          -webkit-backdrop-filter: blur(18px) saturate(1.4);
          border-bottom: 1px solid ${BORDER};
          transition: box-shadow .3s ease, border-color .3s ease;
          animation: nbReveal .5s cubic-bezier(.16,1,.3,1) both;
        }
        .nb.up {
          box-shadow: 0 2px 28px rgba(180,80,20,0.10);
          border-color: rgba(232,221,208,0.6);
        }
        .nb-in {
          max-width: 1220px; margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex; align-items: center; gap: 0;
        }

        /* ── LOGO ── */
        .nb-logo {
          display: flex; align-items: center;
          text-decoration: none; flex-shrink: 0;
          margin-right: 32px;
          transition: opacity .2s;
        }
        .nb-logo:hover { opacity: .82; }
        .nb-logo img {
          display: block;
          /* white logo on light bg → invert to make it dark */
          filter: invert(1) brightness(0.15);
          transition: filter .2s;
        }
        .nb-logo:hover img { filter: invert(1) brightness(0); }

        /* ── DESKTOP NAV ── */
        .nb-nav {
          display: flex; align-items: center; gap: 0;
          flex: 1;
        }
        .nb-a {
          position: relative;
          display: inline-block;
          padding: 6px 14px;
          font-size: 13.5px; font-weight: 500; color: #5a4a3a;
          text-decoration: none;
          letter-spacing: 0.005em;
          transition: color .18s;
          white-space: nowrap;
        }
        .nb-a::after {
          content: '';
          position: absolute; left: 14px; right: 14px; bottom: -1px;
          height: 2px;
          background: ${ORANGE};
          border-radius: 99px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform .25s cubic-bezier(.34,1.56,.64,1);
        }
        .nb-a:hover { color: ${ORANGE}; }
        .nb-a:hover::after { transform: scaleX(0.5); }
        .nb-a.on { color: ${TEXT}; font-weight: 600; }
        .nb-a.on::after { transform: scaleX(1); }

        /* ── RIGHT ACTIONS ── */
        .nb-right {
          display: flex; align-items: center; gap: 8px;
          flex-shrink: 0; margin-left: auto;
        }

        /* ── LANGUAGE ── */
        .nb-lang-btn {
          display: flex; align-items: center; gap: 5px;
          padding: 5px 10px; border-radius: 7px;
          border: 1.5px solid ${BORDER};
          background: transparent;
          font-family: ${SANS}; font-size: 11px; font-weight: 700;
          color: ${MUTED}; cursor: pointer;
          transition: all .18s;
          letter-spacing: 0.06em;
        }
        .nb-lang-btn:hover { border-color: ${ORANGE}; color: ${ORANGE}; background: #fff8f3; }
        .nb-lang-chev { transition: transform .22s; }
        .nb-lang-chev.flip { transform: rotate(180deg); }

        .nb-lang-drop {
          position: absolute; right: 0; top: calc(100% + 10px);
          min-width: 148px;
          background: #fff; border: 1.5px solid ${BORDER}; border-radius: 13px;
          box-shadow: 0 12px 36px rgba(180,80,20,0.13);
          overflow: hidden; z-index: 800;
          animation: nbDropIn .18s cubic-bezier(.16,1,.3,1);
        }
        .nb-lang-opt {
          width: 100%; text-align: left;
          padding: 11px 16px; border: none; background: transparent;
          font-family: ${SANS}; font-size: 13px; font-weight: 500;
          color: #5a4a3a; cursor: pointer;
          transition: background .12s;
          display: flex; align-items: center; gap: 10px;
        }
        .nb-lang-opt:hover { background: #fff8f3; }
        .nb-lang-opt.on { color: ${ORANGE}; font-weight: 700; background: #fff0e6; }
        .nb-lang-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: ${ORANGE}; flex-shrink: 0;
          transition: opacity .15s;
        }

        /* ── AUTH BUTTONS ── */
        .nb-login {
          padding: 7px 16px; border-radius: 8px;
          font-family: ${SANS}; font-size: 13px; font-weight: 600;
          color: ${ORANGE}; background: transparent;
          border: 1.5px solid ${ORANGE};
          text-decoration: none; transition: all .18s; white-space: nowrap;
        }
        .nb-login:hover { background: #fff0e6; }
        .nb-signup {
          padding: 7px 18px; border-radius: 8px;
          font-family: ${SANS}; font-size: 13px; font-weight: 700;
          color: #fff;
          background: linear-gradient(135deg,${ORANGE},#8a2e06);
          border: none; text-decoration: none;
          white-space: nowrap;
          box-shadow: 0 2px 12px rgba(200,85,26,0.28);
          transition: box-shadow .18s, transform .12s;
        }
        .nb-signup:hover { box-shadow: 0 4px 18px rgba(200,85,26,0.38); transform: translateY(-1px); }

        /* ── USER BUTTON ── */
        .nb-user-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 4px 12px 4px 4px;
          border-radius: 99px; border: 1.5px solid ${BORDER};
          background: transparent; cursor: pointer;
          transition: all .18s;
        }
        .nb-user-btn:hover { border-color: ${ORANGE}; background: #fff8f3; }
        .nb-user-nm {
          font-family: ${SANS}; font-size: 12.5px; font-weight: 600; color: ${TEXT};
          max-width: 88px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        /* ── USER DROPDOWN ── */
        .nb-u-drop {
          position: absolute; right: 0; top: calc(100% + 10px);
          width: 224px; background: #fff;
          border: 1.5px solid ${BORDER}; border-radius: 16px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.12);
          overflow: hidden; z-index: 800;
          animation: nbDropIn .18s cubic-bezier(.16,1,.3,1);
        }
        .nb-u-head {
          padding: 14px 16px 12px; border-bottom: 1px solid #f0e8de;
          display: flex; gap: 11px; align-items: center;
        }
        .nb-u-nm  { font-family: ${SANS}; font-size: 13px; font-weight: 700; color: ${TEXT}; }
        .nb-u-em  { font-family: ${SANS}; font-size: 11px; color: ${MUTED};
                    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .nb-d-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 16px;
          font-family: ${SANS}; font-size: 13px; font-weight: 500; color: #3a2a1a;
          text-decoration: none; border: none; background: none; width: 100%;
          text-align: left; cursor: pointer; transition: background .12s;
        }
        .nb-d-item:hover { background: #fff8f3; }
        .nb-d-item.red { color: #dc2626; }
        .nb-d-item.red:hover { background: #fef2f2; }
        .nb-d-div { height: 1px; background: #f0e8de; margin: 4px 0; }

        /* ── HAMBURGER ── */
        .nb-ham {
          display: none;
          width: 38px; height: 38px; border-radius: 8px;
          background: transparent; border: 1.5px solid ${BORDER};
          align-items: center; justify-content: center;
          cursor: pointer; color: ${TEXT}; flex-shrink: 0;
          transition: all .18s; margin-left: auto;
        }
        .nb-ham:hover { border-color: ${ORANGE}; color: ${ORANGE}; background: #fff8f3; }

        /* ── MOBILE OVERLAY ── */
        .nb-ov {
          position: fixed; inset: 0; z-index: 590;
          background: rgba(20,10,4,0.55);
          backdrop-filter: blur(5px);
          animation: nbFadeIn .22s ease-out;
          cursor: pointer;
        }

        /* ── MOBILE DRAWER ── */
        .nb-dw {
          position: fixed; top: 0; right: 0; bottom: 0; z-index: 595;
          width: min(300px, 88vw);
          background: ${BG};
          box-shadow: -8px 0 48px rgba(0,0,0,0.20);
          display: flex; flex-direction: column;
          animation: nbSlideIn .28s cubic-bezier(.16,1,.3,1);
          overflow-y: auto;
        }
        .nb-dw-hd {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 18px 14px;
          border-bottom: 1px solid ${BORDER};
          flex-shrink: 0;
        }
        .nb-dw-close {
          width: 34px; height: 34px; border-radius: 8px;
          background: #fff0e6; border: 1px solid #ffd4a8;
          cursor: pointer; display: flex; align-items: center;
          justify-content: center; color: ${ORANGE};
          flex-shrink: 0; transition: background .15s;
        }
        .nb-dw-close:hover { background: #ffe0c8; }
        .nb-dw-nav { padding: 14px 14px 0; flex: 1; }
        .nb-dw-a {
          display: flex; align-items: center;
          padding: 13px 14px; border-radius: 0;
          border-bottom: 1px solid #f0e8de;
          font-family: ${SANS}; font-size: 14px; font-weight: 500; color: #3a2a1a;
          text-decoration: none; transition: color .15s;
          position: relative;
        }
        .nb-dw-a:last-child { border-bottom: none; }
        .nb-dw-a::before {
          content: '';
          position: absolute; left: 0; top: 50%; transform: translateY(-50%);
          width: 3px; height: 0;
          background: ${ORANGE}; border-radius: 0 2px 2px 0;
          transition: height .2s ease;
        }
        .nb-dw-a.on { color: ${ORANGE}; font-weight: 600; padding-left: 20px; }
        .nb-dw-a.on::before { height: 60%; }
        .nb-dw-a:hover:not(.on) { color: ${ORANGE}; padding-left: 18px; }

        /* staggered drawer link animation */
        .nb-dw-a:nth-child(1) { animation: nbLinkIn .25s .05s both }
        .nb-dw-a:nth-child(2) { animation: nbLinkIn .25s .10s both }
        .nb-dw-a:nth-child(3) { animation: nbLinkIn .25s .14s both }
        .nb-dw-a:nth-child(4) { animation: nbLinkIn .25s .18s both }
        .nb-dw-a:nth-child(5) { animation: nbLinkIn .25s .22s both }
        .nb-dw-a:nth-child(6) { animation: nbLinkIn .25s .26s both }

        .nb-dw-ft {
          padding: 16px 18px 20px;
          border-top: 1px solid ${BORDER};
          flex-shrink: 0;
        }

        /* lang in drawer */
        .nb-dw-lng { display: flex; gap: 7px; margin-bottom: 14px; }
        .nb-dw-lb {
          flex: 1; padding: 9px 6px; border-radius: 9px;
          border: 1.5px solid ${BORDER}; background: transparent;
          font-family: ${SANS}; font-size: 12px; font-weight: 700;
          color: ${MUTED}; cursor: pointer; transition: all .18s;
          letter-spacing: 0.05em;
        }
        .nb-dw-lb.on { border-color: ${ORANGE}; color: ${ORANGE}; background: #fff0e6; }

        /* user section in drawer */
        .nb-dw-user {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 0 14px; border-bottom: 1px solid ${BORDER}; margin-bottom: 8px;
        }
        .nb-dw-unm { font-family: ${SANS}; font-size: 14px; font-weight: 700; color: ${TEXT}; }
        .nb-dw-uem {
          font-family: ${SANS}; font-size: 11px; color: ${MUTED};
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .nb-dw-act {
          display: flex; align-items: center; gap: 9px;
          padding: 10px 12px; border-radius: 9px;
          font-family: ${SANS}; font-size: 13px; font-weight: 500; color: #3a2a1a;
          text-decoration: none; border: none; background: none;
          width: 100%; cursor: pointer; transition: all .15s; margin-bottom: 2px;
        }
        .nb-dw-act:hover { background: #fff0e6; color: ${ORANGE}; }
        .nb-dw-out {
          display: flex; align-items: center; gap: 9px;
          padding: 10px 12px; border-radius: 9px;
          font-family: ${SANS}; font-size: 13px; font-weight: 500;
          color: #dc2626; border: none; background: none; width: 100%; cursor: pointer;
          margin-top: 4px; transition: background .15s;
        }
        .nb-dw-out:hover { background: #fef2f2; }

        /* auth ctas in drawer */
        .nb-dw-li {
          display: block; text-align: center; padding: 11px;
          border-radius: 10px; margin-bottom: 8px;
          font-family: ${SANS}; font-size: 14px; font-weight: 600;
          color: ${ORANGE}; background: transparent;
          border: 1.5px solid ${ORANGE}; text-decoration: none;
          transition: background .15s;
        }
        .nb-dw-li:hover { background: #fff0e6; }
        .nb-dw-si {
          display: block; text-align: center; padding: 11px;
          border-radius: 10px;
          font-family: ${SANS}; font-size: 14px; font-weight: 700;
          color: #fff; background: linear-gradient(135deg,${ORANGE},#8a2e06);
          text-decoration: none; transition: opacity .15s;
          box-shadow: 0 2px 12px rgba(200,85,26,0.28);
        }
        .nb-dw-si:hover { opacity: .88; }

        /* ── RESPONSIVE ── */
        @media (max-width: 960px) {
          .nb-nav, .nb-right { display: none !important; }
          .nb-ham { display: flex !important; }
          .nb-in { padding: 0 16px; }
        }

        /* divider between logo and nav on desktop */
        .nb-sep {
          width: 1px; height: 24px; background: ${BORDER};
          margin-right: 24px; flex-shrink: 0;
        }
      `}</style>

      {/* ─── NAVBAR BAR ─── */}
      <header className={`nb${scrolled ? " up" : ""}`}>
        <div className="nb-in">

          {/* Logo — your Devanagari brand image */}
          <Link href="/" className="nb-logo" aria-label="Guruji Shrawan Home">
            <Image
              src="/images/logo.jpg"
              alt="Guruji Shrawan"
              width={96}
              height={36}
              style={{ height: 36, width: "auto", objectFit: "contain" }}
              priority
            />
          </Link>

          {/* subtle separator */}
          <div className="nb-sep"/>

          {/* Desktop nav */}
          <nav className="nb-nav" aria-label="Main navigation">
            {NAV.map(({ label, href }) => (
              <Link key={href} href={href} className={`nb-a${active(href) ? " on" : ""}`}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop right */}
          <div className="nb-right">

            {/* Language switcher */}
            <div style={{ position:"relative" }} ref={langRef}>
              <button
                className="nb-lang-btn"
                onClick={() => setLangOpen(o => !o)}
                aria-expanded={langOpen}
                aria-haspopup="listbox"
              >
                <span>{language === "hi" ? "हिंदी" : "EN"}</span>
                <ChevronDown size={10} className={`nb-lang-chev${langOpen ? " flip" : ""}`}/>
              </button>
              {langOpen && (
                <div className="nb-lang-drop" role="listbox">
                  {[
                    { l:"en", flag:"🇬🇧", label:"English" },
                    { l:"hi", flag:"🇮🇳", label:"हिंदी"   },
                  ].map(({ l, flag, label }) => (
                    <button
                      key={l}
                      className={`nb-lang-opt${language === l ? " on" : ""}`}
                      onClick={() => switchLang(l)}
                      role="option"
                      aria-selected={language === l}
                    >
                      {language === l && <span className="nb-lang-dot"/>}
                      <span>{flag}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth */}
            {!user ? (
              <>
                <Link href="/signin" className="nb-login">Sign In</Link>
                <Link href="/signup" className="nb-signup">Sign Up</Link>
              </>
            ) : (
              <div style={{ position:"relative" }} ref={userRef}>
                <button className="nb-user-btn" onClick={() => setUserOpen(o => !o)} aria-expanded={userOpen}>
                  <Avatar user={user} size={28}/>
                  <span className="nb-user-nm">{displayName}</span>
                  <ChevronDown size={10} style={{ color:MUTED, transition:"transform .22s", transform: userOpen?"rotate(180deg)":"none", flexShrink:0 }}/>
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

          {/* Hamburger — only visible on mobile */}
          <button className="nb-ham" onClick={openDrawer} aria-label="Open menu" type="button">
            <Menu size={18}/>
          </button>

        </div>
      </header>

      {/* ─── MOBILE DRAWER ─── */}
      {drawer && (
        <>
          {/* overlay — clicking it closes the drawer */}
          <div className="nb-ov" onClick={closeDrawer} aria-hidden="true"/>

          {/* panel */}
          <div className="nb-dw" role="dialog" aria-modal="true" aria-label="Navigation menu" ref={drawerRef}>

            {/* header */}
            <div className="nb-dw-hd">
              <Link href="/" className="nb-logo" onClick={closeDrawer} aria-label="Home">
                <Image
                  src="/Untitled_design__2_.jpg"
                  alt="Guruji Shrawan"
                  width={72}
                  height={28}
                  style={{ height:28, width:"auto", objectFit:"contain",
                    filter:"invert(1) brightness(0.15)" }}
                  priority
                />
              </Link>
              {/* ← THIS is the close button — explicit type=button, onClick=closeDrawer */}
              <button
                type="button"
                className="nb-dw-close"
                onClick={closeDrawer}
                aria-label="Close menu"
              >
                <X size={17}/>
              </button>
            </div>

            {/* nav links */}
            <div className="nb-dw-nav">
              {NAV.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className={`nb-dw-a${active(href) ? " on" : ""}`}
                  onClick={closeDrawer}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* footer */}
            <div className="nb-dw-ft">

              {/* language */}
              <div className="nb-dw-lng">
                {[["en","EN · English"],["hi","HI · हिंदी"]].map(([l, lbl]) => (
                  <button
                    key={l}
                    type="button"
                    className={`nb-dw-lb${language === l ? " on" : ""}`}
                    onClick={() => { setLanguage(l) }}
                  >
                    {lbl}
                  </button>
                ))}
              </div>

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