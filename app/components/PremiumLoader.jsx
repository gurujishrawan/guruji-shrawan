"use client"

import {
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  MessageCircle
} from "lucide-react"

export default function PremiumLoader() {

  return (
    <div className="loaderRoot">

      <div className="orbit">

        <div className="centerGlow"></div>

        <div className="orbitItem item1">
          <Instagram size={22}/>
        </div>

        <div className="orbitItem item2">
          <Youtube size={22}/>
        </div>

        <div className="orbitItem item3">
          <Twitter size={22}/>
        </div>

        <div className="orbitItem item4">
          <MessageCircle size={22}/>
        </div>

        <div className="orbitItem item5">
          <Facebook size={22}/>
        </div>

      </div>

      <p className="loaderText">
        Loading...
      </p>

    </div>
  )
}