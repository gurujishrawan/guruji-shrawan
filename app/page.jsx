"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "./context/LanguageContext";
import { siteContent } from "./content/siteContent";
import VideoGallery from "./components/VideoGallery";
import { FaBars, FaMoon, FaSun, FaTimes } from "react-icons/fa";
import { FaArrowUpRight } from "react-icons/fa6";
import { useTheme } from "./context/useTheme";

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
          : "text-[var(--foreground)]/80 hover:text-[#e4572e]"
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
  const { theme, toggleTheme } = useTheme();
  const heroImages = [
    "/images/hero1.jpg",
    "/images/hero2.jpg",
    "/images/hero3.jpg",
  ];
  const [heroIndex, setHeroIndex] = useState(0);

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
  const socialLinks = {
    youtube: socialStats?.links?.youtube || "https://youtube.com/@gurujishrawan",
    facebook: socialStats?.links?.facebook || "https://facebook.com/gurujishrawan",
    instagram: socialStats?.links?.instagram || "https://instagram.com/gurujishrawan",
    x: socialStats?.links?.x || "https://x.com/gurujishrawan",
  };

  return (
    <main className="bg-[var(--surface-muted)] text-[var(--foreground)] overflow-x-hidden">
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
              className="bg-[var(--accent)] text-[#1b1b1f] px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-[var(--brand)] hover:text-white transition"
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
              className="bg-[var(--accent)] text-[#1b1b1f] px-4 py-2 text-sm font-semibold rounded-full hover:bg-[var(--brand)] hover:text-white transition"
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

      {/* ================= HERO ================= */}
      <section className="bg-[#141414]">
        <div className="grid lg:grid-cols-[0.9fr,1.1fr] min-h-[520px]">
          <div className="text-white px-8 py-12 sm:px-14 sm:py-16 flex flex-col justify-center space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">
              Guruji
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              {t.hero.title}
            </h1>
            <p className="text-white/80 text-base sm:text-lg max-w-xl">
              {t.hero.desc}
            </p>
            <p className="text-lg font-semibold text-white/90">
              {t.hero.quote}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push("/biography")}
                className="rounded-full border border-white/50 px-6 py-3 text-sm text-white hover:bg-white hover:text-[#1b1b1f] transition"
              >
                {t.hero.primaryCTA} →
              </button>
              <button
                onClick={() => router.push("/articles")}
                className="rounded-full bg-[var(--accent)] text-[#1b1b1f] px-6 py-3 text-sm font-semibold hover:bg-[var(--brand)] hover:text-white transition"
              >
                {t.hero.secondaryCTA}
              </button>
            </div>
          </div>

          <div className="relative min-h-[320px] sm:min-h-[520px] overflow-hidden">
            <img
              key={heroImages[heroIndex]}
              src={heroImages[heroIndex]}
              alt="Guruji Shrawan"
              className="h-full w-full object-cover animate-fade-in animate-float"
            />
          </div>
        </div>
      </section>

      {/* ================= QUOTE ================= */}
      <section className="bg-[var(--surface)] border-t border-black/10">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="bg-[var(--surface-muted)] px-6 py-10 sm:px-12 sm:py-12 text-center">
            <div className="text-5xl text-[var(--accent)] leading-none">“</div>
            <p className="text-xl sm:text-2xl font-medium text-[var(--foreground)] tracking-wide">
              Observe your own life, and you will know the Truth.
            </p>
          </div>
        </div>
      </section>

      {/* ================= JOURNEY ================= */}
      <section className="bg-[var(--surface)] py-20 sm:py-24 border-t border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr] items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">{t.journey.title}</h2>

              <p className="text-[var(--foreground)]/70 max-w-3xl mb-10">
                {t.journey.desc}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {t.stats.map(stat => (
                  <div
                    key={stat.key}
                    className="rounded-2xl border border-black/5 bg-[var(--surface)] p-5 shadow-sm flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="text-2xl font-bold">
                        {socialStats?.counts?.[stat.key] ?? "—"}
                      </h3>
                      {socialLinks[stat.key] && (
                        <a
                          href={socialLinks[stat.key]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-[var(--foreground)]/70 hover:bg-[var(--surface-muted)]"
                          aria-label={`Visit ${stat.label}`}
                        >
                          <FaArrowUpRight className="text-xs" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-[var(--foreground)]/60">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative overflow-hidden shadow-xl min-h-[260px]">
                <img
                  src="/images/hero2.jpg"
                  alt="Daily focus"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="bg-[var(--surface-muted)] px-6 py-5 shadow-md">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--foreground)]/60">
                  Daily focus
                </p>
                <h3 className="text-2xl font-semibold text-[var(--foreground)]">
                  Short-form teachings, long-term impact.
                </h3>
                <p className="text-sm text-[var(--foreground)]/70">
                  Curated wisdom delivered through modern platforms for seekers who
                  want clarity without noise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED ================= */}
      <section className="bg-[var(--surface)] py-20 sm:py-24 border-t border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">{t.featured.title}</h2>
            <button
              onClick={() => router.push("/articles")}
              className="text-sm uppercase tracking-[0.2em] text-[var(--brand)] hover:text-[var(--brand-dark)]"
            >
              {t.featured.cta}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-last md:order-first">
              <img
                src="/images/hero1.jpg"
                alt="Featured article"
                className="w-full h-[260px] sm:h-[340px] object-cover shadow-xl"
              />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--foreground)]/60">
                Featured
              </p>
              <h3 className="text-2xl font-semibold mb-4 mt-3">
                {t.featured.headline}
              </h3>

              <p className="text-[var(--foreground)]/70 mb-6">{t.featured.desc}</p>

              <button
                onClick={() => router.push("/articles")}
                className="rounded-full border border-[var(--foreground)]/40 px-6 py-3 text-sm text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--surface)] transition"
              >
                {t.featured.cta}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VIDEOS ================= */}
      <VideoGallery title={t.videoTitle} />
    </main>
  );
}
