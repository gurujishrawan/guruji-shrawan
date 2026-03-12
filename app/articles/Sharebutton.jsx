"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Share2, X, Copy, Check, Link2 } from "lucide-react"

const ORANGE = "#c8551a"
const MUTED  = "#8a7a6a"
const BORDER = "#e8ddd0"
const BG     = "#faf7f2"
const SANS   = "'Poppins', system-ui, sans-serif"

/* ── tiny SVG icons ── */
const XI = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631Zm-1.161 17.52h1.833L7.084 4.126H5.117Z"/></svg>
const WA = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
const FB = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
const LI = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
const TG = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>

const PLATFORMS = [
  { id:"x",        label:"X",        icon:<XI/>, bg:"#111",     url:(u,t)=>`https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}` },
  { id:"whatsapp", label:"WA",       icon:<WA/>, bg:"#25d366",  url:(u,t)=>`https://wa.me/?text=${encodeURIComponent(t+" "+u)}` },
  { id:"facebook", label:"FB",       icon:<FB/>, bg:"#1877f2",  url:(u)  =>`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}` },
  { id:"linkedin", label:"in",       icon:<LI/>, bg:"#0a66c2",  url:(u)  =>`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}` },
  { id:"telegram", label:"TG",       icon:<TG/>, bg:"#0088cc",  url:(u,t)=>`https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}` },
]

export default function ShareButton({ article, s = {}, variant = "icon", position = "above", className = "" }) {
  const [open,   setOpen]   = useState(false)
  const [copied, setCopied] = useState(false)
  const [mobile, setMobile] = useState(false)
  const ref = useRef(null)

  const slug  = article?.slug || ""
  const title = article?.title || "Guruji Shrawan"
  const url   = typeof window !== "undefined"
    ? `${window.location.origin}/articles/${slug}`
    : `https://gurujishrawan.com/articles/${slug}`

  /* detect mobile */
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth <= 600)
    fn(); window.addEventListener("resize", fn, { passive:true })
    return () => window.removeEventListener("resize", fn)
  }, [])

  /* outside click → close (desktop) */
  useEffect(() => {
    if (!open || mobile) return
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", fn)
    return () => document.removeEventListener("mousedown", fn)
  }, [open, mobile])

  /* body scroll lock on mobile sheet */
  useEffect(() => {
    if (mobile) document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open, mobile])

  /* escape key */
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") setOpen(false) }
    document.addEventListener("keydown", fn)
    return () => document.removeEventListener("keydown", fn)
  }, [])

  async function copy() {
    try { await navigator.clipboard.writeText(url) }
    catch { const t=document.createElement("textarea");t.value=url;document.body.appendChild(t);t.select();document.execCommand("copy");document.body.removeChild(t) }
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  function share(p) {
    window.open(p.url(url, title), "_blank", "noopener,noreferrer")
    setTimeout(() => setOpen(false), 200)
  }

  /* ── compact popup content ── */
  const Popup = () => (
    <div style={{ padding:"10px 12px", display:"flex", flexDirection:"column", gap:8 }}>
      {/* circles row */}
      <div style={{ display:"flex", gap:7, alignItems:"center", justifyContent:"center" }}>
        {PLATFORMS.map((p, i) => (
          <button key={p.id} onClick={() => share(p)} title={p.id}
            style={{
              width:30, height:30, borderRadius:"50%",
              background:p.bg, border:"none", cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
              color:"#fff", flexShrink:0, transition:"transform .14s, box-shadow .14s",
              animation:`sbPop .2s ${i*0.03}s ease-out both`,
            }}
            onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.15)";e.currentTarget.style.boxShadow=`0 3px 10px ${p.bg}70`}}
            onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="none"}}>
            {p.icon}
          </button>
        ))}
        {/* copy circle */}
        <button onClick={copy} title="Copy link"
          style={{
            width:30, height:30, borderRadius:"50%",
            background: copied ? "#16a34a" : "#f0e8de",
            border:`1.5px solid ${copied ? "#16a34a" : BORDER}`,
            cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
            color: copied ? "#fff" : MUTED, flexShrink:0,
            transition:"all .18s",
            animation:`sbPop .2s ${PLATFORMS.length*0.03}s ease-out both`,
          }}
          onMouseEnter={e=>{if(!copied){e.currentTarget.style.background=ORANGE;e.currentTarget.style.borderColor=ORANGE;e.currentTarget.style.color="#fff"}}}
          onMouseLeave={e=>{if(!copied){e.currentTarget.style.background="#f0e8de";e.currentTarget.style.borderColor=BORDER;e.currentTarget.style.color=MUTED}}}>
          {copied ? <Check size={11}/> : <Link2 size={11}/>}
        </button>
      </div>

      {/* copied label */}
      {copied && (
        <p style={{ textAlign:"center", fontFamily:SANS, fontSize:10, fontWeight:600,
          color:"#16a34a", animation:"sbFadeIn .2s ease-out" }}>
          Link copied!
        </p>
      )}
    </div>
  )

  /* ── trigger ── */
  const isIconVariant = variant === "icon"
  const trigger = (
    <button
      onClick={() => setOpen(o => !o)}
      className={className}
      style={{
        display:"inline-flex", alignItems:"center", gap:5,
        padding: isIconVariant ? "5px 9px" : "6px 13px",
        borderRadius:8, border: isIconVariant ? "none" : `1.5px solid ${open ? ORANGE : BORDER}`,
        background: open ? `${ORANGE}10` : "transparent",
        fontFamily:SANS, fontSize:12, fontWeight:600,
        color: open ? ORANGE : MUTED,
        cursor:"pointer", transition:"all .15s",
      }}
      onMouseEnter={e=>{e.currentTarget.style.color=ORANGE;e.currentTarget.style.background=`${ORANGE}0d`}}
      onMouseLeave={e=>{if(!open){e.currentTarget.style.color=MUTED;e.currentTarget.style.background="transparent"}}}
      aria-label="Share" aria-expanded={open}>
      <Share2 size={13}/>
      <span>Share</span>
    </button>
  )

  return (
    <>
      <style>{`
        @keyframes sbUp    { from{opacity:0;transform:translateX(-50%) translateY(6px) scale(.96)} to{opacity:1;transform:translateX(-50%) translateY(0) scale(1)} }
        @keyframes sbDown  { from{opacity:0;transform:translateX(-50%) translateY(-6px) scale(.96)} to{opacity:1;transform:translateX(-50%) translateY(0) scale(1)} }
        @keyframes sbSlide { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes sbOv    { from{opacity:0} to{opacity:1} }
        @keyframes sbPop   { from{opacity:0;transform:scale(.7)} to{opacity:1;transform:scale(1)} }
        @keyframes sbFadeIn{ from{opacity:0} to{opacity:1} }
      `}</style>

      {/* ── DESKTOP ── */}
      {!mobile && (
        <div style={{ position:"relative", display:"inline-block" }} ref={ref}>
          {trigger}
          {open && (
            <div style={{
              position:"absolute",
              [position==="above" ? "bottom" : "top"]: "calc(100% + 6px)",
              left:"50%",
              width:220,
              background:"#fff",
              border:`1.5px solid ${BORDER}`,
              borderRadius:14,
              boxShadow:"0 8px 28px rgba(180,80,20,0.14)",
              zIndex:800,
              overflow:"hidden",
              animation: position==="above" ? "sbUp .18s ease-out both" : "sbDown .18s ease-out both",
            }}>
              {/* mini header */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"9px 12px 0", fontFamily:SANS }}>
                <span style={{ fontSize:11, fontWeight:700, color:"#1a1008", letterSpacing:"0.01em" }}>
                  Share
                </span>
                <button onClick={() => setOpen(false)}
                  style={{ background:"none", border:"none", cursor:"pointer", color:MUTED,
                    display:"flex", padding:2, borderRadius:4 }}>
                  <X size={11}/>
                </button>
              </div>
              <Popup/>
            </div>
          )}
        </div>
      )}

      {/* ── MOBILE bottom sheet ── */}
      {mobile && (
        <>
          {trigger}
          {open && (
            <>
              {/* overlay */}
              <div onClick={() => setOpen(false)}
                style={{ position:"fixed", inset:0, zIndex:900,
                  background:"rgba(20,10,4,0.45)", backdropFilter:"blur(4px)",
                  animation:"sbOv .18s ease-out" }}/>
              {/* sheet */}
              <div style={{
                position:"fixed", bottom:0, left:0, right:0, zIndex:910,
                background:"#fff", borderRadius:"18px 18px 0 0",
                boxShadow:"0 -4px 24px rgba(0,0,0,0.14)",
                animation:"sbSlide .25s cubic-bezier(.16,1,.3,1) both",
                paddingBottom:"env(safe-area-inset-bottom,12px)",
              }}>
                {/* drag handle */}
                <div style={{ width:32, height:3, borderRadius:99, background:BORDER,
                  margin:"10px auto 2px" }}/>
                {/* header */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                  padding:"8px 16px 0", fontFamily:SANS }}>
                  <span style={{ fontSize:13, fontWeight:700, color:"#1a1008" }}>Share Article</span>
                  <button onClick={() => setOpen(false)}
                    style={{ background:BG, border:`1px solid ${BORDER}`, width:26, height:26,
                      borderRadius:"50%", cursor:"pointer", color:MUTED,
                      display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <X size={11}/>
                  </button>
                </div>
                <Popup/>
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}