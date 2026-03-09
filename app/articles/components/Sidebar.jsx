"use client"

import Link from "next/link"

export default function Sidebar(){

return(

<aside className="space-y-10 sticky top-24 h-fit">

{/* NEWSLETTER */}

<div className="bg-gray-50 p-6 rounded-xl">

<h3 className="text-lg font-semibold">
Get Wisdom in Your Inbox
</h3>

<p className="text-sm text-gray-500 mt-2 leading-relaxed">
Receive thoughtful insights and teachings every week.
</p>

<input
placeholder="Enter your email"
className="w-full bg-white rounded-lg px-4 py-2 mt-4 text-sm outline-none"
/>

<button className="w-full bg-black text-white py-2 rounded-lg mt-3 text-sm hover:bg-gray-800 transition">
Subscribe
</button>

</div>

{/* TRENDING TOPICS */}

<div>

<h3 className="text-lg font-semibold mb-4">
Trending Topics
</h3>

<ul className="space-y-3 text-sm">

<li>
<Link href="/articles?topic=love" className="text-gray-700 hover:text-black transition">
Love
</Link>
</li>

<li>
<Link href="/articles?topic=fear" className="text-gray-700 hover:text-black transition">
Fear
</Link>
</li>

<li>
<Link href="/articles?topic=mind" className="text-gray-700 hover:text-black transition">
Mind
</Link>
</li>

<li>
<Link href="/articles?topic=truth" className="text-gray-700 hover:text-black transition">
Truth
</Link>
</li>

</ul>

</div>

{/* QUOTE */}

<div className="bg-gray-50 p-6 rounded-xl">

<p className="text-sm text-gray-700 italic leading-relaxed">
"Truth liberates. Falsehood binds."
</p>

<p className="text-xs text-gray-400 mt-3">
— Guruji Shrawan
</p>

</div>

</aside>

)

}