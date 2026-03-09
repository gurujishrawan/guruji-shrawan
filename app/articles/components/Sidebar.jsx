"use client"

export default function Sidebar(){

return(

<aside className="space-y-10 sticky top-28 h-fit">

<div className="bg-white p-6 rounded-xl shadow-sm border">

<h3 className="text-lg font-semibold">
Get Wisdom in Your Inbox
</h3>

<p className="text-sm text-gray-500 mt-2">
Receive curated insights every week.
</p>

<input
placeholder="Enter your email"
className="w-full border rounded-lg px-4 py-2 mt-4"
/>

<button className="w-full bg-orange-500 text-white py-2 rounded-lg mt-3">
Subscribe
</button>

</div>

<div>

<h3 className="font-semibold mb-3">
Trending Topics
</h3>

<ul className="space-y-2 text-sm text-gray-600">

<li>Love</li>
<li>Fear</li>
<li>Mind</li>
<li>Truth</li>

</ul>

</div>

</aside>

)

}