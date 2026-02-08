"use client";

import { useState } from "react";

export default function DonatePage() {
  const [amount, setAmount] = useState("");

  return (
    <section className="bg-[var(--surface)] text-[var(--foreground)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-16 items-start">

        {/* LEFT CONTENT */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-[#8ab4f8]">
            For General Expenses and Expansion of the Work
          </h1>

          <div className="mb-6">
            <p className="text-sm mb-1 text-[var(--foreground)]/70">Contributed</p>
            <p className="font-semibold">₹ 0</p>

            <div className="h-2 bg-black/10 rounded mt-2">
              <div className="h-full w-[0%] bg-[var(--accent)] rounded"></div>
            </div>

            <p className="text-xs mt-2 text-[var(--foreground)]/60">
              Target ₹ 50,00,000 • 0% achieved
            </p>
          </div>

          <p className="text-[var(--foreground)]/70 leading-relaxed mb-6">
            This work exists to question blind belief, psychological slavery,
            and unconscious living. It grows only through conscious participation,
            not emotional charity.
          </p>

          <p className="text-[var(--foreground)]/70">
            The expansion of dialogue, infrastructure, and accessibility
            requires steady and responsible financial support.
          </p>
        </div>

        {/* RIGHT FORM */}
        <div className="bg-[var(--surface-muted)] border border-black/10 rounded-2xl shadow-lg p-8">

          {/* Amount Buttons */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[5000, 10000, 50000].map((v) => (
              <button
                key={v}
                onClick={() => setAmount(v)}
                className={`border px-3 py-2 text-sm ${
                  amount === v
                    ? "bg-[var(--brand)] text-white"
                    : "border-black/30"
                }`}
              >
                ₹ {v.toLocaleString()}
              </button>
            ))}
          </div>

          <input
            type="number"
            placeholder="Other Amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-black/30 px-4 py-3 mb-4 bg-white"
          />

          {/* Donor Details */}
          <input className="w-full border px-4 py-3 mb-3 bg-white" placeholder="Full Name" />
          <input className="w-full border px-4 py-3 mb-3 bg-white" placeholder="Mobile Number" />
          <input className="w-full border px-4 py-3 mb-3 bg-white" placeholder="Email" />
          <input className="w-full border px-4 py-3 mb-4 bg-white" placeholder="Address" />

          {/* UPI */}
          <div className="border rounded p-4 mb-4">
            <p className="text-sm font-medium">Donate via UPI</p>
            <p className="text-sm text-[var(--foreground)]/60">9999793389@ybi</p>
          </div>

          {/* CTA */}
          <button
            disabled
            className="w-full bg-[var(--accent)] text-[#1b1b1f] py-3 text-sm cursor-not-allowed"
          >
            Proceed to Payment (Gateway Coming Soon)
          </button>

          <p className="text-xs text-[var(--foreground)]/60 mt-4">
            Contributions are voluntary. No spiritual or material promises are made.
          </p>
        </div>
      </div>
    </section>
  );
}
