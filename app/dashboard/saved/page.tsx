"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { supabase } from "../../lib/supabaseClient"
import {
  FaBookmark, FaRegBookmark, FaSearch, FaTimes, FaArrowLeft,
  FaArrowRight, FaHeart, FaRegHeart, FaShare, FaTrash,
  FaFacebook, FaWhatsapp, FaLink, FaCheck, FaFilter,
  FaSortAmountDown, FaChevronDown, FaEye, FaRegClock,
  FaInbox, FaSignInAlt,
} from "react-icons/fa"

/* ══════════════════════════════════════════
   TYPES
══════════════════════════════════════════ */
type Article = {
  slug: string
  title: { en: string; hi?: string }
  excerpt?: string
  category?: string
  featuredImage?: string
  readTime?: string
  publishedAt?: string
  views?: number
  likes?: number
}
type SavedEntry = {
  article_slug: string
  saved_at: string
  article?: Article
}

/* ══════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════ */
const SORT_OPTS = [
  { val:"newest",  label:"Recently Saved" },
  { val:"oldest",  label:"Oldest First" },
  { val:"title",   label:"By Title (A–Z)" },
]
const AVATAR_COLORS = ["#c8551a","#b8841a","#2563eb","#16a34a","#9333ea","#0891b2"]

/* ══════════════════════════════════════════
   UTILS
══════════════════════════════════════════ */
function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60)      return `${s}s ago`
  if (s < 3600)    return `${Math.floor(s/60)}m ago`
  if (s < 86400)   return `${Math.floor(s/3600)}h ago`
  if (s < 2592000) return `${Math.floor(s/86400)}d ago`
  return new Date(iso).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})
}
function fmtViews(n=0) {
  if (n>=1000) return `${(n/1000).toFixed(1)}K`
  return String(n)
}

/* ══════════════════════════════════════════
   SHARE SHEET
══════════════════════════════════════════ */
function ShareSheet({ slug, title, onClose }: { slug:string; title:string; onClose:()=>void }) {
  const [copied, setCopied] = useState(false)
  const url = `${typeof window!=="undefined"?window.location.origin:""}/articles/${slug}`
  const PLATFORMS = [
    { icon:<FaWhatsapp/>, label:"WhatsApp", color:"#25d366", href:`https://wa.me/?text=${encodeURIComponent(title+" "+url)}` },
    { icon:<FaFacebook/>, label:"Facebook", color:"#1877f2", href:`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
  ]
  return (
    <div className="sv-sheet-backdrop" onClick={onClose}>
      <div className="sv-sheet" onClick={e=>e.stopPropagation()}>
        <div className="sv-sheet-handle"/>
        <div className="sv-sheet-head">
          <p className="sv-sheet-title">Share Article</p>
          <button className="sv-sheet-close" onClick={onClose}><FaTimes/></button>
        </div>
        <p className="sv-sheet-sub">{title}</p>
        <div className="sv-sheet-icons">
          {PLATFORMS.map(p=>(
            <a key={p.label} href={p.href} target="_blank" rel="noopener noreferrer" className="sv-sheet-icon">
              <div className="sv-sheet-circle" style={{background:p.color}}>{p.icon}</div>
              <span>{p.label}</span>
            </a>
          ))}
        </div>
        <div className="sv-sheet-copy">
          <input className="sv-sheet-input" value={url} readOnly/>
          <button className={`sv-sheet-copybtn ${copied?"sv-copied":""}`}
            onClick={()=>{ navigator.clipboard.writeText(url).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2200) }) }}>
            {copied ? <><FaCheck size={10}/> Copied!</> : <><FaLink size={10}/> Copy</>}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   ARTICLE CARD
══════════════════════════════════════════ */
function SavedCard({ entry, onUnsave, onLike, liked, idx }: {
  entry: SavedEntry
  onUnsave: ()=>void
  onLike: ()=>void
  liked: boolean
  idx: number
}) {
  const a = entry.article
  const [hover, setHover] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [confirmUnsave, setConfirmUnsave] = useState(false)
  const slug = entry.article_slug

  if (!a) return null

  return (
    <>
      <article
        className={`sv-card ${hover?"sv-card-h":""}`}
        onMouseEnter={()=>setHover(true)}
        onMouseLeave={()=>{ setHover(false); setConfirmUnsave(false) }}
        style={{ animationDelay:`${idx*55}ms` }}
      >
        {/* thumbnail */}
        <Link href={`/articles/${slug}`} className="sv-card-img-wrap">
          {a.featuredImage
            ? <Image src={a.featuredImage} alt={a.title.en} fill
                sizes="(max-width:640px) 90vw,(max-width:1200px) 45vw,30vw"
                style={{objectFit:"cover",transition:"transform .4s ease",transform:hover?"scale(1.05)":"scale(1)"}}/>
            : <div className="sv-card-img-placeholder">
                <FaBookmark size={20} style={{opacity:.2}}/>
              </div>
          }
          <div className="sv-card-img-overlay"/>
          {/* category pill over image */}
          {a.category && <div className="sv-card-cat">{a.category}</div>}
          {/* saved date */}
          <div className="sv-card-saved-at">
            <FaBookmark size={9}/> Saved {timeAgo(entry.saved_at)}
          </div>
        </Link>

        {/* body */}
        <div className="sv-card-body">
          <Link href={`/articles/${slug}`} className="sv-card-title">{a.title.en}</Link>
          {a.title.hi && <p className="sv-card-title-hi">{a.title.hi}</p>}
          {a.excerpt && <p className="sv-card-excerpt">{a.excerpt}</p>}

          <div className="sv-card-meta">
            {a.readTime && <span className="sv-meta-item"><FaRegClock size={9}/> {a.readTime}</span>}
            {(a.views||0)>0 && <span className="sv-meta-item"><FaEye size={9}/> {fmtViews(a.views)}</span>}
            {a.publishedAt && <span className="sv-meta-item">{timeAgo(a.publishedAt)}</span>}
          </div>

          <div className="sv-card-actions">
            <Link href={`/articles/${slug}`} className="sv-read-btn">
              Read Article <FaArrowRight size={9}/>
            </Link>

            <div className="sv-card-icons">
              <button
                className={`sv-icon-btn ${liked?"sv-icon-liked":""}`}
                onClick={onLike} title="Like"
              >
                {liked?<FaHeart size={13}/>:<FaRegHeart size={13}/>}
              </button>

              <button className="sv-icon-btn" onClick={()=>setShowShare(true)} title="Share">
                <FaShare size={12}/>
              </button>

              {!confirmUnsave
                ? <button className="sv-icon-btn sv-icon-unsave" onClick={()=>setConfirmUnsave(true)} title="Remove">
                    <FaBookmark size={12}/>
                  </button>
                : <button className="sv-icon-btn sv-icon-confirm" onClick={onUnsave} title="Confirm remove">
                    <FaTrash size={11}/>
                  </button>
              }
            </div>
          </div>
        </div>
      </article>

      {showShare && <ShareSheet slug={slug} title={a.title.en} onClose={()=>setShowShare(false)}/>}
    </>
  )
}

/* ══════════════════════════════════════════
   EMPTY STATE
══════════════════════════════════════════ */
function EmptyState({ isSearch, isNotLoggedIn, onLoginClick }: {
  isSearch:boolean; isNotLoggedIn:boolean; onLoginClick:()=>void
}) {
  if (isNotLoggedIn) return (
    <div className="sv-empty">
      <div className="sv-empty-illustration">
        <div className="sv-empty-circle">
          <FaSignInAlt size={32} style={{color:"var(--o)",opacity:.7}}/>
        </div>
      </div>
      <h2 className="sv-empty-title">Sign in to see saved articles</h2>
      <p className="sv-empty-sub">Your bookmarks are stored securely with your account. Sign in to access them on any device.</p>
      <button className="sv-empty-btn" onClick={onLoginClick}>
        <FaSignInAlt size={12}/> Sign In
      </button>
    </div>
  )
  if (isSearch) return (
    <div className="sv-empty">
      <div className="sv-empty-illustration">
        <div className="sv-empty-circle">
          <FaSearch size={28} style={{color:"var(--o)",opacity:.7}}/>
        </div>
      </div>
      <h2 className="sv-empty-title">No matches found</h2>
      <p className="sv-empty-sub">Try a different search term or clear the filter.</p>
    </div>
  )
  return (
    <div className="sv-empty">
      <div className="sv-empty-illustration">
        <div className="sv-empty-circle">
          <FaBookmark size={32} style={{color:"var(--o)",opacity:.6}}/>
        </div>
        <div className="sv-empty-ring"/>
        <div className="sv-empty-ring sv-empty-ring2"/>
      </div>
      <h2 className="sv-empty-title">Your reading list is empty</h2>
      <p className="sv-empty-sub">When you bookmark articles while reading, they'll appear here for easy access any time.</p>
      <Link href="/articles" className="sv-empty-btn">
        Browse Articles <FaArrowRight size={11}/>
      </Link>
    </div>
  )
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function SavedPage() {
  const [user, setUser]           = useState<any>(null)
  const [loading, setLoading]     = useState(true)
  const [entries, setEntries]     = useState<SavedEntry[]>([])
  const [likedIds, setLikedIds]   = useState<Set<string>>(new Set())
  const [search, setSearch]       = useState("")
  const [sort, setSort]           = useState("newest")
  const [showSort, setShowSort]   = useState(false)
  const [catFilter, setCatFilter] = useState("All")
  const [showCats, setShowCats]   = useState(false)
  const [layout, setLayout]       = useState<"grid"|"list">("grid")
  const [showLogin, setShowLogin] = useState(false)

  /* auth */
  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{ setUser(data.session?.user??null); if(!data.session?.user) setLoading(false) })
    const {data:l} = supabase.auth.onAuthStateChange((_,s)=>setUser(s?.user??null))
    return ()=>l.subscription.unsubscribe()
  },[])

  /* liked slugs */
  useEffect(()=>{
    try { setLikedIds(new Set(JSON.parse(localStorage.getItem("gs_liked")||"[]"))) } catch{}
  },[])

  /* load saved articles */
  const load = useCallback(async()=>{
    if (!user) return
    setLoading(true)
    const { data: saves } = await supabase
      .from("article_saves")
      .select("article_slug, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: sort==="oldest" })

    if (!saves?.length) { setEntries([]); setLoading(false); return }

    // fetch article metadata for each saved slug
    // Using the articles API endpoint (or data file)
    try {
      const res = await fetch("/api/articles")
      const data = await res.json()
      const all: Article[] = Array.isArray(data?.articles) ? data.articles : []
      const articleMap = new Map(all.map((a:Article)=>[a.slug, a]))

      const enriched: SavedEntry[] = saves.map(s=>({
        article_slug: s.article_slug,
        saved_at: s.created_at,
        article: articleMap.get(s.article_slug),
      })).filter(e=>e.article)

      setEntries(enriched)
    } catch {
      setEntries(saves.map(s=>({ article_slug:s.article_slug, saved_at:s.created_at })))
    }
    setLoading(false)
  },[user, sort])

  useEffect(()=>{ load() },[load])

  /* unsave */
  async function unsave(slug: string) {
    await supabase.from("article_saves").delete().eq("user_id",user.id).eq("article_slug",slug)
    setEntries(prev=>prev.filter(e=>e.article_slug!==slug))
  }

  /* like toggle */
  async function toggleLike(slug: string) {
    const already = likedIds.has(slug)
    const ns = new Set(likedIds)
    already ? ns.delete(slug) : ns.add(slug)
    setLikedIds(ns)
    localStorage.setItem("gs_liked",JSON.stringify([...ns]))
    if (already) {
      await supabase.from("article_likes").delete().eq("user_id",user?.id||"anon").eq("article_slug",slug)
    } else {
      await supabase.from("article_likes").upsert({ user_id:user?.id||"anon", article_slug:slug })
    }
  }

  /* derived */
  const categories = ["All", ...Array.from(new Set(entries.map(e=>e.article?.category||"").filter(Boolean)))]

  let filtered = entries.filter(e=>{
    const mQ = !search || (e.article?.title.en||"").toLowerCase().includes(search.toLowerCase()) ||
               (e.article?.excerpt||"").toLowerCase().includes(search.toLowerCase())
    const mC = catFilter==="All" || e.article?.category===catFilter
    return mQ && mC
  })

  if (sort==="title") filtered = [...filtered].sort((a,b)=>(a.article?.title.en||"").localeCompare(b.article?.title.en||""))

  return (
    <main className="sv-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Poppins:wght@300;400;500;600;700;800&display=swap');

        :root{
          --o:#c8551a; --g:#b8841a; --bg:#faf7f2; --bg2:#f4efe6; --bg3:#ede5d8;
          --card:#ffffff; --border:#e8ddd0; --border2:#d8c9b8;
          --text:#1a1008; --muted:#8a7a6a;
          --sans:'Poppins',system-ui,sans-serif; --body:'Lora',Georgia,serif;
          --shadow:0 2px 14px rgba(26,16,8,.07); --shadow2:0 10px 36px rgba(26,16,8,.12);
        }

        @keyframes sv-up    { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sv-in    { from{opacity:0} to{opacity:1} }
        @keyframes sv-scale { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
        @keyframes sv-sheet { from{transform:translateY(56px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes sv-card-in { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sv-shimmer{ from{background-position:-200% 0} to{background-position:200% 0} }
        @keyframes sv-pulse-ring { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(2);opacity:0} }
        @keyframes sv-spin  { to{transform:rotate(360deg)} }

        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0 }

        .sv-root {
          background:var(--bg); color:var(--text);
          font-family:var(--sans); min-height:100vh; overflow-x:hidden;
        }

        /* ══════════════════
           PAGE HERO
        ══════════════════ */
        .sv-hero {
          background: linear-gradient(160deg, #fffaf4, #faf7f2 55%, #fff6e8);
          border-bottom: 1px solid var(--border);
          padding: 56px 0 0;
        }
        .sv-hero-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 24px;
        }
        .sv-hero-top {
          display: flex; align-items: center; gap: 16px;
          padding-bottom: 28px;
        }
        .sv-back {
          display: flex; align-items: center; gap: 7px;
          font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .16em;
          color: var(--muted); text-decoration: none; flex-shrink: 0;
          transition: color .2s, gap .2s;
        }
        .sv-back:hover { color: var(--o); gap: 11px; }
        .sv-hero-heading {
          flex: 1;
        }
        .sv-hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .26em;
          color: var(--o); margin-bottom: 8px;
        }
        .sv-hero-eyebrow::before { content:''; display:block; width:22px; height:1.5px; background:var(--o); opacity:.4; border-radius:1px; }
        .sv-hero-h1 {
          font-family: var(--body);
          font-size: clamp(24px, 3.5vw, 40px);
          font-weight: 700; color: var(--text);
          line-height: 1.12; letter-spacing: -.02em;
        }
        .sv-hero-h1 em { font-style: italic; color: var(--o); }
        .sv-hero-sub {
          font-size: 13px; color: var(--muted); margin-top: 5px; line-height: 1.6;
        }
        /* stats pills */
        .sv-hero-stats {
          display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 20px;
        }
        .sv-stat-pill {
          display: flex; align-items: center; gap: 6px;
          background: var(--card); border: 1.5px solid var(--border);
          border-radius: 99px; padding: 6px 14px;
          font-size: 11px; font-weight: 700; color: var(--text);
        }
        .sv-stat-pill-ico { color: var(--o); }

        /* ── TOOLBAR ── */
        .sv-toolbar {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 0; border-top: 1px solid var(--border);
          flex-wrap: wrap;
        }
        /* search */
        .sv-search-wrap { position: relative; flex: 1; min-width: 200px; max-width: 380px; }
        .sv-search-ico { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: var(--muted); font-size: 12px; pointer-events: none; }
        .sv-search {
          width: 100%; background: var(--card); border: 1.5px solid var(--border);
          border-radius: 99px; padding: 9px 36px 9px 35px;
          font-family: var(--sans); font-size: 13px; color: var(--text); outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .sv-search::placeholder { color: var(--muted); }
        .sv-search:focus { border-color: rgba(200,85,26,.5); box-shadow: 0 0 0 3px rgba(200,85,26,.09); }
        .sv-search-x { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--muted); cursor: pointer; font-size: 12px; display: flex; align-items: center; }
        .sv-search-x:hover { color: var(--text); }
        /* category filter */
        .sv-cat-wrap { position: relative; }
        .sv-cat-btn {
          display: flex; align-items: center; gap: 6px;
          background: var(--card); border: 1.5px solid var(--border);
          border-radius: 99px; padding: 9px 16px;
          font-family: var(--sans); font-size: 12px; font-weight: 600;
          color: var(--muted); cursor: pointer; white-space: nowrap;
          transition: border-color .2s, color .2s;
        }
        .sv-cat-btn.sv-active-filter { color: var(--o); border-color: rgba(200,85,26,.4); background: rgba(200,85,26,.06); }
        .sv-cat-btn:hover { border-color: var(--border2); color: var(--text); }
        .sv-cat-drop {
          position: absolute; top: calc(100%+6px); left: 0;
          background: var(--card); border: 1.5px solid var(--border);
          border-radius: 12px; overflow: hidden; z-index: 60; min-width: 160px;
          box-shadow: var(--shadow2);
          animation: sv-scale .16s ease;
        }
        .sv-cat-opt {
          display: block; width: 100%; text-align: left;
          background: none; border: none; padding: 11px 16px;
          font-family: var(--sans); font-size: 12px; font-weight: 500;
          color: var(--muted); cursor: pointer;
          transition: background .14s, color .14s;
        }
        .sv-cat-opt:hover { background: var(--bg); color: var(--text); }
        .sv-cat-opt.sv-cat-active { color: var(--o); font-weight: 700; }
        /* sort */
        .sv-sort-wrap { position: relative; }
        .sv-sort-btn {
          display: flex; align-items: center; gap: 6px;
          background: var(--card); border: 1.5px solid var(--border);
          border-radius: 8px; padding: 9px 14px;
          font-family: var(--sans); font-size: 12px; font-weight: 600;
          color: var(--muted); cursor: pointer; white-space: nowrap;
          transition: border-color .2s, color .2s;
        }
        .sv-sort-btn:hover { border-color: var(--border2); color: var(--text); }
        .sv-sort-drop {
          position: absolute; right: 0; top: calc(100%+6px);
          background: var(--card); border: 1.5px solid var(--border);
          border-radius: 12px; overflow: hidden; z-index: 60; min-width: 170px;
          box-shadow: var(--shadow2); animation: sv-scale .16s ease;
        }
        .sv-sort-opt {
          display: block; width: 100%; text-align: left; background: none; border: none;
          padding: 11px 16px; font-family: var(--sans); font-size: 12px; font-weight: 500;
          color: var(--muted); cursor: pointer; transition: background .14s, color .14s;
        }
        .sv-sort-opt:hover { background: var(--bg); color: var(--text); }
        .sv-sort-opt.sv-sort-active { color: var(--o); font-weight: 700; }
        /* layout toggle */
        .sv-layout-btns { display: flex; gap: 4px; margin-left: auto; }
        .sv-layout-btn {
          width: 36px; height: 36px; border-radius: 8px;
          border: 1.5px solid var(--border); background: var(--card);
          color: var(--muted); display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 13px;
          transition: color .2s, border-color .2s, background .2s;
        }
        .sv-layout-btn.sv-la { color: var(--o); border-color: rgba(200,85,26,.4); background: rgba(200,85,26,.07); }
        .sv-layout-btn:not(.sv-la):hover { color: var(--text); border-color: var(--border2); }

        /* ══════════════════
           CONTENT
        ══════════════════ */
        .sv-main { max-width: 1200px; margin: 0 auto; padding: 28px 24px 80px; }
        .sv-result-count { font-size: 13px; color: var(--muted); margin-bottom: 20px; font-weight: 500; }
        .sv-result-count strong { color: var(--text); font-weight: 700; }

        /* ══════════════════
           GRID
        ══════════════════ */
        .sv-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px,1fr));
          gap: 20px;
        }
        .sv-list-view { display: flex; flex-direction: column; gap: 14px; }

        /* ── CARD ── */
        .sv-card {
          background: var(--card);
          border: 1.5px solid var(--border);
          border-radius: 18px; overflow: hidden;
          transition: transform .28s ease, box-shadow .28s ease, border-color .28s ease;
          display: flex; flex-direction: column;
          animation: sv-card-in .55s ease both;
        }
        .sv-card-h { transform: translateY(-3px); box-shadow: var(--shadow2); border-color: var(--border2); }

        /* image */
        .sv-card-img-wrap {
          position: relative; aspect-ratio: 16/9; overflow: hidden;
          background: var(--bg2); display: block; text-decoration: none;
        }
        .sv-card-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(26,16,8,.45) 0%, transparent 55%);
          pointer-events: none;
        }
        .sv-card-cat {
          position: absolute; bottom: 10px; left: 10px; z-index: 2;
          font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .17em;
          color: #fff; background: var(--o); padding: 3px 10px; border-radius: 99px;
        }
        .sv-card-saved-at {
          position: absolute; top: 10px; right: 10px; z-index: 2;
          display: flex; align-items: center; gap: 5px;
          font-size: 9px; font-weight: 700; color: rgba(255,255,255,.85);
          background: rgba(26,16,8,.65); backdrop-filter: blur(6px);
          border-radius: 99px; padding: 4px 10px;
        }
        .sv-card-img-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, var(--bg2), var(--bg3));
          color: var(--muted);
        }

        /* body */
        .sv-card-body { padding: 16px 18px 18px; flex: 1; display: flex; flex-direction: column; gap: 8px; }
        .sv-card-title {
          font-family: var(--sans); font-size: 15px; font-weight: 700; color: var(--text);
          line-height: 1.45; text-decoration: none;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
          transition: color .2s;
        }
        .sv-card-title:hover { color: var(--o); }
        .sv-card-title-hi {
          font-family: var(--body); font-size: 13px; font-style: italic;
          color: var(--muted); line-height: 1.5;
          display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
        }
        .sv-card-excerpt {
          font-family: var(--body); font-size: 13px; font-style: italic;
          color: var(--muted); line-height: 1.7;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
          flex: 1;
        }
        .sv-card-meta {
          display: flex; gap: 10px; align-items: center; flex-wrap: wrap;
        }
        .sv-meta-item {
          display: flex; align-items: center; gap: 4px;
          font-size: 10px; color: var(--muted); font-weight: 600;
        }
        .sv-card-actions {
          display: flex; align-items: center; gap: 8px;
          padding-top: 10px; border-top: 1px solid var(--border);
        }
        .sv-read-btn {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 12px; font-weight: 700; color: var(--o);
          text-decoration: none; flex: 1;
          transition: gap .18s ease;
        }
        .sv-read-btn:hover { gap: 10px; }
        .sv-card-icons { display: flex; gap: 4px; }
        .sv-icon-btn {
          width: 32px; height: 32px; border-radius: 8px;
          border: 1.5px solid var(--border); background: var(--bg);
          color: var(--muted); display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: color .2s, border-color .2s, background .2s, transform .15s;
        }
        .sv-icon-btn:hover { border-color: var(--border2); background: var(--bg2); color: var(--text); transform: scale(1.07); }
        .sv-icon-liked { color: #e05050 !important; border-color: rgba(224,80,80,.35) !important; background: #fff0f0 !important; }
        .sv-icon-unsave:hover { color: var(--o) !important; border-color: rgba(200,85,26,.4) !important; background: rgba(200,85,26,.07) !important; }
        .sv-icon-confirm { color: #c8320a !important; border-color: rgba(200,50,10,.35) !important; background: rgba(200,50,10,.07) !important; animation: sv-up .2s ease; }

        /* ── LIST MODE card ── */
        .sv-list-view .sv-card {
          flex-direction: row; min-height: 0;
        }
        .sv-list-view .sv-card-img-wrap {
          width: 220px; flex-shrink: 0; aspect-ratio: unset;
        }
        .sv-list-view .sv-card-body {
          padding: 16px 20px; gap: 6px;
        }
        .sv-list-view .sv-card-title { font-size: 15px; -webkit-line-clamp: 2; }
        .sv-list-view .sv-card-excerpt { -webkit-line-clamp: 3; }

        /* ══════════════════
           SKELETON LOADER
        ══════════════════ */
        .sv-skel-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px,1fr)); gap: 20px; }
        .sv-sk { background: var(--card); border-radius: 18px; border: 1.5px solid var(--border); overflow: hidden; }
        .sv-sk-img { aspect-ratio: 16/9; background: var(--bg2); position: relative; overflow: hidden; }
        .sv-sk-img::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(232,221,208,.7),transparent); background-size:200% 100%; animation:sv-shimmer 1.7s infinite; }
        .sv-sk-body { padding: 16px; }
        .sv-sk-l { background: var(--bg2); border-radius: 4px; margin-bottom: 9px; }

        /* ══════════════════
           EMPTY STATE
        ══════════════════ */
        .sv-empty { text-align: center; padding: 80px 24px; display: flex; flex-direction: column; align-items: center; }
        .sv-empty-illustration { position: relative; width: 96px; height: 96px; margin: 0 auto 28px; }
        .sv-empty-circle {
          width: 96px; height: 96px; border-radius: 50%;
          background: linear-gradient(135deg, #fff8f2, #fef0e0);
          border: 2px solid rgba(200,85,26,.18);
          display: flex; align-items: center; justify-content: center;
          position: relative; z-index: 1;
        }
        .sv-empty-ring {
          position: absolute; inset: -12px; border-radius: 50%;
          border: 1.5px solid rgba(200,85,26,.12);
          animation: sv-pulse-ring 2.5s ease-out infinite;
        }
        .sv-empty-ring2 { inset: -24px; animation-delay: .8s; border-color: rgba(200,85,26,.07); }
        .sv-empty-title { font-family: var(--body); font-size: 22px; font-style: italic; font-weight: 700; color: var(--text); margin-bottom: 10px; }
        .sv-empty-sub { font-size: 14px; color: var(--muted); line-height: 1.75; max-width: 380px; margin-bottom: 28px; }
        .sv-empty-btn {
          display: inline-flex; align-items: center; gap: 9px;
          background: linear-gradient(135deg, var(--o), #8a2e06);
          color: #fff; text-decoration: none; border: none; cursor: pointer;
          border-radius: 10px; padding: 13px 28px;
          font-family: var(--sans); font-size: 13px; font-weight: 700;
          box-shadow: 0 6px 20px rgba(200,85,26,.3);
          transition: transform .2s, box-shadow .2s;
        }
        .sv-empty-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(200,85,26,.42); }

        /* ══════════════════
           SHARE SHEET
        ══════════════════ */
        .sv-sheet-backdrop { position:fixed; inset:0; z-index:500; background:rgba(26,16,8,.52); display:flex; align-items:flex-end; justify-content:center; animation:sv-in .18s ease; }
        .sv-sheet { background:var(--card); border-radius:20px 20px 0 0; width:100%; max-width:460px; padding:12px 24px 32px; border:1.5px solid var(--border); border-bottom:none; box-shadow:0 -8px 40px rgba(26,16,8,.12); animation:sv-sheet .22s ease; }
        .sv-sheet-handle { width:36px; height:4px; background:var(--border); border-radius:2px; margin:0 auto 18px; }
        .sv-sheet-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:4px; }
        .sv-sheet-title { font-size:16px; font-weight:700; color:var(--text); }
        .sv-sheet-close { background:none; border:none; color:var(--muted); cursor:pointer; font-size:15px; }
        .sv-sheet-sub { font-size:12px; color:var(--muted); margin-bottom:22px; line-height:1.5; }
        .sv-sheet-icons { display:flex; gap:22px; justify-content:center; margin-bottom:22px; }
        .sv-sheet-icon { display:flex; flex-direction:column; align-items:center; gap:7px; text-decoration:none; }
        .sv-sheet-circle { width:52px; height:52px; border-radius:14px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:20px; transition:transform .2s; }
        .sv-sheet-icon:hover .sv-sheet-circle { transform:scale(1.1); }
        .sv-sheet-icon span { font-size:10px; font-weight:600; color:var(--muted); }
        .sv-sheet-copy { display:flex; gap:8px; }
        .sv-sheet-input { flex:1; background:var(--bg); border:1.5px solid var(--border); border-radius:8px; padding:10px 13px; font-size:12px; color:var(--muted); outline:none; }
        .sv-sheet-copybtn { display:flex; align-items:center; gap:6px; background:var(--text); color:#fff; border:none; border-radius:8px; padding:10px 16px; font-size:12px; font-weight:700; cursor:pointer; white-space:nowrap; transition:background .2s; }
        .sv-copied { background:#15803d !important; }
        .sv-sheet-copybtn:hover:not(.sv-copied) { background:var(--o); }

        /* ══════════════════
           RESPONSIVE
        ══════════════════ */
        @media(max-width:768px){
          .sv-grid { grid-template-columns: 1fr; }
          .sv-list-view .sv-card { flex-direction: column; }
          .sv-list-view .sv-card-img-wrap { width: 100%; aspect-ratio: 16/9; }
          .sv-hero-h1 { font-size: 26px; }
          .sv-toolbar { gap: 8px; }
          .sv-layout-btns { display: none; }
        }
        @media(max-width:480px){
          .sv-toolbar { flex-wrap: wrap; }
          .sv-search-wrap { max-width: 100%; min-width: 0; flex: 1 1 100%; }
        }
      `}</style>


      {/* ── HERO ── */}
      <div className="sv-hero">
        <div className="sv-hero-inner">
          <div className="sv-hero-top">
            <Link href="/" className="sv-back"><FaArrowLeft size={11}/> Back</Link>
            <div className="sv-hero-heading">
              <div className="sv-hero-eyebrow">Reading List</div>
              <h1 className="sv-hero-h1">
                Your <em>Saved</em> Articles
              </h1>
              <p className="sv-hero-sub">
                {user
                  ? `Bookmarks for ${user.email?.split("@")[0]} — read anytime, anywhere.`
                  : "Sign in to access your personal reading list across all devices."}
              </p>
            </div>
          </div>

          {/* stats + toolbar */}
          {user && !loading && (
            <>
              <div className="sv-hero-stats">
                <div className="sv-stat-pill">
                  <FaBookmark size={11} className="sv-stat-pill-ico"/>
                  <span>{entries.length} saved</span>
                </div>
                {categories.length > 1 && (
                  <div className="sv-stat-pill">
                    <FaFilter size={10} className="sv-stat-pill-ico"/>
                    <span>{categories.length - 1} {categories.length-1===1?"category":"categories"}</span>
                  </div>
                )}
                <div className="sv-stat-pill">
                  <FaRegClock size={10} className="sv-stat-pill-ico"/>
                  <span>
                    {entries.reduce((sum,e)=>{
                      const mins = parseInt((e.article?.readTime||"0").replace(/\D/g,""))||0
                      return sum+mins
                    },0)} min total reading
                  </span>
                </div>
              </div>

              <div className="sv-toolbar" onClick={()=>{ setShowSort(false); setShowCats(false) }}>
                {/* search */}
                <div className="sv-search-wrap">
                  <FaSearch className="sv-search-ico"/>
                  <input className="sv-search" placeholder="Search saved articles…"
                    value={search} onChange={e=>setSearch(e.target.value)}/>
                  {search && <button className="sv-search-x" onClick={e=>{e.stopPropagation();setSearch("")}}><FaTimes/></button>}
                </div>

                {/* category filter */}
                {categories.length > 2 && (
                  <div className="sv-cat-wrap" onClick={e=>e.stopPropagation()}>
                    <button className={`sv-cat-btn ${catFilter!=="All"?"sv-active-filter":""}`}
                      onClick={()=>{ setShowCats(s=>!s); setShowSort(false) }}>
                      <FaFilter size={10}/>
                      {catFilter==="All"?"Category":catFilter}
                      <FaChevronDown size={9}/>
                    </button>
                    {showCats && (
                      <div className="sv-cat-drop">
                        {categories.map(c=>(
                          <button key={c} className={`sv-cat-opt ${catFilter===c?"sv-cat-active":""}`}
                            onClick={()=>{ setCatFilter(c); setShowCats(false) }}>
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* sort */}
                <div className="sv-sort-wrap" onClick={e=>e.stopPropagation()}>
                  <button className="sv-sort-btn" onClick={()=>{ setShowSort(s=>!s); setShowCats(false) }}>
                    <FaSortAmountDown size={10}/>
                    {SORT_OPTS.find(s=>s.val===sort)?.label}
                    <FaChevronDown size={9}/>
                  </button>
                  {showSort && (
                    <div className="sv-sort-drop">
                      {SORT_OPTS.map(o=>(
                        <button key={o.val} className={`sv-sort-opt ${sort===o.val?"sv-sort-active":""}`}
                          onClick={()=>{ setSort(o.val); setShowSort(false) }}>
                          {o.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* layout */}
                <div className="sv-layout-btns">
                  <button className={`sv-layout-btn ${layout==="grid"?"sv-la":""}`}
                    onClick={()=>setLayout("grid")}>⊞</button>
                  <button className={`sv-layout-btn ${layout==="list"?"sv-la":""}`}
                    onClick={()=>setLayout("list")}>≡</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── MAIN ── */}
      <div className="sv-main" onClick={()=>{ setShowSort(false); setShowCats(false) }}>

        {/* not logged in */}
        {!user && !loading && (
          <EmptyState isSearch={false} isNotLoggedIn={true} onLoginClick={()=>setShowLogin(true)}/>
        )}

        {/* loading skeleton */}
        {loading && (
          <div className="sv-skel-grid">
            {[...Array(6)].map((_,i)=>(
              <div key={i} className="sv-sk">
                <div className="sv-sk-img"/>
                <div className="sv-sk-body">
                  <div className="sv-sk-l" style={{height:8,width:"32%",marginBottom:10}}/>
                  <div className="sv-sk-l" style={{height:14,width:"90%",marginBottom:8}}/>
                  <div className="sv-sk-l" style={{height:14,width:"72%",marginBottom:14}}/>
                  <div className="sv-sk-l" style={{height:10,width:"48%"}}/>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* loaded */}
        {!loading && user && (
          <>
            {filtered.length > 0 && (
              <p className="sv-result-count">
                <strong>{filtered.length}</strong> {filtered.length===1?"article":"articles"}
                {catFilter!=="All" && ` in ${catFilter}`}
                {search && ` matching "${search}"`}
              </p>
            )}

            {filtered.length === 0 ? (
              <EmptyState isSearch={!!search||catFilter!=="All"} isNotLoggedIn={false} onLoginClick={()=>{}}/>
            ) : (
              <div className={layout==="grid" ? "sv-grid" : "sv-list-view"}>
                {filtered.map((entry,i)=>(
                  <SavedCard
                    key={entry.article_slug}
                    entry={entry}
                    idx={i}
                    liked={likedIds.has(entry.article_slug)}
                    onUnsave={()=>unsave(entry.article_slug)}
                    onLike={()=>toggleLike(entry.article_slug)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* login modal (simple) */}
      {showLogin && (
        <div style={{position:"fixed",inset:0,zIndex:500,background:"rgba(26,16,8,.6)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}
          onClick={()=>setShowLogin(false)}>
          <div style={{background:"var(--card)",borderRadius:20,padding:36,maxWidth:380,width:"100%",border:"1.5px solid var(--border)",boxShadow:"0 32px 80px rgba(26,16,8,.2)",animation:"sv-scale .22s ease"}}
            onClick={e=>e.stopPropagation()}>
            <h2 style={{fontFamily:"var(--body)",fontSize:22,fontWeight:700,marginBottom:8}}>Sign in</h2>
            <p style={{fontSize:13,color:"var(--muted)",marginBottom:24,lineHeight:1.65}}>Sign in with your email to access saved articles and sync across devices.</p>
            <LoginForm onClose={()=>setShowLogin(false)}/>
          </div>
        </div>
      )}
    </main>
  )
}

/* ── inline mini login form ── */
function LoginForm({ onClose }: { onClose: ()=>void }) {
  const [email,  setEmail]  = useState("")
  const [step,   setStep]   = useState<"email"|"otp"|"done">("email")
  const [otp,    setOtp]    = useState("")
  const [loading,setLoading]= useState(false)
  const [err,    setErr]    = useState("")

  async function sendOtp() {
    if (!email.trim()) return setErr("Enter a valid email.")
    setLoading(true); setErr("")
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim(), options:{ shouldCreateUser:true } })
    setLoading(false)
    if (error) setErr(error.message); else setStep("otp")
  }

  async function verifyOtp() {
    if (!otp.trim()) return setErr("Enter the code from your email.")
    setLoading(true); setErr("")
    const { error } = await supabase.auth.verifyOtp({ email: email.trim(), token: otp.trim(), type:"email" })
    setLoading(false)
    if (error) setErr(error.message); else { setStep("done"); setTimeout(onClose, 1200) }
  }

  if (step==="done") return (
    <div style={{textAlign:"center",padding:"20px 0"}}>
      <div style={{fontSize:36,marginBottom:12}}>✓</div>
      <p style={{fontWeight:700,color:"var(--text)"}}>Signed in!</p>
    </div>
  )

  return (
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {step==="email" ? <>
        <input style={{background:"var(--bg)",border:"1.5px solid var(--border)",borderRadius:9,padding:"11px 14px",fontFamily:"var(--sans)",fontSize:13,color:"var(--text)",outline:"none"}}
          type="email" placeholder="your@email.com" value={email}
          onChange={e=>setEmail(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&sendOtp()}/>
        {err && <p style={{fontSize:12,color:"#c8320a"}}>{err}</p>}
        <button disabled={loading}
          style={{background:"linear-gradient(135deg,var(--o),#8a2e06)",color:"#fff",border:"none",borderRadius:10,padding:"12px",fontSize:13,fontWeight:700,cursor:"pointer",opacity:loading?.6:1}}
          onClick={sendOtp}>{loading?"Sending…":"Send Magic Link"}</button>
      </> : <>
        <p style={{fontSize:13,color:"var(--muted)"}}>Check your inbox for a 6-digit code.</p>
        <input style={{background:"var(--bg)",border:"1.5px solid var(--border)",borderRadius:9,padding:"11px 14px",fontFamily:"var(--sans)",fontSize:20,fontWeight:700,letterSpacing:"0.3em",color:"var(--text)",outline:"none",textAlign:"center"}}
          type="text" placeholder="000000" maxLength={6} value={otp}
          onChange={e=>setOtp(e.target.value.replace(/\D/g,""))}
          onKeyDown={e=>e.key==="Enter"&&verifyOtp()}/>
        {err && <p style={{fontSize:12,color:"#c8320a"}}>{err}</p>}
        <button disabled={loading}
          style={{background:"linear-gradient(135deg,var(--o),#8a2e06)",color:"#fff",border:"none",borderRadius:10,padding:"12px",fontSize:13,fontWeight:700,cursor:"pointer",opacity:loading?.6:1}}
          onClick={verifyOtp}>{loading?"Verifying…":"Verify Code"}</button>
        <button style={{background:"none",border:"none",fontSize:12,color:"var(--muted)",cursor:"pointer"}} onClick={()=>setStep("email")}>← Use different email</button>
      </>}
    </div>
  )
}