"use client"

import { useState } from "react"
import { TrendingUp, Flame, Clock } from "lucide-react"
import TrendingCard from "./TrendingCard"
import Link from "next/link"

const TABS = [
  { key: "trending", label: "Trending", icon: <TrendingUp size={13} /> },
  { key: "latest", label: "Latest", icon: <Clock size={13} /> },
  { key: "popular", label: "Most Read", icon: <Flame size={13} /> },
]

export default function TrendingSection({ articles, s }) {
  const [activeTab, setActiveTab] = useState("trending")

  // Sort differently per tab
  const sorted = [...articles].sort((a, b) => {
    if (activeTab === "latest") return new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0)
    if (activeTab === "popular") return (b.views || 0) - (a.views || 0)
    return (b.likes || 0) - (a.likes || 0) // trending = most liked
  })

  return (
    <section className="mt-10 pt-10" style={{ borderTop: "1px solid #ede5da" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className={s.accentBar} />
          <div className="flex items-center gap-2">
            <span className={s.pulseDot} />
            <h2 className={`${s.fontBody} text-[12px] uppercase tracking-[0.16em] font-bold`} style={{ color: "#1a1008" }}>
              Trending Now
            </h2>
          </div>
        </div>
        <Link
          href="/articles?sort=trending"
          className={`${s.fontBody} text-[12px] font-semibold transition flex items-center gap-1`}
          style={{ color: "#d4621a" }}
        >
          See All →
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: "#f5f0ea" }}>
        {TABS.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`${s.fontBody} flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[12px] font-semibold transition-all`}
            style={{
              background: activeTab === key ? "#fff" : "transparent",
              color: activeTab === key ? "#d4621a" : "#9a8a7a",
              boxShadow: activeTab === key ? "0 1px 6px rgba(180,80,20,0.12)" : "none",
            }}
          >
            {icon}{label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-x-10 gap-y-0">
        {sorted.slice(0, 4).map((article, i) => (
          <TrendingCard key={article.slug} article={article} s={s} rank={i + 1} />
        ))}
      </div>
    </section>
  )
}