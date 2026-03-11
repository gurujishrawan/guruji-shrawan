"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown, Search, X } from "lucide-react"

/* ---------------- TABS ---------------- */

const TABS = [
  "For You",
  "Trending",
  "On Life",
  "Women",
  "Youth",
  "Climate Crisis",
  "Bhagavad Gita",
  "Scriptures",
  "Saints",
  "All Topics",
]

export default function TopicNav({ NAV_DATA }) {

  const router = useRouter()

  const [active,setActive] = useState("For You")
  const [openTab,setOpenTab] = useState(null)
  const [searchOpen,setSearchOpen] = useState(false)
  const [searchVal,setSearchVal] = useState("")
  const [lang,setLang] = useState("ALL")

  const dropdownRef = useRef(null)

  /* ---------------- CLOSE DROPDOWN ---------------- */

  useEffect(()=>{
    function handler(e){
      if(dropdownRef.current && !dropdownRef.current.contains(e.target)){
        setOpenTab(null)
      }
    }
    document.addEventListener("mousedown",handler)
    return ()=>document.removeEventListener("mousedown",handler)
  },[])

  /* ---------------- TAB CLICK ---------------- */

  function handleTab(label){

    setActive(label)

    if(label==="All Topics"){
      setOpenTab(null)
      router.push("/articles/topics")
      return
    }

    setOpenTab(prev=>prev===label ? null : label)

    setSearchOpen(false)
  }

  /* ---------------- UI ---------------- */

  return(

<div ref={dropdownRef} className="relative bg-white border-b border-[#ede5da]">

{/* NAV BAR */}

<div className="max-w-7xl mx-auto px-4 sm:px-6">

<div className="grid grid-cols-[1fr_auto] items-center gap-3">

{/* ---------------- TABS ---------------- */}

<div className="overflow-x-auto scrollbar-hide">

<div className="flex items-center gap-1 w-max">

{TABS.map((label)=>(
<button
key={label}
onClick={()=>handleTab(label)}
className={`
flex items-center gap-1
px-3 py-3
text-[13px] md:text-[14px]
whitespace-nowrap
transition
${active===label ? "text-[#d4621a]" : "text-[#5a4a3a]"}
`}
>

{label}

{NAV_DATA?.[label] && (
<ChevronDown
size={12}
className={`transition ${
openTab===label ? "rotate-180" : ""
}`}
/>
)}

</button>
))}

</div>

</div>

{/* ---------------- RIGHT ACTIONS ---------------- */}

<div className="flex items-center gap-2">

{/* SEARCH BUTTON */}

<button
onClick={()=>{
setSearchOpen(v=>!v)
setOpenTab(null)
}}
className="p-2 rounded-full hover:bg-[#f7f2ec]"
>

{searchOpen ? <X size={16}/> : <Search size={16}/>}

</button>


{/* LANGUAGE (Desktop only) */}

<div className="hidden lg:flex items-center gap-1">

{["ALL","EN","HI"].map((l)=>(
<button
key={l}
onClick={()=>setLang(l)}
className={`
text-[11px]
px-2 py-1
rounded
whitespace-nowrap
transition
${lang===l ? "bg-[#fff0e6] text-[#d4621a]" : "text-[#8a7a6a]"}
`}
>
{l}
</button>
))}

</div>

</div>

</div>

</div>

{/* ---------------- SEARCH BAR ---------------- */}

{searchOpen && (

<div className="border-t border-[#ede5da] bg-[#faf8f5] px-4 py-4">

<div className="max-w-xl mx-auto">

<div className="flex items-center gap-2 bg-white border border-[#e8dfd4] rounded-xl px-4 py-2">

<Search size={15} className="text-[#b0a090]" />

<input
autoFocus
value={searchVal}
onChange={(e)=>setSearchVal(e.target.value)}
placeholder="Search wisdom articles..."
className="flex-1 outline-none bg-transparent text-[14px]"
/>

{searchVal && (
<button onClick={()=>setSearchVal("")}>
<X size={14}/>
</button>
)}

</div>

</div>

</div>

)}

{/* ---------------- DROPDOWN ---------------- */}

{openTab && NAV_DATA?.[openTab] && (

<div
className="
absolute left-0 w-full
bg-white
border-t border-[#ede5da]
shadow-[0_16px_48px_rgba(0,0,0,0.12)]
z-50
"
>

<div className="max-w-7xl mx-auto px-4 sm:px-6 py-7">

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

{/* TOPICS */}

<div>

<p className="text-[10px] uppercase tracking-[0.16em] font-bold mb-4 text-[#c8941a]">
TOPICS
</p>

<ul className="grid grid-cols-2 gap-x-4 gap-y-2">

{NAV_DATA[openTab].topics?.map((topic)=>(
<li key={topic}>
<Link
href={`/articles?topic=${encodeURIComponent(topic.toLowerCase())}`}
onClick={()=>setOpenTab(null)}
className="text-[13px] text-[#5a4a3a] hover:text-[#d4621a]"
>
{topic}
</Link>
</li>
))}

</ul>

</div>

{/* ARTICLES */}

<div>

<p className="text-[10px] uppercase tracking-[0.16em] font-bold mb-4 text-[#c8941a]">
TOP ARTICLES
</p>

<ul className="space-y-4">

{NAV_DATA[openTab].articles?.map((a)=>(
<li key={a.slug}>
<Link
href={`/articles/${a.slug}`}
onClick={()=>setOpenTab(null)}
className="block group"
>

<span className="text-[10px] uppercase text-[#c8941a]">
{a.category}
</span>

<p className="text-[13px] text-[#5a4a3a] group-hover:text-[#d4621a] mt-1">
{a.title}
</p>

</Link>
</li>
))}

</ul>

</div>

{/* CTA */}

<div>

<p className="text-[10px] uppercase tracking-[0.16em] font-bold mb-4 text-[#c8941a]">
EXPLORE
</p>

<p className="text-[13px] text-[#7a6a5a] mb-4">
Dive into <strong>{openTab}</strong> — curated wisdom for the sincere seeker.
</p>

<Link
href={`/articles?tab=${encodeURIComponent(openTab)}`}
onClick={()=>setOpenTab(null)}
className="inline-flex px-5 py-2 text-[13px] bg-[#d4621a] text-white rounded-md"
>
Browse All →
</Link>

</div>

</div>

</div>

</div>

)}

</div>

  )

}