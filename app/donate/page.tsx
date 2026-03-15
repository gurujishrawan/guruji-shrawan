// app/donate/page.tsx
// Static donate page — no Razorpay for now.
// Replace the "coming soon" section with real payment when ready.

import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { FaHeart, FaYoutube, FaBook, FaUsers, FaWhatsapp, FaEnvelope, FaArrowRight } from "react-icons/fa"

export const metadata: Metadata = {
  title: "Donate",
  description: "Support Guruji Shrawan Foundation — help spread wisdom through books, videos and free satsangs across India.",
}

const IMPACT = [
  { icon: "📖", title: "Books & Publications",  desc: "Funds printing and free distribution of books to those who cannot afford them." },
  { icon: "▶",  title: "Video Teachings",        desc: "Keeps satsangs, Q&As and video teachings freely available on YouTube." },
  { icon: "🤝", title: "Community Outreach",     desc: "Enables free public programs for students, youth and rural communities." },
  { icon: "🌱", title: "Website & Content",      desc: "Keeps gurujishrawan.com free, fast and accessible to everyone." },
]

const TESTIMONIALS = [
  { name: "Priya S.",  city: "Delhi",     text: "Guruji's teachings changed my life. I'm glad I could give back however little." },
  { name: "Rajan M.",  city: "Mumbai",    text: "Every rupee goes toward real wisdom reaching real people. I donate monthly." },
  { name: "Ananya T.", city: "Bengaluru", text: "The free YouTube videos helped me through the hardest year of my life." },
]

const UPI_ID = "gurujishrawan@upi"   // ← replace with your real UPI ID

export default function DonatePage() {
  return (
    <main style={{ background:"#faf7f2", minHeight:"100vh", fontFamily:"'Poppins',system-ui,sans-serif", color:"#1a1008" }}>

      {/* ── HERO ── */}
      <section style={{
        background: "linear-gradient(160deg,#1a1008,#2a1608 55%,#1a1008)",
        padding: "80px 24px 72px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 80% at 50% 0%,rgba(200,85,26,.25),transparent 70%)", pointerEvents:"none" }} />
        <div style={{ maxWidth:580, margin:"0 auto", position:"relative", zIndex:1 }}>
          <span style={{ fontSize:36, display:"block", marginBottom:14 }}>🙏</span>
          <p style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:".28em", color:"#b8841a", marginBottom:16 }}>
            Support the Mission
          </p>
          <h1 style={{ fontFamily:"'Lora',Georgia,serif", fontSize:"clamp(34px,6vw,60px)", fontWeight:700, color:"#fff", lineHeight:1.1, letterSpacing:"-.025em", marginBottom:16 }}>
            Help Spread <em style={{ fontStyle:"italic", color:"#c8551a" }}>Wisdom</em><br/>to Every Home
          </h1>
          <p style={{ fontFamily:"'Lora',Georgia,serif", fontSize:17, fontStyle:"italic", color:"rgba(255,255,255,.65)", lineHeight:1.85, maxWidth:520, margin:"0 auto" }}>
            Your contribution — however small — keeps teachings free, books accessible and wisdom reaching those who need clarity most.
          </p>
        </div>
      </section>

      {/* ── MAIN ── */}
      <div style={{ maxWidth:1060, margin:"0 auto", padding:"56px 24px 100px", display:"grid", gridTemplateColumns:"1fr 380px", gap:48, alignItems:"start" }}>

        {/* LEFT: impact */}
        <div>
          <h2 style={{ fontFamily:"'Lora',Georgia,serif", fontSize:"clamp(22px,2.5vw,32px)", fontWeight:700, color:"#1a1008", marginBottom:6 }}>
            Where your donation goes
          </h2>
          <p style={{ fontSize:13, color:"#8a7a6a", lineHeight:1.75, marginBottom:28, maxWidth:480 }}>
            Every rupee is used directly for teaching, outreach and keeping wisdom freely accessible — no middlemen, no overhead.
          </p>

          {/* Impact cards */}
          <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:40 }}>
            {IMPACT.map(item => (
              <div key={item.title} style={{ display:"flex", gap:16, alignItems:"flex-start", background:"#fff", border:"1.5px solid #e8ddd0", borderRadius:16, padding:"18px 20px" }}>
                <div style={{ width:44, height:44, borderRadius:12, background:"rgba(200,85,26,.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontSize:14, fontWeight:700, color:"#1a1008", marginBottom:4 }}>{item.title}</p>
                  <p style={{ fontSize:13, color:"#8a7a6a", lineHeight:1.7 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <h3 style={{ fontFamily:"'Lora',Georgia,serif", fontSize:18, fontWeight:700, fontStyle:"italic", color:"#1a1008", marginBottom:14 }}>
            What donors say
          </h3>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ background:"#f4efe6", border:"1.5px solid #e8ddd0", borderRadius:14, padding:"16px 18px" }}>
                <p style={{ fontFamily:"'Lora',Georgia,serif", fontSize:14, fontStyle:"italic", color:"#5a4030", lineHeight:1.8, marginBottom:8 }}>
                  "{t.text}"
                </p>
                <p style={{ fontSize:10, fontWeight:700, color:"#8a7a6a", textTransform:"uppercase", letterSpacing:".14em" }}>
                  — {t.name}, {t.city}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: donate options */}
        <div>
          {/* UPI Direct */}
          <div style={{ background:"#fff", border:"1.5px solid #e8ddd0", borderRadius:22, padding:"28px 24px", boxShadow:"0 8px 32px rgba(26,16,8,.08)", marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:"linear-gradient(135deg,#c8551a,#8a2e06)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:16 }}>
                ♥
              </div>
              <div>
                <p style={{ fontSize:16, fontWeight:700, color:"#1a1008" }}>Donate via UPI</p>
                <p style={{ fontSize:12, color:"#8a7a6a" }}>PhonePe · GPay · Paytm · BHIM</p>
              </div>
            </div>

            {/* UPI ID box */}
            <div style={{ background:"#faf7f2", border:"1.5px solid #e8ddd0", borderRadius:12, padding:"14px 16px", marginBottom:16, display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
              <div>
                <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:".16em", color:"#8a7a6a", marginBottom:4 }}>UPI ID</p>
                <p style={{ fontSize:16, fontWeight:800, color:"#c8551a", letterSpacing:".04em", fontFamily:"monospace" }}>{UPI_ID}</p>
              </div>
              <button
                onClick={() => { navigator.clipboard?.writeText(UPI_ID) }}
                style={{ background:"rgba(200,85,26,.1)", border:"1px solid rgba(200,85,26,.25)", borderRadius:8, padding:"8px 14px", fontSize:11, fontWeight:700, color:"#c8551a", cursor:"pointer", whiteSpace:"nowrap" }}
              >
                Copy
              </button>
            </div>

            {/* WhatsApp payment note */}
            <p style={{ fontSize:12, color:"#8a7a6a", lineHeight:1.65, marginBottom:16, textAlign:"center" }}>
              Open any UPI app, search the UPI ID above, enter your amount and pay directly.
              <br/>All amounts welcome — ₹50 to ₹50,000.
            </p>

            {/* WhatsApp confirmation */}
            <a
              href={`https://wa.me/919999999999?text=${encodeURIComponent("Namaste Guruji 🙏 I have made a donation via UPI. UPI ID: " + UPI_ID)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:9, background:"#25d366", color:"#fff", borderRadius:12, padding:"13px 16px", textDecoration:"none", fontWeight:700, fontSize:14, boxShadow:"0 4px 16px rgba(37,211,102,.3)" }}
            >
              <span style={{ fontSize:18 }}>💬</span> Confirm on WhatsApp
            </a>
            <p style={{ fontSize:10, color:"#b0a090", textAlign:"center", marginTop:10, lineHeight:1.6 }}>
              Send a WhatsApp message after paying so we can acknowledge your donation and send a receipt.
            </p>
          </div>

          {/* Bank Transfer */}
          <div style={{ background:"#fff", border:"1.5px solid #e8ddd0", borderRadius:16, padding:"20px 22px", marginBottom:16 }}>
            <p style={{ fontSize:13, fontWeight:700, color:"#1a1008", marginBottom:12, display:"flex", alignItems:"center", gap:7 }}>
              🏦 Bank Transfer (NEFT / IMPS)
            </p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {[
                ["Account Name", "Guruji Shrawan Foundation"],
                ["Bank",         "Your Bank Name"],          // ← replace
                ["Account No",  "XXXXXXXXXXXX"],             // ← replace
                ["IFSC",        "XXXXXXXX"],                 // ← replace
              ].map(([lbl, val]) => (
                <div key={lbl} style={{ background:"#faf7f2", borderRadius:10, padding:"10px 12px" }}>
                  <p style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:".14em", color:"#8a7a6a", marginBottom:3 }}>{lbl}</p>
                  <p style={{ fontSize:12, fontWeight:700, color:"#1a1008" }}>{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Online payment — coming soon */}
          <div style={{ background:"linear-gradient(135deg,#fff8f2,#faf5ec)", border:"1.5px dashed rgba(200,85,26,.3)", borderRadius:16, padding:"20px 22px", textAlign:"center" }}>
            <p style={{ fontSize:20, marginBottom:8 }}>💳</p>
            <p style={{ fontSize:13, fontWeight:700, color:"#c8551a", marginBottom:5 }}>Online Card / Net Banking</p>
            <p style={{ fontSize:12, color:"#8a7a6a", lineHeight:1.65 }}>
              Secure online payment via Razorpay is coming soon.<br/>
              For now, please use UPI or bank transfer above.
            </p>
          </div>

          <p style={{ fontSize:10, color:"#b0a090", textAlign:"center", marginTop:16, lineHeight:1.65 }}>
            Need help?{" "}
            <a href="mailto:contact@gurujishrawan.com" style={{ color:"#c8551a" }}>Email us</a>
            {" "}or{" "}
            <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" style={{ color:"#c8551a" }}>WhatsApp</a>.
          </p>
        </div>
      </div>

      {/* ── RESPONSIVE styles via a style tag ── */}
      <style>{`
        @media(max-width:860px){
          .donate-main { grid-template-columns: 1fr !important; }
        }
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400&family=Poppins:wght@400;500;600;700&display=swap');
      `}</style>
    </main>
  )
}