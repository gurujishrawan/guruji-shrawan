"use client"

import { getArticles } from "../data"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, use } from "react"
import {
  Heart, MessageCircle, Bookmark,
  Clock, ArrowLeft, Flame, Eye, LogOut, Check, Loader2,
} from "lucide-react"
import ShareButton from "../Sharebutton"
import LoginModal from "../components/Loginmodal"
import { supabase } from "../../lib/supabaseClient"

/* ─── TOKENS ─── */
const BODY   = "'Lora', Georgia, serif"
const SANS   = "'Poppins', system-ui, sans-serif"
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

/* ─── READING PROGRESS ─── */
function ReadingProgress(){
  const [p,setP]=useState(0)
  useEffect(()=>{
    const fn=()=>{const h=document.body.scrollHeight-window.innerHeight;setP(h>0?Math.min(window.scrollY/h*100,100):0)}
    window.addEventListener("scroll",fn,{passive:true});return()=>window.removeEventListener("scroll",fn)
  },[])
  return <div style={{position:"fixed",top:0,left:0,zIndex:999,height:3,width:`${p}%`,background:`linear-gradient(90deg,${ORANGE},${GOLD})`,borderRadius:"0 2px 2px 0",transition:"width .1s linear",pointerEvents:"none"}}/>
}

/* ─── NEWSLETTER ─── */
function NewsletterInline(){
  const [email,setEmail]=useState("")
  const [sub,setSub]=useState(false)
  const [busy,setBusy]=useState(false)
  const [err,setErr]=useState("")
  async function go(){
    if(!email.includes("@")){setErr("Enter a valid email.");return}
    setBusy(true);setErr("")
    const {error}=await supabase.from("newsletter_subscribers").upsert({email:email.trim().toLowerCase()},{onConflict:"email"})
    setBusy(false)
    if(error){setErr("Something went wrong. Try again.");return}
    setSub(true)
  }
  return(
    <div className="nl-wrap">
      <div style={{padding:"32px 28px",background:"linear-gradient(135deg,#fff8f2,#fff4e0)",borderRadius:18,border:`1.5px solid ${BORDER}`}}>
        <p style={{fontFamily:SANS,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.16em",color:ORANGE,marginBottom:8}}>Newsletter</p>
        <h3 style={{fontFamily:SANS,fontSize:19,fontWeight:800,color:TEXT,marginBottom:6,lineHeight:1.3}}>Wisdom in Your Inbox</h3>
        <p style={{fontFamily:SANS,fontSize:13,color:MUTED,lineHeight:1.75,marginBottom:20}}>One thoughtful email a week. No noise.</p>
        {sub?(
          <div style={{background:"#f0fdf4",border:"1.5px solid #86efac",borderRadius:10,padding:"13px 18px",fontFamily:SANS,fontSize:14,color:"#15803d",fontWeight:600,display:"flex",alignItems:"center",gap:8}}>
            <Check size={16}/> You're in! Wisdom is on its way. 🙏
          </div>
        ):(
          <>
            {err&&<p style={{fontFamily:SANS,fontSize:12,color:"#dc2626",marginBottom:10}}>{err}</p>}
            <div className="nl-row">
              <input value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="Your email address" type="email"
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

/* ─── COMMENTS ─── */
function CommentsSection({articleSlug,user,onLoginRequired}){
  const [comments,setComments]=useState([])
  const [text,setText]=useState("")
  const [loading,setLoading]=useState(true)
  const [posting,setPosting]=useState(false)
  const [replyTo,setReplyTo]=useState(null)
  useEffect(()=>{
    async function load(){
      setLoading(true)
      const {data}=await supabase.from("article_comments").select("*").eq("article_slug",articleSlug).order("created_at",{ascending:false})
      setComments(data||[]);setLoading(false)
    }
    load()
  },[articleSlug])
  async function submit(){
    if(!text.trim()||posting)return
    if(!user){onLoginRequired("comment");return}
    setPosting(true)
    const {data,error}=await supabase.from("article_comments").insert({
      article_slug:articleSlug,user_id:user.id,
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
                style={{padding:"9px 22px",borderRadius:10,background:text.trim()&&!posting?`linear-gradient(135deg,${ORANGE},#8a2e06)`:"#e8dfd4",color:text.trim()&&!posting?"#fff":MUTED,fontFamily:SANS,fontSize:13,fontWeight:600,border:"none",cursor:text.trim()?"pointer":"default",display:"flex",alignItems:"center",gap:6}}>
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
            <div key={c.id} style={{display:"flex",gap:13,padding:"20px 0",borderBottom:i<comments.length-1?"1px solid #f0e8de":"none"}}>
              <div style={{width:38,height:38,borderRadius:"50%",background:c.user_avatar_color||ORANGE,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:SANS,fontSize:14,fontWeight:700,color:"#fff",flexShrink:0}}>
                {(c.user_name||"U")[0].toUpperCase()}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5,flexWrap:"wrap"}}>
                  <span style={{fontFamily:SANS,fontSize:13,fontWeight:700,color:TEXT}}>{c.user_name}</span>
                  {user&&c.user_id===user.id&&<span style={{fontFamily:SANS,fontSize:10,fontWeight:600,color:ORANGE,background:"#fff0e6",border:"1px solid #ffd4a8",borderRadius:99,padding:"1px 7px"}}>You</span>}
                  <span style={{fontFamily:SANS,fontSize:11,color:MUTED}}>{timeAgo(c.created_at)}</span>
                </div>
                <p style={{fontFamily:SANS,fontSize:14,color:"#3a2a1a",lineHeight:1.78,margin:0}}>{c.text}</p>
                <button onClick={()=>user?setReplyTo(c.user_name):onLoginRequired("reply")}
                  style={{fontFamily:SANS,fontSize:12,color:MUTED,background:"none",border:"none",cursor:"pointer",marginTop:8}}>↩ Reply</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── SIDEBAR ─── */
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
      <div style={{background:CARD,borderRadius:14,padding:"16px 18px",border:`1.5px solid ${BORDER}`,marginBottom:20}}>
        <p style={{fontFamily:SANS,fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.16em",color:GOLD,marginBottom:12}}>This Article</p>
        <div style={{display:"flex",flexDirection:"column",gap:2}}>
          <button onClick={onLike} className="side-action" style={{border:`1.5px solid ${liked?"#fecaca":"transparent"}`,background:liked?"#fef2f2":"transparent"}}>
            <Heart size={16} fill={liked?"#ef4444":"none"} style={{color:liked?"#ef4444":MUTED,flexShrink:0}}/>
            <span style={{fontFamily:SANS,fontSize:13,fontWeight:600,color:liked?"#ef4444":TEXT}}>{liked?"Liked":"Like"}</span>
            <span style={{fontFamily:SANS,fontSize:12,color:MUTED,marginLeft:"auto"}}>{likeCount}</span>
          </button>
          <button onClick={onSave} className="side-action" style={{border:`1.5px solid ${saved?ORANGE+"44":"transparent"}`,background:saved?"#fff8f0":"transparent"}}>
            <Bookmark size={16} fill={saved?"currentColor":"none"} style={{color:saved?ORANGE:MUTED,flexShrink:0}}/>
            <span style={{fontFamily:SANS,fontSize:13,fontWeight:600,color:saved?ORANGE:TEXT}}>{saved?"Saved":"Save"}</span>
          </button>
          <a href="#comments" className="side-action" style={{textDecoration:"none"}}>
            <MessageCircle size={16} style={{color:MUTED,flexShrink:0}}/>
            <span style={{fontFamily:SANS,fontSize:13,fontWeight:600,color:TEXT}}>Comment</span>
          </a>
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px"}}>
            <Eye size={16} style={{color:MUTED,flexShrink:0}}/>
            <span style={{fontFamily:SANS,fontSize:13,fontWeight:600,color:TEXT}}>Views</span>
            <span style={{fontFamily:SANS,fontSize:12,color:MUTED,marginLeft:"auto"}}>{viewCount>=1000?`${(viewCount/1000).toFixed(1)}k`:viewCount}</span>
          </div>
        </div>
      </div>
      <div style={{background:CARD,borderRadius:14,padding:"16px 18px",border:`1.5px solid ${BORDER}`,marginBottom:20}}>
        <p style={{fontFamily:SANS,fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.16em",color:GOLD,marginBottom:12}}>Explore Topics</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {TOPICS.map(t=>(
            <Link key={t} href={`/articles?topic=${encodeURIComponent(t.toLowerCase())}`} className="topic-pill">{t}</Link>
          ))}
        </div>
      </div>
      <div style={{background:CARD,borderRadius:14,padding:"16px 18px",border:`1.5px solid ${BORDER}`,marginBottom:20}}>
        <p style={{fontFamily:SANS,fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.16em",color:GOLD,marginBottom:12,display:"flex",alignItems:"center",gap:5}}>
          <Flame size={11} style={{color:ORANGE}}/> More Articles
        </p>
        {more.map((a,i)=>(
          <Link key={a.slug} href={`/articles/${a.slug}`} className="more-art-link" style={{borderBottom:i<more.length-1?"1px solid #f5f0ea":"none"}}>
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
      <div style={{background:`linear-gradient(145deg,${ORANGE},#7a2606)`,borderRadius:14,padding:"20px 18px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.07)"}}/>
        <p style={{fontFamily:SANS,fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",color:"#ffd580",marginBottom:5}}>Newsletter</p>
        <h3 style={{fontFamily:SANS,fontSize:15,fontWeight:800,color:"#fff",lineHeight:1.35,marginBottom:6}}>Wisdom in Your Inbox</h3>
        <p style={{fontFamily:SANS,fontSize:12,color:"rgba(255,255,255,0.68)",lineHeight:1.6,marginBottom:14}}>One email per week. No noise.</p>
        {done?(
          <div style={{background:"rgba(255,255,255,0.18)",borderRadius:9,padding:10,textAlign:"center",fontFamily:SANS,fontSize:13,color:"#fff",fontWeight:600}}>Subscribed!</div>
        ):(
          <>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your email" type="email"
              style={{width:"100%",padding:"9px 12px",borderRadius:9,border:"none",fontFamily:SANS,fontSize:13,color:TEXT,outline:"none",marginBottom:8,boxSizing:"border-box"}}/>
            <button onClick={handleSub} style={{width:"100%",padding:"9px",borderRadius:9,background:"#ffd580",border:"none",fontFamily:SANS,fontSize:13,fontWeight:700,color:"#6a2c06",cursor:"pointer"}}>Subscribe Free</button>
          </>
        )}
      </div>
    </aside>
  )
}

/* ─── RELATED ─── */
function RelatedArticles({articles}){
  if(!articles.length)return null
  return(
    <div style={{marginTop:60,paddingTop:40,borderTop:`1.5px solid ${BORDER}`}}>
      <p style={{fontFamily:SANS,fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.16em",color:GOLD,marginBottom:6}}>Continue Reading</p>
      <h2 style={{fontFamily:SANS,fontSize:20,fontWeight:800,color:TEXT,marginBottom:24}}>You Might Also Like</h2>
      <div className="related-grid">
        {articles.map(a=>(
          <Link key={a.slug} href={`/articles/${a.slug}`} className="rel-card">
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

/* ─── MOBILE BAR ─── */
function MobileBar({liked,likeCount,saved,onLike,onSave,article,mounted}){
  return(
    <div className="mobile-bar">
      <button onClick={onLike} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",color:liked?"#ef4444":"#6a5a4a",fontFamily:SANS,fontSize:10,fontWeight:600,minWidth:48}}>
        <Heart size={20} fill={liked?"currentColor":"none"}/><span>{likeCount}</span>
      </button>
      <button onClick={onSave} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",color:saved?ORANGE:"#6a5a4a",fontFamily:SANS,fontSize:10,fontWeight:600,minWidth:48}}>
        <Bookmark size={20} fill={saved?"currentColor":"none"}/><span>{saved?"Saved":"Save"}</span>
      </button>
      <a href="#comments" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,color:"#6a5a4a",textDecoration:"none",fontFamily:SANS,fontSize:10,fontWeight:600,minWidth:48}}>
        <MessageCircle size={20}/><span>Comment</span>
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

/* ─── EXCERPT CARD — always visible, no conditional ─── */
function ExcerptCard({text}){
  const body = text?.trim() || "An exploration of truth, presence, and the nature of the mind — through the timeless words of Guruji Shrawan."
  return(
    <div className="excerpt-card">
      <div className="excerpt-eyebrow">
        <span className="excerpt-line"/>&nbsp;Editor's Note&nbsp;<span className="excerpt-line"/>
      </div>
      <p className="excerpt-body">{body}</p>
      <div className="excerpt-footer">
        <div className="excerpt-avatar">🔥</div>
        <span className="excerpt-byline">Guruji Shrawan · Guruji Shrawan Foundation</span>
      </div>
    </div>
  )
}

/* ─── MAIN PAGE ─── */
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

  useEffect(()=>{
    setMounted(true)
    supabase.auth.getSession().then(({data:{session}})=>{setUser(session?.user??null);setAuthReady(true)})
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,session)=>setUser(session?.user??null))
    return()=>subscription.unsubscribe()
  },[])

  useEffect(()=>{
    if(!article)return
    let sid=sessionStorage.getItem("gs_sid")
    if(!sid){sid=Math.random().toString(36).slice(2);sessionStorage.setItem("gs_sid",sid)}
    async function initViews(){
      await supabase.from("article_views").upsert({article_slug:article.slug,session_id:sid},{onConflict:"article_slug,session_id",ignoreDuplicates:true})
      const {count}=await supabase.from("article_views").select("*",{count:"exact",head:true}).eq("article_slug",article.slug)
      if(count!=null)setViewCount(count)
    }
    initViews()
    const channel=supabase.channel(`views:${article.slug}`)
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"article_views",filter:`article_slug=eq.${article.slug}`},()=>setViewCount(c=>c+1))
      .subscribe()
    return()=>supabase.removeChannel(channel)
  },[article])

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

  useEffect(()=>{
    if(!article)return
    const ch=supabase.channel(`likes:${article.slug}`)
      .on("postgres_changes",{event:"*",schema:"public",table:"article_likes",filter:`article_slug=eq.${article.slug}`},
        async()=>{const {count}=await supabase.from("article_likes").select("*",{count:"exact",head:true}).eq("article_slug",article.slug);if(count!=null)setLikeCount(count)})
      .subscribe()
    return()=>supabase.removeChannel(ch)
  },[article])

  useEffect(()=>{
    const fn=()=>setShowTop(window.scrollY>600)
    window.addEventListener("scroll",fn,{passive:true});return()=>window.removeEventListener("scroll",fn)
  },[])

  if(!article)return notFound()

  const related=(()=>{const s=articles.filter(a=>a.slug!==article.slug&&a.category===article.category);return s.length>=2?s.slice(0,3):articles.filter(a=>a.slug!==article.slug).slice(0,3)})()
  const tags=article.tags?(Array.isArray(article.tags)?article.tags:article.tags.split(",").map(t=>t.trim())):[]
  const fmtViews=n=>n>=1000?`${(n/1000).toFixed(1)}k`:String(n)

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

  const O=ORANGE,G=GOLD,B=BORDER,S=SANS,BY=BODY,MU=MUTED,TX=TEXT,CA=CARD,BG_=BG

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes spin      { to { transform:rotate(360deg) } }
        @keyframes slideUp   { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes excerptIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes quoteGlow { 0%,100%{opacity:.05} 50%{opacity:.12} }
        *{box-sizing:border-box;margin:0;padding:0}

        /* layout */
        .page-grid{display:grid;grid-template-columns:1fr 268px;gap:48px;max-width:1140px;margin:0 auto;padding:0 20px;align-items:start}
        .sidebar-root{position:sticky;top:88px}

        /* body typography */
        .art-body{font-family:${BY};font-size:18px;line-height:1.92;color:#2a1806;letter-spacing:.008em}
        .art-body p{margin-bottom:1.55em}
        .art-body>p:first-child::first-letter{float:left;font-family:${BY};font-size:5em;line-height:.76;padding-right:.09em;padding-top:.06em;color:${O};font-weight:700}
        .art-body h2{font-family:${S};font-size:20px;font-weight:800;color:${TX};margin:2.6em 0 .65em;padding-top:.9em;border-top:1px solid ${B};letter-spacing:-.01em}
        .art-body h3{font-family:${S};font-size:14px;font-weight:700;color:${TX};margin:2em 0 .5em;text-transform:uppercase;letter-spacing:.1em}
        .art-body strong{font-weight:700;color:${TX}}
        .art-body em{font-style:italic;color:#4a3a2a}
        .art-body blockquote{margin:2.6em 0;padding:28px 32px;border-top:2px solid ${O};border-bottom:2px solid ${O};font-family:${BY};font-size:21px;font-style:italic;color:${TX};line-height:1.6;text-align:center}
        .art-body blockquote p{margin:0}
        .art-body a{color:${O};text-decoration:underline;text-underline-offset:3px}
        .art-body ul,.art-body ol{margin:.8em 0 1.55em 1.8em}
        .art-body li{margin-bottom:.55em;line-height:1.8}
        .art-body img{width:100%;border-radius:10px;margin:1.6em 0}
        .art-body figure{margin:2em 0}
        .art-body figcaption{font-family:${S};font-size:12px;color:${MU};text-align:center;margin-top:-8px}

        /* breadcrumb */
        .bc-link{display:inline-flex;align-items:center;gap:5px;font-family:${S};font-size:12px;font-weight:600;color:${MU};text-decoration:none;transition:color .22s ease}
        .bc-link:hover{color:${O}}

        /* ── ACTION PILL BUTTONS ──
           All transition properties named individually.
           Never use "all" — it causes janky repaints.           */
        .ap-btn{
          display:inline-flex;align-items:center;gap:6px;
          border-radius:99px;border:1.5px solid ${B};
          background:transparent;color:${MU};
          font-family:${S};font-size:13px;font-weight:600;
          cursor:pointer;white-space:nowrap;
          transition:
            border-color .26s cubic-bezier(.4,0,.2,1),
            color        .26s cubic-bezier(.4,0,.2,1),
            background   .26s cubic-bezier(.4,0,.2,1),
            box-shadow   .26s cubic-bezier(.4,0,.2,1),
            transform    .18s cubic-bezier(.4,0,.2,1);
        }
        .ap-btn:hover:not(.liked):not(.saved){
          border-color:${O};color:${O};background:#fff8f3;
          transform:translateY(-2px);box-shadow:0 5px 18px rgba(200,85,26,.15);
        }
        .ap-btn:active{transform:translateY(0) scale(.95)!important;box-shadow:none!important}
        .ap-btn.liked{border-color:#fecaca;background:#fef2f2;color:#ef4444}
        .ap-btn.liked:hover{border-color:#fca5a5;background:#fff5f5;transform:translateY(-2px);box-shadow:0 5px 18px rgba(239,68,68,.18)}
        .ap-btn.saved{border-color:${O}66;background:#fff8f0;color:${O}}
        .ap-btn.saved:hover{border-color:${O};background:#fff3e8;transform:translateY(-2px);box-shadow:0 5px 18px rgba(200,85,26,.18)}

        /* comment anchor */
        .ap-link{
          display:inline-flex;align-items:center;gap:6px;
          border-radius:99px;border:1.5px solid ${B};color:${MU};
          font-family:${S};font-size:13px;font-weight:600;text-decoration:none;
          transition:border-color .26s cubic-bezier(.4,0,.2,1),color .26s cubic-bezier(.4,0,.2,1),background .26s cubic-bezier(.4,0,.2,1),box-shadow .26s cubic-bezier(.4,0,.2,1),transform .18s cubic-bezier(.4,0,.2,1);
        }
        .ap-link:hover{border-color:${O};color:${O};background:#fff8f3;transform:translateY(-2px);box-shadow:0 5px 18px rgba(200,85,26,.13)}
        .ap-link:active{transform:translateY(0) scale(.95)}

        /* share outline */
        .sb-outline{
          font-family:${S};font-size:13px;font-weight:600;
          background:transparent;border:1.5px solid ${B};border-radius:9px;
          color:#6a5a4a;cursor:pointer;
          display:inline-flex;align-items:center;gap:5px;padding:7px 14px;
          transition:border-color .26s cubic-bezier(.4,0,.2,1),color .26s cubic-bezier(.4,0,.2,1),background .26s cubic-bezier(.4,0,.2,1),box-shadow .26s cubic-bezier(.4,0,.2,1),transform .18s cubic-bezier(.4,0,.2,1);
        }
        .sb-outline:hover{border-color:${O};color:${O};background:#fff8f3;box-shadow:0 5px 18px rgba(200,85,26,.13);transform:translateY(-2px)}
        .sb-outline:active{transform:translateY(0) scale(.95)}
        .sb-mob{background:none;border:none;color:#6a5a4a;cursor:pointer;display:inline-flex;align-items:center;padding:0}
        .sb-float-pill{background:none;border:none;color:rgba(255,255,255,.78);cursor:pointer;display:inline-flex;align-items:center;padding:0;transition:opacity .22s ease,transform .2s ease}
        .sb-float-pill:hover{opacity:.6;transform:scale(1.12)}

        /* floating pill */
        .float-pill{position:fixed;bottom:32px;left:50%;transform:translateX(-50%);z-index:300;background:rgba(26,16,8,.92);backdrop-filter:blur(14px);border-radius:99px;padding:10px 24px;display:flex;align-items:center;gap:18px;box-shadow:0 8px 32px rgba(0,0,0,.28),0 0 0 1px rgba(255,255,255,.06);animation:slideUp .28s cubic-bezier(.16,1,.3,1);white-space:nowrap}
        .float-pill-title{font-family:${S};font-size:12px;color:rgba(255,255,255,.42);max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .float-pill-div{width:1px;height:18px;background:rgba(255,255,255,.12)}
        .float-btn{display:flex;align-items:center;gap:6px;background:none;border:none;cursor:pointer;font-family:${S};font-size:13px;font-weight:600;transition:opacity .22s ease,transform .2s cubic-bezier(.4,0,.2,1)}
        .float-btn:hover{opacity:.6;transform:scale(1.12)}
        .float-btn:active{transform:scale(.93)}

        /* tags */
        .tag-pill{font-family:${S};font-size:11px;font-weight:600;padding:5px 13px;border-radius:99px;background:#fdf5e0;color:#7a5810;border:1px solid #e8c97a;text-decoration:none;transition:background .22s ease,color .22s ease,border-color .22s ease,transform .18s ease}
        .tag-pill:hover{background:${G};color:#fff;border-color:${G};transform:translateY(-1px)}

        /* topic pills */
        .topic-pill{font-family:${S};font-size:11px;font-weight:600;padding:5px 11px;border-radius:99px;background:${BG_};color:#5a4a3a;border:1px solid ${B};text-decoration:none;transition:background .22s ease,color .22s ease,border-color .22s ease,transform .18s ease}
        .topic-pill:hover{background:${O};color:#fff;border-color:${O};transform:translateY(-1px)}

        /* sidebar list */
        .more-art-link{display:flex;gap:10px;padding:10px 0;text-decoration:none;transition:opacity .22s ease}
        .more-art-link:hover{opacity:.58}

        /* sidebar action rows */
        .side-action{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;border:1.5px solid transparent;cursor:pointer;width:100%;text-align:left;background:transparent;transition:background .22s ease}
        .side-action:hover{background:${BG_}}

        /* related cards */
        .rel-card{text-decoration:none;display:block;border-radius:14px;overflow:hidden;background:${CA};border:1.5px solid ${B};transition:box-shadow .3s ease,transform .3s ease}
        .rel-card:hover{box-shadow:0 10px 34px rgba(180,80,20,.14);transform:translateY(-3px)}

        /* back-to-top */
        .back-top{position:fixed;bottom:80px;right:20px;z-index:300;width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,${O},#7a2606);color:#fff;border:none;cursor:pointer;box-shadow:0 4px 14px rgba(200,85,26,.38);display:flex;align-items:center;justify-content:center;font-size:16px;transition:transform .22s ease,box-shadow .22s ease}
        .back-top:hover{transform:scale(1.14) translateY(-2px);box-shadow:0 8px 24px rgba(200,85,26,.52)}
        .back-top:active{transform:scale(.94)}

        /* ── EXCERPT CARD ── */
        .excerpt-card{
          margin:32px 0 0;
          position:relative;overflow:hidden;
          border-radius:18px;
          padding:28px 30px 24px 34px;
          background:linear-gradient(135deg,#fffaf4 0%,#fff5e6 55%,#fff9f2 100%);
          border:1.5px solid #eed0a4;
          box-shadow:0 6px 30px rgba(200,85,26,.08),inset 0 1px 0 rgba(255,255,255,.92);
          animation:excerptIn .5s .08s ease-out both;
        }
        /* orange left bar */
        .excerpt-card::before{content:'';position:absolute;top:0;left:0;width:5px;height:100%;background:linear-gradient(180deg,${O},${G} 50%,${O}80);border-radius:4px 0 0 4px}
        /* giant decorative quote */
        .excerpt-card::after{content:'\u201C';position:absolute;bottom:-28px;right:14px;font-family:Georgia,serif;font-size:160px;font-weight:700;line-height:1;color:${O};pointer-events:none;user-select:none;animation:quoteGlow 4s ease-in-out infinite}
        .excerpt-eyebrow{display:flex;align-items:center;gap:8px;font-family:${S};font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.2em;color:${O};margin-bottom:14px}
        .excerpt-line{display:inline-block;width:22px;height:1.5px;background:${O};opacity:.45;border-radius:1px;flex-shrink:0}
        .excerpt-body{font-family:${BY};font-size:17.5px;font-style:italic;color:#35200e;line-height:1.85;position:relative;z-index:1}
        .excerpt-footer{margin-top:16px;padding-top:12px;border-top:1px solid #f0d0a8;display:flex;align-items:center;gap:9px}
        .excerpt-avatar{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,${O},#7a2606);display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0}
        .excerpt-byline{font-family:${S};font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:${MU}}

        /* misc */
        .nl-row{display:flex;gap:10px}
        .nl-wrap{margin:48px 0}
        .related-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .mobile-bar{display:none}

        /* responsive */
        @media(max-width:900px){
          .page-grid{grid-template-columns:1fr;gap:0}
          .sidebar-root{display:none}
          .related-grid{grid-template-columns:repeat(2,1fr)}
        }
        @media(max-width:600px){
          .page-grid{padding:0 16px}
          .art-body{font-size:16px;line-height:1.88}
          .art-body>p:first-child::first-letter{font-size:4.2em}
          .art-body blockquote{font-size:18px;padding:22px 20px}
          .art-body h2{font-size:18px}
          .related-grid{grid-template-columns:1fr}
          .nl-row{flex-direction:column}
          .nl-wrap{margin:36px 0}
          .excerpt-card{padding:22px 22px 20px 26px}
          .excerpt-body{font-size:15.5px}
          .excerpt-card::after{font-size:110px}
          .mobile-bar{display:flex;align-items:center;justify-content:space-around;position:fixed;bottom:0;left:0;right:0;height:64px;background:rgba(255,255,255,.97);backdrop-filter:blur(10px);border-top:1px solid ${B};z-index:400;padding:0 16px}
          .page-content{padding-bottom:72px}
          .float-pill{display:none!important}
        }
        @media(max-width:480px){.art-body{font-size:15.5px}}
      `}</style>

      <ReadingProgress/>
      {loginModal&&<LoginModal reason={loginModal} onClose={()=>setLoginModal(null)} onSuccess={handleLoginSuccess}/>}

      <div style={{background:BG,minHeight:"100vh"}} className="page-content">
        <div className="page-grid">

          {/* ══════ ARTICLE ══════ */}
          <article style={{minWidth:0,paddingTop:32,paddingBottom:40}}>

            {/* Breadcrumb */}
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:22}}>
              <Link href="/articles" className="bc-link"><ArrowLeft size={13}/> Articles</Link>
              <span style={{fontFamily:SANS,fontSize:12,color:"#d0c4b4"}}>/</span>
              <span style={{fontFamily:SANS,fontSize:12,color:ORANGE,fontWeight:600}}>{article.category}</span>
            </div>

            {/* Header */}
            <header style={{marginBottom:24}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:7,marginBottom:14}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:ORANGE}}/>
                <span style={{fontFamily:SANS,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.18em",color:ORANGE}}>{article.category}</span>
              </div>
              <h1 style={{fontFamily:SANS,fontSize:"clamp(24px,3.5vw,42px)",fontWeight:800,color:TEXT,lineHeight:1.16,marginBottom:16,letterSpacing:"-0.02em"}}>{article.title}</h1>
              {article.excerpt&&(
                <p style={{fontFamily:BODY,fontSize:"clamp(15px,1.8vw,18px)",color:"#5a4a3a",lineHeight:1.68,marginBottom:18,fontStyle:"italic",paddingBottom:18,borderBottom:`1px solid ${BORDER}`}}>
                  {article.excerpt}
                </p>
              )}
              <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:14,fontFamily:SANS,fontSize:12,color:MUTED}}>
                {article.readTime&&<span style={{display:"flex",alignItems:"center",gap:4}}><Clock size={12}/>{article.readTime}</span>}
                <span style={{display:"flex",alignItems:"center",gap:4}}><Eye size={12}/>{fmtViews(viewCount)} views</span>
                <span style={{display:"flex",alignItems:"center",gap:4}}><Heart size={12}/>{likeCount} likes</span>
              </div>
            </header>

            {/* Top action bar */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8,padding:"11px 0",borderTop:`1px solid ${BORDER}`,borderBottom:`1px solid ${BORDER}`,marginBottom:24}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <button onClick={handleLike} className={`ap-btn${liked?" liked":""}`} style={{padding:"7px 14px"}}>
                  <Heart size={14} fill={liked?"currentColor":"none"}/>{likeCount}
                </button>
                <button onClick={handleSave} className={`ap-btn${saved?" saved":""}`} style={{padding:"7px 14px"}}>
                  <Bookmark size={14} fill={saved?"currentColor":"none"}/>{saved?"Saved":"Save"}
                </button>
                <a href="#comments" className="ap-link" style={{padding:"7px 14px"}}><MessageCircle size={14}/></a>
              </div>
              {mounted&&<ShareButton article={article} s={{fontBody:SANS,fontDisplay:SANS,btnOutline:"sb-outline"}} variant="button" position="above"/>}
            </div>

            {/* Featured image */}
            <div style={{position:"relative",width:"100%",paddingBottom:"66.666%",borderRadius:14,overflow:"hidden",background:"#e8ddd0"}}>
              <Image src={article.featuredImage||"/images/default.jpg"} alt={article.title} fill priority style={{objectFit:"cover",objectPosition:"center top"}}/>
              <button onClick={handleSave}
                style={{position:"absolute",top:12,right:12,width:36,height:36,borderRadius:"50%",background:saved?"rgba(200,85,26,.75)":"rgba(0,0,0,.38)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,.18)",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"background .22s ease"}}>
                <Bookmark size={15} fill={saved?"currentColor":"none"}/>
              </button>
            </div>
            {article.imageCaption&&<p style={{fontFamily:SANS,fontSize:11,color:MUTED,textAlign:"center",marginTop:8,fontStyle:"italic"}}>{article.imageCaption}</p>}

            {/* EXCERPT CARD — always shown */}
            <ExcerptCard text={article.excerpt}/>

            {/* Article body */}
            <div style={{paddingTop:36}}>
              <div className="art-body" dangerouslySetInnerHTML={{__html:article.content||`<p>${article.excerpt||""}</p>`}}/>
            </div>

            {/* Tags */}
            {tags.length>0&&(
              <div style={{display:"flex",flexWrap:"wrap",gap:7,paddingTop:22,marginTop:16,borderTop:`1px solid ${BORDER}`}}>
                {tags.map(tag=>(
                  <Link key={tag} href={`/articles?topic=${encodeURIComponent(tag.toLowerCase())}`} className="tag-pill">#{tag}</Link>
                ))}
              </div>
            )}

            {/* Attribution */}
            <div style={{marginTop:28,padding:"20px 22px",background:CARD,borderRadius:14,border:`1.5px solid ${BORDER}`,display:"flex",gap:14,alignItems:"flex-start"}}>
              <div style={{width:44,height:44,borderRadius:"50%",background:`linear-gradient(135deg,${ORANGE},#7a2606)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🔥</div>
              <div>
                <p style={{fontFamily:SANS,fontSize:13,fontWeight:700,color:TEXT,marginBottom:3}}>Guruji Shrawan Foundation</p>
                <p style={{fontFamily:SANS,fontSize:12,color:MUTED,lineHeight:1.75}}>Created with love by volunteers from transcriptions of Guruji Shrawan's recorded sessions. Every word offered as service to seekers everywhere.</p>
              </div>
            </div>

            {/* Bottom action bar */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8,padding:"16px 0",borderTop:`1px solid ${BORDER}`,borderBottom:`1px solid ${BORDER}`,marginTop:24}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <button onClick={handleLike} className={`ap-btn${liked?" liked":""}`} style={{padding:"8px 16px"}}>
                  <Heart size={15} fill={liked?"currentColor":"none"}/>{liked?"Liked":"Like this"}
                </button>
                <button onClick={handleSave} className={`ap-btn${saved?" saved":""}`} style={{padding:"8px 16px"}}>
                  <Bookmark size={15} fill={saved?"currentColor":"none"}/>{saved?"Saved":"Save"}
                </button>
              </div>
              {mounted&&<ShareButton article={article} s={{fontBody:SANS,fontDisplay:SANS,btnOutline:"sb-outline"}} variant="button" position="above"/>}
            </div>

            <NewsletterInline/>
            <CommentsSection articleSlug={article.slug} user={user} onLoginRequired={requireLogin}/>
            <RelatedArticles articles={related}/>
            <div style={{height:32}}/>
          </article>

          {/* ══════ SIDEBAR ══════ */}
          <div style={{paddingTop:32}}>
            <ArticleSidebar article={article} allArticles={articles} user={user} onLogout={handleLogout}
              likeCount={likeCount} liked={liked} saved={saved} onLike={handleLike} onSave={handleSave} viewCount={viewCount}/>
          </div>
        </div>
      </div>

      {/* Floating pill */}
      {showTop&&mounted&&(
        <div className="float-pill">
          <span className="float-pill-title">{article.title}</span>
          <div className="float-pill-div"/>
          <button onClick={handleLike} className="float-btn" style={{color:liked?"#f87171":"rgba(255,255,255,.78)"}}>
            <Heart size={16} fill={liked?"currentColor":"none"}/>{likeCount}
          </button>
          <button onClick={handleSave} className="float-btn" style={{color:saved?"#fb923c":"rgba(255,255,255,.78)"}}>
            <Bookmark size={16} fill={saved?"currentColor":"none"}/>
          </button>
          <a href="#comments" className="float-btn" style={{color:"rgba(255,255,255,.78)",textDecoration:"none"}}>
            <MessageCircle size={16}/>
          </a>
          <ShareButton article={article} s={{fontBody:SANS,fontDisplay:SANS,btnOutline:"sb-float-pill"}} variant="icon" position="above"/>
        </div>
      )}

      <MobileBar liked={liked} likeCount={likeCount} saved={saved} onLike={handleLike} onSave={handleSave} article={article} mounted={mounted}/>
      {showTop&&<button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})} className="back-top">↑</button>}
    </>
  )
}