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

return(

<div className="border-b border-gray-200 bg-white sticky top-16 z-40">

<div className="max-w-7xl mx-auto px-6 flex gap-8 text-sm py-4 overflow-x-auto">

{topics.map(t =>(

<div
key={t}
className="flex items-center gap-1 cursor-pointer"
onMouseEnter={()=>setOpen(true)}
onMouseLeave={()=>setOpen(false)}
>

{t}

<ChevronDown size={14}/>

</div>

))}

</div>

{open && (

<div className="absolute left-0 w-full bg-white border-t shadow-lg">

<div className="max-w-7xl mx-auto px-6 grid grid-cols-3 gap-10 py-8">

<div>

<p className="text-xs uppercase text-gray-400 mb-3">
Topics
</p>

<ul className="space-y-2 text-sm">
<li>Love</li>
<li>Fear</li>
<li>Mind</li>
<li>Truth</li>
</ul>

</div>

<div>

<p className="text-xs uppercase text-gray-400 mb-3">
Top Articles
</p>

<ul className="space-y-2 text-sm">
<li>What Is Joy?</li>
<li>Understanding Fear</li>
<li>Living Without Conflict</li>
</ul>

</div>

<div>

<p className="text-xs uppercase text-gray-400 mb-3">
Explore
</p>

<p className="text-orange-600 cursor-pointer hover:underline">
Browse All Topics →
</p>

</div>

</div>

</div>

)}

</div>

)

}