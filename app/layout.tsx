import "./globals.css"
import { Poppins } from "next/font/google"
import { LanguageProvider } from "./context/LanguageContext"
import type { ReactNode } from "react"
import type { Metadata } from "next"
import Script from "next/script"

import ClientLayout from "./layoutclient"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Guruji Shrawan",
  description:
    "Explore the teachings, articles, books, and videos of Guruji Shrawan on spirituality, self-inquiry, relationships, and conscious living.",
  keywords: [
    "spiritual teacher",
    "self inquiry",
    "vedanta teachings",
    "life clarity",
    "inner awakening",
  ],
  verification: {
    google: "PV_yw-25yz-0yldphda62paYM3zKguklzyORuD4jHtM",
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense verification */}
        <meta
          name="google-adsense-account"
          content="ca-pub-2716405637818905"
        />

        {/* Website Schema */}
        <Script
          id="website-schema"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Guruji Shrawan",
            url: "https://guruji-shrawan.vercel.app",
          })}
        </Script>

        {/* Person Schema */}
        <Script
          id="person-schema"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Guruji Shrawan",
            jobTitle: "Contemporary Spiritual Teacher",
          })}
        </Script>
      </head>

      <body className={`${poppins.className} bg-[#f7f5f2] text-[#1c1c1c]`}>
        {/* AdSense Script */}
        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2716405637818905"
          crossOrigin="anonymous"
        />

        <LanguageProvider>
          <ClientLayout>{children}</ClientLayout>
        </LanguageProvider>
      </body>
    </html>
  )
}