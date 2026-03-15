"use client"

import { usePathname } from "next/navigation"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import { SessionProvider } from "./session-provider"

/*
 * Pages where Navbar is hidden (they render their own full-bleed hero).
 * Add any future routes here.
 */
const HIDE_NAVBAR: string[] = ["/", "/biography"]

/*
 * Pages where Footer is hidden.
 */
const HIDE_FOOTER: string[] = ["/biography", "/video-series"]

/*
 * Pages that should NOT show AdSense auto-ads
 * (e.g. donation page — avoid distracting users mid-payment).
 */
const NO_ADS: string[] = ["/donate", "/signin", "/signup", "/auth/callback"]

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const hideNavbar = HIDE_NAVBAR.includes(pathname)
  const hideFooter = HIDE_FOOTER.includes(pathname)
  const noAds      = NO_ADS.some(p => pathname.startsWith(p))

  return (
    <SessionProvider>
      {/*
        data-no-ads attribute lets you target with CSS
        and signals to AdSense auto-ads via the noad param
        if you later configure page-level settings.
      */}
      <div
        id="page-wrapper"
        data-no-ads={noAds ? "true" : undefined}
        className="flex min-h-screen flex-col"
      >
        {!hideNavbar && <Navbar />}

        {/*
          children already wrapped in <main id="main-content"> by layout.tsx.
          We keep this div purely for flex layout so footer always sticks to bottom.
        */}
        <div className="flex-1">
          {children}
        </div>

        {!hideFooter && <Footer />}
      </div>
    </SessionProvider>
  )
}