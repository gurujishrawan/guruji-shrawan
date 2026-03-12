import "./globals.css"
import { Poppins } from "next/font/google"
import { LanguageProvider } from "./context/LanguageContext"
import type { ReactNode } from "react"
import type { Metadata } from "next"
import Script from "next/script"

import ClientLayout from "./layoutclient"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300","400","500","600","700","800"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Guruji Shrawan",
  description:
    "Explore the teachings, articles, books, and videos of Guruji Shrawan on spirituality, self-inquiry, relationships, and conscious living.",
  verification: {
    google: "PV_yw-25yz-0yldphda62paYM3zKguklzyORuD4jHtM",
  },
}

type RootLayoutProps = {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect for faster ads */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" />

        {/* Google Adsense Script */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2716405637818905"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </head>

      <body className={`${poppins.className} bg-[#f7f5f2] text-[#1c1c1c]`}>
        <LanguageProvider>
          <ClientLayout>{children}</ClientLayout>
        </LanguageProvider>
      </body>
    </html>
  )
}