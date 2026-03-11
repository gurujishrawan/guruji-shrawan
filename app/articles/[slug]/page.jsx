"use client"

import { getArticles } from "../data"
import { notFound } from "next/navigation"
import { supabase } from "../../lib/supabaseClient"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef, use } from "react"
import {
  Heart, MessageCircle, Bookmark, ChevronRight, ChevronLeft,
  Clock, BarChart2, ArrowLeft, X, Eye, EyeOff, Flame, Quote,
} from "lucide-react"
import ShareButton from "../Sharebutton"


/* ─── DESIGN TOKENS ─────────────────────────────────────── */
const P      = "'Poppins', system-ui, sans-serif"
const ORANGE = "#d4621a"
const GOLD   = "#c8941a"
const BG     = "#f5f0ea"
const CARD   = "#ffffff"
const BORDER = "#e8ddd0"
const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 9,
  border: `1.5px solid ${BORDER}`,
  background: "#faf8f5",
  fontFamily: P,
  fontSize: 13,
  color: "#1a1008",
  outline: "none",
  boxSizing: "border-box"
}

const RELATED_TOPICS = [
  "Truth","Liberation","Mind","Relationship",
  "Fear","Religion","Desire","Bhakti","Buddha","Vedanta",
]

/* ─── READING PROGRESS ──────────────────────────────────── */

function ReadingProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const fn = () => {
      const h = document.body.scrollHeight - window.innerHeight
      setPct(h > 0 ? Math.min((window.scrollY / h) * 100, 100) : 0)
    }
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, zIndex: 400,
      height: 3, width: `${pct}%`,
      background: `linear-gradient(90deg,${ORANGE},${GOLD})`,
      borderRadius: "0 2px 2px 0", transition: "width .1s linear",
      pointerEvents: "none",
    }} />
  )
}

/* ─── LOGIN MODAL ───────────────────────────────────────── */


/* ─── ANIMATED EMAIL ILLUSTRATION ──────────────────────── */
function AnimatedEnvelope() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
      <style>{`
        @keyframes envFloat {
          0%,100% { transform: translateY(0px) rotate(-2deg); }
          50%      { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes envPulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.6; transform: scale(0.92); }
        }
        @keyframes lineSlide {
          0%   { width: 0; opacity: 0; }
          60%  { opacity: 1; }
          100% { width: 40px; opacity: 1; }
        }
        @keyframes dotBlink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        .env-wrap { animation: envFloat 3.2s ease-in-out infinite; }
      `}</style>
      <div className="env-wrap">
        <svg width="90" height="72" viewBox="0 0 90 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Envelope body */}
          <rect x="4" y="16" width="82" height="52" rx="7" fill="#fff" stroke="#e8ddd0" strokeWidth="1.5"/>
          {/* Envelope flap */}
          <path d="M4 22 L45 46 L86 22" stroke={BORDER} strokeWidth="1.5" fill="none"/>
          {/* Diagonal lines */}
          <line x1="4" y1="68" x2="38" y2="42" stroke={BORDER} strokeWidth="1.5"/>
          <line x1="86" y1="68" x2="52" y2="42" stroke={BORDER} strokeWidth="1.5"/>
          {/* Seal dot */}
          <circle cx="45" cy="46" r="6" fill={ORANGE} style={{ animation: "envPulse 2s ease-in-out infinite" }}/>
          {/* @ symbol */}
          <text x="45" y="50" textAnchor="middle" fontFamily="sans-serif" fontSize="7" fill="#fff" fontWeight="bold">@</text>
          {/* Flying lines (motion) */}
          <line x1="0" y1="8" x2="20" y2="8" stroke={ORANGE} strokeWidth="2" strokeLinecap="round"
            style={{ animation: "lineSlide 1.8s ease-out infinite" }}/>
          <line x1="0" y1="2" x2="14" y2="2" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"
            style={{ animation: "lineSlide 1.8s .3s ease-out infinite" }}/>
          <line x1="0" y1="14" x2="10" y2="14" stroke="#e8c97a" strokeWidth="1.5" strokeLinecap="round"
            style={{ animation: "lineSlide 1.8s .15s ease-out infinite" }}/>
          {/* Dots */}
          <circle cx="76" cy="7" r="2.5" fill={ORANGE} style={{ animation: "dotBlink 1.5s .2s infinite" }}/>
          <circle cx="84" cy="12" r="1.8" fill={GOLD} style={{ animation: "dotBlink 1.5s .5s infinite" }}/>
          <circle cx="70" cy="13" r="1.5" fill="#e8c97a" style={{ animation: "dotBlink 1.5s .8s infinite" }}/>
        </svg>
      </div>
    </div>
  )
}

/* ─── INLINE NEWSLETTER ─────────────────────────────────── */
function NewsletterInline() {
  const [email, setEmail]   = useState("")
  const [lang, setLang]     = useState({ en: true, hi: true })
  const [subscribed, setSub] = useState(false)

  return (
    <div style={{ margin: "36px 0", borderRadius: 20, overflow: "hidden", border: `1.5px solid ${BORDER}` }}>
      <div style={{ display: "grid", gridTemplateColumns: "160px 1fr" }}>
        {/* Animated left side */}
        <div style={{ background: `linear-gradient(145deg,#fff4ea,#fdf0d0)`, padding: "20px 10px" }}>
          <AnimatedEnvelope />
        </div>
        {/* Form right */}
        <div style={{ background: CARD, padding: "26px 26px" }}>
          <h3 style={{ fontFamily: P, fontSize: 18, fontWeight: 800, color: "#1a1008", marginBottom: 5 }}>
            Get Updates
          </h3>
          <p style={{ fontFamily: P, fontSize: 13, color: "#7a6a5a", lineHeight: 1.65, marginBottom: 14 }}>
            Receive handpicked articles, quotes and insights from Guruji Shrawan regularly.
          </p>
          {subscribed ? (
            <div style={{
              background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 12,
              padding: "13px 16px", fontFamily: P, fontSize: 14, color: "#16a34a", fontWeight: 600,
            }}>
              ✓ Subscribed! Wisdom is on its way to your inbox.
            </div>
          ) : (
            <>
              <input value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && email.includes("@") && setSub(true)}
                placeholder="Your email address" type="email"
                style={{ ...inputStyle, marginBottom: 10 }} />
              <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
                {[["en", "English"], ["hi", "Hindi"]].map(([k, l]) => (
                  <label key={k} style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: P, fontSize: 13, color: "#5a4a3a", cursor: "pointer" }}>
                    <input type="checkbox" checked={lang[k]}
                      onChange={() => setLang(p => ({ ...p, [k]: !p[k] }))}
                      style={{ accentColor: ORANGE, width: 15, height: 15 }} />
                    {l}
                  </label>
                ))}
              </div>
              <button onClick={() => email.includes("@") && setSub(true)} style={{
                width: "100%", padding: "12px", borderRadius: 11,
                background: `linear-gradient(135deg,${ORANGE},#b04010)`,
                color: "#fff", fontFamily: P, fontSize: 14, fontWeight: 700,
                border: "none", cursor: "pointer",
                boxShadow: "0 2px 12px rgba(212,98,26,0.28)",
              }}>
                Subscribe
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── COMMENTS SECTION ──────────────────────────────────── */
function CommentsSection({ articleSlug, isLoggedIn, onLoginRequired, commentCount, user }) {
  const [comments, setComments] = useState([])
  const [text, setText]         = useState("")
  const [loading, setLoading]   = useState(true)
  const [posting, setPosting]   = useState(false)

  // Fetch real comments from API
 useEffect(() => {

  async function loadComments() {

    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("article_slug", articleSlug)
      .order("created_at", { ascending: false })

    setComments(data || [])
    setLoading(false)

  }

  loadComments()

}, [articleSlug])


 async function handleSubmit() {

  if (!text.trim()) return

  if (!isLoggedIn) {
    onLoginRequired("comment")
    return
  }

  setPosting(true)

  const { data } = await supabase
    .from("comments")
    .insert({
      article_slug: articleSlug,
      text: text.trim(),
      user_id: user.id,
      userName: user.email
    })
    .select()

  if (data) {
    setComments(prev => [data[0], ...prev])
    setText("")
  }

  setPosting(false)
}

  return (
    <div id="comments" style={{ marginTop: 52, paddingTop: 36, borderTop: `2px solid ${BORDER}` }}>
      <h2 style={{ fontFamily: P, fontSize: 20, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#1a1008", marginBottom: 28 }}>
        Comments{comments.length > 0 && (
          <span style={{ fontFamily: P, fontSize: 14, fontWeight: 400, color: "#b0a090", textTransform: "none", letterSpacing: 0, marginLeft: 8 }}>
            ({comments.length})
          </span>
        )}
      </h2>

      {/* Write box */}
      <div style={{ background: CARD, borderRadius: 16, padding: "22px", border: `1.5px solid ${BORDER}`, marginBottom: 32 }}>
        <p style={{ fontFamily: P, fontSize: 14, fontWeight: 600, color: "#1a1008", marginBottom: 12 }}>
          Add Your Comment
        </p>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onFocus={() => { if (!isLoggedIn) onLoginRequired("comment") }}
          placeholder={isLoggedIn ? "Share your thoughts…" : "Sign in to join the discussion…"}
          rows={4}
          readOnly={!isLoggedIn}
          style={{
            width: "100%", padding: "13px 15px", borderRadius: 12,
            border: `1.5px solid ${BORDER}`, background: "#faf8f5",
            fontFamily: P, fontSize: 14, color: "#1a1008",
            outline: "none", resize: "none", boxSizing: "border-box", lineHeight: 1.7,
            cursor: isLoggedIn ? "text" : "pointer",
          }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          <button
            onClick={isLoggedIn ? handleSubmit : () => onLoginRequired("comment")}
            disabled={isLoggedIn && (!text.trim() || posting)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "10px 22px", borderRadius: 11,
              background: isLoggedIn && text.trim() && !posting
                ? `linear-gradient(135deg,${ORANGE},#b04010)`
                : "#e8dfd4",
              color: isLoggedIn && text.trim() && !posting ? "#fff" : "#b0a090",
              fontFamily: P, fontSize: 14, fontWeight: 700,
              border: "none", cursor: "pointer",
              boxShadow: isLoggedIn && text.trim() ? "0 2px 10px rgba(212,98,26,0.26)" : "none",
              transition: "all .15s",
            }}>
            {posting ? "Posting…" : "Post"} <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Comments list */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "32px 0", fontFamily: P, fontSize: 14, color: "#b0a090" }}>
          Loading comments…
        </div>
      ) : comments.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "40px 24px",
          background: CARD, borderRadius: 16, border: `1.5px solid ${BORDER}`,
        }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>💬</div>
          <p style={{ fontFamily: P, fontSize: 15, fontWeight: 600, color: "#1a1008", marginBottom: 6 }}>Be the first to comment</p>
          <p style={{ fontFamily: P, fontSize: 13, color: "#b0a090" }}>Share your thoughts on this article.</p>
        </div>
      ) : (
        <div>
          {comments.map((c, i) => (
            <div key={c.id} style={{
              display: "flex", gap: 14, padding: "20px 0",
              borderBottom: i < comments.length - 1 ? `1px solid #f0e8de` : "none",
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
                background: ORANGE, display: "flex", alignItems: "center",
                justifyContent: "center", fontFamily: P, fontSize: 16, fontWeight: 700, color: "#fff",
              }}>
                {(c.userName || c.name || "U")[0].toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <span style={{ fontFamily: P, fontSize: 14, fontWeight: 700, color: "#1a1008" }}>
                    {c.userName || c.name}
                  </span>
                  <span style={{ fontFamily: P, fontSize: 12, color: "#b0a090" }}>
                    {c.createdAt ? new Date(c.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
                  </span>
                </div>
                <p style={{ fontFamily: P, fontSize: 14, color: "#4a3a2a", lineHeight: 1.75 }}>{c.text}</p>
                <button
                  onClick={() => isLoggedIn ? null : onLoginRequired("reply")}
                  style={{ fontFamily: P, fontSize: 12, color: "#9a8a7a", background: "none", border: "none", cursor: "pointer", marginTop: 7 }}>
                  ↩ Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── SIDEBAR ───────────────────────────────────────────── */
function ArticleSidebar({ article, allArticles }) {
  const moreArticles = allArticles.filter(a => a.slug !== article.slug).slice(0, 5)
  const [email, setEmail]   = useState("")
  const [subscribed, setSub] = useState(false)

  return (
    <aside style={{ position: "sticky", top: 90, display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Related Topics */}
      <div style={{ background: CARD, borderRadius: 16, padding: "18px 18px", border: `1.5px solid ${BORDER}` }}>
        <p style={sideLabel}>Related Topics</p>
        <div>
          {RELATED_TOPICS.map((t, i) => (
            <Link key={t} href={`/articles?topic=${encodeURIComponent(t.toLowerCase())}`}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 0", fontFamily: P, fontSize: 14, color: "#3a2a1a",
                textDecoration: "none", borderBottom: i < RELATED_TOPICS.length - 1 ? `1px solid #f0e8de` : "none",
                transition: "color .15s",
              }}
              onMouseEnter={e => e.currentTarget.style.color = ORANGE}
              onMouseLeave={e => e.currentTarget.style.color = "#3a2a1a"}
            >
              {t} <ChevronRight size={14} style={{ color: "#d8cfc4", flexShrink: 0 }} />
            </Link>
          ))}
        </div>
      </div>

      {/* More articles */}
      <div style={{ background: CARD, borderRadius: 16, padding: "18px 18px", border: `1.5px solid ${BORDER}` }}>
        <p style={{ ...sideLabel, display: "flex", alignItems: "center", gap: 6 }}>
          <Flame size={13} style={{ color: ORANGE }} /> More Articles
        </p>
        {moreArticles.map((a, i) => (
          <Link key={a.slug} href={`/articles/${a.slug}`}
            style={{
              display: "flex", gap: 12, padding: "11px 0", textDecoration: "none",
              borderBottom: i < moreArticles.length - 1 ? `1px solid #f0e8de` : "none",
              transition: "opacity .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = ".72"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            {/* 5:4 thumbnail */}
            <div style={{ position: "relative", width: 60, height: 48, borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
              <Image src={a.featuredImage || "/images/default.jpg"} fill alt={a.title} style={{ objectFit: "cover" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontFamily: P, fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: ORANGE, letterSpacing: "0.1em" }}>{a.category}</span>
              <p style={{ fontFamily: P, fontSize: 13, fontWeight: 600, color: "#1a1008", lineHeight: 1.4, marginTop: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.title}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Sidebar newsletter */}
      <div style={{
        background: `linear-gradient(145deg,${ORANGE} 0%,#8a2e06 100%)`,
        borderRadius: 16, padding: "22px 20px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -18, right: -18, width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <p style={{ fontFamily: P, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#ffd580", marginBottom: 5 }}>Newsletter</p>
        <h3 style={{ fontFamily: P, fontSize: 16, fontWeight: 800, color: "#fff", lineHeight: 1.3, marginBottom: 7 }}>Wisdom in Your Inbox</h3>
        <p style={{ fontFamily: P, fontSize: 12, color: "rgba(255,255,255,0.72)", lineHeight: 1.65, marginBottom: 14 }}>Thoughtful insights, every week.</p>
        {subscribed ? (
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 9, padding: 10, textAlign: "center", fontFamily: P, fontSize: 13, color: "#fff", fontWeight: 600 }}>
            ✓ You're subscribed!
          </div>
        ) : (
          <>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email"
              type="email" style={{ width: "100%", padding: "10px 12px", borderRadius: 9, border: "none", fontFamily: P, fontSize: 13, color: "#1a1008", outline: "none", marginBottom: 9, boxSizing: "border-box" }} />
            <button onClick={() => email.includes("@") && setSub(true)}
              style={{ width: "100%", padding: "10px", borderRadius: 9, background: "#ffd580", border: "none", fontFamily: P, fontSize: 13, fontWeight: 700, color: "#7a3008", cursor: "pointer" }}>
              Subscribe Free
            </button>
          </>
        )}
      </div>
    </aside>
  )
}

const sideLabel = {
  fontFamily: P, fontSize: 10, fontWeight: 700,
  textTransform: "uppercase", letterSpacing: "0.14em",
  color: GOLD, marginBottom: 14,
}

/* ─── RELATED ARTICLES ──────────────────────────────────── */
function RelatedArticles({ articles, category }) {
  return (
    <div style={{ marginTop: 48, paddingTop: 36, borderTop: `1px solid ${BORDER}` }}>
      <h2 style={{ fontFamily: P, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#1a1008", marginBottom: 22 }}>
        Articles on {category}
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {articles.map(a => (
          <Link key={a.slug} href={`/articles/${a.slug}`}
            style={{ textDecoration: "none", display: "block", borderRadius: 16, overflow: "hidden", background: CARD, border: `1.5px solid ${BORDER}`, transition: "box-shadow .2s" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 22px rgba(180,80,20,0.11)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
          >
            {/* 5:4 aspect */}
            <div style={{ position: "relative", width: "100%", paddingBottom: "80%", overflow: "hidden" }}>
              <Image src={a.featuredImage || "/images/default.jpg"} fill alt={a.title} style={{ objectFit: "cover" }} />
            </div>
            <div style={{ padding: "13px 15px" }}>
              <span style={{ fontFamily: P, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: ORANGE }}>{a.category}</span>
              <h3 style={{ fontFamily: P, fontSize: 13, fontWeight: 700, color: "#1a1008", lineHeight: 1.4, marginTop: 4, marginBottom: 7, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.title}</h3>
              <div style={{ display: "flex", gap: 10, fontFamily: P, fontSize: 11, color: "#b0a090" }}>
                {a.readTime && <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Clock size={10} />{a.readTime}</span>}
                <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Heart size={10} />{a.likes || 0}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

/* ─── EXCERPT CAROUSEL ──────────────────────────────────── */
function ExcerptCarousel({ articles }) {
  const [idx, setIdx] = useState(0)
  const PER = 3, total = articles.length
  const canPrev = idx > 0, canNext = idx + PER < total

  return (
    <div style={{ marginTop: 48, paddingTop: 36, borderTop: `1px solid ${BORDER}` }}>
      <h2 style={{ fontFamily: P, fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#1a1008", marginBottom: 22 }}>
        Excerpts From Articles
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
        {articles.slice(idx, idx + PER).map(a => (
          <div key={a.slug} style={{
            background: CARD, borderRadius: 18, padding: "26px 22px",
            border: `1.5px solid ${BORDER}`, display: "flex", flexDirection: "column",
            justifyContent: "space-between", minHeight: 248, position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", bottom: -14, right: -14, width: 72, height: 72, borderRadius: "50%", background: "rgba(212,98,26,0.04)" }} />
            <div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                <Quote size={16} style={{ color: ORANGE, flexShrink: 0, marginTop: 2 }} />
                <h3 style={{ fontFamily: P, fontSize: 14, fontWeight: 700, color: "#1a1008", lineHeight: 1.4 }}>{a.title}</h3>
              </div>
              <div style={{ width: 24, height: 2, background: ORANGE, borderRadius: 99, marginBottom: 12 }} />
              <p style={{ fontFamily: P, fontSize: 13, color: "#5a4a3a", fontStyle: "italic", lineHeight: 1.85, display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                "{a.excerpt}"
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 18, paddingTop: 14, borderTop: `1px solid #f0e8de` }}>
              <Link href={`/articles/${a.slug}`} style={{ fontFamily: P, fontSize: 12, fontWeight: 600, color: "#1a1008", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                Read Full Article <ChevronRight size={12} />
              </Link>
              <ShareButton article={a} s={{ fontBody: P, fontDisplay: P, btnOutline: "sb-outline-sm" }} variant="icon" position="above" />
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, marginTop: 18 }}>
        <div style={{ display: "flex", gap: 5, marginRight: 6 }}>
          {Array.from({ length: Math.ceil(total / PER) }).map((_, i) => (
            <div key={i} onClick={() => setIdx(i * PER)} style={{
              width: idx === i * PER ? 22 : 8, height: 8, borderRadius: 99,
              background: idx === i * PER ? ORANGE : "#e0d4c8",
              cursor: "pointer", transition: "all .2s",
            }} />
          ))}
        </div>
        {[{ can: canPrev, icon: <ChevronLeft size={14} />, fn: () => setIdx(i => Math.max(0, i - PER)) },
          { can: canNext, icon: <ChevronRight size={14} />, fn: () => setIdx(i => Math.min(total - PER, i + PER)) }
        ].map(({ can, icon, fn }, i) => (
          <button key={i} onClick={fn} disabled={!can} style={{
            width: 34, height: 34, borderRadius: "50%",
            background: can ? (i === 1 ? ORANGE : CARD) : "#f0ece6",
            border: `1.5px solid ${can ? (i === 1 ? ORANGE : BORDER) : BORDER}`,
            color: can ? (i === 1 ? "#fff" : "#1a1008") : "#c8bdb0",
            cursor: can ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>{icon}</button>
        ))}
      </div>
    </div>
  )
}

/* ─── MAIN PAGE ─────────────────────────────────────────── */
export default function ArticlePage({ params: paramsPromise }) {
  const params   = use(paramsPromise)
  const articles = getArticles()
  const article  = articles.find(a => a.slug === params.slug)

  // Auth state — replace with your real session hook e.g. useSession()
const [isLoggedIn, setIsLoggedIn] = useState(false)
const [user, setUser] = useState(null)

useEffect(() => {
  async function checkUser() {
    const { data } = await supabase.auth.getUser()

    if (data?.user) {
      setIsLoggedIn(true)
      setUser(data.user)
    }
  }

  checkUser()
}, [])

  const [liked,      setLiked]      = useState(false)
  const [likeCount,  setLikeCount]  = useState(0)
  const [saved,      setSaved]      = useState(false)

  const [showTop,    setShowTop]    = useState(false)
  const [mounted,    setMounted]    = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!article) return
    // Fetch real like count from DB
  async function loadLikes(){

  const { count } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("article_slug", article.slug)

  setLikeCount(count || 0)

}

loadLikes()
  }, [article])

  useEffect(() => {
    const fn = () => setShowTop(window.scrollY > 500)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  if (!article) return notFound()

  const related = (() => {
    const same = articles.filter(a => a.slug !== article.slug && a.category === article.category)
    return same.length >= 2 ? same.slice(0, 3) : articles.filter(a => a.slug !== article.slug).slice(0, 3)
  })()
  const excerpts = articles.filter(a => a.slug !== article.slug).slice(0, 9)
  const tags     = article.tags ? (Array.isArray(article.tags) ? article.tags : article.tags.split(",").map(t => t.trim())) : []
const router = useRouter()
  function requireLogin() {
  router.push(`/signin?redirect=/articles/${article.slug}`)
}

  async function handleLike() {

  if (!isLoggedIn) {
    requireLogin("like")
    return
  }

  const next = !liked
  setLiked(next)
  setLikeCount(c => next ? c + 1 : c - 1)

  if (next) {

    await supabase
      .from("likes")
      .insert({
        article_slug: article.slug,
        user_id: user.id
      })

  } else {

    await supabase
      .from("likes")
      .delete()
      .eq("article_slug", article.slug)
      .eq("user_id", user.id)

  }
}
 async function handleSave() {

  if (!isLoggedIn) {
    requireLogin("save")
    return
  }

  const next = !saved
  setSaved(next)

  if (next) {

    await supabase
      .from("saved_articles")
      .insert({
        article_slug: article.slug,
        user_id: user.id
      })

  } else {

    await supabase
      .from("saved_articles")
      .delete()
      .eq("article_slug", article.slug)
      .eq("user_id", user.id)

  }
}
  // Share bar used in two places
  const ShareBar = () => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <button onClick={handleLike} style={{
          display: "flex", alignItems: "center", gap: 6,
          fontFamily: P, fontSize: 14, fontWeight: 500,
          color: liked ? "#ef4444" : "#6a5a4a",
          background: "none", border: "none", cursor: "pointer", transition: "color .15s",
        }}>
          <Heart size={18} fill={liked ? "currentColor" : "none"} />{likeCount}
        </button>
        <a href="#comments" style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: P, fontSize: 14, fontWeight: 500, color: "#6a5a4a", textDecoration: "none" }}>
          <MessageCircle size={18} />
        </a>
        <button onClick={handleSave} style={{
          display: "flex", alignItems: "center", gap: 6,
          fontFamily: P, fontSize: 14, fontWeight: 500,
          color: saved ? ORANGE : "#6a5a4a",
          background: "none", border: "none", cursor: "pointer",
        }}>
          <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
          <span style={{ fontSize: 13 }}>{saved ? "Saved" : "Save"}</span>
        </button>
      </div>
      {mounted && (
        <ShareButton
          article={article}
          s={{ fontBody: P, fontDisplay: P, btnOutline: "sb-outline" }}
          variant="button"
          position="above"
        />
      )}
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes mFade  { from{opacity:0}                  to{opacity:1} }
        @keyframes mSlide { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

        .sb-outline {
          font-family:${P}; font-size:13px; font-weight:600;
          background:transparent; border:1.5px solid ${BORDER};
          border-radius:9px; color:#6a5a4a;
          cursor:pointer; display:inline-flex; align-items:center; gap:5px; padding:7px 14px;
          transition:all .15s;
        }
        .sb-outline:hover { border-color:${ORANGE}; color:${ORANGE}; background:#fff8f3; }
        .sb-outline-sm {
          font-family:${P}; font-size:12px; font-weight:500;
          background:transparent; border:none; color:#9a8a7a;
          cursor:pointer; display:inline-flex; align-items:center; gap:4px; padding:3px 0;
          transition:color .15s;
        }
        .sb-outline-sm:hover { color:${ORANGE}; }

        .art-body { font-family:${P}; font-size:16px; line-height:1.9; color:#2a1a0a; }
        .art-body p  { margin-bottom:1.5em; }
        .art-body h2 { font-size:21px; font-weight:700; color:#1a1008; margin:2em 0 .6em; }
        .art-body h3 { font-size:17px; font-weight:600; color:#1a1008; margin:1.6em 0 .5em; }
        .art-body strong { font-weight:700; color:#1a1008; }
        .art-body blockquote {
          border-left:3px solid ${ORANGE}; background:#fff8f3;
          padding:18px 22px; margin:2em 0; border-radius:0 12px 12px 0;
          font-style:italic; color:#5a4a3a;
        }
        .art-body a  { color:${ORANGE}; }
        .art-body ul,.art-body ol { margin:1em 0 1.5em 1.6em; }
        .art-body li { margin-bottom:.5em; }
      `}</style>

      <ReadingProgress />
    

      <div style={{ background: BG, minHeight: "100vh", fontFamily: P }}>

        {/* ── TWO-COLUMN BODY ── */}
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "20px 20px 0", boxSizing: "border-box" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 290px", gap: 30, alignItems: "start" }}>

            {/* ── LEFT ── */}
            <div style={{ minWidth: 0 }}>

              {/* Back link */}
              <Link href="/articles" style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontFamily: P, fontSize: 13, fontWeight: 600,
                color: "#7a6a5a", textDecoration: "none", marginBottom: 16,
              }}>
                <ArrowLeft size={14} />Articles
              </Link>

              {/* Category + title + meta — above the image like the prototype */}
              <div style={{ marginBottom: 18 }}>
                <span style={{
                  display: "inline-block", fontFamily: P, fontSize: 10, fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.15em",
                  color: ORANGE, marginBottom: 10,
                }}>
                  {article.category}
                </span>
                <h1 style={{
                  fontFamily: P, fontSize: "clamp(22px,2.8vw,34px)", fontWeight: 800,
                  color: "#1a1008", lineHeight: 1.22, marginBottom: 12,
                }}>
                  {article.title}
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: P, fontSize: 13, color: "#9a8a7a" }}>
                  {article.readTime && (
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={13} />{article.readTime}
                    </span>
                  )}
                  {article.views != null && (
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <BarChart2 size={13} />{(article.views / 1000).toFixed(1)}k reads
                    </span>
                  )}
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Heart size={13} />{likeCount}
                  </span>
                </div>
              </div>

              {/* Share bar — between title and image, matching prototype */}
              <div style={{ background: CARD, borderRadius: 14, padding: "12px 18px", marginBottom: 18, border: `1.5px solid ${BORDER}`, boxShadow: "0 1px 8px rgba(180,80,20,0.05)" }}>
                <ShareBar />
              </div>

              {/* 3:2 image — cropped, no overlay */}
              <div style={{
                position: "relative", width: "100%",
                paddingBottom: "66.666%", /* 3:2 = height is 2/3 of width */
                borderRadius: 12, overflow: "hidden",
                marginBottom: 0,
              }}>
                <Image
                  src={article.featuredImage || "/images/default.jpg"}
                  alt={article.title} fill priority
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                />
                {/* Save button overlaid top-right on image */}
                <button onClick={handleSave} style={{
                  position: "absolute", top: 12, right: 12,
                  width: 36, height: 36, borderRadius: 9,
                  background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)",
                  border: "none", color: "#fff", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
                </button>
              </div>

              {/* Article body card */}
              <div style={{ background: CARD, borderRadius: 20, padding: "40px 44px", marginTop: 20, border: `1.5px solid ${BORDER}`, boxShadow: "0 2px 14px rgba(180,80,20,0.06)" }}>

                {/* Summary */}
                {article.excerpt && (
                  <div style={{ background: "#faf8f5", border: `1.5px solid ${BORDER}`, borderRadius: 13, padding: "20px 22px", marginBottom: 32 }}>
                    <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                      <Quote size={17} style={{ color: ORANGE, flexShrink: 0, marginTop: 3 }} />
                      <p style={{ fontFamily: P, fontSize: 15, fontWeight: 500, color: "#3a2a1a", lineHeight: 1.82 }}>{article.excerpt}</p>
                    </div>
                    <p style={{ fontFamily: P, fontSize: 11, color: "#b0a090", borderTop: `1px solid ${BORDER}`, paddingTop: 10 }}>
                      This summary has been prepared by Guruji Shrawan editors.
                    </p>
                  </div>
                )}

                {/* Content */}
                <div className="art-body"
                  dangerouslySetInnerHTML={{ __html: article.content || `<p>${article.excerpt || ""}</p>` }}
                />

                {/* Tags */}
                {tags.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 28, paddingTop: 22, borderTop: `1px solid #f0e8de` }}>
                    {tags.map(tag => (
                      <Link key={tag} href={`/articles?topic=${encodeURIComponent(tag.toLowerCase())}`}
                        style={{ fontFamily: P, fontSize: 11, fontWeight: 500, padding: "4px 12px", borderRadius: 99, background: "#fdf3d8", color: GOLD, border: "1px solid #e8c97a", textDecoration: "none" }}>
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Attribution */}
                <p style={{ fontFamily: P, fontSize: 12, color: "#b0a090", fontStyle: "italic", lineHeight: 1.65, marginTop: 20, paddingTop: 16, borderTop: `1px solid #f0e8de` }}>
                  This article has been created by volunteers of the Guruji Shrawan Foundation from transcriptions of sessions.
                </p>

                {/* Bottom share row */}
                <div style={{ marginTop: 24, paddingTop: 18, borderTop: `1px solid #f0e8de` }}>
                  <ShareBar />
                </div>
              </div>

              {/* Newsletter */}
              <NewsletterInline />

              {/* Comments */}
              
              <CommentsSection
  articleSlug={article.slug}
  isLoggedIn={isLoggedIn}
  onLoginRequired={requireLogin}
  commentCount={0}
  user={user}
/>

              {/* Related articles */}
              <RelatedArticles articles={related} category={article.category} />

              {/* Excerpts carousel */}
              <ExcerptCarousel articles={excerpts} />

              <div style={{ height: 60 }} />
            </div>

            {/* ── SIDEBAR ── */}
            <div style={{ paddingTop: 22 }}>
              <ArticleSidebar article={article} allArticles={articles} />
            </div>
          </div>
        </div>
      </div>

      {/* Back to top */}
      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 100,
            width: 44, height: 44, borderRadius: "50%",
            background: `linear-gradient(135deg,${ORANGE},#b04010)`,
            color: "#fff", border: "none", fontSize: 18, fontWeight: 700,
            cursor: "pointer", boxShadow: "0 4px 16px rgba(212,98,26,0.40)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >↑</button>
      )}
    </>
  )
}