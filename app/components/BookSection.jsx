import Image from "next/image"
import Link from "next/link"

export default function BookSection(){

return(

<section className="mt-20 mb-24">

<div className="bg-[#1e1ea8] px-10 py-16 text-white">

<div className="grid md:grid-cols-2 gap-12 items-center">

{/* BOOK MOCKUP */}

<div className="flex justify-center perspective-[1200px]">

<div className="relative group">

{/* BOOK PAGES */}
<div className="absolute top-2 left-[6px] w-[320px] h-[450px] bg-gray-200 rounded-r-sm shadow-md"/>

{/* BOOK COVER */}
<div className="relative z-10 transform transition duration-500 group-hover:rotate-y-6">

<Image
src="/images/book-cover.png"
alt="Baccho Ki Parvarish Book"
width={320}
height={450}
className="shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
/>

</div>

</div>

</div>

{/* BOOK CONTENT */}

<div>

<p className="uppercase text-sm tracking-widest text-orange-300 mb-3">
Book Launch
</p>

<h2 className="text-4xl font-bold mb-4">
Baccho Ki Parvarish
</h2>

<p className="text-blue-100 leading-relaxed mb-6">
A practical guide for parents to raise children with clarity,
wisdom and understanding in the modern world.
</p>

<Link
href="/books/baccho-ki-parvarish"
className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
>
Get Now →
</Link>

</div>

</div>

</div>

</section>

)

}