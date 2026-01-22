import "./globals.css";
import { Poppins } from "next/font/google";
import { LanguageProvider } from "./context/LanguageContext";
import type { ReactNode } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import ClientLayout from "./layoutclient";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Guruji Shrawan",
  description: "Official website of Guruji Shrawan",
  verification: {
    google: "PV_yw-25yz-0yldphda62paYM3zKguklzyORuD4jHtM",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Website Schema */}
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

        {/* Person Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Guruji Shrawan",
              jobTitle: "Spiritual Teacher & Author",
              sameAs: [
                "https://youtube.com/@gurujishrawan",
                "https://instagram.com/gurujishrawan",
                "https://facebook.com/gurujishrawan",
              ],
            }),
          }}
        />
      </head>

      <body className={`${poppins.className} bg-[#f7f5f2] text-[#1c1c1c]`}>
        <LanguageProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}
