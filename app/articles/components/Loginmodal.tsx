"use client"

import { useEffect, useRef, useState } from "react"
import { FaTimes, FaGoogle, FaEnvelope, FaCheck, FaArrowLeft } from "react-icons/fa"
import { supabase } from "../../lib/supabaseClient"

/* ══════════════════════════════════════════════
   LoginModal — fully responsive, accessible
   — Mobile: slides up as a bottom sheet
   — Desktop: centered card
   — Supports: OTP (magic link) + Google OAuth
   — Usage:
       import LoginModal from "@/components/LoginModal"
       <LoginModal open={showLogin} onClose={() => setShowLogin(false)} onSuccess={() => { ... }} />
══════════════════════════════════════════════ */

type Step = "choose" | "email" | "otp" | "done"

interface Props {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
  message?: string  // optional contextual message e.g. "Sign in to save this article"
}

export default function LoginModal({ open, onClose, onSuccess, message }: Props) {
  const [step,    setStep]    = useState<Step>("choose")
  const [email,   setEmail]   = useState("")
  const [otp,     setOtp]     = useState("")
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState("")
  const dialogRef = useRef<HTMLDivElement>(null)
  const firstFocusRef = useRef<HTMLButtonElement>(null)

  /* Reset state when opened */
  useEffect(() => {
    if (open) {
      setStep("choose"); setEmail(""); setOtp(""); setError(""); setLoading(false)
      // lock scroll
      document.body.style.overflow = "hidden"
      // focus first element
      setTimeout(() => firstFocusRef.current?.focus(), 80)
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [open])

  /* Trap focus inside modal */
  useEffect(() => {
    if (!open) return
    function trapFocus(e: KeyboardEvent) {
      if (e.key === "Escape") { onClose(); return }
      if (e.key !== "Tab") return
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, input, a, [tabindex]:not([tabindex="-1"])'
      )
      if (!focusable?.length) return
      const first = focusable[0], last = focusable[focusable.length - 1]
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault()
        ;(e.shiftKey ? last : first).focus()
      }
    }
    document.addEventListener("keydown", trapFocus)
    return () => document.removeEventListener("keydown", trapFocus)
  }, [open, onClose])

  if (!open) return null

  async function handleGoogle() {
    setLoading(true); setError("")
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (err) { setError(err.message); setLoading(false) }
  }

  async function sendOtp() {
    if (!email.trim()) return setError("Please enter a valid email address.")
    setLoading(true); setError("")
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true },
    })
    setLoading(false)
    if (err) setError(err.message)
    else setStep("otp")
  }

  async function verifyOtp() {
    if (otp.trim().length < 6) return setError("Enter the 6-digit code from your email.")
    setLoading(true); setError("")
    const { error: err } = await supabase.auth.verifyOtp({
      email: email.trim(), token: otp.trim(), type: "email",
    })
    setLoading(false)
    if (err) setError(err.message)
    else { setStep("done"); setTimeout(() => { onSuccess?.(); onClose() }, 1400) }
  }

  return (
    <>
      <style>{`
        @keyframes lm-in     { from{opacity:0} to{opacity:1} }
        @keyframes lm-up     { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes lm-center { from{opacity:0;transform:scale(.95)} to{opacity:1;transform:scale(1)} }
        @keyframes lm-check  { 0%{transform:scale(0)} 70%{transform:scale(1.2)} 100%{transform:scale(1)} }

        .lm-backdrop {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(26,16,8,.62);
          backdrop-filter: blur(10px);
          display: flex; align-items: flex-end; justify-content: center;
          padding: 0;
          animation: lm-in .18s ease;
        }
        /* desktop: center */
        @media (min-width: 600px) {
          .lm-backdrop { align-items: center; padding: 20px; }
        }

        .lm-card {
          background: #fff;
          border-radius: 20px 20px 0 0;
          width: 100%; max-width: 440px;
          padding: 12px 24px 32px;
          border: 1.5px solid #e8ddd0; border-bottom: none;
          box-shadow: 0 -8px 40px rgba(26,16,8,.12);
          animation: lm-up .24s ease;
          position: relative;
          outline: none;
        }
        @media (min-width: 600px) {
          .lm-card {
            border-radius: 20px;
            border: 1.5px solid #e8ddd0;
            padding: 36px;
            animation: lm-center .22s ease;
          }
        }

        /* handle (mobile only) */
        .lm-handle {
          width: 36px; height: 4px; border-radius: 2px;
          background: #e8ddd0; margin: 0 auto 20px;
        }
        @media (min-width: 600px) { .lm-handle { display: none; } }

        .lm-close {
          position: absolute; top: 14px; right: 14px;
          width: 32px; height: 32px; border-radius: 50%;
          border: 1.5px solid #e8ddd0; background: #faf7f2;
          cursor: pointer; display: flex; align-items: center;
          justify-content: center; color: #8a7a6a;
          transition: background .2s, color .2s;
        }
        .lm-close:hover { background: #f0e8dc; color: #1a1008; }

        .lm-logo {
          width: 52px; height: 52px; border-radius: 14px;
          background: linear-gradient(135deg, #c8551a, #8a2e06);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
          font-family: 'Lora', serif; font-size: 18px; font-weight: 700;
          color: #fff; letter-spacing: -.02em;
        }
        .lm-title {
          font-family: 'Lora', Georgia, serif; font-size: 22px; font-weight: 700;
          color: #1a1008; text-align: center; line-height: 1.2; margin-bottom: 6px;
        }
        .lm-sub {
          font-size: 13px; color: #8a7a6a; text-align: center;
          line-height: 1.65; margin-bottom: 24px;
        }
        .lm-sub strong { color: #c8551a; }

        /* Google button */
        .lm-google-btn {
          width: 100%; display: flex; align-items: center; justify-content: center;
          gap: 10px; padding: 13px; border-radius: 12px;
          border: 1.5px solid #e8ddd0; background: #fff;
          font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 600;
          color: #1a1008; cursor: pointer;
          transition: border-color .2s, background .2s, box-shadow .2s;
          margin-bottom: 10px;
        }
        .lm-google-btn:hover { border-color: #d8c9b8; background: #faf7f2; box-shadow: 0 2px 12px rgba(26,16,8,.08); }
        .lm-google-btn:disabled { opacity: .6; cursor: not-allowed; }
        .lm-google-ico {
          width: 20px; height: 20px; flex-shrink: 0;
        }

        /* divider */
        .lm-or {
          display: flex; align-items: center; gap: 12px;
          margin: 14px 0; color: #c8bdaf; font-size: 11px; font-weight: 600;
          text-transform: uppercase; letter-spacing: .14em;
        }
        .lm-or::before,.lm-or::after {
          content: ''; flex: 1; height: 1px; background: #e8ddd0;
        }

        /* email / OTP button */
        .lm-email-btn {
          width: 100%; display: flex; align-items: center; justify-content: center;
          gap: 8px; padding: 13px; border-radius: 12px;
          border: 1.5px solid #e8ddd0; background: #faf7f2;
          font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 600;
          color: #8a7a6a; cursor: pointer;
          transition: border-color .2s, background .2s;
        }
        .lm-email-btn:hover { border-color: rgba(200,85,26,.4); color: #c8551a; background: rgba(200,85,26,.05); }

        /* input */
        .lm-input-label {
          font-size: 10px; font-weight: 700; text-transform: uppercase;
          letter-spacing: .16em; color: #8a7a6a; margin-bottom: 6px; display: block;
        }
        .lm-input {
          width: 100%; background: #faf7f2; border: 1.5px solid #e8ddd0;
          border-radius: 10px; padding: 12px 14px;
          font-family: 'Poppins', sans-serif; font-size: 14px; color: #1a1008;
          outline: none; transition: border-color .2s, box-shadow .2s;
          margin-bottom: 10px;
        }
        .lm-input:focus { border-color: rgba(200,85,26,.6); box-shadow: 0 0 0 3px rgba(200,85,26,.1); }
        .lm-input::placeholder { color: #c8bdaf; }

        /* OTP input — large monospace */
        .lm-otp-input {
          text-align: center; font-size: 28px; font-weight: 700;
          letter-spacing: .4em; padding: 14px 10px;
          font-family: 'Poppins', monospace;
        }

        .lm-error {
          font-size: 12px; color: #c8320a; font-weight: 600;
          margin-bottom: 10px; background: rgba(200,50,10,.07);
          border: 1px solid rgba(200,50,10,.2); border-radius: 8px;
          padding: 9px 12px; display: flex; align-items: center; gap: 7px;
        }

        .lm-submit {
          width: 100%; padding: 13px; border-radius: 12px;
          background: linear-gradient(135deg, #c8551a, #8a2e06);
          color: #fff; border: none; cursor: pointer;
          font-family: 'Poppins', sans-serif; font-size: 14px; font-weight: 700;
          box-shadow: 0 4px 18px rgba(200,85,26,.3);
          transition: transform .2s, box-shadow .2s;
          margin-top: 4px;
        }
        .lm-submit:hover { transform: translateY(-1px); box-shadow: 0 7px 24px rgba(200,85,26,.42); }
        .lm-submit:disabled { opacity: .55; cursor: not-allowed; transform: none; }

        .lm-back {
          display: flex; align-items: center; gap: 6px; margin-bottom: 16px;
          background: none; border: none; cursor: pointer;
          font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600;
          color: #8a7a6a; padding: 0; transition: color .2s;
        }
        .lm-back:hover { color: #c8551a; }

        /* success */
        .lm-success {
          text-align: center; padding: 16px 0 8px;
        }
        .lm-success-icon {
          width: 64px; height: 64px; border-radius: 50%;
          background: linear-gradient(135deg, #c8551a, #8a2e06);
          margin: 0 auto 16px;
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 26px;
          animation: lm-check .4s ease;
        }
        .lm-success-title {
          font-family: 'Lora', serif; font-size: 20px; font-weight: 700;
          color: #1a1008; margin-bottom: 6px;
        }
        .lm-success-sub { font-size: 13px; color: #8a7a6a; line-height: 1.65; }

        .lm-hint {
          font-size: 11px; color: #b0a090; text-align: center; margin-top: 16px; line-height: 1.6;
        }
        .lm-hint a { color: #c8551a; text-decoration: none; }
        .lm-hint a:hover { text-decoration: underline; }
      `}</style>

      {/* Backdrop */}
      <div
        className="lm-backdrop"
        onClick={e => { if (e.target === e.currentTarget) onClose() }}
        role="dialog"
        aria-modal="true"
        aria-label="Sign in to Guruji Shrawan"
      >
        <div
          className="lm-card"
          ref={dialogRef}
          tabIndex={-1}
        >
          <div className="lm-handle" aria-hidden="true" />

          <button className="lm-close" onClick={onClose} aria-label="Close sign in dialog">
            <FaTimes size={11} />
          </button>

          {/* Logo */}
          <div className="lm-logo" aria-hidden="true">GS</div>

          {step === "done" ? (
            <div className="lm-success" role="status" aria-live="polite">
              <div className="lm-success-icon"><FaCheck /></div>
              <h2 className="lm-success-title">You're signed in!</h2>
              <p className="lm-success-sub">Welcome back. Redirecting you now…</p>
            </div>
          ) : (
            <>
              <h2 className="lm-title">
                {step === "choose" ? "Sign in" : step === "email" ? "Continue with Email" : "Check your inbox"}
              </h2>
              <p className="lm-sub">
                {message
                  ? <><strong>{message}</strong><br/>Sign in to continue.</>
                  : step === "choose"
                    ? "Save articles, like videos and personalise your experience."
                    : step === "email"
                      ? "We'll send a one-time code to your email — no password needed."
                      : <>We sent a 6-digit code to <strong>{email}</strong>. Enter it below.</>
                }
              </p>

              {step === "choose" && (
                <>
                  {/* Google */}
                  <button
                    ref={firstFocusRef}
                    className="lm-google-btn"
                    onClick={handleGoogle}
                    disabled={loading}
                    type="button"
                  >
                    {/* Google SVG icon */}
                    <svg className="lm-google-ico" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>

                  <div className="lm-or">or</div>

                  {/* Email OTP */}
                  <button
                    className="lm-email-btn"
                    onClick={() => setStep("email")}
                    type="button"
                  >
                    <FaEnvelope size={14} /> Continue with Email
                  </button>
                </>
              )}

              {step === "email" && (
                <>
                  <button className="lm-back" onClick={() => { setStep("choose"); setError("") }} type="button">
                    <FaArrowLeft size={10} /> Back
                  </button>
                  <label className="lm-input-label" htmlFor="lm-email">Email address</label>
                  <input
                    id="lm-email"
                    ref={firstFocusRef as any}
                    className="lm-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendOtp()}
                    autoComplete="email"
                    autoFocus
                  />
                  {error && <div className="lm-error" role="alert">⚠ {error}</div>}
                  <button className="lm-submit" onClick={sendOtp} disabled={loading || !email.trim()} type="button">
                    {loading ? "Sending…" : "Send One-Time Code"}
                  </button>
                </>
              )}

              {step === "otp" && (
                <>
                  <button className="lm-back" onClick={() => { setStep("email"); setOtp(""); setError("") }} type="button">
                    <FaArrowLeft size={10} /> Back
                  </button>
                  <label className="lm-input-label" htmlFor="lm-otp">6-digit code</label>
                  <input
                    id="lm-otp"
                    className={`lm-input lm-otp-input`}
                    type="text"
                    inputMode="numeric"
                    placeholder="000000"
                    maxLength={6}
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                    onKeyDown={e => e.key === "Enter" && verifyOtp()}
                    autoComplete="one-time-code"
                    autoFocus
                  />
                  {error && <div className="lm-error" role="alert">⚠ {error}</div>}
                  <button className="lm-submit" onClick={verifyOtp} disabled={loading || otp.length < 6} type="button">
                    {loading ? "Verifying…" : "Confirm & Sign In"}
                  </button>
                  <p className="lm-hint">
                    Didn't receive a code?{" "}
                    <a href="#" onClick={e => { e.preventDefault(); sendOtp() }}>Resend</a>
                  </p>
                </>
              )}

              <p className="lm-hint">
                By signing in you agree to our{" "}
                <a href="/terms" target="_blank">Terms</a> &amp;{" "}
                <a href="/privacy" target="_blank">Privacy Policy</a>.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  )
}