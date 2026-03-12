"use client"

import TopicNav from "./components/TopicNav"
import TrendingSection from "./components/TrendingSection"
import ArticleCard from "./components/ArticleCard"
import Sidebar from "./components/Sidebar"
import ShareButton from "./Sharebutton"
import LoginModal from "./components/Loginmodal"
import Link from "next/link"
import Image from "next/image"
import {
  Clock, Eye, Heart, Bookmark, ChevronRight,
  SortAsc, Loader2, Check, LogOut, User,
} from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"
import { getArticles } from "./data"
import s from "./articles.module.css"
import { supabase } from "../lib/supabaseClient"

/* ─── helpers ─── */
const ARTICLES_PER_PAGE = 6
const SORT_OPTIONS = ["Latest", "Most Read", "Most Liked"]
const fmtN = (n) => (n == null ? "0" : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n))

/* ─── mini user badge shown when logged in ─── */
function UserBadge({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const photo = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null
  const name  = user?.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "Me"
  const COLS  = ["#c8551a","#7c3aed","#0891b2","#16a34a","#b8841a","#e11d48"]
  let h = 0
  for (let i = 0; i < (user?.id||"").length; i++) h = (user?.id||"").charCodeAt(i)+((h<<5)-h)
  const bg = COLS[Math.abs(h)%COLS.length]

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", fn)
    return () => document.removeEventListener("mousedown", fn)
  }, [])

  return (
    <div ref={ref} style={{ position:"relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display:"flex", alignItems:"center", gap:8, padding:"4px 10px 4px 4px",
          borderRadius:99, border:"1.5px solid #e8ddd0", background:"transparent",
          cursor:"pointer", transition:"all .15s", fontFamily:"'Poppins',sans-serif" }}
        onMouseEnter={e => e.currentTarget.style.borderColor="#d4621a"}
        onMouseLeave={e => { if (!open) e.currentTarget.style.borderColor="#e8ddd0" }}
      >
        {photo ? (
          <div style={{ width:28, height:28, borderRadius:"50%", overflow:"hidden", flexShrink:0 }}>
            <Image src={photo} width={28} height={28} alt={name}
              style={{ objectFit:"cover", width:"100%", height:"100%" }}
              referrerPolicy="no-referrer" unoptimized/>
          </div>
        ) : (
          <div style={{ width:28, height:28, borderRadius:"50%", background:bg, flexShrink:0,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontFamily:"'Poppins',sans-serif", fontSize:11, fontWeight:700, color:"#fff" }}>
            {name[0].toUpperCase()}
          </div>
        )}
        <span style={{ fontFamily:"'Poppins',sans-serif", fontSize:12.5, fontWeight:600, color:"#1a1008" }}>
          {name}
        </span>
        <ChevronRight size={11} style={{ color:"#8a7a6a", transform: open ? "rotate(90deg)" : "none", transition:"transform .2s" }}/>
      </button>

      {open && (
        <div style={{ position:"absolute", right:0, top:"calc(100% + 8px)", width:180,
          background:"#fff", border:"1.5px solid #e8ddd0", borderRadius:13,
          boxShadow:"0 8px 28px rgba(180,80,20,0.13)", overflow:"hidden", zIndex:700,
          animation:"aFadeUp .15s ease-out" }}>
          <Link href="/dashboard"
            style={{ display:"flex", alignItems:"center", gap:9, padding:"10px 16px",
              fontFamily:"'Poppins',sans-serif", fontSize:13, fontWeight:500, color:"#3a2a1a",
              textDecoration:"none", transition:"background .12s" }}
            onMouseEnter={e => e.currentTarget.style.background="#fff8f3"}
            onMouseLeave={e => e.currentTarget.style.background="transparent"}
            onClick={() => setOpen(false)}>
            <User size={14} style={{ color:"#8a7a6a" }}/> Dashboard
          </Link>
          <div style={{ height:1, background:"#f0e8de" }}/>
          <button onClick={() => { setOpen(false); onLogout() }}
            style={{ display:"flex", alignItems:"center", gap:9, padding:"10px 16px", width:"100%",
              fontFamily:"'Poppins',sans-serif", fontSize:13, fontWeight:500, color:"#dc2626",
              border:"none", background:"none", cursor:"pointer", transition:"background .12s" }}
            onMouseEnter={e => e.currentTarget.style.background="#fef2f2"}
            onMouseLeave={e => e.currentTarget.style.background="transparent"}>
            <LogOut size={14}/> Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   FEATURED HERO — fully wired to Supabase
───────────────────────────────────────────────────────────── */
function FeaturedHero({ article, s, user, onLoginRequired }) {
  const [liked,     setLiked]     = useState(false)
  const [likeCount, setLikeCount] = useState(article.likes ?? 0)
  const [saved,     setSaved]     = useState(false)
  const [viewCount, setViewCount] = useState(article.views ?? 0)

  /* load live counts + user state */
  useEffect(() => {
    if (user === undefined) return
    async function load() {
      const { count: vc } = await supabase
        .from("article_views").select("*", { count:"exact", head:true })
        .eq("article_slug", article.slug)
      if (vc != null) setViewCount(vc)

      const { count: lc } = await supabase
        .from("article_likes").select("*", { count:"exact", head:true })
        .eq("article_slug", article.slug)
      if (lc != null) setLikeCount(lc)

      if (user) {
        const { data: lr } = await supabase.from("article_likes").select("id")
          .eq("article_slug", article.slug).eq("user_id", user.id).maybeSingle()
        setLiked(!!lr)
        const { data: sr } = await supabase.from("article_saves").select("id")
          .eq("article_slug", article.slug).eq("user_id", user.id).maybeSingle()
        setSaved(!!sr)
      } else { setLiked(false); setSaved(false) }
    }
    load()
  }, [article.slug, user])

  /* realtime like count */
  useEffect(() => {
    const ch = supabase.channel(`hero-likes:${article.slug}`)
      .on("postgres_changes", { event:"*", schema:"public", table:"article_likes",
        filter:`article_slug=eq.${article.slug}` },
        async () => {
          const { count } = await supabase.from("article_likes")
            .select("*", { count:"exact", head:true }).eq("article_slug", article.slug)
          if (count != null) setLikeCount(count)
        })
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [article.slug])

  /* realtime view count */
  useEffect(() => {
    const ch = supabase.channel(`hero-views:${article.slug}`)
      .on("postgres_changes", { event:"INSERT", schema:"public", table:"article_views",
        filter:`article_slug=eq.${article.slug}` },
        () => setViewCount(c => c + 1))
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [article.slug])

  async function handleLike(e) {
    e?.preventDefault()
    if (!user) { onLoginRequired("like"); return }
    const next = !liked; setLiked(next); setLikeCount(c => next ? c+1 : c-1)
    if (next) await supabase.from("article_likes").insert({ article_slug:article.slug, user_id:user.id })
    else      await supabase.from("article_likes").delete().eq("article_slug",article.slug).eq("user_id",user.id)
  }

  async function handleSave(e) {
    e?.preventDefault()
    if (!user) { onLoginRequired("save"); return }
    const next = !saved; setSaved(next)
    if (next) await supabase.from("article_saves").insert({ article_slug:article.slug, user_id:user.id })
    else      await supabase.from("article_saves").delete().eq("article_slug",article.slug).eq("user_id",user.id)
  }

  const tags = article.tags
    ? (Array.isArray(article.tags) ? article.tags : article.tags.split(",").map(t => t.trim()))
    : []

  return (
    <section
      className={`grid md:grid-cols-[1fr_1fr] gap-8 items-start pb-10 mb-10 ${s.fadeUp}`}
      style={{ borderBottom: "1px solid #ede5da" }}
    >
      <div>
        <span className={`${s.categoryBadge} mb-3`} style={{ display:"inline-block" }}>
          {article.category}
        </span>

        <Link href={`/articles/${article.slug}`}>
          <h2
            className={`${s.fontDisplay} text-[24px] sm:text-[28px] font-bold leading-tight mt-1 transition-colors`}
            style={{ color:"#1a1008" }}
            onMouseEnter={e => e.currentTarget.style.color="#d4621a"}
            onMouseLeave={e => e.currentTarget.style.color="#1a1008"}
          >
            {article.title}
          </h2>
        </Link>

        {/* live meta */}
        <div className={`${s.fontBody} flex flex-wrap items-center gap-4 mt-2 text-[12px]`} style={{ color:"#b0a090" }}>
          {article.readTime && (
            <span className="flex items-center gap-1"><Clock size={12}/>{article.readTime}</span>
          )}
          <span className="flex items-center gap-1">
            <Eye size={12}/>{fmtN(viewCount)} views
          </span>
          <span className="flex items-center gap-1" style={{ color: liked ? "#ef4444" : "#b0a090" }}>
            <Heart size={12} fill={liked ? "currentColor" : "none"}/>{fmtN(likeCount)} likes
          </span>
        </div>

        <p className={`${s.fontBody} text-[14px] leading-[1.8] mt-3`} style={{ color:"#5a4a3a" }}>
          {article.excerpt}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {tags.slice(0, 4).map(tag => (
              <Link key={tag} href={`/articles?topic=${encodeURIComponent(tag.toLowerCase())}`} className={s.tagPill}>
                {tag}
              </Link>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 mt-5">
          <Link href={`/articles/${article.slug}`} className={`${s.btnBrand} text-[13px]`}>
            Read Article <ChevronRight size={14}/>
          </Link>
          <button
            onClick={handleLike}
            className={`${s.btnOutline} ${liked ? s.btnOutlineLiked : ""}`}
          >
            <Heart size={13} fill={liked ? "currentColor" : "none"}/>
            {liked ? `Liked · ${fmtN(likeCount)}` : "Like"}
          </button>
          <button
            onClick={handleSave}
            className={`${s.btnOutline} ${saved ? s.active : ""}`}
          >
            <Bookmark size={13} fill={saved ? "currentColor" : "none"}/>
            {saved ? "Saved" : "Save"}
          </button>
          <div className="ml-auto">
            <ShareButton article={article} s={s} variant="icon" position="below"/>
          </div>
        </div>
      </div>

      {/* image with save overlay */}
      <Link
        href={`/articles/${article.slug}`}
        className="relative h-[240px] sm:h-[290px] rounded-2xl overflow-hidden shadow-md block"
      >
        <Image
          src={article.featuredImage || "/images/default.jpg"}
          fill alt={article.title}
          className={`object-cover ${s.imgZoomInner}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent pointer-events-none"/>
        <span
          className="absolute bottom-3 left-3 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full"
          style={{ background:"rgba(0,0,0,0.45)", fontFamily:"'Poppins',system-ui,sans-serif" }}
        >
          Featured
        </span>
        {/* save overlay */}
        <button
          onClick={handleSave}
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all"
          style={{
            background: saved ? "rgba(200,85,26,0.88)" : "rgba(0,0,0,0.38)",
            backdropFilter:"blur(8px)",
            border:"1px solid rgba(255,255,255,0.20)",
            color:"#fff",
          }}
        >
          <Bookmark size={15} fill={saved ? "currentColor" : "none"}/>
        </button>
      </Link>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
export default function ArticlesPage() {
  const allArticles = getArticles()
  const [visibleCount, setVisibleCount] = useState(ARTICLES_PER_PAGE)
  const featured    = allArticles[0]
  const trending    = allArticles.slice(1, 7)
  const feed        = allArticles.slice(3)

  /* ── auth state ── */
  const [user,       setUser]       = useState(undefined) // undefined = loading, null = logged out
  const [loginModal, setLoginModal] = useState(null)      // "like" | "save" | null

  /* ── UI state ── */
  const [sort,          setSort]          = useState("Latest")
  const [readProgress,  setReadProgress]  = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [mounted,       setMounted]       = useState(false)

  /* ── auth bootstrap — subscribe so it stays in sync with navbar ── */
  useEffect(() => {
    setMounted(true)
    supabase.auth.getSession().then(({ data: { session } }) =>
      setUser(session?.user ?? null)
    )
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) =>
      setUser(session?.user ?? null)
    )
    return () => subscription.unsubscribe()
  }, [])

  /* ── scroll effects ── */
  useEffect(() => {
    const fn = () => {
      const h = document.body.scrollHeight - window.innerHeight
      setReadProgress(h > 0 ? Math.min((window.scrollY / h) * 100, 100) : 0)
      setShowBackToTop(window.scrollY > 600)
    }
    window.addEventListener("scroll", fn, { passive:true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const requireLogin  = useCallback((reason) => setLoginModal(reason), [])
  const handleSuccess = useCallback((u) => { setUser(u); setLoginModal(null) }, [])
  const handleLogout  = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
  }, [])

  /* ── sorted feed ── */
  const sortedFeed = [...feed].sort((a, b) => {
    if (sort === "Most Read")  return (b.views  ?? 0) - (a.views  ?? 0)
    if (sort === "Most Liked") return (b.likes  ?? 0) - (a.likes  ?? 0)
    return new Date(b.publishedAt ?? 0) - new Date(a.publishedAt ?? 0)
  })

  return (
    <div className={s.articlesRoot}>
      {/* reading progress */}
      <div className={s.progressBar} style={{ width:`${readProgress}%` }}/>

      {/* login modal */}
      {loginModal && (
        <LoginModal
          reason={loginModal}
          onClose={() => setLoginModal(null)}
          onSuccess={handleSuccess}
        />
      )}

      <TopicNav s={s}/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── PAGE HEADER ── */}
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <span className={s.accentBar}/>
            <h2
              className={`${s.fontBody} text-[12px] uppercase tracking-[0.18em] font-bold`}
              style={{ color:"#1a1008" }}
            >
              For You
            </h2>
          </div>

          {/* Auth state badge */}
          <div className="flex items-center gap-3">
            {user === undefined ? (
              <div style={{ width:28, height:28, borderRadius:"50%", background:"#f0e8de",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Loader2 size={13} style={{ color:"#8a7a6a", animation:"spin 1s linear infinite" }}/>
              </div>
            ) : user ? (
              <UserBadge user={user} onLogout={handleLogout}/>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => requireLogin("default")}
                  style={{ padding:"6px 14px", borderRadius:8, border:"1.5px solid #d4621a",
                    background:"transparent", fontFamily:"'Poppins',sans-serif", fontSize:12,
                    fontWeight:600, color:"#d4621a", cursor:"pointer", transition:"all .15s" }}
                  onMouseEnter={e => e.currentTarget.style.background="#fff0e6"}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}
                >
                  Sign In
                </button>
                <button
                  onClick={() => requireLogin("default")}
                  style={{ padding:"6px 14px", borderRadius:8, border:"none",
                    background:"linear-gradient(135deg,#d4621a,#c8521a)",
                    fontFamily:"'Poppins',sans-serif", fontSize:12,
                    fontWeight:700, color:"#fff", cursor:"pointer",
                    boxShadow:"0 2px 10px rgba(212,98,26,0.28)" }}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-10 lg:gap-14">
          <div>

            {/* Featured hero */}
            <FeaturedHero
              article={featured}
              s={s}
              user={user}
              onLoginRequired={requireLogin}
            />

            {/* Trending */}
            <TrendingSection articles={trending} s={s}/>

            {/* Latest articles */}
            <section className="mt-10 pt-10 space-y-9" style={{ borderTop:"1px solid #ede5da" }}>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <span className={s.accentBar}/>
                  <h2 className={`${s.fontBody} text-[12px] uppercase tracking-[0.18em] font-bold`} style={{ color:"#1a1008" }}>
                    Latest Articles
                  </h2>
                  {/* live indicator */}
                  <div className="flex items-center gap-1.5">
                    <span className={s.pulseDot}/>
                    <span style={{ fontFamily:"'Poppins',sans-serif", fontSize:10,
                      fontWeight:600, color:"#ef4444", textTransform:"uppercase",
                      letterSpacing:"0.10em" }}>Live</span>
                  </div>
                </div>

                {/* sort */}
                <div className="flex items-center gap-1.5 rounded-xl p-1" style={{ background:"#f5f0ea" }}>
                  <SortAsc size={13} style={{ color:"#b0a090", marginLeft:6 }}/>
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setSort(opt)}
                      className={`${s.fontBody} text-[11px] font-semibold px-3 py-1.5 rounded-lg transition`}
                      style={{
                        background: sort===opt ? "#fff" : "transparent",
                        color: sort===opt ? "#d4621a" : "#9a8a7a",
                        boxShadow: sort===opt ? "0 1px 4px rgba(180,80,20,0.10)" : "none",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* article cards — pass user + requireLogin down */}
           {sortedFeed.slice(0, visibleCount).map((article, i) => (
                <div key={article.slug} className={s.fadeUp} style={{ animationDelay:`${i*0.05}s` }}>
                  <ArticleCard
                    article={article}
                    s={s}
                    user={user}
                    onLoginRequired={requireLogin}
                  />
                </div>
              ))}

              {/* load more */}
       <div className="text-center pt-4">
  {visibleCount < sortedFeed.length && (
    <button
      onClick={() => setVisibleCount(v => v + ARTICLES_PER_PAGE)}
      className={`${s.btnBrand} inline-flex text-[13px] px-8 py-3`}
    >
      Load More Articles
    </button>
  )}
</div>
            </section>
          </div>

          {/* sidebar */}
          <div className="hidden lg:block">
            <Sidebar s={s}/>
          </div>
        </div>
      </div>

      {/* back to top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top:0, behavior:"smooth" })}
          className={`${s.fontBody} fixed bottom-6 right-6 z-50 w-11 h-11 flex items-center justify-center rounded-full text-white text-[18px] font-bold transition hover:scale-110`}
          style={{
            background:"linear-gradient(135deg,#d4621a,#c8521a)",
            boxShadow:"0 4px 16px rgba(212,98,26,0.40)",
            animation:"articleFadeUp 0.2s ease-out both",
          }}
          title="Back to top"
        >
          ↑
        </button>
      )}

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg) } }
        @keyframes aFadeUp { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  )
}