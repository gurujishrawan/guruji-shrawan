"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState, type ReactElement } from "react";
import {
  FaArrowRight,
  FaBars,
  FaBookOpen,
  FaFacebook,
  FaGlobe,
  FaInstagram,
  FaPlay,
  FaTimes,
  FaUsers,
  FaVideo,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

type Stat = { label: string; value: number; suffix: string; icon: ReactElement };

const navItems = [
  "Home",
  "In Media",
  "YouTube",
  "Teachings",
  "Live Sessions",
  "Articles",
  "Books",
  "Video Series",
  "Contact",
];

const stats: Stat[] = [
  { label: "Students Benefited", value: 1, suffix: "M+", icon: <FaUsers /> },
  { label: "Books and Teachings", value: 50, suffix: "+", icon: <FaBookOpen /> },
  { label: "Followers", value: 2, suffix: "M+", icon: <FaGlobe /> },
  { label: "YouTube Views", value: 100, suffix: "M+", icon: <FaYoutube /> },
  { label: "Articles Published", value: 500, suffix: "+", icon: <FaBookOpen /> },
  { label: "Video Sessions", value: 1200, suffix: "+", icon: <FaVideo /> },
];

const books = [
  "Vedanta for Modern Life",
  "Freedom from Inner Conflict",
  "Beyond Blind Belief",
  "Relationships with Clarity",
  "Awakening Youth Consciousness",
];

const videos = [
  "What Is True Spirituality in Modern Times?",
  "Why the Mind Escapes Silence",
  "Love, Dependency and Intelligence",
  "Freedom from Social Conditioning",
  "Can Inquiry End Suffering?",
];

const articles = [
  { category: "Spirituality", title: "Inquiry Is the Fire of Real Transformation", readTime: "6 min read" },
  { category: "Mind", title: "Attention vs. Distraction in the Digital Age", readTime: "5 min read" },
  { category: "Relationships", title: "Possession Is Not Love", readTime: "7 min read" },
  { category: "Society", title: "Belief, Fear and Collective Confusion", readTime: "8 min read" },
  { category: "Self Inquiry", title: "Who Is the One That Suffers?", readTime: "6 min read" },
  { category: "Youth", title: "A Conscious Direction for Young Minds", readTime: "4 min read" },
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
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="bg-[#f8f6f2] text-[#161616]">
      <header className={`sticky top-0 z-50 border-b border-black/10 bg-white/80 backdrop-blur transition-all ${scrolled ? "py-2" : "py-4"}`}>
        <div className="mx-auto flex w-[min(1200px,92%)] items-center justify-between gap-8">
          <p className="text-xl font-semibold">Guruji Shrawan</p>
          <nav className="hidden xl:flex items-center gap-5 text-sm text-black/70">
            {navItems.map((item) => <a key={item} href="#" className="hover:text-[#ff6a00]">{item}</a>)}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <button className="rounded-full border border-black/20 px-3 py-2 text-xs">Hindi / English</button>
            <button className="rounded-full bg-[#ff6a00] px-5 py-2 text-sm font-semibold text-white">Donate</button>
          </div>
          <button onClick={() => setMenuOpen((v) => !v)} className="md:hidden"><FaBars /></button>
        </div>
        {menuOpen && (
          <div className="mt-3 border-t border-black/10 bg-white p-4 md:hidden">
            <div className="flex justify-end"><button onClick={() => setMenuOpen(false)}><FaTimes /></button></div>
            <div className="mt-2 grid gap-3 text-sm">{navItems.map((item) => <a key={item} href="#">{item}</a>)}</div>
          </div>
        )}
      </header>

      <section className="mx-auto grid w-[min(1200px,92%)] gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <p className="text-sm uppercase tracking-[0.2em] text-[#ff6a00]">Guruji Shrawan</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-6xl">Awakening Inner Clarity and True Understanding</h1>
          <p className="mt-6 max-w-xl text-lg text-black/70">Guruji Shrawan shares deep insights on life, spirituality, relationships, society, and modern confusion through fearless inquiry and timeless wisdom. The teachings encourage freedom from blind belief, self-deception, and unconscious living.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button className="rounded-full bg-[#ff6a00] px-6 py-3 text-sm font-semibold text-white">Watch Teachings</button>
            <button className="rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-semibold">Explore Articles</button>
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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{stats.map((item) => <CounterCard key={item.label} item={item} />)}</div>
      </section>

      <section className="mx-auto w-[min(1200px,92%)] py-16">
        <h2 className="text-3xl font-semibold">Books by Guruji Shrawan</h2>
        <p className="mt-3 max-w-3xl text-black/70">A growing library of powerful books exploring Vedanta, self-inquiry, freedom from psychological suffering, relationships, youth awakening, and conscious living.</p>
        <div className="mt-8 flex snap-x gap-5 overflow-x-auto pb-3">
          {books.map((book, i) => (
            <motion.article key={book} whileHover={{ y: -6 }} className="min-w-[280px] snap-start rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
              <div className="relative mb-4 h-44 overflow-hidden rounded-xl bg-[#f1ebe2]">
                <Image src={`/images/hero${(i % 3) + 1}.jpg`} alt={book} fill className="object-cover" />
              </div>
              <h3 className="text-lg font-semibold">{book}</h3>
              <p className="mt-2 text-sm text-black/70">Concise explorations to bring clarity, intelligence, and freedom to daily life.</p>
              <button className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#ff6a00]">Read <FaArrowRight /></button>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-[min(1200px,92%)] py-10">
        <h2 className="text-3xl font-semibold">Podcasts & Conversations</h2>
        <div className="mt-8 flex gap-6 overflow-x-auto pb-2">
          {videos.map((video, i) => (
            <article key={video} className="min-w-[320px] rounded-2xl border border-black/10 bg-white p-3 shadow-sm">
              <div className="relative h-48 overflow-hidden rounded-xl">
                <Image src={`/images/hero${(i % 3) + 1}.jpg`} alt={video} fill className="object-cover" />
                <div className="absolute inset-0 grid place-items-center bg-black/25"><span className="rounded-full bg-white/90 p-3 text-[#ff6a00]"><FaPlay /></span></div>
              </div>
              <h3 className="mt-4 font-semibold">{video}</h3>
              <p className="mt-1 text-sm text-black/70">A direct conversation on awareness, confusion, and practical wisdom.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-[min(1200px,92%)] py-12">
        <div className="overflow-hidden rounded-3xl bg-[#161616] p-8 text-white md:p-12">
          <p className="text-sm uppercase tracking-[0.2em] text-[#ff6a00]">Trending Now</p>
          <h2 className="mt-3 text-4xl font-semibold">Awakening Conscious Living</h2>
          <p className="mt-4 max-w-2xl text-white/80">A movement encouraging people to live with awareness, responsibility, and freedom from blind beliefs. The mission is to bring clarity to individuals facing confusion in modern society.</p>
          <button className="mt-6 rounded-full bg-[#ff6a00] px-6 py-3 text-sm font-semibold">Know More</button>
        </div>
      </section>

      <section className="mx-auto w-[min(1200px,92%)] py-12">
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
          <div className="mt-6 flex flex-col gap-4 md:flex-row">
            <input type="email" placeholder="Email address" className="w-full rounded-full border border-black/15 px-5 py-3" />
            <button className="rounded-full bg-[#ff6a00] px-7 py-3 text-sm font-semibold text-white">Subscribe</button>
          </div>
          <div className="mt-4 flex gap-4 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Hindi</label>
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> English</label>
          </div>
        </div>
      </section>

      <section className="mx-auto w-[min(1200px,92%)] py-8">
        <h2 className="text-2xl font-semibold">Social Presence</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["YouTube", "2M+", <FaYoutube key="y" />],
            ["Instagram", "1.2M+", <FaInstagram key="i" />],
            ["Facebook", "800K+", <FaFacebook key="f" />],
            ["Twitter", "350K+", <FaXTwitter key="x" />],
          ].map(([name, count, icon]) => (
            <div key={String(name)} className="flex items-center justify-between rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
              <div>
                <p className="font-semibold">{name}</p>
                <p className="text-sm text-black/70">{count} followers</p>
              </div>
              <div className="text-[#ff6a00]">{icon}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-12 bg-[#111111] text-white">
        <div className="mx-auto grid w-[min(1200px,92%)] gap-10 py-14 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold">Guruji Shrawan</h3>
            <p className="mt-3 text-sm text-white/70">A premium intellectual platform for inquiry, clarity, and conscious living.</p>
          </div>
          <div>
            <h4 className="font-semibold">Teachings</h4>
            <ul className="mt-3 space-y-2 text-sm text-white/70"><li>Articles</li><li>Books</li><li>Video Series</li><li>Live Sessions</li></ul>
          </div>
          <div>
            <h4 className="font-semibold">About</h4>
            <ul className="mt-3 space-y-2 text-sm text-white/70"><li>About Guruji Shrawan</li><li>Media</li><li>Contact</li><li>Privacy Policy</li></ul>
          </div>
          <div>
            <h4 className="font-semibold">Download App</h4>
            <ul className="mt-3 space-y-2 text-sm text-white/70"><li>Google Play</li><li>App Store</li><li>Email: contact@gurujishrawan.org</li><li>Phone: +91 90000 00000</li></ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
