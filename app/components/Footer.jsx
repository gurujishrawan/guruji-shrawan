"use client"

import Link from "next/link"
import Image from "next/image"
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

/* DESIGN TOKENS */
const ORANGE = "#c8551a"
const GOLD   = "#b8841a"
const TEXT   = "#1a1008"
const MUTED  = "#8a7a6a"
const BORDER = "#e8ddd0"
const BG     = "#faf7f2"
const SANS   = "'Poppins', system-ui, sans-serif"

/* SOCIAL */
const SOCIAL = [
  { name:"YouTube", icon:<FaYoutube size={18}/>, href:"https://youtube.com/@gurujishrawan"},
  { name:"Instagram", icon:<FaInstagram size={18}/>, href:"https://instagram.com/gurujishrawan"},
  { name:"Facebook", icon:<FaFacebook size={18}/>, href:"https://facebook.com/gurujishrawan"},
  { name:"X", icon:<FaXTwitter size={17}/>, href:"https://x.com/gurujishrawan"},
]

/* LINKS */
const LINKS = {
  Teachings:[
    {label:"Articles",href:"/articles"},
    {label:"Books",href:"/books"},
    {label:"Video Series",href:"/video-series"},
    {label:"YouTube",href:"https://www.youtube.com/@gurujishrawan"},
  ],
  About:[
    {label:"Biography",href:"/biography"},
    {label:"Media",href:"/media"},
    {label:"Email",href:"mailto:gurujishrawan@gmail.com"},
    {label:"Privacy Policy",href:"/privacy"},
    {label:"Terms of Services",href:"/terms"},
  ],
}

export default function Footer(){

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

        .ft{
          background:#fff;
          font-family:${SANS};
          border-top:1px solid ${BORDER};
          color:${TEXT};
        }

        .ft-main{
          max-width:1180px;
          margin:0 auto;
          padding:50px 20px 40px;
          display:grid;
          grid-template-columns:1.6fr 1fr 1fr 1fr;
          gap:40px;
        }

        .ft-brand-logo img{
          height:36px;
          width:auto;
          object-fit:contain;
          margin-bottom:14px;
        }

        .ft-brand-desc{
          font-size:13px;
          line-height:1.7;
          color:${MUTED};
          max-width:260px;
          margin-bottom:20px;
        }

        .ft-social{
          display:flex;
          gap:8px;
        }

        .ft-social-a{
          width:36px;
          height:36px;
          border-radius:9px;
          border:1px solid ${BORDER};
          display:flex;
          align-items:center;
          justify-content:center;
          text-decoration:none;
          color:${MUTED};
          transition:.18s;
        }

        .ft-social-a:hover{
          background:#fff8f3;
          color:${ORANGE};
        }

        .ft-col-h{
          font-size:11px;
          font-weight:700;
          letter-spacing:.14em;
          text-transform:uppercase;
          color:${GOLD};
          margin-bottom:16px;
        }

        .ft-col ul{
          list-style:none;
          padding:0;
          margin:0;
          display:flex;
          flex-direction:column;
          gap:6px;
        }

        .ft-col-a{
          font-size:13px;
          text-decoration:none;
          color:${MUTED};
          transition:.15s;
        }

        .ft-col-a:hover{
          color:${ORANGE};
        }

        .ft-bot{
          border-top:1px solid ${BORDER};
          padding:18px 20px;
        }

        .ft-bot-in{
          max-width:1180px;
          margin:0 auto;
          display:flex;
          justify-content:space-between;
          flex-wrap:wrap;
          gap:10px;
        }

        .ft-bot-copy{
          font-size:12px;
          color:${MUTED};
        }

        .ft-bot-links{
          display:flex;
          gap:18px;
        }

        .ft-bot-lnk{
          font-size:12px;
          text-decoration:none;
          color:${MUTED};
        }

        .ft-bot-lnk:hover{
          color:${ORANGE};
        }

        @media(max-width:900px){
          .ft-main{
            grid-template-columns:1fr 1fr;
          }
        }

        @media(max-width:560px){
          .ft-main{
            grid-template-columns:1fr;
          }
        }

      `}</style>

      <footer className="ft">

        {/* Main */}
        <div className="ft-main">

          {/* Brand */}
          <div>
            <div className="ft-brand-logo">
              <Link href="/">
                <Image
                  src="/images/logo.png"
                  alt="Guruji Shrawan"
                  width={160}
                  height={48}
                  priority
                  style={{
                    height:36,
                    width:"auto",
                    objectFit:"contain",
                    filter:"invert(1) brightness(0.15)"
                  }}
                />
              </Link>
            </div>

            <p className="ft-brand-desc">
              A platform for deep inquiry, rational spirituality, and conscious living.
              Every word offered as a lamp for the seeker.
            </p>

            <div className="ft-social">
              {SOCIAL.map(s=>(
                <a key={s.name} className="ft-social-a" href={s.href} target="_blank" rel="noreferrer">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Columns */}
          {Object.entries(LINKS).map(([heading,links])=>(
            <div className="ft-col" key={heading}>
              <p className="ft-col-h">{heading}</p>

              <ul>
                {links.map(({label,href,ext})=>(
                  <li key={label}>
                    {ext ? (
                      <a href={href} target="_blank" rel="noreferrer" className="ft-col-a">{label}</a>
                    ) : href.startsWith("mailto:")||href.startsWith("tel:") ? (
                      <a href={href} className="ft-col-a">{label}</a>
                    ) : (
                      <Link href={href} className="ft-col-a">{label}</Link>
                    )}
                  </li>
                ))}
              </ul>

            </div>
          ))}

        </div>

        {/* Bottom */}
        <div className="ft-bot">
          <div className="ft-bot-in">

            <p className="ft-bot-copy">
              © {new Date().getFullYear()} Guruji Shrawan Foundation
            </p>

            <div className="ft-bot-links">
              <Link href="/privacy" className="ft-bot-lnk">Privacy Policy</Link>
              <Link href="/terms" className="ft-bot-lnk">Terms</Link>
              <Link href="/contactus" className="ft-bot-lnk">Contact</Link>
               <Link href="/about-us" className="ft-bot-lnk">About Us</Link>
            </div>

          </div>
        </div>

      </footer>
    </>
  )
}