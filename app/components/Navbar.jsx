"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { siteContent } from "../content/siteContent"
import { useLanguage } from "../context/LanguageContext"
import { Menu, X, ChevronDown, User } from "lucide-react"
import { supabase } from "../lib/supabaseClient"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { language, setLanguage } = useLanguage()
  const t = siteContent[language] || siteContent.en

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [user, setUser] = useState(null)

  const langRef = useRef(null)
  const userRef = useRef(null)

  /* Detect scroll */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  /* Check logged user */
  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user || null)
    }
    getUser()
  }, [])

  /* Outside click handlers */
  useEffect(() => {
    function handler(e) {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false)
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

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/")
    setUser(null)
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(180,80,20,0.10)]"
          : "bg-white border-b border-[#ede5da]"
      }`}
    >
      <div className="mx-auto w-[min(1280px,95%)] flex items-center justify-between h-[60px] gap-4">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span
            className="text-[17px] font-bold tracking-tight leading-none"
            style={{ fontFamily: "'Poppins',system-ui,sans-serif", color: "#1a1008" }}
          >
            Guruji <span>Shrawan</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2 rounded-lg text-[14px] font-medium transition ${
                isActive(href)
                  ? "text-[#d4621a] bg-[#fff0e6]"
                  : "text-[#5a4a3a] hover:text-[#d4621a] hover:bg-[#fff8f3]"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex items-center gap-2.5">

          {/* Language dropdown */}
          <div className="relative" ref={langRef}>
          <button
  onClick={() => setLangOpen(!langOpen)}
  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold hover:bg-[#fff0e6]"
>
  {language ? language.toUpperCase() : "EN"}
  <ChevronDown size={12} className={`transition ${langOpen ? "rotate-180" : ""}`} />
</button>

      {langOpen && (
  <div
    className="absolute right-0 top-full mt-1.5 bg-white rounded-xl overflow-hidden z-50 border border-[#ede5da] shadow-[0_8px_24px_rgba(180,80,20,0.12)]"
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
          color: language === l ? "#d4621a" : "#5a4a3a",
        }}
      >
        {l === "en" ? "English" : "हिंदी"}
      </button>
    ))}
  </div>
)}
          </div>

          {/* USER STATE */}
          {!user ? (
            <>
              <Link
                href="/signin"
                className="px-4 py-2 text-[13px] font-semibold rounded-lg"
                style={{ color: "#d4621a", background: "#fff0e6" }}
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="px-4 py-2 text-[13px] font-semibold rounded-lg text-white"
                style={{
                  background: "linear-gradient(135deg,#d4621a,#c8521a)",
                }}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#fff0e6]"
              >
                <User size={18} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 bg-white rounded-xl shadow border w-[180px]">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm hover:bg-[#fff0e6]"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-[#fff0e6]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-9 h-9 flex items-center justify-center"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

      </div>
    </header>
  )
}