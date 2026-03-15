"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { FaArrowLeft, FaArrowRight, FaStar, FaAmazon, FaBookOpen, FaShare, FaCheck, FaWhatsapp, FaFacebook, FaLink, FaTimes, FaQuoteLeft, FaChevronDown, FaChevronUp } from "react-icons/fa"


/* ══════════════════════════════════
   DATA — add more books here easily
══════════════════════════════════ */
const BOOKS = [
  {
    id: "baccho-ki-parvarish",
    title: "Baccho Ki Parvarish",
    subtitle: "A Guide for Conscious Parenting",
    author: "Guruji Shrawan",
    language: "Hindi",
    pages: "240",
    year: "2026",
    rating: 4.8,
    reviews: 4,
    price: "₹99",
    mrp: "₹199",
    cover: "/images/book-cover.png",
    amazonUrl: "https://www.amazon.in/dp/XXXXXXXXXX",   // ← replace with real ASIN
    flipkartUrl: "",                                      // ← optional
    description: "A thoughtful guide for parents to nurture children with awareness, clarity and compassion in the modern world. This book is not a manual — it is an honest mirror held up to every parent who has ever wondered why they respond to their children the way they do.",
    longDescription: "Guruji Shrawan's first book explores the unconscious patterns that shape how we raise children — fear, projection, comparison, conditional love. Drawing from Vedanta, psychology and direct observation, this book invites parents to look at themselves before looking at their child. Written in simple, direct Hindi, it is accessible to every parent regardless of background.",
    topics: ["Conscious Parenting","Vedanta","Child Psychology","Fear & Conditioning","Love vs Attachment","Modern Family"],
    highlights: [
      "Why children reflect the parent's unconscious mind",
      "The difference between love and control",
      "Understanding fear-based parenting",
      "Practical inquiry for daily family life",
      "How to listen to a child without projecting",
    ],
    reviews_list: [
      { name: "Priya Sharma", city: "Delhi", stars: 5, text: "This book changed how I see my children and myself. Guruji's directness is exactly what was needed." },
      { name: "Rajan Mehta",  city: "Mumbai", stars: 5, text: "Every parent should read this. Simple Hindi, deep wisdom. I've gifted it to three friends already." },
      { name: "Sunita Devi",  city: "Patna",  stars: 5, text: "Maine sochaa tha main ek acchi maa hun — is kitaab ne mujhe phir se sochne par majboor kar diya." },
    ],
    badge: "Bestseller",
    featured: true,
  },
  // Add future books here — same structure
  // {
  //   id: "next-book",
  //   title: "...",
  //   ...
  //   amazonUrl: "https://amazon.in/dp/XXXXXXXXXX",
  // }
]

const COMING_SOON = [
  { title: "Mann Ki Shanti", subtitle: "Inner Peace in a Restless World", lang: "Hindi / English", eta: "2025" },
  { title: "Rishton Ki Sachchi Samajh", subtitle: "Understanding Relationships Honestly", lang: "Hindi", eta: "2025" },
]

/* ── helpers ── */
function Stars({ n }: { n: number }) {
  return (
    <span className="stars">
      {[1,2,3,4,5].map(i=>(
        <FaStar key={i} style={{color: i<=n ? "#e8a020" : "#e8ddd0", fontSize:13}}/>
      ))}
    </span>
  )
}

function useInView(t=0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [v, setV] = useState(false)
  useEffect(()=>{
    const el = ref.current; if(!el) return
    const obs = new IntersectionObserver(([e])=>{ if(e.isIntersecting){setV(true);obs.disconnect()} },{threshold:t})
    obs.observe(el)
    return ()=>obs.disconnect()
  },[t])
  return {ref,v}
}

function Reveal({children,delay=0,dir="up"}:{children:React.ReactNode;delay?:number;dir?:string}) {
  const {ref,v} = useInView(0.08)
  const transforms:{[k:string]:string} = {up:"translateY(32px)",left:"translateX(-28px)",right:"translateX(28px)"}
  return (
    <div ref={ref} style={{
      opacity:v?1:0, transform:v?"none":(transforms[dir]||transforms.up),
      transition:`opacity .7s ${delay}ms ease, transform .7s ${delay}ms ease`,
    }}>{children}</div>
  )
}

/* ── Share sheet ── */
function BookShare({book,onClose}:{book:typeof BOOKS[0];onClose:()=>void}) {
  const [copied,setCopied] = useState(false)
  const url = book.amazonUrl
  const PLATFORMS = [
    {icon:<FaWhatsapp/>, label:"WhatsApp", color:"#25d366", href:`https://wa.me/?text=${encodeURIComponent(book.title+" by Guruji Shrawan — "+url)}`},
    {icon:<FaFacebook/>, label:"Facebook", color:"#1877f2", href:`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`},
    {icon:<FaAmazon/>,   label:"Amazon",   color:"#ff9900", href:url},
  ]
  function copy(){
    navigator.clipboard.writeText(url).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2200) })
  }
  return (
    <div className="bs-backdrop" onClick={onClose}>
      <div className="bs-sheet" onClick={e=>e.stopPropagation()}>
        <div className="bs-sheet-handle"/>
        <div className="bs-sheet-head">
          <p className="bs-sheet-title">Share Book</p>
          <button className="bs-sheet-close" onClick={onClose}><FaTimes/></button>
        </div>
        <p className="bs-sheet-sub">{book.title}</p>
        <div className="bs-sheet-icons">
          {PLATFORMS.map(p=>(
            <a key={p.label} href={p.href} target="_blank" rel="noopener noreferrer" className="bs-sheet-icon">
              <div className="bs-sheet-circle" style={{background:p.color}}>{p.icon}</div>
              <span>{p.label}</span>
            </a>
          ))}
        </div>
        <div className="bs-sheet-copy">
          <input value={url} readOnly className="bs-sheet-input"/>
          <button className={`bs-sheet-copybtn ${copied?"bs-copied":""}`} onClick={copy}>
            {copied?<><FaCheck size={10}/> Copied!</>:<><FaLink size={10}/> Copy</>}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════
   BOOK DETAIL — expands inline
══════════════════════════════════ */
function BookDetail({book}:{book:typeof BOOKS[0]}) {
  const [expanded, setExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<"about"|"highlights"|"reviews">("about")
  const [showShare, setShowShare] = useState(false)
  const [hovering, setHovering] = useState(false)

  return (
    <>
      <div className="bd">
        {/* ── HERO SPLIT ── */}
        <div className="bd-hero">
          {book.featured && <div className="bd-featured-ribbon">#{book.badge}</div>}

          {/* Left: book mockup */}
          <Reveal dir="left">
            <div className="bd-book-stage">
              <div
                className="bd-book"
                onMouseEnter={()=>setHovering(true)}
                onMouseLeave={()=>setHovering(false)}
                style={{ filter: `drop-shadow(0 ${hovering?60:40}px ${hovering?50:32}px rgba(26,16,8,${hovering?.2:.13}))` }}
              >
                {/* pages */}
                <div className="bd-pages"/>
                {/* spine */}
                <div className="bd-spine">
                  <span className="bd-spine-text">Baccho Ki Parvarish · Guruji Shrawan</span>
                </div>
                {/* cover */}
                <div className="bd-cover">
                  <Image src={book.cover} alt={book.title} width={240} height={340}
                    style={{display:"block",width:"100%",height:"100%",objectFit:"cover"}} priority/>
                  {/* gloss */}
                  <div className="bd-gloss"/>
                  {/* shine sweep */}
                  <div className="bd-shine"/>
                </div>
                {/* floor shadow */}
                <div className="bd-shadow"/>
              </div>

              {/* Floating badges */}
              <div className="bd-badge-lang">
                <span className="bd-badge-lang-ico">🇮🇳</span>
                <div>
                  <div className="bd-badge-lbl">Language</div>
                  <div className="bd-badge-val">{book.language}</div>
                </div>
              </div>
              <div className="bd-badge-rating">
                <Stars n={Math.round(book.rating)}/>
                <div className="bd-badge-rv">{book.rating.toFixed(1)} · {book.reviews} reviews</div>
              </div>
            </div>
          </Reveal>

          {/* Right: info */}
          <Reveal dir="right" delay={120}>
            <div className="bd-info">
              <div className="bd-meta-top">
                <span className="bd-lang-chip">{book.language}</span>
                <span className="bd-year-chip">{book.year}</span>
              </div>

              <h1 className="bd-title">{book.title}</h1>
              <p className="bd-subtitle">{book.subtitle}</p>

              <div className="bd-author-row">
                <div className="bd-author-avatar">GS</div>
                <div>
                  <div className="bd-author-name">{book.author}</div>
                  <div className="bd-author-role">Spiritual Teacher · Author</div>
                </div>
              </div>

              <div className="bd-rating-row">
                <Stars n={Math.round(book.rating)}/>
                <span className="bd-rating-val">{book.rating.toFixed(1)}</span>
                <span className="bd-rating-count">({book.reviews} reviews)</span>
              </div>

              <p className="bd-desc">{book.description}</p>

              {/* price + buy */}
              <div className="bd-price-block">
                <div className="bd-price-row">
                  <span className="bd-price">{book.price}</span>
                  {book.mrp && <span className="bd-mrp">{book.mrp}</span>}
                  {book.mrp && (
                    <span className="bd-discount">
                      {Math.round((1 - parseInt(book.price.replace(/\D/g,"")) / parseInt(book.mrp.replace(/\D/g,""))) * 100)}% off
                    </span>
                  )}
                </div>
                <p className="bd-price-note">Free delivery on Amazon Prime · Ships within 2–4 days</p>
              </div>

              <div className="bd-buy-row">
                <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer" className="bd-buy-btn">
                  <FaAmazon size={15}/>
                  Buy on Amazon
                  <FaArrowRight size={11}/>
                </a>
                {book.flipkartUrl && (
                  <a href={book.flipkartUrl} target="_blank" rel="noopener noreferrer" className="bd-buy-btn bd-buy-fk">
                    Buy on Flipkart
                  </a>
                )}
                <button className="bd-share-btn" onClick={()=>setShowShare(true)}>
                  <FaShare size={12}/>
                </button>
              </div>

              <div className="bd-chips">
                {book.topics.map(t=><span key={t} className="bd-chip">{t}</span>)}
              </div>

              <div className="bd-meta-grid">
                <div className="bd-meta-item"><span className="bd-meta-lbl">Pages</span><span className="bd-meta-val"> {book.pages}</span></div>
                <div className="bd-meta-item"><span className="bd-meta-lbl">Language</span><span className="bd-meta-val"> {book.language}</span></div>
                <div className="bd-meta-item"><span className="bd-meta-lbl">Published</span><span className="bd-meta-val"> {book.year}</span></div>
                <div className="bd-meta-item"><span className="bd-meta-lbl">Format</span><span className="bd-meta-val"> Paperback & Kindle Edition</span></div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── TABS ── */}
        <Reveal>
          <div className="bd-tabs-wrap">
            <div className="bd-tabs">
              {(["about","highlights","reviews"] as const).map(t=>(
                <button key={t} className={`bd-tab ${activeTab===t?"bd-tab-active":""}`}
                  onClick={()=>setActiveTab(t)}>
                  {t.charAt(0).toUpperCase()+t.slice(1)}
                  {t==="reviews" && <span className="bd-tab-badge">{book.reviews_list.length}</span>}
                </button>
              ))}
            </div>

            <div className="bd-tab-content">
              {activeTab==="about" && (
                <div className="bd-about">
                  <p className="bd-about-text">{book.longDescription}</p>
                </div>
              )}

              {activeTab==="highlights" && (
                <div className="bd-highlights">
                  <p className="bd-hl-intro">What you'll discover in this book:</p>
                  {book.highlights.map((h,i)=>(
                    <div key={i} className="bd-hl-item">
                      <div className="bd-hl-num">{String(i+1).padStart(2,"0")}</div>
                      <p className="bd-hl-text">{h}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab==="reviews" && (
                <div className="bd-reviews">
                  <div className="bd-reviews-header">
                    <div className="bd-reviews-score">
                      <div className="bd-reviews-big">{book.rating.toFixed(1)}</div>
                      <Stars n={Math.round(book.rating)}/>
                      <div className="bd-reviews-total">{book.reviews} ratings</div>
                    </div>
                    <div className="bd-reviews-bars">
                      {[5,4,3,2,1].map(s=>(
                        <div key={s} className="bd-bar-row">
                          <span className="bd-bar-lbl">{s}★</span>
                          <div className="bd-bar-track">
                            <div className="bd-bar-fill" style={{width: s===5?"92%":s===4?"6%":"1%"}}/>
                          </div>
                          <span className="bd-bar-pct">{s===5?"92%":s===4?"6%":"1%"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bd-reviews-list">
                    {book.reviews_list.map((r,i)=>(
                      <div key={i} className="bd-review-card">
                        <div className="bd-review-top">
                          <div className="bd-review-avatar">{r.name.charAt(0)}</div>
                          <div>
                            <div className="bd-review-name">{r.name}</div>
                            <div className="bd-review-city">{r.city}</div>
                          </div>
                          <Stars n={r.stars}/>
                        </div>
                        <p className="bd-review-text">
                          <FaQuoteLeft size={11} style={{color:"var(--o)",marginRight:6,opacity:.5}}/>{r.text}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="bd-reviews-cta">
                    <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer" className="bd-reviews-amazon">
                      <FaAmazon size={13}/> Read all reviews on Amazon
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Reveal>

        {/* ── STICKY BUY BAR (mobile) ── */}
        <div className="bd-sticky-bar">
          <div className="bd-sticky-info">
            <div className="bd-sticky-title">{book.title}</div>
            <div className="bd-sticky-price">{book.price}</div>
          </div>
          <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer" className="bd-sticky-btn">
            <FaAmazon size={13}/> Buy Now
          </a>
        </div>
      </div>

      {showShare && <BookShare book={book} onClose={()=>setShowShare(false)}/>}
    </>
  )
}

/* ══════════════════════════════════
   MAIN PAGE
══════════════════════════════════ */
export default function BooksPage() {
  const [loaded, setLoaded] = useState(false)
  useEffect(()=>setLoaded(true),[])

  return (
    <main className="bp-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Poppins:wght@300;400;500;600;700;800&display=swap');

        :root {
          --o:#c8551a; --g:#b8841a; --bg:#faf7f2; --bg2:#f4efe6; --bg3:#ede5d8;
          --card:#ffffff; --border:#e8ddd0; --border2:#d8c9b8;
          --text:#1a1008; --muted:#8a7a6a;
          --sans:'Poppins',system-ui,sans-serif; --body:'Lora',Georgia,serif;
          --shadow:0 2px 16px rgba(26,16,8,.08); --shadow2:0 12px 40px rgba(26,16,8,.13);
        }

        @keyframes bp-up   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bp-in   { from{opacity:0} to{opacity:1} }
        @keyframes bp-shine{ 0%{left:-120%} 100%{left:160%} }
        @keyframes bp-float{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes bp-pulse{ 0%{box-shadow:0 0 0 0 rgba(200,85,26,.4)} 70%{box-shadow:0 0 0 12px transparent} 100%{box-shadow:0 0 0 0 transparent} }
        @keyframes bp-sheet{ from{transform:translateY(60px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes bp-scl  { from{opacity:0;transform:scale(.97)} to{opacity:1;transform:scale(1)} }

        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0 }

        .bp-root {
          background:var(--bg); color:var(--text);
          font-family:var(--sans); min-height:100vh; overflow-x:hidden;
        }

        /* ══════════════
           PAGE HERO
        ══════════════ */
        .bp-hero {
          background:linear-gradient(160deg,#fffaf4,#faf7f2 50%,#fff6e8);
          border-bottom:1px solid var(--border);
          padding:72px 0 56px;
          text-align:center;
          position:relative; overflow:hidden;
        }
        .bp-hero::before {
          content:'"'; position:absolute; top:-60px; left:-10px;
          font-family:var(--body); font-size:500px; font-weight:700;
          color:rgba(200,85,26,.04); line-height:1;
          pointer-events:none; user-select:none;
        }
        .bp-hero-inner { max-width:680px; margin:0 auto; padding:0 24px; position:relative; z-index:1; }
        .bp-hero-eyebrow {
          display:inline-flex; align-items:center; gap:8px;
          font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.26em; color:var(--o);
          margin-bottom:16px;
          animation:${loaded?"bp-in .7s ease both":"none"};
        }
        .bp-hero-eyebrow::before,.bp-hero-eyebrow::after {
          content:''; display:block; width:22px; height:1.5px; background:var(--o); opacity:.35; border-radius:1px;
        }
        .bp-hero-h1 {
          font-family:var(--body); font-size:clamp(34px,5vw,58px); font-weight:700;
          color:var(--text); line-height:1.1; letter-spacing:-.025em;
          animation:${loaded?"bp-up .9s .15s ease both":"none"};
        }
        .bp-hero-h1 em { font-style:italic; color:var(--o); }
        .bp-hero-sub {
          font-family:var(--body); font-size:17px; font-style:italic;
          color:var(--muted); line-height:1.8; margin-top:14px; max-width:480px; margin:14px auto 0;
          animation:${loaded?"bp-up .9s .3s ease both":"none"};
        }
        .bp-hero-stats {
          display:flex; align-items:center; justify-content:center; gap:32px; flex-wrap:wrap;
          margin-top:36px;
          animation:${loaded?"bp-up .9s .45s ease both":"none"};
        }
        .bp-hero-stat-val { font-family:var(--body); font-size:28px; font-weight:700; color:var(--o); }
        .bp-hero-stat-lbl { font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:.18em; color:var(--muted); margin-top:2px; }
        .bp-hero-vsep { width:1px; height:36px; background:var(--border); }

        /* ══════════════
           MAIN CONTENT
        ══════════════ */
        .bp-main { max-width:1200px; margin:0 auto; padding:56px 24px 100px; }

        /* ══════════════
           BOOK DETAIL
        ══════════════ */
        .bd { margin-bottom:80px; }

        .bd-hero {
          display:grid; grid-template-columns:380px 1fr;
          gap:72px; align-items:start;
          background:var(--card); border:1.5px solid var(--border);
          border-radius:24px; padding:52px;
          box-shadow:var(--shadow); margin-bottom:2px;
          position:relative; overflow:hidden;
        }
        /* warm gradient accent top-right */
        .bd-hero::before {
          content:''; position:absolute; top:-80px; right:-80px;
          width:300px; height:300px; border-radius:50%;
          background:radial-gradient(circle,rgba(200,85,26,.07),transparent 70%);
          pointer-events:none;
        }
        .bd-featured-ribbon {
          position:absolute; top:22px; right:-26px;
          background:linear-gradient(135deg,var(--o),#8a2e06);
          color:#fff; font-size:9px; font-weight:700; letter-spacing:.18em;
          text-transform:uppercase; padding:6px 48px 6px 24px;
          transform:rotate(0deg);
          box-shadow:0 4px 14px rgba(200,85,26,.3);
        }

        /* book 3D mockup */
        .bd-book-stage {
          display:flex; justify-content:center; align-items:center;
          padding:40px 0 60px; perspective:1800px; position:relative;
        }
        .bd-book {
          position:relative; width:240px; height:340px;
          transform:rotateY(-18deg) rotateX(-2deg);
          transform-style:preserve-3d;
          transition:filter .4s ease;
          animation:bp-float 5s ease-in-out infinite;
        }
        .bd-pages {
          position:absolute; top:5px; left:7px;
          width:100%; height:100%;
          background:linear-gradient(to right,#f0f0ee,#fafafa 35%,#f5f5f3);
          border-radius:1px 3px 3px 1px;
          box-shadow:inset -8px 0 14px rgba(0,0,0,.07),2px 3px 14px rgba(0,0,0,.15);
        }
        .bd-pages::before {
          content:''; position:absolute; inset:0;
          background:repeating-linear-gradient(to bottom,rgba(0,0,0,.028) 0,rgba(0,0,0,.028) 1px,transparent 1px,transparent 5px);
        }
        .bd-spine {
          position:absolute; left:-20px; top:0;
          width:24px; height:100%;
          background:linear-gradient(to right,#4a1600,#c8551a 45%,#7a2e0a);
          transform:rotateY(90deg); transform-origin:right;
          box-shadow:inset -3px 0 8px rgba(0,0,0,.4);
          border-radius:2px 0 0 2px;
          display:flex; align-items:center; justify-content:center;
          overflow:hidden;
        }
        .bd-spine-text {
          font-family:var(--sans); font-size:6px; font-weight:700;
          letter-spacing:.2em; text-transform:uppercase;
          color:rgba(255,255,255,.55);
          writing-mode:vertical-lr; transform:rotate(180deg);
          white-space:nowrap;
        }
        .bd-cover {
          position:absolute; inset:0; border-radius:1px 3px 3px 1px;
          overflow:hidden;
          box-shadow:0 30px 50px rgba(0,0,0,.22),0 10px 18px rgba(0,0,0,.14),0 0 0 .5px rgba(0,0,0,.1);
        }
        .bd-gloss {
          position:absolute; inset:0; z-index:2; pointer-events:none;
          background:linear-gradient(135deg,rgba(255,255,255,.2) 0%,rgba(255,255,255,.06) 25%,transparent 50%);
        }
        .bd-shine {
          position:absolute; top:0; left:-120%; width:55%; height:100%; z-index:3;
          background:linear-gradient(110deg,transparent,rgba(255,255,255,.2),transparent);
          transform:skewX(-18deg); pointer-events:none;
          animation:bp-shine 4s 1.5s ease-in-out infinite;
        }
        .bd-shadow {
          position:absolute; bottom:-48px; left:50%;
          transform:translateX(-48%);
          width:68%; height:32px;
          background:radial-gradient(ellipse,rgba(26,16,8,.22),transparent 70%);
          filter:blur(8px); z-index:-1;
        }
        /* floating badges on book stage */
        .bd-badge-lang {
          position:absolute; top:16px; right:12px;
          background:var(--card); border:1.5px solid var(--border);
          border-radius:12px; padding:9px 13px;
          display:flex; align-items:center; gap:9px;
          box-shadow:var(--shadow); font-size:0;
        }
        .bd-badge-lang-ico { font-size:18px; }
        .bd-badge-lbl { font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:.14em; color:var(--muted); margin-bottom:2px; }
        .bd-badge-val { font-size:12px; font-weight:700; color:var(--text); }
        .bd-badge-rating {
          position:absolute; bottom:20px; right:4px;
          background:var(--card); border:1.5px solid var(--border);
          border-radius:12px; padding:9px 13px;
          box-shadow:var(--shadow);
          display:flex; flex-direction:column; gap:4px; align-items:flex-start;
        }
        .bd-badge-rv { font-size:10px; color:var(--muted); font-weight:600; }

        /* info col */
        .bd-meta-top { display:flex; gap:8px; margin-bottom:14px; }
        .bd-lang-chip,.bd-year-chip {
          font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.18em;
          padding:4px 12px; border-radius:99px;
        }
        .bd-lang-chip { color:var(--o); background:rgba(200,85,26,.1); border:1px solid rgba(200,85,26,.25); }
        .bd-year-chip { color:var(--muted); background:var(--bg2); border:1px solid var(--border); }
        .bd-title { font-family:var(--body); font-size:clamp(26px,3vw,40px); font-weight:700; color:var(--text); line-height:1.1; letter-spacing:-.02em; margin-bottom:6px; }
        .bd-subtitle { font-family:var(--sans); font-size:13px; font-weight:600; text-transform:uppercase; letter-spacing:.16em; color:var(--g); margin-bottom:20px; }
        .bd-author-row { display:flex; align-items:center; gap:12px; margin-bottom:14px; }
        .bd-author-avatar {
          width:40px; height:40px; border-radius:50%;
          background:linear-gradient(135deg,var(--o),#8a2e06);
          color:#fff; font-size:13px; font-weight:700;
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
        }
        .bd-author-name { font-size:14px; font-weight:700; color:var(--text); }
        .bd-author-role { font-size:10px; color:var(--muted); font-weight:600; text-transform:uppercase; letter-spacing:.12em; margin-top:2px; }
        .bd-rating-row { display:flex; align-items:center; gap:8px; margin-bottom:18px; }
        .stars { display:flex; gap:2px; align-items:center; }
        .bd-rating-val { font-size:14px; font-weight:700; color:var(--text); }
        .bd-rating-count { font-size:12px; color:var(--muted); }
        .bd-desc { font-family:var(--body); font-size:15px; font-style:italic; color:#5a4030; line-height:1.9; margin-bottom:22px; }

        /* price */
        .bd-price-block { background:var(--bg); border:1.5px solid var(--border); border-radius:14px; padding:16px 20px; margin-bottom:20px; }
        .bd-price-row { display:flex; align-items:baseline; gap:10px; margin-bottom:5px; }
        .bd-price { font-family:var(--body); font-size:28px; font-weight:700; color:var(--text); }
        .bd-mrp { font-size:16px; color:var(--muted); text-decoration:line-through; }
        .bd-discount { font-size:12px; font-weight:700; color:#15803d; background:#f0fdf4; border:1px solid #86efac; padding:3px 9px; border-radius:99px; }
        .bd-price-note { font-size:11px; color:var(--muted); }

        /* buy buttons */
        .bd-buy-row { display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin-bottom:20px; }
        .bd-buy-btn {
          display:inline-flex; align-items:center; gap:9px;
          background:linear-gradient(135deg,#ff9900,#e07b00);
          color:#fff; text-decoration:none; border:none; cursor:pointer;
          border-radius:10px; padding:13px 24px;
          font-family:var(--sans); font-size:13px; font-weight:700; letter-spacing:.04em;
          box-shadow:0 4px 18px rgba(255,153,0,.35);
          transition:transform .22s ease, box-shadow .22s ease;
        }
        .bd-buy-btn:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(255,153,0,.48); }
        .bd-buy-fk { background:linear-gradient(135deg,#2874f0,#1a5cc8); box-shadow:0 4px 18px rgba(40,116,240,.3); }
        .bd-buy-fk:hover { box-shadow:0 8px 28px rgba(40,116,240,.44); }
        .bd-share-btn {
          width:44px; height:44px; border-radius:10px;
          background:var(--bg2); border:1.5px solid var(--border);
          color:var(--muted); cursor:pointer; display:flex; align-items:center; justify-content:center;
          transition:color .2s, border-color .2s, background .2s;
        }
        .bd-share-btn:hover { color:var(--o); border-color:rgba(200,85,26,.4); background:rgba(200,85,26,.06); }

        .bd-chips { display:flex; flex-wrap:wrap; gap:7px; margin-bottom:20px; }
        .bd-chip { font-size:10px; font-weight:600; padding:5px 12px; border-radius:99px; background:var(--bg); color:#8a5020; border:1.5px solid var(--border); }

        .bd-meta-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .bd-meta-item { background:var(--bg); border-radius:10px; padding:10px 14px; }
        .bd-meta-lbl { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.16em; color:var(--muted); margin-bottom:3px; }
        .bd-meta-val { font-size:14px; font-weight:700; color:var(--text); }

        /* tabs */
        .bd-tabs-wrap { background:var(--card); border:1.5px solid var(--border); border-radius:0 0 24px 24px; border-top:none; overflow:hidden; }
        .bd-tabs { display:flex; border-bottom:1.5px solid var(--border); background:var(--bg); }
        .bd-tab {
          padding:14px 24px; background:none; border:none;
          font-family:var(--sans); font-size:12px; font-weight:600;
          color:var(--muted); cursor:pointer; border-bottom:2px solid transparent;
          margin-bottom:-1.5px; display:flex; align-items:center; gap:6px;
          transition:color .2s, border-color .2s;
        }
        .bd-tab:hover { color:var(--text); }
        .bd-tab-active { color:var(--o); border-bottom-color:var(--o); }
        .bd-tab-badge { background:rgba(200,85,26,.1); color:var(--o); border-radius:99px; font-size:9px; padding:1px 7px; font-weight:700; }
        .bd-tab-content { padding:32px; }

        .bd-about-text { font-family:var(--body); font-size:16px; font-style:italic; color:#5a4030; line-height:1.95; }

        .bd-highlights { display:flex; flex-direction:column; gap:14px; }
        .bd-hl-intro { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.16em; color:var(--muted); margin-bottom:6px; }
        .bd-hl-item { display:flex; align-items:center; gap:16px; }
        .bd-hl-num { font-family:var(--body); font-size:22px; font-weight:700; color:rgba(200,85,26,.25); flex-shrink:0; min-width:32px; }
        .bd-hl-text { font-family:var(--sans); font-size:14px; color:var(--text); line-height:1.55; font-weight:500; }

        .bd-reviews-header { display:flex; gap:48px; align-items:flex-start; margin-bottom:28px; flex-wrap:wrap; }
        .bd-reviews-score { text-align:center; }
        .bd-reviews-big { font-family:var(--body); font-size:56px; font-weight:700; color:var(--text); line-height:1; margin-bottom:6px; }
        .bd-reviews-total { font-size:11px; color:var(--muted); font-weight:600; margin-top:5px; }
        .bd-reviews-bars { flex:1; min-width:200px; display:flex; flex-direction:column; gap:6px; }
        .bd-bar-row { display:flex; align-items:center; gap:10px; }
        .bd-bar-lbl { font-size:11px; color:var(--muted); font-weight:600; min-width:22px; }
        .bd-bar-track { flex:1; height:7px; background:var(--bg2); border-radius:99px; overflow:hidden; }
        .bd-bar-fill { height:100%; background:linear-gradient(90deg,var(--o),var(--g)); border-radius:99px; }
        .bd-bar-pct { font-size:10px; color:var(--muted); min-width:28px; }
        .bd-reviews-list { display:flex; flex-direction:column; gap:16px; }
        .bd-review-card { background:var(--bg); border-radius:14px; padding:18px 20px; border:1.5px solid var(--border); }
        .bd-review-top { display:flex; align-items:center; gap:12px; margin-bottom:10px; flex-wrap:wrap; }
        .bd-review-avatar { width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,var(--o),var(--g)); color:#fff; font-size:13px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .bd-review-name { font-size:13px; font-weight:700; color:var(--text); }
        .bd-review-city { font-size:10px; color:var(--muted); }
        .bd-review-text { font-family:var(--body); font-size:14px; font-style:italic; color:#5a4030; line-height:1.75; }
        .bd-reviews-cta { margin-top:20px; padding-top:20px; border-top:1.5px solid var(--border); }
        .bd-reviews-amazon { display:inline-flex; align-items:center; gap:8px; color:var(--o); text-decoration:none; font-size:13px; font-weight:700; border:1.5px solid rgba(200,85,26,.3); padding:10px 20px; border-radius:99px; transition:background .2s; }
        .bd-reviews-amazon:hover { background:rgba(200,85,26,.06); }

        /* sticky bar */
        .bd-sticky-bar {
          position:fixed; bottom:0; left:0; right:0; z-index:200;
          background:var(--card); border-top:1.5px solid var(--border);
          padding:12px 20px; display:none;
          align-items:center; justify-content:space-between;
          box-shadow:0 -4px 20px rgba(26,16,8,.1);
        }
        .bd-sticky-info { display:flex; flex-direction:column; gap:2px; }
        .bd-sticky-title { font-size:13px; font-weight:700; color:var(--text); }
        .bd-sticky-price { font-size:16px; font-weight:700; color:var(--o); }
        .bd-sticky-btn { display:flex; align-items:center; gap:8px; background:linear-gradient(135deg,#ff9900,#e07b00); color:#fff; text-decoration:none; border-radius:10px; padding:11px 22px; font-size:13px; font-weight:700; box-shadow:0 4px 14px rgba(255,153,0,.35); }

        /* ══════════════
           COMING SOON
        ══════════════ */
        .bp-coming { margin-top:24px; }
        .bp-coming-label { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.26em; color:var(--muted); margin-bottom:20px; }
        .bp-coming-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:16px; }
        .bp-coming-card {
          background:var(--card); border:1.5px dashed var(--border);
          border-radius:18px; padding:28px 24px;
          position:relative; overflow:hidden;
          transition:border-color .25s;
        }
        .bp-coming-card:hover { border-color:var(--border2); }
        .bp-coming-tag { font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.18em; color:var(--muted); background:var(--bg2); border-radius:99px; padding:3px 10px; display:inline-block; margin-bottom:12px; }
        .bp-coming-title { font-family:var(--body); font-size:20px; font-weight:700; color:var(--text); margin-bottom:6px; line-height:1.2; }
        .bp-coming-sub { font-family:var(--body); font-size:13px; font-style:italic; color:var(--muted); margin-bottom:14px; }
        .bp-coming-meta { display:flex; gap:10px; flex-wrap:wrap; }
        .bp-coming-chip { font-size:10px; font-weight:600; color:var(--muted); background:var(--bg2); padding:4px 11px; border-radius:99px; border:1px solid var(--border); }

        /* ══════════════
           SHARE SHEET
        ══════════════ */
        .bs-backdrop { position:fixed; inset:0; z-index:500; background:rgba(26,16,8,.5); display:flex; align-items:flex-end; justify-content:center; animation:bp-in .18s ease; }
        .bs-sheet { background:var(--card); border-radius:20px 20px 0 0; width:100%; max-width:460px; padding:12px 24px 32px; border:1.5px solid var(--border); border-bottom:none; box-shadow:0 -8px 40px rgba(26,16,8,.12); animation:bp-sheet .22s ease; }
        .bs-sheet-handle { width:36px; height:4px; background:var(--border); border-radius:2px; margin:0 auto 18px; }
        .bs-sheet-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:5px; }
        .bs-sheet-title { font-size:16px; font-weight:700; color:var(--text); }
        .bs-sheet-close { background:none; border:none; color:var(--muted); cursor:pointer; font-size:15px; }
        .bs-sheet-sub { font-size:12px; color:var(--muted); margin-bottom:22px; line-height:1.5; }
        .bs-sheet-icons { display:flex; justify-content:center; gap:22px; margin-bottom:22px; }
        .bs-sheet-icon { display:flex; flex-direction:column; align-items:center; gap:7px; text-decoration:none; }
        .bs-sheet-circle { width:52px; height:52px; border-radius:14px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:20px; transition:transform .2s, box-shadow .2s; }
        .bs-sheet-icon:hover .bs-sheet-circle { transform:scale(1.1); box-shadow:0 6px 18px rgba(0,0,0,.18); }
        .bs-sheet-icon span { font-size:10px; font-weight:600; color:var(--muted); }
        .bs-sheet-copy { display:flex; gap:8px; }
        .bs-sheet-input { flex:1; background:var(--bg); border:1.5px solid var(--border); border-radius:8px; padding:10px 13px; font-size:12px; color:var(--muted); outline:none; }
        .bs-sheet-copybtn { display:flex; align-items:center; gap:6px; background:var(--text); color:#fff; border:none; border-radius:8px; padding:10px 16px; font-size:12px; font-weight:700; cursor:pointer; white-space:nowrap; transition:background .2s; }
        .bs-copied { background:#15803d !important; }
        .bs-sheet-copybtn:hover:not(.bs-copied) { background:var(--o); }

        /* ══════════════
           RESPONSIVE
        ══════════════ */
        @media(max-width:900px) {
          .bd-hero { grid-template-columns:1fr; gap:40px; padding:32px; }
          .bd-book-stage { padding:30px 0 60px; }
          .bd-sticky-bar { display:flex; }
          .bd-tab-content { padding:20px 16px; }
        }
        @media(max-width:640px) {
          .bd-hero { padding:24px; }
          .bd-book { width:200px; height:285px; }
          .bp-hero { padding:56px 0 40px; }
          .bd-reviews-header { gap:24px; }
          .bd-meta-grid { grid-template-columns:1fr 1fr; }
        }
      `}</style>
      {/* ── HERO ── */}
      <div className="bp-hero">
        <div className="bp-hero-inner">
          <div className="bp-hero-eyebrow">Books by Guruji Shrawan</div>
          <h1 className="bp-hero-h1">Written <em>Wisdom</em></h1>
          <p className="bp-hero-sub">Books that invite honest inquiry into life, mind and the patterns we carry.</p>
          <div className="bp-hero-stats">
            <div>
              <div className="bp-hero-stat-val">{BOOKS.length}</div>
              <div className="bp-hero-stat-lbl">Book Published</div>
            </div>
            <div className="bp-hero-vsep"/>
            <div>
              <div className="bp-hero-stat-val">5.0★</div>
              <div className="bp-hero-stat-lbl">Avg. Rating</div>
            </div>
            <div className="bp-hero-vsep"/>
            <div>
              <div className="bp-hero-stat-val">Hindi</div>
              <div className="bp-hero-stat-lbl">Language</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOOKS ── */}
      <div className="bp-main">
        {BOOKS.map(book=>(
          <BookDetail key={book.id} book={book}/>
        ))}

        {/* Coming soon */}
        {COMING_SOON.length > 0 && (
          <div className="bp-coming">
            <Reveal>
              <p className="bp-coming-label">Coming Soon</p>
              <div className="bp-coming-grid">
                {COMING_SOON.map(b=>(
                  <div key={b.title} className="bp-coming-card">
                    <div className="bp-coming-tag">Upcoming</div>
                    <div className="bp-coming-title">{b.title}</div>
                    <div className="bp-coming-sub">{b.subtitle}</div>
                    <div className="bp-coming-meta">
                      <span className="bp-coming-chip">{b.lang}</span>
                      <span className="bp-coming-chip">Est. {b.eta}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </main>
  )
}