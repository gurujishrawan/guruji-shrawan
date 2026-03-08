"use client";

import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      {!isHome && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!isHome && <Footer />}
    </>
  );
}
