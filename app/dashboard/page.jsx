"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "../lib/supabaseClient"
import {
  LayoutDashboard, BookOpen, ShoppingBag, Heart, Settings,
  LogOut, Camera, Check, Loader2, Eye, MessageCircle,
  Bookmark, ChevronRight, Bell, Lock, Trash2, ArrowLeft,
  X, User, BarChart2, Flame, Globe, Phone, FileText,
  AlertCircle, Download, ExternalLink, Star, Clock,
} from "lucide-react"

/* ════════════════════════════════════
   DESIGN TOKENS
════════════════════════════════════ */
const C = {
  orange : "#c8551a",
  gold   : "#b8841a",
  bg     : "#faf7f2",
  paper  : "#f4ede3",
  card   : "#ffffff",
  border : "#e8ddd0",
  text   : "#1a1008",
  sub    : "#4a3828",
  muted  : "#8a7a6a",
  light  : "#f0e8de",
  red    : "#dc2626",
  green  : "#16a34a",
}
const SANS  = "'Poppins', system-ui, sans-serif"
const SERIF = "'Lora', Georgia, serif"
const AVATAR_COLORS = ["#c8551a","#7c3aed","#0891b2","#16a34a","#b8841a","#e11d48","#d97706","#0f766e"]

/* ════════════════════════════════════
   HELPERS
════════════════════════════════════ */
function hashColor(id = "") {
  let h = 0
  for (let i = 0; i < id.length; i++) h = id.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 60)    return "just now"
  if (diff < 3600)  return `${Math.floor(diff/60)}m ago`
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`
  if (diff < 2592000) return `${Math.floor(diff/86400)}d ago`
  return new Date(dateStr).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})
}

function slugToTitle(slug = "") {
  return slug.replace(/-/g," ").replace(/\b\w/g, c => c.toUpperCase())
}

/* ════════════════════════════════════
   AVATAR
════════════════════════════════════ */
function Avatar({ user, size = 40 }) {
  const photo   = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null
  const name    = user?.user_metadata?.full_name || user?.email || "U"
  const initial = name.trim()[0]?.toUpperCase() || "U"
  const bg      = hashColor(user?.id)
  const baseStyle = {
    width: size, height: size, borderRadius: "50%", flexShrink: 0,
    border: `2.5px solid ${C.border}`, overflow: "hidden",
  }
  return photo ? (
    <div style={baseStyle}>
      <Image src={photo} width={size} height={size} alt={name}
        style={{ objectFit:"cover", width:"100%", height:"100%", display:"block" }}
        referrerPolicy="no-referrer" unoptimized />
    </div>
  ) : (
    <div style={{ ...baseStyle, background: bg, display:"flex", alignItems:"center",
      justifyContent:"center", fontFamily:SANS, fontWeight:700, color:"#fff",
      fontSize: Math.round(size * 0.38), letterSpacing: "0.02em" }}>
      {initial}
    </div>
  )
}

/* ════════════════════════════════════
   SMALL COMPONENTS
════════════════════════════════════ */
function Tag({ children, color = C.orange }) {
  return (
    <span style={{ display:"inline-block", padding:"2px 10px", borderRadius:99,
      background:`${color}18`, color, fontFamily:SANS, fontSize:10,
      fontWeight:700, textTransform:"uppercase", letterSpacing:"0.10em" }}>
      {children}
    </span>
  )
}

function Toast({ msg, type = "ok", onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t) }, [onDone])
  return (
    <div style={{ position:"fixed", bottom:32, right:24, zIndex:9999,
      background: type==="ok" ? "#ecfdf5" : "#fef2f2",
      border:`1.5px solid ${type==="ok"?"#86efac":"#fecaca"}`,
      borderRadius:12, padding:"13px 20px", boxShadow:"0 8px 28px rgba(0,0,0,0.12)",
      display:"flex", alignItems:"center", gap:10, fontFamily:SANS,
      fontSize:13, fontWeight:600, color: type==="ok" ? C.green : C.red,
      animation:"toastIn .3s cubic-bezier(.16,1,.3,1)" }}>
      {type==="ok" ? <Check size={15}/> : <AlertCircle size={15}/>}
      {msg}
    </div>
  )
}

function FormInput({ label, value, onChange, type="text", placeholder, hint, disabled=false, rows }) {
  const [focus, setFocus] = useState(false)
  const base = {
    width:"100%", padding:"11px 14px", borderRadius:10,
    border:`1.5px solid ${focus ? C.orange : C.border}`,
    background: disabled ? C.light : C.card,
    fontFamily:SANS, fontSize:14, color: disabled ? C.muted : C.text,
    outline:"none", boxSizing:"border-box", transition:"border-color .15s",
    cursor: disabled ? "not-allowed" : "text",
  }
  return (
    <div style={{ marginBottom:16 }}>
      {label && <label style={{ display:"block", fontFamily:SANS, fontSize:12,
        fontWeight:600, color:C.sub, marginBottom:6, letterSpacing:"0.01em" }}>{label}</label>}
      {rows ? (
        <textarea value={value} onChange={onChange} rows={rows} placeholder={placeholder}
          disabled={disabled} style={{ ...base, resize:"vertical", lineHeight:1.7 }}
          onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}/>
      ) : (
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
          disabled={disabled} style={base}
          onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}/>
      )}
      {hint && <p style={{ fontFamily:SANS, fontSize:11, color:C.muted, marginTop:5 }}>{hint}</p>}
    </div>
  )
}

function Toggle({ value, onChange, label, sublabel }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"14px 0", borderBottom:`1px solid ${C.light}` }}>
      <div>
        <p style={{ fontFamily:SANS, fontSize:13.5, fontWeight:600, color:C.text }}>{label}</p>
        {sublabel && <p style={{ fontFamily:SANS, fontSize:11.5, color:C.muted, marginTop:2 }}>{sublabel}</p>}
      </div>
      <div onClick={onChange} style={{ width:44, height:25, borderRadius:99, cursor:"pointer",
        background: value ? C.orange : "#d0c8be",
        position:"relative", flexShrink:0, transition:"background .22s",
        boxShadow: value ? `0 0 0 3px ${C.orange}28` : "none" }}>
        <div style={{ position:"absolute", top:3, left: value ? 21 : 3,
          width:19, height:19, borderRadius:"50%", background:"#fff",
          boxShadow:"0 2px 6px rgba(0,0,0,0.20)", transition:"left .22s cubic-bezier(.34,1.56,.64,1)" }}/>
      </div>
    </div>
  )
}

/* ════════════════════════════════════
   STAT CARD
════════════════════════════════════ */
function StatCard({ icon, label, value, bg, delay = "0s" }) {
  return (
    <div style={{ background:C.card, borderRadius:16, padding:"22px 24px",
      border:`1.5px solid ${C.border}`, display:"flex", gap:16, alignItems:"center",
      animation:`cardIn .4s ${delay} ease-out both`,
      transition:"box-shadow .2s, transform .2s" }}
      onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 6px 24px ${bg}28`;e.currentTarget.style.transform="translateY(-2px)"}}
      onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none"}}>
      <div style={{ width:50, height:50, borderRadius:14, background:`${bg}18`,
        display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <div style={{ color:bg }}>{icon}</div>
      </div>
      <div>
        <p style={{ fontFamily:SANS, fontSize:10.5, fontWeight:700, color:C.muted,
          textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:5 }}>{label}</p>
        <p style={{ fontFamily:SANS, fontSize:26, fontWeight:900, color:C.text,
          lineHeight:1, letterSpacing:"-0.02em" }}>{value}</p>
      </div>
    </div>
  )
}

/* ════════════════════════════════════
   PANEL WRAPPER
════════════════════════════════════ */
function Panel({ title, subtitle, action, noPad, children }) {
  return (
    <div style={{ background:C.card, borderRadius:20, border:`1.5px solid ${C.border}`,
      overflow:"hidden", marginBottom:24, animation:"fadeUp .35s ease-out both" }}>
      {(title||subtitle||action) && (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"20px 24px 16px", borderBottom:`1px solid ${C.light}` }}>
          <div>
            <h3 style={{ fontFamily:SANS, fontSize:15, fontWeight:800, color:C.text,
              letterSpacing:"-0.01em" }}>{title}</h3>
            {subtitle && <p style={{ fontFamily:SANS, fontSize:12, color:C.muted, marginTop:2 }}>{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div style={noPad ? {} : { padding:"20px 24px" }}>
        {children}
      </div>
    </div>
  )
}

/* ════════════════════════════════════
   VIEW — OVERVIEW
════════════════════════════════════ */
function OverviewView({ user, stats, savedArticles, comments }) {
  const first = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Seeker"

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

  return (
    <div>
      {/* Hero welcome */}
      <div style={{ background:"linear-gradient(135deg,#1c0a03 0%,#3d1508 55%,#5a2010 100%)",
        borderRadius:22, padding:"32px 36px", marginBottom:28, position:"relative", overflow:"hidden" }}
        className="db-hero">
        <div className="db-hero-orb db-hero-orb1"/>
        <div className="db-hero-orb db-hero-orb2"/>
        <div className="db-hero-orb db-hero-orb3"/>
        <div style={{ position:"relative", zIndex:1 }}>
          <p style={{ fontFamily:SANS, fontSize:11, fontWeight:700, textTransform:"uppercase",
            letterSpacing:"0.20em", color:C.gold, marginBottom:10 }}>
            {greeting} 🙏
          </p>
          <h1 style={{ fontFamily:SANS, fontSize:"clamp(22px,2.8vw,34px)", fontWeight:900,
            color:"#fff", marginBottom:8, letterSpacing:"-0.025em", lineHeight:1.2 }}>
            Welcome back, {first}
          </h1>
          <p style={{ fontFamily:SERIF, fontSize:14, fontStyle:"italic",
            color:"rgba(255,255,255,0.50)", lineHeight:1.7, maxWidth:480 }}>
            "The seeker who reads, reflects, and returns — that is the one who truly finds."
          </p>
        </div>
        <div style={{ position:"absolute", right:32, bottom:24, fontFamily:SANS, fontSize:11,
          color:"rgba(255,255,255,0.25)", zIndex:1 }}>
          {new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})}
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",
        gap:14, marginBottom:28 }}>
        <StatCard icon={<Bookmark  size={22}/>} label="Saved Articles" value={stats.saved} bg={C.orange} delay=".05s"/>
        <StatCard icon={<Heart     size={22}/>} label="Articles Liked" value={stats.liked} bg="#e11d48"  delay=".10s"/>
        <StatCard icon={<MessageCircle size={22}/>} label="Comments"   value={stats.comments} bg="#0891b2" delay=".15s"/>
        <StatCard icon={<ShoppingBag size={22}/>} label="Books Owned"  value={stats.books} bg={C.gold}   delay=".20s"/>
      </div>

      {/* Two-col */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }} className="db-2col">

        {/* Recently saved */}
        <Panel title="Recently Saved" subtitle="Your bookmarked articles"
          action={
            <button onClick={()=>{}} style={{ fontFamily:SANS, fontSize:12, fontWeight:600,
              color:C.orange, background:"none", border:"none", cursor:"pointer" }}>
              View all →
            </button>
          } noPad>
          {savedArticles.length === 0 ? (
            <div style={{ padding:"28px 24px", textAlign:"center" }}>
              <Bookmark size={30} style={{ color:C.border, marginBottom:8 }}/>
              <p style={{ fontFamily:SANS, fontSize:13, color:C.muted }}>No saved articles yet</p>
            </div>
          ) : savedArticles.slice(0,4).map((a,i) => (
            <Link key={a.id} href={`/articles/${a.article_slug}`}
              style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 24px",
                borderBottom: i < Math.min(savedArticles.length,4)-1 ? `1px solid ${C.light}` : "none",
                textDecoration:"none", transition:"background .15s" }}
              onMouseEnter={e=>e.currentTarget.style.background=C.light}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{ width:36, height:36, borderRadius:9, background:`${C.orange}14`,
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <BookOpen size={16} style={{ color:C.orange }}/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontFamily:SANS, fontSize:13, fontWeight:600, color:C.text,
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {slugToTitle(a.article_slug)}
                </p>
                <p style={{ fontFamily:SANS, fontSize:11, color:C.muted, marginTop:2 }}>
                  {timeAgo(a.created_at)}
                </p>
              </div>
              <ChevronRight size={14} style={{ color:C.muted, flexShrink:0 }}/>
            </Link>
          ))}
        </Panel>

        {/* Recent comments */}
        <Panel title="My Comments" subtitle="Your recent discussions" noPad>
          {comments.length === 0 ? (
            <div style={{ padding:"28px 24px", textAlign:"center" }}>
              <MessageCircle size={30} style={{ color:C.border, marginBottom:8 }}/>
              <p style={{ fontFamily:SANS, fontSize:13, color:C.muted }}>No comments yet</p>
            </div>
          ) : comments.slice(0,4).map((c,i) => (
            <div key={c.id} style={{ padding:"13px 24px",
              borderBottom: i < Math.min(comments.length,4)-1 ? `1px solid ${C.light}` : "none" }}>
              <p style={{ fontFamily:SERIF, fontSize:13, fontStyle:"italic", color:C.sub,
                marginBottom:6, lineHeight:1.55,
                overflow:"hidden", textOverflow:"ellipsis", display:"-webkit-box",
                WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                "{c.text}"
              </p>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <Tag color={C.orange}>{slugToTitle(c.article_slug).slice(0,20)}</Tag>
                <span style={{ fontFamily:SANS, fontSize:11, color:C.muted }}>{timeAgo(c.created_at)}</span>
              </div>
            </div>
          ))}
        </Panel>
      </div>

      {/* Quick links */}
      <Panel title="Quick Links" subtitle="Jump to what you need">
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:10 }}>
          {[
            { href:"/articles",  icon:<BookOpen size={18}/>,    label:"Browse Articles", bg:C.orange },
            { href:"/books",     icon:<ShoppingBag size={18}/>, label:"Explore Books",   bg:C.gold   },
            { href:"/youtube",   icon:<Flame size={18}/>,       label:"Watch Videos",    bg:"#e11d48" },
            { href:"/biography", icon:<User size={18}/>,        label:"About Guruji",    bg:"#0891b2" },
          ].map(({ href, icon, label, bg }) => (
            <Link key={href} href={href} style={{ display:"flex", alignItems:"center", gap:10,
              padding:"13px 16px", borderRadius:12, background:C.bg,
              border:`1.5px solid ${C.border}`, textDecoration:"none", transition:"all .18s" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=bg;e.currentTarget.style.background=`${bg}0d`}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.bg}}>
              <div style={{ width:34, height:34, borderRadius:9, background:`${bg}18`,
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:bg }}>
                {icon}
              </div>
              <span style={{ fontFamily:SANS, fontSize:13, fontWeight:600, color:C.text }}>{label}</span>
            </Link>
          ))}
        </div>
      </Panel>
    </div>
  )
}

/* ════════════════════════════════════
   VIEW — SAVED ARTICLES
════════════════════════════════════ */
function SavedView({ items, onUnsave, loading }) {
  const [query, setQuery] = useState("")
  const filtered = items.filter(a =>
    slugToTitle(a.article_slug).toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <input value={query} onChange={e=>setQuery(e.target.value)}
          placeholder="Search saved articles…"
          style={{ flex:1, padding:"10px 16px", borderRadius:10, border:`1.5px solid ${C.border}`,
            fontFamily:SANS, fontSize:13, color:C.text, background:C.card, outline:"none",
            transition:"border-color .15s" }}
          onFocus={e=>e.target.style.borderColor=C.orange}
          onBlur={e=>e.target.style.borderColor=C.border}/>
        {query && (
          <button onClick={()=>setQuery("")} style={{ background:C.light, border:"none",
            width:36, height:36, borderRadius:9, cursor:"pointer", display:"flex",
            alignItems:"center", justifyContent:"center", color:C.muted }}>
            <X size={14}/>
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display:"flex", justifyContent:"center", padding:"60px 0",
          fontFamily:SANS, fontSize:14, color:C.muted, gap:10 }}>
          <Loader2 size={18} style={{ animation:"spin 1s linear infinite" }}/> Loading…
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"60px 24px", background:C.card,
          borderRadius:20, border:`1.5px solid ${C.border}` }}>
          <Bookmark size={42} style={{ color:C.border, marginBottom:14 }}/>
          <p style={{ fontFamily:SANS, fontSize:16, fontWeight:700, color:C.text, marginBottom:6 }}>
            {query ? "No results found" : "Nothing saved yet"}
          </p>
          <p style={{ fontFamily:SANS, fontSize:13, color:C.muted, marginBottom:22 }}>
            {query ? "Try a different search." : "Bookmark articles and find them here."}
          </p>
          {!query && (
            <Link href="/articles" style={{ padding:"10px 24px", borderRadius:10,
              background:`linear-gradient(135deg,${C.orange},#8a2e06)`, color:"#fff",
              fontFamily:SANS, fontSize:13, fontWeight:700, textDecoration:"none",
              boxShadow:"0 2px 12px rgba(200,85,26,0.28)" }}>
              Browse Articles
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {filtered.map((a, i) => (
            <div key={a.id} style={{ display:"flex", alignItems:"center", gap:14,
              padding:"16px 20px", background:C.card, borderRadius:14,
              border:`1.5px solid ${C.border}`, animation:`cardIn .3s ${i*.04}s ease-out both`,
              transition:"box-shadow .18s" }}
              onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 16px rgba(200,85,26,0.10)"}
              onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
              <div style={{ width:42, height:42, borderRadius:11, background:`${C.orange}14`,
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <BookOpen size={18} style={{ color:C.orange }}/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <Link href={`/articles/${a.article_slug}`}
                  style={{ fontFamily:SANS, fontSize:14, fontWeight:700, color:C.text,
                    textDecoration:"none", display:"block", overflow:"hidden",
                    textOverflow:"ellipsis", whiteSpace:"nowrap", transition:"color .15s" }}
                  onMouseEnter={e=>e.currentTarget.style.color=C.orange}
                  onMouseLeave={e=>e.currentTarget.style.color=C.text}>
                  {slugToTitle(a.article_slug)}
                </Link>
                <p style={{ fontFamily:SANS, fontSize:11, color:C.muted, marginTop:3 }}>
                  Saved {timeAgo(a.created_at)}
                </p>
              </div>
              <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                <Link href={`/articles/${a.article_slug}`}
                  style={{ padding:"6px 12px", borderRadius:8, background:C.bg,
                    border:`1.5px solid ${C.border}`, fontFamily:SANS, fontSize:12,
                    fontWeight:600, color:C.sub, textDecoration:"none", display:"flex",
                    alignItems:"center", gap:5, transition:"all .15s" }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=C.orange;e.currentTarget.style.color=C.orange}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.sub}}>
                  <ExternalLink size={12}/> Read
                </Link>
                <button onClick={()=>onUnsave(a)}
                  style={{ padding:"6px 12px", borderRadius:8, background:"none",
                    border:`1.5px solid ${C.border}`, fontFamily:SANS, fontSize:12,
                    fontWeight:600, color:C.muted, cursor:"pointer", display:"flex",
                    alignItems:"center", gap:5, transition:"all .15s" }}
                  onMouseEnter={e=>{e.currentTarget.style.background="#fef2f2";e.currentTarget.style.borderColor="#fecaca";e.currentTarget.style.color=C.red}}
                  onMouseLeave={e=>{e.currentTarget.style.background="none";e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.muted}}>
                  <X size={12}/> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════
   VIEW — BOOKS
════════════════════════════════════ */
function BooksView({ books, loading }) {
  return (
    <div>
      {loading ? (
        <div style={{ display:"flex", justifyContent:"center", padding:"60px 0",
          fontFamily:SANS, fontSize:14, color:C.muted, gap:10 }}>
          <Loader2 size={18} style={{ animation:"spin 1s linear infinite" }}/> Loading…
        </div>
      ) : books.length === 0 ? (
        <div style={{ textAlign:"center", padding:"64px 24px", background:C.card,
          borderRadius:20, border:`1.5px solid ${C.border}` }}>
          <ShoppingBag size={44} style={{ color:C.border, marginBottom:14 }}/>
          <p style={{ fontFamily:SANS, fontSize:16, fontWeight:700, color:C.text, marginBottom:6 }}>
            No books yet
          </p>
          <p style={{ fontFamily:SANS, fontSize:13, color:C.muted, marginBottom:22 }}>
            Explore Guruji Shrawan's published works on wisdom and inquiry.
          </p>
          <Link href="/books" style={{ padding:"10px 24px", borderRadius:10,
            background:`linear-gradient(135deg,${C.orange},#8a2e06)`, color:"#fff",
            fontFamily:SANS, fontSize:13, fontWeight:700, textDecoration:"none" }}>
            Browse Books
          </Link>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:18 }}>
          {books.map((b,i) => (
            <div key={b.id} style={{ background:C.card, borderRadius:16,
              border:`1.5px solid ${C.border}`, overflow:"hidden",
              animation:`cardIn .35s ${i*.06}s ease-out both`, transition:"box-shadow .2s, transform .2s" }}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 8px 28px rgba(184,132,26,0.16)";e.currentTarget.style.transform="translateY(-3px)"}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none"}}>
              {/* cover art */}
              <div style={{ height:160, background:"linear-gradient(160deg,#1a0a04,#3e1a08,#6a3010)",
                display:"flex", alignItems:"center", justifyContent:"center",
                position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100,
                  borderRadius:"50%", background:"rgba(184,132,26,0.10)" }}/>
                <ShoppingBag size={48} style={{ color:"rgba(184,132,26,0.55)" }}/>
                <div style={{ position:"absolute", top:10, right:10 }}>
                  <Tag color={C.gold}>PDF</Tag>
                </div>
              </div>
              <div style={{ padding:"16px 18px" }}>
                <p style={{ fontFamily:SANS, fontSize:14, fontWeight:700, color:C.text,
                  marginBottom:4, lineHeight:1.35 }}>{b.title || "Guruji Shrawan — Book"}</p>
                <p style={{ fontFamily:SANS, fontSize:11, color:C.muted, marginBottom:14 }}>
                  Purchased {timeAgo(b.created_at)}
                </p>
                <a href={b.download_url||"#"} target="_blank" rel="noopener noreferrer"
                  style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 14px",
                    borderRadius:9, background:`linear-gradient(135deg,${C.orange},#8a2e06)`,
                    color:"#fff", fontFamily:SANS, fontSize:12, fontWeight:700,
                    textDecoration:"none", justifyContent:"center",
                    boxShadow:"0 2px 10px rgba(200,85,26,0.26)" }}>
                  <Download size={13}/> Download PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════
   VIEW — PROFILE
════════════════════════════════════ */
function ProfileView({ user, onToast }) {
  const fileRef = useRef(null)

  const [fullName,   setFullName]   = useState(user?.user_metadata?.full_name || "")
  const [phone,      setPhone]      = useState(user?.user_metadata?.phone || "")
  const [bio,        setBio]        = useState(user?.user_metadata?.bio || "")
  const [location,   setLocation]   = useState(user?.user_metadata?.location || "")
  const [website,    setWebsite]    = useState(user?.user_metadata?.website || "")
  const [uploading,  setUploading]  = useState(false)
  const [saving,     setSaving]     = useState(false)
  const [preview,    setPreview]    = useState(null)

  const provider    = user?.app_metadata?.provider || "email"
  const joinedDate  = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})
    : "—"

  async function handlePhoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) { onToast("Image must be under 3 MB", "error"); return }
    setUploading(true)
    setPreview(URL.createObjectURL(file))
    const ext  = file.name.split(".").pop()
   const path = `avatars/${user.id}-${Date.now()}.${ext}`
    const { error: upErr } = await supabase.storage.from("user-avatars").upload(path, file, { upsert:true })
    if (upErr) { onToast("Upload failed: " + upErr.message, "error"); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from("user-avatars").getPublicUrl(path)
    await supabase.auth.updateUser({ data: { avatar_url: publicUrl } })
    setUploading(false)
    onToast("Profile photo updated! 🎉")
  }

  async function handleSave() {
    setSaving(true)
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName.trim(), phone: phone.trim(),
              bio: bio.trim(), location: location.trim(), website: website.trim() }
    })
    setSaving(false)
    if (error) { onToast(error.message, "error"); return }
    onToast("Profile saved! ✓")
  }

  const photoSrc = preview || user?.user_metadata?.avatar_url || user?.user_metadata?.picture

  return (
    <div style={{ display:"grid", gridTemplateColumns:"300px 1fr", gap:24, alignItems:"start" }}
      className="db-profile-grid">

      {/* LEFT — avatar card */}
      <div>
        <Panel title="Profile Photo">
          <div style={{ textAlign:"center" }}>
            {/* avatar */}
            <div style={{ display:"flex", justifyContent:"center", marginBottom:20 }}>
              <div style={{ position:"relative" }}>
                {photoSrc ? (
                  <div style={{ width:110, height:110, borderRadius:"50%", overflow:"hidden",
                    border:`3px solid ${C.border}`, boxShadow:"0 4px 20px rgba(0,0,0,0.12)" }}>
                    <Image src={photoSrc} width={110} height={110} alt="avatar"
                      style={{ objectFit:"cover", width:"100%", height:"100%" }}
                      referrerPolicy="no-referrer" unoptimized/>
                  </div>
                ) : (
                  <Avatar user={user} size={110}/>
                )}
                <button onClick={()=>fileRef.current?.click()}
                  style={{ position:"absolute", bottom:4, right:4, width:32, height:32,
                    borderRadius:"50%", background:C.orange, border:"3px solid #fff",
                    cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                    boxShadow:"0 2px 10px rgba(200,85,26,0.35)", transition:"transform .15s" }}
                  onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                  {uploading
                    ? <Loader2 size={14} color="#fff" style={{ animation:"spin 1s linear infinite" }}/>
                    : <Camera size={14} color="#fff"/>}
                </button>
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"
              style={{ display:"none" }} onChange={handlePhoto}/>
            <p style={{ fontFamily:SANS, fontSize:14, fontWeight:700, color:C.text, marginBottom:2 }}>
              {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
            </p>
            <p style={{ fontFamily:SANS, fontSize:12, color:C.muted, marginBottom:16 }}>{user?.email}</p>
            <button onClick={()=>fileRef.current?.click()} disabled={uploading}
              style={{ padding:"8px 18px", borderRadius:9, background:C.bg,
                border:`1.5px solid ${C.border}`, fontFamily:SANS, fontSize:12,
                fontWeight:600, color:C.sub, cursor:"pointer", display:"inline-flex",
                alignItems:"center", gap:7, transition:"all .15s" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.orange;e.currentTarget.style.color=C.orange}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.sub}}>
              <Camera size={13}/> Change Photo
            </button>
            <p style={{ fontFamily:SANS, fontSize:10.5, color:C.muted, marginTop:8 }}>
              JPG, PNG or WebP · Max 3 MB
            </p>
          </div>
        </Panel>

        {/* Account info card */}
        <Panel title="Account Info">
          {[
            { icon:<Globe size={13}/>,    label:"Provider", value: provider === "google" ? "Google" : "Email/Password" },
            { icon:<Clock size={13}/>,    label:"Joined",   value: joinedDate },
            { icon:<FileText size={13}/>, label:"User ID",  value: user?.id?.slice(0,8) + "…" },
          ].map(({ icon, label, value }) => (
            <div key={label} style={{ display:"flex", alignItems:"center", gap:12,
              padding:"10px 0", borderBottom:`1px solid ${C.light}` }}>
              <div style={{ width:28, height:28, borderRadius:7, background:`${C.orange}12`,
                display:"flex", alignItems:"center", justifyContent:"center", color:C.orange, flexShrink:0 }}>
                {icon}
              </div>
              <div>
                <p style={{ fontFamily:SANS, fontSize:10, color:C.muted, textTransform:"uppercase",
                  letterSpacing:"0.08em", fontWeight:600 }}>{label}</p>
                <p style={{ fontFamily:SANS, fontSize:13, fontWeight:600, color:C.text }}>{value}</p>
              </div>
            </div>
          ))}
        </Panel>
      </div>

      {/* RIGHT — form */}
      <div>
        <Panel title="Personal Information" subtitle="Update your name, bio and contact details">
          <FormInput label="Full Name" value={fullName} onChange={e=>setFullName(e.target.value)}
            placeholder="Your full name"/>
          <FormInput label="Email Address" value={user?.email||""} disabled
            hint="Email cannot be changed here. Contact support if needed."/>
          <FormInput label="Phone Number" value={phone} onChange={e=>setPhone(e.target.value)}
            placeholder="+91 98765 43210" type="tel"/>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <FormInput label="Location" value={location} onChange={e=>setLocation(e.target.value)}
              placeholder="City, India"/>
            <FormInput label="Website" value={website} onChange={e=>setWebsite(e.target.value)}
              placeholder="https://yoursite.com" type="url"/>
          </div>
          <FormInput label="Bio" value={bio} onChange={e=>setBio(e.target.value)} rows={3}
            placeholder="Tell us a little about your spiritual journey…"/>

          <button onClick={handleSave} disabled={saving}
            style={{ width:"100%", padding:"13px", borderRadius:11, border:"none",
              background: saving ? "#d0b8a0" : `linear-gradient(135deg,${C.orange},#8a2e06)`,
              color:"#fff", fontFamily:SANS, fontSize:14, fontWeight:700,
              cursor: saving ? "not-allowed" : "pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:9,
              boxShadow: saving ? "none" : "0 3px 14px rgba(200,85,26,0.30)",
              transition:"all .18s, box-shadow .18s" }}>
            {saving
              ? <><Loader2 size={15} style={{ animation:"spin 1s linear infinite" }}/> Saving…</>
              : <><Check size={15}/> Save Changes</>}
          </button>
        </Panel>
      </div>
    </div>
  )
}

/* ════════════════════════════════════
   VIEW — SETTINGS
════════════════════════════════════ */
function SettingsView({ user, onToast, onLogout }) {
  const isGoogle    = user?.app_metadata?.provider === "google"
  const [newPw,     setNewPw]      = useState("")
  const [confPw,    setConfPw]     = useState("")
  const [pwBusy,    setPwBusy]     = useState(false)
  const [notif,     setNotif]      = useState({
    newsletter: true, newComments: true, likes: false, announcements: true,
  })
  const [delText,   setDelText]    = useState("")

  async function changePassword() {
    if (newPw.length < 6) { onToast("Password must be at least 6 characters.", "error"); return }
    if (newPw !== confPw) { onToast("Passwords do not match.", "error"); return }
    setPwBusy(true)
    const { error } = await supabase.auth.updateUser({ password: newPw })
    setPwBusy(false)
    if (error) { onToast(error.message, "error"); return }
    onToast("Password updated! ✓")
    setNewPw(""); setConfPw("")
  }

  async function deleteAccount() {
    if (delText !== "DELETE") return
    alert("Wire this to your /api/delete-account server-side endpoint (requires Supabase service role key).")
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

      {/* Notifications */}
      <Panel title="Notifications" subtitle="Choose what emails you receive">
        <Toggle value={notif.newsletter}    label="Weekly newsletter"         sublabel="Curated wisdom every week"
          onChange={()=>setNotif(p=>({...p, newsletter:!p.newsletter}))}/>
        <Toggle value={notif.newComments}   label="Comment replies"           sublabel="When someone replies to your comment"
          onChange={()=>setNotif(p=>({...p, newComments:!p.newComments}))}/>
        <Toggle value={notif.likes}         label="Likes on comments"         sublabel="When someone likes your comment"
          onChange={()=>setNotif(p=>({...p, likes:!p.likes}))}/>
        <Toggle value={notif.announcements} label="Announcements"             sublabel="New articles and events from Guruji Shrawan"
          onChange={()=>setNotif(p=>({...p, announcements:!p.announcements}))}/>
        <button onClick={()=>onToast("Notification preferences saved! ✓")}
          style={{ marginTop:16, padding:"9px 22px", borderRadius:9,
            background:C.bg, border:`1.5px solid ${C.border}`,
            fontFamily:SANS, fontSize:13, fontWeight:600, color:C.sub, cursor:"pointer",
            display:"inline-flex", alignItems:"center", gap:7, transition:"all .15s" }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=C.orange;e.currentTarget.style.color=C.orange}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.sub}}>
          <Check size={13}/> Save Preferences
        </button>
      </Panel>

      {/* Password */}
      {isGoogle ? (
        <div style={{ background:"#f0fdf4", borderRadius:18, padding:"20px 24px",
          border:"1.5px solid #86efac", display:"flex", gap:14, alignItems:"flex-start" }}>
          <div style={{ fontSize:24, lineHeight:1 }}>🔐</div>
          <div>
            <p style={{ fontFamily:SANS, fontSize:14, fontWeight:700, color:"#15803d", marginBottom:4 }}>
              Signed in with Google
            </p>
            <p style={{ fontFamily:SANS, fontSize:13, color:"#16a34a", lineHeight:1.65 }}>
              Your password is managed by Google. To change it, visit your Google account security settings.
            </p>
          </div>
        </div>
      ) : (
        <Panel title="Change Password" subtitle="Set a new password for your account">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <FormInput label="New Password"     value={newPw}  onChange={e=>setNewPw(e.target.value)}  type="password" placeholder="Min 6 characters"/>
            <FormInput label="Confirm Password" value={confPw} onChange={e=>setConfPw(e.target.value)} type="password" placeholder="Repeat new password"/>
          </div>
          <button onClick={changePassword} disabled={pwBusy}
            style={{ padding:"10px 24px", borderRadius:10, border:"none",
              background: pwBusy ? "#d0b8a0" : `linear-gradient(135deg,${C.orange},#8a2e06)`,
              color:"#fff", fontFamily:SANS, fontSize:13, fontWeight:700,
              cursor: pwBusy ? "not-allowed" : "pointer",
              display:"inline-flex", alignItems:"center", gap:8,
              boxShadow: pwBusy ? "none" : "0 2px 12px rgba(200,85,26,0.26)" }}>
            {pwBusy ? <><Loader2 size={14} style={{ animation:"spin 1s linear infinite" }}/> Updating…</> : "Update Password"}
          </button>
        </Panel>
      )}

      {/* Privacy */}
      <Panel title="Privacy">
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <Link href="/privacy" style={{ display:"inline-flex", alignItems:"center", gap:7,
            padding:"9px 18px", borderRadius:9, background:C.bg, border:`1.5px solid ${C.border}`,
            fontFamily:SANS, fontSize:13, fontWeight:600, color:C.sub, textDecoration:"none",
            transition:"all .15s" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.orange;e.currentTarget.style.color=C.orange}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.sub}}>
            <FileText size={13}/> Privacy Policy
          </Link>
          <Link href="/terms" style={{ display:"inline-flex", alignItems:"center", gap:7,
            padding:"9px 18px", borderRadius:9, background:C.bg, border:`1.5px solid ${C.border}`,
            fontFamily:SANS, fontSize:13, fontWeight:600, color:C.sub, textDecoration:"none",
            transition:"all .15s" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=C.orange;e.currentTarget.style.color=C.orange}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.sub}}>
            <FileText size={13}/> Terms of Service
          </Link>
        </div>
      </Panel>

      {/* Danger zone */}
      <div style={{ background:"#fff", borderRadius:20, padding:"24px",
        border:`1.5px solid #fecaca` }}>
        <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:10 }}>
          <div style={{ width:34, height:34, borderRadius:9, background:"#fef2f2",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Trash2 size={15} style={{ color:C.red }}/>
          </div>
          <p style={{ fontFamily:SANS, fontSize:15, fontWeight:800, color:C.red }}>Danger Zone</p>
        </div>
        <p style={{ fontFamily:SANS, fontSize:13, color:C.muted, lineHeight:1.75, marginBottom:16 }}>
          Permanently delete your account and all your data — saved articles, comments, purchases. This action <strong>cannot be undone.</strong>
        </p>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <input value={delText} onChange={e=>setDelText(e.target.value)}
            placeholder={`Type DELETE to confirm`}
            style={{ flex:1, padding:"10px 14px", borderRadius:9, border:`1.5px solid #fecaca`,
              fontFamily:SANS, fontSize:13, color:C.text, background:"#fff",
              outline:"none", maxWidth:280 }}/>
          <button onClick={deleteAccount} disabled={delText !== "DELETE"}
            style={{ padding:"10px 20px", borderRadius:9, border:"none",
              background: delText==="DELETE" ? C.red : "#f0dede",
              color: delText==="DELETE" ? "#fff" : "#c09090",
              fontFamily:SANS, fontSize:13, fontWeight:700,
              cursor: delText==="DELETE" ? "pointer" : "not-allowed",
              transition:"all .18s" }}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════
   ROOT DASHBOARD
════════════════════════════════════ */
export default function Dashboard() {
  const router = useRouter()

  const [user,         setUser]         = useState(null)
  const [authLoading,  setAuthLoading]  = useState(true)
  const [activeTab,    setActiveTab]    = useState("overview")
  const [savedArts,    setSavedArts]    = useState([])
  const [comments,     setComments]     = useState([])
  const [books,        setBooks]        = useState([])
  const [stats,        setStats]        = useState({ saved:0, liked:0, comments:0, books:0 })
  const [dataLoading,  setDataLoading]  = useState(false)
  const [toast,        setToast]        = useState(null)
  const [mobileOpen,   setMobileOpen]   = useState(false)

  const showToast = useCallback((msg, type="ok") => setToast({ msg, type }), [])

  /* ── auth guard ── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) { router.push("/signin"); return }
      setUser(session.user)
      setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session?.user) { router.push("/signin"); return }
      setUser(session.user)
    })
    return () => subscription.unsubscribe()
  }, [router])

  /* ── fetch all data ── */
  useEffect(() => {
    if (!user) return
    async function load() {
      setDataLoading(true)
      const [savesRes, likesRes, commentsRes, booksRes] = await Promise.all([
        supabase.from("article_saves").select("*").eq("user_id",user.id).order("created_at",{ascending:false}),
        supabase.from("article_likes").select("*",{count:"exact",head:true}).eq("user_id",user.id),
        supabase.from("article_comments").select("*").eq("user_id",user.id).order("created_at",{ascending:false}),
        supabase.from("user_books").select("*").eq("user_id",user.id).order("created_at",{ascending:false}),
      ])
      const saves = savesRes.data || []
      const coms  = commentsRes.data || []
      const bks   = booksRes.data || []
      setSavedArts(saves)
      setComments(coms)
      setBooks(bks)
      setStats({ saved:saves.length, liked:likesRes.count||0, comments:coms.length, books:bks.length })
      setDataLoading(false)
    }
    load()
  }, [user])

  function unsave(item) {
    setSavedArts(p => p.filter(a => a.id !== item.id))
    setStats(p => ({ ...p, saved: p.saved-1 }))
    supabase.from("article_saves").delete().eq("id",item.id).eq("user_id",user.id)
    showToast("Article removed from saved.")
  }

  function refreshUser() {
    supabase.auth.getUser().then(({ data: { user: u } }) => { if (u) setUser(u) })
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (authLoading) return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center",
      justifyContent:"center", flexDirection:"column", gap:14, fontFamily:SANS }}>
      <div style={{ width:48, height:48, borderRadius:13,
        background:`linear-gradient(135deg,${C.orange},#8a2e06)`,
        display:"flex", alignItems:"center", justifyContent:"center",
        boxShadow:"0 4px 18px rgba(200,85,26,0.35)", animation:"pulse 1.4s ease-in-out infinite" }}>
        <Flame size={24} color="#fff"/>
      </div>
      <p style={{ fontSize:13, color:C.muted, fontWeight:500 }}>Loading your dashboard…</p>
    </div>
  )

  const TABS = [
    { id:"overview",  icon:<LayoutDashboard size={16}/>, label:"Overview"        },
    { id:"saved",     icon:<Bookmark        size={16}/>, label:"Saved Articles"  },
    { id:"books",     icon:<ShoppingBag     size={16}/>, label:"My Books"        },
    { id:"profile",   icon:<User            size={16}/>, label:"Profile"         },
    { id:"settings",  icon:<Settings        size={16}/>, label:"Settings"        },
  ]

  const heading = {
    overview: "Overview",
    saved:    "Saved Articles",
    books:    "My Books",
    profile:  "My Profile",
    settings: "Settings",
  }

  return (
    <>
      {/* ── Keyframes + global layout ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Poppins:wght@400;500;600;700;800;900&display=swap');

        @keyframes spin    { to { transform:rotate(360deg) } }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cardIn  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.7;transform:scale(.94)} }
        @keyframes toastIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes drawerIn{ from{transform:translateX(-100%)} to{transform:translateX(0)} }
        @keyframes ovIn    { from{opacity:0} to{opacity:1} }
        @keyframes hereIn  { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }

        * { box-sizing:border-box; margin:0; padding:0; }

        .db-wrap {
          display: grid;
          grid-template-columns: 220px 1fr;
          min-height: calc(100vh - 62px);
          background: ${C.bg};
          max-width: 1300px;
          margin: 0 auto;
        }

        /* ── sidebar ── */
        .db-sidebar {
          border-right: 1.5px solid ${C.border};
          display: flex; flex-direction: column;
          position: sticky; top: 62px;
          height: calc(100vh - 62px);
          overflow-y: auto;
          padding: 20px 14px;
          background: ${C.card};
        }

        .db-tab {
          display: flex; align-items: center; gap: 11px;
          padding: 11px 14px; border-radius: 11px; margin-bottom: 3px;
          font-family: ${SANS}; font-size: 13.5px; font-weight: 500;
          color: ${C.sub}; border: none; background: none; cursor: pointer;
          transition: all .18s; width: 100%; text-align: left;
          text-decoration: none; position: relative;
        }
        .db-tab:hover  { background: ${C.light}; color: ${C.text}; }
        .db-tab.active { background: ${C.orange}0f; color: ${C.orange}; font-weight: 700; }
        .db-tab.active::before {
          content: ''; position: absolute; left: 0; top: 20%; bottom: 20%;
          width: 3px; background: ${C.orange}; border-radius: 0 2px 2px 0;
        }
        .db-tab.danger       { color: ${C.red}; }
        .db-tab.danger:hover { background: #fef2f2; color: ${C.red}; }

        /* ── mobile top bar ── */
        .db-mob-bar {
          display: none;
          background: ${C.card};
          border-bottom: 1.5px solid ${C.border};
          padding: 0 16px;
          overflow-x: auto; white-space: nowrap;
          scrollbar-width: none; gap: 0;
          position: sticky; top: 62px; z-index: 200;
        }
        .db-mob-bar::-webkit-scrollbar { display: none; }
        .db-mob-tab {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 13px 14px; font-family: ${SANS}; font-size: 12px;
          font-weight: 600; color: ${C.muted}; border: none; background: none;
          cursor: pointer; white-space: nowrap;
          border-bottom: 2.5px solid transparent; transition: all .18s;
        }
        .db-mob-tab.active { color: ${C.orange}; border-bottom-color: ${C.orange}; }

        /* ── main area ── */
        .db-main {
          padding: 28px 32px;
          min-width: 0;
        }

        .db-content { animation: fadeUp .3s ease-out both; }

        /* ── hero orbs ── */
        .db-hero { }
        .db-hero-orb {
          position: absolute; border-radius: 50%;
          pointer-events: none; opacity: .9;
        }
        .db-hero-orb1 { width:180px; height:180px; background:rgba(200,85,26,0.09); top:-60px; right:-40px; }
        .db-hero-orb2 { width:100px; height:100px; background:rgba(184,132,26,0.07); bottom:-20px; right:80px; }
        .db-hero-orb3 { width: 60px; height: 60px; background:rgba(255,255,255,0.04); bottom:20px; left:200px; }

        /* ── two-col grid ── */
        .db-2col { }

        /* ── mobile drawer overlay ── */
        .db-ov {
          display: none; position: fixed; inset: 0; z-index: 490;
          background: rgba(20,10,4,0.52); backdrop-filter: blur(5px);
          animation: ovIn .2s ease-out;
        }
        .db-drawer {
          display: none; position: fixed; top:0; left:0; bottom:0; z-index: 495;
          width: min(280px,82vw);
          background: ${C.card};
          box-shadow: 6px 0 40px rgba(0,0,0,0.18);
          flex-direction: column;
          animation: drawerIn .28s cubic-bezier(.16,1,.3,1);
          overflow-y: auto;
          padding: 20px 14px;
        }

        /* ── responsive ── */
        @media (max-width:900px) {
          .db-wrap        { grid-template-columns: 1fr; }
          .db-sidebar     { display: none; }
          .db-mob-bar     { display: flex; }
          .db-main        { padding: 18px 16px; }
          .db-2col        { grid-template-columns: 1fr !important; }
        }
        @media (max-width:640px) {
          .db-profile-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}

      {/* mobile tab bar */}
      <div className="db-mob-bar">
        {TABS.map(tab => (
          <button key={tab.id} className={`db-mob-tab${activeTab===tab.id?" active":""}`}
            onClick={()=>setActiveTab(tab.id)}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="db-wrap">

        {/* ════ SIDEBAR ════ */}
        <aside className="db-sidebar">
          {/* User summary */}
          <div style={{ padding:"10px 8px 18px", borderBottom:`1px solid ${C.border}`,
            marginBottom:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
              <Avatar user={user} size={44}/>
              <div style={{ minWidth:0, flex:1 }}>
                <p style={{ fontFamily:SANS, fontSize:13, fontWeight:700, color:C.text,
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
                </p>
                <p style={{ fontFamily:SANS, fontSize:11, color:C.muted,
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {user?.email}
                </p>
              </div>
            </div>
            {/* mini stats row */}
            <div style={{ display:"flex", background:C.bg, borderRadius:10,
              border:`1px solid ${C.border}`, overflow:"hidden" }}>
              {[
                { v:stats.saved,    l:"Saved" },
                { v:stats.liked,    l:"Liked" },
                { v:stats.books,    l:"Books" },
              ].map(({ v, l }, i) => (
                <div key={l} style={{ flex:1, textAlign:"center", padding:"8px 4px",
                  borderRight: i<2 ? `1px solid ${C.border}` : "none" }}>
                  <p style={{ fontFamily:SANS, fontSize:16, fontWeight:900, color:C.orange, lineHeight:1 }}>{v}</p>
                  <p style={{ fontFamily:SANS, fontSize:10, color:C.muted, marginTop:2 }}>{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Nav */}
          {TABS.map(tab => (
            <button key={tab.id} className={`db-tab${activeTab===tab.id?" active":""}`}
              onClick={()=>setActiveTab(tab.id)}>
              {tab.icon} {tab.label}
            </button>
          ))}

          <div style={{ flex:1 }}/>

          {/* Bottom actions */}
          <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:12, marginTop:12 }}>
            <Link href="/" className="db-tab">
              <ArrowLeft size={15}/> Back to Site
            </Link>
            <button className="db-tab danger" onClick={handleLogout}>
              <LogOut size={15}/> Sign Out
            </button>
          </div>
        </aside>

        {/* ════ MAIN ════ */}
        <main className="db-main">
          {/* Page heading */}
          <div style={{ marginBottom:24, animation:"hereIn .3s ease-out both" }}>
            <h2 style={{ fontFamily:SANS, fontSize:"clamp(20px,2.4vw,26px)", fontWeight:900,
              color:C.text, letterSpacing:"-0.025em" }}>
              {heading[activeTab]}
            </h2>
            {activeTab==="overview" && (
              <p style={{ fontFamily:SANS, fontSize:13, color:C.muted, marginTop:4 }}>
                Your spiritual journey at a glance
              </p>
            )}
          </div>

          {/* Content — key forces remount + re-animation on tab switch */}
          <div className="db-content" key={activeTab}>
            {activeTab==="overview" && (
              <OverviewView user={user} stats={stats}
                savedArticles={savedArts} comments={comments}/>
            )}
            {activeTab==="saved" && (
              <SavedView items={savedArts} onUnsave={unsave} loading={dataLoading}/>
            )}
            {activeTab==="books" && (
              <BooksView books={books} loading={dataLoading}/>
            )}
            {activeTab==="profile" && (
              <ProfileView user={user} onToast={showToast} onRefresh={refreshUser}/>
            )}
            {activeTab==="settings" && (
              <SettingsView user={user} onToast={showToast} onLogout={handleLogout}/>
            )}
          </div>
        </main>
      </div>
    </>
  )
}