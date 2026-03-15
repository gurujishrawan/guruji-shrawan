"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FaTimes, FaChevronRight, FaHeart } from "react-icons/fa"

/* ══════════════════════════════════════════════
   AnnouncementBar
   — Appears above the Navbar on every page.
   — Cycles through multiple announcements.
   — Dismissible (stores in sessionStorage).
   — Fully accessible: role="banner", aria-label,
     keyboard-dismissible.
   — Add to layout.tsx above <ClientLayout>.
══════════════════════════════════════════════ */

const MESSAGES = [
  {
    id: "book-launch",
    icon: "📖",
    text: "New Book Out Now:",
    highlight: "Baccho Ki Parvarish",
    cta: "Explore →",
    href: "/books/baccho-ki-parvarish",
    color: "#c8551a",
  },
  {
    id: "donate",
    icon: "🙏",
    text: "Contribute and help spread the pure wisdom of the Gita to every home.",
    highlight: "Donate Now",
    cta: "Click Here",
    href: "/donate",
    color: "#b8841a",
  },
  {
    id: "articles",
    icon: "✨",
    text: "Explore new teachings on Vedanta, relationships and conscious living.",
    highlight: "Read Articles",
    cta: "Browse →",
    href: "/articles",
    color: "#c8551a",
  },
  {
    id: "youtube",
    icon: "▶",
    text: "Watch the latest satsang and Q&A sessions on",
    highlight: "YouTube Channel",
    cta: "Watch →",
    href: "https://youtube.com/@gurujishrawan",
    color: "#b8841a",
    external: true,
  },
]

export default function AnnouncementBar() {
  const [visible,  setVisible]  = useState(false)
  const [msgIdx,   setMsgIdx]   = useState(0)
  const [fading,   setFading]   = useState(false)

  /* Check if dismissed this session */
  useEffect(() => {
    const dismissed = sessionStorage.getItem("gs_ann_dismissed")
    if (!dismissed) setVisible(true)

    /* Rotate messages every 5 s */
    const t = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setMsgIdx(i => (i + 1) % MESSAGES.length)
        setFading(false)
      }, 300)
    }, 5000)
    return () => clearInterval(t)
  }, [])

  function dismiss() {
    setVisible(false)
    sessionStorage.setItem("gs_ann_dismissed", "1")
  }

  if (!visible) return null

  const msg = MESSAGES[msgIdx]

  return (
    <div
      role="banner"
      aria-label="Site announcement"
      style={{
        background: `linear-gradient(135deg, ${msg.color}, ${msg.color === "#c8551a" ? "#8a2e06" : "#7a5010"})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: "9px 16px",
        position: "relative",
        transition: "opacity .3s ease",
        opacity: fading ? 0 : 1,
        minHeight: 40,
        zIndex: 200,
      }}
    >
      {/* Icon */}
      <span
        aria-hidden="true"
        style={{ fontSize: 13, lineHeight: 1, flexShrink: 0 }}
      >
        {msg.icon}
      </span>

      {/* Message */}
      <p
        style={{
          fontFamily: "'Poppins', system-ui, sans-serif",
          fontSize: 12,
          fontWeight: 500,
          color: "rgba(255,255,255,.88)",
          lineHeight: 1.4,
          margin: 0,
          textAlign: "center",
        }}
      >
        {msg.text}{" "}
        <strong style={{ color: "#fff", fontWeight: 700 }}>{msg.highlight}</strong>
      </p>

      {/* CTA */}
      <Link
        href={msg.href}
        target={msg.external ? "_blank" : undefined}
        rel={msg.external ? "noopener noreferrer" : undefined}
        aria-label={`${msg.cta} — ${msg.highlight}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          fontFamily: "'Poppins', system-ui, sans-serif",
          fontSize: 11,
          fontWeight: 800,
          color: "#fff",
          textDecoration: "none",
          background: "rgba(255,255,255,.18)",
          border: "1px solid rgba(255,255,255,.3)",
          borderRadius: 99,
          padding: "4px 12px",
          flexShrink: 0,
          transition: "background .2s ease",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,.28)")}
        onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,.18)")}
      >
        {msg.cta} <FaChevronRight size={8} />
      </Link>

      {/* Progress dots */}
      <div
        style={{ display: "flex", gap: 4, flexShrink: 0 }}
        aria-hidden="true"
      >
        {MESSAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setFading(true); setTimeout(() => { setMsgIdx(i); setFading(false) }, 280) }}
            style={{
              width: i === msgIdx ? 16 : 5,
              height: 5,
              borderRadius: 99,
              background: i === msgIdx ? "rgba(255,255,255,.9)" : "rgba(255,255,255,.35)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "width .3s ease, background .3s ease",
            }}
            aria-label={`Go to announcement ${i + 1}`}
          />
        ))}
      </div>

      {/* Close */}
      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        style={{
          position: "absolute",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(255,255,255,.12)",
          border: "1px solid rgba(255,255,255,.2)",
          borderRadius: "50%",
          width: 26,
          height: 26,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255,255,255,.8)",
          flexShrink: 0,
          transition: "background .2s ease",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,.22)")}
        onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,.12)")}
      >
        <FaTimes size={9} />
      </button>
    </div>
  )
}