"use client";

import { motion } from "framer-motion";

const sectionClass = "mx-auto w-[min(980px,92%)] py-14 md:py-20";

export default function BiographyPage() {
  return (
    <main className="bg-[#f7f5f2] text-[#1c1c1c]">
      <section className={`${sectionClass} pt-24 md:pt-28`}>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold leading-tight md:text-6xl"
        >
          Guruji Shrawan
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 max-w-3xl text-base leading-relaxed text-black/65 md:text-xl"
        >
          Guruji Shrawan is a contemporary voice focused on clarity, self-inquiry,
          and honest observation of life — beyond belief, ritual, or borrowed ideas.
        </motion.p>
      </section>

      <section className="border-y border-black/10 bg-white">
        <div className={sectionClass}>
          <h2 className="text-2xl font-semibold md:text-4xl">Who is Guruji Shrawan</h2>
          <p className="mt-6 text-base leading-relaxed text-black/65 md:text-lg">
            Guruji Shrawan engages with questions that most people avoid — fear, ambition,
            suffering, success, attachment, and identity. His work does not offer comfort
            through belief, but clarity through understanding.
          </p>
          <p className="mt-5 text-base leading-relaxed text-black/65 md:text-lg">
            Rather than positioning himself as a preacher or motivational speaker, he
            approaches dialogue as shared inquiry — inviting listeners to look directly
            at their own life.
          </p>
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className="text-2xl font-semibold md:text-4xl">The Journey</h2>
        <p className="mt-6 text-base leading-relaxed text-black/65 md:text-lg">
          The journey behind this work is not about personal achievement or spiritual identity.
          It is rooted in careful observation, questioning inherited ideas, and seeing how
          conditioning shapes everyday choices.
        </p>
        <p className="mt-5 text-base leading-relaxed text-black/65 md:text-lg">
          Over time, this inquiry found expression through digital platforms — short videos,
          written reflections, and open conversations.
        </p>
      </section>

      <section className="border-y border-black/10 bg-white">
        <div className={sectionClass}>
          <h2 className="text-2xl font-semibold md:text-4xl">Approach & Philosophy</h2>
          <ul className="mt-6 space-y-4 text-base text-black/65 md:text-lg">
            <li>• Clarity is valued over comfort.</li>
            <li>• Questions matter more than conclusions.</li>
            <li>• Awareness begins with seeing facts as they are.</li>
            <li>• Truth is not personal, cultural, or negotiable.</li>
          </ul>
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className="text-2xl font-semibold md:text-4xl">Digital Presence</h2>
        <p className="mt-6 text-base leading-relaxed text-black/65 md:text-lg">
          Through platforms like YouTube, Instagram, and Facebook, Guruji Shrawan shares
          concise reflections and longer dialogues aimed at provoking self-examination.
        </p>
        <p className="mt-5 text-base leading-relaxed text-black/65 md:text-lg">
          The emphasis remains on quality of inquiry, not popularity.
        </p>
      </section>

      <section className="bg-[#111] py-14 text-white md:py-20">
        <div className="mx-auto w-[min(980px,92%)]">
          <h2 className="text-2xl font-semibold md:text-4xl">A Closing Note</h2>
          <p className="mt-5 text-base leading-relaxed text-white/80 md:text-lg">
            This work is not an invitation to follow a person, ideology, or belief system.
            It is an invitation to look honestly at oneself and one’s life — without fear,
            without escape.
          </p>
        </div>
      </section>
    </main>
  );
}
