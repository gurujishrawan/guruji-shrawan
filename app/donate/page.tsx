"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  FaHeart, FaCheck, FaArrowRight, FaLock, FaShieldAlt,
  FaUsers, FaBook, FaYoutube, FaTimes, FaMobileAlt,
  FaCreditCard, FaUniversity, FaWallet,
} from "react-icons/fa"

/* Razorpay global */
declare global { interface Window { Razorpay: any } }

/* ══════════════════════════════════
   metadata lives in the server wrapper:
   app/donate/page.tsx  →  export { metadata }; export default DonatePage from "@/app/donate/DonatePage"
══════════════════════════════════ */

const PRESET_AMOUNTS = [101, 251, 501, 1001, 2100, 5001]

const IMPACT = [
  { icon: <FaBook size={18}/>,    label: "Books & Content",  desc: "Funds printing and free distribution of books to those who cannot afford them." },
  { icon: <FaYoutube size={18}/>, label: "Video Teachings",  desc: "Keeps satsangs, Q&As and video teachings freely available on YouTube." },
  { icon: <FaUsers size={18}/>,   label: "Outreach Events",  desc: "Enables free public programs for students, youth and rural communities." },
]

const TESTIMONIALS = [
  { name:"Priya S.",  city:"Delhi",     text:"Guruji's teachings changed my life. I'm glad I could give back however little." },
  { name:"Rajan M.",  city:"Mumbai",    text:"Every rupee goes toward real wisdom reaching real people. I donate monthly." },
  { name:"Ananya T.", city:"Bengaluru", text:"The free YouTube videos helped me through the hardest year of my life." },
]

/* Payment methods supported by Razorpay automatically */
const PAYMENT_METHODS = [
  { icon: <FaMobileAlt size={14}/>,   label:"UPI",             sub:"GPay, PhonePe, Paytm, BHIM" },
  { icon: <FaWallet size={14}/>,      label:"Wallets",         sub:"Paytm, Mobikwik, Freecharge" },
  { icon: <FaCreditCard size={14}/>,  label:"Cards",           sub:"Visa, Mastercard, Rupay, Amex" },
  { icon: <FaUniversity size={14}/>,  label:"Net Banking",     sub:"All major Indian banks" },
]

function useInView(t=0.08) {
  const ref = useRef<HTMLDivElement>(null)
  const [v,setV] = useState(false)
  useEffect(()=>{
    const el=ref.current; if(!el) return
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setV(true);obs.disconnect()}},{threshold:t})
    obs.observe(el); return ()=>obs.disconnect()
  },[t])
  return {ref,v}
}
function Reveal({children,delay=0}:{children:React.ReactNode;delay?:number}){
  const {ref,v}=useInView()
  return(
    <div ref={ref} style={{opacity:v?1:0,transform:v?"none":"translateY(26px)",transition:`opacity .7s ${delay}ms ease,transform .7s ${delay}ms ease`}}>
      {children}
    </div>
  )
}

export default function DonatePage() {
  const [amount,  setAmount]  = useState<number|"">(501)
  const [custom,  setCustom]  = useState("")
  const [name,    setName]    = useState("")
  const [email,   setEmail]   = useState("")
  const [phone,   setPhone]   = useState("")
  const [msg,     setMsg]     = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState("")
  const [loaded,  setLoaded]  = useState(false)
  const [rpReady, setRpReady] = useState(false)

  useEffect(()=>{
    setLoaded(true)
    if(typeof window!=="undefined" && !window.Razorpay){
      const s=document.createElement("script")
      s.src="https://checkout.razorpay.com/v1/checkout.js"
      s.async=true
      s.onload=()=>setRpReady(true)
      document.body.appendChild(s)
    } else { setRpReady(true) }
  },[])

  const finalAmt = custom ? parseInt(custom)||0 : (typeof amount==="number"?amount:0)

  async function handleDonate(){
    if(!finalAmt||finalAmt<1) return setError("Please enter a valid amount (minimum ₹1).")
    if(!name.trim())           return setError("Please enter your name.")
    if(!email.trim())          return setError("Please enter your email address.")
    if(!rpReady)               return setError("Payment gateway is still loading — please wait a moment.")
    setLoading(true); setError("")
    try{
      const res = await fetch("/api/donate/create-order",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({amount:finalAmt*100,currency:"INR",name,email,phone,message:msg}),
      })
      const order = await res.json()
      if(!order.id) throw new Error(order.error||"Could not create payment order.")

      const opts = {
        key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID||"",
        amount:      order.amount,
        currency:    "INR",
        name:        "Guruji Shrawan Foundation",
        description: "Donation — Spreading Wisdom",
        image:       "/images/logo.png",
        order_id:    order.id,
        prefill:     {name, email, contact:phone},
        /* Razorpay automatically shows ALL UPI apps (PhonePe, Paytm,
           GPay, BHIM), wallets, net banking, and cards — no extra config needed */
        config: {
          display: {
            blocks: {
              utib: { name:"Pay via UPI Apps", instruments:[{method:"upi"}] },
              other: { name:"Other Payment Methods", instruments:[
                {method:"card"},{method:"netbanking"},{method:"wallet"},
                {method:"emi"},{method:"paylater"},
              ]},
            },
            sequence: ["block.utib","block.other"],
            preferences: { show_default_blocks: false },
          },
        },
        theme:    { color:"#c8551a" },
        handler: async(response:any)=>{
          const v = await fetch("/api/donate/verify",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(response),
          })
          const vd = await v.json()
          if(vd.success){ setSuccess(true); setLoading(false) }
          else { setError("Payment verification failed. Please email us."); setLoading(false) }
        },
        modal:{ ondismiss:()=>setLoading(false) },
      }
      new window.Razorpay(opts).open()
    } catch(e:any){ setError(e.message||"Something went wrong."); setLoading(false) }
  }

  return(
    <main className="dp-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Poppins:wght@300;400;500;600;700;800&display=swap');
        :root{
          --o:#c8551a;--g:#b8841a;--bg:#faf7f2;--bg2:#f4efe6;--bg3:#ede5d8;
          --card:#ffffff;--border:#e8ddd0;--border2:#d8c9b8;
          --text:#1a1008;--muted:#8a7a6a;
          --sans:'Poppins',system-ui,sans-serif;--body:'Lora',Georgia,serif;
          --shadow:0 2px 14px rgba(26,16,8,.07);--shadow2:0 10px 36px rgba(26,16,8,.12);
        }
        @keyframes dp-up    {from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes dp-in    {from{opacity:0}to{opacity:1}}
        @keyframes dp-beat  {0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}
        @keyframes dp-check {0%{transform:scale(0)rotate(-45deg)}70%{transform:scale(1.15)}100%{transform:scale(1)rotate(0)}}
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .dp-root{background:var(--bg);color:var(--text);font-family:var(--sans);min-height:100vh;overflow-x:hidden}

        /* HERO */
        .dp-hero{
          background:linear-gradient(160deg,#1a1008 0%,#2a1608 55%,#1a1008 100%);
          padding:80px 24px 72px;text-align:center;position:relative;overflow:hidden;
        }
        .dp-hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 80% at 50% 0%,rgba(200,85,26,.25),transparent 70%);pointer-events:none}
        .dp-hero-eyebrow{
          display:inline-flex;align-items:center;gap:8px;
          font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.28em;color:var(--g);
          margin-bottom:18px;animation:${loaded?"dp-in .7s ease both":"none"};
        }
        .dp-hero-eyebrow::before,.dp-hero-eyebrow::after{content:'';display:block;width:22px;height:1.5px;background:var(--g);opacity:.4;border-radius:1px}
        .dp-hero-h1{
          font-family:var(--body);font-size:clamp(34px,6vw,62px);font-weight:700;
          color:#fff;line-height:1.1;letter-spacing:-.025em;
          animation:${loaded?"dp-up .9s .15s ease both":"none"};
        }
        .dp-hero-h1 em{font-style:italic;color:var(--o)}
        .dp-hero-sub{
          font-family:var(--body);font-size:17px;font-style:italic;
          color:rgba(255,255,255,.65);line-height:1.85;max-width:560px;
          margin:16px auto 0;animation:${loaded?"dp-up .9s .3s ease both":"none"};
        }

        /* MAIN GRID */
        .dp-main{max-width:1100px;margin:0 auto;padding:56px 24px 100px;display:grid;grid-template-columns:1fr 420px;gap:48px;align-items:start}

        /* IMPACT */
        .dp-section-title{font-family:var(--body);font-size:clamp(22px,2.5vw,32px);font-weight:700;color:var(--text);letter-spacing:-.015em;margin-bottom:6px}
        .dp-section-sub{font-size:13px;color:var(--muted);line-height:1.75;margin-bottom:28px;max-width:480px}
        .dp-impact-list{display:flex;flex-direction:column;gap:14px;margin-bottom:44px}
        .dp-impact-item{
          display:flex;gap:16px;align-items:flex-start;
          background:var(--card);border:1.5px solid var(--border);border-radius:16px;padding:20px 22px;
          transition:border-color .25s,transform .25s,box-shadow .25s;
        }
        .dp-impact-item:hover{border-color:rgba(200,85,26,.3);transform:translateY(-2px);box-shadow:var(--shadow2)}
        .dp-impact-icon{width:44px;height:44px;border-radius:12px;flex-shrink:0;background:rgba(200,85,26,.1);color:var(--o);display:flex;align-items:center;justify-content:center}
        .dp-impact-lbl{font-size:14px;font-weight:700;color:var(--text);margin-bottom:4px}
        .dp-impact-desc{font-size:13px;color:var(--muted);line-height:1.7}

        /* PAYMENT METHODS */
        .dp-pm-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:40px}
        .dp-pm-card{
          background:var(--card);border:1.5px solid var(--border);border-radius:14px;padding:14px 16px;
          display:flex;align-items:center;gap:10px;
          transition:border-color .22s,background .22s;
        }
        .dp-pm-card:hover{border-color:rgba(200,85,26,.3);background:rgba(200,85,26,.03)}
        .dp-pm-icon{width:36px;height:36px;border-radius:9px;background:rgba(200,85,26,.1);color:var(--o);display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .dp-pm-lbl{font-size:12px;font-weight:700;color:var(--text)}
        .dp-pm-sub{font-size:10px;color:var(--muted);margin-top:1px}

        /* TESTIMONIALS */
        .dp-testimonials{display:flex;flex-direction:column;gap:12px}
        .dp-tcard{background:var(--bg2);border:1.5px solid var(--border);border-radius:14px;padding:18px 20px}
        .dp-ttext{font-family:var(--body);font-size:14px;font-style:italic;color:#5a4030;line-height:1.8;margin-bottom:9px}
        .dp-tauthor{font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.14em}

        /* FORM CARD */
        .dp-form-card{
          background:var(--card);border:1.5px solid var(--border);border-radius:24px;
          padding:32px 28px;box-shadow:var(--shadow2);position:sticky;top:24px;
        }
        .dp-form-title{font-family:var(--body);font-size:22px;font-weight:700;color:var(--text);margin-bottom:5px;letter-spacing:-.01em}
        .dp-form-sub{font-size:12px;color:var(--muted);margin-bottom:22px;line-height:1.65}

        /* AMOUNT PRESETS */
        .dp-amounts{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-bottom:12px}
        .dp-amt-btn{
          padding:11px 4px;border-radius:10px;border:1.5px solid var(--border);background:var(--bg);
          font-family:var(--sans);font-size:12px;font-weight:700;color:var(--muted);
          cursor:pointer;text-align:center;transition:border-color .2s,background .2s,color .2s;
        }
        .dp-amt-btn:hover{border-color:rgba(200,85,26,.4);color:var(--o);background:rgba(200,85,26,.04)}
        .dp-amt-active{border-color:var(--o)!important;background:rgba(200,85,26,.1)!important;color:var(--o)!important}

        /* CUSTOM INPUT */
        .dp-custom-wrap{position:relative;margin-bottom:18px}
        .dp-rupee{position:absolute;left:13px;top:50%;transform:translateY(-50%);font-size:15px;font-weight:700;color:var(--muted);pointer-events:none}
        .dp-custom-input{
          width:100%;background:var(--bg);border:1.5px solid var(--border);border-radius:10px;
          padding:11px 14px 11px 28px;
          font-family:var(--sans);font-size:14px;font-weight:700;color:var(--text);
          outline:none;transition:border-color .2s,box-shadow .2s;
        }
        .dp-custom-input:focus{border-color:rgba(200,85,26,.6);box-shadow:0 0 0 3px rgba(200,85,26,.1)}
        .dp-custom-input::placeholder{color:var(--border2);font-weight:400}

        /* FORM FIELDS */
        .dp-divider{height:1px;background:var(--border);margin:16px 0}
        .dp-field{margin-bottom:11px}
        .dp-lbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:var(--muted);margin-bottom:5px;display:block}
        .dp-input{
          width:100%;background:var(--bg);border:1.5px solid var(--border);border-radius:10px;
          padding:11px 13px;font-family:var(--sans);font-size:13px;color:var(--text);
          outline:none;transition:border-color .2s;
        }
        .dp-input:focus{border-color:rgba(200,85,26,.5)}
        .dp-input::placeholder{color:#c8bdaf}

        .dp-error{
          display:flex;align-items:center;gap:7px;font-size:12px;color:#c8320a;font-weight:600;
          background:rgba(200,50,10,.07);border:1px solid rgba(200,50,10,.2);border-radius:9px;
          padding:10px 13px;margin-bottom:12px;
        }

        /* CTA */
        .dp-cta{
          width:100%;display:flex;align-items:center;justify-content:center;gap:9px;
          background:linear-gradient(135deg,var(--o),#8a2e06);color:#fff;border:none;
          border-radius:12px;padding:15px;font-family:var(--sans);font-size:14px;font-weight:700;
          cursor:pointer;letter-spacing:.02em;
          box-shadow:0 6px 22px rgba(200,85,26,.32);transition:transform .2s,box-shadow .2s;
          margin-bottom:14px;
        }
        .dp-cta:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(200,85,26,.44)}
        .dp-cta:disabled{opacity:.55;cursor:not-allowed;transform:none}
        .dp-spinner{width:14px;height:14px;border-radius:50%;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;animation:dp-beat .7s linear infinite}

        /* SECURE BADGES */
        .dp-trust{display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;margin-bottom:12px}
        .dp-trust-item{display:flex;align-items:center;gap:4px;font-size:10px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.1em}
        .dp-upi-logos{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;margin-top:10px}
        .dp-upi-pill{background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:4px 10px;font-size:10px;font-weight:700;color:var(--muted);letter-spacing:.08em}

        /* SUCCESS */
        .dp-success{text-align:center;padding:16px 0}
        .dp-success-icon{
          width:72px;height:72px;border-radius:50%;
          background:linear-gradient(135deg,var(--o),#8a2e06);
          color:#fff;font-size:30px;display:flex;align-items:center;justify-content:center;
          margin:0 auto 18px;animation:dp-check .4s ease;box-shadow:0 8px 28px rgba(200,85,26,.4);
        }
        .dp-success-title{font-family:var(--body);font-size:24px;font-weight:700;color:var(--text);margin-bottom:8px}
        .dp-success-sub{font-family:var(--body);font-size:15px;font-style:italic;color:var(--muted);line-height:1.8;max-width:280px;margin:0 auto 22px}
        .dp-share-btn{
          display:inline-flex;align-items:center;gap:7px;
          font-size:12px;font-weight:700;color:var(--o);text-decoration:none;
          border:1.5px solid rgba(200,85,26,.35);border-radius:99px;padding:9px 20px;
          transition:background .2s;
        }
        .dp-share-btn:hover{background:rgba(200,85,26,.07)}

        @media(max-width:900px){.dp-main{grid-template-columns:1fr}.dp-form-card{position:static;order:-1}}
        @media(max-width:560px){.dp-hero{padding:64px 16px 56px}.dp-main{padding:36px 16px 80px}.dp-form-card{padding:24px 16px}.dp-amounts{grid-template-columns:repeat(3,1fr);gap:6px}}
      `}</style>

      {/* HERO */}
      <section aria-labelledby="donate-h1">
        <div className="dp-hero">
          <div style={{maxWidth:600,margin:"0 auto",position:"relative",zIndex:1}}>
            <span aria-hidden="true" style={{fontSize:32,color:"#c8551a",display:"block",marginBottom:14,animation:loaded?"dp-beat 2s ease-in-out infinite":"none"}}>♥</span>
            <div className="dp-hero-eyebrow">Support the Mission</div>
            <h1 id="donate-h1" className="dp-hero-h1">Help Spread <em>Wisdom</em><br/>to Every Home</h1>
            <p className="dp-hero-sub">Your contribution keeps teachings free — books, videos and satsangs — reaching those who need clarity most.</p>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <div className="dp-main">

        {/* LEFT: impact + payment methods + testimonials */}
        <div>
          <Reveal>
            <h2 className="dp-section-title">Where your donation goes</h2>
            <p className="dp-section-sub">Every rupee is used directly for teaching, outreach and keeping wisdom freely accessible.</p>
          </Reveal>

          <div className="dp-impact-list">
            {IMPACT.map((item,i)=>(
              <Reveal key={item.label} delay={i*70}>
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

          {/* Payment methods section */}
          <Reveal delay={80}>
            <h3 style={{fontFamily:"var(--body)",fontSize:18,fontWeight:700,color:"var(--text)",marginBottom:14,fontStyle:"italic"}}>
              All Indian payment methods accepted
            </h3>
          </Reveal>
          <div className="dp-pm-grid">
            {PAYMENT_METHODS.map((pm,i)=>(
              <Reveal key={pm.label} delay={i*50}>
                <div className="dp-pm-card">
                  <div className="dp-pm-icon" aria-hidden="true">{pm.icon}</div>
                  <div>
                    <div className="dp-pm-lbl">{pm.label}</div>
                    <div className="dp-pm-sub">{pm.sub}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Testimonials */}
          <Reveal delay={100}>
            <h3 style={{fontFamily:"var(--body)",fontSize:18,fontWeight:700,color:"var(--text)",marginBottom:14,fontStyle:"italic"}}>What donors say</h3>
          </Reveal>
          <div className="dp-testimonials">
            {TESTIMONIALS.map((t,i)=>(
              <Reveal key={t.name} delay={i*60}>
                <div className="dp-tcard" role="blockquote">
                  <p className="dp-ttext">"{t.text}"</p>
                  <p className="dp-tauthor">— {t.name}, {t.city}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* RIGHT: donation form */}
        <Reveal>
          <div className="dp-form-card" role="form" aria-labelledby="donate-form-title">
            {success ? (
              <div className="dp-success" role="status" aria-live="polite">
                <div className="dp-success-icon" aria-hidden="true"><FaCheck/></div>
                <h2 className="dp-success-title">Thank you! 🙏</h2>
                <p className="dp-success-sub">Your donation of <strong>₹{finalAmt.toLocaleString("en-IN")}</strong> was received. A receipt has been sent to {email}.</p>
                <a href={`https://wa.me/?text=${encodeURIComponent("I just donated to Guruji Shrawan Foundation to help spread wisdom. gurujishrawan.com/donate")}`}
                  target="_blank" rel="noopener noreferrer" className="dp-share-btn">
                  <FaHeart size={11}/> Share with friends
                </a>
              </div>
            ):(
              <>
                <h2 id="donate-form-title" className="dp-form-title">Make a Donation</h2>
                <p className="dp-form-sub">All amounts welcome. Choose a preset or enter your own.</p>

                {/* Presets */}
                <div className="dp-amounts" role="group" aria-label="Select donation amount">
                  {PRESET_AMOUNTS.map(a=>(
                    <button key={a} type="button"
                      className={`dp-amt-btn ${amount===a&&!custom?"dp-amt-active":""}`}
                      onClick={()=>{setAmount(a);setCustom("")}}
                      aria-pressed={amount===a&&!custom}>
                      ₹{a.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>

                {/* Custom */}
                <div className="dp-custom-wrap">
                  <span className="dp-rupee" aria-hidden="true">₹</span>
                  <input type="number" className="dp-custom-input" placeholder="Custom amount"
                    value={custom} onChange={e=>{setCustom(e.target.value);setAmount("")}}
                    min="1" aria-label="Enter custom donation amount in rupees"/>
                </div>

                <div className="dp-divider"/>

                {/* Donor info */}
                <div className="dp-field">
                  <label className="dp-lbl" htmlFor="dp-name">Full Name *</label>
                  <input id="dp-name" className="dp-input" type="text" placeholder="Your full name"
                    value={name} onChange={e=>setName(e.target.value)} autoComplete="name"/>
                </div>
                <div className="dp-field">
                  <label className="dp-lbl" htmlFor="dp-email">Email *</label>
                  <input id="dp-email" className="dp-input" type="email" placeholder="For payment receipt"
                    value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email"/>
                </div>
                <div className="dp-field">
                  <label className="dp-lbl" htmlFor="dp-phone">Phone (optional)</label>
                  <input id="dp-phone" className="dp-input" type="tel" placeholder="For UPI auto-fill"
                    value={phone} onChange={e=>setPhone(e.target.value)} autoComplete="tel"/>
                </div>
                <div className="dp-field">
                  <label className="dp-lbl" htmlFor="dp-msg">Message (optional)</label>
                  <input id="dp-msg" className="dp-input" type="text" placeholder="A note with your donation"
                    value={msg} onChange={e=>setMsg(e.target.value)} maxLength={200}/>
                </div>

                {error && <div className="dp-error" role="alert"><FaTimes size={10}/> {error}</div>}

                <button type="button" className="dp-cta"
                  onClick={handleDonate}
                  disabled={loading||!finalAmt||!name.trim()||!email.trim()}
                  aria-label={`Donate ₹${finalAmt||"amount"} securely`}>
                  {loading
                    ? <><div className="dp-spinner"/> Processing…</>
                    : <><FaHeart size={13}/> Donate ₹{finalAmt?finalAmt.toLocaleString("en-IN"):"—"} <FaArrowRight size={11}/></>
                  }
                </button>

                {/* Trust indicators */}
                <div className="dp-trust">
                  <span className="dp-trust-item"><FaLock size={9}/> Razorpay Secure</span>
                  <span className="dp-trust-item"><FaShieldAlt size={9}/> 256-bit SSL</span>
                </div>

                {/* UPI app logos as text pills */}
                <div className="dp-upi-logos" aria-label="Accepted payment apps">
                  {["GPay","PhonePe","Paytm","BHIM","UPI","NetBanking","Cards"].map(p=>(
                    <span key={p} className="dp-upi-pill">{p}</span>
                  ))}
                </div>

                <p style={{fontSize:10,color:"var(--muted)",textAlign:"center",marginTop:12,lineHeight:1.65}}>
                  By donating you agree to our <Link href="/terms" style={{color:"var(--o)"}}>Terms</Link>.
                  UPI, PhonePe, Paytm, GPay, all cards &amp; net banking accepted.
                  Receipt emailed instantly.
                </p>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </main>
  )
}