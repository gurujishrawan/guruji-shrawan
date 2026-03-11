"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { siteContent } from "../content/siteContent"
import { useLanguage } from "../context/LanguageContext"
import { Menu, X, ChevronDown } from "lucide-react"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { language, setLanguage } = useLanguage()
  const t = siteContent[language] || siteContent.en

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const langRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close language dropdown on outside click
  useEffect(() => {
    function handler(e) {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const isActive = (path) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path)

  const NAV_ITEMS = [
    { label: t?.nav?.home || "Home", href: "/" },
    { label: t?.nav?.articles || "Articles", href: "/articles" },
    { label: "Youtube", href: "/youtube" },
    { label: "Books", href: "/books" },
    { label: "Video Series", href: "/video-series" },
    { label: t?.nav?.biography || "Biography", href: "/biography" },
  ]

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(180,80,20,0.10)]"
          : "bg-white border-b border-[#ede5da]"
      }`}
    >
      <div className="mx-auto w-[min(1280px,95%)] flex items-center justify-between h-[60px] gap-4">

        {/* ── LOGO ── */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 group"
        >
          <span
            className="text-[17px] font-bold tracking-tight leading-none"
            style={{ fontFamily: "'Poppins',system-ui,sans-serif", color: "#1a1008" }}
          >
            Guruji <span>Shrawan</span>
          </span>
        </Link>

        {/* ── DESKTOP NAV ── */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2 rounded-lg text-[14px] font-medium transition-all duration-150 ${
                isActive(href)
                  ? "text-[#d4621a] bg-[#fff0e6] font-semibold"
                  : "text-[#5a4a3a] hover:text-[#d4621a] hover:bg-[#fff8f3]"
              }`}
              style={{ fontFamily: "'Poppins',system-ui,sans-serif" }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* ── DESKTOP ACTIONS ── */}
        <div className="hidden md:flex items-center gap-2.5">

          {/* Language dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[13px] font-semibold transition"
              style={{
                fontFamily: "'Poppins',system-ui,sans-serif",
                borderColor: "#e8dfd4",
                color: "#5a4a3a",
                background: langOpen ? "#fff8f3" : "transparent",
              }}
            >
             {language ? language.toUpperCase() : "EN"}
              <ChevronDown size={12} className={`transition ${langOpen ? "rotate-180" : ""}`} />
            </button>

            {langOpen && (
              <div
                className="absolute right-0 top-full mt-1.5 bg-white rounded-xl overflow-hidden z-50"
                style={{
                  border: "1.5px solid #ede5da",
                  boxShadow: "0 8px 24px rgba(180,80,20,0.12)"
                }}
              >
                {["en", "hi"].map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLanguage(l)
                      setLangOpen(false)
                    }}
                    className="w-full px-4 py-2.5 text-left text-[13px] font-medium transition hover:bg-[#fff0e6]"
                    style={{
                      fontFamily: "'Poppins',system-ui,sans-serif",
                      color: language === l ? "#d4621a" : "#5a4a3a",
                    }}
                  >
                    {l === "en" ? "English" : "हिंदी"}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/signin"
            className="px-4 py-2 text-[13px] font-semibold rounded-lg transition"
            style={{
              fontFamily: "'Poppins',system-ui,sans-serif",
              color: "#d4621a",
              background: "#fff0e6"
            }}
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="px-4 py-2 text-[13px] font-semibold rounded-lg text-white transition"
            style={{
              fontFamily: "'Poppins',system-ui,sans-serif",
              background: "linear-gradient(135deg,#d4621a,#c8521a)",
              boxShadow: "0 2px 10px rgba(212,98,26,0.28)",
            }}
          >
            Sign Up
          </Link>

        </div>

        {/* ── MOBILE MENU BUTTON ── */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg transition"
          style={{ color: "#5a4a3a", background: mobileOpen ? "#fff0e6" : "transparent" }}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

      </div>

      {/* ── MOBILE MENU ── */}
      {mobileOpen && (
        <div
          className="md:hidden border-t bg-white px-5 pb-6 space-y-1"
          style={{ borderColor: "#ede5da" }}
        >
          {NAV_ITEMS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-3 rounded-lg text-[14px] font-medium transition ${
                isActive(href)
                  ? "text-[#d4621a] bg-[#fff0e6]"
                  : "text-[#5a4a3a] hover:bg-[#f5f0ea]"
              }`}
              style={{ fontFamily: "'Poppins',system-ui,sans-serif" }}
            >
              {label}
            </Link>
          ))}

          <div className="flex items-center gap-2 pt-2">
            {["en", "hi"].map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className="px-4 py-1.5 rounded-lg text-[12px] font-semibold transition"
                style={{
                  fontFamily: "'Poppins',system-ui,sans-serif",
                  background: language === l ? "#d4621a" : "#f5f0ea",
                  color: language === l ? "#fff" : "#7a6a5a",
                }}
              >
                {l === "en" ? "EN" : "हि"}
              </button>
            ))}
          </div>

        </div>
      )}
    </header>
  )
}