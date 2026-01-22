"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import { siteContent } from "../content/siteContent";
import { FaBars, FaTimes } from "react-icons/fa";

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
          : "text-[#1c1c1c] hover:text-[#e4572e]"
      }`}
    >
      {label}
    </button>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { lang, setLang } = useLanguage();
  const t = siteContent[lang];

  return (
    <header className="sticky top-0 z-50 bg-[#f7f5f2]/90 backdrop-blur border-b border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="font-extrabold tracking-wide text-lg">
          GURUJI SHRAWAN
        </div>

        {/* Desktop */}
        <nav className="hidden md:flex gap-8 items-center">
          <NavLink href="/" label="Home" />
          <NavLink href="/articles" label={t.nav.articles} />
          <NavLink href="/biography" label={t.nav.biography} />

          <button
            onClick={() => router.push("/donate")}
            className="bg-[#e4572e] text-white px-4 py-1.5 text-sm"
          >
            {t.nav.donate}
          </button>

          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="text-xs border px-2 py-1"
          >
            {lang === "en" ? "हिंदी" : "EN"}
          </button>
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
        <div className="md:hidden bg-[#f7f5f2] border-t px-6 py-6 flex flex-col gap-4">
          <NavLink href="/" label="Home" onClick={() => setOpen(false)} />
          <NavLink href="/articles" label={t.nav.articles} onClick={() => setOpen(false)} />
          <NavLink href="/biography" label={t.nav.biography} onClick={() => setOpen(false)} />

          <button
            onClick={() => router.push("/donate")}
            className="bg-[#e4572e] text-white px-4 py-2 text-sm"
          >
            {t.nav.donate}
          </button>
        </div>
      )}
    </header>
  );
}
