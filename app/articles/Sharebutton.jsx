"use client"

import { useState, useRef, useEffect } from "react"
import { Share2, X, Copy, Check, Facebook } from "lucide-react"

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" />
    </svg>
  )
}
function WhatsAppIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}
function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

const PLATFORMS = [
  { name: "X", icon: <XIcon />, bg: "#111", color: "#fff", getHref: (u, t) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}` },
  { name: "WhatsApp", icon: <WhatsAppIcon />, bg: "#25d366", color: "#fff", getHref: (u, t) => `https://wa.me/?text=${encodeURIComponent(t + " " + u)}` },
  { name: "Facebook", icon: <Facebook size={14} />, bg: "#1877f2", color: "#fff", getHref: (u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}` },
  { name: "LinkedIn", icon: <LinkedInIcon />, bg: "#0a66c2", color: "#fff", getHref: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}` },
]

export default function ShareButton({ article, s, variant = "icon", position = "above" }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [count, setCount] = useState(0)
  const ref = useRef(null)

  const title = article?.title || "Guruji Shrawan Article"
  const slug = article?.slug || ""
  const url = typeof window !== "undefined"
    ? `${window.location.origin}/articles/${slug}`
    : `https://gurujishrawan.com/articles/${slug}`

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  async function handleCopy() {
    try { await navigator.clipboard.writeText(url) } catch {
      const ta = document.createElement("textarea")
      ta.value = url; document.body.appendChild(ta); ta.select()
      document.execCommand("copy"); document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  const posClass = position === "above" ? "bottom-full mb-2" : "top-full mt-2"

  return (
    <div className="relative inline-block" ref={ref}>
      {variant === "icon" ? (
        <button
          onClick={() => setOpen(!open)}
          className={`${s.fontBody} flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1.5 rounded-lg transition`}
          style={{ color: open ? "#d4621a" : "#9a8a7a", background: open ? "#fff0e6" : "transparent" }}
        >
          <Share2 size={13} />
          <span>Share{count > 0 ? ` · ${count}` : ""}</span>
        </button>
      ) : (
        <button onClick={() => setOpen(!open)} className={`${s.btnOutline}`}>
          <Share2 size={14} /> Share{count > 0 ? ` · ${count}` : ""}
        </button>
      )}

      {open && (
        <div
          className={`absolute ${posClass} left-1/2 -translate-x-1/2 z-50`}
          style={{ width: 242, background: "#fff", borderRadius: 16, boxShadow: "0 12px 40px rgba(180,80,20,0.18)", border: "1.5px solid #ede5da", animation: "articleFadeUp 0.15s ease-out both" }}
        >
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid #f5ede4" }}>
            <span className={`${s.fontDisplay} text-[13px] font-semibold`} style={{ color: "#1a1008" }}>Share Article</span>
            <button onClick={() => setOpen(false)} style={{ color: "#9a8a7a" }}><X size={13} /></button>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            {PLATFORMS.map(({ name, icon, bg, color, getHref }) => (
              <a key={name} href={getHref(url, title)} target="_blank" rel="noopener noreferrer"
                onClick={() => { setCount(c => c + 1); setOpen(false) }}
                className={`${s.fontBody} flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px] font-semibold transition hover:opacity-90 active:scale-95`}
                style={{ background: bg, color, textDecoration: "none" }}>
                {icon}{name}
              </a>
            ))}
          </div>
          <div className="px-3 pb-3">
            <div onClick={handleCopy} className="flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer"
              style={{ background: "#faf8f5", border: "1.5px solid #ede5da" }}>
              <span className={`${s.fontBody} flex-1 text-[11px] truncate`} style={{ color: "#b0a090" }}>{url.replace("https://", "")}</span>
              <span className={`${s.fontBody} shrink-0 flex items-center gap-1 text-[12px] font-semibold`} style={{ color: copied ? "#16a34a" : "#d4621a" }}>
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "Copied!" : "Copy"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}