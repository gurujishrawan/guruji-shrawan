"use client"

import Link from "next/link"
import Image from "next/image"
import { Clock, BarChart2, Heart, Bookmark } from "lucide-react"
import { useState } from "react"
import ShareButton from "../Sharebutton"

export default function ArticleCard({ article, s }) {
  const img = article.featuredImage || "/images/default.jpg"
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(article.likes || 0)
  const [saved, setSaved] = useState(false)

  function toggleLike() {
    setLiked((prev) => {
      setLikeCount((c) => prev ? c - 1 : c + 1)
      return !prev
    })
  }

  return (
    <article className={`group grid md:grid-cols-[1fr_210px] gap-6 items-start border-b pb-8 ${s.magCard}`} style={{ borderColor: "#ede5da" }}>
      <div className="min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <span className={s.categoryBadge}>{article.category}</span>
          {article.readTime && (
            <span className={`${s.fontBody} flex items-center gap-1 text-[12px]`} style={{ color: "#b0a090" }}>
              <Clock size={11} />{article.readTime}
            </span>
          )}
        </div>

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

        <p className={`${s.fontBody} text-[14px] mt-2 mb-3 leading-relaxed line-clamp-2`} style={{ color: "#7a6a5a" }}>
          {article.excerpt}
        </p>

        {/* Meta */}
        <div className={`${s.fontBody} flex items-center gap-3 text-[12px] mb-4`} style={{ color: "#b0a090" }}>
          {article.views != null && (
            <span className="flex items-center gap-1"><BarChart2 size={11} />{(article.views / 1000).toFixed(1)}k views</span>
          )}
          <span className="flex items-center gap-1"><Heart size={11} />{likeCount}</span>
        </div>

        {/* Tags */}
        {article.tags && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(Array.isArray(article.tags) ? article.tags : article.tags.split(","))
              .slice(0, 3).map((tag) => (
                <Link
                  key={tag}
                  href={`/articles?topic=${encodeURIComponent(tag.trim().toLowerCase())}`}
                  className={s.tagPill}
                >
                  {tag.trim()}
                </Link>
              ))}
          </div>
        )}

        {/* Action row */}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <button
            onClick={toggleLike}
            className={`${s.btnOutline} ${liked ? s.btnOutlineLiked : ""}`}
          >
            <Heart size={13} fill={liked ? "currentColor" : "none"} />
            {liked ? `Liked · ${likeCount}` : "Like"}
          </button>
          <button
            onClick={() => setSaved(!saved)}
            className={`${s.btnOutline} ${saved ? s.active : ""}`}
          >
            <Bookmark size={13} fill={saved ? "currentColor" : "none"} />
            {saved ? "Saved" : "Save"}
          </button>
          <Link
            href={`/articles/${article.slug}`}
            className={`${s.btnBrand} text-[12px] px-4 py-[7px]`}
          >
            Read →
          </Link>
          <div className="ml-auto">
            <ShareButton article={article} s={s} variant="icon" />
          </div>
        </div>
      </div>

      {/* Image */}
      <Link href={`/articles/${article.slug}`} className="relative h-[170px] md:h-[155px] rounded-xl overflow-hidden block shrink-0">
        <Image src={img} fill alt={article.title} className={`object-cover ${s.imgZoomInner}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
      </Link>
    </article>
  )
}