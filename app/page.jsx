"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "./context/LanguageContext";
import { siteContent } from "./content/siteContent";
import VideoGallery from "./components/VideoGallery";
import Footer from "./components/Footer";
import {
  FaBars,
  FaTimes,
  FaYoutube,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";

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
  const t = siteContent[lang];

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
  const { lang, setLang } = useLanguage();
  const t = siteContent[lang];
  const [open, setOpen] = useState(false);

  return (
    <main className="bg-[#f7f5f2] text-[#1c1c1c] overflow-x-hidden">
      {/* Donation Strip */}
      <DonationStrip />

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 bg-[#f7f5f2]/90 backdrop-blur border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="font-extrabold tracking-wide text-lg">
            GURUJI SHRAWAN
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink href="/" label="Home" />
            <NavLink href="/articles" label={t.nav.articles} />
            <NavLink href="/biography" label={t.nav.biography} />

            <button
              onClick={() => router.push("/donate")}
              className="bg-[#e4572e] text-white px-4 py-1.5 rounded-sm text-sm font-medium"
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
          <div className="md:hidden bg-[#f7f5f2] border-t px-6 py-6 flex flex-col gap-5">
            <NavLink href="/" label="Home" onClick={() => setOpen(false)} />
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
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className="text-xs border px-2 py-2 w-fit"
            >
              {lang === "en" ? "हिंदी" : "EN"}
            </button>
          </div>
        )}
      </header>

      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-28 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-6">
            A Voice for Clarity <br /> in a Noisy World
          </h1>

          <p className="text-[#5f5f5f] text-base sm:text-lg max-w-xl">
            Guruji Shrawan shares direct, honest insights on life,
            conditioning, fear, ambition, and self-understanding through
            digital platforms.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <button
              onClick={() => router.push("/biography")}
              className="border border-black px-6 py-3 text-sm"
            >
              Read Biography →
            </button>

            <button
              onClick={() => router.push("/articles")}
              className="bg-black text-white px-6 py-3 text-sm"
            >
              Explore Articles
            </button>
          </div>
        </div>

        <div>
          <img
            src="/images/hero1.jpg"
            alt="Guruji Shrawan"
            className="w-full h-[260px] sm:h-[420px] object-cover"
          />
        </div>
      </section>

      {/* ================= JOURNEY ================= */}
      <section className="bg-white py-20 sm:py-24 border-t border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold mb-6">
            The Journey So Far
          </h2>

          <p className="text-[#5f5f5f] max-w-3xl mb-16">
            Through consistent dialogue, short videos, and written reflections,
            Guruji Shrawan’s work has reached thousands of seekers.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-4xl font-bold">100+</h3>
              <p className="text-sm text-[#5f5f5f] mt-2">
                YouTube Subscribers
              </p>
            </div>
            <div>
              <h3 className="text-4xl font-bold">700+</h3>
              <p className="text-sm text-[#5f5f5f] mt-2">
                Instagram Followers
              </p>
            </div>
            <div>
              <h3 className="text-4xl font-bold">500+</h3>
              <p className="text-sm text-[#5f5f5f] mt-2">
                Facebook Community
              </p>
            </div>
            <div>
              <h3 className="text-4xl font-bold">Daily</h3>
              <p className="text-sm text-[#5f5f5f] mt-2">
                Short-form Teachings
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED ================= */}
      <section className="bg-white py-20 sm:py-24 border-t border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold mb-12">
            Trending Now
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4">
                Living with Clarity in Modern Times
              </h3>

              <p className="text-[#5f5f5f] mb-6">
                In a world driven by noise and comparison,
                clarity becomes a necessity rather than luxury.
              </p>

              <button
                onClick={() => router.push("/articles")}
                className="border border-black px-6 py-3 text-sm"
              >
                Know More →
              </button>
            </div>

            <div className="order-first md:order-last">
              <img
                src="/images/hero1.jpg"
                alt="Featured article"
                className="w-full h-[260px] sm:h-[320px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= VIDEOS ================= */}
      <VideoGallery title="Podcasts & Video Conversations" />

      <Footer />
    </main>
  );
}
