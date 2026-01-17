"use client";

import { motion } from "framer-motion";

export default function BiographyPage() {
  return (
    <main className="bg-[#f7f5f2] text-[#1c1c1c]">
      {/* ================= HERO ================= */}
      <section className="max-w-5xl mx-auto px-6 pt-32 pb-24">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold leading-tight mb-8"
        >
          Guruji Shrawan
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-[#5f5f5f] max-w-3xl leading-relaxed"
        >
          Guruji Shrawan is a contemporary voice focused on clarity,
          self-inquiry, and honest observation of life — beyond belief,
          ritual, or borrowed ideas.
        </motion.p>
      </section>

      {/* ================= WHO ================= */}
      <section className="bg-white py-24 border-t border-black/10">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">
            Who is Guruji Shrawan
          </h2>

          <p className="text-[#5f5f5f] leading-relaxed text-lg mb-6">
            Guruji Shrawan engages with questions that most people avoid —
            fear, ambition, suffering, success, attachment, and identity.
            His work does not offer comfort through belief, but clarity
            through understanding.
          </p>

          <p className="text-[#5f5f5f] leading-relaxed text-lg">
            Rather than positioning himself as a preacher or a motivational
            speaker, he approaches dialogue as a shared inquiry — one that
            invites the listener to look directly at their own life.
          </p>
        </div>
      </section>

      {/* ================= JOURNEY ================= */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">
            The Journey
          </h2>

          <p className="text-[#5f5f5f] leading-relaxed text-lg mb-6">
            The journey behind this work is not about personal achievement
            or spiritual identity. It is rooted in careful observation,
            questioning inherited ideas, and seeing how conditioning shapes
            everyday choices.
          </p>

          <p className="text-[#5f5f5f] leading-relaxed text-lg">
            Over time, this inquiry found expression through digital
            platforms — short videos, written reflections, and open
            conversations — making these ideas accessible to a wider
            audience.
          </p>
        </div>
      </section>

      {/* ================= PHILOSOPHY ================= */}
      <section className="bg-white py-24 border-t border-black/10">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">
            Approach & Philosophy
          </h2>

          <ul className="space-y-6 text-lg text-[#5f5f5f]">
            <li>
              • Clarity is valued over comfort.
            </li>
            <li>
              • Questions matter more than conclusions.
            </li>
            <li>
              • Awareness begins with seeing facts as they are.
            </li>
            <li>
              • Truth is not personal, cultural, or negotiable.
            </li>
          </ul>
        </div>
      </section>

      {/* ================= DIGITAL PRESENCE ================= */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">
            Digital Presence
          </h2>

          <p className="text-[#5f5f5f] leading-relaxed text-lg mb-6">
            Through platforms such as YouTube, Instagram, and Facebook,
            Guruji Shrawan shares concise reflections and longer discussions
            aimed at provoking thoughtful self-examination rather than
            passive consumption.
          </p>

          <p className="text-[#5f5f5f] leading-relaxed text-lg">
            The emphasis remains on quality of inquiry, not scale or
            popularity — encouraging individuals to think independently
            and live consciously.
          </p>
        </div>
      </section>

      {/* ================= CLOSING ================= */}
      <section className="bg-[#111] text-white py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">
            A Closing Note
          </h2>

          <p className="text-gray-300 leading-relaxed text-lg">
            This work is not an invitation to follow a person, ideology, or
            belief system. It is an invitation to look honestly at oneself
            and one’s life — without fear, without escape.
          </p>
        </div>
      </section>
    </main>
  );
}
