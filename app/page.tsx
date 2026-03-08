"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useEffect, useRef, useState, type ReactElement } from "react";
import {
  FaArrowRight,
  FaAngleLeft,
  FaAngleRight,
  FaBars,
  FaBookOpen,
  FaFacebook,
  FaGlobe,
  FaInstagram,
  FaPlay,
  FaTimes,
  FaVideo,
  FaYoutube,
} from "react-icons/fa";

type Stat = { label: string; value: number; suffix: string; icon: ReactElement };
type NewsletterStatus = "idle" | "loading" | "success";

const homeNavItems = [
  { label: "Home", href: "#home" },
  { label: "In Media", href: "#trending" },
  { label: "YouTube", href: "https://youtube.com/@gurujishrawan", external: true },
  { label: "Teachings", href: "#teachings" },
  { label: "Live Sessions", href: "#videos" },
  { label: "Articles", href: "#articles" },
  { label: "Books", href: "#books" },
  { label: "Video Series", href: "#videos" },
  { label: "Contact", href: "#contact" },
];

const homeContent = {
  English: {
    heroTitle: "Awakening Inner Clarity and True Understanding",
    heroDesc:
      "Guruji Shrawan shares deep insights on life, spirituality, relationships, society, and modern confusion through fearless inquiry and timeless wisdom. The teachings encourage freedom from blind belief, self-deception, and unconscious living.",
    watchTeachings: "Watch Teachings",
    exploreArticles: "Explore Articles",
    booksTitle: "Books by Guruji Shrawan",
    booksDesc:
      "A growing library of powerful books exploring Vedanta, self-inquiry, freedom from psychological suffering, relationships, youth awakening, and conscious living.",
    videosTitle: "Videos",
  },
  Hindi: {
    heroTitle: "आंतरिक स्पष्टता और सच्ची समझ की ओर",
    heroDesc:
      "गुरुजी श्रावण जीवन, अध्यात्म, संबंध, समाज और आधुनिक भ्रम पर निडर और गहरी दृष्टि साझा करते हैं। ये शिक्षाएँ अंधविश्वास, आत्म-छल और अचेतन जीवन से मुक्ति की दिशा दिखाती हैं।",
    watchTeachings: "वीडियो देखें",
    exploreArticles: "लेख पढ़ें",
    booksTitle: "गुरुजी श्रावण की पुस्तकें",
    booksDesc:
      "वेदांत, आत्म-परीक्षण, मानसिक संघर्ष से मुक्ति, संबंध, युवा जागरण और सजग जीवन पर आधारित पुस्तकों का समृद्ध संग्रह।",
    videosTitle: "वीडियो",
  },
} as const;

const stats: Stat[] = [
  { label: "Books", value: 2, suffix: "+", icon: <FaBookOpen /> },
  { label: "Total Followers", value: 6200, suffix: "+", icon: <FaGlobe /> },
  { label: "YouTube Views", value: 100, suffix: "K+", icon: <FaYoutube /> },
  { label: "Articles Published", value: 10, suffix: "+", icon: <FaBookOpen /> },
  { label: "Videos", value: 120, suffix: "+", icon: <FaVideo /> },
];

const books = [
  "Vedanta for Modern Life",
  "Freedom from Inner Conflict",
  "Beyond Blind Belief",
  "Relationships with Clarity",
  "Awakening Youth Consciousness",
];

const videos = [
  { id: "Hs90ewhPAww", title: "YouTube Teaching Session 1" },
  { id: "LsfnbDBhxjM", title: "YouTube Teaching Session 2" },
  { id: "9QVnaoOZLe4", title: "YouTube Teaching Session 3" },
  { id: "f2ZrDTv8u5A", title: "YouTube Teaching Session 4" },
  { id: "Uy0vnC-8sOc", title: "YouTube Teaching Session 5" },
];

const articles = [
  { category: "Spirituality", title: "Inquiry Is the Fire of Real Transformation", readTime: "6 min read" },
  { category: "Mind", title: "Attention vs. Distraction in the Digital Age", readTime: "5 min read" },
  { category: "Relationships", title: "Possession Is Not Love", readTime: "7 min read" },
  { category: "Society", title: "Belief, Fear and Collective Confusion", readTime: "8 min read" },
  { category: "Self Inquiry", title: "Who Is the One That Suffers?", readTime: "6 min read" },
  { category: "Youth", title: "A Conscious Direction for Young Minds", readTime: "4 min read" },
];

const socialLinks = [
  { name: "YouTube", count: "2.2K+", icon: <FaYoutube />, href: "https://youtube.com/@gurujishrawan" },
  { name: "Instagram", count: "1K+", icon: <FaInstagram />, href: "https://instagram.com/gurujishrawan" },
  { name: "Facebook", count: "3K", icon: <FaFacebook />, href: "https://facebook.com/gurujishrawan" },
  { name: "Total", count: "6.2K+", icon: <FaGlobe />, href: "https://youtube.com/@gurujishrawan" },
];

function CounterCard({ item }: { item: Stat }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1200;
    const run = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      setCount(Math.floor(progress * item.value));
      if (progress < 1) raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [inView, item.value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
    >
      <div className="mb-4 inline-flex rounded-full bg-[#ff6a00]/10 p-3 text-[#ff6a00]">{item.icon}</div>
      <p className="text-3xl font-bold tracking-tight text-[#141414]">{count}{item.suffix}</p>
      <p className="mt-1 text-sm text-[#4f4f4f]">{item.label}</p>
    </motion.div>
  );
}

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [hindi, setHindi] = useState(true);
  const [english, setEnglish] = useState(true);
  const [newsletterStatus, setNewsletterStatus] = useState<NewsletterStatus>("idle");
  const [newsletterMsg, setNewsletterMsg] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState<"Hindi" | "English">("English");
  const [videoSwiper, setVideoSwiper] = useState<{ slidePrev: () => void; slideNext: () => void } | null>(null);
  const content = homeContent[lang];

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewsletterStatus("loading");
    setNewsletterMsg("");
    await new Promise(resolve => setTimeout(resolve, 350));
    setNewsletterStatus("success");
    setNewsletterMsg(`Subscribed ${email} for ${[hindi && "Hindi", english && "English"].filter(Boolean).join(" & ") || "updates"}.`);
    setEmail("");
  };

  return (
    <div id="home" className="bg-[#f8f6f2] text-[#161616]">
      <header className={`sticky top-0 z-50 border-b border-black/10 bg-white/80 backdrop-blur transition-all ${scrolled ? "py-2" : "py-4"}`}>
        <div className="mx-auto flex w-[min(1200px,92%)] items-center justify-between gap-8">
          <a href="#home" className="text-xl font-semibold">Guruji Shrawan</a>
          <nav className="hidden xl:flex items-center gap-5 text-sm text-black/70">
            {homeNavItems.map(item => (
              item.external ? (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="hover:text-[#ff6a00]">{item.label}</a>
              ) : (
                <a key={item.label} href={item.href} className="hover:text-[#ff6a00]">{item.label}</a>
              )
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <label className="rounded-full border border-black/20 bg-white px-3 py-2 text-xs">
              <span className="sr-only">Choose language</span>
              <select
                value={lang}
                onChange={event => setLang(event.target.value as "Hindi" | "English")}
                className="bg-transparent text-xs"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
              </select>
            </label>
            <Link href="/donate" className="rounded-full bg-[#ff6a00] px-5 py-2 text-sm font-semibold text-white">Donate</Link>
          </div>
          <button onClick={() => setMenuOpen(v => !v)} type="button" className="md:hidden"><FaBars /></button>
        </div>
        {menuOpen && (
          <div className="mt-3 border-t border-black/10 bg-white p-4 md:hidden">
            <div className="flex justify-end"><button onClick={() => setMenuOpen(false)} type="button"><FaTimes /></button></div>
            <div className="mt-2 grid gap-3 text-sm">
              {homeNavItems.map(item => (
                item.external ? (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>{item.label}</a>
                ) : (
                  <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>
                )
              ))}
              <label className="rounded-full border border-black/20 bg-white px-4 py-2 text-xs">
                <span className="sr-only">Choose language</span>
                <select
                  value={lang}
                  onChange={event => setLang(event.target.value as "Hindi" | "English")}
                  className="w-full bg-transparent"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </label>
              <Link href="/donate" onClick={() => setMenuOpen(false)} className="rounded-full bg-[#ff6a00] px-4 py-2 text-center font-semibold text-white">Donate</Link>
            </div>
          </div>
        )}
      </header>

      <section id="teachings" className="mx-auto grid w-[min(1200px,92%)] gap-12 py-14 lg:grid-cols-2 lg:py-20">
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <p className="text-sm uppercase tracking-[0.2em] text-[#ff6a00]">Guruji Shrawan</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-6xl">{content.heroTitle}</h1>
          <p className="mt-6 max-w-xl text-lg text-black/70">{content.heroDesc}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#videos" className="rounded-full bg-[#ff6a00] px-6 py-3 text-sm font-semibold text-white">{content.watchTeachings}</a>
            <Link href="/articles" className="rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-semibold">{content.exploreArticles}</Link>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-[#ff6a00]/25 via-transparent to-[#161616]/15 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-black/10 shadow-xl">
            <Image src="/images/guruji.jpg" alt="Portrait of Guruji Shrawan" width={700} height={900} className="h-full w-full object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent" />
          </div>
        </motion.div>
      </section>

      <section className="mx-auto w-[min(1200px,92%)] py-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{stats.map(item => <CounterCard key={item.label} item={item} />)}</div>
      </section>

      <section id="books" className="mx-auto w-[min(1200px,92%)] py-16">
        <h2 className="text-3xl font-semibold">{content.booksTitle}</h2>
        <p className="mt-3 max-w-3xl text-black/70">{content.booksDesc}</p>
        <div className="mt-8 flex snap-x gap-5 overflow-x-auto pb-3">
          {books.map((book, i) => (
            <motion.article key={book} whileHover={{ y: -6 }} className="min-w-[280px] snap-start rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
              <div className="relative mb-4 h-44 overflow-hidden rounded-xl bg-[#f1ebe2]">
                <Image src={`/images/hero${(i % 3) + 1}.jpg`} alt={book} fill className="object-cover" />
              </div>
              <h3 className="text-lg font-semibold">{book}</h3>
              <p className="mt-2 text-sm text-black/70">Concise explorations to bring clarity, intelligence, and freedom to daily life.</p>
              <Link href="/articles" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#ff6a00]">Read <FaArrowRight /></Link>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="videos" className="mx-auto w-[min(1200px,92%)] py-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-3xl font-semibold">{content.videosTitle}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => videoSwiper?.slidePrev()}
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-[#ff6a00]/60 bg-white text-[#ff6a00]"
              aria-label="Previous videos"
            >
              <FaAngleLeft />
            </button>
            <button
              onClick={() => videoSwiper?.slideNext()}
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-[#ff6a00]/60 bg-white text-[#ff6a00]"
              aria-label="Next videos"
            >
              <FaAngleRight />
            </button>
          </div>
        </div>

        <Swiper
          onSwiper={setVideoSwiper}
          spaceBetween={20}
          slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            900: { slidesPerView: 3.2 },
            1200: { slidesPerView: 4.2 },
          }}
        >
          {videos.map(video => (
            <SwiperSlide key={video.id}>
              <a
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="relative h-44 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
                  <Image
                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 grid place-items-center bg-black/20">
                    <span className="rounded-full bg-white/90 p-3 text-[#ff6a00]">
                      <FaPlay />
                    </span>
                  </div>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section id="trending" className="mx-auto w-[min(1200px,92%)] py-12">
        <div className="overflow-hidden rounded-3xl bg-[#161616] p-8 text-white md:p-12">
          <p className="text-sm uppercase tracking-[0.2em] text-[#ff6a00]">Trending Now</p>
          <h2 className="mt-3 text-4xl font-semibold">Awakening Conscious Living</h2>
          <p className="mt-4 max-w-2xl text-white/80">A movement encouraging people to live with awareness, responsibility, and freedom from blind beliefs. The mission is to bring clarity to individuals facing confusion in modern society.</p>
          <Link href="/biography" className="mt-6 inline-block rounded-full bg-[#ff6a00] px-6 py-3 text-sm font-semibold">Know More</Link>
        </div>
      </section>

      <section id="articles" className="mx-auto w-[min(1200px,92%)] py-12">
        <h2 className="text-3xl font-semibold">Latest Articles</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <article key={article.title} className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
              <div className="relative h-44 overflow-hidden rounded-xl">
                <Image src={`/images/hero${(i % 3) + 1}.jpg`} alt={article.title} fill className="object-cover" />
              </div>
              <p className="mt-4 text-xs uppercase tracking-wide text-[#ff6a00]">{article.category}</p>
              <h3 className="mt-2 text-xl font-semibold">{article.title}</h3>
              <p className="mt-2 text-sm text-black/70">{article.readTime} · Explore practical inquiry for a clear and intelligent life.</p>
              <Link href="/articles" className="mt-4 inline-block text-sm font-semibold text-[#ff6a00]">Read article</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-[min(1200px,92%)] py-14">
        <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm md:p-10">
          <h2 className="text-3xl font-semibold">Get Wisdom Updates</h2>
          <p className="mt-3 text-black/70">Receive handpicked articles, teachings, and videos from Guruji Shrawan regularly.</p>
          <form onSubmit={handleNewsletterSubmit} className="mt-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <input type="email" placeholder="Email address" value={email} onChange={event => setEmail(event.target.value)} className="w-full rounded-full border border-black/15 px-5 py-3" required />
              <button type="submit" className="rounded-full bg-[#ff6a00] px-7 py-3 text-sm font-semibold text-white disabled:opacity-60" disabled={newsletterStatus === "loading"}>{newsletterStatus === "loading" ? "Subscribing..." : "Subscribe"}</button>
            </div>
            <div className="mt-4 flex gap-4 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" checked={hindi} onChange={event => setHindi(event.target.checked)} /> Hindi</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={english} onChange={event => setEnglish(event.target.checked)} /> English</label>
            </div>
          </form>
          {newsletterMsg && <p className="mt-3 text-sm text-green-700">{newsletterMsg}</p>}
        </div>
      </section>

      <section className="mx-auto w-[min(1200px,92%)] py-8">
        <h2 className="text-2xl font-semibold">Social Presence</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {socialLinks.map(item => (
            <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-black/70">{item.count} followers</p>
              </div>
              <div className="text-[#ff6a00]">{item.icon}</div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
