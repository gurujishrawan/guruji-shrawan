"use client"

import TopicNav from "./components/TopicNav"
import TrendingSection from "./components/TrendingSection"
import ArticleCard from "./components/ArticleCard"
import Sidebar from "./components/Sidebar"
import ShareButton from "./Sharebutton"
import Link from "next/link"
import Image from "next/image"
import { Clock, BarChart2, Heart, Bookmark, ChevronRight, SortAsc } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { getArticles } from "./data"
import s from "./articles.module.css"

const SORT_OPTIONS = ["Latest", "Most Read", "Most Liked"]

export default function ArticlesPage() {
  const articles = getArticles()
  const featured = articles[0]
  const trending = articles.slice(1, 7)   // 4+ so TrendingSection tabs can sort
  const feed = articles.slice(3)

  const [featuredLiked, setFeaturedLiked] = useState(false)
  const [featuredLikeCount, setFeaturedLikeCount] = useState(featured.likes || 0)
  const [featuredSaved, setFeaturedSaved] = useState(false)
  const [sort, setSort] = useState("Latest")
  const [readProgress, setReadProgress] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)

  // Reading progress bar
  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY
      const docHeight = document.body.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setReadProgress(Math.min(progress, 100))
      setShowBackToTop(scrollTop > 600)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  function toggleFeaturedLike() {
    setFeaturedLiked(prev => {
      setFeaturedLikeCount(c => prev ? c - 1 : c + 1)
      return !prev
    })
  }

  // Sorted feed
  const sortedFeed = [...feed].sort((a, b) => {
    if (sort === "Most Read") return (b.views || 0) - (a.views || 0)
    if (sort === "Most Liked") return (b.likes || 0) - (a.likes || 0)
    return new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)
  })

  return (
    <div className={s.articlesRoot}>
      {/* Reading progress */}
      <div className={s.progressBar} style={{ width: `${readProgress}%` }} />

      <TopicNav s={s} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── FOR YOU HEADER ── */}
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-3">
            <span className={s.accentBar} />
            <h2 className={`${s.fontBody} text-[12px] uppercase tracking-[0.18em] font-bold`} style={{ color: "#1a1008" }}>
              For You
            </h2>
          </div>
          <Link
            href="/articles?tab=for-you"
            className={`${s.fontBody} text-[12px] font-semibold transition flex items-center gap-1`}
            style={{ color: "#d4621a" }}
          >
            See All <ChevronRight size={13} />
          </Link>
        </div>

        {/* ── MAIN GRID ── */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-10 lg:gap-14">
          <div>

            {/* ── FEATURED HERO ── */}
            <section
              className={`grid md:grid-cols-[1fr_1fr] gap-8 items-start pb-10 mb-10 ${s.fadeUp}`}
              style={{ borderBottom: "1px solid #ede5da" }}
            >
              <div>
                <span className={`${s.categoryBadge} mb-3`} style={{ display: "inline-block" }}>
                  {featured.category}
                </span>

                <Link href={`/articles/${featured.slug}`}>
                  <h2
                    className={`${s.fontDisplay} text-[24px] sm:text-[28px] font-bold leading-tight mt-1 transition-colors`}
                    style={{ color: "#1a1008" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#d4621a"}
                    onMouseLeave={e => e.currentTarget.style.color = "#1a1008"}
                  >
                    {featured.title}
                  </h2>
                </Link>

                <div className={`${s.fontBody} flex flex-wrap items-center gap-4 mt-2 text-[12px]`} style={{ color: "#b0a090" }}>
                  {featured.readTime && <span className="flex items-center gap-1"><Clock size={12} />{featured.readTime}</span>}
                  {featured.views != null && <span className="flex items-center gap-1"><BarChart2 size={12} />{(featured.views / 1000).toFixed(1)}k views</span>}
                  <span className="flex items-center gap-1"><Heart size={12} />{featuredLikeCount}</span>
                </div>

                <p className={`${s.fontBody} text-[14px] leading-[1.8] mt-3`} style={{ color: "#5a4a3a" }}>
                  {featured.excerpt}
                </p>

                {/* Tags */}
                {featured.tags && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(Array.isArray(featured.tags) ? featured.tags : featured.tags.split(","))
                      .slice(0, 4).map(tag => (
                        <Link key={tag} href={`/articles?topic=${encodeURIComponent(tag.trim().toLowerCase())}`} className={s.tagPill}>
                          {tag.trim()}
                        </Link>
                      ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 mt-5">
                  <Link href={`/articles/${featured.slug}`} className={`${s.btnBrand} text-[13px]`}>
                    Read Article <ChevronRight size={14} />
                  </Link>
                  <button
                    onClick={toggleFeaturedLike}
                    className={`${s.btnOutline} ${featuredLiked ? s.btnOutlineLiked : ""}`}
                  >
                    <Heart size={13} fill={featuredLiked ? "currentColor" : "none"} />
                    {featuredLiked ? `Liked · ${featuredLikeCount}` : "Like"}
                  </button>
                  <button
                    onClick={() => setFeaturedSaved(!featuredSaved)}
                    className={`${s.btnOutline} ${featuredSaved ? s.active : ""}`}
                  >
                    <Bookmark size={13} fill={featuredSaved ? "currentColor" : "none"} />
                    {featuredSaved ? "Saved" : "Save"}
                  </button>
                  <div className="ml-auto">
                    <ShareButton article={featured} s={s} variant="icon" position="below" />
                  </div>
                </div>
              </div>

              <Link href={`/articles/${featured.slug}`} className="relative h-[240px] sm:h-[290px] rounded-2xl overflow-hidden shadow-md block">
                <Image
                  src={featured.featuredImage || "/images/default.jpg"}
                  fill alt={featured.title}
                  className={`object-cover ${s.imgZoomInner}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
                <span
                  className="absolute bottom-3 left-3 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(0,0,0,0.45)", fontFamily: "'Poppins',system-ui,sans-serif" }}
                >
                  Featured
                </span>
              </Link>
            </section>

            {/* ── TRENDING ── */}
            <TrendingSection articles={trending} s={s} />

            {/* ── LATEST ARTICLES ── */}
            <section className="mt-10 pt-10 space-y-9" style={{ borderTop: "1px solid #ede5da" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={s.accentBar} />
                  <h2 className={`${s.fontBody} text-[12px] uppercase tracking-[0.18em] font-bold`} style={{ color: "#1a1008" }}>
                    Latest Articles
                  </h2>
                </div>
                {/* Sort control */}
                <div className="flex items-center gap-1.5 rounded-xl p-1" style={{ background: "#f5f0ea" }}>
                  <SortAsc size={13} style={{ color: "#b0a090", marginLeft: 6 }} />
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSort(opt)}
                      className={`${s.fontBody} text-[11px] font-semibold px-3 py-1.5 rounded-lg transition`}
                      style={{
                        background: sort === opt ? "#fff" : "transparent",
                        color: sort === opt ? "#d4621a" : "#9a8a7a",
                        boxShadow: sort === opt ? "0 1px 4px rgba(180,80,20,0.10)" : "none",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {sortedFeed.map((article, i) => (
                <div
                  key={article.slug}
                  className={s.fadeUp}
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <ArticleCard article={article} s={s} />
                </div>
              ))}

              {/* Load more */}
              <div className="text-center pt-4">
                <Link
                  href="/articles?page=2"
                  className={`${s.btnBrand} inline-flex text-[13px] px-8 py-3`}
                >
                  Load More Articles
                </Link>
              </div>
            </section>
          </div>

          {/* ── SIDEBAR ── */}
          <div className="hidden lg:block">
            <Sidebar s={s} />
          </div>
        </div>
      </div>

      {/* Back to top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`${s.fontBody} fixed bottom-6 right-6 z-50 w-11 h-11 flex items-center justify-center rounded-full text-white text-[18px] font-bold transition hover:scale-110`}
          style={{
            background: "linear-gradient(135deg,#d4621a,#c8521a)",
            boxShadow: "0 4px 16px rgba(212,98,26,0.40)",
            animation: "articleFadeUp 0.2s ease-out both",
          }}
          title="Back to top"
        >
          ↑
        </button>
      )}
    </div>
  )
}