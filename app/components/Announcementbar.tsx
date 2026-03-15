"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { FaTimes, FaChevronRight } from "react-icons/fa"

/* ══════════════════════════════════════════════════════════════
   AnnouncementBar
   
   CHANGES vs previous version:
   ✅ Responsive — on small screens the text truncates gracefully,
      CTA pill stays visible, dots hidden on very small screens
   ✅ Re-appears every visit — uses localStorage with a 24-hour
      expiry instead of sessionStorage (which cleared on every tab)
   ✅ Per-message dismissal — user can dismiss one message;
      it won't show again for 24h, but other messages still rotate
   ✅ Smooth height collapse animation on dismiss
   ✅ Auto-rotation pauses on hover (better UX)
   ✅ Accessible: role="region", aria-live, keyboard nav
══════════════════════════════════════════════════════════════ */

const MESSAGES = [
  {
    id:        "book-2024",
    icon:      "📖",
    text:      "New Book:",
    highlight: "Baccho Ki Parvarish",
    cta:       "Explore",
    href:      "/books/baccho-ki-parvarish",
    color:     "#c8551a",
    dark:      "#8a2e06",
  },
  {
    id:        "donate-gita",
    icon:      "🙏",
    text:      "Help spread the pure wisdom of the Gita to every home.",
    highlight: "Donate Now",
    cta:       "Donate",
    href:      "/donate",
    color:     "#b8841a",
    dark:      "#7a5010",
  },
  {
    id:        "articles-new",
    icon:      "✨",
    text:      "New teachings on Vedanta, relationships & conscious living.",
    highlight: "Read Articles",
    cta:       "Browse",
    href:      "/articles",
    color:     "#c8551a",
    dark:      "#8a2e06",
  },
  {
    id:        "youtube-satsang",
    icon:      "▶",
    text:      "Latest satsang & Q&A sessions now live on",
    highlight: "YouTube Channel",
    cta:       "Watch",
    href:      "https://youtube.com/@gurujishrawan",
    color:     "#b8841a",
    dark:      "#7a5010",
    external:  true,
  },
]

/* How long (ms) before a dismissed bar reappears — 24 hours */
const DISMISS_TTL = 24 * 60 * 60 * 1000

function isDismissed(id: string): boolean {
  try {
    const raw = localStorage.getItem(`gs_ann_${id}`)
    if (!raw) return false
    const { until } = JSON.parse(raw)
    return Date.now() < until
  } catch { return false }
}

function setDismissed(id: string) {
  try {
    localStorage.setItem(`gs_ann_${id}`, JSON.stringify({ until: Date.now() + DISMISS_TTL }))
  } catch {}
}

export default function AnnouncementBar() {
  const [mounted,  setMounted]  = useState(false)
  const [visible,  setVisible]  = useState(false)
  const [closing,  setClosing]  = useState(false)   // height-collapse animation
  const [msgIdx,   setMsgIdx]   = useState(0)
  const [fading,   setFading]   = useState(false)
  const [paused,   setPaused]   = useState(false)   // pause rotation on hover

  /* ── On mount: find first non-dismissed message ── */
  useEffect(() => {
    setMounted(true)
    const firstVisible = MESSAGES.findIndex(m => !isDismissed(m.id))
    if (firstVisible !== -1) {
      setMsgIdx(firstVisible)
      setVisible(true)
    }
  }, [])

  /* ── Auto-rotate every 5 s (pauses on hover) ── */
  useEffect(() => {
    if (!visible || paused) return
    const t = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setMsgIdx(prev => {
          // find next non-dismissed message
          let next = (prev + 1) % MESSAGES.length
          let tries = 0
          while (isDismissed(MESSAGES[next].id) && tries < MESSAGES.length) {
            next = (next + 1) % MESSAGES.length
            tries++
          }
          return next
        })
        setFading(false)
      }, 280)
    }, 5000)
    return () => clearInterval(t)
  }, [visible, paused])

  /* ── Dismiss current message; hide bar if all dismissed ── */
  const dismiss = useCallback(() => {
    const current = MESSAGES[msgIdx]
    setDismissed(current.id)

    const nextVisible = MESSAGES.findIndex((m, i) => i !== msgIdx && !isDismissed(m.id))
    if (nextVisible === -1) {
      // all dismissed — collapse the bar
      setClosing(true)
      setTimeout(() => { setVisible(false); setClosing(false) }, 320)
    } else {
      // jump to next visible message with a fade
      setFading(true)
      setTimeout(() => { setMsgIdx(nextVisible); setFading(false) }, 280)
    }
  }, [msgIdx])

  /* ── Jump to specific message ── */
  const jumpTo = useCallback((i: number) => {
    if (i === msgIdx) return
    setFading(true)
    setTimeout(() => { setMsgIdx(i); setFading(false) }, 280)
  }, [msgIdx])

  /* SSR guard — don't render until client has checked localStorage */
  if (!mounted || !visible) return null

  const msg = MESSAGES[msgIdx]
  const bg  = `linear-gradient(135deg, ${msg.color}, ${msg.dark})`

  return (
    <>
      <style>{`
        @keyframes ann-slide-down {
          from { max-height: 0; opacity: 0; }
          to   { max-height: 80px; opacity: 1; }
        }
        @keyframes ann-slide-up {
          from { max-height: 80px; opacity: 1; }
          to   { max-height: 0; opacity: 0; }
        }
        .ann-bar {
          animation: ann-slide-down .3s ease forwards;
          overflow: hidden;
        }
        .ann-bar.ann-closing {
          animation: ann-slide-up .32s ease forwards;
        }
        .ann-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 9px 44px 9px 12px; /* right pad for close btn */
          min-height: 40px;
          position: relative;
          transition: opacity .28s ease;
        }
        /* icon — hide on very small screens */
        .ann-icon {
          font-size: 13px;
          line-height: 1;
          flex-shrink: 0;
        }
        /* text block */
        .ann-text {
          font-family: 'Poppins', system-ui, sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,.9);
          line-height: 1.4;
          margin: 0;
          text-align: center;
          /* allow truncation on tiny screens */
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          min-width: 0;
          flex: 1;
        }
        .ann-text strong {
          color: #fff;
          font-weight: 700;
        }
        /* CTA pill */
        .ann-cta {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: 'Poppins', system-ui, sans-serif;
          font-size: 11px;
          font-weight: 800;
          color: #fff;
          text-decoration: none;
          background: rgba(255,255,255,.18);
          border: 1px solid rgba(255,255,255,.3);
          border-radius: 99px;
          padding: 4px 11px;
          flex-shrink: 0;
          transition: background .18s ease;
          white-space: nowrap;
        }
        .ann-cta:hover { background: rgba(255,255,255,.28); }
        .ann-cta:focus-visible {
          outline: 2px solid rgba(255,255,255,.7);
          outline-offset: 2px;
        }
        /* dots */
        .ann-dots {
          display: flex;
          gap: 4px;
          flex-shrink: 0;
        }
        .ann-dot {
          height: 5px;
          border-radius: 99px;
          background: rgba(255,255,255,.35);
          border: none;
          cursor: pointer;
          padding: 0;
          transition: width .3s ease, background .3s ease;
        }
        .ann-dot:focus-visible {
          outline: 2px solid rgba(255,255,255,.7);
          outline-offset: 2px;
        }
        /* close button */
        .ann-close {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,.12);
          border: 1px solid rgba(255,255,255,.2);
          border-radius: 50%;
          width: 26px;
          height: 26px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,.8);
          flex-shrink: 0;
          transition: background .18s ease;
        }
        .ann-close:hover { background: rgba(255,255,255,.24); }
        .ann-close:focus-visible {
          outline: 2px solid rgba(255,255,255,.7);
          outline-offset: 2px;
        }

        /* ── Responsive breakpoints ── */

        /* Hide dots on very small phones */
        @media (max-width: 400px) {
          .ann-dots  { display: none; }
          .ann-icon  { display: none; }
          .ann-text  { font-size: 11px; }
        }

        /* On narrow screens: allow text to wrap (2 lines) instead of truncating */
        @media (max-width: 540px) {
          .ann-text {
            white-space: normal;
            text-overflow: unset;
            text-align: left;
            font-size: 11.5px;
          }
          .ann-inner {
            flex-wrap: wrap;
            padding: 8px 40px 8px 10px;
            gap: 6px;
            justify-content: flex-start;
          }
          .ann-dots { order: 10; } /* push dots to end */
        }

        /* Tablet and up: full layout */
        @media (min-width: 541px) {
          .ann-inner {
            padding: 9px 48px 9px 16px;
            gap: 10px;
          }
          .ann-text {
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 12px;
          }
        }
      `}</style>

      <div
        className={`ann-bar ${closing ? "ann-closing" : ""}`}
        style={{ background: bg, zIndex: 200 }}
        role="region"
        aria-label="Site announcement"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="ann-inner"
          style={{ opacity: fading ? 0 : 1 }}
          aria-live="polite"
          aria-atomic="true"
        >
          {/* Icon */}
          <span className="ann-icon" aria-hidden="true">{msg.icon}</span>

          {/* Message text */}
          <p className="ann-text">
            {msg.text}{" "}
            <strong>{msg.highlight}</strong>
          </p>

          {/* CTA */}
          <Link
            href={msg.href}
            target={msg.external ? "_blank" : undefined}
            rel={msg.external ? "noopener noreferrer" : undefined}
            className="ann-cta"
            aria-label={`${msg.cta} — ${msg.highlight}`}
          >
            {msg.cta} <FaChevronRight size={8} aria-hidden="true" />
          </Link>

          {/* Progress dots */}
          <div className="ann-dots" role="tablist" aria-label="Announcements">
            {MESSAGES.map((m, i) => (
              <button
                key={m.id}
                className="ann-dot"
                role="tab"
                aria-selected={i === msgIdx}
                aria-label={`Announcement ${i + 1}: ${m.highlight}`}
                onClick={() => jumpTo(i)}
                style={{
                  width:      i === msgIdx ? 16 : 5,
                  background: i === msgIdx ? "rgba(255,255,255,.9)" : "rgba(255,255,255,.35)",
                  opacity:    isDismissed(m.id) ? 0.3 : 1,
                }}
              />
            ))}
          </div>

          {/* Close / dismiss */}
          <button
            className="ann-close"
            onClick={dismiss}
            aria-label={`Dismiss: ${msg.highlight}. Will reappear after 24 hours.`}
          >
            <FaTimes size={9} aria-hidden="true" />
          </button>
        </div>
      </div>
    </>
  )
}