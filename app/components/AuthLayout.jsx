"use client"

import Link from "next/link"

export default function AuthLayout({ children, activeTab }) {

return (

<section className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-blue-50 via-white to-blue-100">

<div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">

{/* LEFT SIDE */}

<div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-blue-600 to-blue-800 text-white p-12">

<div>

<h1 className="text-2xl font-semibold mb-4">
Guruji Shrawan
</h1>

<p className="text-blue-100 text-sm leading-relaxed">

Explore teachings on clarity, relationships,
and conscious living.

<br/><br/>

Join thousands discovering deeper
understanding through articles,
books and videos.

</p>

</div>

<p className="text-blue-200 text-sm">
Spiritual clarity for modern life
</p>

</div>

{/* RIGHT SIDE */}

<div className="p-12">

{/* Tabs */}

<div className="flex bg-gray-100 rounded-lg p-1 mb-8">

<Link
href="/signin"
className={`flex-1 text-center py-2 text-sm rounded-md font-medium ${
activeTab === "signin"
? "bg-white shadow text-gray-800"
: "text-gray-500"
}`}
>
Sign In
</Link>

<Link
href="/signup"
className={`flex-1 text-center py-2 text-sm rounded-md font-medium ${
activeTab === "signup"
? "bg-white shadow text-gray-800"
: "text-gray-500"
}`}
>
Sign Up
</Link>

</div>

{children}

</div>

</div>

</section>

)

}
