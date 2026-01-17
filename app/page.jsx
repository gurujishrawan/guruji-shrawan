"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "./context/LanguageContext";
import { siteContent } from "./content/siteContent";
import VideoGallery from "./components/VideoGallery";
import Footer from "./components/Footer";
import {
  FaYoutube,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";

/* ---------------- NAV LINK ---------------- */
function NavLink({ href, label }) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <button
      onClick={() => router.push(href)}
      className={`text-sm font-medium transition ${
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
    <div className="bg-[#111] text-white text-sm py-2 text-center">
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

  return (
    <main className="bg-[#f7f5f2] text-[#1c1c1c]">
      {/* Donation Strip */}
      <DonationStrip />

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 bg-[#f7f5f2]/90 backdrop-blur border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-extrabold tracking-wide">
            GURUJI SHRAWAN
          </div>

          <nav className="flex items-center gap-8">
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
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            A Voice for Clarity <br /> in a Noisy World
          </h1>

          <p className="text-[#5f5f5f] text-lg max-w-xl">
            Guruji Shrawan shares direct, honest insights on life,
            conditioning, fear, ambition, and self-understanding through
            digital platforms and public discourse.
          </p>

          <div className="flex gap-4 mt-10">
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

        <div className="relative">
          <img
            src="/images/hero1.jpg"
            alt="Guruji Shrawan"
            className="w-full h-[420px] object-cover"
          />
        </div>
      </section>

      {/* ================= JOURNEY / IMPACT ================= */}
      <section className="bg-[#fff] py-24 border-t border-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">
            The Journey So Far
          </h2>

          <p className="text-[#5f5f5f] max-w-3xl mb-16">
            Through consistent dialogue, short videos, and written reflections,
            Guruji Shrawan’s work has reached thousands of seekers across
            platforms, encouraging clarity over belief.
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

{/* ================= FEATURED ARTICLE ================= */}
<section className="bg-white py-24 border-t border-black/10">
  <div className="max-w-7xl mx-auto px-6">
    <h2 className="text-3xl font-bold mb-12">
      Trending Now
    </h2>

    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h3 className="text-2xl font-semibold mb-4">
          Living with Clarity in Modern Times
        </h3>

        <p className="text-[#5f5f5f] mb-6 leading-relaxed">
          In a world driven by noise, ambition, and constant comparison,
          clarity becomes not a luxury but a necessity. This article explores
          what it truly means to live with awareness rather than belief.
        </p>

        <div className="flex items-center gap-6 text-sm text-gray-500 mb-8">
          <span>⏱ 6 min read</span>
          <span>📖 Article</span>
        </div>

        <button
          onClick={() => router.push("/articles")}
          className="border border-black px-6 py-3 text-sm"
        >
          Know More →
        </button>
      </div>

      <div>
        <img
          src="/images/hero1.jpg"
          alt="Featured article"
          className="w-full h-[320px] object-cover"
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
