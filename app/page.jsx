"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import {
  FaYoutube,
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function Page() {
  /* ================= QUOTES ================= */
  const quotes = [
    "Clarity matters more than comfort.",
    "Truth without apology.",
    "Question deeply. Live honestly.",
  ];
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        setFade(true);
      }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  /* ================= NAVBAR ================= */
  const [menuOpen, setMenuOpen] = useState(false);

  /* ================= HERO IMAGES ================= */
  const heroImages = [
    "images/hero1.jpg",
    "images/hero2.jpg",
    "images/hero3.jpg",
  ];
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const imgInterval = setInterval(() => {
      setHeroIndex((p) => (p + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(imgInterval);
  }, []);

  /* ================= YOUTUBE SHORT IDS ================= */
  const shorts = [
    "eJ-_kdBVlaY",
    "UhGADiUrGFQ",
    "P-o8d-dmFH4",
    "ZX81lMSwy-E",
    "oHg7pNF2cFg",
  ];

  return (
    <main className="bg-white text-black font-sans">
      {/* ================= NAVBAR ================= */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="images/guruji.jpg"
              alt="Guruji"
              className="w-9 h-9 rounded-full object-cover"
            />
            <div className="leading-tight">
              <div className="text-xs tracking-widest text-gray-600">
                GURUJI
              </div>
              <div className="text-lg font-extrabold tracking-tight">
                SHRAWAN
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm">
            {["Home", "Shorts", "Biography"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="relative hover:text-black text-gray-600 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-black after:transition-all hover:after:w-full"
              >
                {item}
              </a>
            ))}

            <a
              href="https://whatsapp.com/channel/0029VbCDS8a0gcfQ34r9Ez37"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-full border border-black/20 hover:bg-black hover:text-white transition"
            >
              Join Channel
            </a>
          </nav>

          {/* Mobile */}
          <button
            className="md:hidden text-2xl text-black"
            onClick={() => setMenuOpen(true)}
          >
            <FaBars />
          </button>
        </div>

        {/* Mobile Drawer */}
        {menuOpen && (
          <div className="fixed inset-0 bg-white z-50 p-6">
            <button
              className="text-2xl mb-8 text-black"
              onClick={() => setMenuOpen(false)}
            >
              <FaTimes />
            </button>

            <nav className="flex flex-col gap-6 text-xl">
              <a href="#home" onClick={() => setMenuOpen(false)} className="text-black">
                Home
              </a>
              <a href="#shorts" onClick={() => setMenuOpen(false)} className="text-black">
                Shorts
              </a>
              <a href="#biography" onClick={() => setMenuOpen(false)} className="text-black">
                Biography
              </a>
              <a
                href="https://whatsapp.com/channel/0029VbCDS8a0gcfQ34r9Ez37"
                target="_blank"
                rel="noreferrer"
                className="text-black"
              >
                Join WhatsApp Channel
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* ================= HERO ================= */}
      <section
        id="home"
        className="min-h-screen pt-16 grid md:grid-cols-[42%_58%]"
      >
        {/* Left */}
        <div className="flex flex-col justify-center px-8 md:px-16 bg-white">
          <div className="text-xs tracking-widest text-gray-600 mb-2">
            GURUJI
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            SHRAWAN
          </h1>

          <p
            className={`text-xl md:text-2xl max-w-xl transition-all duration-500 ${fade ? "opacity-100" : "opacity-0"
              }`}
          >
            {quotes[quoteIndex]}
          </p>

          <p className="text-gray-600 mt-4 max-w-lg">
            Short, clear teachings focused on clarity and freedom — not belief or ritual.
          </p>

          <div className="flex gap-4 mt-8 flex-wrap">
            <a
              href="#biography"
              className="bg-black text-white px-6 py-3 rounded font-semibold hover:bg-gray-800 transition"
            >
              Read Biography
            </a>
            <a
              href="#shorts"
              className="border border-black px-6 py-3 rounded hover:bg-black hover:text-white transition"
            >
              Watch Shorts
            </a>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative w-full h-full">
          <img
            src={heroImages[heroIndex]}
            alt="Hero"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          />
          {/* subtle dark overlay so text stays readable */}
          <div className="absolute inset-0 bg-black/30" />
        </div>
      </section>

      {/* ================= SHORTS ================= */}
      <section id="shorts" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-2">YouTube Shorts</h2>
          <p className="text-gray-600 mb-8">
            Tap thumbnail to open YouTube Shorts
          </p>

          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={20}
            slidesPerView={1.2}
            breakpoints={{
              640: { slidesPerView: 2.2 },
              1024: { slidesPerView: 3.2 },
            }}
          >
            {shorts.map((id) => (
              <SwiperSlide key={id}>
                <a
                  href={`https://www.youtube.com/shorts/${id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block relative rounded-xl overflow-hidden"
                >
                  <img
                    src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
                    className="w-full h-[420px] object-cover"
                    alt="short"
                  />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-black/80 flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[14px] border-l-white border-y-[10px] border-y-transparent ml-1" />
                    </div>
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ================= BIO ================= */}
      <section id="biography" className="py-20 bg-white border-t border-black/10">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
          <img
            src="images/guruji.jpg"
            alt="Guruji"
            className="w-full max-w-sm rounded-full mx-auto"
          />

          <div>
            <h3 className="text-2xl font-semibold mb-4">
              About Guruji Shrawan
            </h3>
            <p className="text-gray-600">
              A teacher dedicated to clarity, deep understanding and practical guidance.
              Focused on removing confusion and helping people live consciously.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
