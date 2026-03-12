"use client"

import Link from "next/link"
import { useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { Check, Loader2 } from "lucide-react"
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

const SANS   = "'Poppins', system-ui, sans-serif"
const ORANGE = "#c8551a"
const GOLD   = "#b8841a"

const SOCIAL = [
  { name:"YouTube",   icon:<FaYoutube  size={18}/>, href:"https://youtube.com/@gurujishrawan",   color:"#ff4444" },
  { name:"Instagram", icon:<FaInstagram size={18}/>, href:"https://instagram.com/gurujishrawan",  color:"#e1306c" },
  { name:"Facebook",  icon:<FaFacebook size={18}/>, href:"https://facebook.com/gurujishrawan",   color:"#1877f2" },
  { name:"X",         icon:<FaXTwitter size={17}/>, href:"https://x.com/gurujishrawan",          color:"#e7e7e7" },
]

const LINKS = {
  "Teachings": [
    { label:"Articles",      href:"/articles"     },
    { label:"Books",         href:"/books"        },
    { label:"Video Series",  href:"/video-series" },
    { label:"YouTube",       href:"/youtube"      },
  ],
  "About": [
    { label:"Biography",     href:"/biography"          },
    { label:"Media",         href:"/media"              },
    { label:"Contact",       href:"mailto:hello@gurujishrawan.com" },
    { label:"Privacy Policy",href:"/privacy"            },
    { label:"Terms",         href:"/terms"              },
  ],
  "Download App": [
    { label:"Google Play",   href:"https://play.google.com",        ext:true },
    { label:"App Store",     href:"https://apple.com/app-store",    ext:true },
    { label:"hello@gurujishrawan.com", href:"mailto:hello@gurujishrawan.com" },
    { label:"+91 90000 00000",         href:"tel:+919000000000"              },
  ],
}

export default function Footer() {
  const [email, setEmail] = useState("")
  const [sub,   setSub]   = useState(false)
  const [busy,  setBusy]  = useState(false)

  async function subscribe() {
    if (!email.includes("@")) return
    setBusy(true)
    await supabase.from("newsletter_subscribers").upsert(
      { email: email.trim().toLowerCase() },
      { onConflict: "email" }
    )
    setBusy(false); setSub(true)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

        .ft{background:#0e0b07;color:#fff;font-family:${SANS};}

        /* newsletter strip */
        .ft-nl{
          background:linear-gradient(135deg,#1e0d04 0%,#2e1008 50%,#1a0c06 100%);
          border-bottom:1px solid rgba(255,255,255,0.06);
          padding:36px 20px;
        }
        .ft-nl-in{max-width:1180px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:center;}
        .ft-nl-label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.18em;color:${GOLD};margin-bottom:6px;}
        .ft-nl-h{font-size:clamp(18px,2.2vw,24px);font-weight:800;color:#fff;line-height:1.3;margin-bottom:4px;}
        .ft-nl-sub{font-size:13px;color:rgba(255,255,255,0.50);line-height:1.65;}
        .ft-nl-form{display:flex;gap:8px;}
        .ft-nl-input{flex:1;padding:11px 16px;border-radius:10px;border:1.5px solid rgba(255,255,255,0.10);background:rgba(255,255,255,0.06);font-family:${SANS};font-size:13px;color:#fff;outline:none;min-width:0;transition:border-color .15s;}
        .ft-nl-input::placeholder{color:rgba(255,255,255,0.30);}
        .ft-nl-input:focus{border-color:${ORANGE};}
        .ft-nl-btn{padding:11px 22px;border-radius:10px;background:linear-gradient(135deg,${ORANGE},#8a2e06);color:#fff;font-family:${SANS};font-size:13px;font-weight:700;border:none;cursor:pointer;white-space:nowrap;flex-shrink:0;transition:opacity .15s;}
        .ft-nl-btn:hover{opacity:.88;}
        .ft-nl-ok{display:flex;align-items:center;gap:8px;padding:11px 18px;border-radius:10px;background:rgba(21,128,61,0.18);border:1.5px solid rgba(134,239,172,0.30);font-size:13px;color:#86efac;font-weight:600;}

        /* main grid */
        .ft-main{max-width:1180px;margin:0 auto;padding:52px 20px 40px;display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:40px;}

        /* brand col */
        .ft-brand-logo{display:flex;align-items:center;gap:10px;margin-bottom:16px;}
        .ft-brand-flame{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,${ORANGE},#7a2606);display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 3px 12px rgba(200,85,26,0.35);}
        .ft-brand-name{font-size:16px;font-weight:800;color:#fff;letter-spacing:-0.03em;}
        .ft-brand-name em{color:${ORANGE};font-style:normal;}
        .ft-brand-desc{font-size:13px;color:rgba(255,255,255,0.45);line-height:1.75;margin-bottom:22px;max-width:240px;}
        .ft-social{display:flex;gap:8px;}
        .ft-social-a{width:36px;height:36px;border-radius:9px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;text-decoration:none;color:rgba(255,255,255,0.55);transition:all .18s;}
        .ft-social-a:hover{background:rgba(255,255,255,0.12);color:#fff;transform:translateY(-2px);}

        /* link columns */
        .ft-col-h{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.14em;color:${GOLD};margin-bottom:16px;}
        .ft-col ul{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:2px;}
        .ft-col-a{display:block;padding:5px 0;font-size:13px;color:rgba(255,255,255,0.50);text-decoration:none;transition:color .15s;}
        .ft-col-a:hover{color:#fff;}

        /* bottom bar */
        .ft-bot{border-top:1px solid rgba(255,255,255,0.07);padding:18px 20px;}
        .ft-bot-in{max-width:1180px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;}
        .ft-bot-copy{font-size:12px;color:rgba(255,255,255,0.28);}
        .ft-bot-links{display:flex;gap:20px;}
        .ft-bot-lnk{font-size:12px;color:rgba(255,255,255,0.28);text-decoration:none;transition:color .15s;}
        .ft-bot-lnk:hover{color:rgba(255,255,255,0.60);}

        /* made with */
        .ft-made{font-size:11px;color:rgba(255,255,255,0.20);}
        .ft-made span{color:${ORANGE};}

        /* RESPONSIVE */
        @media(max-width:900px){
          .ft-nl-in{grid-template-columns:1fr;}
          .ft-main{grid-template-columns:1fr 1fr;gap:32px;}
        }
        @media(max-width:560px){
          .ft-main{grid-template-columns:1fr;gap:28px;padding:36px 20px 28px;}
          .ft-nl-form{flex-direction:column;}
          .ft-bot-in{flex-direction:column;align-items:flex-start;gap:8px;}
          .ft-bot-links{flex-wrap:wrap;gap:12px;}
        }
      `}</style>

      <footer className="ft">

        {/* ── Newsletter strip ── */}
        <div className="ft-nl">
          <div className="ft-nl-in">
            <div>
              <p className="ft-nl-label">Newsletter</p>
              <h3 className="ft-nl-h">Wisdom in Your Inbox</h3>
              <p className="ft-nl-sub">One thoughtful email per week. No noise, just insight from Guruji Shrawan.</p>
            </div>
            <div>
              {sub ? (
                <div className="ft-nl-ok"><Check size={15}/> You're subscribed! Wisdom incoming. 🙏</div>
              ) : (
                <div className="ft-nl-form">
                  <input className="ft-nl-input" value={email} type="email" placeholder="Your email address"
                    onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key==="Enter"&&subscribe()}/>
                  <button className="ft-nl-btn" onClick={subscribe} disabled={busy}>
                    {busy ? <Loader2 size={15} style={{ animation:"spin 1s linear infinite" }}/> : "Subscribe"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="ft-main">

          {/* Brand */}
          <div>
            <div className="ft-brand-logo">
              <div className="ft-brand-flame">🔥</div>
              <span className="ft-brand-name">Guruji <em>Shrawan</em></span>
            </div>
            <p className="ft-brand-desc">
              A platform for deep inquiry, rational spirituality, and conscious living. Every word offered as a lamp for the seeker.
            </p>
            <div className="ft-social">
              {SOCIAL.map(s => (
                <a key={s.name} className="ft-social-a" href={s.href} target="_blank" rel="noopener noreferrer"
                  aria-label={s.name} title={s.name}
                  onMouseEnter={e => e.currentTarget.style.color=s.color}
                  onMouseLeave={e => e.currentTarget.style.color=""}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div className="ft-col" key={heading}>
              <p className="ft-col-h">{heading}</p>
              <ul>
                {links.map(({ label, href, ext }) => (
                  <li key={label}>
                    {ext ? (
                      <a className="ft-col-a" href={href} target="_blank" rel="noopener noreferrer">{label}</a>
                    ) : href.startsWith("mailto:") || href.startsWith("tel:") ? (
                      <a className="ft-col-a" href={href}>{label}</a>
                    ) : (
                      <Link className="ft-col-a" href={href}>{label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="ft-bot">
          <div className="ft-bot-in">
            <p className="ft-bot-copy">© {new Date().getFullYear()} Guruji Shrawan Foundation. All rights reserved.</p>
            <div className="ft-bot-links">
              <Link href="/privacy" className="ft-bot-lnk">Privacy Policy</Link>
              <Link href="/terms"   className="ft-bot-lnk">Terms of Service</Link>
              <a href="mailto:hello@gurujishrawan.com" className="ft-bot-lnk">Contact</a>
            </div>
            <p className="ft-made">Made with <span>♥</span> by seekers, for seekers</p>
          </div>
        </div>

      </footer>
    </>
  )
}