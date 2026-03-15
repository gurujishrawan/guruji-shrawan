"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { supabase } from "../lib/supabaseClient"
import {
  FaArrowLeft, FaPlay, FaHeart, FaRegHeart,
  FaShare, FaComment, FaSearch, FaTimes, FaUpload,
  FaYoutube, FaFacebook, FaWhatsapp, FaInstagram,
  FaLink, FaCheck, FaBars, FaTh,
  FaEye, FaSortAmountDown, FaPlus,
  FaPaperPlane, FaChevronDown, FaExternalLinkAlt,
  FaSync, FaExclamationTriangle,
} from "react-icons/fa"

/* ══════════════════════════════════════════
   TYPES
══════════════════════════════════════════ */
type Video = {
  id: string
  title: string
  description: string
  youtube_id: string
  category: string
  duration: string
  views: number
  likes: number
  created_at: string
  is_featured?: boolean
  thumbnail_url?: string
}
type Comment = {
  id: string
  video_id: string
  user_name: string
  user_color: string
  text: string
  created_at: string
}

/* ══════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════ */
const CATEGORIES = ["All","Satsang","Q&A","Vedanta","Relationships","Youth","Meditation","Books"]
const AVATAR_COLORS = ["#c8551a","#b8841a","#2563eb","#16a34a","#9333ea","#0891b2"]
const SORT_OPTIONS = [
  { val:"newest",  label:"Newest First" },
  { val:"popular", label:"Most Liked" },
  { val:"views",   label:"Most Viewed" },
]
const YOUTUBE_CHANNEL = "UCxxxxxxxxxxxxxxxxxxxxxx"  // replace with your real channel ID

/* ══════════════════════════════════════════
   UTILS
══════════════════════════════════════════ */
function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60)      return `${s}s ago`
  if (s < 3600)    return `${Math.floor(s/60)}m ago`
  if (s < 86400)   return `${Math.floor(s/3600)}h ago`
  if (s < 2592000) return `${Math.floor(s/86400)}d ago`
  return `${Math.floor(s/2592000)}mo ago`
}
function fmtNum(n: number) {
  if (n >= 1_000_000) return `${(n/1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n/1_000).toFixed(1)}K`
  return String(n)
}
function ytThumb(id: string) {
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
}
function ytThumbFallback(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
}

/* Extract YouTube ID from any URL format */
function extractYtId(raw: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]
  for (const p of patterns) {
    const m = raw.match(p)
    if (m) return m[1]
  }
  return raw.trim()
}

/* ══════════════════════════════════════════
   SHARE SHEET
══════════════════════════════════════════ */
function ShareSheet({ video, onClose }: { video: Video; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const ytUrl = `https://youtube.com/watch?v=${video.youtube_id}`

  function copyLink() {
    navigator.clipboard.writeText(ytUrl).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2200)
    })
  }

  const PLATFORMS = [
    { icon: <FaYoutube/>,   label:"YouTube",   color:"#ff0000", href: ytUrl },
    { icon: <FaWhatsapp/>,  label:"WhatsApp",  color:"#25d366", href:`https://wa.me/?text=${encodeURIComponent(video.title+" "+ytUrl)}` },
    { icon: <FaFacebook/>,  label:"Facebook",  color:"#1877f2", href:`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(ytUrl)}` },
    { icon: <FaInstagram/>, label:"Instagram", color:"#e1306c", href:`https://instagram.com` },
  ]

  return (
    <div className="ss-backdrop" onClick={onClose}>
      <div className="ss" onClick={e=>e.stopPropagation()}>
        <div className="ss-handle"/>
        <div className="ss-header">
          <p className="ss-title">Share Video</p>
          <button className="ss-close" onClick={onClose}><FaTimes/></button>
        </div>
        <p className="ss-subtitle">{video.title}</p>
        <div className="ss-platforms">
          {PLATFORMS.map(p=>(
            <a key={p.label} href={p.href} target="_blank" rel="noopener noreferrer" className="ss-platform">
              <div className="ss-platform-icon" style={{background:p.color}}>{p.icon}</div>
              <span className="ss-platform-label">{p.label}</span>
            </a>
          ))}
        </div>
        <div className="ss-copy-row">
          <input className="ss-copy-input" value={ytUrl} readOnly/>
          <button className={`ss-copy-btn ${copied?"ss-copied":""}`} onClick={copyLink}>
            {copied ? <><FaCheck size={11}/> Copied!</> : <><FaLink size={11}/> Copy</>}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   COMMENTS PANEL
══════════════════════════════════════════ */
function CommentsPanel({ video, onClose }: { video: Video; onClose: () => void }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [text, setText]         = useState("")
  const [name, setName]         = useState("")
  const [loading, setLoading]   = useState(true)
  const [posting, setPosting]   = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadComments()
    const ch = supabase.channel(`vg-comments-${video.id}`)
      .on("postgres_changes", {
        event:"INSERT", schema:"public", table:"vg_comments", filter:`video_id=eq.${video.id}`
      }, p => setComments(c=>[...c, p.new as Comment]))
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [video.id])

  async function loadComments() {
    const { data } = await supabase.from("vg_comments")
      .select("*").eq("video_id", video.id).order("created_at", { ascending:true })
    setComments(data||[]); setLoading(false)
  }

  async function postComment() {
    if (!text.trim()) return
    setPosting(true)
    const uname = name.trim() || "Guest"
    const color = AVATAR_COLORS[Math.floor(Math.random()*AVATAR_COLORS.length)]
    await supabase.from("vg_comments").insert({ video_id:video.id, user_name:uname, user_color:color, text:text.trim() })
    setText(""); setPosting(false)
    setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}), 120)
  }

  return (
    <div className="cp-backdrop" onClick={onClose}>
      <div className="cp" onClick={e=>e.stopPropagation()}>
        <div className="cp-header">
          <div className="cp-title">
            <FaComment size={13}/> Comments
            <span className="cp-badge">{comments.length}</span>
          </div>
          <button className="cp-close" onClick={onClose}><FaTimes/></button>
        </div>

        <div className="cp-list">
          {loading && <div className="cp-loading"><div className="cp-spinner"/></div>}
          {!loading && comments.length===0 && (
            <div className="cp-empty">
              <FaComment size={28} style={{opacity:.15,marginBottom:10}}/>
              <p>No comments yet. Be the first!</p>
            </div>
          )}
          {comments.map(c=>(
            <div key={c.id} className="cp-comment">
              <div className="cp-avatar" style={{background:c.user_color||"#c8551a"}}>
                {(c.user_name||"G").charAt(0).toUpperCase()}
              </div>
              <div className="cp-comment-body">
                <div className="cp-comment-meta">
                  <span className="cp-comment-name">{c.user_name||"Guest"}</span>
                  <span className="cp-comment-time">{timeAgo(c.created_at)}</span>
                </div>
                <p className="cp-comment-text">{c.text}</p>
              </div>
            </div>
          ))}
          <div ref={bottomRef}/>
        </div>

        <div className="cp-input-wrap">
          <input className="cp-name" placeholder="Your name (optional)"
            value={name} onChange={e=>setName(e.target.value)} maxLength={40}/>
          <div className="cp-input-row">
            <textarea className="cp-textarea" placeholder="Write a thoughtful comment…"
              value={text} onChange={e=>setText(e.target.value)}
              rows={2} maxLength={500}
              onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();postComment()} }}
            />
            <button className="cp-send" onClick={postComment} disabled={!text.trim()||posting}>
              <FaPaperPlane size={13}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   UPLOAD MODAL
══════════════════════════════════════════ */
function UploadModal({ onClose, onUploaded }: { onClose:()=>void; onUploaded:()=>void }) {
  const [form, setForm] = useState({ title:"", description:"", youtube_id:"", category:"Satsang", duration:"" })
  const [preview, setPreview] = useState("")
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState("")
  const [thumbErr, setThumbErr] = useState(false)

  function setField(k:string, v:string) {
    setForm(f=>({...f,[k]:v}))
    if (k==="youtube_id") {
      const id = extractYtId(v)
      setPreview(id.length===11 ? id : "")
      setThumbErr(false)
    }
  }

  async function save() {
    if (!form.title.trim()||!form.youtube_id.trim()) return setError("Title and YouTube URL/ID are required.")
    setSaving(true); setError("")
    const ytId = extractYtId(form.youtube_id)
    const { error:err } = await supabase.from("vg_videos").insert({
      title: form.title.trim(),
      description: form.description.trim(),
      youtube_id: ytId,
      category: form.category,
      duration: form.duration.trim()||"—",
      views: 0, likes: 0,
    })
    setSaving(false)
    if (err) { setError(err.message); return }
    onUploaded(); onClose()
  }

  return (
    <div className="um-backdrop" onClick={onClose}>
      <div className="um" onClick={e=>e.stopPropagation()}>
        <div className="um-header">
          <div className="um-header-left">
            <div className="um-icon"><FaUpload size={14}/></div>
            <p className="um-title">Add Video</p>
          </div>
          <button className="um-close" onClick={onClose}><FaTimes/></button>
        </div>

        <div className="um-body">
          {/* Preview */}
          <div className="um-preview-wrap">
            {preview ? (
              <div className="um-preview">
                {!thumbErr
                  ? <Image src={ytThumb(preview)} alt="Preview" fill style={{objectFit:"cover"}}
                      onError={()=>setThumbErr(true)}/>
                  : <Image src={ytThumbFallback(preview)} alt="Preview" fill style={{objectFit:"cover"}}/>
                }
                <div className="um-preview-play"><FaPlay size={16}/></div>
                <div className="um-preview-label">Preview</div>
              </div>
            ) : (
              <div className="um-preview-empty">
                <FaYoutube size={28} style={{color:"#e8ddd0",marginBottom:8}}/>
                <p>Paste a YouTube URL to preview</p>
              </div>
            )}
          </div>

          <div className="um-fields">
            <div className="um-field">
              <label className="um-label">YouTube URL or Video ID *</label>
              <input className="um-input" placeholder="https://youtube.com/watch?v=... or shorts URL"
                value={form.youtube_id} onChange={e=>setField("youtube_id",e.target.value)}/>
              <p className="um-hint">Supports regular videos, Shorts, and embed URLs</p>
            </div>
            <div className="um-field">
              <label className="um-label">Title *</label>
              <input className="um-input" placeholder="Give this video a title" maxLength={120}
                value={form.title} onChange={e=>setField("title",e.target.value)}/>
            </div>
            <div className="um-field">
              <label className="um-label">Description</label>
              <textarea className="um-textarea" placeholder="Brief description of the teaching…"
                rows={3} maxLength={600}
                value={form.description} onChange={e=>setField("description",e.target.value)}/>
            </div>
            <div className="um-row">
              <div className="um-field" style={{flex:1}}>
                <label className="um-label">Category</label>
                <select className="um-select" value={form.category} onChange={e=>setField("category",e.target.value)}>
                  {CATEGORIES.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="um-field" style={{flex:1}}>
                <label className="um-label">Duration</label>
                <input className="um-input" placeholder="e.g. 28:14"
                  value={form.duration} onChange={e=>setField("duration",e.target.value)}/>
              </div>
            </div>
            {error && <div className="um-error"><FaExclamationTriangle size={11}/> {error}</div>}
            <button className="um-save" onClick={save} disabled={saving||!form.title.trim()||!form.youtube_id.trim()}>
              {saving ? <><div className="um-spinner"/> Uploading…</> : <><FaPlus size={11}/> Add to Gallery</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   PLAYER MODAL — redesigned cinematic popup
══════════════════════════════════════════ */
function PlayerModal({ video, liked, onLike, onClose, onComment, onShare }: {
  video: Video; liked: boolean; onLike:()=>void
  onClose:()=>void; onComment:()=>void; onShare:()=>void
}) {
  const [embedErr, setEmbedErr] = useState(false)
  const [thumbErr, setThumbErr] = useState(false)
  const [likeAnim, setLikeAnim] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    function handleMsg(e: MessageEvent) {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data
        if (data?.event === "onError" && [101,150,153,2].includes(data?.info)) setEmbedErr(true)
      } catch {}
    }
    window.addEventListener("message", handleMsg)
    // lock body scroll
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("message", handleMsg)
      document.body.style.overflow = ""
    }
  }, [])

  function handleLike() {
    setLikeAnim(true)
    setTimeout(()=>setLikeAnim(false), 500)
    onLike()
  }

  const ytWatchUrl = `https://youtube.com/watch?v=${video.youtube_id}`

  return (
    <div className="pm-backdrop" onClick={onClose}>
      <div className="pm-container" onClick={e=>e.stopPropagation()}>

        {/* ── Close pill ── */}
        <button className="pm-close-pill" onClick={onClose}>
          <FaTimes size={12}/> Close
        </button>

        {/* ── Main modal card ── */}
        <div className="pm-card">

          {/* Player */}
          <div className="pm-player-wrap">
            {!embedErr ? (
              <iframe
                ref={iframeRef}
                width="560" height="315"
                src={`https://www.youtube.com/embed/${video.youtube_id}?si=bwL1fCr7f1COki0x&autoplay=1&rel=0&color=white`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                style={{position:"absolute",inset:0,width:"100%",height:"100%",border:"none"}}
                onError={()=>setEmbedErr(true)}
              />
            ) : (
              <div className="pm-fallback">
                {!thumbErr
                  ? <Image src={ytThumb(video.youtube_id)} alt={video.title} fill
                      style={{objectFit:"cover"}} onError={()=>setThumbErr(true)}/>
                  : <Image src={ytThumbFallback(video.youtube_id)} alt={video.title} fill style={{objectFit:"cover"}}/>
                }
                <div className="pm-fb-overlay"/>
                <div className="pm-fb-content">
                  <div className="pm-fb-icon"><FaYoutube size={36}/></div>
                  <p className="pm-fb-title">Can't play inline</p>
                  <p className="pm-fb-sub">This video is set to play on YouTube only.</p>
                  <a href={ytWatchUrl} target="_blank" rel="noopener noreferrer" className="pm-fb-btn">
                    <FaYoutube size={13}/> Watch on YouTube
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Info panel */}
          <div className="pm-body">

            {/* Left: text */}
            <div className="pm-body-left">
              <div className="pm-badges">
                <span className="pm-cat-badge">{video.category}</span>
                {video.duration && <span className="pm-dur-badge">{video.duration}</span>}
              </div>
              <h2 className="pm-title">{video.title}</h2>
              <div className="pm-stats-row">
                <span className="pm-stat-item"><FaEye size={10}/> {fmtNum(video.views)} views</span>
                <span className="pm-stat-dot"/>
                <span className="pm-stat-item">{timeAgo(video.created_at)}</span>
                <a href={ytWatchUrl} target="_blank" rel="noopener noreferrer" className="pm-yt-badge">
                  <FaYoutube size={11}/> YouTube
                </a>
              </div>
              {video.description && (
                <p className="pm-desc">{video.description}</p>
              )}
            </div>

            {/* Right: action column */}
            <div className="pm-body-right">
              <button
                className={`pm-big-action pm-like-action ${liked?"pm-liked":""} ${likeAnim?"pm-like-pop":""}`}
                onClick={handleLike}
              >
                <div className="pm-big-action-icon">
                  {liked ? <FaHeart/> : <FaRegHeart/>}
                </div>
                <span className="pm-big-action-count">{fmtNum(video.likes+(liked?1:0))}</span>
                <span className="pm-big-action-label">Like</span>
              </button>

              <button className="pm-big-action" onClick={onComment}>
                <div className="pm-big-action-icon"><FaComment/></div>
                <span className="pm-big-action-label">Comment</span>
              </button>

              <button className="pm-big-action" onClick={onShare}>
                <div className="pm-big-action-icon"><FaShare/></div>
                <span className="pm-big-action-label">Share</span>
              </button>

              <a href={ytWatchUrl} target="_blank" rel="noopener noreferrer" className="pm-big-action pm-yt-action">
                <div className="pm-big-action-icon"><FaYoutube/></div>
                <span className="pm-big-action-label">Open</span>
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   VIDEO CARD
══════════════════════════════════════════ */
function VideoCard({ video, onPlay, onLike, liked, layout }: {
  video: Video; onPlay:()=>void; onLike:()=>void; liked:boolean; layout:"grid"|"list"
}) {
  const [hover, setHover]       = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [thumbErr, setThumbErr]  = useState(false)

  const thumb = thumbErr ? ytThumbFallback(video.youtube_id) : ytThumb(video.youtube_id)

  if (layout==="list") return (
    <>
      <div className={`vlc ${hover?"vlc-h":""}`}
        onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
        <div className="vlc-thumb" onClick={onPlay}>
          <Image src={thumb} alt={video.title} fill
            sizes="(max-width:768px) 45vw, 240px"
            style={{objectFit:"cover",transition:"transform .4s",transform:hover?"scale(1.05)":"scale(1)"}}
            onError={()=>setThumbErr(true)}/>
          <div className="vlc-overlay"/>
          <div className={`vlc-play ${hover?"vlc-play-show":""}`}><FaPlay size={13}/></div>
          {video.duration&&<div className="v-dur">{video.duration}</div>}
        </div>
        <div className="vlc-info">
          <div className="vlc-top">
            <span className="v-cat">{video.category}</span>
            {video.is_featured&&<span className="v-feat">Featured</span>}
          </div>
          <h3 className="vlc-title" onClick={onPlay}>{video.title}</h3>
          {video.description&&<p className="vlc-desc">{video.description}</p>}
          <div className="vlc-meta">
            <span><FaEye size={9}/> {fmtNum(video.views)}</span>
            <span>{timeAgo(video.created_at)}</span>
          </div>
          <div className="vlc-actions">
            <button className={`v-act ${liked?"v-act-liked":""}`} onClick={e=>{e.stopPropagation();onLike()}}>
              {liked?<FaHeart/>:<FaRegHeart/>} {fmtNum(video.likes+(liked?1:0))}
            </button>
            <button className="v-act" onClick={e=>{e.stopPropagation();setShowShare(true)}}><FaShare/> Share</button>
            <button className="v-act v-act-watch" onClick={onPlay}><FaPlay size={9}/> Watch</button>
          </div>
        </div>
      </div>
      {showShare&&<ShareSheet video={video} onClose={()=>setShowShare(false)}/>}
    </>
  )

  return (
    <>
      <div className={`vgc ${hover?"vgc-h":""}`}
        onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
        <div className="vgc-thumb" onClick={onPlay}>
          <Image src={thumb} alt={video.title} fill
            sizes="(max-width:640px) 90vw,(max-width:1200px) 45vw,30vw"
            style={{objectFit:"cover",transition:"transform .4s",transform:hover?"scale(1.06)":"scale(1)"}}
            onError={()=>setThumbErr(true)}/>
          <div className="vgc-overlay"/>
          <div className={`vgc-play ${hover?"vgc-play-show":""}`}><FaPlay size={14}/></div>
          {video.duration&&<div className="v-dur">{video.duration}</div>}
          {video.is_featured&&<div className="v-feat-badge">★ Featured</div>}
          {/* quick actions on hover */}
          <div className={`vgc-quick ${hover?"vgc-quick-show":""}`}>
            <button className={`vgc-q-btn ${liked?"vgc-q-liked":""}`}
              onClick={e=>{e.stopPropagation();onLike()}}>
              {liked?<FaHeart size={12}/>:<FaRegHeart size={12}/>} {fmtNum(video.likes+(liked?1:0))}
            </button>
            <button className="vgc-q-btn" onClick={e=>{e.stopPropagation();setShowShare(true)}}>
              <FaShare size={11}/>
            </button>
          </div>
        </div>
        <div className="vgc-info">
          <div className="vgc-top-row">
            <span className="v-cat">{video.category}</span>
            <span className="vgc-time">{timeAgo(video.created_at)}</span>
          </div>
          <h3 className="vgc-title" onClick={onPlay}>{video.title}</h3>
          <div className="vgc-bottom">
            <span className="vgc-stat"><FaEye size={9}/> {fmtNum(video.views)}</span>
            <span className="vgc-stat"><FaRegHeart size={9}/> {fmtNum(video.likes)}</span>
          </div>
        </div>
      </div>
      {showShare&&<ShareSheet video={video} onClose={()=>setShowShare(false)}/>}
    </>
  )
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function VideoGalleryPage() {
  const [videos, setVideos]         = useState<Video[]>([])
  const [loading, setLoading]       = useState(true)
  const [user, setUser]             = useState<any>(null)
  const [isAdmin, setIsAdmin]       = useState(false)
  const [activeVideo, setActiveVideo] = useState<Video|null>(null)
  const [showComments, setShowComments] = useState(false)
  const [showShare, setShowShare]   = useState(false)
  const [likedIds, setLikedIds]     = useState<Set<string>>(new Set())
  const [showUpload, setShowUpload] = useState(false)
  const [category, setCategory]     = useState("All")
  const [sort, setSort]             = useState("newest")
  const [search, setSearch]         = useState("")
  const [layout, setLayout]         = useState<"grid"|"list">("grid")
  const [showSort, setShowSort]     = useState(false)
  const [page, setPage]             = useState(1)
  const [syncing, setSyncing]       = useState(false)
  const PER = 12

  /* auth */
  useEffect(() => {
    supabase.auth.getSession().then(({data}) => {
      setUser(data.session?.user??null)
      const em = data.session?.user?.email??""
      setIsAdmin(em.includes("gurujishrawan")||em.includes("admin"))
    })
    const {data:l} = supabase.auth.onAuthStateChange((_,s) => {
      setUser(s?.user??null)
      const em = s?.user?.email??""
      setIsAdmin(em.includes("gurujishrawan")||em.includes("admin"))
    })
    return ()=>l.subscription.unsubscribe()
  },[])

  /* liked from localStorage */
  useEffect(()=>{
    try { setLikedIds(new Set(JSON.parse(localStorage.getItem("vg_liked")||"[]"))) } catch{}
  },[])

  /* load videos */
  const loadVideos = useCallback(async()=>{
    setLoading(true)
    let q = supabase.from("vg_videos").select("*")
    if (sort==="newest")  q=q.order("created_at",{ascending:false})
    if (sort==="popular") q=q.order("likes",{ascending:false})
    if (sort==="views")   q=q.order("views",{ascending:false})
    const {data} = await q
    setVideos(data||[])
    setLoading(false)
  },[sort])

  useEffect(()=>{ loadVideos() },[loadVideos])

  /* realtime */
  useEffect(()=>{
    const ch = supabase.channel("vg-rt")
      .on("postgres_changes",{event:"UPDATE",schema:"public",table:"vg_videos"},
        p=>setVideos(prev=>prev.map(v=>v.id===p.new.id?{...v,...p.new}:v)))
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"vg_videos"},
        ()=>loadVideos())
      .subscribe()
    return ()=>{ supabase.removeChannel(ch) }
  },[loadVideos])

  /* open video */
  async function openVideo(video:Video) {
    setActiveVideo(video); setShowComments(false); setShowShare(false)
    await supabase.from("vg_videos").update({views:video.views+1}).eq("id",video.id)
  }

  /* like toggle */
  async function toggleLike(video:Video) {
    const already = likedIds.has(video.id)
    const ns = new Set(likedIds)
    const nl = already ? Math.max(0,video.likes-1) : video.likes+1
    already ? ns.delete(video.id) : ns.add(video.id)
    setLikedIds(ns)
    localStorage.setItem("vg_liked",JSON.stringify([...ns]))
    setVideos(prev=>prev.map(v=>v.id===video.id?{...v,likes:nl}:v))
    if (activeVideo?.id===video.id) setActiveVideo(av=>av?{...av,likes:nl}:null)
    await supabase.from("vg_videos").update({likes:nl}).eq("id",video.id)
  }

  /* YouTube auto-sync (admin only) — fetches latest uploads via API */
  async function syncFromYouTube() {
    /* 
      This calls your own Next.js API route /api/youtube-sync
      which uses the YouTube Data API v3 to fetch your channel's
      latest videos and upserts them into vg_videos.
      Set up: see youtube_sync_api.ts route file.
    */
    setSyncing(true)
    try {
      const res = await fetch("/api/youtube-sync", { method:"POST" })
      const data = await res.json()
      if (data.synced) { await loadVideos() }
    } catch(e) { console.error("Sync failed", e) }
    setSyncing(false)
  }

  /* filter */
  const filtered = videos.filter(v=>{
    const mC = category==="All"||v.category===category
    const mQ = !search||v.title.toLowerCase().includes(search.toLowerCase())||(v.description||"").toLowerCase().includes(search.toLowerCase())
    return mC&&mQ
  })
  const paged   = filtered.slice(0,page*PER)
  const hasMore = paged.length < filtered.length
  const featured = videos.find(v=>v.is_featured)||videos[0]

  return (
    <div className="vg">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Poppins:wght@300;400;500;600;700;800&display=swap');

        :root {
          --o:      #c8551a;
          --g:      #b8841a;
          --bg:     #faf7f2;
          --bg2:    #f4efe6;
          --card:   #ffffff;
          --border: #e8ddd0;
          --border2:#d8c9b8;
          --text:   #1a1008;
          --muted:  #8a7a6a;
          --sans:   'Poppins',system-ui,sans-serif;
          --body:   'Lora',Georgia,serif;
          --shadow: 0 2px 12px rgba(26,16,8,.08);
          --shadow2: 0 8px 32px rgba(26,16,8,.12);
        }

        @keyframes vg-up    { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes vg-in    { from{opacity:0} to{opacity:1} }
        @keyframes vg-scale { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
        @keyframes vg-sheet { from{transform:translateY(60px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes vg-spin  { to{transform:rotate(360deg)} }
        @keyframes vg-shimmer{ from{background-position:-200% 0} to{background-position:200% 0} }

        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0 }

        .vg {
          background: var(--bg);
          color: var(--text);
          font-family: var(--sans);
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ══════════════════
           PAGE HEADER
        ══════════════════ */
        .vg-header {
          background: var(--card);
          border-bottom: 1px solid var(--border);
          padding: 28px 0 0;
          position: sticky; top: 0; z-index: 80;
        }
        .vg-header-top {
          max-width: 1240px; margin: 0 auto; padding: 0 24px;
          display: flex; align-items: center; gap: 16px;
          padding-bottom: 20px;
        }
        .vg-back {
          display: flex; align-items: center; gap: 7px;
          color: var(--muted); text-decoration: none;
          font-size: 12px; font-weight: 600; letter-spacing: .12em;
          text-transform: uppercase; flex-shrink: 0;
          transition: color .2s ease, gap .2s ease;
        }
        .vg-back:hover { color: var(--o); gap: 11px; }
        .vg-heading {
          font-family: var(--body);
          font-size: 22px; font-weight: 700;
          color: var(--text); flex-shrink: 0;
          letter-spacing: -.01em;
        }
        .vg-heading span { color: var(--o); }
        /* search */
        .vg-search-wrap {
          flex: 1; max-width: 420px;
          position: relative; margin: 0 auto;
        }
        .vg-search-ico {
          position: absolute; left: 13px; top: 50%;
          transform: translateY(-50%);
          color: var(--muted); font-size: 13px; pointer-events: none;
        }
        .vg-search {
          width: 100%;
          background: var(--bg);
          border: 1.5px solid var(--border);
          border-radius: 99px;
          padding: 9px 36px 9px 36px;
          font-family: var(--sans); font-size: 13px; color: var(--text);
          outline: none;
          transition: border-color .22s ease, box-shadow .22s ease;
        }
        .vg-search::placeholder { color: var(--muted); }
        .vg-search:focus { border-color: rgba(200,85,26,.5); box-shadow: 0 0 0 3px rgba(200,85,26,.1); }
        .vg-search-x {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; color: var(--muted);
          cursor: pointer; font-size: 12px; display: flex; align-items: center;
          transition: color .2s;
        }
        .vg-search-x:hover { color: var(--text); }
        /* right controls */
        .vg-controls { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .vg-layout-btn {
          width: 36px; height: 36px; border-radius: 8px;
          border: 1.5px solid var(--border); background: var(--card);
          color: var(--muted); display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 13px;
          transition: color .2s, border-color .2s, background .2s;
        }
        .vg-layout-btn.vg-active, .vg-layout-btn:hover { color: var(--o); border-color: rgba(200,85,26,.4); background: rgba(200,85,26,.06); }
        .vg-sync-btn {
          display: flex; align-items: center; gap: 6px;
          background: var(--bg2); border: 1.5px solid var(--border);
          border-radius: 8px; padding: 8px 14px;
          font-family: var(--sans); font-size: 11px; font-weight: 700;
          color: var(--muted); cursor: pointer; letter-spacing: .06em;
          text-transform: uppercase;
          transition: color .2s, border-color .2s, background .2s;
        }
        .vg-sync-btn:hover { color: var(--o); border-color: rgba(200,85,26,.4); }
        .vg-sync-ico { animation: ${syncing?"vg-spin 1s linear infinite":"none"}; }
        .vg-upload-btn {
          display: flex; align-items: center; gap: 7px;
          background: linear-gradient(135deg, var(--o), #8a2e06);
          color: #fff; border: none; border-radius: 8px;
          padding: 9px 18px;
          font-family: var(--sans); font-size: 12px; font-weight: 700;
          cursor: pointer; letter-spacing: .04em;
          box-shadow: 0 4px 16px rgba(200,85,26,.28);
          transition: transform .2s, box-shadow .2s;
          white-space: nowrap;
        }
        .vg-upload-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(200,85,26,.42); }

        /* filter bar */
        .vg-filters {
          max-width: 1240px; margin: 0 auto; padding: 0 24px;
          display: flex; align-items: center; gap: 0;
          overflow-x: auto; scrollbar-width: none; border-top: 1px solid var(--border);
        }
        .vg-filters::-webkit-scrollbar { display: none; }
        .vg-filter-btn {
          padding: 12px 16px; background: none; border: none;
          font-family: var(--sans); font-size: 12px; font-weight: 600;
          color: var(--muted); cursor: pointer; white-space: nowrap;
          border-bottom: 2px solid transparent; margin-bottom: -1px;
          transition: color .2s, border-color .2s;
        }
        .vg-filter-btn:hover { color: var(--text); }
        .vg-filter-btn.vg-active { color: var(--o); border-bottom-color: var(--o); }
        .vg-filter-gap { flex: 1; }
        /* sort */
        .vg-sort-wrap { position: relative; padding: 6px 0; flex-shrink: 0; }
        .vg-sort-btn {
          display: flex; align-items: center; gap: 6px;
          background: var(--bg); border: 1.5px solid var(--border);
          border-radius: 8px; padding: 7px 12px;
          font-family: var(--sans); font-size: 11px; font-weight: 600;
          color: var(--muted); cursor: pointer;
          transition: border-color .2s, color .2s;
        }
        .vg-sort-btn:hover { border-color: var(--border2); color: var(--text); }
        .vg-sort-drop {
          position: absolute; right: 0; top: calc(100%+4px);
          background: var(--card); border: 1.5px solid var(--border);
          border-radius: 12px; overflow: hidden; z-index: 60; min-width: 158px;
          box-shadow: var(--shadow2);
          animation: vg-scale .16s ease;
        }
        .vg-sort-opt {
          display: block; width: 100%; text-align: left; background: none;
          border: none; padding: 11px 16px;
          font-family: var(--sans); font-size: 12px; font-weight: 500;
          color: var(--muted); cursor: pointer;
          transition: background .15s, color .15s;
        }
        .vg-sort-opt:hover { background: var(--bg); color: var(--text); }
        .vg-sort-opt.vg-active { color: var(--o); font-weight: 700; }

        /* ══════════════════
           FEATURED HERO
        ══════════════════ */
        .vg-hero {
          position: relative; overflow: hidden;
          height: clamp(240px, 38vw, 460px);
          cursor: pointer;
          background: #1a1008;
        }
        .vg-hero-img { transition: transform .6s ease; }
        .vg-hero:hover .vg-hero-img { transform: scale(1.03); }
        .vg-hero-grad {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background:
            linear-gradient(to top, rgba(26,16,8,.95) 0%, rgba(26,16,8,.6) 35%, rgba(26,16,8,.1) 70%),
            linear-gradient(to right, rgba(26,16,8,.5), transparent 55%);
        }
        .vg-hero-play {
          position: absolute; top: 50%; left: 50%; z-index: 2;
          transform: translate(-50%,-50%);
          width: 64px; height: 64px; border-radius: 50%;
          background: linear-gradient(135deg,var(--o),#8a2e06);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 18px; padding-left: 3px;
          box-shadow: 0 8px 32px rgba(200,85,26,.5);
          transition: transform .25s, box-shadow .25s;
        }
        .vg-hero:hover .vg-hero-play { transform: translate(-50%,-50%) scale(1.1); box-shadow: 0 12px 40px rgba(200,85,26,.6); }
        .vg-hero-content {
          position: absolute; bottom: 0; left: 0; right: 0; z-index: 2;
          padding: 24px 32px;
        }
        .vg-hero-cat {
          display: inline-block; font-size: 9px; font-weight: 700;
          text-transform: uppercase; letter-spacing: .2em; color: #fff;
          background: var(--o); padding: 4px 12px; border-radius: 99px; margin-bottom: 8px;
        }
        .vg-hero-title {
          font-family: var(--body); font-size: clamp(18px,2.8vw,34px);
          font-weight: 700; color: #fff; line-height: 1.2; max-width: 600px; margin-bottom: 8px;
        }
        .vg-hero-meta { display: flex; gap: 14px; flex-wrap: wrap; }
        .vg-hero-meta span {
          font-size: 11px; color: rgba(255,255,255,.62);
          display: flex; align-items: center; gap: 4px;
        }
        .vg-feat-pill {
          border: 1px solid rgba(184,132,26,.5); color: var(--g) !important;
          padding: 2px 9px; border-radius: 99px; font-size: 9px !important;
          font-weight: 700; text-transform: uppercase; letter-spacing: .14em;
        }

        /* ══════════════════
           CONTENT
        ══════════════════ */
        .vg-main { max-width: 1240px; margin: 0 auto; padding: 28px 24px 80px; }
        .vg-result-bar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 22px; flex-wrap: wrap; gap: 8px;
        }
        .vg-result-text { font-size: 13px; color: var(--muted); font-weight: 500; }
        .vg-result-text strong { color: var(--text); font-weight: 700; }

        /* ══════════════════
           GRID CARDS
        ══════════════════ */
        .vg-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(268px,1fr));
          gap: 20px;
        }
        .vgc {
          background: var(--card); border-radius: 14px; overflow: hidden;
          border: 1.5px solid var(--border); cursor: pointer;
          transition: transform .28s ease, box-shadow .28s ease, border-color .28s ease;
        }
        .vgc-h { transform: translateY(-3px); box-shadow: var(--shadow2); border-color: var(--border2); }
        .vgc-thumb { position: relative; aspect-ratio: 16/9; overflow: hidden; background: var(--bg2); }
        .vgc-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(26,16,8,.45), transparent 50%);
          transition: opacity .3s;
        }
        .vgc-h .vgc-overlay { opacity: .7; }
        .vgc-play {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%,-50%) scale(.85); opacity: 0;
          width: 44px; height: 44px; border-radius: 50%;
          background: linear-gradient(135deg,var(--o),#8a2e06);
          color: #fff; display: flex; align-items: center; justify-content: center;
          padding-left: 2px;
          transition: transform .22s, opacity .22s, box-shadow .22s;
        }
        .vgc-play-show { transform: translate(-50%,-50%) scale(1) !important; opacity: 1 !important; box-shadow: 0 6px 20px rgba(200,85,26,.45); }
        /* quick action strip */
        .vgc-quick {
          position: absolute; top: 8px; right: 8px; z-index: 2;
          display: flex; flex-direction: column; gap: 5px;
          opacity: 0; transform: translateX(6px);
          transition: opacity .22s, transform .22s;
        }
        .vgc-quick-show { opacity: 1 !important; transform: translateX(0) !important; }
        .vgc-q-btn {
          display: flex; align-items: center; gap: 4px;
          background: rgba(250,247,242,.92); backdrop-filter: blur(8px);
          border: 1px solid rgba(232,221,208,.6); border-radius: 99px;
          color: var(--text); font-size: 11px; font-weight: 600;
          padding: 4px 10px; cursor: pointer;
          transition: color .2s, background .2s;
        }
        .vgc-q-btn:hover { background: #fff; color: var(--o); }
        .vgc-q-liked { color: #e05050 !important; }
        .vgc-info { padding: 14px 14px 16px; }
        .vgc-top-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; }
        .vgc-time { font-size: 10px; color: var(--muted); }
        .vgc-title {
          font-family: var(--sans); font-size: 14px; font-weight: 700; color: var(--text);
          line-height: 1.45; cursor: pointer;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
          margin-bottom: 8px; transition: color .2s;
        }
        .vgc-title:hover { color: var(--o); }
        .vgc-bottom { display: flex; gap: 12px; }
        .vgc-stat { font-size: 11px; color: var(--muted); display: flex; align-items: center; gap: 4px; }

        /* ══════════════════
           LIST CARDS
        ══════════════════ */
        .vg-list { display: flex; flex-direction: column; gap: 14px; }
        .vlc {
          display: grid; grid-template-columns: 240px 1fr;
          background: var(--card); border-radius: 14px; overflow: hidden;
          border: 1.5px solid var(--border); cursor: pointer;
          transition: transform .28s, box-shadow .28s, border-color .28s;
        }
        .vlc-h { transform: translateY(-2px); box-shadow: var(--shadow2); border-color: var(--border2); }
        .vlc-thumb { position: relative; background: var(--bg2); overflow: hidden; }
        .vlc-overlay { position: absolute; inset: 0; background: linear-gradient(to top,rgba(26,16,8,.4),transparent 50%); }
        .vlc-play {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%,-50%) scale(.85); opacity: 0;
          width: 40px; height: 40px; border-radius: 50%;
          background: linear-gradient(135deg,var(--o),#8a2e06);
          color: #fff; display: flex; align-items: center; justify-content: center;
          transition: transform .22s, opacity .22s;
        }
        .vlc-play-show { opacity: 1 !important; transform: translate(-50%,-50%) scale(1) !important; }
        .vlc-info { padding: 16px 20px; display: flex; flex-direction: column; gap: 4px; }
        .vlc-top { display: flex; align-items: center; gap: 8px; margin-bottom: 2px; }
        .vlc-title {
          font-size: 15px; font-weight: 700; color: var(--text); line-height: 1.4;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
          transition: color .2s;
        }
        .vlc-title:hover { color: var(--o); }
        .vlc-desc {
          font-family: var(--body); font-size: 13px; font-style: italic;
          color: var(--muted); line-height: 1.65;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .vlc-meta { display: flex; gap: 12px; font-size: 11px; color: var(--muted); }
        .vlc-meta span { display: flex; align-items: center; gap: 4px; }
        .vlc-actions { display: flex; gap: 7px; margin-top: 6px; flex-wrap: wrap; }

        /* shared small tags */
        .v-cat {
          font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .18em;
          color: var(--o); background: rgba(200,85,26,.1); border: 1px solid rgba(200,85,26,.2);
          padding: 3px 9px; border-radius: 99px;
        }
        .v-feat {
          font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .14em;
          color: var(--g); border: 1px solid rgba(184,132,26,.35);
          padding: 3px 9px; border-radius: 99px;
        }
        .v-feat-badge {
          position: absolute; top: 8px; left: 8px; z-index: 2;
          background: linear-gradient(135deg,var(--o),var(--g));
          color: #fff; font-size: 9px; font-weight: 700; letter-spacing: .12em;
          text-transform: uppercase; padding: 4px 10px; border-radius: 99px;
        }
        .v-dur {
          position: absolute; bottom: 7px; right: 7px;
          background: rgba(26,16,8,.85); color: #fff; border-radius: 5px;
          font-size: 10px; font-weight: 700; padding: 2px 6px; letter-spacing: .04em;
        }
        .v-act {
          display: flex; align-items: center; gap: 5px;
          background: var(--bg); border: 1.5px solid var(--border); border-radius: 99px;
          padding: 6px 13px; font-family: var(--sans); font-size: 11px; font-weight: 600;
          color: var(--muted); cursor: pointer;
          transition: color .2s, border-color .2s, background .2s;
        }
        .v-act:hover { color: var(--text); border-color: var(--border2); background: var(--bg2); }
        .v-act-liked { color: #e05050 !important; border-color: rgba(224,80,80,.35) !important; }
        .v-act-watch { color: var(--o) !important; border-color: rgba(200,85,26,.35) !important; }
        .v-act-watch:hover { background: rgba(200,85,26,.08) !important; }

        /* load more */
        .vg-more { display: flex; justify-content: center; margin-top: 44px; }
        .vg-more-btn {
          display: flex; align-items: center; gap: 8px;
          background: var(--card); border: 1.5px solid var(--border); border-radius: 99px;
          padding: 12px 32px;
          font-family: var(--sans); font-size: 13px; font-weight: 600; color: var(--muted);
          cursor: pointer; transition: color .22s, border-color .22s, background .22s;
        }
        .vg-more-btn:hover { color: var(--text); border-color: var(--border2); background: var(--bg2); }

        /* empty */
        .vg-empty { text-align: center; padding: 80px 20px; color: var(--muted); }
        .vg-empty-ico { font-size: 44px; opacity: .2; margin-bottom: 14px; }
        .vg-empty-ttl { font-family: var(--body); font-size: 20px; font-style: italic; color: var(--text); margin-bottom: 6px; }
        .vg-empty-sub { font-size: 13px; line-height: 1.7; }

        /* skeleton */
        .vg-skel { display: grid; grid-template-columns: repeat(auto-fill,minmax(268px,1fr)); gap: 20px; }
        .sk { background: var(--card); border-radius: 14px; border: 1.5px solid var(--border); overflow: hidden; }
        .sk-t { aspect-ratio: 16/9; background: var(--bg2); position: relative; overflow: hidden; }
        .sk-t::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(232,221,208,.6),transparent); background-size:200% 100%; animation:vg-shimmer 1.6s infinite; }
        .sk-b { padding: 14px; }
        .sk-l { background: var(--bg2); border-radius: 4px; margin-bottom: 8px; }

        /* ══════════════════════════════
           PLAYER MODAL — fully responsive
        ══════════════════════════════ */
        @keyframes pm-in    { from{opacity:0} to{opacity:1} }
        @keyframes pm-up    { from{opacity:0;transform:translateY(32px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes pm-heart { 0%{transform:scale(1)} 35%{transform:scale(1.45)} 65%{transform:scale(.9)} 100%{transform:scale(1)} }

        /* ── backdrop ── */
        .pm-backdrop {
          position: fixed; inset: 0; z-index: 400;
          background: rgba(12,8,4,.88);
          backdrop-filter: blur(16px) saturate(1.3);
          display: flex; align-items: center; justify-content: center;
          padding: 20px 16px;
          overflow-y: auto;
          animation: pm-in .2s ease;
        }

        /* ── outer wrapper: constrain width, stack close+card ── */
        .pm-container {
          width: 100%;
          max-width: 860px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          animation: pm-up .28s ease;
          /* vertically centre while still scrollable on tiny screens */
          margin: auto;
        }

        /* ── close pill ── */
        .pm-close-pill {
          align-self: flex-end;
          display: flex; align-items: center; gap: 7px;
          background: rgba(255,255,255,.1);
          border: 1px solid rgba(255,255,255,.2);
          border-radius: 99px; padding: 8px 18px;
          font-family: var(--sans); font-size: 11px; font-weight: 700;
          letter-spacing: .08em;
          color: rgba(255,255,255,.75); cursor: pointer;
          backdrop-filter: blur(6px);
          transition: background .2s, color .2s, border-color .2s;
        }
        .pm-close-pill:hover { background: rgba(255,255,255,.18); color: #fff; border-color: rgba(255,255,255,.4); }

        /* ── main white card ── */
        .pm-card {
          width: 100%;
          background: var(--card);
          border-radius: 18px;
          overflow: hidden;
          border: 1.5px solid var(--border);
          box-shadow: 0 32px 64px rgba(0,0,0,.55);
        }

        /* ── 16:9 player ── */
        .pm-player-wrap {
          position: relative;
          width: 100%;
          padding-top: 56.25%; /* 16:9 */
          background: #000;
        }
        .pm-player-wrap iframe,
        .pm-player-wrap .pm-fallback {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        /* ── fallback ── */
        .pm-fallback { position: absolute; inset: 0; }
        .pm-fb-overlay {
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(135deg,rgba(20,12,4,.85),rgba(20,12,4,.6));
        }
        .pm-fb-content {
          position: absolute; inset: 0; z-index: 2;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 10px; padding: 24px; text-align: center;
        }
        .pm-fb-icon { color: rgba(255,255,255,.5); }
        .pm-fb-title { font-family: var(--body); font-size: 17px; font-weight: 700; color: #fff; margin-top: 4px; }
        .pm-fb-sub { font-size: 13px; color: rgba(255,255,255,.55); line-height: 1.6; max-width: 280px; }
        .pm-fb-btn {
          display: inline-flex; align-items: center; gap: 8px; margin-top: 8px;
          background: linear-gradient(135deg,#ff2b00,#c41e00);
          color: #fff; text-decoration: none; border-radius: 10px;
          padding: 11px 24px; font-size: 13px; font-weight: 700;
          box-shadow: 0 5px 20px rgba(255,43,0,.4);
          transition: transform .2s, box-shadow .2s;
        }
        .pm-fb-btn:hover { transform: translateY(-2px); box-shadow: 0 9px 28px rgba(255,43,0,.5); }

        /* ── info panel below player ── */
        .pm-body {
          display: grid;
          /* text takes all remaining space, actions column fixed 88px */
          grid-template-columns: 1fr 88px;
          border-top: 1.5px solid var(--border);
          min-height: 0;
        }

        .pm-body-left {
          padding: 18px 22px;
          border-right: 1.5px solid var(--border);
          min-width: 0; /* prevent overflow */
        }

        .pm-badges {
          display: flex; align-items: center; gap: 7px; flex-wrap: wrap; margin-bottom: 9px;
        }
        .pm-cat-badge {
          font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .18em;
          color: var(--o); background: rgba(200,85,26,.1); border: 1px solid rgba(200,85,26,.22);
          padding: 3px 10px; border-radius: 99px; flex-shrink: 0;
        }
        .pm-dur-badge {
          font-size: 10px; font-weight: 700; color: var(--muted);
          background: var(--bg); border: 1px solid var(--border);
          padding: 3px 9px; border-radius: 99px; flex-shrink: 0;
        }
        .pm-title {
          font-family: var(--body);
          font-size: clamp(14px, 1.8vw, 20px);
          font-weight: 700; color: var(--text); line-height: 1.3;
          margin-bottom: 8px; letter-spacing: -.01em;
          /* prevent very long titles breaking layout */
          overflow: hidden;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
        }
        .pm-stats-row {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;
        }
        .pm-stat-item {
          font-size: 11px; color: var(--muted);
          display: flex; align-items: center; gap: 4px; white-space: nowrap;
        }
        .pm-stat-dot {
          width: 3px; height: 3px; border-radius: 50%;
          background: var(--border2); flex-shrink: 0;
        }
        .pm-yt-badge {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 9px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
          color: #e02b00; text-decoration: none;
          border: 1px solid rgba(224,43,0,.25); border-radius: 99px;
          padding: 3px 9px; transition: background .2s; flex-shrink: 0;
        }
        .pm-yt-badge:hover { background: rgba(224,43,0,.07); }
        .pm-desc {
          font-family: var(--body); font-size: 13px; font-style: italic;
          color: var(--muted); line-height: 1.75;
          padding-top: 10px; border-top: 1px solid var(--border);
          /* clamp to 3 lines so it doesn't push layout */
          overflow: hidden;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
        }

        /* ── action column ── */
        .pm-body-right {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 2px; padding: 12px 8px;
          background: var(--bg);
        }
        .pm-big-action {
          display: flex; flex-direction: column; align-items: center;
          gap: 3px; width: 72px; padding: 10px 4px;
          background: none; border: none; cursor: pointer; text-decoration: none;
          border-radius: 12px;
          transition: background .18s ease, transform .13s ease;
        }
        .pm-big-action:hover { background: var(--bg2); transform: translateY(-1px); }
        .pm-big-action:active { transform: scale(.93); }
        .pm-big-action-icon {
          width: 38px; height: 38px; border-radius: 10px;
          background: var(--card); border: 1.5px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; color: var(--muted);
          transition: border-color .2s, color .2s, background .2s;
        }
        .pm-big-action:hover .pm-big-action-icon { border-color: rgba(200,85,26,.4); color: var(--o); }
        .pm-big-action-count {
          font-size: 11px; font-weight: 700; color: var(--text); line-height: 1;
        }
        .pm-big-action-label {
          font-size: 8px; font-weight: 700; text-transform: uppercase;
          letter-spacing: .12em; color: var(--muted);
        }
        .pm-liked .pm-big-action-icon  { background: #fff0f0; border-color: rgba(224,80,80,.4); color: #e05050 !important; }
        .pm-liked .pm-big-action-label { color: #e05050; }
        .pm-like-pop .pm-big-action-icon { animation: pm-heart .45s ease; }
        .pm-yt-action .pm-big-action-icon { color: #e02b00; }
        .pm-yt-action:hover .pm-big-action-icon { background: #fff0ee; border-color: rgba(224,43,0,.3); }

        /* ── tablet: 768px ── */
        @media(max-width:768px){
          .pm-backdrop { padding: 12px 10px; }
          .pm-container { max-width: 100%; }
          .pm-body { grid-template-columns: 1fr 76px; }
          .pm-body-left { padding: 14px 16px; }
          .pm-big-action { width: 60px; padding: 8px 2px; }
          .pm-big-action-icon { width: 34px; height: 34px; font-size: 13px; }
        }

        /* ── mobile: 520px — stack vertically ── */
        @media(max-width:520px){
          .pm-close-pill { align-self: stretch; justify-content: center; }
          .pm-card { border-radius: 14px; }
          .pm-body {
            grid-template-columns: 1fr;
          }
          .pm-body-left {
            border-right: none;
            border-bottom: 1.5px solid var(--border);
            padding: 14px 16px;
          }
          .pm-body-right {
            flex-direction: row;
            justify-content: space-around;
            padding: 10px 12px;
            gap: 0;
          }
          .pm-big-action { width: auto; min-width: 56px; padding: 8px 4px; }
          .pm-title { -webkit-line-clamp: 3; }
        }

        /* ══════════════════
           SHARE SHEET
        ══════════════════ */
        .ss-backdrop {
          position: fixed; inset: 0; z-index: 500;
          background: rgba(26,16,8,.55);
          display: flex; align-items: flex-end; justify-content: center;
          animation: vg-in .18s ease;
        }
        .ss {
          background: var(--card); border-radius: 20px 20px 0 0;
          width: 100%; max-width: 480px; padding: 12px 24px 32px;
          border: 1.5px solid var(--border); border-bottom: none;
          box-shadow: 0 -8px 40px rgba(26,16,8,.15);
          animation: vg-sheet .22s ease;
        }
        .ss-handle { width: 36px; height: 4px; background: var(--border); border-radius: 2px; margin: 0 auto 18px; }
        .ss-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
        .ss-title { font-size: 16px; font-weight: 700; color: var(--text); }
        .ss-close { background: none; border: none; color: var(--muted); cursor: pointer; font-size: 15px; }
        .ss-subtitle { font-size: 12px; color: var(--muted); margin-bottom: 22px; line-height: 1.5; }
        .ss-platforms { display: flex; gap: 20px; justify-content: center; margin-bottom: 22px; }
        .ss-platform { display: flex; flex-direction: column; align-items: center; gap: 7px; text-decoration: none; }
        .ss-platform-icon {
          width: 52px; height: 52px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 20px;
          transition: transform .2s, box-shadow .2s;
        }
        .ss-platform:hover .ss-platform-icon { transform: scale(1.1); box-shadow: 0 6px 18px rgba(0,0,0,.18); }
        .ss-platform-label { font-size: 10px; font-weight: 600; color: var(--muted); }
        .ss-copy-row { display: flex; gap: 8px; }
        .ss-copy-input {
          flex: 1; background: var(--bg); border: 1.5px solid var(--border);
          border-radius: 8px; padding: 10px 13px; font-size: 12px; color: var(--muted); outline: none;
        }
        .ss-copy-btn {
          display: flex; align-items: center; gap: 6px;
          background: var(--text); color: #fff; border: none; border-radius: 8px;
          padding: 10px 18px; font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap;
          transition: background .2s;
        }
        .ss-copied { background: #15803d !important; }
        .ss-copy-btn:hover:not(.ss-copied) { background: var(--o); }

        /* ══════════════════
           COMMENTS PANEL
        ══════════════════ */
        .cp-backdrop {
          position: fixed; inset: 0; z-index: 500;
          background: rgba(26,16,8,.45);
          display: flex; justify-content: flex-end;
          animation: vg-in .18s ease;
        }
        .cp {
          width: min(400px,100vw); height: 100%;
          background: var(--card); border-left: 1.5px solid var(--border);
          display: flex; flex-direction: column;
          animation: vg-scale .2s ease;
        }
        .cp-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 20px; border-bottom: 1.5px solid var(--border);
          background: var(--bg);
        }
        .cp-title {
          display: flex; align-items: center; gap: 8px;
          font-size: 14px; font-weight: 700; color: var(--text);
        }
        .cp-badge {
          background: var(--bg2); border-radius: 99px;
          font-size: 11px; padding: 1px 8px; color: var(--muted); font-weight: 600;
        }
        .cp-close { background: none; border: none; color: var(--muted); cursor: pointer; font-size: 16px; }
        .cp-list {
          flex: 1; overflow-y: auto; padding: 16px 20px;
          display: flex; flex-direction: column; gap: 16px;
          scrollbar-width: thin; scrollbar-color: var(--border) transparent;
        }
        .cp-loading { display: flex; justify-content: center; padding: 48px 0; }
        .cp-spinner {
          width: 22px; height: 22px; border-radius: 50%;
          border: 2px solid var(--border); border-top-color: var(--o);
          animation: vg-spin 1s linear infinite;
        }
        .cp-empty { text-align: center; padding: 48px 0; color: var(--muted); font-size: 13px; display: flex; flex-direction: column; align-items: center; }
        .cp-comment { display: flex; gap: 11px; }
        .cp-avatar {
          width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: #fff;
        }
        .cp-comment-body { flex: 1; }
        .cp-comment-meta { display: flex; align-items: baseline; gap: 8px; margin-bottom: 3px; }
        .cp-comment-name { font-size: 12px; font-weight: 700; color: var(--text); }
        .cp-comment-time { font-size: 10px; color: var(--muted); }
        .cp-comment-text { font-size: 13px; color: var(--text); line-height: 1.6; opacity: .85; }
        .cp-input-wrap { padding: 14px 20px; border-top: 1.5px solid var(--border); display: flex; flex-direction: column; gap: 8px; background: var(--bg); }
        .cp-name { background: var(--card); border: 1.5px solid var(--border); border-radius: 8px; padding: 8px 13px; font-size: 13px; color: var(--text); outline: none; transition: border-color .2s; }
        .cp-name:focus { border-color: rgba(200,85,26,.5); }
        .cp-input-row { display: flex; gap: 8px; }
        .cp-textarea { flex: 1; background: var(--card); border: 1.5px solid var(--border); border-radius: 10px; padding: 10px 13px; font-family: var(--sans); font-size: 13px; color: var(--text); outline: none; resize: none; line-height: 1.5; transition: border-color .2s; }
        .cp-textarea:focus { border-color: rgba(200,85,26,.5); }
        .cp-send { width: 42px; height: 42px; border-radius: 10px; background: linear-gradient(135deg,var(--o),#8a2e06); border: none; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; align-self: flex-end; transition: transform .2s, box-shadow .2s; }
        .cp-send:hover { transform: scale(1.06); box-shadow: 0 4px 14px rgba(200,85,26,.35); }
        .cp-send:disabled { opacity: .4; cursor: not-allowed; }

        /* ══════════════════
           UPLOAD MODAL
        ══════════════════ */
        .um-backdrop { position: fixed; inset: 0; z-index: 500; background: rgba(26,16,8,.6); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 20px; animation: vg-in .18s ease; }
        .um { background: var(--card); border-radius: 18px; width: 100%; max-width: 520px; border: 1.5px solid var(--border); box-shadow: 0 32px 80px rgba(26,16,8,.2); animation: vg-scale .2s ease; overflow: hidden; max-height: 90vh; overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
        .um-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1.5px solid var(--border); background: var(--bg); }
        .um-header-left { display: flex; align-items: center; gap: 10px; }
        .um-icon { width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg,var(--o),#8a2e06); display: flex; align-items: center; justify-content: center; color: #fff; }
        .um-title { font-size: 16px; font-weight: 700; color: var(--text); }
        .um-close { background: none; border: none; color: var(--muted); cursor: pointer; font-size: 16px; }
        .um-body { display: grid; grid-template-columns: 1fr; }
        .um-preview-wrap { background: #1a1008; aspect-ratio: 16/9; position: relative; }
        .um-preview { position: relative; width: 100%; height: 100%; }
        .um-preview-play { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 1; color: rgba(255,255,255,.5); }
        .um-preview-label { position: absolute; bottom: 8px; right: 8px; z-index: 1; background: rgba(0,0,0,.7); color: #fff; font-size: 9px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; padding: 3px 8px; border-radius: 4px; }
        .um-preview-empty { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: rgba(240,230,212,.25); font-size: 12px; gap: 4px; }
        .um-fields { padding: 22px 24px; display: flex; flex-direction: column; gap: 16px; }
        .um-field { display: flex; flex-direction: column; gap: 5px; }
        .um-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .16em; color: var(--muted); }
        .um-input { background: var(--bg); border: 1.5px solid var(--border); border-radius: 9px; padding: 10px 13px; font-family: var(--sans); font-size: 13px; color: var(--text); outline: none; transition: border-color .2s, box-shadow .2s; }
        .um-input:focus { border-color: rgba(200,85,26,.5); box-shadow: 0 0 0 3px rgba(200,85,26,.08); }
        .um-textarea { background: var(--bg); border: 1.5px solid var(--border); border-radius: 9px; padding: 10px 13px; font-family: var(--sans); font-size: 13px; color: var(--text); outline: none; resize: none; transition: border-color .2s; }
        .um-textarea:focus { border-color: rgba(200,85,26,.5); }
        .um-select { background: var(--bg); border: 1.5px solid var(--border); border-radius: 9px; padding: 10px 13px; font-family: var(--sans); font-size: 13px; color: var(--text); outline: none; cursor: pointer; }
        .um-row { display: flex; gap: 12px; }
        .um-hint { font-size: 10px; color: var(--muted); margin-top: 2px; }
        .um-error { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #c8320a; background: rgba(200,50,10,.08); border: 1px solid rgba(200,50,10,.2); border-radius: 8px; padding: 10px 14px; }
        .um-save { display: flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg,var(--o),#8a2e06); color: #fff; border: none; border-radius: 10px; padding: 13px; font-family: var(--sans); font-size: 14px; font-weight: 700; cursor: pointer; transition: transform .2s, box-shadow .2s; box-shadow: 0 4px 18px rgba(200,85,26,.28); }
        .um-save:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 7px 26px rgba(200,85,26,.42); }
        .um-save:disabled { opacity: .5; cursor: not-allowed; }
        .um-spinner { width: 14px; height: 14px; border-radius: 50%; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; animation: vg-spin 1s linear infinite; }

        /* ══════════════════
           RESPONSIVE
        ══════════════════ */
        @media(max-width:900px) {
          .vg-grid { grid-template-columns: repeat(auto-fill,minmax(220px,1fr)); gap:14px; }
          .vlc { grid-template-columns: 170px 1fr; }
          .vg-hero { height: clamp(200px,50vw,340px); }
        }
        @media(max-width:640px) {
          .vg-header-top { gap:10px; }
          .vg-heading { display: none; }
          .vg-sync-btn span { display: none; }
          .vlc { grid-template-columns: 1fr; }
          .vlc-thumb { aspect-ratio: 16/9; }
          .vg-grid { grid-template-columns: repeat(2,1fr); gap:10px; }
          .vg-hero-content { padding: 14px 16px; }
          .pm { border-radius: 12px; }
          .cp { width: 100vw; }
        }
        @media(max-width:400px) {
          .vg-grid { grid-template-columns: 1fr; }
        }
      `}</style>


      {/* ── PAGE HEADER ── */}
      <div className="vg-header">
        <div className="vg-header-top">
          <Link href="/" className="vg-back"><FaArrowLeft size={11}/> Back</Link>
          <div className="vg-heading">Guruji <span>·</span> Video Series</div>

          <div className="vg-search-wrap">
            <FaSearch className="vg-search-ico"/>
            <input className="vg-search" placeholder="Search teachings…"
              value={search} onChange={e=>{ setSearch(e.target.value); setPage(1) }}/>
            {search && <button className="vg-search-x" onClick={()=>setSearch("")}><FaTimes/></button>}
          </div>

          <div className="vg-controls">
            <button className={`vg-layout-btn ${layout==="grid"?"vg-active":""}`}
              onClick={()=>setLayout("grid")} title="Grid"><FaTh/></button>
            <button className={`vg-layout-btn ${layout==="list"?"vg-active":""}`}
              onClick={()=>setLayout("list")} title="List"><FaBars/></button>
            {isAdmin && <>
              <button className="vg-sync-btn" onClick={syncFromYouTube} disabled={syncing}>
                <FaSync size={11} className="vg-sync-ico"/><span>Sync YT</span>
              </button>
              <button className="vg-upload-btn" onClick={()=>setShowUpload(true)}>
                <FaPlus size={11}/> Upload
              </button>
            </>}
          </div>
        </div>

        {/* filter chips + sort */}
        <div className="vg-filters">
          {CATEGORIES.map(c=>(
            <button key={c} className={`vg-filter-btn ${category===c?"vg-active":""}`}
              onClick={()=>{ setCategory(c); setPage(1) }}>{c}</button>
          ))}
          <div className="vg-filter-gap"/>
          <div className="vg-sort-wrap">
            <button className="vg-sort-btn" onClick={()=>setShowSort(s=>!s)}>
              <FaSortAmountDown size={10}/>
              {SORT_OPTIONS.find(s=>s.val===sort)?.label}
              <FaChevronDown size={9}/>
            </button>
            {showSort && (
              <div className="vg-sort-drop">
                {SORT_OPTIONS.map(o=>(
                  <button key={o.val}
                    className={`vg-sort-opt ${sort===o.val?"vg-active":""}`}
                    onClick={()=>{ setSort(o.val); setShowSort(false); setPage(1) }}>
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── FEATURED HERO ── */}
      {!loading && featured && (
        <div className="vg-hero" onClick={()=>openVideo(featured)}>
          <Image src={ytThumb(featured.youtube_id)} alt={featured.title} fill priority
            sizes="100vw" style={{objectFit:"cover"}} className="vg-hero-img"
            onError={e=>{ (e.target as HTMLImageElement).src = ytThumbFallback(featured.youtube_id) }}/>
          <div className="vg-hero-grad"/>
          <div className="vg-hero-play"><FaPlay/></div>
          <div className="vg-hero-content">
            <div className="vg-hero-cat">{featured.category}</div>
            <h2 className="vg-hero-title">{featured.title}</h2>
            <div className="vg-hero-meta">
              <span><FaEye size={10}/> {fmtNum(featured.views)}</span>
              <span><FaRegHeart size={10}/> {fmtNum(featured.likes)}</span>
              {featured.duration && <span>{featured.duration}</span>}
              <span>{timeAgo(featured.created_at)}</span>
              {featured.is_featured && <span className="vg-feat-pill">★ Featured</span>}
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="vg-main" onClick={()=>showSort&&setShowSort(false)}>
        <div className="vg-result-bar">
          <p className="vg-result-text">
            <strong>{filtered.length}</strong> {filtered.length===1?"video":"videos"}
            {category!=="All" && ` in ${category}`}
            {search && ` for "${search}"`}
          </p>
        </div>

        {loading ? (
          <div className="vg-skel">
            {[...Array(8)].map((_,i)=>(
              <div key={i} className="sk">
                <div className="sk-t"/>
                <div className="sk-b">
                  <div className="sk-l" style={{height:8,width:"35%",marginBottom:10}}/>
                  <div className="sk-l" style={{height:13,width:"88%",marginBottom:7}}/>
                  <div className="sk-l" style={{height:13,width:"70%",marginBottom:12}}/>
                  <div className="sk-l" style={{height:8,width:"45%"}}/>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length===0 ? (
          <div className="vg-empty">
            <div className="vg-empty-ico">📭</div>
            <p className="vg-empty-ttl">No videos found</p>
            <p className="vg-empty-sub">
              {search ? `No results for "${search}".` : "No videos in this category yet."}
            </p>
          </div>
        ) : layout==="grid" ? (
          <div className="vg-grid">
            {paged.map(v=>(
              <VideoCard key={v.id} video={v} layout="grid"
                liked={likedIds.has(v.id)}
                onPlay={()=>openVideo(v)}
                onLike={()=>toggleLike(v)}/>
            ))}
          </div>
        ) : (
          <div className="vg-list">
            {paged.map(v=>(
              <VideoCard key={v.id} video={v} layout="list"
                liked={likedIds.has(v.id)}
                onPlay={()=>openVideo(v)}
                onLike={()=>toggleLike(v)}/>
            ))}
          </div>
        )}

        {hasMore && (
          <div className="vg-more">
            <button className="vg-more-btn" onClick={()=>setPage(p=>p+1)}>
              Load More <FaChevronDown size={11}/>
            </button>
          </div>
        )}
      </div>

      {/* ── MODALS ── */}
      {activeVideo && (
        <PlayerModal
          video={activeVideo}
          liked={likedIds.has(activeVideo.id)}
          onLike={()=>toggleLike(activeVideo)}
          onClose={()=>{ setActiveVideo(null); setShowComments(false); setShowShare(false) }}
          onComment={()=>setShowComments(true)}
          onShare={()=>setShowShare(true)}
        />
      )}
      {showComments && activeVideo && (
        <CommentsPanel video={activeVideo} onClose={()=>setShowComments(false)}/>
      )}
      {showShare && activeVideo && (
        <ShareSheet video={activeVideo} onClose={()=>setShowShare(false)}/>
      )}
      {showUpload && (
        <UploadModal onClose={()=>setShowUpload(false)} onUploaded={loadVideos}/>
      )}
    </div>
  )
}