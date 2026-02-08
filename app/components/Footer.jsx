"use client";

import { useEffect, useState } from "react";
import {
  FaYoutube,
  FaInstagram,
  FaFacebook,
  FaEnvelope,
  FaTwitter,
} from "react-icons/fa";

export default function Footer() {
  const [socialStats, setSocialStats] = useState(null);
  const [email, setEmail] = useState("");
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    fetch("/api/social")
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          setSocialStats(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setSocialStats(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubscribe = async event => {
    event.preventDefault();
    setSubmitStatus("loading");
    setSubmitMessage("");

    if (!email) {
      setSubmitStatus("error");
      setSubmitMessage("Please enter your email address.");
      return;
    }

    setSubmitStatus("success");
    setSubmitMessage("Thanks for subscribing! We'll be in touch soon.");
    setEmail("");
  };

  const socialLinks = {
    youtube: socialStats?.links?.youtube || "https://youtube.com/@gurujishrawan",
    facebook: socialStats?.links?.facebook || "https://facebook.com/gurujishrawan",
    instagram: socialStats?.links?.instagram || "https://instagram.com/gurujishrawan",
    x: socialStats?.links?.x || "https://x.com/gurujishrawan",
  };

  const socialCounts = {
    youtube: socialStats?.counts?.youtube || "—",
    facebook: socialStats?.counts?.facebook || "—",
    instagram: socialStats?.counts?.instagram || "—",
    x: socialStats?.counts?.x || "—",
  };

  return (
    <footer className="bg-[#0f0f0f] text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-20 space-y-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr,1fr] items-start">
          <div>
            <h3 className="text-white font-extrabold tracking-wide mb-4">
              GURUJI SHRAWAN
            </h3>
            <p className="text-sm leading-relaxed text-gray-400 max-w-md">
              A platform dedicated to clarity, self-inquiry, and honest
              understanding — beyond belief, beyond ritual.
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                Social media
              </p>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-white"
                  >
                    <FaYoutube className="text-red-500" />
                    <span>YouTube: {socialCounts.youtube} subscribers</span>
                  </a>
                </li>
                <li>
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-white"
                  >
                    <FaFacebook className="text-blue-500" />
                    <span>Facebook: {socialCounts.facebook} followers</span>
                  </a>
                </li>
                <li>
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-white"
                  >
                    <FaInstagram className="text-pink-500" />
                    <span>Instagram: {socialCounts.instagram} followers</span>
                  </a>
                </li>
                <li>
                  <a
                    href={socialLinks.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-white"
                  >
                    <FaTwitter className="text-white" />
                    <span>X: {socialCounts.x} followers</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
              Get updates
            </p>
            <h4 className="text-white text-lg font-semibold mt-3">
              Receive articles, quotes, and event updates.
            </h4>
            <form
              className="mt-6 flex flex-col gap-3"
              onSubmit={handleSubscribe}
            >
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={event => setEmail(event.target.value)}
                className="w-full rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm text-white placeholder:text-gray-400"
                required
              />
              <button
                type="submit"
                className="rounded-full bg-[#e4572e] text-white px-6 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-70"
                disabled={submitStatus === "loading"}
              >
                {submitStatus === "loading" ? "Submitting..." : "Subscribe"}
              </button>
            </form>
            {submitMessage && (
              <p
                className={`text-xs mt-3 ${
                  submitStatus === "success" ? "text-emerald-300" : "text-amber-200"
                }`}
              >
                {submitMessage}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-4">
              We respect your inbox. Updates are occasional and meaningful.
            </p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-4 text-sm text-gray-400">
          <div>
            <h4 className="text-white font-semibold mb-3">Content</h4>
            <ul className="space-y-2">
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

          <div>
            <h4 className="text-white font-semibold mb-3">Community</h4>
            <ul className="space-y-2">
              <li>
                <a href="/donate" className="hover:text-white">
                  Contribute
                </a>
              </li>
              <li>
                <a href="/articles" className="hover:text-white">
                  Featured Articles
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">More</h4>
            <ul className="space-y-2">
              <li>
                <a href="/biography" className="hover:text-white">
                  About Guruji
                </a>
              </li>
              <li>
                <a href="/donate" className="hover:text-white">
                  Support the Work
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <FaEnvelope />
                <span>contact@gurujishrawan.com</span>
              </li>
            </ul>
            <div className="flex gap-4 text-lg mt-4">
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
              <a
                href="https://x.com/gurujishrawan"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Guruji Shrawan · Clarity · Awareness · Freedom
      </div>
    </footer>
  );
}
