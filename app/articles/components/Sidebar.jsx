"use client"

import Link from "next/link"
import { useState } from "react"
import { Bell, ChevronRight, Users, BookOpen } from "lucide-react"

const TOPICS = [
  "Mind", "Clarity", "Love", "Truth",
  "Ego", "Liberation", "Suffering", "Relationships",
  "Fear", "Awareness", "Values", "Passion",
  "Dharma", "Consciousness", "Freedom", "Vedanta",
]

const POPULAR = [
  { title: "Who Controls Your Mood?", slug: "who-controls-your-mood", category: "Mind" },
  { title: "What Is Dharma?", slug: "what-is-dharma-according-to-the-bhagavad-gita", category: "Dharma" },
  { title: "Free Mind Is an Intelligent Mind", slug: "free-mind-is-an-intelligent-mind", category: "Mind" },
  { title: "Love Lies Beyond Patterns", slug: "love-lies-beyond-patterns", category: "Relationships" },
  { title: "If Vivekananda Comes Alive Today", slug: "if-vivekananda-comes-alive-today", category: "Society" },
]

const LABEL_STYLE = {
  fontFamily: "'Poppins',system-ui,sans-serif",
  fontSize: 10, fontWeight: 700,
  textTransform: "uppercase", letterSpacing: "0.16em",
  color: "#c8941a", marginBottom: 12, display: "flex", alignItems: "center", gap: 8,
}
const ACCENT_LINE = { width: 16, height: 2, borderRadius: 2, background: "#d4621a", display: "inline-block", flexShrink: 0 }

export default function Sidebar({ s }) {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [langPref, setLangPref] = useState({ en: true, hi: true })

  function handleSubscribe() {
    if (email.includes("@")) {
      setSubscribed(true)
      setEmail("")
    }
  }

  return (
    <aside className="sticky top-20 h-fit space-y-8">

      {/* ── POPULAR ARTICLES ── */}
      <div>
        <p style={LABEL_STYLE}>
          <span style={ACCENT_LINE} />Popular Articles
        </p>
        <ul className="space-y-0">
          {POPULAR.map((a, i) => (
            <li key={a.slug}>
              <Link
                href={`/articles/${a.slug}`}
                className={`${s.fontBody} group flex items-start gap-3 py-3 transition`}
                style={{ borderBottom: i < POPULAR.length - 1 ? "1px solid #f0e8de" : "none" }}
              >
                <span
                  className={`${s.fontBody} shrink-0 text-[18px] font-900 leading-none`}
                  style={{ color: "#f0e0d0", fontWeight: 900, fontSize: 20, minWidth: 28, lineHeight: 1.1 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <span
                    className="block text-[11px] font-semibold uppercase tracking-wider mb-0.5"
                    style={{ color: "#d4621a", fontFamily: "'Poppins',system-ui,sans-serif" }}
                  >
                    {a.category}
                  </span>
                  <span
                    className="text-[13px] font-medium leading-snug line-clamp-2 group-hover:text-[#d4621a] transition"
                    style={{ color: "#3a2a1a", fontFamily: "'Poppins',system-ui,sans-serif" }}
                  >
                    {a.title}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* ── TOPICS ── */}
      <div>
        <p style={LABEL_STYLE}>
          <span style={ACCENT_LINE} />Explore Topics
        </p>
        <div className="flex flex-wrap gap-1.5">
          {TOPICS.map((topic) => (
            <Link
              key={topic}
              href={`/articles?topic=${encodeURIComponent(topic.toLowerCase())}`}
              className={s.tagPill}
            >
              {topic}
            </Link>
          ))}
        </div>
        <Link
          href="/articles/topics"
          className={`${s.fontBody} inline-block mt-3 text-[12px] font-semibold transition flex items-center gap-1`}
          style={{ color: "#d4621a" }}
        >
          <BookOpen size={13} /> All Topics
        </Link>
      </div>

      {/* ── NEWSLETTER ── */}
      <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg,#fff8f3 0%,#fdf3d8 100%)", border: "1.5px solid #f0d8b8" }}>
        <div className="flex items-center gap-2 mb-1">
          <Bell size={14} style={{ color: "#d4621a" }} />
          <p className={`${s.fontBody} text-[10px] uppercase tracking-[0.14em] font-bold`} style={{ color: "#c8941a" }}>
            Get Updates
          </p>
        </div>
        <h3 className={`${s.fontDisplay} text-[16px] font-bold leading-snug mb-1`} style={{ color: "#1a1008" }}>
          Wisdom in Your Inbox
        </h3>
        <p className={`${s.fontBody} text-[12px] leading-relaxed mb-4`} style={{ color: "#7a6a5a" }}>
          Thoughtful insights from Guruji Shrawan every week.
        </p>

        {subscribed ? (
          <div
            className="text-center py-3 rounded-xl"
            style={{ background: "#d4621a", color: "#fff", fontFamily: "'Poppins',system-ui,sans-serif", fontSize: 13, fontWeight: 600 }}
          >
            ✓ You're subscribed!
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-3">
              {[["en", "EN"], ["hi", "HI"]].map(([key, label]) => (
                <label key={key} className={`${s.fontBody} flex items-center gap-1.5 text-[12px] cursor-pointer`} style={{ color: "#5a4a3a" }}>
                  <input
                    type="checkbox"
                    checked={langPref[key]}
                    onChange={() => setLangPref(p => ({ ...p, [key]: !p[key] }))}
                    style={{ accentColor: "#d4621a" }}
                  />
                  {label}
                </label>
              ))}
            </div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
              placeholder="Your email address"
              type="email"
              className={`${s.sideInput} mb-2`}
            />
            <button onClick={handleSubscribe} className={s.btnGold}>
              Subscribe Free
            </button>
          </>
        )}
      </div>

      {/* ── LIVE SESSIONS ── */}
      <div
        className="rounded-2xl p-5 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#d4621a 0%,#a04010 100%)" }}
      >
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full pointer-events-none" style={{ background: "rgba(200,148,26,0.25)" }} />

        <div className="flex items-center gap-2 mb-1 relative z-10">
          <span className={s.pulseDot} />
          <p className={`${s.fontBody} text-[11px] font-bold tracking-[0.12em] uppercase`} style={{ color: "#ffd580" }}>
            LIVE Sessions
          </p>
        </div>
        <h3 className={`${s.fontDisplay} text-[15px] font-bold leading-snug mb-2 relative z-10`}>
          Experience Transformation Everyday
        </h3>
        <p className={`${s.fontBody} text-[12px] text-white/80 mb-4 leading-relaxed relative z-10`}>
          Bhagavad Gita · Upanishads · Ashtavakra Gita and more.
        </p>
        <div className="relative z-10 flex items-center gap-2 mb-1">
          <Users size={13} style={{ color: "#ffd580" }} />
          <span className={`${s.fontBody} text-[12px] font-semibold`} style={{ color: "#ffd580" }}>
            2,400+ active listeners
          </span>
        </div>
        <Link
          href="/live"
          className={`${s.fontBody} mt-3 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-[13px] font-bold transition hover:opacity-90 relative z-10`}
          style={{ background: "#ffd580", color: "#7a3008" }}
        >
          JOIN NOW <ChevronRight size={14} />
        </Link>
      </div>

    </aside>
  )
}