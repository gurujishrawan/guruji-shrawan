"use client"

import { useState } from "react"
import Link from "next/link"
import { FaYoutube, FaInstagram, FaFacebook, FaEnvelope, FaWhatsapp, FaPaperPlane, FaCheck, FaTimes, FaMapMarkerAlt, FaPhone } from "react-icons/fa"
import { supabase } from "../lib/supabaseClient"
import type { Metadata } from "next"


const SOCIAL = [
  { icon:<FaYoutube size={18}/>,   name:"YouTube",   handle:"@gurujishrawan", href:"https://youtube.com/@gurujishrawan",   color:"#ff2b00" },
  { icon:<FaInstagram size={18}/>, name:"Instagram", handle:"@gurujishrawan", href:"https://instagram.com/gurujishrawan", color:"#e1306c" },
  { icon:<FaFacebook size={18}/>,  name:"Facebook",  handle:"gurujishrawan",  href:"https://facebook.com/gurujishrawan",  color:"#1877f2" },
  { icon:<FaWhatsapp size={18}/>,  name:"WhatsApp",  handle:"Message us",     href:"https://wa.me/919999793389",          color:"#25d366" },
]

const TOPICS = ["General Inquiry","Event / Satsang","Books & Publications","Media & Press","Volunteer","Donation / Support","Other"]

export default function ContactPage() {
  const [form,    setForm]    = useState({ name:"", email:"", topic:"General Inquiry", message:"" })
  const [loading, setLoading] = useState(false)
  const [status,  setStatus]  = useState<"idle"|"success"|"error">("idle")
  const [errMsg,  setErrMsg]  = useState("")

  function set(k: string, v: string){ setForm(f=>({...f,[k]:v})) }

  async function submit(e: React.FormEvent){
    e.preventDefault()
    if(!form.name.trim()||!form.email.trim()||!form.message.trim()) return
    setLoading(true); setStatus("idle"); setErrMsg("")
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      topic: form.topic,
      message: form.message.trim(),
    })
    setLoading(false)
    if(error){ setStatus("error"); setErrMsg(error.message) }
    else { setStatus("success"); setForm({ name:"", email:"", topic:"General Inquiry", message:"" }) }
  }

  return (
    <main className="cp-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Poppins:wght@300;400;500;600;700;800&display=swap');
        :root{--o:#c8551a;--g:#b8841a;--bg:#faf7f2;--bg2:#f4efe6;--card:#fff;--border:#e8ddd0;--border2:#d8c9b8;--text:#1a1008;--muted:#8a7a6a;--sans:'Poppins',system-ui,sans-serif;--body:'Lora',Georgia,serif}
        @keyframes cp-up{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes cp-in{from{opacity:0}to{opacity:1}}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .cp-root{background:var(--bg);color:var(--text);font-family:var(--sans);min-height:100vh}

        /* HERO */
        .cp-hero{background:linear-gradient(160deg,#fffaf4,#faf7f2 50%,#fff6e8);border-bottom:1px solid var(--border);padding:72px 24px 64px;text-align:center;position:relative;overflow:hidden}
        .cp-hero::before{content:'"';position:absolute;top:-60px;left:-10px;font-family:var(--body);font-size:500px;font-weight:700;color:rgba(200,85,26,.04);line-height:1;pointer-events:none;user-select:none}
        .cp-hero-inner{max-width:580px;margin:0 auto;position:relative;z-index:1}
        .cp-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.26em;color:var(--o);margin-bottom:14px}
        .cp-eyebrow::before,.cp-eyebrow::after{content:'';display:block;width:22px;height:1.5px;background:var(--o);opacity:.35;border-radius:1px}
        .cp-hero-h1{font-family:var(--body);font-size:clamp(32px,5vw,54px);font-weight:700;color:var(--text);line-height:1.1;letter-spacing:-.025em;margin-bottom:12px}
        .cp-hero-h1 em{font-style:italic;color:var(--o)}
        .cp-hero-sub{font-family:var(--body);font-size:16px;font-style:italic;color:var(--muted);line-height:1.8}

        /* MAIN */
        .cp-main{max-width:1080px;margin:0 auto;padding:56px 24px 100px;display:grid;grid-template-columns:1fr 400px;gap:56px;align-items:start}

        /* FORM */
        .cp-form-card{background:var(--card);border:1.5px solid var(--border);border-radius:22px;padding:36px 32px;box-shadow:0 8px 32px rgba(26,16,8,.08)}
        .cp-form-title{font-family:var(--body);font-size:22px;font-weight:700;color:var(--text);margin-bottom:5px}
        .cp-form-sub{font-size:13px;color:var(--muted);margin-bottom:26px;line-height:1.65}
        .cp-field{margin-bottom:14px}
        .cp-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:var(--muted);margin-bottom:5px;display:block}
        .cp-input{width:100%;background:var(--bg);border:1.5px solid var(--border);border-radius:10px;padding:11px 13px;font-family:var(--sans);font-size:13px;color:var(--text);outline:none;transition:border-color .2s,box-shadow .2s}
        .cp-input:focus{border-color:rgba(200,85,26,.55);box-shadow:0 0 0 3px rgba(200,85,26,.09)}
        .cp-input::placeholder{color:#c8bdaf}
        .cp-select{width:100%;background:var(--bg);border:1.5px solid var(--border);border-radius:10px;padding:11px 13px;font-family:var(--sans);font-size:13px;color:var(--text);outline:none;cursor:pointer;transition:border-color .2s}
        .cp-select:focus{border-color:rgba(200,85,26,.55)}
        .cp-textarea{width:100%;background:var(--bg);border:1.5px solid var(--border);border-radius:10px;padding:11px 13px;font-family:var(--sans);font-size:13px;color:var(--text);outline:none;resize:none;line-height:1.6;transition:border-color .2s}
        .cp-textarea:focus{border-color:rgba(200,85,26,.55);box-shadow:0 0 0 3px rgba(200,85,26,.09)}
        .cp-submit{width:100%;display:flex;align-items:center;justify-content:center;gap:9px;background:linear-gradient(135deg,var(--o),#8a2e06);color:#fff;border:none;border-radius:12px;padding:14px;font-family:var(--sans);font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 6px 20px rgba(200,85,26,.3);transition:transform .2s,box-shadow .2s}
        .cp-submit:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(200,85,26,.42)}
        .cp-submit:disabled{opacity:.55;cursor:not-allowed;transform:none}
        .cp-success{display:flex;align-items:center;gap:10px;background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:14px 16px;font-size:13px;font-weight:600;color:#15803d;margin-top:14px}
        .cp-error-msg{display:flex;align-items:center;gap:8px;background:rgba(200,50,10,.07);border:1px solid rgba(200,50,10,.2);border-radius:9px;padding:11px 14px;font-size:12px;color:#c8320a;font-weight:600;margin-bottom:12px}

        /* INFO SIDE */
        .cp-info-title{font-family:var(--body);font-size:22px;font-weight:700;color:var(--text);margin-bottom:5px}
        .cp-info-sub{font-size:13px;color:var(--muted);line-height:1.75;margin-bottom:28px}

        .cp-info-item{display:flex;align-items:flex-start;gap:14px;margin-bottom:18px;padding:16px 18px;background:var(--card);border:1.5px solid var(--border);border-radius:14px;transition:border-color .22s,box-shadow .22s}
        .cp-info-item:hover{border-color:rgba(200,85,26,.3);box-shadow:0 4px 16px rgba(200,85,26,.08)}
        .cp-info-icon{width:38px;height:38px;border-radius:10px;background:rgba(200,85,26,.1);color:var(--o);display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .cp-info-lbl{font-size:12px;font-weight:700;color:var(--text);margin-bottom:2px}
        .cp-info-val{font-size:13px;color:var(--muted)}
        .cp-info-val a{color:var(--o);text-decoration:none}
        .cp-info-val a:hover{text-decoration:underline}

        /* SOCIAL */
        .cp-social-title{font-family:var(--body);font-size:16px;font-weight:700;color:var(--text);margin-bottom:14px;margin-top:32px}
        .cp-social-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .cp-soc-card{display:flex;align-items:center;gap:10px;background:var(--card);border:1.5px solid var(--border);border-radius:14px;padding:13px 14px;text-decoration:none;transition:transform .22s,box-shadow .22s,border-color .22s}
        .cp-soc-card:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(26,16,8,.08);border-color:var(--border2)}
        .cp-soc-icon{width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0}
        .cp-soc-name{font-size:12px;font-weight:700;color:var(--text)}
        .cp-soc-handle{font-size:10px;color:var(--muted)}

        /* ADSENSE SLOT (mid-page — placed between form and info for good viewability) */
        .cp-ad-slot{background:var(--bg2);border:1px dashed var(--border);border-radius:12px;min-height:90px;display:flex;align-items:center;justify-content:center;margin:24px 0;font-size:11px;color:var(--muted);font-weight:600;letter-spacing:.08em;text-transform:uppercase}

        @media(max-width:860px){.cp-main{grid-template-columns:1fr;gap:36px}.cp-form-card{padding:24px 18px}}
        @media(max-width:480px){.cp-hero{padding:56px 16px 48px}.cp-main{padding:32px 16px 80px}.cp-social-grid{grid-template-columns:1fr 1fr}}
      `}</style>

      {/* HERO */}
      <section aria-labelledby="contact-h1">
        <div className="cp-hero">
          <div className="cp-hero-inner">
            <div className="cp-eyebrow">Get in Touch</div>
            <h1 id="contact-h1" className="cp-hero-h1">Contact <em>Us</em></h1>
            <p className="cp-hero-sub">
              Questions about teachings, events, books or media?<br/>We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      <div className="cp-main">

        {/* FORM */}
        <div>
          <div className="cp-form-card">
            <h2 className="cp-form-title">Send a Message</h2>
            <p className="cp-form-sub">We typically respond within 1–3 business days.</p>

            <form onSubmit={submit} noValidate>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
                <div className="cp-field">
                  <label className="cp-lbl" htmlFor="cp-name">Name *</label>
                  <input id="cp-name" className="cp-input" type="text" placeholder="Your full name"
                    value={form.name} onChange={e=>set("name",e.target.value)} autoComplete="name" required/>
                </div>
                <div className="cp-field">
                  <label className="cp-lbl" htmlFor="cp-email">Email *</label>
                  <input id="cp-email" className="cp-input" type="email" placeholder="your@email.com"
                    value={form.email} onChange={e=>set("email",e.target.value)} autoComplete="email" required/>
                </div>
              </div>
              <div className="cp-field">
                <label className="cp-lbl" htmlFor="cp-topic">Topic</label>
                <select id="cp-topic" className="cp-select" value={form.topic} onChange={e=>set("topic",e.target.value)}>
                  {TOPICS.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="cp-field">
                <label className="cp-lbl" htmlFor="cp-msg">Message *</label>
                <textarea id="cp-msg" className="cp-textarea" rows={5} placeholder="Tell us how we can help…"
                  value={form.message} onChange={e=>set("message",e.target.value)} required maxLength={1000}/>
              </div>

              {status==="error" && (
                <div className="cp-error-msg" role="alert"><FaTimes size={10}/> {errMsg||"Something went wrong. Please try again."}</div>
              )}

              <button type="submit" className="cp-submit"
                disabled={loading||!form.name.trim()||!form.email.trim()||!form.message.trim()}>
                {loading ? "Sending…" : <><FaPaperPlane size={12}/> Send Message</>}
              </button>

              {status==="success" && (
                <div className="cp-success" role="status" aria-live="polite">
                  <FaCheck size={14}/> Message sent! We'll be in touch soon.
                </div>
              )}
            </form>
          </div>

          {/* AdSense slot — good placement (after form, before footer area) */}
          <div className="cp-ad-slot" aria-label="Advertisement">
            {/* Replace this div with your actual AdSense ins tag:
            <ins className="adsbygoogle"
              style={{display:"block"}}
              data-ad-client="ca-pub-2716405637818905"
              data-ad-slot="YOUR_SLOT_ID"
              data-ad-format="auto"
              data-full-width-responsive="true"/>
            */}
            Advertisement
          </div>
        </div>

        {/* INFO SIDE */}
        <div>
          <h2 className="cp-info-title">Other ways to reach us</h2>
          <p className="cp-info-sub">
            Whether you want to attend an event, enquire about books or collaborate — we're here.
          </p>

          <div className="cp-info-item">
            <div className="cp-info-icon" aria-hidden="true"><FaEnvelope size={15}/></div>
            <div>
              <div className="cp-info-lbl">Email</div>
              <div className="cp-info-val">
                <a href="mailto:contact@gurujishrawan.com">contact@gurujishrawan.com</a>
              </div>
            </div>
          </div>

          <div className="cp-info-item">
            <div className="cp-info-icon" aria-hidden="true"><FaWhatsapp size={15}/></div>
            <div>
              <div className="cp-info-lbl">WhatsApp</div>
              <div className="cp-info-val">
                <a href="https://wa.me/919999793389" target="_blank" rel="noopener noreferrer">
                  Message on WhatsApp
                </a>
                <div style={{fontSize:10,marginTop:2}}>Mon–Sat, 10am–6pm IST</div>
              </div>
            </div>
          </div>

       

          <h3 className="cp-social-title">Follow on social media</h3>
          <div className="cp-social-grid">
            {SOCIAL.map(s=>(
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                className="cp-soc-card" aria-label={`${s.name} — ${s.handle}`}>
                <div className="cp-soc-icon" style={{background:s.color}} aria-hidden="true">{s.icon}</div>
                <div>
                  <div className="cp-soc-name">{s.name}</div>
                  <div className="cp-soc-handle">{s.handle}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}