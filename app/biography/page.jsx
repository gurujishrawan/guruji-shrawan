"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Playfair_Display, Inter } from "next/font/google";
import { FaArrowDown } from "react-icons/fa";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500"] });

const chapters = [
  "Introduction",
  "Young Guruji",
  "The Speaker",
  "Inner Profile",
  "Red Dawn",
  "Composition",
  "Poetic Opening",
];

export default function BiographyPage() {
  const [stage, setStage] = useState(0);
  const [loading, setLoading] = useState(true);

  const bgRef = useRef(null);
  const grainRef = useRef(null);
  const smokeRef = useRef(null);

  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const arrowRef = useRef(null);

  const youngRef = useRef(null);
  const speakingRef = useRef(null);
  const profileRef = useRef(null);
  const birdsRef = useRef(null);
  const compositionRef = useRef(null);
  const poemRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) return;
    const auto = setInterval(() => {
      setStage(current => (current + 1) % chapters.length);
    }, 4500);
    return () => clearInterval(auto);
  }, [loading]);

  useEffect(() => {
    if (loading) return;

    const transition = { duration: 1, ease: "power3.out", overwrite: true };

    // base reset for every stage
    gsap.to(bgRef.current, { background: "#000000", ...transition });
    gsap.to(smokeRef.current, { opacity: 0, ...transition });
    gsap.to(grainRef.current, { opacity: 0.04, ...transition });

    gsap.to(titleRef.current, { opacity: 1, y: 0, ...transition });
    gsap.to(subtitleRef.current, { opacity: 1, y: 0, ...transition });
    gsap.to(arrowRef.current, { opacity: 0, y: 14, ...transition });

    gsap.to(profileRef.current, { opacity: 0, scale: 1.12, ...transition });
    gsap.to(speakingRef.current, { opacity: 0, y: 100, x: 38, scale: 0.95, ...transition });
    gsap.to(youngRef.current, { opacity: 0, y: 90, scale: 0.9, ...transition });
    gsap.to(birdsRef.current, { opacity: 0, y: 0, ...transition });
    gsap.to(compositionRef.current, { opacity: 1, y: 0, ...transition });
    gsap.to(poemRef.current, { opacity: 0, y: 65, ...transition });

    if (stage >= 1) {
      gsap.to(youngRef.current, { opacity: 1, y: 0, scale: 1, ...transition });
    }

    if (stage >= 2) {
      gsap.to(speakingRef.current, { opacity: 1, y: 0, x: 0, scale: 1, ...transition });
    }

    if (stage >= 3) {
      gsap.to(profileRef.current, { opacity: 0.7, scale: 1, ...transition });
    }

    if (stage >= 4) {
      gsap.to(bgRef.current, {
        background: "radial-gradient(120% 120% at 50% 10%, #7b1d1f 0%, #321112 45%, #090909 100%)",
        ...transition,
      });
      gsap.to(smokeRef.current, { opacity: 0.45, ...transition });
      gsap.to(grainRef.current, { opacity: 0.2, ...transition });
      gsap.to(birdsRef.current, { opacity: 0.9, ...transition });
    }

    if (stage >= 5) {
      gsap.to(arrowRef.current, { opacity: 1, y: 0, ...transition });
      gsap.to(compositionRef.current, { y: -16, ...transition });
    }

    if (stage === 6) {
      gsap.to([compositionRef.current, titleRef.current, subtitleRef.current, birdsRef.current, arrowRef.current], {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power3.out",
        overwrite: true,
      });
      gsap.to(poemRef.current, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", overwrite: true });
    }
  }, [stage, loading]);

  useEffect(() => {
    if (loading) return;
    const floatBirds = gsap.to(birdsRef.current, {
      y: -20,
      repeat: -1,
      yoyo: true,
      duration: 2.8,
      ease: "sine.inOut",
    });
    const floatSmoke = gsap.to(smokeRef.current, {
      xPercent: 6,
      repeat: -1,
      yoyo: true,
      duration: 5,
      ease: "sine.inOut",
    });

    return () => {
      floatBirds.kill();
      floatSmoke.kill();
    };
  }, [loading]);

  return (
    <section className="relative h-[calc(100vh-4rem)] overflow-hidden bg-black">
      <div ref={bgRef} className="absolute inset-0 bg-black" />

      <div
        ref={smokeRef}
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 25%, rgba(120,47,33,0.32), transparent 45%), radial-gradient(circle at 75% 55%, rgba(95,36,25,0.28), transparent 42%)",
          filter: "blur(12px)",
        }}
      />

      <div
        ref={grainRef}
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      <Link
        href="/"
        className={`${inter.className} absolute left-4 top-4 z-50 rounded-full border border-[#f4d9bf]/40 bg-black/45 px-4 py-2 text-sm text-[#f5e7d4] backdrop-blur hover:bg-black/60 md:left-6 md:top-6`}
      >
        ← Back
      </Link>

      <aside className="absolute right-3 top-1/2 z-50 hidden -translate-y-1/2 md:block">
        <div className="relative pr-4">
          <div className="absolute right-0 top-1 h-[92%] w-[3px] bg-white/30" />
          <div className="absolute right-0 top-1 w-[3px] bg-white transition-all duration-500" style={{ height: `${((stage + 1) / chapters.length) * 92}%` }} />
          <ul className="space-y-5 text-right">
            {chapters.map((chapter, index) => (
              <li key={chapter} className="relative">
                <button
                  type="button"
                  onClick={() => setStage(index)}
                  className={`${playfair.className} pr-5 text-lg leading-none transition ${index === stage ? "text-[#f5e7d4]" : "text-[#d2b79a]/70 hover:text-[#f5e7d4]"}`}
                >
                  {chapter}
                </button>
                <span className={`absolute -right-[5px] top-1/2 h-[9px] w-[9px] -translate-y-1/2 rounded-sm ${index <= stage ? "bg-white" : "bg-white/35"}`} />
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div ref={compositionRef} className="absolute inset-0">
        <div ref={profileRef} className="absolute -left-8 bottom-0 h-[92%] w-[78%] max-w-[760px] overflow-hidden rounded-tr-[44px] opacity-0 md:left-0 md:w-[60%]">
          <Image src="/images/hero3.jpg" alt="Guruji Shrawan side profile" fill className="object-cover object-center" priority />
          <div className="absolute inset-0 bg-black/35" />
        </div>

        <div ref={speakingRef} className="absolute bottom-10 right-[7%] h-[52%] w-[40%] min-w-[180px] max-w-[350px] overflow-hidden rounded-2xl border border-[#f4d9bf]/25 opacity-0 shadow-2xl">
          <Image src="/images/hero2.jpg" alt="Guruji speaking" fill className="object-cover" />
        </div>

        <div ref={youngRef} className="absolute bottom-0 left-1/2 h-[72%] w-[46%] min-w-[230px] max-w-[430px] -translate-x-1/2 overflow-hidden rounded-t-[38px] border border-[#f4d9bf]/25 opacity-0 shadow-2xl">
          <Image src="/images/guruji.jpg" alt="Young Guruji Shrawan portrait" fill className="object-cover" />
        </div>
      </div>

      <div ref={birdsRef} className="absolute right-[12%] top-[15%] flex gap-4 text-[#f3d8bb]/85 opacity-0">
        <span className="text-xl">🕊</span>
        <span className="mt-4 text-lg">🕊</span>
        <span className="text-2xl">🕊</span>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <h1 ref={titleRef} className={`${playfair.className} text-5xl tracking-wide text-[#f5e7d4] md:text-7xl`}>
          Guruji Shrawan
        </h1>
        <p ref={subtitleRef} className={`${playfair.className} mt-3 text-2xl text-[#dfc3a3] md:text-3xl`}>
          Biography
        </p>

        <div ref={arrowRef} className="mt-8 text-[#d8b493] opacity-0">
          <FaArrowDown />
        </div>

        <div ref={poemRef} className="mx-auto mt-10 max-w-4xl px-4 opacity-0">
          <p className={`${playfair.className} text-3xl leading-tight text-[#f7e8d6] md:text-5xl`}>
            Ek kahani shuru hoti hai
            <br />
            jab suraj dhal chuka hota hai...
          </p>
          <p className={`${inter.className} mt-6 text-sm text-[#f1ddc7]/85 md:text-lg`}>
            A story begins when the sun has already set — and the search for
            inner clarity becomes the only light left to follow.
          </p>
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 z-[60] grid place-items-center bg-black">
          <div className="text-center">
            <p className={`${playfair.className} text-2xl text-[#f5e7d4] md:text-4xl`}>Guruji Shrawan</p>
            <p className={`${inter.className} mt-2 text-sm text-[#d4b79b]`}>Loading biography timeline...</p>
            <div className="mx-auto mt-6 h-[2px] w-44 overflow-hidden bg-white/25">
              <div className="h-full w-24 animate-[loader_1.8s_ease-in-out_infinite] bg-white" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
