"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const topics = [
"For You",
"Trending",
"On Life",
"Women",
"Youth",
"Climate Crisis",
"Bhagavad Gita",
"Scriptures",
"Saints",
"All Topics"
]

export default function TopicNav(){

const [open,setOpen] = useState(false)
const [active,setActive] = useState(null)

function toggle(topic){
if(active === topic){
setActive(null)
setOpen(false)
}else{
setActive(topic)
setOpen(true)
}
}

return(

<div className="border-b border-gray-200 bg-white sticky top-16 z-40">

{/* TOPIC SCROLLER */}

<div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto">

<div className="flex gap-6 sm:gap-8 text-sm py-4 whitespace-nowrap">

{topics.map(topic =>(

<button
key={topic}
onClick={()=>toggle(topic)}
className="flex items-center gap-1 text-gray-700 hover:text-black transition"
>

{topic}

<ChevronDown
size={14}
className={`transition ${active===topic ? "rotate-180" : ""}`}
/>

</button>

))}

</div>

</div>

{/* DROPDOWN */}

{open && (

<div className="absolute left-0 w-full bg-white border-t shadow-lg">

<div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-3 gap-8 py-6">

{/* COLUMN 1 */}

<div>

<p className="text-xs uppercase text-gray-400 mb-3">
Topics
</p>

<ul className="space-y-2 text-sm text-gray-700">

<li className="hover:text-black cursor-pointer">Love</li>
<li className="hover:text-black cursor-pointer">Fear</li>
<li className="hover:text-black cursor-pointer">Mind</li>
<li className="hover:text-black cursor-pointer">Truth</li>

</ul>

</div>

{/* COLUMN 2 */}

<div>

<p className="text-xs uppercase text-gray-400 mb-3">
Top Articles
</p>

<ul className="space-y-2 text-sm text-gray-700">

<li className="hover:text-black cursor-pointer">What Is Joy?</li>
<li className="hover:text-black cursor-pointer">Understanding Fear</li>
<li className="hover:text-black cursor-pointer">Living Without Conflict</li>

</ul>

</div>

{/* COLUMN 3 */}

<div>

<p className="text-xs uppercase text-gray-400 mb-3">
Explore
</p>

<p className="text-orange-600 hover:underline cursor-pointer">
Browse All Topics →
</p>

</div>

</div>

</div>

)}

</div>

)

}