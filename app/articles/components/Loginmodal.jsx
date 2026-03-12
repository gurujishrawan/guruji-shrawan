"use client"

import { useState, useEffect, useRef } from "react"
import { X, Eye, EyeOff, Loader2, Check, ArrowLeft } from "lucide-react"
import { supabase } from "../../lib/supabaseClient"

/* ─── design tokens (matches the rest of your site) ─── */
const P      = "'Poppins', system-ui, sans-serif"
const ORANGE = "#d4621a"

/* ─── Google icon SVG ─── */
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
  like:    { emoji: "♡",  title: "Like this article",   sub: "Show appreciation for content you love." },
  comment: { emoji: "💬", title: "Join the discussion",  sub: "Share your thoughts with the community." },
  save:    { emoji: "🔖", title: "Save for later",       sub: "Build your personal reading list." },
  reply:   { emoji: "↩",  title: "Reply to a comment",  sub: "Continue the conversation." },
  default: { emoji: "🔥", title: "Welcome to Guruji Shrawan", sub: "Join thousands of seekers." },
}

/* ══════════════════════════════════════════════════════════
   LOGIN MODAL
   Props:
     reason    — "like" | "comment" | "save" | "reply" | null
     onClose   — () => void
     onSuccess — (user) => void   called after successful auth
   ══════════════════════════════════════════════════════════ */
export default function LoginModal({ reason = null, onClose, onSuccess }) {
  /* view: "main" | "forgot" | "check-email" | "check-reset" */
  const [view,    setView]    = useState("main")
  const [tab,     setTab]     = useState("login")   // "login" | "signup"
  const [showPw,  setShowPw]  = useState(false)
  const [name,    setName]    = useState("")
  const [email,   setEmail]   = useState("")
  const [pw,      setPw]      = useState("")
  const [loading, setLoading] = useState(false)
  const [gLoading, setGLoad]  = useState(false)     // google-specific spinner
  const [error,   setError]   = useState("")
  const [success, setSuccess] = useState("")
  const bgRef = useRef(null)

  /* lock body scroll while open */
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  /* clear messages on tab / field change */
  useEffect(() => { setError(""); setSuccess("") }, [tab, email, pw, name])

  const prompt = PROMPTS[reason] || PROMPTS.default

  /* ── helpers ── */
  const iSt = {
    width: "100%", padding: "11px 14px", borderRadius: 10,
    border: "1.5px solid #e2e8f0", background: "#f8fafc",
    fontFamily: P, fontSize: 14, color: "#0f172a",
    outline: "none", boxSizing: "border-box", transition: "border-color .15s",
  }
  const focusBorder = e => e.target.style.borderColor = "#1d4ed8"
  const blurBorder  = e => e.target.style.borderColor = "#e2e8f0"

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
    // on success Supabase redirects the page — no further action needed here
  }

  /* ── Email / Password submit ── */
  async function handleSubmit() {
    if (!email.trim())  { setError("Email is required."); return }
    if (!pw.trim())     { setError("Password is required."); return }
    if (tab === "signup" && pw.length < 6) { setError("Password must be at least 6 characters."); return }

    setLoading(true); setError("")

    if (tab === "login") {
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email: email.trim(), password: pw,
      })
      setLoading(false)
      if (err) { setError(err.message); return }
      onSuccess?.(data.user)
      onClose()

    } else {
      const { data, error: err } = await supabase.auth.signUp({
        email: email.trim(),
        password: pw,
        options: {
          data: { full_name: name.trim() || email.split("@")[0] },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      setLoading(false)
      if (err) { setError(err.message); return }
      /* Supabase returns a session immediately if email-confirm is OFF,
         otherwise it returns null session and sends a confirm email */
      if (data.session) {
        onSuccess?.(data.user)
        onClose()
      } else {
        setView("check-email")
      }
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

  /* ══ RENDER ════════════════════════════════════════════════ */
  return (
    <>
      <style>{`
        @keyframes mdFade  { from{opacity:0} to{opacity:1} }
        @keyframes mdSlide { from{opacity:0;transform:translateY(24px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        .lm-spin { animation: spin .9s linear infinite }
        .lm-google:hover { background: #f1f5f9 !important }
        .lm-tab-active  { background:#fff !important; color:#1e293b !important; box-shadow:0 1px 4px rgba(0,0,0,.10) !important }
        .lm-tab-passive { background:transparent !important; color:#94a3b8 !important }
        .lm-submit:not(:disabled):hover { background:#1e40af !important }
        .lm-link { color:#3b82f6; background:none; border:none; cursor:pointer; font-family:${P}; font-size:13px; font-weight:600 }
        .lm-link:hover { text-decoration:underline }
      `}</style>

      {/* Backdrop */}
      <div
        ref={bgRef}
        onClick={e => e.target === bgRef.current && onClose()}
        style={{
          position: "fixed", inset: 0, zIndex: 700,
          background: "rgba(8,14,30,0.52)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "16px", animation: "mdFade .18s ease-out",
        }}
      >
        {/* Card */}
        <div style={{
          display: "grid", gridTemplateColumns: "210px 1fr",
          width: "100%", maxWidth: 640, borderRadius: 22, overflow: "hidden",
          background: "#fff",
          boxShadow: "0 24px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.05)",
          animation: "mdSlide .22s cubic-bezier(.16,1,.3,1)",
        }}>

          {/* ── LEFT ACCENT PANEL ── */}
          <div style={{
            background: "linear-gradient(175deg, #1e3a8a 0%, #1d4ed8 55%, #3b82f6 100%)",
            padding: "36px 22px", display: "flex", flexDirection: "column",
            justifyContent: "space-between", position: "relative", overflow: "hidden",
          }}>
            {/* decorative circles */}
            <div style={{ position:"absolute", top:-40, right:-40, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.06)" }}/>
            <div style={{ position:"absolute", bottom:-30, left:-20, width:90, height:90, borderRadius:"50%", background:"rgba(255,255,255,0.05)" }}/>

            <div style={{ position:"relative" }}>
              {/* site logo mark */}
              <div style={{
                width:44, height:44, borderRadius:12, marginBottom:28,
                background:"rgba(255,255,255,0.15)", backdropFilter:"blur(8px)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:22, border:"1px solid rgba(255,255,255,0.2)",
              }}>🔥</div>

              <p style={{ fontFamily:P, fontSize:30, lineHeight:1, marginBottom:10 }}>{prompt.emoji}</p>
              <h2 style={{ fontFamily:P, fontSize:16, fontWeight:700, color:"#fff", lineHeight:1.35, marginBottom:8 }}>
                {prompt.title}
              </h2>
              <p style={{ fontFamily:P, fontSize:12, color:"rgba(255,255,255,0.58)", lineHeight:1.65 }}>
                {prompt.sub}
              </p>
            </div>

            {/* trust line */}
            <div style={{ position:"relative" }}>
              <div style={{ width:28, height:2, background:"rgba(255,255,255,0.25)", borderRadius:99, marginBottom:10 }}/>
              <p style={{ fontFamily:P, fontSize:11, color:"rgba(255,255,255,0.30)", lineHeight:1.65 }}>
                Thousands of seekers.<br/>One community.
              </p>
            </div>
          </div>

          {/* ── RIGHT FORM PANEL ── */}
          <div style={{ padding:"30px 30px 26px", position:"relative", overflowY:"auto", maxHeight:"90vh" }}>

            {/* Close button */}
            <button onClick={onClose} style={{
              position:"absolute", top:14, right:14,
              width:28, height:28, borderRadius:"50%",
              background:"#f1f5f9", border:"none", cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", color:"#64748b",
            }}><X size={13}/></button>

            {/* ════ VIEW: CHECK EMAIL (after signup) ════ */}
            {view === "check-email" && (
              <div style={{ paddingTop:16, textAlign:"center" }}>
                <div style={{ fontSize:52, marginBottom:14 }}>📬</div>
                <h3 style={{ fontFamily:P, fontSize:18, fontWeight:700, color:"#0f172a", marginBottom:8 }}>Check your inbox</h3>
                <p style={{ fontFamily:P, fontSize:13, color:"#64748b", lineHeight:1.7, marginBottom:22 }}>
                  We sent a confirmation link to<br/><strong style={{ color:"#0f172a" }}>{email}</strong>.<br/>
                  Click it to activate your account, then come back here.
                </p>
                <button onClick={onClose} style={{ padding:"10px 28px", borderRadius:10, border:"none", cursor:"pointer", background:"#1d4ed8", color:"#fff", fontFamily:P, fontSize:13, fontWeight:600 }}>Got it</button>
                <p style={{ fontFamily:P, fontSize:12, color:"#94a3b8", marginTop:14 }}>
                  Didn't get it?{" "}
                  <button className="lm-link" onClick={() => { setView("main"); setTab("signup") }}>Try again</button>
                </p>
              </div>
            )}

            {/* ════ VIEW: CHECK EMAIL (after password reset) ════ */}
            {view === "check-reset" && (
              <div style={{ paddingTop:16, textAlign:"center" }}>
                <div style={{ fontSize:52, marginBottom:14 }}>🔑</div>
                <h3 style={{ fontFamily:P, fontSize:18, fontWeight:700, color:"#0f172a", marginBottom:8 }}>Reset link sent</h3>
                <p style={{ fontFamily:P, fontSize:13, color:"#64748b", lineHeight:1.7, marginBottom:22 }}>
                  Check your inbox at<br/><strong style={{ color:"#0f172a" }}>{email}</strong><br/>
                  and click the link to set a new password.
                </p>
                <button onClick={() => setView("main")} style={{ padding:"10px 28px", borderRadius:10, border:"none", cursor:"pointer", background:"#1d4ed8", color:"#fff", fontFamily:P, fontSize:13, fontWeight:600 }}>Back to sign in</button>
              </div>
            )}

            {/* ════ VIEW: FORGOT PASSWORD ════ */}
            {view === "forgot" && (
              <div style={{ paddingTop:4 }}>
                <button onClick={() => { setView("main"); setError("") }} style={{ display:"flex", alignItems:"center", gap:5, fontFamily:P, fontSize:12, color:"#64748b", background:"none", border:"none", cursor:"pointer", marginBottom:20 }}>
                  <ArrowLeft size={13}/> Back to sign in
                </button>
                <h3 style={{ fontFamily:P, fontSize:20, fontWeight:700, color:"#0f172a", marginBottom:4 }}>Forgot password?</h3>
                <p style={{ fontFamily:P, fontSize:13, color:"#64748b", marginBottom:20, lineHeight:1.5 }}>
                  Enter your email and we'll send you a reset link.
                </p>

                {error && <ErrorBanner msg={error}/>}
                {success && <SuccessBanner msg={success}/>}

                <input
                  value={email} onChange={e => setEmail(e.target.value)}
                  type="email" placeholder="Email address" style={iSt}
                  onFocus={focusBorder} onBlur={blurBorder}
                  onKeyDown={e => e.key === "Enter" && handleForgot()}
                />

                <button onClick={handleForgot} disabled={loading} className="lm-submit" style={{
                  width:"100%", marginTop:14, padding:"12px",
                  borderRadius:10, border:"none", cursor: loading?"not-allowed":"pointer",
                  background: loading?"#93c5fd":"#1d4ed8", color:"#fff",
                  fontFamily:P, fontSize:14, fontWeight:600,
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  transition:"background .15s",
                }}>
                  {loading ? <><Loader2 size={15} className="lm-spin"/> Sending…</> : "Send Reset Link"}
                </button>
              </div>
            )}

            {/* ════ VIEW: MAIN (login / signup) ════ */}
            {view === "main" && (
              <>
                {/* Pill tabs */}
                <div style={{ display:"flex", background:"#f1f5f9", borderRadius:11, padding:3, marginBottom:22 }}>
                  {[["login","Sign In"],["signup","Sign Up"]].map(([k,l]) => (
                    <button
                      key={k} onClick={() => setTab(k)}
                      className={tab===k ? "lm-tab-active" : "lm-tab-passive"}
                      style={{ flex:1, padding:"8px 0", fontFamily:P, fontSize:13, fontWeight:600, border:"none", borderRadius:9, cursor:"pointer", transition:"all .15s" }}
                    >{l}</button>
                  ))}
                </div>

                <h3 style={{ fontFamily:P, fontSize:19, fontWeight:700, color:"#0f172a", marginBottom:3 }}>
                  {tab === "login" ? "Welcome back" : "Create your account"}
                </h3>
                <p style={{ fontFamily:P, fontSize:13, color:"#64748b", marginBottom:18, lineHeight:1.5 }}>
                  {tab === "login" ? "Sign in to your Guruji Shrawan account." : "Free forever. No spam ever."}
                </p>

                {/* ── Google button ── */}
                <button onClick={handleGoogle} disabled={gLoading} className="lm-google" style={{
                  width:"100%", padding:"11px 16px", borderRadius:10,
                  border:"1.5px solid #e2e8f0", background:"#fff",
                  fontFamily:P, fontSize:14, fontWeight:600, color:"#0f172a",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                  cursor: gLoading?"not-allowed":"pointer", marginBottom:16,
                  transition:"background .15s",
                }}>
                  {gLoading
                    ? <Loader2 size={17} className="lm-spin" style={{ color:"#94a3b8" }}/>
                    : <GoogleIcon/>}
                  {tab === "login" ? "Continue with Google" : "Sign up with Google"}
                </button>

                {/* divider */}
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                  <div style={{ flex:1, height:1, background:"#e2e8f0" }}/>
                  <span style={{ fontFamily:P, fontSize:11, color:"#94a3b8", fontWeight:500, whiteSpace:"nowrap" }}>or continue with email</span>
                  <div style={{ flex:1, height:1, background:"#e2e8f0" }}/>
                </div>

                {/* error / success banners */}
                {error   && <ErrorBanner   msg={error}/>}
                {success && <SuccessBanner msg={success}/>}

                {/* Fields */}
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {tab === "signup" && (
                    <input value={name} onChange={e => setName(e.target.value)}
                      placeholder="Full name" style={iSt}
                      onFocus={focusBorder} onBlur={blurBorder}/>
                  )}
                  <input value={email} onChange={e => setEmail(e.target.value)}
                    type="email" placeholder="Email address" style={iSt}
                    onFocus={focusBorder} onBlur={blurBorder}
                    onKeyDown={e => e.key === "Enter" && !pw && document.getElementById("lm-pw")?.focus()}/>
                  <div style={{ position:"relative" }}>
                    <input id="lm-pw" value={pw} onChange={e => setPw(e.target.value)}
                      type={showPw?"text":"password"} placeholder="Password"
                      style={{ ...iSt, paddingRight:44 }}
                      onFocus={focusBorder} onBlur={blurBorder}
                      onKeyDown={e => e.key === "Enter" && handleSubmit()}/>
                    <button onClick={() => setShowPw(!showPw)} style={{
                      position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                      background:"none", border:"none", color:"#94a3b8", cursor:"pointer",
                      display:"flex", alignItems:"center",
                    }}>
                      {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                    </button>
                  </div>
                </div>

                {/* Forgot link */}
                {tab === "login" && (
                  <div style={{ textAlign:"right", marginTop:7 }}>
                    <button className="lm-link" onClick={() => { setView("forgot"); setError("") }}>
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Submit */}
                <button onClick={handleSubmit} disabled={loading} className="lm-submit" style={{
                  width:"100%", marginTop:16, padding:"12px",
                  borderRadius:10, border:"none",
                  cursor: loading?"not-allowed":"pointer",
                  background: loading?"#93c5fd":"#1d4ed8",
                  color:"#fff", fontFamily:P, fontSize:14, fontWeight:600,
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  transition:"background .15s",
                }}>
                  {loading
                    ? <><Loader2 size={15} className="lm-spin"/> Please wait…</>
                    : tab === "login" ? "Sign In →" : "Create Account →"}
                </button>

                {/* Switch tab */}
                <p style={{ fontFamily:P, fontSize:12, color:"#94a3b8", textAlign:"center", marginTop:14 }}>
                  {tab === "login" ? "Don't have an account? " : "Already have an account? "}
                  <button className="lm-link" onClick={() => setTab(tab==="login"?"signup":"login")}>
                    {tab === "login" ? "Sign up free" : "Sign in"}
                  </button>
                </p>

                {/* Legal */}
                <p style={{ fontFamily:P, fontSize:10.5, color:"#b0bec5", textAlign:"center", marginTop:12, lineHeight:1.6 }}>
                  By continuing you agree to our{" "}
                  <a href="/terms" style={{ color:"#94a3b8" }}>Terms</a> &{" "}
                  <a href="/privacy" style={{ color:"#94a3b8" }}>Privacy Policy</a>.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

/* ── small banner helpers ── */
function ErrorBanner({ msg }) {
  return (
    <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:9, padding:"9px 13px", marginBottom:13, fontFamily:P, fontSize:13, color:"#dc2626", display:"flex", alignItems:"flex-start", gap:7 }}>
      <span style={{ marginTop:1 }}>⚠️</span> {msg}
    </div>
  )
}
function SuccessBanner({ msg }) {
  return (
    <div style={{ background:"#f0fdf4", border:"1px solid #86efac", borderRadius:9, padding:"9px 13px", marginBottom:13, fontFamily:P, fontSize:13, color:"#16a34a", display:"flex", alignItems:"flex-start", gap:7 }}>
      <Check size={14} style={{ marginTop:1, flexShrink:0 }}/> {msg}
    </div>
  )
}