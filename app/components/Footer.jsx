"use client";

import {
  FaYoutube,
  FaInstagram,
  FaFacebook,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0f0f0f] text-gray-300">
      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* BRAND */}
        <div>
          <h3 className="text-white font-extrabold tracking-wide mb-4">
            GURUJI SHRAWAN
          </h3>
          <p className="text-sm leading-relaxed text-gray-400">
            A platform dedicated to clarity, self-inquiry, and honest
            understanding — beyond belief, beyond ritual.
          </p>
        </div>

        {/* CONTENT */}
        <div>
          <h4 className="text-white font-semibold mb-4">
            Content
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/articles" className="hover:text-white">
                Articles
              </a>
            </li>
            <li>
              <a href="/biography" className="hover:text-white">
                Biography
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-white">
                Video Conversations
              </a>
            </li>
          </ul>
        </div>

        {/* CONNECT */}
        <div>
          <h4 className="text-white font-semibold mb-4">
            Connect
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <FaEnvelope />
              <span>contact@gurujishrawan.com</span>
            </li>

            <li className="flex gap-4 text-lg mt-4">
              <a
                href="https://youtube.com/@gurujishrawan"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <FaYoutube />
              </a>
              <a
                href="https://instagram.com/gurujishrawan"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <FaInstagram />
              </a>
              <a
                href="https://facebook.com/gurujishrawan"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <FaFacebook />
              </a>
            </li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h4 className="text-white font-semibold mb-4">
            Support
          </h4>
          <p className="text-sm text-gray-400 mb-4">
            This work is sustained by voluntary participation from seekers
            who value clarity and honest inquiry.
          </p>

          <a
            href="/donate"
            className="inline-block bg-[#e4572e] text-white px-5 py-2 text-sm font-medium"
          >
            Support the Work
          </a>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10 py-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Guruji Shrawan · Clarity · Awareness · Freedom
      </div>
    </footer>
  );
}
