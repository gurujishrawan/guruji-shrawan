"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { FaHeart, FaCheck, FaArrowRight, FaLock, FaShieldAlt, FaUsers, FaBook, FaYoutube, FaTimes } from "react-icons/fa"
import type { Metadata } from "next"

/* ── Razorpay types ── */
declare global {
  interface Window {
    Razorpay: any
  }
}

/* ══════════════════════════════════
   METADATA (for app router)
   Export this from the SERVER component wrapper.
   This file is the client component — create a
   thin server wrapper at app/donate/page.tsx that
   exports metadata and renders <DonatePage/>.
══════════════════════════════════ */

const PRESET_AMOUNTS = [101, 251, 501, 1001, 2100, 5001]

const IMPACT = [
  { icon: <FaBook size={18}/>,   label: "Books & Content",  desc: "Funds printing and free distribution of books to those who cannot afford them." },
  { icon: <FaYoutube size={18}/>, label: "Video Teachings",  desc: "Keeps satsangs, Q&As and video teachings freely available on YouTube." },
  { icon: <FaUsers size={18}/>,  label: "Outreach Events",  desc: "Enables free public programs for students, youth and rural communities." },
]

const TESTIMONIALS = [
  { name: "Priya S.", city: "Delhi",    text: "Guruji's teachings changed my life. I'm glad I could give back however little." },
  { name: "Rajan M.", city: "Mumbai",   text: "Every rupee goes toward real wisdom reaching real people. I donate monthly." },
  { name: "Ananya T.", city: "Bengaluru", text: "The free YouTube videos helped me through the hardest year of my life." },
]

function useInView(t = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect() } }, { threshold: t })
    obs.observe(el)
    return () => obs.disconnect()
  }, [t])
  return { ref, v }
}
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, v } = useInView(0.08)
  return (
    <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "none" : "translateY(28px)", transition: `opacity .7s ${delay}ms ease, transform .7s ${delay}ms ease` }}>
      {children}
    </div>
  )
}

export default function DonatePage() {
  const [amount,     setAmount]     = useState<number | "">(501)
  const [custom,     setCustom]     = useState("")
  const [name,       setName]       = useState("")
  const [email,      setEmail]      = useState("")
  const [phone,      setPhone]      = useState("")
  const [message,    setMessage]    = useState("")
  const [loading,    setLoading]    = useState(false)
  const [success,    setSuccess]    = useState(false)
  const [error,      setError]      = useState("")
  const [loaded,     setLoaded]     = useState(false)
  const [rpLoaded,   setRpLoaded]   = useState(false)

  useEffect(() => {
    setLoaded(true)
    // Load Razorpay script
    const s = document.createElement("script")
    s.src = "https://checkout.razorpay.com/v1/checkout.js"
    s.onload = () => setRpLoaded(true)
    document.body.appendChild(s)
    return () => { document.body.removeChild(s) }
  }, [])

  const finalAmount = custom ? parseInt(custom) : (typeof amount === "number" ? amount : 0)

  async function handleDonate() {
    if (!finalAmount || finalAmount < 1) return setError("Please enter a valid amount (minimum ₹1).")
    if (!name.trim())  return setError("Please enter your name.")
    if (!email.trim()) return setError("Please enter your email.")
    if (!rpLoaded)     return setError("Payment system is still loading. Please wait a moment.")

    setLoading(true); setError("")

    try {
      /* 1. Create order via your API route */
      const res = await fetch("/api/donate/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalAmount * 100, currency: "INR", name, email, phone, message }),
      })
      const order = await res.json()
      if (!order.id) throw new Error(order.error || "Could not create payment order.")

      /* 2. Open Razorpay checkout */
      const options = {
        key:          process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount:       order.amount,
        currency:     "INR",
        name:         "Guruji Shrawan Foundation",
        description:  "Donation — Spreading Wisdom",
        image:        "/images/logo.png",
        order_id:     order.id,
        prefill:      { name, email, contact: phone },
        theme:        { color: "#c8551a" },
        handler: async (response: any) => {
          /* 3. Verify on server */
          const vRes = await fetch("/api/donate/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          })
          const vData = await vRes.json()
          if (vData.success) {
            setSuccess(true); setLoading(false)
          } else {
            setError("Payment verification failed. Please contact us."); setLoading(false)
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      }
      new window.Razorpay(options).open()
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <main className="dp-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Poppins:wght@300;400;500;600;700;800&display=swap');

        :root {
          --o:#c8551a; --g:#b8841a; --bg:#faf7f2; --bg2:#f4efe6;
          --card:#ffffff; --border:#e8ddd0; --border2:#d8c9b8;
          --text:#1a1008; --muted:#8a7a6a;
          --sans:'Poppins',system-ui,sans-serif; --body:'Lora',Georgia,serif;
        }

        @keyframes dp-up   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes dp-in   { from{opacity:0} to{opacity:1} }
        @keyframes dp-beat { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
        @keyframes dp-check{ 0%{transform:scale(0) rotate(-45deg)} 70%{transform:scale(1.15)} 100%{transform:scale(1) rotate(0)} }
        @keyframes dp-shimmer{ from{background-position:-200% 0} to{background-position:200% 0} }

        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0 }

        .dp-root {
          background: var(--bg); color: var(--text);
          font-family: var(--sans); min-height: 100vh; overflow-x: hidden;
        }

        /* ── HERO ── */
        .dp-hero {
          background: linear-gradient(160deg,#1a1008 0%,#2a1608 55%,#1a1008 100%);
          padding: 80px 24px 72px;
          text-align: center;
          position: relative; overflow: hidden;
        }
        .dp-hero::before {
          content:''; position:absolute; inset:0;
          background:radial-gradient(ellipse 60% 80% at 50% 0%,rgba(200,85,26,.25),transparent 70%);
          pointer-events:none;
        }
        .dp-hero-eyebrow {
          display:inline-flex; align-items:center; gap:8px;
          font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.28em;
          color:var(--g); margin-bottom:18px;
          animation:${loaded?"dp-in .7s ease both":"none"};
        }
        .dp-hero-eyebrow::before,.dp-hero-eyebrow::after {
          content:''; display:block; width:22px; height:1.5px; background:var(--g); opacity:.4; border-radius:1px;
        }
        .dp-hero-h1 {
          font-family:var(--body); font-size:clamp(34px,6vw,62px); font-weight:700;
          color:#fff; line-height:1.1; letter-spacing:-.025em;
          animation:${loaded?"dp-up .9s .15s ease both":"none"};
        }
        .dp-hero-h1 em { font-style:italic; color:var(--o); }
        .dp-hero-sub {
          font-family:var(--body); font-size:17px; font-style:italic;
          color:rgba(255,255,255,.65); line-height:1.85; max-width:560px;
          margin:16px auto 0;
          animation:${loaded?"dp-up .9s .3s ease both":"none"};
        }
        .dp-heart-ico {
          font-size:28px; color:var(--o); margin-bottom:14px;
          display:block;
          animation:dp-beat 2s ease-in-out infinite;
          animation-delay:${loaded?"0s":"99s"};
        }

        /* ── MAIN GRID ── */
        .dp-main {
          max-width:1100px; margin:0 auto; padding:56px 24px 100px;
          display:grid; grid-template-columns:1fr 400px; gap:48px; align-items:start;
        }

        /* ── IMPACT ── */
        .dp-impact-title {
          font-family:var(--body); font-size:clamp(22px,2.5vw,32px); font-weight:700;
          color:var(--text); letter-spacing:-.015em; margin-bottom:6px;
        }
        .dp-impact-sub { font-size:13px; color:var(--muted); line-height:1.75; margin-bottom:32px; max-width:480px; }
        .dp-impact-list { display:flex; flex-direction:column; gap:16px; margin-bottom:48px; }
        .dp-impact-item {
          display:flex; gap:16px; align-items:flex-start;
          background:var(--card); border:1.5px solid var(--border); border-radius:16px;
          padding:20px 22px;
          transition:border-color .25s, transform .25s, box-shadow .25s;
        }
        .dp-impact-item:hover { border-color:rgba(200,85,26,.3); transform:translateY(-2px); box-shadow:0 8px 28px rgba(200,85,26,.09); }
        .dp-impact-icon {
          width:44px; height:44px; border-radius:12px; flex-shrink:0;
          background:rgba(200,85,26,.1); color:var(--o);
          display:flex; align-items:center; justify-content:center;
        }
        .dp-impact-lbl { font-size:14px; font-weight:700; color:var(--text); margin-bottom:4px; }
        .dp-impact-desc { font-size:13px; color:var(--muted); line-height:1.7; }

        /* testimonials */
        .dp-testimonials { display:flex; flex-direction:column; gap:14px; }
        .dp-tcard {
          background:var(--bg2); border:1.5px solid var(--border); border-radius:14px;
          padding:18px 20px;
        }
        .dp-ttext { font-family:var(--body); font-size:14px; font-style:italic; color:#5a4030; line-height:1.8; margin-bottom:10px; }
        .dp-tauthor { font-size:11px; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:.14em; }

        /* ── DONATION FORM ── */
        .dp-form-card {
          background:var(--card); border:1.5px solid var(--border); border-radius:24px;
          padding:32px 28px;
          box-shadow:0 8px 32px rgba(26,16,8,.08);
          position:sticky; top:24px;
        }
        .dp-form-title {
          font-family:var(--body); font-size:22px; font-weight:700;
          color:var(--text); margin-bottom:6px; letter-spacing:-.01em;
        }
        .dp-form-sub { font-size:12px; color:var(--muted); margin-bottom:24px; line-height:1.65; }

        /* amount presets */
        .dp-amounts { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:14px; }
        .dp-amount-btn {
          padding:11px 6px; border-radius:10px;
          border:1.5px solid var(--border); background:var(--bg);
          font-family:var(--sans); font-size:13px; font-weight:700; color:var(--muted);
          cursor:pointer; text-align:center;
          transition:border-color .2s, background .2s, color .2s;
        }
        .dp-amount-btn:hover { border-color:rgba(200,85,26,.4); color:var(--o); background:rgba(200,85,26,.05); }
        .dp-amount-btn.dp-amt-active { border-color:var(--o); background:rgba(200,85,26,.1); color:var(--o); font-weight:800; }

        .dp-custom-wrap { position:relative; margin-bottom:20px; }
        .dp-custom-prefix {
          position:absolute; left:13px; top:50%; transform:translateY(-50%);
          font-size:15px; font-weight:700; color:var(--muted); pointer-events:none;
        }
        .dp-custom-input {
          width:100%; background:var(--bg); border:1.5px solid var(--border);
          border-radius:10px; padding:11px 14px 11px 28px;
          font-family:var(--sans); font-size:14px; font-weight:700; color:var(--text);
          outline:none; transition:border-color .2s, box-shadow .2s;
        }
        .dp-custom-input:focus { border-color:rgba(200,85,26,.6); box-shadow:0 0 0 3px rgba(200,85,26,.1); }
        .dp-custom-input::placeholder { color:var(--border2); font-weight:400; }

        /* form fields */
        .dp-field { margin-bottom:12px; }
        .dp-field-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.16em; color:var(--muted); margin-bottom:5px; display:block; }
        .dp-field-input {
          width:100%; background:var(--bg); border:1.5px solid var(--border);
          border-radius:10px; padding:11px 13px;
          font-family:var(--sans); font-size:13px; color:var(--text);
          outline:none; transition:border-color .2s;
        }
        .dp-field-input:focus { border-color:rgba(200,85,26,.5); }
        .dp-field-input::placeholder { color:#c8bdaf; }

        /* divider */
        .dp-divider { height:1px; background:var(--border); margin:16px 0; }

        /* error */
        .dp-error {
          display:flex; align-items:center; gap:8px;
          font-size:12px; color:#c8320a; font-weight:600;
          background:rgba(200,50,10,.07); border:1px solid rgba(200,50,10,.2);
          border-radius:9px; padding:10px 13px; margin-bottom:12px;
        }

        /* CTA */
        .dp-cta {
          width:100%; display:flex; align-items:center; justify-content:center; gap:10px;
          background:linear-gradient(135deg,var(--o),#8a2e06);
          color:#fff; border:none; border-radius:12px; padding:15px;
          font-family:var(--sans); font-size:15px; font-weight:700;
          cursor:pointer; letter-spacing:.02em;
          box-shadow:0 6px 22px rgba(200,85,26,.32);
          transition:transform .2s, box-shadow .2s;
          margin-bottom:14px;
        }
        .dp-cta:hover { transform:translateY(-2px); box-shadow:0 10px 30px rgba(200,85,26,.44); }
        .dp-cta:disabled { opacity:.55; cursor:not-allowed; transform:none; }

        .dp-secure {
          display:flex; align-items:center; justify-content:center; gap:6px;
          font-size:10px; color:var(--muted); font-weight:600; text-transform:uppercase; letter-spacing:.12em;
        }

        /* success overlay */
        .dp-success {
          text-align:center; padding:16px 0;
        }
        .dp-success-icon {
          width:72px; height:72px; border-radius:50%;
          background:linear-gradient(135deg,var(--o),#8a2e06);
          color:#fff; font-size:30px;
          display:flex; align-items:center; justify-content:center;
          margin:0 auto 18px;
          animation:dp-check .4s ease;
          box-shadow:0 8px 28px rgba(200,85,26,.4);
        }
        .dp-success-title { font-family:var(--body); font-size:24px; font-weight:700; color:var(--text); margin-bottom:8px; }
        .dp-success-sub { font-family:var(--body); font-size:15px; font-style:italic; color:var(--muted); line-height:1.8; max-width:280px; margin:0 auto 24px; }
        .dp-success-share {
          display:inline-flex; align-items:center; gap:7px;
          font-size:12px; font-weight:700; color:var(--o);
          text-decoration:none; border:1.5px solid rgba(200,85,26,.35);
          border-radius:99px; padding:9px 20px;
          transition:background .2s;
        }
        .dp-success-share:hover { background:rgba(200,85,26,.07); }

        /* ── RESPONSIVE ── */
        @media(max-width:900px){
          .dp-main { grid-template-columns:1fr; }
          .dp-form-card { position:static; }
          /* form first on mobile */
          .dp-form-card { order:-1; }
        }
        @media(max-width:560px){
          .dp-hero { padding:64px 16px 56px; }
          .dp-main { padding:36px 16px 80px; }
          .dp-amounts { grid-template-columns:repeat(3,1fr); gap:6px; }
          .dp-form-card { padding:24px 18px; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section
        aria-labelledby="donate-hero-title"
        style={{ background:"linear-gradient(160deg,#1a1008,#2a1608 55%,#1a1008)", padding:"80px 24px 72px", textAlign:"center", position:"relative", overflow:"hidden" }}
      >
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 80% at 50% 0%,rgba(200,85,26,.25),transparent 70%)", pointerEvents:"none" }} aria-hidden="true"/>
        <div style={{ maxWidth:600, margin:"0 auto", position:"relative", zIndex:1 }}>
          <span
            aria-hidden="true"
            style={{ fontSize:32, color:"#c8551a", display:"block", marginBottom:14, animation:loaded?"dp-beat 2s ease-in-out infinite":"none" }}
          >♥</span>
          <div className="dp-hero-eyebrow">Support the Mission</div>
          <h1 id="donate-hero-title" className="dp-hero-h1">
            Help Spread<br/><em>Wisdom</em> to Every Home
          </h1>
          <p className="dp-hero-sub">
            Your contribution keeps teachings free — books, videos, public programs and satsangs — reaching those who need clarity most.
          </p>
        </div>
      </section>

      {/* ── MAIN ── */}
      <div className="dp-main">

        {/* Left: impact + testimonials */}
        <div>
          <Reveal>
            <h2 className="dp-impact-title">Where your donation goes</h2>
            <p className="dp-impact-sub">Every rupee is used directly for teaching, outreach and keeping wisdom freely accessible.</p>
          </Reveal>
          <div className="dp-impact-list">
            {IMPACT.map((item,i)=>(
              <Reveal key={item.label} delay={i*80}>
                <div className="dp-impact-item">
                  <div className="dp-impact-icon" aria-hidden="true">{item.icon}</div>
                  <div>
                    <div className="dp-impact-lbl">{item.label}</div>
                    <div className="dp-impact-desc">{item.desc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Testimonials */}
          <Reveal delay={100}>
            <h3 style={{ fontFamily:"var(--body)", fontSize:18, fontWeight:700, color:"var(--text)", marginBottom:16, fontStyle:"italic" }}>
              What donors say
            </h3>
          </Reveal>
          <div className="dp-testimonials">
            {TESTIMONIALS.map((t,i)=>(
              <Reveal key={t.name} delay={i*70}>
                <div className="dp-tcard" role="blockquote">
                  <p className="dp-ttext">"{t.text}"</p>
                  <p className="dp-tauthor">— {t.name}, {t.city}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Right: donation form */}
        <Reveal>
          <div className="dp-form-card" role="form" aria-labelledby="donate-form-title">
            {success ? (
              <div className="dp-success" role="status" aria-live="polite">
                <div className="dp-success-icon" aria-hidden="true"><FaCheck/></div>
                <h2 className="dp-success-title">Thank you! 🙏</h2>
                <p className="dp-success-sub">
                  Your donation of <strong>₹{finalAmount}</strong> has been received. A receipt has been sent to {email}.
                </p>
                <a href={`https://wa.me/?text=${encodeURIComponent("I just donated to Guruji Shrawan Foundation to help spread wisdom. gurujishrawan.com/donate")}`}
                  target="_blank" rel="noopener noreferrer" className="dp-success-share">
                  <FaHeart size={11}/> Share this with friends
                </a>
              </div>
            ) : (
              <>
                <h2 id="donate-form-title" className="dp-form-title">Make a Donation</h2>
                <p className="dp-form-sub">All amounts welcome. Your contribution matters.</p>

                {/* Preset amounts */}
                <div className="dp-amounts" role="group" aria-label="Select donation amount">
                  {PRESET_AMOUNTS.map(a=>(
                    <button
                      key={a}
                      type="button"
                      className={`dp-amount-btn ${amount===a && !custom ? "dp-amt-active" : ""}`}
                      onClick={()=>{ setAmount(a); setCustom("") }}
                      aria-pressed={amount===a && !custom}
                    >
                      ₹{a.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>

                {/* Custom amount */}
                <div className="dp-custom-wrap">
                  <span className="dp-custom-prefix" aria-hidden="true">₹</span>
                  <input
                    type="number"
                    className="dp-custom-input"
                    placeholder="Enter custom amount"
                    value={custom}
                    onChange={e=>{ setCustom(e.target.value); setAmount("") }}
                    min="1"
                    aria-label="Enter a custom donation amount in rupees"
                  />
                </div>

                <div className="dp-divider"/>

                {/* Donor info */}
                <div className="dp-field">
                  <label className="dp-field-label" htmlFor="dp-name">Full Name *</label>
                  <input id="dp-name" className="dp-field-input" type="text" placeholder="Your name"
                    value={name} onChange={e=>setName(e.target.value)} autoComplete="name" required/>
                </div>
                <div className="dp-field">
                  <label className="dp-field-label" htmlFor="dp-email">Email *</label>
                  <input id="dp-email" className="dp-field-input" type="email" placeholder="For receipt"
                    value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" required/>
                </div>
                <div className="dp-field">
                  <label className="dp-field-label" htmlFor="dp-phone">Phone (optional)</label>
                  <input id="dp-phone" className="dp-field-input" type="tel" placeholder="Your mobile number"
                    value={phone} onChange={e=>setPhone(e.target.value)} autoComplete="tel"/>
                </div>
                <div className="dp-field">
                  <label className="dp-field-label" htmlFor="dp-msg">Message (optional)</label>
                  <input id="dp-msg" className="dp-field-input" type="text" placeholder="A short note"
                    value={message} onChange={e=>setMessage(e.target.value)} maxLength={200}/>
                </div>

                {error && (
                  <div className="dp-error" role="alert">
                    <FaTimes size={10}/> {error}
                  </div>
                )}

                <button
                  type="button"
                  className="dp-cta"
                  onClick={handleDonate}
                  disabled={loading || !finalAmount || !name.trim() || !email.trim()}
                  aria-label={`Donate ₹${finalAmount || "amount"} securely`}
                >
                  {loading ? (
                    <><div style={{width:16,height:16,borderRadius:"50%",border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",animation:"dp-beat .8s linear infinite"}}/> Processing…</>
                  ) : (
                    <><FaHeart size={13}/> Donate ₹{finalAmount ? finalAmount.toLocaleString("en-IN") : "—"} <FaArrowRight size={11}/></>
                  )}
                </button>

                <div className="dp-secure" aria-label="Secure payment by Razorpay">
                  <FaLock size={10}/> Secured by Razorpay
                  <FaShieldAlt size={10}/> 256-bit SSL
                </div>

                <p style={{ fontSize:10, color:"var(--muted)", textAlign:"center", marginTop:12, lineHeight:1.6 }}>
                  By donating you agree to our <Link href="/terms" style={{color:"var(--o)"}}>Terms</Link>.
                  Receipts emailed instantly. UPI, cards, net banking accepted.
                </p>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </main>
  )
}