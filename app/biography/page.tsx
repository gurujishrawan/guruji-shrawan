"use client"

import Image from "next/image"
import Link from "next/link"

export default function BiographyPage() {

return (

<main className="bg-black text-white min-h-screen font-sans">

{/* HERO */}

<section className="relative py-32 text-center border-b border-white/10">

<Link
href="/"
className="absolute left-6 top-6 text-white/70 hover:text-white"
>
← Back
</Link>

<h1 className="text-5xl md:text-6xl font-bold tracking-tight">
Guruji Shrawan
</h1>

<p className="mt-4 text-lg text-white/70">
Biography
</p>

<div className="mt-16 flex justify-center">

<Image
src="/images/guruji.jpg"
alt="Guruji portrait"
width={420}
height={520}
className="rounded-2xl shadow-2xl"
/>

</div>

</section>


{/* ABOUT */}

<section className="max-w-6xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16 items-center">

<div>

<Image
src="/images/hero1.jpg"
alt="Guruji speaking"
width={500}
height={600}
className="rounded-2xl shadow-xl"
/>

</div>

<div>

<h2 className="text-3xl font-semibold mb-6">
About Guruji
</h2>

<p className="text-white/80 leading-relaxed mb-6">
Guruji Shrawan was born in 1990 in Bhagalpur, Bihar.
From a young age he showed an unusual tendency to observe life deeply rather than simply follow traditions and beliefs.
</p>

<p className="text-white/80 leading-relaxed mb-6">
Instead of accepting inherited ideas blindly, he began questioning the roots of fear, identity and conditioning.
This inner inquiry gradually shaped his understanding of life and human nature.
</p>

<p className="text-white/80 leading-relaxed">
Today Guruji's work focuses on helping individuals look directly at themselves and understand the patterns that shape their lives.
</p>

</div>

</section>


{/* TIMELINE */}

<section className="max-w-4xl mx-auto px-6 py-28">

<h2 className="text-3xl font-semibold mb-16 text-center">
Life Journey
</h2>

<div className="relative border-l border-white/20 pl-10 space-y-16">

{/* ITEM */}

<div>

<span className="absolute -left-[9px] w-4 h-4 bg-white rounded-full"></span>

<h3 className="text-xl font-semibold">
1990 — Birth
</h3>

<p className="text-white/70 mt-2">
Born in Bhagalpur, Bihar, in a modest environment where observation and curiosity shaped his early years.
</p>

</div>


<div>

<span className="absolute -left-[9px] w-4 h-4 bg-white rounded-full"></span>

<h3 className="text-xl font-semibold">
Early Life
</h3>

<p className="text-white/70 mt-2">
During his childhood he showed a tendency to question commonly accepted ideas and reflect deeply on everyday experiences.
</p>

</div>


<div>

<span className="absolute -left-[9px] w-4 h-4 bg-white rounded-full"></span>

<h3 className="text-xl font-semibold">
Inner Inquiry
</h3>

<p className="text-white/70 mt-2">
Through observation, silence and reflection he developed a deeper understanding of the mind and human behavior.
</p>

</div>


<div>

<span className="absolute -left-[9px] w-4 h-4 bg-white rounded-full"></span>

<h3 className="text-xl font-semibold">
Public Dialogues
</h3>

<p className="text-white/70 mt-2">
His talks began reaching a wider audience including students and professionals seeking clarity in life.
</p>

</div>


<div>

<span className="absolute -left-[9px] w-4 h-4 bg-white rounded-full"></span>

<h3 className="text-xl font-semibold">
Present
</h3>

<p className="text-white/70 mt-2">
Guruji continues sharing insights through dialogues, writings and discussions focused on self-understanding.
</p>

</div>

</div>

</section>


{/* FINAL IMAGE */}

<section className="py-28 text-center border-t border-white/10">

<div className="flex justify-center mb-12">

<Image
src="/images/hero2.jpg"
alt="Guruji portrait"
width={420}
height={520}
className="rounded-2xl shadow-2xl"
/>

</div>

<p className="text-white/70 max-w-xl mx-auto">
"Understanding oneself is the beginning of clarity."
</p>

</section>

</main>

)

}