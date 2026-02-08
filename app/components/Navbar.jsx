"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import { siteContent } from "../content/siteContent";
import { FaBars, FaMoon, FaSun, FaTimes } from "react-icons/fa";
import { useTheme } from "../context/useTheme";

function NavLink({ href, label, onClick }) {
  const router = useRouter();
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <button
      onClick={() => {
        router.push(href);
        onClick && onClick();
      }}
      className={`text-sm font-medium ${
        active
          ? "text-[#e4572e] border-b-2 border-[#e4572e]"
          : "text-[var(--foreground)]/80 hover:text-[#e4572e]"
      }`}
    >
      {label}
    </button>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { lang, setLang, languages } = useLanguage();
  const t = siteContent[lang];
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-[var(--surface-muted)]/90 backdrop-blur border-b border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="font-extrabold tracking-wide text-lg">
          GURUJI SHRAWAN
        </div>

        {/* Desktop */}
        <nav className="hidden md:flex gap-8 items-center">
          <NavLink href="/" label={t.nav.home} />
          <NavLink href="/articles" label={t.nav.articles} />
          <NavLink href="/biography" label={t.nav.biography} />

          <button
            onClick={() => router.push("/donate")}
            className="bg-[var(--accent)] text-[#1b1b1f] px-4 py-1.5 text-sm rounded-full font-semibold hover:bg-[var(--brand)] hover:text-white transition"
          >
            {t.nav.donate}
          </button>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 text-xs border border-black/10 px-2.5 py-1 rounded-full bg-white/70 text-[var(--foreground)] hover:bg-white transition"
          >
            {theme === "light" ? (
              <FaMoon className="text-gray-700" />
            ) : (
              <FaSun className="text-yellow-400" />
            )}
            {theme === "light" ? "Dark" : "Light"}
          </button>

          <label className="text-xs border border-black/10 px-2.5 py-1 rounded-full bg-white/70 text-[var(--foreground)]">
            <span className="sr-only">{t.languageLabel}</span>
            <select
              value={lang}
              onChange={event => setLang(event.target.value)}
              className="bg-transparent text-xs font-medium text-[var(--foreground)]"
            >
              {languages.map(option => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </nav>

        {/* Mobile */}
        <button
          className="md:hidden text-xl"
          onClick={() => setOpen(!open)}
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[var(--surface-muted)] border-t px-6 py-6 flex flex-col gap-4">
          <NavLink href="/" label={t.nav.home} onClick={() => setOpen(false)} />
          <NavLink href="/articles" label={t.nav.articles} onClick={() => setOpen(false)} />
          <NavLink href="/biography" label={t.nav.biography} onClick={() => setOpen(false)} />

          <button
            onClick={() => router.push("/donate")}
            className="bg-[var(--accent)] text-[#1b1b1f] px-4 py-2 text-sm rounded-full font-semibold hover:bg-[var(--brand)] hover:text-white transition"
          >
            {t.nav.donate}
          </button>

          <button
            onClick={() => {
              toggleTheme();
              setOpen(false);
            }}
            className="flex items-center gap-2 text-xs border border-black/10 px-3 py-2 w-fit rounded-full bg-white/70 text-[var(--foreground)]"
          >
            {theme === "light" ? (
              <FaMoon className="text-gray-700" />
            ) : (
              <FaSun className="text-yellow-400" />
            )}
            {theme === "light" ? "Dark" : "Light"}
          </button>

          <label className="text-xs border border-black/10 px-3 py-2 w-fit rounded-full bg-white/70 text-[var(--foreground)]">
            <span className="sr-only">{t.languageLabel}</span>
            <select
              value={lang}
              onChange={event => {
                setLang(event.target.value);
                setOpen(false);
              }}
              className="bg-transparent text-xs font-medium text-[var(--foreground)]"
            >
              {languages.map(option => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    </header>
  );
}
