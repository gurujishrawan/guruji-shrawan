"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { FaArrowRight, FaYoutube, FaInstagram, FaFacebook, FaBookOpen, FaUsers, FaPlay, FaHeart } from "react-icons/fa"

/* ── For the app router, create app/about/page.tsx and export metadata there ── */

const MISSION_POINTS = [
  { n:"01", title:"Truth over Tradition",   body:"Every teaching encourages direct observation — not belief inherited from tradition, but clarity arrived at through honest self-inquiry." },
  { n:"02", title:"Free & Accessible",      body:"All satsangs, articles and videos are offered freely. Knowledge must not be locked behind a paywall or social status." },
  { n:"03", title:"Bihar to the World",     body:"Rooted in Bhagalpur, Bihar, Guruji's work reaches students, professionals and seekers across India and internationally." },
  { n:"04", title:"Modern & Timeless",      body:"Vedanta and Buddhist wisdom are brought alive for contemporary life — practical, honest and free from religious dogma." },
]

const TEAM = [
  { name:"Guruji Shrawan",      role:"Founder & Teacher",    initials:"GS", color:"#c8551a" },
  { name:"Foundation Team",     role:"Events & Outreach",    initials:"FT", color:"#b8841a" },
  { name:"Content Team",        role:"Articles & Videos",    initials:"CT", color:"#2563eb" },
]

const STATS = [
  { val:"6.2K+", lbl:"Followers" },
  { val:"100K+", lbl:"YouTube Views" },
  { val:"30+",   lbl:"Articles" },
  { val:"2024",  lbl:"Book Published" },
]

function useInView(t=0.1){
  const ref=useRef<HTMLDivElement>(null)
  const [v,setV]=useState(false)
  useEffect(()=>{
    const el=ref.current;if(!el)return
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);obs.disconnect()}},{threshold:t})
    obs.observe(el);return()=>obs.disconnect()
  },[t])
  return{ref,v}
}
function Reveal({children,delay=0,dir="up"}:{children:React.ReactNode;delay?:number;dir?:string}){
  const {ref,v}=useInView(0.08)
  const t={up:"translateY(28px)",left:"translateX(-24px)",right:"translateX(24px)"}
  return(
    <div ref={ref} style={{opacity:v?1:0,transform:v?"none":((t as any)[dir]||t.up),transition:`opacity .7s ${delay}ms ease,transform .7s ${delay}ms ease`}}>
      {children}
    </div>
  )
}

export default function AboutPage(){
  const [loaded,setLoaded]=useState(false)
  useEffect(()=>setLoaded(true),[])

  return(
    <main className="ap-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Poppins:wght@300;400;500;600;700;800&display=swap');
        :root{--o:#c8551a;--g:#b8841a;--bg:#faf7f2;--bg2:#f4efe6;--bg3:#ede5d8;--card:#fff;--border:#e8ddd0;--border2:#d8c9b8;--text:#1a1008;--muted:#8a7a6a;--sans:'Poppins',system-ui,sans-serif;--body:'Lora',Georgia,serif;--shadow:0 2px 14px rgba(26,16,8,.07);--shadow2:0 10px 36px rgba(26,16,8,.12)}
        @keyframes ap-up {from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes ap-in {from{opacity:0}to{opacity:1}}
        @keyframes ap-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes ap-line{from{width:0}to{width:100%}}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .ap-root{background:var(--bg);color:var(--text);font-family:var(--sans);min-height:100vh;overflow-x:hidden}

        /* ── HERO ── */
        .ap-hero{min-height:90svh;display:grid;grid-template-columns:55% 45%;overflow:hidden;position:relative}
        .ap-hero-l{display:flex;flex-direction:column;justify-content:center;padding:120px 60px 80px 72px;position:relative;z-index:2;background:var(--bg)}
        .ap-hero-l::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(to bottom,transparent,var(--o) 40%,var(--g) 70%,transparent);opacity:.35}
        .ap-eyebrow{display:inline-flex;align-items:center;gap:9px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.26em;color:var(--o);margin-bottom:18px;animation:${loaded?"ap-in .8s .1s ease both":"none"}}
        .ap-eyebrow::before{content:'';display:block;width:26px;height:1.5px;background:var(--o);border-radius:1px}
        .ap-hero-h1{font-family:var(--body);font-size:clamp(34px,4.5vw,62px);font-weight:700;color:var(--text);line-height:1.1;letter-spacing:-.025em;animation:${loaded?"ap-up .9s .2s ease both":"none"}}
        .ap-hero-h1 em{font-style:italic;color:var(--o)}
        .ap-hero-rule{height:2px;background:linear-gradient(to right,var(--o),var(--g),transparent);border-radius:1px;margin:22px 0;animation:${loaded?"ap-line 1s .7s ease both":"none"};width:${loaded?"100%":"0%"}}
        .ap-hero-body{font-family:var(--body);font-size:17px;font-style:italic;color:var(--muted);line-height:1.9;max-width:460px;animation:${loaded?"ap-up .9s .4s ease both":"none"}}
        .ap-hero-btns{display:flex;gap:12px;flex-wrap:wrap;margin-top:32px;animation:${loaded?"ap-up .9s .55s ease both":"none"}}
        .ap-btn-primary{display:inline-flex;align-items:center;gap:8px;padding:13px 26px;border-radius:99px;background:linear-gradient(135deg,var(--o),#8a2e06);color:#fff;text-decoration:none;font-size:13px;font-weight:700;box-shadow:0 6px 20px rgba(200,85,26,.32);transition:transform .22s,box-shadow .22s}
        .ap-btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(200,85,26,.44)}
        .ap-btn-secondary{display:inline-flex;align-items:center;gap:8px;padding:13px 26px;border-radius:99px;background:var(--card);color:var(--text);text-decoration:none;font-size:13px;font-weight:600;border:1.5px solid var(--border);transition:border-color .22s,color .22s,transform .22s}
        .ap-btn-secondary:hover{border-color:var(--o);color:var(--o);transform:translateY(-2px)}

        .ap-hero-r{position:relative;overflow:hidden}
        .ap-hero-r::before{content:'';position:absolute;top:0;left:0;bottom:0;width:80px;background:linear-gradient(to right,var(--bg),transparent);z-index:2;pointer-events:none}
        .ap-hero-r::after{content:'';position:absolute;bottom:0;left:0;right:0;height:45%;background:linear-gradient(to top,rgba(26,16,8,.45),transparent);z-index:2;pointer-events:none}
        .ap-photo-badge{position:absolute;bottom:44px;left:68px;z-index:3;background:rgba(250,247,242,.94);backdrop-filter:blur(12px);border:1.5px solid var(--border);border-radius:14px;padding:12px 18px;box-shadow:0 8px 24px rgba(0,0,0,.1);animation:${loaded?"ap-up .9s 1s ease both":"none"}}
        .ap-badge-name{font-size:13px;font-weight:700;color:var(--text)}
        .ap-badge-role{font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.14em;color:var(--o);margin-top:3px}

        /* ── STATS ── */
        .ap-stats-band{background:var(--text);padding:36px 24px}
        .ap-stats-inner{max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:0}
        .ap-stat{text-align:center;padding:16px;border-right:1px solid rgba(255,255,255,.1)}
        .ap-stat:last-child{border-right:none}
        .ap-stat-val{font-family:var(--body);font-size:clamp(28px,4vw,44px);font-weight:700;color:var(--o);line-height:1}
        .ap-stat-lbl{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.16em;color:rgba(255,255,255,.45);margin-top:6px}

        /* ── SECTION ── */
        .ap-sec{padding:88px 0}
        .ap-sec-inner{max-width:1100px;margin:0 auto;padding:0 24px}
        .ap-sec-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.24em;color:var(--o);margin-bottom:10px}
        .ap-sec-eyebrow::before,.ap-sec-eyebrow::after{content:'';display:block;height:1.5px;background:var(--o);opacity:.3;border-radius:1px}
        .ap-sec-eyebrow::before{width:20px}.ap-sec-eyebrow::after{width:20px}
        .ap-sec-h2{font-family:var(--body);font-size:clamp(26px,3vw,42px);font-weight:700;color:var(--text);line-height:1.18;letter-spacing:-.022em}
        .ap-sec-sub{font-size:14px;color:var(--muted);line-height:1.85;margin-top:10px;max-width:540px}
        .ap-divider{width:100%;height:1px;background:linear-gradient(90deg,transparent,var(--border),transparent)}

        /* ── MISSION GRID ── */
        .ap-mission-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:44px}
        .ap-mission-card{background:var(--card);border:1.5px solid var(--border);border-radius:20px;padding:28px 26px;position:relative;overflow:hidden;transition:transform .28s,box-shadow .28s,border-color .28s}
        .ap-mission-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--o),var(--g));transform:scaleX(0);transform-origin:left;transition:transform .3s}
        .ap-mission-card:hover::before{transform:scaleX(1)}
        .ap-mission-card:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(200,85,26,.1);border-color:rgba(200,85,26,.28)}
        .ap-mission-num{font-family:var(--body);font-size:42px;font-weight:700;color:rgba(200,85,26,.15);line-height:1;margin-bottom:14px}
        .ap-mission-title{font-size:14px;font-weight:700;color:var(--text);margin-bottom:9px}
        .ap-mission-body{font-size:13px;color:var(--muted);line-height:1.8}

        /* ── DARK STORY STRIP ── */
        .ap-story{background:linear-gradient(135deg,#1a1008,#2a1608 55%,#1a1008);padding:88px 0;position:relative;overflow:hidden}
        .ap-story::after{content:'ॐ';position:absolute;right:-20px;bottom:-80px;font-size:440px;color:rgba(255,255,255,.025);font-family:serif;pointer-events:none;user-select:none;line-height:1}
        .ap-story-inner{max-width:1100px;margin:0 auto;padding:0 24px;display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;position:relative;z-index:1}
        .ap-story-eyebrow{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.24em;color:var(--g);margin-bottom:14px}
        .ap-story-h2{font-family:var(--body);font-size:clamp(26px,3vw,42px);font-weight:700;color:#fff;line-height:1.18;letter-spacing:-.022em;margin-bottom:18px}
        .ap-story-h2 em{font-style:italic;color:var(--g)}
        .ap-story-p{font-family:var(--body);font-size:16px;font-style:italic;color:rgba(255,255,255,.68);line-height:1.95;margin-bottom:14px}
        .ap-story-link{display:inline-flex;align-items:center;gap:7px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:var(--o);text-decoration:none;margin-top:8px;border-bottom:1px solid rgba(200,85,26,.3);padding-bottom:2px;transition:gap .2s,border-color .2s}
        .ap-story-link:hover{gap:12px;border-color:var(--o)}
        .ap-story-photo{border-radius:22px;overflow:hidden;aspect-ratio:4/5;border:2px solid rgba(200,85,26,.2);box-shadow:0 32px 64px rgba(0,0,0,.35);position:relative}

        /* ── TEAM ── */
        .ap-team-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:44px}
        .ap-team-card{background:var(--card);border:1.5px solid var(--border);border-radius:20px;padding:28px 22px;text-align:center;transition:transform .25s,box-shadow .25s}
        .ap-team-card:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(200,85,26,.1)}
        .ap-team-avatar{width:60px;height:60px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;font-size:16px;font-weight:700;color:#fff}
        .ap-team-name{font-size:14px;font-weight:700;color:var(--text);margin-bottom:4px}
        .ap-team-role{font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.12em}

        /* ── CTA BAND ── */
        .ap-cta-band{background:linear-gradient(135deg,var(--o),#8a2e06);padding:72px 24px;text-align:center;position:relative;overflow:hidden}
        .ap-cta-band::before{content:'';position:absolute;top:-60px;right:-60px;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.1),transparent 70%);pointer-events:none}
        .ap-cta-h2{font-family:var(--body);font-size:clamp(26px,3.5vw,44px);font-weight:700;color:#fff;line-height:1.2;letter-spacing:-.02em;margin-bottom:12px}
        .ap-cta-h2 em{font-style:italic;color:rgba(255,255,255,.8)}
        .ap-cta-sub{font-family:var(--body);font-size:16px;font-style:italic;color:rgba(255,255,255,.72);line-height:1.75;max-width:480px;margin:0 auto 32px}
        .ap-cta-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
        .ap-cta-btn-white{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border-radius:99px;background:#fff;color:var(--o);text-decoration:none;font-size:13px;font-weight:700;box-shadow:0 6px 20px rgba(0,0,0,.15);transition:transform .2s,box-shadow .2s}
        .ap-cta-btn-white:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(0,0,0,.22)}
        .ap-cta-btn-ghost{display:inline-flex;align-items:center;gap:8px;padding:14px 28px;border-radius:99px;background:transparent;color:rgba(255,255,255,.85);text-decoration:none;font-size:13px;font-weight:600;border:1.5px solid rgba(255,255,255,.3);transition:border-color .2s,color .2s}
        .ap-cta-btn-ghost:hover{border-color:rgba(255,255,255,.6);color:#fff}

        /* AD SLOTS */
        .ap-ad-slot{background:var(--bg2);border:1px dashed var(--border);border-radius:12px;min-height:90px;display:flex;align-items:center;justify-content:center;margin:24px 0;font-size:11px;color:var(--muted);font-weight:600;letter-spacing:.08em;text-transform:uppercase}

        @media(max-width:860px){.ap-hero{grid-template-columns:1fr;min-height:auto}.ap-hero-l{padding:88px 24px 40px}.ap-hero-r{height:70vw;min-height:320px}.ap-hero-r::before{width:40px}.ap-stats-inner{grid-template-columns:repeat(2,1fr)}.ap-story-inner{grid-template-columns:1fr;gap:40px}.ap-story-photo{max-height:300px}.ap-mission-grid{grid-template-columns:1fr}.ap-team-grid{grid-template-columns:1fr 1fr}}
        @media(max-width:480px){.ap-sec{padding:60px 0}.ap-team-grid{grid-template-columns:1fr}.ap-stats-inner{grid-template-columns:repeat(2,1fr)}}
      `}</style>

      {/* ── HERO ── */}
      <section className="ap-hero" aria-labelledby="about-h1">
        <div className="ap-hero-l">
          <div className="ap-eyebrow">About Us</div>
          <h1 id="about-h1" className="ap-hero-h1">
            Guruji Shrawan<br/><em>Foundation</em>
          </h1>
          <div className="ap-hero-rule"/>
          <p className="ap-hero-body">
            A movement dedicated to spreading timeless wisdom — honestly, freely and without condition — to every person who seeks genuine clarity.
          </p>
          <div className="ap-hero-btns">
            <Link href="/biography" className="ap-btn-primary">Read Biography <FaArrowRight size={10}/></Link>
            <Link href="/articles"  className="ap-btn-secondary">Explore Articles</Link>
          </div>
        </div>
        <div className="ap-hero-r">
          <Image src="/images/guruji.jpg" alt="Guruji Shrawan — Spiritual Teacher" fill priority
            sizes="(max-width:860px) 100vw,45vw" style={{objectFit:"cover",objectPosition:"center top"}}/>
          <div className="ap-photo-badge">
            <div className="ap-badge-name">Guruji Shrawan</div>
            <div className="ap-badge-role">Spiritual Teacher · Author · Bhagalpur</div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="ap-stats-band" aria-label="Impact statistics">
        <div className="ap-stats-inner">
          {STATS.map(s=>(
            <div key={s.lbl} className="ap-stat">
              <div className="ap-stat-val">{s.val}</div>
              <div className="ap-stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MISSION ── */}
      <section className="ap-sec" aria-labelledby="mission-h2">
        <div className="ap-sec-inner">
          <Reveal>
            <div className="ap-sec-eyebrow">Our Mission</div>
            <h2 id="mission-h2" className="ap-sec-h2">What We Stand For</h2>
            <p className="ap-sec-sub">Four principles that guide everything Guruji Shrawan and the Foundation do.</p>
          </Reveal>
          <div className="ap-mission-grid">
            {MISSION_POINTS.map((m,i)=>(
              <Reveal key={m.n} delay={i*70}>
                <div className="ap-mission-card">
                  <div className="ap-mission-num">{m.n}</div>
                  <div className="ap-mission-title">{m.title}</div>
                  <div className="ap-mission-body">{m.body}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* AdSense slot between sections */}
      <div className="ap-sec-inner" style={{maxWidth:1100,margin:"0 auto",padding:"0 24px"}}>
        <div className="ap-ad-slot" aria-label="Advertisement">Advertisement</div>
      </div>

      <div className="ap-divider"/>

      {/* ── STORY DARK STRIP ── */}
      <section className="ap-story" aria-labelledby="story-h2">
        <div className="ap-story-inner">
          <Reveal dir="left">
            <div>
              <p className="ap-story-eyebrow">The Story</p>
              <h2 id="story-h2" className="ap-story-h2">Born in <em>Bhagalpur</em>,<br/>Heard Worldwide</h2>
              <p className="ap-story-p">
                Guruji Shrawan was born in 1990 in Bhagalpur, Bihar. From his earliest years he refused to accept inherited beliefs uncritically — a quality that would eventually become the heart of his teaching.
              </p>
              <p className="ap-story-p">
                Through years of quiet inquiry, reading and reflection, he arrived at a direct understanding of Vedanta, human psychology and the patterns that cause suffering. He began sharing this in small dialogues — and a movement was born.
              </p>
              <Link href="/biography" className="ap-story-link">
                Read the full biography <FaArrowRight size={9}/>
              </Link>
            </div>
          </Reveal>
          <Reveal dir="right" delay={160}>
            <div className="ap-story-photo">
              <Image src="/images/hero1.jpg" alt="Guruji Shrawan teaching" fill
                sizes="(max-width:860px) 90vw,45vw" style={{objectFit:"cover"}}/>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="ap-sec" aria-labelledby="team-h2">
        <div className="ap-sec-inner">
          <Reveal>
            <div className="ap-sec-eyebrow">The People</div>
            <h2 id="team-h2" className="ap-sec-h2">Behind the Mission</h2>
            <p className="ap-sec-sub">A small, dedicated team working to make these teachings reach as many people as possible.</p>
          </Reveal>
          <div className="ap-team-grid">
            {TEAM.map((t,i)=>(
              <Reveal key={t.name} delay={i*80}>
                <div className="ap-team-card">
                  <div className="ap-team-avatar" style={{background:t.color}}>{t.initials}</div>
                  <div className="ap-team-name">{t.name}</div>
                  <div className="ap-team-role">{t.role}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="ap-cta-band" aria-labelledby="about-cta-h2">
        <h2 id="about-cta-h2" className="ap-cta-h2">Begin the <em>Journey</em></h2>
        <p className="ap-cta-sub">Explore teachings, articles and videos — and support the mission of spreading wisdom freely.</p>
        <div className="ap-cta-btns">
          <Link href="/articles"  className="ap-cta-btn-white"><FaBookOpen size={12}/> Read Articles</Link>
          <Link href="/donate"    className="ap-cta-btn-ghost"><FaHeart size={11}/> Support Us</Link>
          <a href="https://youtube.com/@gurujishrawan" target="_blank" rel="noopener noreferrer" className="ap-cta-btn-ghost">
            <FaYoutube size={12}/> YouTube
          </a>
        </div>
      </section>
    </main>
  )
}