"use client"

import { getArticles } from "../data"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef, use } from "react"
import {
  Heart, MessageCircle, Bookmark, ChevronRight,
  Clock, ArrowLeft, Flame, Eye, LogOut, Check, Loader2, X,
} from "lucide-react"
import ShareButton from "../Sharebutton"
import LoginModal from "../components/Loginmodal"
import { supabase } from "../../lib/supabaseClient"

/* ─────────────────────────────────────────────────────────────
   TOKENS
───────────────────────────────────────────────────────────── */
const BODY  = "'Lora', Georgia, serif"           // beautiful web-native serif
const SANS  = "'Poppins', system-ui, sans-serif"
const ORANGE = "#c8551a"
const GOLD   = "#b8841a"
const BG     = "#faf7f2"
const CARD   = "#ffffff"
const BORDER = "#e8ddd0"
const TEXT   = "#1a1008"
const MUTED  = "#8a7a6a"

const AVATAR_COLORS = ["#c8551a","#7c3aed","#0891b2","#16a34a","#b8841a","#e11d48","#0284c7","#65a30d"]
function avatarColor(s=""){let h=0;for(let i=0;i<s.length;i++)h=s.charCodeAt(i)+((h<<5)-h);return AVATAR_COLORS[Math.abs(h)%AVATAR_COLORS.length]}

const TOPICS = ["Truth","Liberation","Mind","Relationship","Fear","Religion","Desire","Bhakti","Buddha","Vedanta"]

/* ─────────────────────────────────────────────────────────────
   READING PROGRESS
───────────────────────────────────────────────────────────── */
function ReadingProgress() {
  const [p,setP]=useState(0)
  useEffect(()=>{
    const fn=()=>{const h=document.body.scrollHeight-window.innerHeight;setP(h>0?Math.min(window.scrollY/h*100,100):0)}
    window.addEventListener("scroll",fn,{passive:true});return()=>window.removeEventListener("scroll",fn)
  },[])
  return <div style={{position:"fixed",top:0,left:0,zIndex:999,height:3,width:`${p}%`,background:`linear-gradient(90deg,${ORANGE},${GOLD})`,borderRadius:"0 2px 2px 0",transition:"width .1s linear",pointerEvents:"none"}}/>
}

/* ─────────────────────────────────────────────────────────────
   NEWSLETTER INLINE
───────────────────────────────────────────────────────────── */
function NewsletterInline() {
  const [email,setEmail]=useState("")
  const [sub,setSub]=useState(false)
  const [busy,setBusy]=useState(false)
  const [err,setErr]=useState("")

  async function go(){
    if(!email.includes("@")){setErr("Enter a valid email.");return}
    setBusy(true);setErr("")
    const {error}=await supabase.from("newsletter_subscribers").upsert(
      {email:email.trim().toLowerCase()},{onConflict:"email"}
    )
    setBusy(false)
    if(error){setErr("Something went wrong. Try again.");return}
    setSub(true)
  }

  return (
    <div className="nl-wrap">
      <div style={{padding:"32px 28px",background:"linear-gradient(135deg,#fff8f2,#fff4e0)",borderRadius:18,border:`1.5px solid ${BORDER}`}}>
        <p style={{fontFamily:SANS,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.16em",color:ORANGE,marginBottom:8}}>Newsletter</p>
        <h3 style={{fontFamily:SANS,fontSize:19,fontWeight:800,color:TEXT,marginBottom:6,lineHeight:1.3}}>Wisdom in Your Inbox</h3>
        <p style={{fontFamily:SANS,fontSize:13,color:MUTED,lineHeight:1.75,marginBottom:20}}>
          One thoughtful email a week — curated articles, quotes and insights from Guruji Shrawan. No noise.
        </p>
        {sub?(
          <div style={{background:"#f0fdf4",border:"1.5px solid #86efac",borderRadius:10,padding:"13px 18px",fontFamily:SANS,fontSize:14,color:"#15803d",fontWeight:600,display:"flex",alignItems:"center",gap:8}}>
            <Check size={16}/> You're in! Wisdom is on its way. 🙏
          </div>
        ):(
          <>
            {err&&<p style={{fontFamily:SANS,fontSize:12,color:"#dc2626",marginBottom:10}}>{err}</p>}
            <div className="nl-row">
              <input value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}
                placeholder="Your email address" type="email"
                style={{flex:1,padding:"11px 16px",borderRadius:10,border:`1.5px solid ${BORDER}`,background:"#fff",fontFamily:SANS,fontSize:14,color:TEXT,outline:"none",minWidth:0}}/>
              <button onClick={go} disabled={busy}
                style={{padding:"11px 22px",borderRadius:10,background:busy?"#e0d0c0":`linear-gradient(135deg,${ORANGE},#8a2e06)`,color:"#fff",fontFamily:SANS,fontSize:14,fontWeight:700,border:"none",cursor:busy?"not-allowed":"pointer",whiteSpace:"nowrap",flexShrink:0}}>
                {busy?<Loader2 size={16} style={{animation:"spin 1s linear infinite"}}/>:"Subscribe"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   COMMENTS
───────────────────────────────────────────────────────────── */
function CommentsSection({articleSlug,user,onLoginRequired}){
  const [comments,setComments]=useState([])
  const [text,setText]=useState("")
  const [loading,setLoading]=useState(true)
  const [posting,setPosting]=useState(false)
  const [replyTo,setReplyTo]=useState(null)

  useEffect(()=>{
    async function load(){
      setLoading(true)
      const {data}=await supabase.from("article_comments").select("*")
        .eq("article_slug",articleSlug).order("created_at",{ascending:false})
      setComments(data||[]);setLoading(false)
    }
    load()
  },[articleSlug])

  async function submit(){
    if(!text.trim()||posting)return
    if(!user){onLoginRequired("comment");return}
    setPosting(true)
    const {data,error}=await supabase.from("article_comments").insert({
      article_slug:articleSlug,
      user_id:user.id,
      user_name:user.user_metadata?.full_name||user.email.split("@")[0],
      user_avatar_color:avatarColor(user.id),
      text:replyTo?`@${replyTo} ${text.trim()}`:text.trim(),
    }).select().single()
    if(!error&&data){setComments(p=>[data,...p]);setText("");setReplyTo(null)}
    setPosting(false)
  }

  function timeAgo(ts){
    const s=(Date.now()-new Date(ts))/1000
    if(s<60)return"just now";if(s<3600)return`${Math.floor(s/60)}m ago`
    if(s<86400)return`${Math.floor(s/3600)}h ago`;return`${Math.floor(s/86400)}d ago`
  }

  return(
    <div id="comments" style={{marginTop:56,paddingTop:40,borderTop:`1.5px solid ${BORDER}`}}>
      <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:28}}>
        <h2 style={{fontFamily:SANS,fontSize:20,fontWeight:800,color:TEXT}}>Discussion</h2>
        {comments.length>0&&<span style={{fontFamily:SANS,fontSize:13,color:MUTED}}>{comments.length} comment{comments.length!==1?"s":""}</span>}
      </div>

      {/* Compose */}
      {user?(
        <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:36}}>
          <div style={{width:38,height:38,borderRadius:"50%",background:avatarColor(user.id),display:"flex",alignItems:"center",justifyContent:"center",fontFamily:SANS,fontSize:15,fontWeight:700,color:"#fff",flexShrink:0}}>
            {(user.user_metadata?.full_name||user.email||"U")[0].toUpperCase()}
          </div>
          <div style={{flex:1,minWidth:0}}>
            {replyTo&&(
              <div style={{fontFamily:SANS,fontSize:12,color:MUTED,marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
                Replying to <span style={{color:ORANGE,fontWeight:600}}>@{replyTo}</span>
                <button onClick={()=>setReplyTo(null)} style={{background:"none",border:"none",cursor:"pointer",color:MUTED,fontSize:11}}>✕ cancel</button>
              </div>
            )}
            <textarea value={text} onChange={e=>setText(e.target.value)} rows={3} placeholder="Share your thoughts…"
              style={{width:"100%",padding:"13px 16px",borderRadius:12,border:`1.5px solid ${BORDER}`,background:CARD,fontFamily:SANS,fontSize:14,color:TEXT,outline:"none",resize:"vertical",boxSizing:"border-box",lineHeight:1.7}}/>
            <div style={{display:"flex",justifyContent:"flex-end",marginTop:8}}>
              <button onClick={submit} disabled={!text.trim()||posting}
                style={{padding:"9px 22px",borderRadius:10,background:text.trim()&&!posting?`linear-gradient(135deg,${ORANGE},#8a2e06)`:"#e8dfd4",color:text.trim()&&!posting?"#fff":MUTED,fontFamily:SANS,fontSize:13,fontWeight:600,border:"none",cursor:text.trim()?"pointer":"default",display:"flex",alignItems:"center",gap:6,transition:"all .15s"}}>
                {posting?<><Loader2 size={13} style={{animation:"spin 1s linear infinite"}}/> Posting…</>:"Post Comment"}
              </button>
            </div>
          </div>
        </div>
      ):(
        <div style={{background:CARD,borderRadius:14,padding:"24px",border:`1.5px solid ${BORDER}`,textAlign:"center",marginBottom:36}}>
          <p style={{fontFamily:SANS,fontSize:14,color:MUTED,marginBottom:14}}>Sign in to join the discussion</p>
          <button onClick={()=>onLoginRequired("comment")}
            style={{padding:"10px 26px",borderRadius:10,background:`linear-gradient(135deg,${ORANGE},#8a2e06)`,color:"#fff",fontFamily:SANS,fontSize:13,fontWeight:600,border:"none",cursor:"pointer"}}>
            Sign In to Comment
          </button>
        </div>
      )}

      {/* List */}
      {loading?(
        <div style={{display:"flex",alignItems:"center",gap:8,fontFamily:SANS,fontSize:14,color:MUTED,padding:"16px 0"}}>
          <Loader2 size={15} style={{animation:"spin 1s linear infinite"}}/> Loading comments…
        </div>
      ):comments.length===0?(
        <div style={{textAlign:"center",padding:"40px 0"}}>
          <div style={{fontSize:36,marginBottom:10}}>💬</div>
          <p style={{fontFamily:SANS,fontSize:15,fontWeight:700,color:TEXT,marginBottom:4}}>No comments yet</p>
          <p style={{fontFamily:SANS,fontSize:13,color:MUTED}}>Be the first to share your thoughts.</p>
        </div>
      ):(
        <div>
          {comments.map((c,i)=>(
            <div key={c.id} style={{display:"flex",gap:13,padding:"20px 0",borderBottom:i<comments.length-1?`1px solid #f0e8de`:"none"}}>
              <div style={{width:38,height:38,borderRadius:"50%",background:c.user_avatar_color||ORANGE,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:SANS,fontSize:14,fontWeight:700,color:"#fff",flexShrink:0}}>
                {(c.user_name||"U")[0].toUpperCase()}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,flexWrap:"wrap"}}>
                  <span style={{fontFamily:SANS,fontSize:13,fontWeight:700,color:TEXT}}>{c.user_name}</span>
                  {user&&c.user_id===user.id&&<span style={{fontFamily:SANS,fontSize:10,fontWeight:600,color:ORANGE,background:"#fff0e6",border:`1px solid #ffd4a8`,borderRadius:99,padding:"1px 7px"}}>You</span>}
                  <span style={{fontFamily:SANS,fontSize:11,color:MUTED}}>{timeAgo(c.created_at)}</span>
                </div>
                <p style={{fontFamily:SANS,fontSize:14,color:"#3a2a1a",lineHeight:1.78,margin:0}}>{c.text}</p>
                <button onClick={()=>user?setReplyTo(c.user_name):onLoginRequired("reply")}
                  style={{fontFamily:SANS,fontSize:12,color:MUTED,background:"none",border:"none",cursor:"pointer",marginTop:8}}>
                  ↩ Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────────────────────── */
function ArticleSidebar({article,allArticles,user,onLogout,likeCount,liked,saved,onLike,onSave,viewCount}){
  const more=allArticles.filter(a=>a.slug!==article.slug).slice(0,5)
  const [email,setEmail]=useState("")
  const [done,setDone]=useState(false)
  async function handleSub(){
    if(!email.includes("@"))return
    await supabase.from("newsletter_subscribers").upsert({email:email.trim().toLowerCase()},{onConflict:"email"})
    setDone(true)
  }

  return(
    <aside className="sidebar-root">

      {/* User card */}
      {user&&(
        <div style={{background:CARD,borderRadius:14,padding:"14px 16px",border:`1.5px solid ${BORDER}`,display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <div style={{width:38,height:38,borderRadius:"50%",flexShrink:0,background:avatarColor(user.id),display:"flex",alignItems:"center",justifyContent:"center",fontFamily:SANS,fontSize:14,fontWeight:700,color:"#fff"}}>
            {(user.user_metadata?.full_name||user.email||"U")[0].toUpperCase()}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <p style={{fontFamily:SANS,fontSize:13,fontWeight:700,color:TEXT,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.user_metadata?.full_name||user.email.split("@")[0]}</p>
            <p style={{fontFamily:SANS,fontSize:11,color:MUTED,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.email}</p>
          </div>
          <button onClick={onLogout} title="Sign out" style={{background:"none",border:"none",cursor:"pointer",color:MUTED,display:"flex",flexShrink:0}}><LogOut size={15}/></button>
        </div>
      )}

      {/* Article actions */}
      <div style={{background:CARD,borderRadius:14,padding:"16px 18px",border:`1.5px solid ${BORDER}`,marginBottom:20}}>
        <p style={{fontFamily:SANS,fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.16em",color:GOLD,marginBottom:12}}>This Article</p>
        <div style={{display:"flex",flexDirection:"column",gap:2}}>
          <button onClick={onLike} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,background:liked?"#fef2f2":"transparent",border:`1.5px solid ${liked?"#fecaca":"transparent"}`,cursor:"pointer",transition:"all .15s",width:"100%",textAlign:"left"}}>
            <Heart size={16} fill={liked?"#ef4444":"none"} style={{color:liked?"#ef4444":MUTED,flexShrink:0}}/>
            <span style={{fontFamily:SANS,fontSize:13,fontWeight:600,color:liked?"#ef4444":TEXT}}>{liked?"Liked":"Like"}</span>
            <span style={{fontFamily:SANS,fontSize:12,color:MUTED,marginLeft:"auto"}}>{likeCount}</span>
          </button>
          <button onClick={onSave} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,background:saved?"#fff8f0":"transparent",border:`1.5px solid ${saved?`${ORANGE}44`:"transparent"}`,cursor:"pointer",transition:"all .15s",width:"100%",textAlign:"left"}}>
            <Bookmark size={16} fill={saved?"currentColor":"none"} style={{color:saved?ORANGE:MUTED,flexShrink:0}}/>
            <span style={{fontFamily:SANS,fontSize:13,fontWeight:600,color:saved?ORANGE:TEXT}}>{saved?"Saved":"Save"}</span>
          </button>
          <a href="#comments" style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,textDecoration:"none",transition:"background .15s"}}
            onMouseEnter={e=>e.currentTarget.style.background=BG} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <MessageCircle size={16} style={{color:MUTED,flexShrink:0}}/>
            <span style={{fontFamily:SANS,fontSize:13,fontWeight:600,color:TEXT}}>Comment</span>
          </a>
          {/* Live view count */}
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px"}}>
            <Eye size={16} style={{color:MUTED,flexShrink:0}}/>
            <span style={{fontFamily:SANS,fontSize:13,fontWeight:600,color:TEXT}}>Views</span>
            <span style={{fontFamily:SANS,fontSize:12,color:MUTED,marginLeft:"auto"}}>{viewCount>=1000?`${(viewCount/1000).toFixed(1)}k`:viewCount}</span>
          </div>
        </div>
      </div>

      {/* Topics */}
      <div style={{background:CARD,borderRadius:14,padding:"16px 18px",border:`1.5px solid ${BORDER}`,marginBottom:20}}>
        <p style={{fontFamily:SANS,fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.16em",color:GOLD,marginBottom:12}}>Explore Topics</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {TOPICS.map(t=>(
            <Link key={t} href={`/articles?topic=${encodeURIComponent(t.toLowerCase())}`}
              style={{fontFamily:SANS,fontSize:11,fontWeight:600,padding:"5px 11px",borderRadius:99,background:BG,color:"#5a4a3a",border:`1px solid ${BORDER}`,textDecoration:"none",transition:"all .15s"}}
              onMouseEnter={e=>{e.currentTarget.style.background=ORANGE;e.currentTarget.style.color="#fff";e.currentTarget.style.borderColor=ORANGE}}
              onMouseLeave={e=>{e.currentTarget.style.background=BG;e.currentTarget.style.color="#5a4a3a";e.currentTarget.style.borderColor=BORDER}}>
              {t}
            </Link>
          ))}
        </div>
      </div>

      {/* More articles */}
      <div style={{background:CARD,borderRadius:14,padding:"16px 18px",border:`1.5px solid ${BORDER}`,marginBottom:20}}>
        <p style={{fontFamily:SANS,fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.16em",color:GOLD,marginBottom:12,display:"flex",alignItems:"center",gap:5}}>
          <Flame size={11} style={{color:ORANGE}}/> More Articles
        </p>
        {more.map((a,i)=>(
          <Link key={a.slug} href={`/articles/${a.slug}`}
            style={{display:"flex",gap:10,padding:"10px 0",textDecoration:"none",borderBottom:i<more.length-1?`1px solid #f5f0ea`:"none",transition:"opacity .15s"}}
            onMouseEnter={e=>e.currentTarget.style.opacity=".65"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
            <div style={{position:"relative",width:52,height:42,borderRadius:8,overflow:"hidden",flexShrink:0}}>
              <Image src={a.featuredImage||"/images/default.jpg"} fill alt={a.title} style={{objectFit:"cover"}}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <span style={{fontFamily:SANS,fontSize:9,fontWeight:700,textTransform:"uppercase",color:ORANGE,letterSpacing:"0.1em"}}>{a.category}</span>
              <p style={{fontFamily:SANS,fontSize:12,fontWeight:600,color:TEXT,lineHeight:1.4,marginTop:2,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{a.title}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Newsletter */}
      <div style={{background:`linear-gradient(145deg,${ORANGE},#7a2606)`,borderRadius:14,padding:"20px 18px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
        <p style={{fontFamily:SANS,fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",color:"#ffd580",marginBottom:5}}>Newsletter</p>
        <h3 style={{fontFamily:SANS,fontSize:15,fontWeight:800,color:"#fff",lineHeight:1.35,marginBottom:6}}>Wisdom in Your Inbox</h3>
        <p style={{fontFamily:SANS,fontSize:12,color:"rgba(255,255,255,0.68)",lineHeight:1.6,marginBottom:14}}>One email per week. No noise.</p>
        {done?(
          <div style={{background:"rgba(255,255,255,0.18)",borderRadius:9,padding:10,textAlign:"center",fontFamily:SANS,fontSize:13,color:"#fff",fontWeight:600}}>✓ Subscribed!</div>
        ):(
          <>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your email" type="email"
              style={{width:"100%",padding:"9px 12px",borderRadius:9,border:"none",fontFamily:SANS,fontSize:13,color:TEXT,outline:"none",marginBottom:8,boxSizing:"border-box"}}/>
            <button onClick={handleSub} style={{width:"100%",padding:"9px",borderRadius:9,background:"#ffd580",border:"none",fontFamily:SANS,fontSize:13,fontWeight:700,color:"#6a2c06",cursor:"pointer"}}>
              Subscribe Free
            </button>
          </>
        )}
      </div>
    </aside>
  )
}

/* ─────────────────────────────────────────────────────────────
   RELATED ARTICLES
───────────────────────────────────────────────────────────── */
function RelatedArticles({articles}){
  if(!articles.length)return null
  return(
    <div style={{marginTop:60,paddingTop:40,borderTop:`1.5px solid ${BORDER}`}}>
      <p style={{fontFamily:SANS,fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.16em",color:GOLD,marginBottom:6}}>Continue Reading</p>
      <h2 style={{fontFamily:SANS,fontSize:20,fontWeight:800,color:TEXT,marginBottom:24}}>You Might Also Like</h2>
      <div className="related-grid">
        {articles.map(a=>(
          <Link key={a.slug} href={`/articles/${a.slug}`}
            style={{textDecoration:"none",display:"block",borderRadius:14,overflow:"hidden",background:CARD,border:`1.5px solid ${BORDER}`,transition:"all .2s"}}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 8px 28px rgba(180,80,20,0.13)";e.currentTarget.style.transform="translateY(-2px)"}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="translateY(0)"}}>
            <div style={{position:"relative",width:"100%",paddingBottom:"60%",overflow:"hidden"}}>
              <Image src={a.featuredImage||"/images/default.jpg"} fill alt={a.title} style={{objectFit:"cover"}}/>
            </div>
            <div style={{padding:"14px 16px"}}>
              <span style={{fontFamily:SANS,fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",color:ORANGE}}>{a.category}</span>
              <h3 style={{fontFamily:SANS,fontSize:14,fontWeight:700,color:TEXT,lineHeight:1.45,marginTop:5,marginBottom:8,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{a.title}</h3>
              <div style={{display:"flex",gap:10,fontFamily:SANS,fontSize:11,color:MUTED}}>
                {a.readTime&&<span style={{display:"flex",alignItems:"center",gap:3}}><Clock size={10}/>{a.readTime}</span>}
                <span style={{display:"flex",alignItems:"center",gap:3}}><Heart size={10}/>{a.likes||0}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   MOBILE BOTTOM BAR
───────────────────────────────────────────────────────────── */
function MobileBar({liked,likeCount,saved,onLike,onSave,article,mounted}){
  return(
    <div className="mobile-bar">
      <button onClick={onLike} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",color:liked?"#ef4444":"#6a5a4a",fontFamily:SANS,fontSize:10,fontWeight:600,minWidth:48}}>
        <Heart size={20} fill={liked?"currentColor":"none"}/>
        <span>{likeCount}</span>
      </button>
      <button onClick={onSave} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",color:saved?ORANGE:"#6a5a4a",fontFamily:SANS,fontSize:10,fontWeight:600,minWidth:48}}>
        <Bookmark size={20} fill={saved?"currentColor":"none"}/>
        <span>{saved?"Saved":"Save"}</span>
      </button>
      <a href="#comments" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,color:"#6a5a4a",textDecoration:"none",fontFamily:SANS,fontSize:10,fontWeight:600,minWidth:48}}>
        <MessageCircle size={20}/>
        <span>Comment</span>
      </a>
      {mounted&&(
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
          <ShareButton article={article} s={{fontBody:SANS,fontDisplay:SANS,btnOutline:"sb-mob"}} variant="icon" position="above"/>
          <span style={{fontFamily:SANS,fontSize:10,fontWeight:600,color:"#6a5a4a"}}>Share</span>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
export default function ArticlePage({params:paramsPromise}){
  const params   = use(paramsPromise)
  const articles = getArticles()
  const article  = articles.find(a=>a.slug===params.slug)

  const [user,       setUser]      = useState(null)
  const [authReady,  setAuthReady] = useState(false)
  const [liked,      setLiked]     = useState(false)
  const [likeCount,  setLikeCount] = useState(article?.likes??0)
  const [saved,      setSaved]     = useState(false)
  const [viewCount,  setViewCount] = useState(article?.views??0)
  const [loginModal, setLoginModal]= useState(null)
  const [showTop,    setShowTop]   = useState(false)
  const [mounted,    setMounted]   = useState(false)

  /* ── Bootstrap auth ── */
  useEffect(()=>{
    setMounted(true)
    supabase.auth.getSession().then(({data:{session}})=>{setUser(session?.user??null);setAuthReady(true)})
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,session)=>setUser(session?.user??null))
    return()=>subscription.unsubscribe()
  },[])

  /* ── Realtime view count ──
     Table: article_views (id, article_slug, session_id, created_at)
     We increment on mount (once per browser session) and subscribe
     to the count channel for live updates.                          */
  useEffect(()=>{
    if(!article)return

    // generate or retrieve a session-scoped visitor ID
    let sid=sessionStorage.getItem("gs_sid")
    if(!sid){sid=Math.random().toString(36).slice(2);sessionStorage.setItem("gs_sid",sid)}

    async function initViews(){
      // record this view (ignore duplicate error from unique constraint)
      await supabase.from("article_views").upsert(
        {article_slug:article.slug,session_id:sid},
        {onConflict:"article_slug,session_id",ignoreDuplicates:true}
      )
      // fetch current count
      const {count}=await supabase.from("article_views")
        .select("*",{count:"exact",head:true})
        .eq("article_slug",article.slug)
      if(count!=null)setViewCount(count)
    }
    initViews()

    // realtime subscription — updates view count live when others visit
    const channel=supabase.channel(`views:${article.slug}`)
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"article_views",filter:`article_slug=eq.${article.slug}`},
        ()=>setViewCount(c=>c+1))
      .subscribe()

    return()=>supabase.removeChannel(channel)
  },[article])

  /* ── Load like count + user state ── */
  useEffect(()=>{
    if(!article||!authReady)return
    async function load(){
      const {count}=await supabase.from("article_likes").select("*",{count:"exact",head:true}).eq("article_slug",article.slug)
      setLikeCount(count??article.likes??0)
      if(user){
        const {data:lr}=await supabase.from("article_likes").select("id").eq("article_slug",article.slug).eq("user_id",user.id).maybeSingle()
        setLiked(!!lr)
        const {data:sr}=await supabase.from("article_saves").select("id").eq("article_slug",article.slug).eq("user_id",user.id).maybeSingle()
        setSaved(!!sr)
      }else{setLiked(false);setSaved(false)}
    }
    load()
  },[article,user,authReady])

  /* ── Realtime like count ── */
  useEffect(()=>{
    if(!article)return
    const ch=supabase.channel(`likes:${article.slug}`)
      .on("postgres_changes",{event:"*",schema:"public",table:"article_likes",filter:`article_slug=eq.${article.slug}`},
        async()=>{
          const {count}=await supabase.from("article_likes").select("*",{count:"exact",head:true}).eq("article_slug",article.slug)
          if(count!=null)setLikeCount(count)
        })
      .subscribe()
    return()=>supabase.removeChannel(ch)
  },[article])

  useEffect(()=>{
    const fn=()=>setShowTop(window.scrollY>600)
    window.addEventListener("scroll",fn,{passive:true})
    return()=>window.removeEventListener("scroll",fn)
  },[])

  if(!article)return notFound()

  const related=(()=>{const s=articles.filter(a=>a.slug!==article.slug&&a.category===article.category);return s.length>=2?s.slice(0,3):articles.filter(a=>a.slug!==article.slug).slice(0,3)})()
  const tags=article.tags?(Array.isArray(article.tags)?article.tags:article.tags.split(",").map(t=>t.trim())):[]

  function requireLogin(r){setLoginModal(r)}
  function handleLoginSuccess(u){setUser(u)}
  async function handleLogout(){await supabase.auth.signOut();setUser(null);setLiked(false);setSaved(false)}

  async function handleLike(){
    if(!user){requireLogin("like");return}
    const next=!liked;setLiked(next);setLikeCount(c=>next?c+1:c-1)
    if(next)await supabase.from("article_likes").insert({article_slug:article.slug,user_id:user.id})
    else    await supabase.from("article_likes").delete().eq("article_slug",article.slug).eq("user_id",user.id)
  }
  async function handleSave(){
    if(!user){requireLogin("save");return}
    const next=!saved;setSaved(next)
    if(next)await supabase.from("article_saves").insert({article_slug:article.slug,user_id:user.id})
    else    await supabase.from("article_saves").delete().eq("article_slug",article.slug).eq("user_id",user.id)
  }

  const fmtViews=(n)=>n>=1000?`${(n/1000).toFixed(1)}k`:String(n)

  return(
    <>
      {/* ── Global styles + responsive CSS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes mFade  {from{opacity:0}to{opacity:1}}
        @keyframes mSlide {from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin   {to{transform:rotate(360deg)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

        *{box-sizing:border-box;margin:0;padding:0;}

        /* Share button variants */
        .sb-outline{font-family:${SANS};font-size:13px;font-weight:600;background:transparent;border:1.5px solid ${BORDER};border-radius:9px;color:#6a5a4a;cursor:pointer;display:inline-flex;align-items:center;gap:5px;padding:7px 14px;transition:all .15s;}
        .sb-outline:hover{border-color:${ORANGE};color:${ORANGE};background:#fff8f3;}
        .sb-mob{background:none;border:none;color:#6a5a4a;cursor:pointer;display:inline-flex;align-items:center;padding:0;}
        .sb-float-pill{background:none;border:none;color:rgba(255,255,255,0.78);cursor:pointer;display:inline-flex;align-items:center;padding:0;transition:opacity .15s;}
        .sb-float-pill:hover{opacity:.75;}

        /* ── Page layout ── */
        .page-grid{
          display:grid;
          grid-template-columns:1fr 268px;
          gap:48px;
          max-width:1140px;
          margin:0 auto;
          padding:0 20px;
          align-items:start;
        }
        .sidebar-root{position:sticky;top:88px;}

        /* ── Article body typography (Lora) ── */
        .art-body{
          font-family:${BODY};
          font-size:18px;
          line-height:1.92;
          color:#2a1806;
          letter-spacing:0.008em;
        }
        .art-body p{margin-bottom:1.55em;}

        /* Drop cap */
        .art-body>p:first-child::first-letter{
          float:left;
          font-family:${BODY};
          font-size:5em;
          line-height:0.76;
          padding-right:0.09em;
          padding-top:0.06em;
          color:${ORANGE};
          font-weight:700;
        }

        .art-body h2{
          font-family:${SANS};
          font-size:20px;
          font-weight:800;
          color:${TEXT};
          margin:2.6em 0 0.65em;
          padding-top:0.9em;
          border-top:1px solid ${BORDER};
          letter-spacing:-0.01em;
        }
        .art-body h3{
          font-family:${SANS};
          font-size:14px;
          font-weight:700;
          color:${TEXT};
          margin:2em 0 0.5em;
          text-transform:uppercase;
          letter-spacing:0.1em;
        }
        .art-body strong{font-weight:700;color:${TEXT};}
        .art-body em{font-style:italic;color:#4a3a2a;}

        /* Pull quote */
        .art-body blockquote{
          margin:2.6em 0;
          padding:28px 32px;
          border-top:2px solid ${ORANGE};
          border-bottom:2px solid ${ORANGE};
          font-family:${BODY};
          font-size:21px;
          font-style:italic;
          color:${TEXT};
          line-height:1.6;
          text-align:center;
          background:transparent;
        }
        .art-body blockquote p{margin:0;}
        .art-body a{color:${ORANGE};text-decoration:underline;text-underline-offset:3px;}
        .art-body ul,.art-body ol{margin:0.8em 0 1.55em 1.8em;}
        .art-body li{margin-bottom:0.55em;line-height:1.8;}
        .art-body img{width:100%;border-radius:10px;margin:1.6em 0;}
        .art-body figure{margin:2em 0;}
        .art-body figcaption{font-family:${SANS};font-size:12px;color:${MUTED};text-align:center;margin-top:-8px;}

        /* Related grid */
        .related-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}

        /* Newsletter row */
        .nl-row{display:flex;gap:10;}
        .nl-wrap{margin:48px 0;}

        /* Floating desktop pill */
        .float-pill{
          position:fixed;
          bottom:32px;
          left:50%;
          transform:translateX(-50%);
          z-index:300;
          background:rgba(26,16,8,0.91);
          backdrop-filter:blur(14px);
          border-radius:99px;
          padding:10px 24px;
          display:flex;
          align-items:center;
          gap:18px;
          box-shadow:0 8px 32px rgba(0,0,0,0.28),0 0 0 1px rgba(255,255,255,0.06);
          animation:slideUp .28s cubic-bezier(.16,1,.3,1);
          white-space:nowrap;
        }
        .float-pill-title{
          font-family:'Poppins',system-ui,sans-serif;
          font-size:12px;
          color:rgba(255,255,255,0.42);
          max-width:180px;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }
        .float-pill-div{width:1px;height:18px;background:rgba(255,255,255,0.12);}
        .float-btn{display:flex;align-items:center;gap:6px;background:none;border:none;cursor:pointer;font-family:'Poppins',system-ui,sans-serif;font-size:13px;font-weight:600;transition:opacity .15s;}
        .float-btn:hover{opacity:.75;}

        /* Mobile bottom bar */
        .mobile-bar{display:none;}

        /* ── MOBILE RESPONSIVE ── */
        @media(max-width:900px){
          .page-grid{grid-template-columns:1fr;gap:0;}
          .sidebar-root{position:static;display:none;} /* hide sidebar on mobile */
          .related-grid{grid-template-columns:repeat(2,1fr);}
        }

        @media(max-width:600px){
          .page-grid{padding:0 16px;}
          .art-body{font-size:16px;line-height:1.88;}
          .art-body>p:first-child::first-letter{font-size:4.2em;}
          .art-body blockquote{font-size:18px;padding:22px 20px;margin:2em 0;}
          .art-body h2{font-size:18px;}
          .related-grid{grid-template-columns:1fr;}
          .nl-row{flex-direction:column;}
          .nl-wrap{margin:36px 0;}

          /* mobile action bar at bottom */
          .mobile-bar{
            display:flex;
            align-items:center;
            justify-content:space-around;
            position:fixed;
            bottom:0;left:0;right:0;
            height:64px;
            background:rgba(255,255,255,0.97);
            backdrop-filter:blur(10px);
            border-top:1px solid ${BORDER};
            z-index:400;
            padding:0 16px;
          }
          /* push content up so it's not hidden behind bar */
          .page-content{padding-bottom:72px;}
          /* hide desktop pill on mobile */
          .float-pill{display:none !important;}
        }

        @media(max-width:480px){
          .art-body{font-size:15.5px;}
        }
      `}</style>

      <ReadingProgress/>
      {loginModal&&<LoginModal reason={loginModal} onClose={()=>setLoginModal(null)} onSuccess={handleLoginSuccess}/>}

      <div style={{background:BG,minHeight:"100vh"}} className="page-content">
        <div className="page-grid">

          {/* ══════════════ ARTICLE ══════════════ */}
          <article style={{minWidth:0,paddingTop:32,paddingBottom:40}}>

            {/* Breadcrumb */}
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:22}}>
              <Link href="/articles" style={{display:"inline-flex",alignItems:"center",gap:5,fontFamily:SANS,fontSize:12,fontWeight:600,color:MUTED,textDecoration:"none"}}
                onMouseEnter={e=>e.currentTarget.style.color=ORANGE} onMouseLeave={e=>e.currentTarget.style.color=MUTED}>
                <ArrowLeft size={13}/> Articles
              </Link>
              <span style={{fontFamily:SANS,fontSize:12,color:"#d0c4b4"}}>/</span>
              <span style={{fontFamily:SANS,fontSize:12,color:ORANGE,fontWeight:600}}>{article.category}</span>
            </div>

            {/* ── HEADER ── */}
            <header style={{marginBottom:24}}>
              {/* Category dot + label */}
              <div style={{display:"inline-flex",alignItems:"center",gap:7,marginBottom:14}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:ORANGE}}/>
                <span style={{fontFamily:SANS,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.18em",color:ORANGE}}>{article.category}</span>
              </div>

              {/* Title */}
              <h1 style={{fontFamily:SANS,fontSize:"clamp(24px,3.5vw,42px)",fontWeight:800,color:TEXT,lineHeight:1.16,marginBottom:16,letterSpacing:"-0.02em"}}>
                {article.title}
              </h1>

              {/* Standfirst */}
              {article.excerpt&&(
                <p style={{fontFamily:BODY,fontSize:"clamp(15px,1.8vw,18px)",color:"#5a4a3a",lineHeight:1.68,marginBottom:18,fontStyle:"italic",paddingBottom:18,borderBottom:`1px solid ${BORDER}`}}>
                  {article.excerpt}
                </p>
              )}

              {/* Meta — no publish date */}
              <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:14,fontFamily:SANS,fontSize:12,color:MUTED}}>
                {article.readTime&&(
                  <span style={{display:"flex",alignItems:"center",gap:4}}><Clock size={12}/>{article.readTime}</span>
                )}
                <span style={{display:"flex",alignItems:"center",gap:4}}>
                  <Eye size={12}/>
                  <span id="view-count">{fmtViews(viewCount)} views</span>
                </span>
                <span style={{display:"flex",alignItems:"center",gap:4}}><Heart size={12}/>{likeCount} likes</span>
              </div>
            </header>

            {/* ── TOP ACTION BAR ── */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8,padding:"11px 0",borderTop:`1px solid ${BORDER}`,borderBottom:`1px solid ${BORDER}`,marginBottom:24}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <button onClick={handleLike} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:99,border:`1.5px solid ${liked?"#fecaca":BORDER}`,background:liked?"#fef2f2":"transparent",color:liked?"#ef4444":MUTED,fontFamily:SANS,fontSize:13,fontWeight:600,cursor:"pointer",transition:"all .15s"}}>
                  <Heart size={14} fill={liked?"currentColor":"none"}/>{likeCount}
                </button>
                <button onClick={handleSave} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:99,border:`1.5px solid ${saved?`${ORANGE}66`:BORDER}`,background:saved?"#fff8f0":"transparent",color:saved?ORANGE:MUTED,fontFamily:SANS,fontSize:13,fontWeight:600,cursor:"pointer",transition:"all .15s"}}>
                  <Bookmark size={14} fill={saved?"currentColor":"none"}/>{saved?"Saved":"Save"}
                </button>
                <a href="#comments" style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:99,border:`1.5px solid ${BORDER}`,color:MUTED,fontFamily:SANS,fontSize:13,fontWeight:600,textDecoration:"none",transition:"all .15s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=ORANGE;e.currentTarget.style.color=ORANGE}} onMouseLeave={e=>{e.currentTarget.style.borderColor=BORDER;e.currentTarget.style.color=MUTED}}>
                  <MessageCircle size={14}/>
                </a>
              </div>
              {mounted&&<ShareButton article={article} s={{fontBody:SANS,fontDisplay:SANS,btnOutline:"sb-outline"}} variant="button" position="above"/>}
            </div>

            {/* ── FEATURED IMAGE 3:2 ── */}
            <div style={{position:"relative",width:"100%",paddingBottom:"66.666%",borderRadius:14,overflow:"hidden",background:"#e8ddd0"}}>
              <Image src={article.featuredImage||"/images/default.jpg"} alt={article.title} fill priority style={{objectFit:"cover",objectPosition:"center top"}}/>
              <button onClick={handleSave} style={{position:"absolute",top:12,right:12,width:36,height:36,borderRadius:"50%",background:"rgba(0,0,0,0.38)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.18)",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"background .15s"}}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,0.62)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(0,0,0,0.38)"}>
                <Bookmark size={15} fill={saved?"currentColor":"none"}/>
              </button>
            </div>
            {article.imageCaption&&(
              <p style={{fontFamily:SANS,fontSize:11,color:MUTED,textAlign:"center",marginTop:8,fontStyle:"italic"}}>{article.imageCaption}</p>
            )}

            {/* ── EXCERPT CARD ── */}
            {article.excerpt&&(
              <div style={{margin:"28px 0 0",background:"linear-gradient(135deg,#fff8f2,#fff4e6)",borderRadius:16,padding:"22px 26px",border:"1.5px solid #f0d8c0",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,width:4,height:"100%",background:"linear-gradient(180deg,"+ORANGE+","+GOLD+")",borderRadius:"4px 0 0 4px"}}/>
                <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <div style={{fontSize:28,lineHeight:1,color:ORANGE,fontFamily:BODY,fontWeight:700,flexShrink:0,marginTop:2}}>&ldquo;</div>
                  <div style={{flex:1}}>
                    <p style={{fontFamily:BODY,fontSize:16,fontStyle:"italic",color:"#3a2a14",lineHeight:1.78,marginBottom:10}}>{article.excerpt}</p>
                    <p style={{fontFamily:SANS,fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.12em",color:MUTED}}>Editor's Note · Guruji Shrawan</p>
                  </div>
                </div>
              </div>
            )}

            {/* ── ARTICLE BODY ── */}
            <div style={{paddingTop:36}}>
              <div className="art-body" dangerouslySetInnerHTML={{__html:article.content||`<p>${article.excerpt||""}</p>`}}/>
            </div>

            {/* ── TAGS ── */}
            {tags.length>0&&(
              <div style={{display:"flex",flexWrap:"wrap",gap:7,paddingTop:22,marginTop:16,borderTop:`1px solid ${BORDER}`}}>
                {tags.map(tag=>(
                  <Link key={tag} href={`/articles?topic=${encodeURIComponent(tag.toLowerCase())}`}
                    style={{fontFamily:SANS,fontSize:11,fontWeight:600,padding:"5px 13px",borderRadius:99,background:"#fdf5e0",color:"#7a5810",border:"1px solid #e8c97a",textDecoration:"none",transition:"all .15s"}}
                    onMouseEnter={e=>{e.currentTarget.style.background=GOLD;e.currentTarget.style.color="#fff"}}
                    onMouseLeave={e=>{e.currentTarget.style.background="#fdf5e0";e.currentTarget.style.color="#7a5810"}}>
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* ── ATTRIBUTION ── */}
            <div style={{marginTop:28,padding:"20px 22px",background:CARD,borderRadius:14,border:`1.5px solid ${BORDER}`,display:"flex",gap:14,alignItems:"flex-start"}}>
              <div style={{width:44,height:44,borderRadius:"50%",background:`linear-gradient(135deg,${ORANGE},#7a2606)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🔥</div>
              <div>
                <p style={{fontFamily:SANS,fontSize:13,fontWeight:700,color:TEXT,marginBottom:3}}>Guruji Shrawan Foundation</p>
                <p style={{fontFamily:SANS,fontSize:12,color:MUTED,lineHeight:1.75}}>
                  Created with love by volunteers from transcriptions of Guruji Shrawan's recorded sessions. Every word offered as service to seekers everywhere.
                </p>
              </div>
            </div>

            {/* ── BOTTOM ACTION BAR ── */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8,padding:"16px 0",borderTop:`1px solid ${BORDER}`,borderBottom:`1px solid ${BORDER}`,marginTop:24}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <button onClick={handleLike} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:99,border:`1.5px solid ${liked?"#fecaca":BORDER}`,background:liked?"#fef2f2":"transparent",color:liked?"#ef4444":MUTED,fontFamily:SANS,fontSize:13,fontWeight:600,cursor:"pointer",transition:"all .15s"}}>
                  <Heart size={15} fill={liked?"currentColor":"none"}/>{liked?"Liked":"Like this"}
                </button>
                <button onClick={handleSave} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:99,border:`1.5px solid ${saved?`${ORANGE}66`:BORDER}`,background:saved?"#fff8f0":"transparent",color:saved?ORANGE:MUTED,fontFamily:SANS,fontSize:13,fontWeight:600,cursor:"pointer",transition:"all .15s"}}>
                  <Bookmark size={15} fill={saved?"currentColor":"none"}/>{saved?"Saved":"Save"}
                </button>
              </div>
              {mounted&&<ShareButton article={article} s={{fontBody:SANS,fontDisplay:SANS,btnOutline:"sb-outline"}} variant="button" position="above"/>}
            </div>

            {/* ── NEWSLETTER ── */}
            <NewsletterInline/>

            {/* ── COMMENTS ── */}
            <CommentsSection articleSlug={article.slug} user={user} onLoginRequired={requireLogin}/>

            {/* ── RELATED ── */}
            <RelatedArticles articles={related}/>

            <div style={{height:32}}/>
          </article>

          {/* ══════════════ SIDEBAR ══════════════ */}
          <div style={{paddingTop:32}}>
            <ArticleSidebar
              article={article} allArticles={articles}
              user={user} onLogout={handleLogout}
              likeCount={likeCount} liked={liked} saved={saved}
              onLike={handleLike} onSave={handleSave}
              viewCount={viewCount}
            />
          </div>

        </div>
      </div>

      {/* ── FLOATING DESKTOP PILL (shows after scroll 500px, hidden on mobile) ── */}
      {showTop&&mounted&&(
        <div className="float-pill" style={{display:"flex"}}>
          <span className="float-pill-title">{article.title}</span>
          <div className="float-pill-div"/>
          <button onClick={handleLike} className="float-btn" style={{color:liked?"#f87171":"rgba(255,255,255,0.78)"}}>
            <Heart size={16} fill={liked?"currentColor":"none"}/>{likeCount}
          </button>
          <button onClick={handleSave} className="float-btn" style={{color:saved?"#fb923c":"rgba(255,255,255,0.78)"}}>
            <Bookmark size={16} fill={saved?"currentColor":"none"}/>
          </button>
          <a href="#comments" className="float-btn" style={{color:"rgba(255,255,255,0.78)",textDecoration:"none"}}>
            <MessageCircle size={16}/>
          </a>
          <ShareButton article={article} s={{fontBody:"'Poppins',system-ui,sans-serif",fontDisplay:"'Poppins',system-ui,sans-serif",btnOutline:"sb-float-pill"}} variant="icon" position="above"/>
        </div>
      )}

      {/* ── MOBILE BOTTOM BAR ── */}
      <MobileBar liked={liked} likeCount={likeCount} saved={saved} onLike={handleLike} onSave={handleSave} article={article} mounted={mounted}/>

      {/* Back to top */}
      {showTop&&(
        <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}
          className="back-top"
          style={{position:"fixed",bottom:80,right:20,zIndex:300,width:40,height:40,borderRadius:"50%",background:`linear-gradient(135deg,${ORANGE},#7a2606)`,color:"#fff",border:"none",cursor:"pointer",boxShadow:"0 4px 14px rgba(200,85,26,0.38)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,transition:"transform .15s"}}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"}
          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>↑</button>
      )}
    </>
  )
}