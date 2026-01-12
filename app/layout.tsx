import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300","400","500","600","700","800"],
});

export const metadata = {
  
  title: "Guruji Shrawan",
  description: "Official website of Guruji Shrawan",
  verification: {
    google: "PV_yw-25yz-0yldphda62paYM3zKguklzyORuD4jHtM",
  },
};


export default function RootLayout({ children }) {
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
      </head>
      <body className={`${poppins.className} bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
