"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { siteContent } from "../content/siteContent"
import { useLanguage } from "../context/LanguageContext"
import { FaSearch } from "react-icons/fa"
import { getArticles } from "../articles/data"
import Image from "next/image"

export default function Navbar(){

const router = useRouter()
const pathname = usePathname()

const { language, setLanguage } = useLanguage()

const t = siteContent[language] || siteContent.en

const [search,setSearch] = useState("")
const [suggestions,setSuggestions] = useState([])
const [articles,setArticles] = useState([])
const [scrolled,setScrolled] = useState(false)

useEffect(()=>{

setArticles(getArticles())

function handleScroll(){
setScrolled(window.scrollY > 5)
}

window.addEventListener("scroll",handleScroll)

return ()=>window.removeEventListener("scroll",handleScroll)

},[])

/* SMART SEARCH */

function handleChange(e){

const value = e.target.value
setSearch(value)

if(!value){
setSuggestions([])
return
}

const filtered = articles.filter(article => {

const text = `
${article.title}
${article.excerpt}
${article.category}
${article.tags || ""}
`.toLowerCase()

return text.includes(value.toLowerCase())

})

setSuggestions(filtered.slice(0,6))

}

/* ENTER SEARCH */

function handleEnter(e){

if(e.key==="Enter"){
router.push(`/articles?search=${search}`)
setSuggestions([])
}

}

function goToArticle(slug){

router.push(`/articles/${slug}`)
setSearch("")
setSuggestions([])

}

return(

<header
className={`sticky top-0 z-50 transition-all duration-300 ${
scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-white"
}`}
>

<div className="mx-auto w-[min(1280px,95%)] flex items-center justify-between py-4">

{/* LOGO */}

<Link
href="/"
className="text-lg font-semibold tracking-tight"
>
Guruji Shrawan
</Link>

{/* NAV */}

<nav className="hidden md:flex items-center gap-8 text-sm font-medium">

<Link
href="/"
className={`transition ${
pathname === "/" ? "text-black font-semibold" : "text-gray-600 hover:text-black"
}`}
>
{t?.nav?.home}
</Link>

<Link
href="/articles"
className={`transition ${
pathname.startsWith("/articles")
? "text-black font-semibold"
: "text-gray-600 hover:text-black"
}`}
>
{t?.nav?.articles}
</Link>

<Link
href="/biography"
className={`transition ${
pathname === "/biography"
? "text-black font-semibold"
: "text-gray-600 hover:text-black"
}`}
>
{t?.nav?.biography}
</Link>

</nav>

{/* SEARCH */}

<div className="relative hidden md:block">

<div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-[280px]">

<FaSearch className="text-gray-400 text-sm mr-2"/>

<input
value={search}
onChange={handleChange}
onKeyDown={handleEnter}
placeholder="Search articles..."
className="bg-transparent outline-none text-sm text-gray-700 w-full placeholder-gray-400"
/>

</div>

{/* SUGGESTIONS */}

{suggestions.length > 0 && (

<div className="absolute mt-2 w-full bg-white shadow-xl rounded-xl border overflow-hidden">

{suggestions.map(article => (

<button
key={article.slug}
onClick={()=>goToArticle(article.slug)}
className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-gray-50"
>

<Image
src={article.featuredImage || "/images/mood.jpg"}
alt={article.title}
width={40}
height={40}
className="rounded-md object-cover"
/>

<div>

<p className="text-sm font-medium">
{article.title}
</p>

<p className="text-xs text-gray-500">
{article.category}
</p>

</div>

</button>

))}

</div>

)}

</div>

{/* LOGIN / SIGNUP */}

<div className="hidden md:flex items-center gap-3">

<Link
href="/signin"
className="px-4 py-1.5 text-sm rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
>
Login
</Link>

<Link
href="/signup"
className="px-4 py-1.5 text-sm rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
>
Signup
</Link>

</div>

{/* LANGUAGE */}

<select
value={language}
onChange={(e)=>setLanguage(e.target.value)}
className="ml-4 border border-gray-200 rounded-full px-3 py-1 text-sm text-gray-600 bg-white"
>

<option value="en">EN</option>
<option value="hi">HI</option>

</select>

</div>

</header>

)

}