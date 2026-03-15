"use client"

import { useEffect, useRef, useState } from "react"
import { supabase } from "../../lib/supabaseClient"

/*
  LoginModal.jsx — Guruji Shrawan theme

  Props:
    open      {boolean}
    onClose   {function}
    onSuccess {function(user)}  — called after successful auth
    reason    {"like"|"comment"|"save"|"reply"|null}
    message   {string}         — optional custom subtitle

  Usage:
    import LoginModal from "@/app/components/LoginModal"
    <LoginModal open={show} onClose={() => setShow(false)} onSuccess={(u) => console.log(u)} />
*/

const PROMPTS = {
  like:    { emoji: "♡",  title: "Like this article",   sub: "Show appreciation for content you love."      },
  comment: { emoji: "💬", title: "Join the discussion",  sub: "Share your thoughts with the community."     },
  save:    { emoji: "🔖", title: "Save for later",       sub: "Build your personal reading list."           },
  reply:   { emoji: "↩",  title: "Reply to a comment",  sub: "Continue the conversation."                  },
  default: { emoji: "🔥", title: "Welcome Back",         sub: "Join thousands of seekers on this journey." },
}

/* ── Google coloured SVG ── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

/* ── Eye open/closed icon ── */
function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

/* ── Loading spinner ── */
function Spinner() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24" fill="none"
      aria-hidden="true"
      style={{ animation: "lm-spin .8s linear infinite", flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.3)" strokeWidth="3"/>
      <path d="M12 2a10 10 0 0110 10" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
export default function LoginModal({ open, onClose, onSuccess, reason = null, message }) {
  const [view,   setView]   = useState("main")     // "main" | "forgot" | "check-email" | "check-reset"
  const [tab,    setTab]    = useState("login")    // "login" | "signup"
  const [name,   setName]   = useState("")
  const [email,  setEmail]  = useState("")
  const [pw,     setPw]     = useState("")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [gLoad,  setGLoad]  = useState(false)
  const [error,  setError]  = useState("")

  const backdropRef = useRef(null)

  /* ── Reset everything when modal opens ── */
  useEffect(() => {
    if (!open) return
    setView("main")
    setTab("login")
    setName(""); setEmail(""); setPw("")
    setError(""); setLoading(false); setGLoad(false); setShowPw(false)
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [open])

  /* ── Clear error when user edits fields ── */
  useEffect(() => { setError("") }, [tab, email, pw, name])

  /* ── Escape key closes modal ── */
  useEffect(() => {
    if (!open) return
    const fn = (e) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", fn)
    return () => window.removeEventListener("keydown", fn)
  }, [open, onClose])

  if (!open) return null

  const prompt = PROMPTS[reason] || PROMPTS.default

  /* ── Google OAuth ── */
  async function handleGoogle() {
    setGLoad(true); setError("")
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:  `${window.location.origin}/auth/callback`,
        queryParams: { prompt: "select_account" },
      },
    })
    if (err) { setError(err.message); setGLoad(false) }
    // on success Supabase redirects — nothing else needed here
  }

  /* ── Email + password submit ── */
  async function handleSubmit() {
    if (!email.trim()) { setError("Email is required."); return }
    if (!pw.trim())    { setError("Password is required."); return }
    if (tab === "signup" && pw.length < 6) {
      setError("Password must be at least 6 characters."); return
    }
    setLoading(true); setError("")

    if (tab === "login") {
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email: email.trim(), password: pw,
      })
      setLoading(false)
      if (err) { setError(err.message); return }
      onSuccess && onSuccess(data.user)
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
      // If email confirmation is OFF in Supabase, session is returned immediately
      if (data.session) {
        onSuccess && onSuccess(data.user)
        onClose()
      } else {
        setView("check-email")
      }
    }
  }

  /* ── Forgot password ── */
  async function handleForgot() {
    if (!email.trim()) { setError("Enter your email address first."); return }
    setLoading(true); setError("")
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/reset`,
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    setView("check-reset")
  }

  /* ══════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════ */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Poppins:wght@300;400;500;600;700&display=swap');

        :root {
          --lm-o:    #c8551a;
          --lm-g:    #b8841a;
          --lm-bg:   #faf7f2;
          --lm-bg2:  #f4efe6;
          --lm-bdr:  #e8ddd0;
          --lm-bdr2: #d8c9b8;
          --lm-txt:  #1a1008;
          --lm-mut:  #8a7a6a;
          --lm-sans: 'Poppins', system-ui, sans-serif;
          --lm-serif:'Lora', Georgia, serif;
        }

        @keyframes lm-fade  { from { opacity: 0 }                                        to { opacity: 1 } }
        @keyframes lm-up    { from { opacity: 0; transform: translateY(36px) scale(.97) } to { opacity: 1; transform: none } }
        @keyframes lm-pop   { from { opacity: 0; transform: scale(.95) }                  to { opacity: 1; transform: scale(1) } }
        @keyframes lm-spin  { to   { transform: rotate(360deg) } }
        @keyframes lm-shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-5px)} 40%,80%{transform:translateX(5px)} }

        /* ── backdrop ── */
        .lm-bd {
          position: fixed; inset: 0; z-index: 2000;
          background: rgba(20, 12, 4, .65);
          backdrop-filter: blur(12px) saturate(1.2);
          display: flex; align-items: flex-end; justify-content: center;
          padding: 0;
          animation: lm-fade .2s ease;
        }
        @media (min-width: 600px) {
          .lm-bd { align-items: center; padding: 20px; }
        }

        /* ── card wrapper ── */
        .lm-card {
          width: 100%; max-width: 560px;
          background: #fff;
          border-radius: 22px 22px 0 0;
          border: 1.5px solid var(--lm-bdr); border-bottom: none;
          overflow: hidden;
          box-shadow: 0 -12px 56px rgba(26, 16, 8, .16);
          animation: lm-up .26s cubic-bezier(.25,.46,.45,.94);
          display: flex; flex-direction: column;
        }
        @media (min-width: 600px) {
          .lm-card {
            border-radius: 22px;
            border: 1.5px solid var(--lm-bdr); border-bottom: 1.5px solid var(--lm-bdr);
            flex-direction: row;
            max-height: 92vh;
            box-shadow: 0 28px 72px rgba(26, 16, 8, .22), 0 0 0 1px rgba(232,221,208,.4);
            animation: lm-pop .22s cubic-bezier(.25,.46,.45,.94);
          }
        }

        /* ── left accent panel — hidden on mobile ── */
        .lm-left { display: none; }
        @media (min-width: 600px) {
          .lm-left {
            display: flex; flex-direction: column; justify-content: space-between;
            width: 210px; flex-shrink: 0;
            background: linear-gradient(170deg, #1a1008 0%, #2d1608 55%, #1a1008 100%);
            padding: 32px 22px 28px;
            position: relative; overflow: hidden;
          }
          .lm-left::before {
            content: ''; position: absolute; top: -50px; right: -50px;
            width: 150px; height: 150px; border-radius: 50%;
            background: radial-gradient(circle, rgba(200,85,26,.25), transparent 70%);
            pointer-events: none;
          }
          .lm-left::after {
            content: 'ॐ'; position: absolute; bottom: -40px; left: -10px;
            font-size: 190px; color: rgba(255,255,255,.025);
            font-family: serif; pointer-events: none; user-select: none; line-height: 1;
          }
        }

        /* left panel inner elements */
        .lm-left-top  { position: relative; z-index: 1; }
        .lm-left-logo {
          width: 42px; height: 42px; border-radius: 12px; margin-bottom: 24px;
          background: rgba(200,85,26,.22); border: 1px solid rgba(200,85,26,.38);
          display: flex; align-items: center; justify-content: center; font-size: 20px;
        }
        .lm-left-emoji { font-size: 26px; margin-bottom: 10px; display: block; }
        .lm-left-title {
          font-family: var(--lm-serif); font-size: 16px; font-weight: 700;
          color: #fff; line-height: 1.35; margin-bottom: 8px;
        }
        .lm-left-sub {
          font-family: var(--lm-sans); font-size: 12px;
          color: rgba(255,255,255,.48); line-height: 1.65;
        }
        .lm-left-bottom { position: relative; z-index: 1; }
        .lm-left-rule {
          width: 28px; height: 2px; border-radius: 99px;
          background: rgba(255,255,255,.18); margin-bottom: 10px;
        }
        .lm-left-tagline {
          font-family: var(--lm-sans); font-size: 11px;
          color: rgba(255,255,255,.26); line-height: 1.65;
        }

        /* ── right / form panel ── */
        .lm-right {
          flex: 1; padding: 20px 22px 24px;
          overflow-y: auto; position: relative;
          background: #fff;
          max-height: 92svh;
          scrollbar-width: thin; scrollbar-color: var(--lm-bdr) transparent;
        }
        @media (min-width: 600px) {
          .lm-right { padding: 28px 26px 24px; max-height: none; }
        }

        /* ── close button ── */
        .lm-close {
          position: absolute; top: 14px; right: 14px;
          width: 28px; height: 28px; border-radius: 50%;
          background: var(--lm-bg); border: 1.5px solid var(--lm-bdr);
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          color: var(--lm-mut); font-size: 13px; line-height: 1;
          transition: background .18s, color .18s, border-color .18s;
          z-index: 2;
        }
        .lm-close:hover { background: var(--lm-bg2); color: var(--lm-txt); border-color: var(--lm-bdr2); }

        /* ── tab pills ── */
        .lm-tabs {
          display: flex; background: var(--lm-bg); border-radius: 11px;
          padding: 3px; margin-bottom: 20px;
        }
        .lm-tab {
          flex: 1; padding: 8px 0;
          font-family: var(--lm-sans); font-size: 13px; font-weight: 600;
          border: none; border-radius: 9px; cursor: pointer;
          transition: all .15s;
        }
        .lm-tab-on  { background: #fff; color: var(--lm-txt); box-shadow: 0 1px 4px rgba(26,16,8,.1); }
        .lm-tab-off { background: transparent; color: var(--lm-mut); }
        .lm-tab-off:hover { color: var(--lm-txt); }

        /* ── headings ── */
        .lm-h3 {
          font-family: var(--lm-serif); font-size: 19px; font-weight: 700;
          color: var(--lm-txt); margin-bottom: 4px; line-height: 1.2;
        }
        .lm-p {
          font-family: var(--lm-sans); font-size: 13px; color: var(--lm-mut);
          margin-bottom: 18px; line-height: 1.55;
        }

        /* ── Google button ── */
        .lm-g-btn {
          width: 100%; padding: 11px 16px; border-radius: 11px;
          border: 1.5px solid var(--lm-bdr); background: #fff;
          font-family: var(--lm-sans); font-size: 14px; font-weight: 600; color: var(--lm-txt);
          display: flex; align-items: center; justify-content: center; gap: 10px;
          cursor: pointer; margin-bottom: 16px;
          transition: border-color .18s, background .18s, box-shadow .18s;
        }
        .lm-g-btn:hover:not(:disabled) {
          border-color: var(--lm-bdr2); background: var(--lm-bg);
          box-shadow: 0 2px 10px rgba(26,16,8,.07);
        }
        .lm-g-btn:disabled { opacity: .6; cursor: not-allowed; }

        /* ── divider ── */
        .lm-or {
          display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
          font-family: var(--lm-sans); font-size: 10px; font-weight: 700;
          color: var(--lm-bdr2); text-transform: uppercase; letter-spacing: .14em;
        }
        .lm-or::before, .lm-or::after {
          content: ''; flex: 1; height: 1px; background: var(--lm-bdr);
        }

        /* ── inputs ── */
        .lm-fields { display: flex; flex-direction: column; gap: 10px; margin-bottom: 4px; }
        .lm-input {
          width: 100%; padding: 11px 14px; border-radius: 10px;
          border: 1.5px solid var(--lm-bdr); background: var(--lm-bg);
          font-family: var(--lm-sans); font-size: 14px; color: var(--lm-txt);
          outline: none; transition: border-color .18s, box-shadow .18s;
          box-sizing: border-box;
        }
        .lm-input:focus { border-color: rgba(200,85,26,.6); box-shadow: 0 0 0 3px rgba(200,85,26,.1); }
        .lm-input::placeholder { color: #c0b0a0; }

        /* password wrapper */
        .lm-pw-wrap { position: relative; }
        .lm-pw-wrap .lm-input { padding-right: 44px; }
        .lm-pw-toggle {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: var(--lm-mut); cursor: pointer;
          display: flex; align-items: center; padding: 2px;
          transition: color .18s;
        }
        .lm-pw-toggle:hover { color: var(--lm-txt); }

        /* ── forgot link ── */
        .lm-forgot {
          display: block; text-align: right; margin-top: 7px;
          font-family: var(--lm-sans); font-size: 12px; font-weight: 600;
          color: var(--lm-o); background: none; border: none; cursor: pointer;
          padding: 0; transition: opacity .18s;
        }
        .lm-forgot:hover { opacity: .72; }

        /* ── submit button ── */
        .lm-submit {
          width: 100%; margin-top: 16px; padding: 13px; border-radius: 11px;
          border: none; cursor: pointer;
          background: linear-gradient(135deg, var(--lm-o), #8a2e06);
          color: #fff; font-family: var(--lm-sans); font-size: 14px; font-weight: 700;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 5px 18px rgba(200,85,26,.3);
          transition: transform .18s, box-shadow .18s, opacity .18s;
        }
        .lm-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(200,85,26,.42); }
        .lm-submit:active:not(:disabled) { transform: scale(.97); }
        .lm-submit:disabled { opacity: .5; cursor: not-allowed; transform: none; }

        /* ── back button ── */
        .lm-back {
          display: inline-flex; align-items: center; gap: 5px;
          font-family: var(--lm-sans); font-size: 12px; font-weight: 600;
          color: var(--lm-mut); background: none; border: none; cursor: pointer;
          padding: 0; margin-bottom: 18px; transition: color .18s;
        }
        .lm-back:hover { color: var(--lm-o); }

        /* ── switch tab / link ── */
        .lm-switch {
          font-family: var(--lm-sans); font-size: 12px; color: var(--lm-mut);
          text-align: center; margin-top: 14px;
        }
        .lm-link-btn {
          background: none; border: none; cursor: pointer;
          font-family: var(--lm-sans); font-size: 12px; font-weight: 700;
          color: var(--lm-o); padding: 0; transition: opacity .18s;
        }
        .lm-link-btn:hover { opacity: .72; }

        /* ── legal ── */
        .lm-legal {
          font-family: var(--lm-sans); font-size: 10.5px; color: #b0a090;
          text-align: center; margin-top: 12px; line-height: 1.65;
        }
        .lm-legal a { color: #9a8a7a; text-decoration: none; }
        .lm-legal a:hover { color: var(--lm-o); }

        /* ── error banner ── */
        .lm-err {
          background: #fef3ee; border: 1px solid rgba(200,85,26,.25); border-radius: 9px;
          padding: 9px 12px; margin-bottom: 13px;
          font-family: var(--lm-sans); font-size: 12px; font-weight: 600;
          color: #c8320a; display: flex; align-items: flex-start; gap: 7px;
          animation: lm-shake .3s ease;
        }

        /* ── info screens ── */
        .lm-info { padding: 8px 0; text-align: center; }
        .lm-info-icon { font-size: 48px; display: block; margin-bottom: 14px; }
        .lm-info-title {
          font-family: var(--lm-serif); font-size: 20px; font-weight: 700;
          color: var(--lm-txt); margin-bottom: 8px;
        }
        .lm-info-body {
          font-family: var(--lm-sans); font-size: 13px; color: var(--lm-mut);
          line-height: 1.7; margin-bottom: 22px;
        }
        .lm-info-body strong { color: var(--lm-txt); font-weight: 700; }
        .lm-info-btn {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 11px 28px; border-radius: 10px; border: none; cursor: pointer;
          background: linear-gradient(135deg, var(--lm-o), #8a2e06);
          color: #fff; font-family: var(--lm-sans); font-size: 13px; font-weight: 700;
          box-shadow: 0 4px 16px rgba(200,85,26,.3);
          transition: transform .18s, box-shadow .18s;
        }
        .lm-info-btn:hover { transform: translateY(-1px); box-shadow: 0 7px 22px rgba(200,85,26,.42); }
        .lm-info-hint {
          font-family: var(--lm-sans); font-size: 12px; color: var(--lm-mut); margin-top: 14px;
        }

        /* ── google-loading spinner (inside g-btn) ── */
        .lm-g-spin {
          animation: lm-spin .8s linear infinite;
        }
      `}</style>

      {/* ── Backdrop ── */}
      <div
        className="lm-bd"
        ref={backdropRef}
        onClick={(e) => { if (e.target === backdropRef.current) onClose() }}
        role="dialog"
        aria-modal="true"
        aria-label="Sign in"
      >
        <div className="lm-card">

          {/* ════ LEFT ACCENT PANEL (desktop only) ════ */}
          <div className="lm-left" aria-hidden="true">
            <div className="lm-left-top">
              <div className="lm-left-logo">🔥</div>
              <span className="lm-left-emoji">{prompt.emoji}</span>
              <p className="lm-left-title">{prompt.title}</p>
              <p className="lm-left-sub">{prompt.sub}</p>
            </div>
            <div className="lm-left-bottom">
              <div className="lm-left-rule" />
              <p className="lm-left-tagline">Thousands of seekers.<br />One community.</p>
            </div>
          </div>

          {/* ════ RIGHT FORM PANEL ════ */}
          <div className="lm-right">

            {/* Close button */}
            <button className="lm-close" onClick={onClose} aria-label="Close">✕</button>

            {/* ── VIEW: after signup — check email ── */}
            {view === "check-email" && (
              <div className="lm-info">
                <span className="lm-info-icon">📬</span>
                <h2 className="lm-info-title">Check your inbox</h2>
                <p className="lm-info-body">
                  We sent a confirmation link to<br />
                  <strong>{email}</strong>.<br />
                  Click it to activate your account.
                </p>
                <button className="lm-info-btn" onClick={onClose}>Got it</button>
                <p className="lm-info-hint">
                  Didn&apos;t get it?{" "}
                  <button className="lm-link-btn" onClick={() => { setView("main"); setTab("signup") }}>
                    Try again
                  </button>
                </p>
              </div>
            )}

            {/* ── VIEW: after forgot password ── */}
            {view === "check-reset" && (
              <div className="lm-info">
                <span className="lm-info-icon">🔑</span>
                <h2 className="lm-info-title">Reset link sent</h2>
                <p className="lm-info-body">
                  Check your inbox at<br />
                  <strong>{email}</strong><br />
                  and click the link to set a new password.
                </p>
                <button className="lm-info-btn" onClick={() => { setView("main"); setError("") }}>
                  Back to Sign In
                </button>
              </div>
            )}

            {/* ── VIEW: forgot password form ── */}
            {view === "forgot" && (
              <>
                <button className="lm-back" onClick={() => { setView("main"); setError("") }}>
                  ← Back to sign in
                </button>
                <h2 className="lm-h3">Forgot password?</h2>
                <p className="lm-p">Enter your email and we&apos;ll send a reset link.</p>

                {error && (
                  <div className="lm-err" role="alert">⚠ {error}</div>
                )}

                <input
                  className="lm-input"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleForgot()}
                  autoComplete="email"
                  autoFocus
                />

                <button className="lm-submit" onClick={handleForgot} disabled={loading} type="button">
                  {loading ? <><Spinner /> Sending…</> : "Send Reset Link"}
                </button>
              </>
            )}

            {/* ── VIEW: main login / signup ── */}
            {view === "main" && (
              <>
                {/* Tab pills */}
                <div className="lm-tabs">
                  <button
                    className={`lm-tab ${tab === "login" ? "lm-tab-on" : "lm-tab-off"}`}
                    onClick={() => setTab("login")}
                    type="button"
                  >
                    Sign In
                  </button>
                  <button
                    className={`lm-tab ${tab === "signup" ? "lm-tab-on" : "lm-tab-off"}`}
                    onClick={() => setTab("signup")}
                    type="button"
                  >
                    Sign Up
                  </button>
                </div>

                <h2 className="lm-h3">
                  {tab === "login" ? "Welcome back" : "Create your account"}
                </h2>
                <p className="lm-p">
                  {message
                    ? message
                    : tab === "login"
                      ? "Sign in to your Guruji Shrawan account."
                      : "Free forever. No spam, ever."}
                </p>

                {/* Google */}
                <button
                  className="lm-g-btn"
                  onClick={handleGoogle}
                  disabled={gLoad}
                  type="button"
                >
                  {gLoad
                    ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="lm-g-spin" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" stroke="var(--lm-bdr)" strokeWidth="3" />
                        <path d="M12 2a10 10 0 0110 10" stroke="var(--lm-o)" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    )
                    : <GoogleIcon />
                  }
                  {tab === "login" ? "Continue with Google" : "Sign up with Google"}
                </button>

                <div className="lm-or">or continue with email</div>

                {error && (
                  <div className="lm-err" role="alert">⚠ {error}</div>
                )}

                {/* Fields */}
                <div className="lm-fields">
                  {tab === "signup" && (
                    <input
                      className="lm-input"
                      type="text"
                      placeholder="Full name (optional)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                    />
                  )}

                  <input
                    className="lm-input"
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const pwInput = document.getElementById("lm-pw-input")
                        if (pwInput) pwInput.focus()
                      }
                    }}
                    autoComplete="email"
                  />

                  <div className="lm-pw-wrap">
                    <input
                      id="lm-pw-input"
                      className="lm-input"
                      type={showPw ? "text" : "password"}
                      placeholder="Password"
                      value={pw}
                      onChange={(e) => setPw(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      autoComplete={tab === "login" ? "current-password" : "new-password"}
                    />
                    <button
                      className="lm-pw-toggle"
                      onClick={() => setShowPw((s) => !s)}
                      type="button"
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      <EyeIcon open={showPw} />
                    </button>
                  </div>
                </div>

                {/* Forgot password link */}
                {tab === "login" && (
                  <button
                    className="lm-forgot"
                    onClick={() => { setView("forgot"); setError("") }}
                    type="button"
                  >
                    Forgot password?
                  </button>
                )}

                {/* Submit */}
                <button
                  className="lm-submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  type="button"
                >
                  {loading
                    ? <><Spinner /> Please wait…</>
                    : tab === "login" ? "Sign In →" : "Create Account →"
                  }
                </button>

                {/* Switch tab */}
                <p className="lm-switch">
                  {tab === "login" ? "Don't have an account? " : "Already have an account? "}
                  <button
                    className="lm-link-btn"
                    onClick={() => setTab(tab === "login" ? "signup" : "login")}
                    type="button"
                  >
                    {tab === "login" ? "Sign up free" : "Sign in"}
                  </button>
                </p>

                {/* Legal */}
                <p className="lm-legal">
                  By continuing you agree to our{" "}
                  <a href="/terms" target="_blank" rel="noopener noreferrer">Terms</a>
                  {" & "}
                  <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}