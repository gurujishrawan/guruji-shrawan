"use client"

import { useState, useEffect, useRef } from "react"
import { X, Eye, EyeOff, Loader2, Check, ArrowLeft } from "lucide-react"
import { supabase } from "../../lib/supabaseClient"

/* ─── design tokens — matches your site exactly ─── */
const SANS   = "'Poppins', system-ui, sans-serif"
const BODY   = "'Lora', Georgia, serif"
const ORANGE = "#c8551a"
const GOLD   = "#b8841a"
const BG     = "#faf7f2"
const CARD   = "#ffffff"
const BORDER = "#e8ddd0"
const TEXT   = "#1a1008"
const MUTED  = "#8a7a6a"

/* ─── Google icon ─── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

/* ─── Context-aware prompts ─── */
const PROMPTS = {
  like:    { emoji: "♡",  title: "Like this article",    sub: "Show appreciation for content you love." },
  comment: { emoji: "💬", title: "Join the discussion",   sub: "Share your thoughts with the community." },
  save:    { emoji: "🔖", title: "Save for later",        sub: "Build your personal reading list." },
  reply:   { emoji: "↩",  title: "Reply to a comment",   sub: "Continue the conversation." },
  default: { emoji: "🔥", title: "Welcome Back",          sub: "Join thousands of seekers on the path." },
}

export default function LoginModal({ reason = null, onClose, onSuccess }) {
  const [view,     setView]    = useState("main")
  const [tab,      setTab]     = useState("login")
  const [showPw,   setShowPw]  = useState(false)
  const [name,     setName]    = useState("")
  const [email,    setEmail]   = useState("")
  const [pw,       setPw]      = useState("")
  const [loading,  setLoading] = useState(false)
  const [gLoading, setGLoad]   = useState(false)
  const [error,    setError]   = useState("")
  const [success,  setSuccess] = useState("")
  const bgRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  useEffect(() => { setError(""); setSuccess("") }, [tab, email, pw, name])

  const prompt = PROMPTS[reason] || PROMPTS.default

  /* ── input base style ── */
  const iSt = {
    width: "100%", padding: "11px 14px", borderRadius: 10,
    border: `1.5px solid ${BORDER}`, background: BG,
    fontFamily: SANS, fontSize: 14, color: TEXT,
    outline: "none", boxSizing: "border-box",
    transition: "border-color .18s, box-shadow .18s",
  }
  const onFocus = e => { e.target.style.borderColor = ORANGE; e.target.style.boxShadow = `0 0 0 3px rgba(200,85,26,0.12)` }
  const onBlur  = e => { e.target.style.borderColor = BORDER;  e.target.style.boxShadow = "none" }

  /* ── Google OAuth ── */
  async function handleGoogle() {
    setGLoad(true); setError("")
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { prompt: "select_account" },
      },
    })
    if (err) { setError(err.message); setGLoad(false) }
  }

  /* ── Email / Password ── */
  async function handleSubmit() {
    if (!email.trim()) { setError("Email is required."); return }
    if (!pw.trim())    { setError("Password is required."); return }
    if (tab === "signup" && pw.length < 6) { setError("Password must be at least 6 characters."); return }
    setLoading(true); setError("")

    if (tab === "login") {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pw })
      setLoading(false)
      if (err) { setError(err.message); return }
      onSuccess?.(data.user); onClose()
    } else {
      const { data, error: err } = await supabase.auth.signUp({
        email: email.trim(), password: pw,
        options: {
          data: { full_name: name.trim() || email.split("@")[0] },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      setLoading(false)
      if (err) { setError(err.message); return }
      if (data.session) { onSuccess?.(data.user); onClose() }
      else setView("check-email")
    }
  }

  /* ── Forgot password ── */
  async function handleForgot() {
    if (!email.trim()) { setError("Enter your email first."); return }
    setLoading(true); setError("")
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/reset`,
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    setView("check-reset")
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Poppins:wght@400;500;600;700;800&display=swap');
        @keyframes lm-fade   { from{opacity:0} to{opacity:1} }
        @keyframes lm-slide  { from{opacity:0;transform:translateY(28px) scale(.96)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes lm-spin   { to{transform:rotate(360deg)} }
        @keyframes lm-shimmer{ 0%,100%{opacity:.6} 50%{opacity:1} }
        .lm-spin-anim { animation: lm-spin .85s linear infinite }

        /* Google btn */
        .lm-google {
          width:100%; padding:11px 16px; border-radius:12px;
          border:1.5px solid ${BORDER}; background:${CARD};
          font-family:${SANS}; font-size:14px; font-weight:600; color:${TEXT};
          display:flex; align-items:center; justify-content:center; gap:10px;
          cursor:pointer; margin-bottom:18px;
          transition:border-color .2s ease, background .2s ease, box-shadow .2s ease;
        }
        .lm-google:hover:not(:disabled) {
          border-color:${ORANGE};
          background:#fff8f3;
          box-shadow:0 4px 16px rgba(200,85,26,.12);
        }

        /* Tab buttons */
        .lm-tab {
          flex:1; padding:8px 0; font-family:${SANS}; font-size:13px;
          font-weight:600; border:none; border-radius:9px; cursor:pointer;
          transition:all .18s ease;
        }
        .lm-tab-on  { background:${CARD}; color:${ORANGE}; box-shadow:0 2px 8px rgba(200,85,26,.14) }
        .lm-tab-off { background:transparent; color:${MUTED} }

        /* Submit btn */
        .lm-submit {
          width:100%; margin-top:16px; padding:13px;
          border-radius:12px; border:none; cursor:pointer;
          background:linear-gradient(135deg,${ORANGE},#8a2e06);
          color:#fff; font-family:${SANS}; font-size:14px; font-weight:700;
          display:flex; align-items:center; justify-content:center; gap:8px;
          box-shadow:0 6px 22px rgba(200,85,26,.32);
          transition:transform .2s ease, box-shadow .2s ease, opacity .2s ease;
        }
        .lm-submit:hover:not(:disabled) {
          transform:translateY(-2px);
          box-shadow:0 10px 30px rgba(200,85,26,.42);
        }
        .lm-submit:active:not(:disabled) { transform:scale(.97) }
        .lm-submit:disabled { opacity:.55; cursor:not-allowed }

        /* Link buttons */
        .lm-link {
          color:${ORANGE}; background:none; border:none; cursor:pointer;
          font-family:${SANS}; font-size:13px; font-weight:600;
          transition:opacity .15s;
        }
        .lm-link:hover { opacity:.7; text-decoration:underline }

        /* Left panel gradient orb */
        .lm-orb1 { position:absolute; top:-50px; right:-50px; width:160px; height:160px; border-radius:50%; background:rgba(255,255,255,.07); pointer-events:none }
        .lm-orb2 { position:absolute; bottom:-40px; left:-30px; width:110px; height:110px; border-radius:50%; background:rgba(255,255,255,.05); pointer-events:none }
        .lm-orb3 { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:200px; height:200px; border-radius:50%; background:radial-gradient(circle,rgba(200,85,26,.18),transparent 70%); pointer-events:none }

        /* Responsive */
        @media (max-width: 580px) {
          .lm-card { grid-template-columns:1fr !important; max-width:100% !important; border-radius:20px 20px 0 0 !important; margin-top:auto !important }
          .lm-left { display:none !important }
          .lm-right { padding:28px 22px 24px !important; max-height:92svh !important }
          .lm-backdrop { align-items:flex-end !important; padding:0 !important }
          .lm-card { animation: lm-slide-up .26s cubic-bezier(.16,1,.3,1) !important }
        }
        @keyframes lm-slide-up { from{opacity:0;transform:translateY(100%)} to{opacity:1;transform:translateY(0)} }
        @media (max-width:360px) {
          .lm-right { padding:22px 16px 20px !important }
        }
      `}</style>

      {/* Backdrop */}
      <div
        ref={bgRef}
        className="lm-backdrop"
        onClick={e => e.target === bgRef.current && onClose()}
        style={{
          position:"fixed", inset:0, zIndex:700,
          background:"rgba(26,16,8,0.60)", backdropFilter:"blur(5px)",
          display:"flex", alignItems:"center", justifyContent:"center",
          padding:"16px", animation:"lm-fade .18s ease-out",
        }}
      >
        {/* Card */}
        <div
          className="lm-card"
          style={{
            display:"grid", gridTemplateColumns:"220px 1fr",
            width:"100%", maxWidth:620, borderRadius:24, overflow:"hidden",
            background:CARD,
            boxShadow:"0 32px 100px rgba(26,16,8,0.22), 0 0 0 1px rgba(200,85,26,0.1)",
            animation:"lm-slide .24s cubic-bezier(.16,1,.3,1)",
          }}
        >
          {/* ══ LEFT PANEL ══ */}
          <div
            className="lm-left"
            style={{
              background:`linear-gradient(165deg,#2a1005 0%,${ORANGE} 55%,${GOLD} 100%)`,
              padding:"36px 24px", display:"flex", flexDirection:"column",
              justifyContent:"space-between", position:"relative", overflow:"hidden",
            }}
          >
            <div className="lm-orb1"/><div className="lm-orb2"/><div className="lm-orb3"/>

            <div style={{position:"relative", zIndex:1}}>
              {/* Logo mark */}
              <div style={{
                width:46, height:46, borderRadius:14, marginBottom:30,
                background:"rgba(255,255,255,0.13)", backdropFilter:"blur(8px)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:22, border:"1px solid rgba(255,255,255,0.22)",
                boxShadow:"0 4px 16px rgba(0,0,0,0.12)",
              }}>🔥</div>

              <p style={{fontFamily:BODY, fontSize:34, lineHeight:1, marginBottom:12, filter:"drop-shadow(0 2px 8px rgba(0,0,0,0.2))"}}>{prompt.emoji}</p>
              <h2 style={{fontFamily:BODY, fontSize:18, fontWeight:700, fontStyle:"italic", color:"#fff", lineHeight:1.35, marginBottom:10, letterSpacing:"-.01em"}}>
                {prompt.title}
              </h2>
              <p style={{fontFamily:SANS, fontSize:12, color:"rgba(255,255,255,0.62)", lineHeight:1.7}}>
                {prompt.sub}
              </p>
            </div>

            {/* Bottom trust block */}
            <div style={{position:"relative", zIndex:1}}>
              <div style={{height:"1px", background:"rgba(255,255,255,0.15)", marginBottom:14}}/>
              <p style={{fontFamily:SANS, fontSize:11, color:"rgba(255,255,255,0.38)", lineHeight:1.7}}>
                Guruji Shrawan Foundation<br/>
                Thousands of seekers. One path.
              </p>
            </div>
          </div>

          {/* ══ RIGHT FORM PANEL ══ */}
          <div
            className="lm-right"
            style={{
              padding:"30px 28px 26px", position:"relative",
              overflowY:"auto", maxHeight:"90svh", background:BG,
            }}
          >
            {/* Close */}
            <button onClick={onClose} style={{
              position:"absolute", top:14, right:14,
              width:30, height:30, borderRadius:"50%",
              background:CARD, border:`1.5px solid ${BORDER}`,
              cursor:"pointer", display:"flex", alignItems:"center",
              justifyContent:"center", color:MUTED,
              transition:"border-color .18s, color .18s",
            }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=ORANGE;e.currentTarget.style.color=ORANGE}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=BORDER;e.currentTarget.style.color=MUTED}}
            >
              <X size={13}/>
            </button>

            {/* ── VIEW: CHECK EMAIL ── */}
            {view === "check-email" && (
              <div style={{paddingTop:16, textAlign:"center"}}>
                <div style={{fontSize:52, marginBottom:14}}>📬</div>
                <h3 style={{fontFamily:BODY, fontSize:20, fontWeight:700, fontStyle:"italic", color:TEXT, marginBottom:8}}>Check your inbox</h3>
                <p style={{fontFamily:SANS, fontSize:13, color:MUTED, lineHeight:1.75, marginBottom:24}}>
                  We sent a confirmation link to<br/>
                  <strong style={{color:ORANGE}}>{email}</strong>.<br/>
                  Click it to activate your account.
                </p>
                <button onClick={onClose} className="lm-submit" style={{marginTop:0}}>Got it 🙏</button>
                <p style={{fontFamily:SANS, fontSize:12, color:MUTED, marginTop:14}}>
                  Didn&apos;t get it?{" "}
                  <button className="lm-link" onClick={()=>{setView("main");setTab("signup")}}>Try again</button>
                </p>
              </div>
            )}

            {/* ── VIEW: CHECK RESET ── */}
            {view === "check-reset" && (
              <div style={{paddingTop:16, textAlign:"center"}}>
                <div style={{fontSize:52, marginBottom:14}}>🔑</div>
                <h3 style={{fontFamily:BODY, fontSize:20, fontWeight:700, fontStyle:"italic", color:TEXT, marginBottom:8}}>Reset link sent</h3>
                <p style={{fontFamily:SANS, fontSize:13, color:MUTED, lineHeight:1.75, marginBottom:24}}>
                  Check your inbox at<br/>
                  <strong style={{color:ORANGE}}>{email}</strong><br/>
                  and follow the link to set a new password.
                </p>
                <button onClick={()=>setView("main")} className="lm-submit" style={{marginTop:0}}>Back to Sign In</button>
              </div>
            )}

            {/* ── VIEW: FORGOT PASSWORD ── */}
            {view === "forgot" && (
              <div style={{paddingTop:4}}>
                <button
                  onClick={()=>{setView("main");setError("")}}
                  style={{display:"flex",alignItems:"center",gap:5,fontFamily:SANS,fontSize:12,color:MUTED,background:"none",border:"none",cursor:"pointer",marginBottom:22,transition:"color .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.color=ORANGE}
                  onMouseLeave={e=>e.currentTarget.style.color=MUTED}
                >
                  <ArrowLeft size={13}/> Back to sign in
                </button>
                <h3 style={{fontFamily:BODY, fontSize:22, fontWeight:700, fontStyle:"italic", color:TEXT, marginBottom:6}}>Forgot password?</h3>
                <p style={{fontFamily:SANS, fontSize:13, color:MUTED, marginBottom:22, lineHeight:1.6}}>
                  Enter your email and we&apos;ll send a reset link.
                </p>
                {error && <ErrorBanner msg={error}/>}
                <input
                  value={email} onChange={e=>setEmail(e.target.value)}
                  type="email" placeholder="Email address" style={iSt}
                  onFocus={onFocus} onBlur={onBlur}
                  onKeyDown={e=>e.key==="Enter"&&handleForgot()}
                />
                <button onClick={handleForgot} disabled={loading} className="lm-submit">
                  {loading ? <><Loader2 size={15} className="lm-spin-anim"/> Sending…</> : "Send Reset Link →"}
                </button>
              </div>
            )}

            {/* ── VIEW: MAIN ── */}
            {view === "main" && (
              <>
                {/* Pill tabs */}
                <div style={{display:"flex", background:CARD, border:`1.5px solid ${BORDER}`, borderRadius:13, padding:4, marginBottom:24, gap:4}}>
                  {[["login","Sign In"],["signup","Sign Up"]].map(([k,l])=>(
                    <button
                      key={k} onClick={()=>setTab(k)}
                      className={`lm-tab ${tab===k?"lm-tab-on":"lm-tab-off"}`}
                    >{l}</button>
                  ))}
                </div>

                <h3 style={{fontFamily:BODY, fontSize:22, fontWeight:700, fontStyle:"italic", color:TEXT, marginBottom:3, letterSpacing:"-.01em"}}>
                  {tab==="login" ? "Welcome back" : "Create account"}
                </h3>
                <p style={{fontFamily:SANS, fontSize:13, color:MUTED, marginBottom:20, lineHeight:1.55}}>
                  {tab==="login" ? "Sign in to your Guruji Shrawan account." : "Free forever. No spam, ever."}
                </p>

                {/* Google */}
                <button onClick={handleGoogle} disabled={gLoading} className="lm-google">
                  {gLoading
                    ? <Loader2 size={17} className="lm-spin-anim" style={{color:MUTED}}/>
                    : <GoogleIcon/>}
                  {tab==="login" ? "Continue with Google" : "Sign up with Google"}
                </button>

                {/* Divider */}
                <div style={{display:"flex", alignItems:"center", gap:10, marginBottom:18}}>
                  <div style={{flex:1, height:1, background:BORDER}}/>
                  <span style={{fontFamily:SANS, fontSize:11, color:MUTED, fontWeight:500, whiteSpace:"nowrap"}}>or with email</span>
                  <div style={{flex:1, height:1, background:BORDER}}/>
                </div>

                {error   && <ErrorBanner   msg={error}/>}
                {success && <SuccessBanner msg={success}/>}

                {/* Fields */}
                <div style={{display:"flex", flexDirection:"column", gap:10}}>
                  {tab==="signup" && (
                    <input value={name} onChange={e=>setName(e.target.value)}
                      placeholder="Full name" style={iSt}
                      onFocus={onFocus} onBlur={onBlur}/>
                  )}
                  <input value={email} onChange={e=>setEmail(e.target.value)}
                    type="email" placeholder="Email address" style={iSt}
                    onFocus={onFocus} onBlur={onBlur}
                    onKeyDown={e=>e.key==="Enter"&&!pw&&document.getElementById("lm-pw")?.focus()}/>
                  <div style={{position:"relative"}}>
                    <input id="lm-pw" value={pw} onChange={e=>setPw(e.target.value)}
                      type={showPw?"text":"password"} placeholder="Password"
                      style={{...iSt, paddingRight:44}}
                      onFocus={onFocus} onBlur={onBlur}
                      onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
                    <button onClick={()=>setShowPw(!showPw)} style={{
                      position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                      background:"none", border:"none", color:MUTED, cursor:"pointer",
                      display:"flex", alignItems:"center", padding:2,
                    }}>
                      {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                    </button>
                  </div>
                </div>

                {/* Forgot */}
                {tab==="login" && (
                  <div style={{textAlign:"right", marginTop:8}}>
                    <button className="lm-link" style={{fontSize:12}} onClick={()=>{setView("forgot");setError("")}}>
                      Forgot password?
                    </button>
                  </div>
                )}

                <button onClick={handleSubmit} disabled={loading} className="lm-submit">
                  {loading
                    ? <><Loader2 size={15} className="lm-spin-anim"/> Please wait…</>
                    : tab==="login" ? "Sign In →" : "Create Account →"}
                </button>

                {/* Switch tab */}
                <p style={{fontFamily:SANS, fontSize:12, color:MUTED, textAlign:"center", marginTop:16}}>
                  {tab==="login" ? "Don't have an account? " : "Already have an account? "}
                  <button className="lm-link" onClick={()=>setTab(tab==="login"?"signup":"login")}>
                    {tab==="login" ? "Sign up free" : "Sign in"}
                  </button>
                </p>

                {/* Legal */}
                <p style={{fontFamily:SANS, fontSize:10.5, color:"#c0b0a0", textAlign:"center", marginTop:14, lineHeight:1.65}}>
                  By continuing you agree to our{" "}
                  <a href="/terms" style={{color:MUTED, textDecoration:"underline"}}>Terms</a>{" & "}
                  <a href="/privacy" style={{color:MUTED, textDecoration:"underline"}}>Privacy Policy</a>.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

/* ── Banner helpers ── */
function ErrorBanner({ msg }) {
  return (
    <div style={{
      background:"#fef5f0", border:`1.5px solid rgba(200,85,26,0.3)`,
      borderRadius:10, padding:"10px 13px", marginBottom:14,
      fontFamily:SANS, fontSize:13, color:ORANGE,
      display:"flex", alignItems:"flex-start", gap:7,
    }}>
      <span style={{marginTop:1, flexShrink:0}}>⚠️</span> {msg}
    </div>
  )
}
function SuccessBanner({ msg }) {
  return (
    <div style={{
      background:"#f0fdf4", border:"1.5px solid #86efac",
      borderRadius:10, padding:"10px 13px", marginBottom:14,
      fontFamily:SANS, fontSize:13, color:"#16a34a",
      display:"flex", alignItems:"flex-start", gap:7,
    }}>
      <Check size={14} style={{marginTop:1, flexShrink:0}}/> {msg}
    </div>
  )
}