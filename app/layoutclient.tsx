"use client";

import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { SessionProvider } from "./session-provider";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavbar = pathname === "/" || pathname === "/biography";
  const hideFooter = pathname === "/biography";

  return (
    <SessionProvider>
      {!hideNavbar && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!hideFooter && <Footer />}
    </SessionProvider>
  );
}
