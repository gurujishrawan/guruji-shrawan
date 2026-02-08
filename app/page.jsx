"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "./context/LanguageContext";
import { siteContent } from "./content/siteContent";
import VideoGallery from "./components/VideoGallery";
import { FaBars, FaMoon, FaSun, FaTimes } from "react-icons/fa";

/* ---------------- NAV LINK ---------------- */
function NavLink({ href, label, onClick }) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <button
      onClick={() => {
        router.push(href);
        onClick && onClick();
      }}
      className={`text-sm font-medium transition text-left ${
        isActive
          ? "text-[#e4572e] border-b-2 border-[#e4572e]"
          : "text-[#1c1c1c] hover:text-[#e4572e]"
      }`}
    >
      {label}
    </button>
  );
}

/* ---------------- DONATION STRIP ---------------- */
function DonationStrip() {
  const router = useRouter();
  const { lang } = useLanguage();
  const t = siteContent[lang] ?? siteContent.en;

  return (
    <div className="bg-[#111] text-white text-xs sm:text-sm py-2 text-center px-4">
      {t.donateStrip}
      <button
        onClick={() => router.push("/donate")}
        className="ml-2 underline text-[#e4572e]"
      >
        {t.donateCTA}
      </button>
    </div>
  );
}

/* ---------------- HOME PAGE ---------------- */
export default function HomePage() {
  const router = useRouter();
  const { lang, setLang, languages } = useLanguage();
  const t = siteContent[lang] ?? siteContent.en;
  const [open, setOpen] = useState(false);
  const [socialStats, setSocialStats] = useState(null);
  const [theme, setTheme] = useState("light");
  const heroImages = [
    "/images/hero1.jpg",
    "/images/hero2.jpg",
    "/images/hero3.jpg",
  ];
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? window.localStorage.getItem("site-theme")
        : null;
    const initial = stored || "light";
    setTheme(initial);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", initial);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem("site-theme", theme);
    }
  }, [theme]);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/social")
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          setSocialStats(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setSocialStats(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex(current => (current + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);
  return (
    <main className="bg-[#f7f5f2] text-[#1c1c1c] overflow-x-hidden">
      <DonationStrip />

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 bg-[var(--surface-muted)]/90 backdrop-blur border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="font-extrabold tracking-wide text-lg">
            GURUJI SHRAWAN
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink href="/" label={t.nav.home} />
            <NavLink href="/articles" label={t.nav.articles} />
            <NavLink href="/biography" label={t.nav.biography} />

            <button
              onClick={() => router.push("/donate")}
              className="bg-[#e4572e] text-white px-4 py-1.5 rounded-sm text-sm font-medium"
            >
              {t.nav.donate}
            </button>

            <button
              onClick={() =>
                setTheme(theme === "light" ? "dark" : "light")
              }
              className="flex items-center gap-2 text-xs border px-2.5 py-1 rounded-full bg-white/70 hover:bg-white transition"
            >
              {theme === "light" ? (
                <FaMoon className="text-gray-700" />
              ) : (
                <FaSun className="text-yellow-400" />
              )}
              {theme === "light" ? "Dark" : "Light"}
            </button>

            <label className="text-xs border px-2.5 py-1 rounded-full bg-white/70">
              <span className="sr-only">{t.languageLabel}</span>
              <select
                value={lang}
                onChange={event => setLang(event.target.value)}
                className="bg-transparent text-xs font-medium"
              >
                {languages.map(option => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-xl"
            onClick={() => setOpen(!open)}
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden bg-[var(--surface-muted)] border-t px-6 py-6 flex flex-col gap-5">
            <NavLink href="/" label={t.nav.home} onClick={() => setOpen(false)} />
            <NavLink
              href="/articles"
              label={t.nav.articles}
              onClick={() => setOpen(false)}
            />
            <NavLink
              href="/biography"
              label={t.nav.biography}
              onClick={() => setOpen(false)}
            />

            <button
              onClick={() => {
                router.push("/donate");
                setOpen(false);
              }}
              className="bg-[#e4572e] text-white px-4 py-2 text-sm"
            >
              {t.nav.donate}
            </button>

            <button
              onClick={() => {
                setTheme(theme === "light" ? "dark" : "light");
                setOpen(false);
              }}
              className="flex items-center gap-2 text-xs border px-3 py-2 w-fit rounded-full bg-white/70"
            >
              {theme === "light" ? (
                <FaMoon className="text-gray-700" />
              ) : (
                <FaSun className="text-yellow-400" />
              )}
              {theme === "light" ? "Dark" : "Light"}
            </button>

            <label className="text-xs border px-3 py-2 w-fit rounded-full bg-white/70">
              <span className="sr-only">{t.languageLabel}</span>
              <select
                value={lang}
                onChange={event => {
                  setLang(event.target.value);
                  setOpen(false);
                }}
                className="bg-transparent text-xs font-medium"
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

      {/* ================= HERO ================= */}
      <section className="bg-[var(--surface-muted)]">
        <div className="max-w-7xl mx-auto px-6 py-16 sm:py-24">
          <div className="grid lg:grid-cols-[1.1fr,1fr] gap-10 items-stretch">
            <div className="rounded-3xl bg-[#1b1b1b] text-white p-10 shadow-2xl flex flex-col justify-between">
              <div className="space-y-6">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                  Guruji Shrawan
                </p>
                <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
                  {t.hero.title}
                </h1>
                <p className="text-white/80 text-base sm:text-lg">
                  {t.hero.desc}
                </p>
                <p className="text-lg font-semibold text-white">
                  {t.hero.quote}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <button
                  onClick={() => router.push("/biography")}
                  className="border border-white/60 px-6 py-3 text-sm text-white"
                >
                  {t.hero.primaryCTA} →
                </button>

                <button
                  onClick={() => router.push("/articles")}
                  className="bg-white text-black px-6 py-3 text-sm"
                >
                  {t.hero.secondaryCTA}
                </button>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                key={heroImages[heroIndex]}
                src={heroImages[heroIndex]}
                alt="Guruji Shrawan"
                className="h-full w-full object-cover animate-fade-in"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= JOURNEY ================= */}
      <section className="bg-white py-20 sm:py-24 border-t border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr] items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">{t.journey.title}</h2>

              <p className="text-[#5f5f5f] max-w-3xl mb-10">
                {t.journey.desc}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {t.stats.map(stat => (
                  <div
                    key={stat.key}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                  >
                    <h3 className="text-2xl font-bold">
                      {socialStats?.counts?.[stat.key] ?? "—"}
                    </h3>
                    <p className="text-xs text-[#5f5f5f] mt-2">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-[#111] text-white p-8 space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                Daily focus
              </p>
              <h3 className="text-2xl font-semibold">
                Short-form teachings, long-term impact.
              </h3>
              <p className="text-sm text-white/70">
                Curated wisdom delivered through modern platforms for seekers who
                want clarity without noise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED ================= */}
      <section className="bg-white py-20 sm:py-24 border-t border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">{t.featured.title}</h2>
            <button
              onClick={() => router.push("/articles")}
              className="text-sm underline"
            >
              {t.featured.cta}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4">
                {t.featured.headline}
              </h3>

              <p className="text-[#5f5f5f] mb-6">{t.featured.desc}</p>

              <button
                onClick={() => router.push("/articles")}
                className="border border-black px-6 py-3 text-sm"
              >
                {t.featured.cta}
              </button>
            </div>

            <div className="order-first md:order-last">
              <img
                src="/images/hero1.jpg"
                alt="Featured article"
                className="w-full h-[260px] sm:h-[320px] object-cover rounded-3xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= VIDEOS ================= */}
      <VideoGallery title={t.videoTitle} />
    </main>
  );
}
