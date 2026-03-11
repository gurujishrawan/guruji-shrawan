"use client"

import Link from "next/link"
import Image from "next/image"
import { Clock, Heart, Bookmark } from "lucide-react"
import { useState } from "react"
import ShareButton from "../Sharebutton"

export default function TrendingCard({ article, s, rank }) {
  const img = article.featuredImage || "/images/default.jpg"
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(article.likes || 0)
  const [saved, setSaved] = useState(false)

  function toggleLike() {
    setLiked(prev => { setLikeCount(c => prev ? c - 1 : c + 1); return !prev })
  }

  return (
    <article className={`group flex gap-4 items-start border-b pb-5 ${s.magCard}`} style={{ borderColor: "#ede5da" }}>
      {/* Rank number */}
      {rank != null && (
        <span className={s.rankNum}>{String(rank).padStart(2, "0")}</span>
      )}

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <span className={`${s.categoryBadge} mb-2`} style={{ display: "inline-block" }}>{article.category}</span>

        <Link href={`/articles/${article.slug}`}>
          <h3
            className={`${s.fontDisplay} text-[15px] font-bold leading-snug transition line-clamp-2`}
            style={{ color: "#1a1008" }}
            onMouseEnter={e => e.currentTarget.style.color = "#d4621a"}
            onMouseLeave={e => e.currentTarget.style.color = "#1a1008"}
          >
            {article.title}
          </h3>
        </Link>

        <div className={`${s.fontBody} flex items-center gap-3 mt-1.5 text-[11px]`} style={{ color: "#b0a090" }}>
          {article.readTime && <span className="flex items-center gap-1"><Clock size={10} />{article.readTime}</span>}
          <span className="flex items-center gap-1"><Heart size={10} />{likeCount}</span>
        </div>

        <p className={`${s.fontBody} text-[13px] leading-[1.7] mt-1.5 line-clamp-2`} style={{ color: "#7a6a5a" }}>
          {article.excerpt}
        </p>

        {/* Action row */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <button
            onClick={toggleLike}
            className={`${s.btnOutline} text-[11px] py-1 px-2.5 ${liked ? s.btnOutlineLiked : ""}`}
          >
            <Heart size={11} fill={liked ? "currentColor" : "none"} />
            {liked ? "Liked" : "Like"}
          </button>
          <button
            onClick={() => setSaved(!saved)}
            className={`${s.btnOutline} text-[11px] py-1 px-2.5 ${saved ? s.active : ""}`}
          >
            <Bookmark size={11} fill={saved ? "currentColor" : "none"} />
            {saved ? "Saved" : "Save"}
          </button>
          <ShareButton article={article} s={s} variant="icon" position="below" />
        </div>
      </div>

      {/* Thumbnail */}
      <Link href={`/articles/${article.slug}`} className="relative w-[88px] h-[88px] rounded-xl overflow-hidden shrink-0 block">
        <Image src={img} fill alt={article.title} className={`object-cover ${s.imgZoomInner}`} />
      </Link>
    </article>
  )
}