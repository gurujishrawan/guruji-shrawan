import "./globals.css"
import { Poppins, Lora } from "next/font/google"
import { LanguageProvider } from "./context/LanguageContext"
import type { ReactNode } from "react"
import type { Metadata } from "next"
import Script from "next/script"
import ClientLayout from "./layoutclient"
import AnnouncementBar from "../app/components/Announcementbar"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300","400","500","600","700","800"],
  variable: "--font-poppins",
  display: "swap",
})

const lora = Lora({
  subsets: ["latin"],
  weight: ["400","500","600","700"],
  style: ["normal","italic"],
  variable: "--font-lora",
  display: "swap",
})

const BASE_URL = "https://gurujishrawan.com"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "Guruji Shrawan — Spiritual Teacher, Author & Self-Inquiry",
    template: "%s | Guruji Shrawan",
  },
  description:
    "Explore the teachings, articles, books and videos of Guruji Shrawan — a contemporary spiritual teacher from Bhagalpur, Bihar sharing wisdom on self-inquiry, Vedanta, conscious living and inner clarity.",

  keywords: [
    "Guruji Shrawan","spiritual teacher India","self inquiry",
    "Vedanta teachings","conscious living","Bhagalpur spiritual teacher",
    "गुरुजी श्रावण","आत्म-परीक्षण","अध्यात्म","Baccho Ki Parvarish",
    "inner clarity","meditation India","satsang online",
  ],

  /* locale does NOT go at top-level — only inside openGraph */
  alternates: {
    canonical: BASE_URL,
    languages: { "en-IN": `${BASE_URL}/en`, "hi-IN": `${BASE_URL}/hi` },
  },

  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "Guruji Shrawan",
    title: "Guruji Shrawan — Spiritual Teacher & Author",
    description:
      "Contemporary spiritual teacher from India sharing Vedanta, self-inquiry and practical wisdom for conscious living.",
    images: [
      {
        url: `${BASE_URL}/images/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: "Guruji Shrawan — Spiritual Teacher",
      },
    ],
    locale: "en_IN",    // ← locale is ONLY valid inside openGraph, not top-level
  },

  twitter: {
    card: "summary_large_image",
    title: "Guruji Shrawan — Spiritual Teacher & Author",
    description: "Teachings on Vedanta, self-inquiry and conscious living.",
    images: [`${BASE_URL}/images/og-default.jpg`],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    google: "PV_yw-25yz-0yldphda62paYM3zKguklzyORuD4jHtM",
  },

  applicationName: "Guruji Shrawan",
  authors: [{ name: "Guruji Shrawan", url: BASE_URL }],
  creator: "Guruji Shrawan Foundation",
  publisher: "Guruji Shrawan Foundation",
  category: "Spirituality",

  appleWebApp: { capable: true, title: "Guruji Shrawan", statusBarStyle: "default" },
  formatDetection: { telephone: false },
}

/* ─── Structured Data ─── */
const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${BASE_URL}/#person`,
  name: "Guruji Shrawan",
  alternateName: ["गुरुजी श्रावण", "Shrawan Mishra"],
  description:
    "Contemporary spiritual teacher from Bhagalpur, Bihar sharing insights on Vedanta, self-inquiry, conscious living and inner clarity.",
  jobTitle: "Spiritual Teacher & Author",
  birthPlace: { "@type": "Place", name: "Bhagalpur, Bihar, India" },
  nationality: { "@type": "Country", name: "India" },
  url: BASE_URL,
  sameAs: [
    "https://youtube.com/@gurujishrawan",
    "https://instagram.com/gurujishrawan",
    "https://facebook.com/gurujishrawan",
  ],
  image: {
    "@type": "ImageObject",
    url: `${BASE_URL}/images/guruji.jpg`,
    width: 800,
    height: 1000,
  },
  knowsAbout: [
    "Vedanta","Self-Inquiry","Advaita Vedanta","Meditation","Bhagavad Gita",
    "Conscious Parenting","Spirituality","Buddhism",
  ],
  hasOccupation: {
    "@type": "Occupation",
    name: "Spiritual Teacher",
    occupationLocation: { "@type": "Country", name: "India" },
  },
  worksFor: {
    "@type": "Organization",
    name: "Guruji Shrawan Foundation",
    url: BASE_URL,
  },
  author: [{
    "@type": "Book",
    name: "Baccho Ki Parvarish",
    inLanguage: "hi",
    url: `${BASE_URL}/books/baccho-ki-parvarish`,
  }],
}

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  name: "Guruji Shrawan",
  url: BASE_URL,
  description: "Official website of Guruji Shrawan — spiritual teacher, author and educator from India.",
  publisher: { "@id": `${BASE_URL}/#person` },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${BASE_URL}/articles?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
  inLanguage: ["en-IN","hi-IN"],
}

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "Guruji Shrawan Foundation",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/images/logo.png`,
    width: 280,
    height: 80,
  },
  founder: { "@id": `${BASE_URL}/#person` },
  contactPoint: {
    "@type": "ContactPoint",
    email: "contact@gurujishrawan.com",
    contactType: "customer service",
    availableLanguage: ["English","Hindi"],
  },
  sameAs: [
    "https://youtube.com/@gurujishrawan",
    "https://instagram.com/gurujishrawan",
    "https://facebook.com/gurujishrawan",
  ],
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${poppins.variable} ${lora.variable}`}>
      <head>
        <meta name="google-adsense-account" content="ca-pub-2716405637818905" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
        <link rel="dns-prefetch" href="https://checkout.razorpay.com" />

        <Script id="schema-person" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(PERSON_SCHEMA)}
        </Script>
        <Script id="schema-website" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(WEBSITE_SCHEMA)}
        </Script>
        <Script id="schema-org" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(ORG_SCHEMA)}
        </Script>
      </head>

      <body className={`${poppins.className} bg-[#faf7f2] text-[#1a1008] antialiased`}>
        {/* Google AdSense — loads after page is interactive */}
        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2716405637818905"
          crossOrigin="anonymous"
        />

        {/* Skip-to-content — screen readers */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-white focus:text-[#c8551a] focus:px-4 focus:py-2 focus:rounded focus:font-bold focus:shadow-lg"
        >
          Skip to main content
        </a>

        <AnnouncementBar />

        <LanguageProvider>
          <ClientLayout>
            <main id="main-content" tabIndex={-1}>
              {children}
            </main>
          </ClientLayout>
        </LanguageProvider>
      </body>
    </html>
  )
}