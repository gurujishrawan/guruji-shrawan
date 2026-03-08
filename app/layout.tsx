import "./globals.css";
import { Poppins } from "next/font/google";
import { LanguageProvider } from "./context/LanguageContext";
import type { ReactNode } from "react";
import type { Metadata } from "next";

import ClientLayout from "./layoutclient";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Guruji Shrawan Official Website",
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
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Guruji Shrawan",
              url: "https://guruji-shrawan.vercel.app",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Guruji Shrawan",
              jobTitle: "Contemporary Spiritual Teacher",
            }),
          }}
        />
      </head>
      <body className={`${poppins.className} bg-[#f7f5f2] text-[#1c1c1c]`}>
        <LanguageProvider>
          <ClientLayout>{children}</ClientLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}
