"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown, Search, X } from "lucide-react"

/* ------------------ NAV_DATA (use the full data you provided) ------------------ */
/* I included the same NAV_DATA you originally shared (truncated below for readability in this message).
   Replace this block with the full NAV_DATA you already have in your project if you keep it elsewhere. */

const NAV_DATA = {
  "For You": {
    type: "topics-articles",
    topics: ["Mind", "Awareness", "Freedom", "Love", "Relationships", "Self Development", "Clarity", "Inner Strength"],
    articles: [
      { title: "Who Controls Your Mood?", slug: "who-controls-your-mood", category: "Mind" },
      { title: "Free Mind Is an Intelligent Mind", slug: "free-mind-is-an-intelligent-mind", category: "Mind & Freedom" },
      { title: "Love Lies Beyond Patterns", slug: "love-lies-beyond-patterns", category: "Relationships" },
      { title: "The Meaning of Freedom", slug: "the-meaning-of-freedom", category: "Freedom" },
      { title: "You Get What You Are", slug: "you-get-what-you-are-gita-lesson", category: "Dharma" },
      { title: "अपने भीतर शक्ति कैसे विकसित करें?", slug: "apne-bheetar-shakti-kaise-vikasit-karen", category: "Mind" },
    ],
  },
  "Trending": {
    type: "topics-articles",
    topics: ["Society", "Power & Media", "Scandal", "Politics", "Revolution", "Geopolitics", "Religion", "Technology"],
    articles: [
      { title: "एप्स्टीन फ़ाइल्स: चमकते चेहरों का काला सच", slug: "epstein-files-chamakte-chehron-ka-kala-sach", category: "Society" },
      { title: "The Israel–Iran Case: A Religious Struggle", slug: "israel-iran-religious-struggle", category: "Philosophy & Society" },
      { title: "Rotating Revolutions: Iran on Maya's Wheel", slug: "rotating-revolutions-iran-on-mayas-wheel", category: "Philosophy & Society" },
      { title: "Should You Quit Social Media?", slug: "should-you-quit-social-media", category: "Mind & Society" },
      { title: "महँगी चीज़ें, सस्ता जीवन?", slug: "expensive-things-cheap-life-social-media-luxury", category: "Society" },
      { title: "महिला ही महिला की दुश्मन?", slug: "mahila-hi-mahila-ki-dushman", category: "Society" },
    ],
  },
  "On Life": {
    type: "topics-articles",
    topics: ["Mind", "Fear", "Desire", "Consciousness", "Sensitivity", "Self Inquiry", "Awareness", "Inner Growth"],
    articles: [
      { title: "वासना और डर — समस्या कहाँ है?", slug: "vasna-aur-dar-samasya-kahan-hai", category: "Mind" },
      { title: "डर को कैसे छोड़ें?", slug: "dar-ko-kaise-chhode", category: "Mind & Awareness" },
      { title: "इन्द्रियों के पीछे की इन्द्रिय है मन", slug: "indriyon-ke-piche-ki-indriya-man", category: "Mind & Consciousness" },
      { title: "साल बदल गया, हम कब बदलेंगे?", slug: "saal-badal-gaya-hum-kab-badlenge", category: "Mind" },
      { title: "अपने भीतर शक्ति कैसे विकसित करें?", slug: "apne-bheetar-shakti-kaise-vikasit-karen", category: "Mind" },
      { title: "Free Mind Is an Intelligent Mind", slug: "free-mind-is-an-intelligent-mind", category: "Mind & Freedom" },
    ],
  },
  "Women": {
    type: "topics-articles",
    topics: ["Women Empowerment", "Social Issues", "Gender Equality", "Society", "Marriage", "Love", "Liberation", "Emotions"],
    articles: [
      { title: "महिला ही महिला की दुश्मन?", slug: "mahila-hi-mahila-ki-dushman", category: "Society" },
      { title: "सच्चा प्रेम लोरी नहीं, ललकार होता है", slug: "sachcha-prem-lori-nahi-lalkar-hota-hai", category: "Relationships" },
      { title: "Love Lies Beyond Patterns", slug: "love-lies-beyond-patterns", category: "Relationships" },
      { title: "What Does Valentine's Day Really Mean?", slug: "what-does-valentines-day-really-mean", category: "Society" },
    ],
  },
  "Youth": {
    type: "topics-articles",
    topics: ["Clarity", "Success", "Individuality", "Passion", "Confidence", "Goal", "Talent", "Maturity"],
    articles: [
      { title: "If Vivekananda Comes Alive Today", slug: "if-vivekananda-comes-alive-today", category: "Philosophy & Society" },
      { title: "How Is Vedanta Different From Self-Help?", slug: "how-is-vedanta-different-from-self-help", category: "Vedanta" },
      { title: "Education: Expanding Outer Knowledge", slug: "education-expanding-outer-knowledge-awakening-inner-clarity", category: "Society" },
      { title: "You Get What You Are", slug: "you-get-what-you-are-gita-lesson", category: "Dharma" },
      { title: "श्रीनिवास रामानुजन: महान भारतीय गणितज्ञ", slug: "srinivasa-ramanujan-great-indian-mathematician", category: "Biography" },
      { title: "अपने भीतर शक्ति कैसे विकसित करें?", slug: "apne-bheetar-shakti-kaise-vikasit-karen", category: "Mind" },
    ],
  },
  "Climate Crisis": {
    type: "topics-articles",
    topics: ["Climate Change", "Environment", "Sustainability", "Society", "Responsibility", "Consciousness"],
    articles: [
      { title: "Holi: What the Fire Was Really Meant to Burn", slug: "holi-what-the-fire-was-meant-to-burn", category: "Culture" },
      { title: "Education: Expanding Outer Knowledge", slug: "education-expanding-outer-knowledge-awakening-inner-clarity", category: "Society" },
      { title: "The Meaning of Freedom", slug: "the-meaning-of-freedom", category: "Freedom" },
    ],
  },
  "Bhagavad Gita": {
    type: "topics-articles",
    topics: ["Shri Krishna", "Dharma", "Karma", "Maya", "Liberation", "Ego", "Attachment", "Swadharma"],
    articles: [
      { title: "What Is Dharma According to the Bhagavad Gita?", slug: "what-is-dharma-according-to-the-bhagavad-gita", category: "Dharma" },
      { title: "If Not Surrender, How to Reach Shri Krishna?", slug: "if-not-surrender-how-to-reach-shri-krishna", category: "Dharma" },
      { title: "You Get What You Are — A Lesson from the Gita", slug: "you-get-what-you-are-gita-lesson", category: "Dharma" },
      { title: "क्या अध्यात्म में संकल्प लेना वर्जित है?", slug: "adhyatm-mein-sankalp-lena-varjit-hai-kya", category: "Dharma" },
      { title: "साल बदल गया, हम कब बदलेंगे?", slug: "saal-badal-gaya-hum-kab-badlenge", category: "Mind" },
      { title: "पुराण दिखाएँ मन का विस्तार, उपनिषद ले जाएँ मन के पार", slug: "puran-dikhaye-man-ka-vistar-upanishad-le-jaye-man-ke-par", category: "Dharma" },
    ],
  },
  "Scriptures": {
    type: "scripture-columns",
    columns: {
      "UPANISHADS": ["Adhyatma Upanishad", "Kathopnishad", "Mundaka Upanishad", "Niralamba Upanishad", "Chhandogya Upanishad", "Ishavasya Upanishad"],
      "VEDANT — GITA": ["Ashtavakra Gita", "Avadhut Gita", "Ribhu Gita", "Paramhans Gita", "Pingla Gita", "Uttar Gita"],
      "BHAKTI SCRIPTURES": ["Guru Granth Sahib", "Nitnem Sahib", "Hanuman Chalisa", "Jaap Sahib", "Bhaj Govindam", "Narad Bhakti Sutra"],
      "OTHER SCRIPTURES": ["Quran", "Bible", "Tao Te Ching", "Shiv Sutra", "Patanjali Yoga Sutra", "Hsin Hsin Ming"],
    },
    articles: [
      { title: "How to Remember the Essence of the Scriptures?", slug: "how-to-remember-the-essence-of-scriptures", category: "Dharma" },
      { title: "पुराण दिखाएँ मन का विस्तार, उपनिषद ले जाएँ मन के पार", slug: "puran-dikhaye-man-ka-vistar-upanishad-le-jaye-man-ke-par", category: "Dharma" },
      { title: "Who Is a Hindu? Toward Sanatan Dharma", slug: "who-is-a-hindu-beyond-religion-sanatan-dharma", category: "Dharma" },
    ],
  },
  "Saints": {
    type: "topics-articles",
    topics: ["Shri Krishna", "J. Krishnamurti", "Swami Vivekananda", "Jesus Christ", "Adi Shankaracharya", "Buddha", "Osho", "Ramkrishna Paramhans"],
    articles: [
      { title: "If Vivekananda Comes Alive Today", slug: "if-vivekananda-comes-alive-today", category: "Philosophy & Society" },
      { title: "Jesus: The Highest Potentiality of Adam and Eve", slug: "jesus-highest-potential-adam-eve", category: "Philosophy & Religion" },
      { title: "If Not Surrender, How to Reach Shri Krishna?", slug: "if-not-surrender-how-to-reach-shri-krishna", category: "Dharma" },
      { title: "What Does Valentine's Day Really Mean?", slug: "what-does-valentines-day-really-mean", category: "Society" },
    ],
  },
}

const TABS = ["For You", "Trending", "On Life", "Women", "Youth", "Climate Crisis", "Bhagavad Gita", "Scriptures", "Saints", "All Topics"]

/* ------------------ Component ------------------ */

export default function TopicNav({ s }) {
  const router = useRouter()
  const [active, setActive] = useState("For You")
  const [openTab, setOpenTab] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchVal, setSearchVal] = useState("")
  const [lang, setLang] = useState("ALL")
  const [suggestions, setSuggestions] = useState([])
  const [highlightIdx, setHighlightIdx] = useState(-1)
  const dropdownRef = useRef(null)
  const searchRef = useRef(null)

  // Flatten all articles from NAV_DATA for search
  const allArticles = useMemo(() => {
    return Object.values(NAV_DATA).flatMap((v) => v.articles || []).map(a => ({
      ...a,
      // add searchable tokens
      _text: `${a.title} ${a.category}`.toLowerCase()
    }))
  }, [])

  useEffect(() => {
    function handler(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpenTab(null)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Update suggestions when searchVal changes
  useEffect(() => {
    if (!searchVal.trim()) {
      setSuggestions([])
      setHighlightIdx(-1)
      return
    }
    const q = searchVal.trim().toLowerCase()
    // Priority: title match, then category match
    const matches = allArticles.filter(a => a._text.includes(q))
    setSuggestions(matches.slice(0, 8))
    setHighlightIdx(-1)
  }, [searchVal, allArticles])

  function handleTab(label) {
    setActive(label)
    if (label === "All Topics") {
      setOpenTab(null)
      router.push("/articles/topics")
      return
    }
    // toggle open tab
    setOpenTab((prev) => (prev === label ? null : label))
    // close search when opening tab
    setSearchOpen(false)
    setSearchVal("")
    setSuggestions([])
  }

  function handleSearchKeyDown(e) {
    if (e.key === "Escape") {
      setSearchOpen(false)
      setSearchVal("")
      setSuggestions([])
      return
    }

    if (e.key === "Enter") {
      if (highlightIdx >= 0 && suggestions[highlightIdx]) {
        // open highlighted suggestion
        const slug = suggestions[highlightIdx].slug
        router.push(`/articles/${slug}`)
        setSearchOpen(false)
        setSearchVal("")
        setSuggestions([])
        return
      }
      if (searchVal.trim()) {
        router.push(`/articles?search=${encodeURIComponent(searchVal.trim())}`)
        setSearchOpen(false)
        setSearchVal("")
        setSuggestions([])
      }
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightIdx((i) => Math.min(i + 1, suggestions.length - 1))
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightIdx((i) => Math.max(i - 1, 0))
    }
  }

  function openArticle(slug) {
    router.push(`/articles/${slug}`)
    setSearchOpen(false)
    setSearchVal("")
    setSuggestions([])
  }

  const data = NAV_DATA[openTab]

  return (
    <div className="relative bg-white" style={{ borderBottom: "1px solid #ede5da" }} ref={dropdownRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`flex flex-col md:flex-row md:items-center${s?.scrollbarHide || ""}`}>

          {/* Tabs - responsive horizontal scroll on small screens */}
         <div className="flex items-center flex-1 min-w-0 overflow-x-auto md:overflow-visible">
            {TABS.map((label) => (
              <button
                key={label}
                onClick={() => handleTab(label)}
                className={`${s?.topicTab || ""} ${active === label ? s?.activeTab || "" : ""} px-3 py-3 text-[13px] md:text-[14px] flex items-center gap-2 whitespace-nowrap`}
                aria-expanded={openTab === label}
                aria-controls={openTab === label ? "nav-dropdown-panel" : undefined}
              >
                <span>{label}</span>
                {NAV_DATA[label] && (
                  <ChevronDown
                    size={12}
                    style={{
                      transition: "transform 0.18s",
                      transform: openTab === label ? "rotate(180deg)" : "rotate(0deg)",
                      color: active === label ? "#d4621a" : "#b0a090",
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Search + Lang */}
          <div className="flex items-center justify-between md:justify-start gap-2 mt-2 md:mt-0 md:ml-3 shrink-0 md:pl-3 border-t md:border-t-0 pt-2 md:pt-0">
            <button
              onClick={() => {
                setSearchOpen((s) => !s)
                setOpenTab(null)
              }}
              className="p-2 rounded-full transition"
              style={{ color: searchOpen ? "#d4621a" : "#b0a090", background: searchOpen ? "#fff0e6" : "transparent" }}
              aria-pressed={searchOpen}
              aria-label="Open search"
            >
              {searchOpen ? <X size={16} /> : <Search size={16} />}
            </button>

            <div className="flex items-center gap-1">
              {["ALL", "EN", "HI"].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`${s?.langBtn || ""} ${lang === l ? s?.activeLang || "" : ""}`}
                  aria-pressed={lang === l}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible search bar — responsive */}
      {searchOpen && (
        <div
          className="border-t px-4 sm:px-6 py-3"
          style={{ borderColor: "#ede5da", background: "#faf8f5", animation: "articleSlideDown 0.18s ease-out both" }}
        >
          <div className="max-w-xl mx-auto relative" ref={searchRef}>
            <div
              className="flex items-center gap-3 bg-white rounded-xl px-4 py-2.5"
              style={{ border: "1.5px solid #e8dfd4", boxShadow: "0 2px 8px rgba(180,80,20,0.08)" }}
            >
              <Search size={15} style={{ color: "#b0a090", flexShrink: 0 }} />
              <input
                autoFocus
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search wisdom articles..."
                className={`${s?.searchInput || ""} flex-1 bg-transparent outline-none text-[14px]`}
                aria-label="Search articles"
              />
              {searchVal && (
                <button
                  onClick={() => {
                    setSearchVal("")
                    setSuggestions([])
                    setHighlightIdx(-1)
                  }}
                  style={{ color: "#b0a090" }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Live suggestions dropdown */}
            {suggestions.length > 0 && (
              <div
                className="absolute left-0 right-0 mt-2 bg-white rounded-2xl overflow-hidden z-50"
                style={{ boxShadow: "0 8px 36px rgba(180,80,20,0.18)", border: "1.5px solid #ede5da" }}
              >
                {suggestions.map((a, idx) => (
  <button
    key={`${a.slug}-${idx}`}
    onMouseDown={() => openArticle(a.slug)}
    className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-[#fff8f3] transition group"
  >
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium truncate" style={{ color: "#1a1008" }}>
                        {a.title}
                      </p>
                      <p className="text-[11px] mt-0.5" style={{ color: "#b0a090" }}>
                        {a.category}
                      </p>
                    </div>
                  </button>
                ))}

                <div className="px-4 py-2.5 border-t border-[#f0e8de]">
                  <button
                    onMouseDown={() => {
                      router.push(`/articles?search=${encodeURIComponent(searchVal)}`)
                      setSearchVal("")
                      setSuggestions([])
                      setSearchOpen(false)
                    }}
                    className="text-[12px] font-semibold"
                    style={{ color: "#d4621a" }}
                  >
                    See all results for "{searchVal}" →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dropdown Panel (responsive) */}
      {openTab && data && (
        <div
          id="nav-dropdown-panel"
          className={`absolute left-0 w-full bg-white z-50 ${s?.dropdownPanel || ""}`}
          style={{ borderTop: "1px solid #ede5da", boxShadow: "0 16px 48px rgba(180,80,20,0.12)" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7">
            {data.type === "scripture-columns" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
                {Object.entries(data.columns).map(([col, items]) => (
                  <div key={col}>
                    <p className={`${s?.fontBody || ""} text-[10px] uppercase tracking-[0.16em] font-bold mb-4`} style={{ color: "#c8941a" }}>
                      {col}
                    </p>
                    <ul className="space-y-2">
                      {items.map((item) => (
                        <li key={item}>
                          <Link
                            href={`/articles?topic=${encodeURIComponent(item.toLowerCase())}`}
                            onClick={() => setOpenTab(null)}
                            className={`${s?.fontBody || ""} text-[13px] transition block`}
                            style={{ color: "#5a4a3a" }}
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          href="/articles/topics"
                          onClick={() => setOpenTab(null)}
                          className={`${s?.fontBody || ""} text-[12px] hover:underline mt-1 block`}
                          style={{ color: "#c8941a" }}
                        >
                          See All →
                        </Link>
                      </li>
                    </ul>
                  </div>
                ))}
                <div>
                  <p className={`${s?.fontBody || ""} text-[10px] uppercase tracking-[0.16em] font-bold mb-4`} style={{ color: "#c8941a" }}>
                    TOP ARTICLES
                  </p>
                  <ul className="space-y-4">
                    {data.articles.map((a) => (
                      <li key={a.slug}>
                        <Link href={`/articles/${a.slug}`} onClick={() => setOpenTab(null)} className="block group">
                          <span className={`${s?.fontBody || ""} text-[10px] uppercase tracking-wider`} style={{ color: "#c8941a" }}>{a.category}</span>
                          <p className={`${s?.fontDisplay || ""} text-[13px] transition leading-snug mt-0.5 group-hover:text-[#d4621a]`} style={{ color: "#5a4a3a" }}>{a.title}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {/* Topics column */}
                <div>
                  <p className={`${s?.fontBody || ""} text-[10px] uppercase tracking-[0.16em] font-bold mb-4`} style={{ color: "#c8941a" }}>
                    TOPICS
                  </p>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                    {data.topics.map((topic) => (
                      <li key={topic}>
                        <Link
                          href={`/articles?topic=${encodeURIComponent(topic.toLowerCase())}`}
                          onClick={() => setOpenTab(null)}
                          className={`${s?.fontBody || ""} text-[13px] transition block`}
                          style={{ color: "#5a4a3a" }}
                        >
                          {topic}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link href="/articles/topics" onClick={() => setOpenTab(null)} className={`${s?.fontBody || ""} text-[12px] hover:underline mt-4 inline-block`} style={{ color: "#c8941a" }}>
                    See All Topics →
                  </Link>
                </div>

                {/* Top Articles */}
                <div>
                  <p className={`${s?.fontBody || ""} text-[10px] uppercase tracking-[0.16em] font-bold mb-4`} style={{ color: "#c8941a" }}>
                    TOP ARTICLES
                  </p>
                  <ul className="space-y-4">
                    {data.articles.map((a) => (
                      <li key={a.slug}>
                        <Link href={`/articles/${a.slug}`} onClick={() => setOpenTab(null)} className="block group">
                          <span className={`${s?.fontBody || ""} text-[10px] uppercase tracking-wider`} style={{ color: "#c8941a" }}>{a.category}</span>
                          <p className={`${s?.fontDisplay || ""} text-[13px] transition leading-snug mt-0.5 group-hover:text-[#d4621a]`} style={{ color: "#5a4a3a" }}>{a.title}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Explore/call-to-action */}
                <div className="pl-0 md:pl-8" style={{ borderLeft: "none" }}>
                  <p className={`${s?.fontBody || ""} text-[10px] uppercase tracking-[0.16em] font-bold mb-4`} style={{ color: "#c8941a" }}>EXPLORE</p>
                  <p className={`${s?.fontBody || ""} text-[13px] mb-5 leading-relaxed`} style={{ color: "#7a6a5a" }}>
                    Dive into <strong style={{ color: "#1a1008" }}>{openTab}</strong> — curated wisdom for the sincere seeker.
                  </p>
                  <Link href={`/articles?tab=${encodeURIComponent(openTab)}`} onClick={() => setOpenTab(null)} className={`${s?.btnBrand || ""} text-[13px] px-5 py-2 inline-flex`}>
                    Browse All →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}