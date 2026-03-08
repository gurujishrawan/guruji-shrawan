"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Playfair_Display, Inter, Poppins } from "next/font/google";
import { FaArrowDown, FaBars, FaTimes } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"] });

const chapters = [
  { id: "chapter-1", title: "Early Life", text: "Born into ordinary circumstances, Guruji Shrawan’s early years were marked by sharp observation and an unusual inner sensitivity." },
  { id: "chapter-2", title: "First Questions", text: "Instead of accepting inherited beliefs, he began questioning the roots of fear, identity, and social conditioning." },
  { id: "chapter-3", title: "Turning Inward", text: "Through sustained inquiry, silence, and direct seeing, his work evolved from personal search into a shared dialogue." },
  { id: "chapter-4", title: "Public Dialogues", text: "His talks brought rational spirituality to contemporary audiences — youth, professionals, and seekers of clarity." },
  { id: "chapter-5", title: "Living Inquiry", text: "The core invitation remains simple: don’t follow blindly, look deeply; don’t believe quickly, understand directly." },
];

export default function BiographyPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState(chapters[0].id);
  const [showRail, setShowRail] = useState(false);

  const coverRef = useRef(null);
  const birdsRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const arrowRef = useRef(null);

  const chapterRefs = useRef({});

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
      gsap.fromTo(subtitleRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.12, ease: "power2.out" });
      gsap.fromTo(arrowRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.25, ease: "power2.out" });

      gsap.to(birdsRef.current, {
        y: -12,
        repeat: -1,
        yoyo: true,
        duration: 2.1,
        ease: "sine.inOut",
      });

      chapters.forEach(chapter => {
        const el = chapterRefs.current[chapter.id];
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 28, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "top 35%",
              toggleActions: "play none none reverse",
              onEnter: () => setActiveChapter(chapter.id),
              onEnterBack: () => setActiveChapter(chapter.id),
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  const jumpToChapter = (id) => {
    const el = chapterRefs.current[id];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return (
    <main className="bg-black text-white">
      {/* COVER INTRO */}
      <section ref={coverRef} className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,#8a2a2d_0%,#4a1619_45%,#0a0a0a_100%)]" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "3px 3px" }} />

        <Link href="/" className={`${inter.className} absolute left-4 top-4 z-50 rounded-full border border-[#f4d9bf]/40 bg-black/35 px-4 py-2 text-sm text-[#f5e7d4] backdrop-blur hover:bg-black/60 md:left-6 md:top-6`}>
          ← Back
        </Link>

        <button
          type="button"
          onClick={() => document.getElementById("biography-content")?.scrollIntoView({ behavior: "smooth" })}
          className={`${poppins.className} absolute right-3 top-1/2 z-50 hidden -translate-y-1/2 rounded-l-full border border-[#f4d9bf]/30 bg-black/40 px-4 py-3 text-xs tracking-[0.18em] text-[#f4d9bf] backdrop-blur transition hover:bg-black/60 lg:block`}
          aria-label="Open biography details"
        >
          NEXT →
        </button>

        <div className="absolute inset-0">
          <div className="absolute -left-8 bottom-0 h-[88%] w-[76%] max-w-[780px] overflow-hidden rounded-tr-[42px] md:left-0 md:w-[58%]">
            <Image src="/images/hero3.jpg" alt="Profile portrait" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-black/35" />
          </div>

          <div className="absolute bottom-12 right-[7%] h-[50%] w-[38%] min-w-[170px] max-w-[360px] overflow-hidden rounded-2xl border border-[#f4d9bf]/25 shadow-2xl">
            <Image src="/images/hero2.jpg" alt="Guruji speaking" fill className="object-cover" />
          </div>

          <div className="absolute bottom-0 left-1/2 h-[70%] w-[45%] min-w-[220px] max-w-[420px] -translate-x-1/2 overflow-hidden rounded-t-[36px] border border-[#f4d9bf]/25 shadow-2xl">
            <Image src="/images/guruji.jpg" alt="Young portrait" fill className="object-cover" />
          </div>
        </div>

        <div ref={birdsRef} className="absolute right-[14%] top-[16%] flex gap-3 text-[#f3d8bb]/90">
          <span className="text-xl">🕊</span>
          <span className="mt-3 text-lg">🕊</span>
          <span className="text-2xl">🕊</span>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h1 ref={titleRef} className={`${playfair.className} text-5xl text-[#f7e9d8] md:text-7xl`}>Guruji Shrawan</h1>
          <p ref={subtitleRef} className={`${playfair.className} mt-3 text-2xl text-[#e0c4a6] md:text-4xl`}>Biography</p>
          <button
            ref={arrowRef}
            type="button"
            onClick={() => document.getElementById("biography-content")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-8 text-[#efd8bf] transition hover:scale-110"
            aria-label="Scroll to biography chapters"
          >
            <FaArrowDown className="animate-bounce" />
          </button>
        </div>
      </section>

      {/* BIOGRAPHY CHAPTERS */}
      <section id="biography-content" className="relative bg-[#0d0d0f] py-14 md:py-20">
        <div className="mx-auto w-[min(920px,92%)] space-y-6">
          {chapters.map((chapter, idx) => (
            <article
              key={chapter.id}
              id={chapter.id}
              ref={(el) => {
                chapterRefs.current[chapter.id] = el;
              }}
              className="rounded-2xl border border-white/10 bg-[linear-gradient(145deg,#1a1a1d,#111114)] p-6 shadow-xl md:p-8"
            >
              <p className={`${poppins.className} text-xs tracking-[0.22em] text-[#d9b998]`}>CHAPTER {String(idx + 1).padStart(2, "0")}</p>
              <h2 className={`${playfair.className} mt-3 text-3xl text-[#f6e6d4] md:text-4xl`}>{chapter.title}</h2>
              <p className={`${inter.className} mt-4 text-sm leading-relaxed text-white/80 md:text-lg`}>{chapter.text}</p>
            </article>
          ))}
        </div>

        {/* Desktop hover rail */}
        <div
          className="absolute right-0 top-0 hidden h-full w-24 md:block"
          onMouseEnter={() => setShowRail(true)}
          onMouseLeave={() => setShowRail(false)}
        >
          <aside className={`fixed right-3 top-1/2 z-40 -translate-y-1/2 transition-all duration-300 ${showRail ? "opacity-100" : "pointer-events-none opacity-0"}`}>
            <div className="relative pr-4">
              <div className="absolute right-0 top-1 h-[92%] w-[3px] bg-white/30" />
              <ul className="space-y-5 text-right">
                {chapters.map((chapter, index) => (
                  <li key={chapter.id} className="relative">
                    <button
                      type="button"
                      onClick={() => jumpToChapter(chapter.id)}
                      className={`${poppins.className} pr-5 text-xs ${activeChapter === chapter.id ? "text-[#f5e7d4]" : "text-[#d2b79a]/70 hover:text-[#f5e7d4]"}`}
                    >
                      {chapter.title}
                    </button>
                    <span className={`absolute -right-[5px] top-1/2 h-[9px] w-[9px] -translate-y-1/2 rounded-sm ${index <= chapters.findIndex(item => item.id === activeChapter) ? "bg-white" : "bg-white/35"}`} />
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* Mobile hamburger index */}
        <div className="fixed bottom-4 right-4 z-50 md:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(value => !value)}
            className="rounded-full border border-white/20 bg-black/70 p-3 text-white backdrop-blur"
            aria-label="Toggle biography chapter index"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {menuOpen && (
          <div className="fixed inset-0 z-40 bg-black/70 md:hidden" onClick={() => setMenuOpen(false)}>
            <div className="absolute right-0 top-0 h-full w-72 bg-[#111114] p-6" onClick={event => event.stopPropagation()}>
              <p className={`${poppins.className} text-xs tracking-[0.2em] text-[#d9b998]`}>BIOGRAPHY INDEX</p>
              <ul className="mt-5 space-y-4">
                {chapters.map(chapter => (
                  <li key={chapter.id}>
                    <button
                      type="button"
                      onClick={() => jumpToChapter(chapter.id)}
                      className={`${poppins.className} text-left text-sm ${activeChapter === chapter.id ? "text-white" : "text-white/75"}`}
                    >
                      {chapter.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
