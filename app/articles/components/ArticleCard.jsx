"use client"

import Link from "next/link"
import Image from "next/image"
import { Clock, Eye, Heart, Bookmark, MessageCircle } from "lucide-react"
import { useState, useEffect } from "react"
import ShareButton from "../Sharebutton"
import { supabase } from "../../lib/supabaseClient"

/* ─── tiny helper ─── */
function fmtN(n) {
  if (n == null) return "0"
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

export default function ArticleCard({ article, s, user, onLoginRequired }) {
  const [liked,     setLiked]     = useState(false)
  const [likeCount, setLikeCount] = useState(article.likes ?? 0)
  const [saved,     setSaved]     = useState(false)
  const [viewCount, setViewCount] = useState(article.views ?? 0)
  const [authReady, setAuthReady] = useState(false)

  /* ── load live counts + user state once auth is ready ── */
  useEffect(() => {
    if (user === undefined) return   // still loading
    setAuthReady(true)

    async function load() {
      // real view count
      const { count: vc } = await supabase
        .from("article_views")
        .select("*", { count: "exact", head: true })
        .eq("article_slug", article.slug)
      if (vc != null) setViewCount(vc)

      // real like count
      const { count: lc } = await supabase
        .from("article_likes")
        .select("*", { count: "exact", head: true })
        .eq("article_slug", article.slug)
      if (lc != null) setLikeCount(lc)

      // user-specific state
      if (user) {
        const { data: lr } = await supabase
          .from("article_likes")
          .select("id")
          .eq("article_slug", article.slug)
          .eq("user_id", user.id)
          .maybeSingle()
        setLiked(!!lr)

        const { data: sr } = await supabase
          .from("article_saves")
          .select("id")
          .eq("article_slug", article.slug)
          .eq("user_id", user.id)
          .maybeSingle()
        setSaved(!!sr)
      }
    }
    load()
  }, [article.slug, user])

  /* ── realtime like count ── */
  useEffect(() => {
    const ch = supabase
      .channel(`card-likes:${article.slug}`)
      .on("postgres_changes", {
        event: "*", schema: "public",
        table: "article_likes",
        filter: `article_slug=eq.${article.slug}`,
      }, async () => {
        const { count } = await supabase
          .from("article_likes")
          .select("*", { count: "exact", head: true })
          .eq("article_slug", article.slug)
        if (count != null) setLikeCount(count)
      })
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [article.slug])

  /* ── realtime view count ── */
  useEffect(() => {
    const ch = supabase
      .channel(`card-views:${article.slug}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public",
        table: "article_views",
        filter: `article_slug=eq.${article.slug}`,
      }, () => setViewCount(c => c + 1))
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [article.slug])

  async function handleLike(e) {
    e.preventDefault()
    if (!user) { onLoginRequired?.("like"); return }
    const next = !liked
    setLiked(next)
    setLikeCount(c => next ? c + 1 : c - 1)
    if (next) await supabase.from("article_likes").insert({ article_slug: article.slug, user_id: user.id })
    else      await supabase.from("article_likes").delete().eq("article_slug", article.slug).eq("user_id", user.id)
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!user) { onLoginRequired?.("save"); return }
    const next = !saved
    setSaved(next)
    if (next) await supabase.from("article_saves").insert({ article_slug: article.slug, user_id: user.id })
    else      await supabase.from("article_saves").delete().eq("article_slug", article.slug).eq("user_id", user.id)
  }

  const img = article.featuredImage || "/images/default.jpg"
  const tags = article.tags
    ? (Array.isArray(article.tags) ? article.tags : article.tags.split(",").map(t => t.trim()))
    : []

  return (
    <article
      className={`group grid md:grid-cols-[1fr_210px] gap-6 items-start border-b pb-8 ${s.magCard}`}
      style={{ borderColor: "#ede5da" }}
    >
      <div className="min-w-0">
        {/* category + read time */}
        <div className="flex items-center gap-3 mb-2">
          <span className={s.categoryBadge}>{article.category}</span>
          {article.readTime && (
            <span className={`${s.fontBody} flex items-center gap-1 text-[12px]`} style={{ color: "#b0a090" }}>
              <Clock size={11} />{article.readTime}
            </span>
          )}
        </div>

        {/* title */}
        <Link href={`/articles/${article.slug}`}>
          <h3
            className={`${s.fontDisplay} text-[19px] sm:text-[21px] font-bold leading-snug transition-colors duration-200`}
            style={{ color: "#1a1008" }}
            onMouseEnter={e => e.currentTarget.style.color = "#d4621a"}
            onMouseLeave={e => e.currentTarget.style.color = "#1a1008"}
          >
            {article.title}
          </h3>
        </Link>

        {/* excerpt */}
        <p className={`${s.fontBody} text-[14px] mt-2 mb-3 leading-relaxed line-clamp-2`} style={{ color: "#7a6a5a" }}>
          {article.excerpt}
        </p>

        {/* live stats */}
        <div className={`${s.fontBody} flex items-center gap-3 text-[12px] mb-4`} style={{ color: "#b0a090" }}>
          <span className="flex items-center gap-1">
            <Eye size={11} />{fmtN(viewCount)} views
          </span>
          <span className="flex items-center gap-1" style={{ color: liked ? "#ef4444" : "#b0a090" }}>
            <Heart size={11} fill={liked ? "currentColor" : "none"}/>{fmtN(likeCount)}
          </span>
        </div>

        {/* tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 3).map(tag => (
              <Link
                key={tag}
                href={`/articles?topic=${encodeURIComponent(tag.toLowerCase())}`}
                className={s.tagPill}
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* action row */}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <button
            onClick={handleLike}
            className={`${s.btnOutline} ${liked ? s.btnOutlineLiked : ""}`}
          >
            <Heart size={13} fill={liked ? "currentColor" : "none"} />
            {liked ? `Liked · ${fmtN(likeCount)}` : "Like"}
          </button>

          <button
            onClick={handleSave}
            className={`${s.btnOutline} ${saved ? s.active : ""}`}
          >
            <Bookmark size={13} fill={saved ? "currentColor" : "none"} />
            {saved ? "Saved" : "Save"}
          </button>

          <Link href={`/articles/${article.slug}`} className={`${s.btnBrand} text-[12px] px-4 py-[7px]`}>
            Read →
          </Link>

          <div className="ml-auto">
            <ShareButton article={article} s={s} variant="icon" />
          </div>
        </div>
      </div>

      {/* image — save button overlay */}
      <Link
        href={`/articles/${article.slug}`}
        className="relative h-[170px] md:h-[155px] rounded-xl overflow-hidden block shrink-0"
      >
        <Image src={img} fill alt={article.title} className={`object-cover ${s.imgZoomInner}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
        {/* save overlay button */}
        <button
          onClick={handleSave}
          className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{
            background: saved ? `rgba(200,85,26,0.88)` : "rgba(0,0,0,0.35)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.18)",
            color: "#fff",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(200,85,26,0.90)"}
          onMouseLeave={e => e.currentTarget.style.background = saved ? "rgba(200,85,26,0.88)" : "rgba(0,0,0,0.35)"}
        >
          <Bookmark size={13} fill={saved ? "currentColor" : "none"} />
        </button>
      </Link>
    </article>
  )
}