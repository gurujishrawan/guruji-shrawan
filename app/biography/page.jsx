"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Playfair_Display, Inter } from "next/font/google";
import { FaArrowDown } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500"] });

export default function BiographyPage() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
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

  const compositionGroupRef = useRef(null);
  const poemRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([youngRef.current, speakingRef.current, profileRef.current, birdsRef.current, arrowRef.current, poemRef.current], { opacity: 0 });
      gsap.set(youngRef.current, { y: 90, scale: 0.9 });
      gsap.set(speakingRef.current, { y: 100, x: 40, scale: 0.95 });
      gsap.set(profileRef.current, { scale: 1.12 });
      gsap.set(arrowRef.current, { y: 14 });
      gsap.set(poemRef.current, { y: 70 });
      gsap.set(smokeRef.current, { opacity: 0 });
      gsap.set(grainRef.current, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
        },
      });

      tl.fromTo(titleRef.current, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.9 })
        .fromTo(subtitleRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, "<0.2")

        // Stage 2: young portrait
        .to(youngRef.current, { opacity: 1, y: 0, scale: 1, duration: 1.0 }, ">0.2")

        // Stage 3: speaking portrait
        .to(speakingRef.current, { opacity: 1, y: 0, x: 0, scale: 1, duration: 1.0 }, ">0.12")

        // Stage 4: large profile in background
        .to(profileRef.current, { opacity: 0.72, scale: 1.0, duration: 1.0 }, "<0.1")

        // Stage 5: bg transformation + birds
        .to(bgRef.current, { background: "radial-gradient(120% 120% at 50% 10%, #7b1d1f 0%, #321112 45%, #090909 100%)", duration: 1.3 }, "<")
        .to(smokeRef.current, { opacity: 0.45, duration: 1.1 }, "<0.1")
        .to(grainRef.current, { opacity: 0.22, duration: 1.0 }, "<0.05")
        .to(birdsRef.current, { opacity: 0.9, duration: 0.9 }, "<0.2")

        // Stage 6: final composition + arrow
        .to(arrowRef.current, { opacity: 1, y: 0, duration: 0.6 }, ">0.05")
        .to(compositionGroupRef.current, { y: -18, duration: 0.8 }, "<")

        // Stage 7: transition to poem
        .to([compositionGroupRef.current, titleRef.current, subtitleRef.current, birdsRef.current, arrowRef.current], { opacity: 0, y: 60, duration: 1.1 }, ">0.9")
        .to(poemRef.current, { opacity: 1, y: 0, duration: 1.2 }, "<0.2");

      gsap.to(birdsRef.current, {
        y: -24,
        repeat: -1,
        yoyo: true,
        duration: 2.8,
        ease: "sine.inOut",
      });

      gsap.to(smokeRef.current, {
        xPercent: 6,
        repeat: -1,
        yoyo: true,
        duration: 5,
        ease: "sine.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[460vh] bg-black">
      <div
        ref={canvasRef}
        className="sticky top-16 h-[calc(100vh-4rem)] overflow-hidden"
      >
        <div ref={bgRef} className="absolute inset-0 bg-black" />


        <Link
          href="/"
          className={`${inter.className} absolute left-4 top-4 z-50 rounded-full border border-[#f4d9bf]/40 bg-black/45 px-4 py-2 text-sm text-[#f5e7d4] backdrop-blur hover:bg-black/60 md:left-6 md:top-6`}
        >
          ← Back
        </Link>

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
            backgroundImage: "radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />

        <div ref={compositionGroupRef} className="absolute inset-0">
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
      </div>
    </section>
  );
}
