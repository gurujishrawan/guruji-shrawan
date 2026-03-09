"use client";

import { useState } from "react";
import { useSession } from "../session-provider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import { siteContent } from "../content/siteContent";
import { FaBars, FaMoon, FaSun, FaTimes } from "react-icons/fa";
import { useTheme } from "../context/useTheme";

function NavLink({ href, label, onClick }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-sm font-medium transition ${
        active
          ? "text-[#ff6a00]"
          : "text-[var(--foreground)]/80 hover:text-[#ff6a00]"
      }`}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { lang, setLang, languages } = useLanguage();
  const t = siteContent[lang];
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "GET", cache: "no-store" });
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[var(--surface-muted)]/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-[min(1200px,92%)] items-center justify-between">
        <Link href="/" className="text-base font-extrabold tracking-wide sm:text-lg">
          GURUJI SHRAWAN
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <NavLink href="/" label={t.nav.home} />
          <NavLink href="/articles" label={t.nav.articles} />
          <NavLink href="/biography" label={t.nav.biography} />
          <Link href="/donate" className="rounded-full bg-[#ff6a00] px-4 py-1.5 text-sm font-semibold text-white">
            {t.nav.donate}
          </Link>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-2.5 py-1 text-xs text-[var(--foreground)]"
          >
            {theme === "light" ? <FaMoon className="text-gray-700" /> : <FaSun className="text-yellow-400" />}
            {theme === "light" ? "Dark" : "Light"}
          </button>
          {session?.user ? (
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-black/10 bg-white/70 px-2.5 py-1 text-xs text-[var(--foreground)]">
                Hi, {session.user.name}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full border border-black/10 bg-white/70 px-2.5 py-1 text-xs text-[var(--foreground)]"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link href="/signin" className="text-sm font-medium text-[var(--foreground)]/80 hover:text-[#ff6a00]">
              Sign in
            </Link>
          )}
          <label className="rounded-full border border-black/10 bg-white/70 px-2.5 py-1 text-xs text-[var(--foreground)]">
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

        <button className="text-xl md:hidden" onClick={() => setOpen(!open)} type="button">
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {open && (
        <div className="border-t bg-[var(--surface-muted)] px-5 py-5 md:hidden">
          <div className="flex flex-col gap-4">
            <NavLink href="/" label={t.nav.home} onClick={() => setOpen(false)} />
            <NavLink href="/articles" label={t.nav.articles} onClick={() => setOpen(false)} />
            <NavLink href="/biography" label={t.nav.biography} onClick={() => setOpen(false)} />
            <Link href="/donate" onClick={() => setOpen(false)} className="rounded-full bg-[#ff6a00] px-4 py-2 text-center text-sm font-semibold text-white">
              {t.nav.donate}
            </Link>
            {session?.user ? (
              <button
                type="button"
                onClick={async () => {
                  await handleSignOut();
                  setOpen(false);
                }}
                className="w-fit rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs text-[var(--foreground)]"
              >
                Sign out ({session.user.name})
              </button>
            ) : (
              <Link
                href="/signin"
                onClick={() => setOpen(false)}
                className="w-fit rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs text-[var(--foreground)]"
              >
                Sign in
              </Link>
            )}
            <button
              onClick={() => {
                toggleTheme();
                setOpen(false);
              }}
              className="flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs text-[var(--foreground)]"
            >
              {theme === "light" ? <FaMoon className="text-gray-700" /> : <FaSun className="text-yellow-400" />}
              {theme === "light" ? "Dark" : "Light"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
