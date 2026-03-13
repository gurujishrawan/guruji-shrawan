"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

export default function BookSection() {
  const sectionRef = useRef(null)
  const [inView, setInView] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const SPINE_W = 36
  const COVER_W = 280
  const COVER_H = 400

  return (
    <section className="bs" ref={sectionRef}>
      <style>{`
        @keyframes bs-up    { from{opacity:0;transform:translateY(48px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bs-left  { from{opacity:0;transform:translateX(-56px)} to{opacity:1;transform:translateX(0)} }
        @keyframes bs-right { from{opacity:0;transform:translateX(56px)} to{opacity:1;transform:translateX(0)} }
        @keyframes bs-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes bs-badge { from{opacity:0;transform:scale(.8) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes bs-shine { 0%{left:-120%} 100%{left:160%} }
        @keyframes bs-page-turn { from{transform:rotateY(0deg)} to{transform:rotateY(-160deg)} }

        .bs {
          padding: 120px 0 130px;
          background: linear-gradient(160deg, #fffaf5 0%, #faf7f2 45%, #fff6e8 100%);
          position: relative;
          overflow: hidden;
        }

        /* large decorative background letter */
        .bs::before {
          content: '2026';
          position: absolute;
          top: -60px; left: -20px;
          font-family: 'Lora', Georgia, serif;
          font-size: 600px;
          font-weight: 700;
          color: rgba(200,85,26,.04);
          line-height: 1;
          pointer-events: none;
          user-select: none;
        }

        /* ambient orbs */
        .bs-orb1 {
          position: absolute;
          top: -100px; right: -80px;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(200,85,26,.09), transparent 70%);
          pointer-events: none;
        }
        .bs-orb2 {
          position: absolute;
          bottom: -80px; left: 10%;
          width: 340px; height: 340px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(184,132,26,.07), transparent 70%);
          pointer-events: none;
        }

        .bs-inner {
          max-width: 1160px;
          margin: 0 auto;
          padding: 0 28px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        /* ═══ BOOK STAGE ═══ */
        .bs-stage {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 80px 20px 100px;
          perspective: 2000px;
          animation: ${inView ? "bs-left .9s .1s ease both" : "none"};
          opacity: ${inView ? 1 : 0};
        }

        .bs-book-wrap {
          position: relative;
        }

        /* the 3D book */
        .bs-book {
          position: relative;
          width: ${COVER_W + SPINE_W}px;
          height: ${COVER_H}px;
          transform-style: preserve-3d;
          cursor: pointer;
          transition: transform .6s cubic-bezier(.25,.46,.45,.94);
          animation: ${inView ? "bs-float 5s 1s ease-in-out infinite" : "none"};
          filter: drop-shadow(0 60px 40px rgba(26,16,8,.28)) drop-shadow(0 20px 14px rgba(26,16,8,.18));
        }

        /* ── SPINE ── */
        .bs-spine {
          position: absolute;
          left: 0;
          top: 0;
          width: ${SPINE_W}px;
          height: ${COVER_H}px;
          background: linear-gradient(
            to right,
            #3d1002 0%,
            #6b2208 15%,
            #c8551a 40%,
            #e07030 52%,
            #c8551a 65%,
            #6b2208 85%,
            #3d1002 100%
          );
          transform-origin: left center;
          transform: rotateY(90deg) translateZ(0px);
          overflow: hidden;
        }
        /* spine highlight line */
        .bs-spine::before {
          content: '';
          position: absolute;
          top: 0; left: 5px;
          width: 2px; height: 100%;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,.25) 30%, rgba(255,255,255,.1) 70%, transparent);
        }
        /* spine bottom cap */
        .bs-spine::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 8px;
          background: linear-gradient(to bottom, transparent, rgba(0,0,0,.35));
        }
        .bs-spine-title {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%) rotate(90deg);
          white-space: nowrap;
          font-family: 'Poppins', sans-serif;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: .22em;
          text-transform: uppercase;
          color: rgba(255,255,255,.7);
          writing-mode: vertical-lr;
          transform: translateX(-50%) rotate(180deg);
          left: 50%;
          top: 50%;
          transform-origin: center;
        }

        /* ── PAGES BLOCK (visible on right edge) ── */
        .bs-pages {
          position: absolute;
          left: ${SPINE_W}px;
          top: 0;
          width: ${COVER_W}px;
          height: ${COVER_H}px;
          background: linear-gradient(
            to right,
            #eeeeee 0%,
            #f9f9f9 30%,
            #ffffff 50%,
            #f4f4f4 80%,
            #e8e8e8 100%
          );
          border-radius: 0 2px 2px 0;
          transform: translateZ(-3px);
          overflow: hidden;
        }
        /* page line texture */
        .bs-pages::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            to bottom,
            rgba(0,0,0,.03) 0px,
            rgba(0,0,0,.03) 1px,
            transparent 1px,
            transparent 6px
          );
        }
        /* right edge shadow */
        .bs-pages::after {
          content: '';
          position: absolute;
          right: 0; top: 0;
          width: 18px; height: 100%;
          background: linear-gradient(to right, transparent, rgba(0,0,0,.08));
        }

        /* ── COVER ── */
        .bs-cover {
          position: absolute;
          left: ${SPINE_W}px;
          top: 0;
          width: ${COVER_W}px;
          height: ${COVER_H}px;
          border-radius: 0 3px 3px 0;
          overflow: hidden;
          transform-origin: left center;
          transform: rotateY(0deg);
          transition: transform .65s cubic-bezier(.25,.46,.45,.94), box-shadow .65s ease;
          box-shadow:
            4px 0 8px rgba(0,0,0,.1),
            0 0 0 .5px rgba(0,0,0,.12);
          backface-visibility: hidden;
        }

        /* hover open removed intentionally */

        /* ── COVER LIGHT EFFECTS ── */
        /* specular top-left gloss */
        .bs-cover-gloss {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(255,255,255,.22) 0%,
            rgba(255,255,255,.08) 25%,
            transparent 50%
          );
          z-index: 2;
          pointer-events: none;
          border-radius: 0 3px 3px 0;
        }
        /* bottom vignette */
        .bs-cover-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 55%,
            rgba(0,0,0,.3) 100%
          );
          z-index: 3;
          pointer-events: none;
          border-radius: 0 3px 3px 0;
        }
        /* animated shimmer sweep */
        .bs-cover-shine {
          position: absolute;
          top: 0;
          left: -120%;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            110deg,
            transparent 30%,
            rgba(255,255,255,.18) 50%,
            transparent 70%
          );
          transform: skewX(-18deg);
          z-index: 4;
          pointer-events: none;
          animation: bs-shine 4s 1.8s ease-in-out infinite;
        }

        /* ── INSIDE (peek when open) ── */
        .bs-inside {
          position: absolute;
          left: ${SPINE_W}px;
          top: 0;
          width: ${COVER_W}px;
          height: ${COVER_H}px;
          background: linear-gradient(135deg, #fffdf8, #fff8ec);
          border-radius: 0 3px 3px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px 28px;
          transform: translateZ(-1px);
          border-left: 3px solid rgba(200,85,26,.15);
        }
        .bs-inside-ornament {
          font-family: 'Lora', serif;
          font-size: 52px;
          color: rgba(200,85,26,.18);
          line-height: 1;
          margin-bottom: 12px;
        }
        .bs-inside-quote {
          font-family: 'Lora', serif;
          font-size: 14px;
          font-style: italic;
          color: #7a5a36;
          text-align: center;
          line-height: 1.75;
        }
        .bs-inside-author {
          font-family: 'Poppins', sans-serif;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .16em;
          color: rgba(200,85,26,.7);
          margin-top: 16px;
        }

        /* ── TOP CAP (thickness top edge) ── */
        .bs-top {
          position: absolute;
          left: ${SPINE_W}px;
          top: 0;
          width: ${COVER_W}px;
          height: 8px;
          background: linear-gradient(to bottom, #d0cfc8, #f0efea);
          transform-origin: top center;
          transform: rotateX(90deg) translateZ(-4px);
          border-radius: 0 2px 0 0;
        }

        /* ── FLOOR SHADOW ── */
        .bs-shadow {
          position: absolute;
          bottom: -56px;
          left: 50%;
          transform: translateX(-48%);
          width: 72%;
          height: 40px;
          background: radial-gradient(ellipse at center, rgba(26,16,8,.32), transparent 70%);
          filter: blur(10px);
          transition: width .6s ease, opacity .6s ease;
          z-index: -1;
        }


        /* ── FLOATING BADGES ── */
        .bs-badge-new {
          position: absolute;
          top: -24px;
          right: -44px;
          background: linear-gradient(135deg, #c8551a, #8a2e06);
          color: #fff;
          font-family: 'Poppins', sans-serif;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .18em;
          padding: 8px 16px;
          border-radius: 99px;
          box-shadow: 0 6px 20px rgba(200,85,26,.4);
          animation: ${inView ? "bs-badge .6s .8s ease both" : "none"};
          opacity: ${inView ? 1 : 0};
          white-space: nowrap;
        }
        .bs-badge-rating {
          position: absolute;
          bottom: -18px;
          right: -36px;
          background: #fff;
          border: 1.5px solid #e8ddd0;
          border-radius: 14px;
          padding: 10px 16px;
          box-shadow: 0 8px 24px rgba(0,0,0,.1);
          animation: ${inView ? "bs-badge .6s 1s ease both" : "none"};
          opacity: ${inView ? 1 : 0};
        }
        .bs-badge-stars {
          font-size: 12px;
          color: #e8a020;
          letter-spacing: 1px;
        }
        .bs-badge-rval {
          font-family: 'Poppins', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: #1a1008;
          margin-top: 2px;
        }

        /* ── PAGE FLIP ACCENT (decorative) ── */
        .bs-page-peek {
          position: absolute;
          left: ${SPINE_W}px;
          top: 0;
          width: ${COVER_W}px;
          height: ${COVER_H}px;
          transform-origin: left center;
          transform: rotateY(-12deg);
          background: linear-gradient(to right, #f5f5f2, #ffffff);
          border-radius: 0 3px 3px 0;
          overflow: hidden;
          z-index: -1;
        }
        .bs-page-peek::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            to bottom,
            rgba(0,0,0,.025) 0px,
            rgba(0,0,0,.025) 1px,
            transparent 1px,
            transparent 6px
          );
        }

        /* ══════════════════
           CONTENT SIDE
        ══════════════════ */
        .bs-content {
          animation: ${inView ? "bs-right .9s .15s ease both" : "none"};
          opacity: ${inView ? 1 : 0};
        }
        .bs-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Poppins', sans-serif;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .24em;
          color: #c8551a;
          margin-bottom: 16px;
        }
        .bs-eyebrow::before, .bs-eyebrow::after {
          content: '';
          display: block;
          width: 22px;
          height: 1.5px;
          background: #c8551a;
          opacity: .35;
          border-radius: 1px;
        }
        .bs-tag {
          display: inline-block;
          font-family: 'Poppins', sans-serif;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .16em;
          color: #c8551a;
          background: rgba(200,85,26,.1);
          border: 1px solid rgba(200,85,26,.25);
          padding: 4px 12px;
          border-radius: 99px;
          margin-bottom: 16px;
        }
        .bs-title {
          font-family: 'Lora', serif;
          font-size: clamp(32px, 3.5vw, 50px);
          font-weight: 700;
          color: #1a1008;
          line-height: 1.1;
          letter-spacing: -.025em;
          margin-bottom: 6px;
        }
        .bs-title em {
          font-style: italic;
          color: #c8551a;
        }
        .bs-subtitle-line {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
        }
        .bs-rule {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, #e8ddd0, transparent);
        }
        .bs-subtitle {
          font-family: 'Poppins', sans-serif;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .18em;
          color: #b8841a;
          white-space: nowrap;
        }
        .bs-desc {
          font-family: 'Lora', serif;
          font-size: 16px;
          font-style: italic;
          color: #5a4030;
          line-height: 1.95;
          margin-bottom: 28px;
          max-width: 450px;
        }
        /* feature rows */
        .bs-features {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 32px;
        }
        .bs-feat {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          color: #5a4030;
        }
        .bs-feat-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c8551a, #b8841a);
          flex-shrink: 0;
        }
        /* chips */
        .bs-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-bottom: 32px;
        }
        .bs-chip {
          font-family: 'Poppins', sans-serif;
          font-size: 10px;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 99px;
          background: #fff8f2;
          color: #8a5020;
          border: 1.5px solid #f0d8b8;
        }
        /* CTA row */
        .bs-cta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .bs-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 15px 32px;
          border-radius: 99px;
          background: linear-gradient(135deg, #c8551a, #8a2e06);
          color: #fff;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 8px 26px rgba(200,85,26,.3);
          transition: transform .22s ease, box-shadow .22s ease;
          letter-spacing: .02em;
        }
        .bs-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 36px rgba(200,85,26,.42);
        }
        .bs-btn:active { transform: scale(.97); }
        .bs-btn-ico {
          width: 22px; height: 22px;
          border-radius: 50%;
          background: rgba(255,255,255,.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          transition: transform .2s ease;
        }
        .bs-btn:hover .bs-btn-ico { transform: translateX(3px); }
        .bs-link {
          font-family: 'Poppins', sans-serif;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .16em;
          color: #8a7a6a;
          text-decoration: none;
          transition: color .2s ease;
        }
        .bs-link:hover { color: #c8551a; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .bs-inner {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 70px;
          }
          .bs-desc { margin: 0 auto 28px; }
          .bs-chips, .bs-cta, .bs-features { justify-content: center; align-items: center; }
          .bs-badge-new { right: -10px; }
          .bs-badge-rating { right: -10px; }
          .bs-eyebrow { justify-content: center; }
          .bs-subtitle-line { flex-direction: column; gap: 4px; }
          .bs-rule { display: none; }
        }
        @media (max-width: 480px) {
          .bs { padding: 80px 0 90px; }
          .bs-stage { padding: 60px 0 80px; }
        }
      `}</style>

      <div className="bs-orb1"/>
      <div className="bs-orb2"/>

      <div className="bs-inner">

        {/* ══ BOOK MOCKUP ══ */}
        <div className="bs-stage">
          <div className="bs-book-wrap">

            {/* 3D Book */}
            <div
              className="bs-book"
              style={{ transform: "rotateY(-18deg) rotateX(-2deg)" }}
            >
              {/* Pages block (back layer) */}
              <div className="bs-pages"/>

              {/* Spine */}
              <div className="bs-spine">
                <div className="bs-spine-title">Baccho Ki Parvarish · Guruji Shrawan</div>
              </div>

              {/* Top cap */}
              <div className="bs-top"/>

              {/* Inside (visible when cover opens) */}
              <div className="bs-inside">
                <div className="bs-inside-ornament">"</div>
                <p className="bs-inside-quote">
                  Parenting is not about<br/>shaping a child — it is<br/>about understanding one.
                </p>
                <p className="bs-inside-author">— Guruji Shrawan</p>
              </div>

              {/* Page peek (subtle second page) */}
              <div className="bs-page-peek"/>

              {/* Cover */}
              <div className="bs-cover">
                <Image
                  src="/images/book-cover.png"
                  alt="Baccho Ki Parvarish"
                  width={COVER_W}
                  height={COVER_H}
                  style={{ display:"block", width:"100%", height:"100%", objectFit:"cover" }}
                  priority
                />
                <div className="bs-cover-gloss"/>
                <div className="bs-cover-vignette"/>
                <div className="bs-cover-shine"/>
              </div>
            </div>

            {/* Floor shadow (sibling so it stays below book) */}
            <div className="bs-shadow"/>

            {/* New Release badge */}
            <div className="bs-badge-new">✦ New Release</div>

            {/* Rating badge */}
            <div className="bs-badge-rating">
              <div className="bs-badge-stars">★★★★★</div>
              <div className="bs-badge-rval">5.0 · Readers' Choice</div>
            </div>

          </div>
        </div>

        {/* ══ CONTENT ══ */}
        <div className="bs-content">
          <div className="bs-eyebrow">Books by Guruji Shrawan</div>

          <div className="bs-tag">Now Available</div>

          <h2 className="bs-title">
            Baccho Ki<br/><em>Parvarish</em>
          </h2>

          <div className="bs-subtitle-line">
            <span className="bs-subtitle">A Guide for Conscious Parenting</span>
            <div className="bs-rule"/>
          </div>

          <p className="bs-desc">
            A thoughtful guide for parents to nurture children with awareness,
            clarity and compassion in the modern world. Practical wisdom rooted
            in Vedanta and psychological understanding.
          </p>

          <div className="bs-features">
            {[
              "Practical parenting wisdom rooted in Vedanta",
              "Understanding the child's inner world deeply",
              "Freedom from guilt, fear & reactive parenting",
              "Available in Hindi — written with simplicity",
            ].map(f => (
              <div key={f} className="bs-feat">
                <div className="bs-feat-dot"/>
                <span>{f}</span>
              </div>
            ))}
          </div>

          <div className="bs-chips">
            {["Parenting","Vedanta","Psychology","Conscious Living","Hindi"].map(c => (
              <span key={c} className="bs-chip">{c}</span>
            ))}
          </div>

          <div className="bs-cta">
            <Link href="/books/baccho-ki-parvarish" className="bs-btn">
              Explore the Book
              <span className="bs-btn-ico">→</span>
            </Link>
            <Link href="/books" className="bs-link">View All Books →</Link>
          </div>
        </div>

      </div>
    </section>
  )
}