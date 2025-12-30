"use client";

import { useState, useEffect } from "react";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// Icons
import {
  FaYoutube,
  FaInstagram,
  FaFacebook,
  FaWhatsapp,
  FaPlay,
} from "react-icons/fa";

const quotes = [
  "Truth comes before belief.",
  "Clarity is freedom.",
  "Question deeply. Live honestly.",
  "No ritual without understanding.",
];

export default function Page() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="bg-black text-white min-h-screen">

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold tracking-widest">
            GURUJI SHRAWAN
          </h1>

          <div className="flex gap-5 text-xl">
            <a href="https://youtube.com/@gurujishrawan" target="_blank"><FaYoutube /></a>
            <a href="https://instagram.com/gurujishrawan" target="_blank"><FaInstagram /></a>
            <a href="https://facebook.com/gurujishrawan" target="_blank"><FaFacebook /></a>
            <a href="https://whatsapp.com/channel/0029VbCDS8a0gcfQ34r9Ez37" target="_blank"><FaWhatsapp /></a>
          </div>
        </div>
      </header>

      {/* HERO / CAROUSEL */}
      <section className="pt-28 px-6">
        <Swiper
          modules={[Navigation]}
          navigation
          slidesPerView={1}
          className="rounded-2xl overflow-hidden max-w-6xl mx-auto"
        >
          {[1, 2, 3].map((_, i) => (
            <SwiperSlide key={i}>
              <div
                className="relative h-[420px] flex items-end p-8"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1500530855697-b586d89ba3ee)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black/40"></div>

                <div className="relative z-10">
                  <button className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center mb-4">
                    <FaPlay />
                  </button>

                  <h2 className="text-2xl font-semibold">
                    {quotes[quoteIndex]}
                  </h2>

                  <p className="text-sm text-white/70 mt-2">
                    Watch latest YouTube Shorts
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ABOUT */}
      <section className="max-w-4xl mx-auto text-center py-24 px-6">
        <h2 className="text-3xl font-bold mb-4">About Guruji Shrawan</h2>
        <p className="text-white/70 leading-relaxed">
          A voice for clarity, inquiry and honest living.
          No blind belief. No ritual without understanding.
          Only truth, awareness and freedom.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10 text-center text-sm text-white/50">
        © {new Date().getFullYear()} Guruji Shrawan
      </footer>

    </main>
  );
}
