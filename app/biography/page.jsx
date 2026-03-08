"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaArrowDown } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

export default function BiographyPage() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const grainRef = useRef(null);
  const titleRef = useRef(null);
  const subTitleRef = useRef(null);
  const youngRef = useRef(null);
  const speechRef = useRef(null);
  const profileRef = useRef(null);
  const birdsRef = useRef(null);
  const arrowRef = useRef(null);
  const poemRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([youngRef.current, speechRef.current, profileRef.current, birdsRef.current, arrowRef.current, poemRef.current], { opacity: 0 });
      gsap.set(youngRef.current, { y: 70, scale: 0.9 });
      gsap.set(speechRef.current, { y: 80, x: 40 });
      gsap.set(profileRef.current, { scale: 1.1 });
      gsap.set(poemRef.current, { y: 70 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.3,
        },
      });

      tl.fromTo(titleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 })
        .fromTo(subTitleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "<0.15")
        .to(youngRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.9 }, ">0.2")
        .to(speechRef.current, { opacity: 1, y: 0, x: 0, duration: 0.8 }, ">0.1")
        .to(profileRef.current, { opacity: 0.7, scale: 1, duration: 0.9 }, "<0.1")
        .to(bgRef.current, { background: "radial-gradient(circle at 50% 18%, #642122 0%, #1a0a0a 40%, #040404 100%)", duration: 1.2 }, "<")
        .to(grainRef.current, { opacity: 0.3, duration: 1 }, "<")
        .to(birdsRef.current, { opacity: 0.8, duration: 0.8 }, "<0.2")
        .to(arrowRef.current, { opacity: 1, y: 0, duration: 0.6 }, "<0.2")
        .to([youngRef.current, speechRef.current, profileRef.current, titleRef.current, subTitleRef.current, birdsRef.current, arrowRef.current], { opacity: 0, y: 40, duration: 1.1 }, ">0.7")
        .to(poemRef.current, { opacity: 1, y: 0, duration: 1.2 }, "<0.2");

      gsap.to(birdsRef.current, {
        y: -28,
        repeat: -1,
        yoyo: true,
        duration: 2.5,
        ease: "sine.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[450vh] bg-black">
      <div ref={bgRef} className="sticky top-16 h-[calc(100vh-4rem)] overflow-hidden bg-black md:top-16 md:h-[calc(100vh-4rem)]">
        <div ref={grainRef} className="pointer-events-none absolute inset-0 opacity-0" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "3px 3px" }} />

        <div ref={profileRef} className="absolute -left-10 bottom-0 h-[86%] w-[75%] max-w-[760px] overflow-hidden rounded-tr-[40px] opacity-0 md:left-0 md:w-[58%]">
          <Image src="/images/hero3.jpg" alt="Guruji side profile" fill className="object-cover object-center" priority />
          <div className="absolute inset-0 bg-black/35" />
        </div>

        <div ref={speechRef} className="absolute bottom-10 right-[6%] h-[50%] w-[38%] min-w-[180px] max-w-[340px] overflow-hidden rounded-2xl border border-white/20 opacity-0 shadow-2xl">
          <Image src="/images/hero2.jpg" alt="Guruji speaking" fill className="object-cover" />
        </div>

        <div ref={youngRef} className="absolute bottom-0 left-1/2 h-[68%] w-[44%] min-w-[240px] max-w-[420px] -translate-x-1/2 overflow-hidden rounded-t-[36px] border border-white/20 opacity-0 shadow-2xl">
          <Image src="/images/guruji.jpg" alt="Young Guruji Shrawan" fill className="object-cover" />
        </div>

        <div ref={birdsRef} className="absolute right-[12%] top-[16%] flex gap-4 text-white/80 opacity-0">
          <span className="text-xl">🕊</span>
          <span className="mt-4 text-lg">🕊</span>
          <span className="text-2xl">🕊</span>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <h1 ref={titleRef} className="font-serif text-5xl tracking-wide text-[#f5e9d8] md:text-7xl">Guruji Shrawan</h1>
          <p ref={subTitleRef} className="mt-3 font-serif text-2xl text-[#dac1a4] md:text-3xl">Biography</p>
          <div ref={arrowRef} className="mt-8 translate-y-4 text-[#d8b39a] opacity-0"><FaArrowDown /></div>

          <div ref={poemRef} className="mx-auto mt-8 max-w-3xl px-4 opacity-0">
            <p className="font-serif text-3xl leading-tight text-[#f5e9d8] md:text-5xl">Ek kahani shuru hoti hai<br />jab suraj dhal chuka hota hai...</p>
            <p className="mt-5 text-sm text-[#f1dfcc]/80 md:text-lg">A story begins when the sun has already set — and the search for inner light truly starts.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
