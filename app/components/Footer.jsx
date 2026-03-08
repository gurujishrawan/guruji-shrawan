"use client";

import Link from "next/link";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const social = [
  { name: "YouTube", icon: <FaYoutube />, href: "https://youtube.com/@gurujishrawan" },
  { name: "Instagram", icon: <FaInstagram />, href: "https://instagram.com/gurujishrawan" },
  { name: "Facebook", icon: <FaFacebook />, href: "https://facebook.com/gurujishrawan" },
  { name: "X", icon: <FaXTwitter />, href: "https://x.com/gurujishrawan" },
];

export default function Footer() {
  return (
    <footer className="bg-[#101010] text-white">
      <div className="mx-auto grid w-[min(1200px,92%)] gap-10 py-12 md:grid-cols-4">
        <div>
          <h3 className="text-lg font-semibold">Guruji Shrawan</h3>
          <p className="mt-3 text-sm text-white/70">
            A platform for deep inquiry, rational spirituality, and conscious living.
          </p>
          <div className="mt-4 flex gap-3 text-lg text-[#ff6a00]">
            {social.map(item => (
              <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.name}>
                {item.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold">Teachings</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li><Link href="/articles">Articles</Link></li>
            <li><Link href="/">Books</Link></li>
            <li><Link href="/">Video Series</Link></li>
            <li><Link href="/">Live Sessions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">About</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li><Link href="/biography">About Guruji Shrawan</Link></li>
            <li><Link href="/">Media</Link></li>
            <li><a href="mailto:contact@gurujishrawan.org">Contact</a></li>
            <li><Link href="/">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">Download App</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li><a href="https://play.google.com" target="_blank" rel="noopener noreferrer">Google Play</a></li>
            <li><a href="https://www.apple.com/app-store" target="_blank" rel="noopener noreferrer">App Store</a></li>
            <li><a href="mailto:contact@gurujishrawan.org">contact@gurujishrawan.org</a></li>
            <li><a href="tel:+919000000000">+91 90000 00000</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
