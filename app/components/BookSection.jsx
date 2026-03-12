"use client"

import Image from "next/image"
import Link from "next/link"

export default function BookSection(){

return(

<section className="book-section">

<style jsx>{`

.book-section{
padding:110px 0;
background:linear-gradient(135deg,#fff8f2,#faf7f2);
}

.book-inner{
max-width:1160px;
margin:auto;
padding:0 28px;
display:grid;
grid-template-columns:1fr 1fr;
gap:90px;
align-items:center;
}

/* BOOK AREA */

.book-area{
display:flex;
justify-content:center;
perspective:2200px;
}

/* BOOK */

.book{
position:relative;
width:340px;
height:500px;
transform-style:preserve-3d;
transition:transform .8s cubic-bezier(.19,1,.22,1);
}

/* HOVER MOTION */

.book-area:hover .book{
transform:rotateY(-28deg) rotateX(5deg);
}

/* PAGE BLOCK */

.book-pages{
position:absolute;
top:8px;
left:10px;
width:100%;
height:100%;
background:linear-gradient(
to right,
#fafafa 0%,
#ffffff 30%,
#f1f1f1 100%
);
border-radius:3px;

box-shadow:
inset -12px 0 18px rgba(0,0,0,.08),
0 20px 50px rgba(0,0,0,.25);
}

/* PAPER TEXTURE */

.book-pages:before{
content:"";
position:absolute;
top:0;
left:0;
width:100%;
height:100%;
background:
repeating-linear-gradient(
to bottom,
rgba(0,0,0,.04),
rgba(0,0,0,.04) 1px,
transparent 1px,
transparent 4px
);
opacity:.4;
}

/* PAGE EDGE DEPTH */

.book-pages:after{
content:"";
position:absolute;
right:-6px;
top:0;
width:6px;
height:100%;
background:linear-gradient(
to right,
#eaeaea,
#ffffff
);
}

/* SPINE */

.book-spine{
position:absolute;
left:-26px;
top:0;
width:30px;
height:100%;
background:linear-gradient(
to right,
#6e2507,
#c8551a,
#6e2507
);

transform:rotateY(90deg);
transform-origin:left;

box-shadow:
inset -3px 0 8px rgba(0,0,0,.4);
}

/* COVER */

.book-cover{
position:absolute;
top:0;
left:0;
transform-origin:left;
transition:transform .8s cubic-bezier(.19,1,.22,1);

box-shadow:
0 60px 80px rgba(0,0,0,.35),
0 20px 30px rgba(0,0,0,.25);

border-radius:3px;
overflow:hidden;
}

/* COVER OPEN */

.book-area:hover .book-cover{
transform:rotateY(-35deg);
}

/* COVER LIGHT REFLECTION */

.book-cover:after{
content:"";
position:absolute;
top:0;
left:-60%;
width:120%;
height:100%;

background:linear-gradient(
120deg,
transparent 40%,
rgba(255,255,255,.4),
transparent 60%
);

transform:skewX(-20deg);
opacity:.6;
}

/* FLOOR SHADOW */

.book:after{
content:"";
position:absolute;
bottom:-50px;
left:50%;
transform:translateX(-50%);

width:260px;
height:40px;

background:radial-gradient(
ellipse at center,
rgba(0,0,0,.35),
transparent
);

filter:blur(10px);
}

/* CONTENT */

.book-eyebrow{
font-family:Poppins;
font-size:12px;
letter-spacing:.22em;
text-transform:uppercase;
color:#c8551a;
margin-bottom:16px;
font-weight:700;
}

.book-title{
font-family:Lora,serif;
font-size:44px;
font-weight:700;
color:#1a1008;
margin-bottom:18px;
}

.book-desc{
font-family:Poppins;
font-size:15px;
line-height:1.8;
color:#8a7a6a;
max-width:460px;
margin-bottom:30px;
}

.book-btn{
display:inline-flex;
align-items:center;
gap:8px;
padding:14px 28px;
border-radius:999px;

background:linear-gradient(135deg,#c8551a,#8a2e06);

color:white;
font-family:Poppins;
font-size:13px;
font-weight:700;
text-decoration:none;

box-shadow:0 12px 30px rgba(200,85,26,.35);

transition:.25s;
}

.book-btn:hover{
transform:translateY(-3px);
box-shadow:0 18px 40px rgba(200,85,26,.45);
}

@media(max-width:900px){

.book-inner{
grid-template-columns:1fr;
text-align:center;
gap:60px;
}

.book-desc{
margin:auto;
}

}

`}</style>

<div className="book-inner">

{/* BOOK */}

<div className="book-area">

<div className="book">

<div className="book-pages"/>

<div className="book-spine"/>

<div className="book-cover">

<Image
src="/images/book-cover.png"
alt="Baccho Ki Parvarish"
width={340}
height={500}
/>

</div>

</div>

</div>

{/* CONTENT */}

<div>

<p className="book-eyebrow">
New Release
</p>

<h2 className="book-title">
Baccho Ki Parvarish
</h2>

<p className="book-desc">
A thoughtful guide for parents to nurture children with awareness,
clarity and compassion in the modern world. The book explores
practical wisdom rooted in Vedanta and psychological understanding.
</p>

<Link
href="/books/baccho-ki-parvarish"
className="book-btn"
>
Explore the Book →
</Link>

</div>

</div>

</section>

)

}