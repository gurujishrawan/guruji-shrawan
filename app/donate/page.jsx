"use client";

import { useMemo, useState } from "react";

export default function DonatePage() {
  const [amount, setAmount] = useState("");
  const progress = useMemo(() => 0, []);

  return (
    <section className="bg-[var(--surface)] text-[var(--foreground)]">
      <div className="mx-auto grid w-[min(1200px,92%)] gap-10 py-10 md:py-16 lg:grid-cols-2 lg:gap-14">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#ff6a00]">Support the work</p>
          <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
            For General Expenses and Expansion of the Work
          </h1>

          <div className="mt-7 rounded-2xl border border-black/10 bg-white p-5 md:p-6">
            <p className="text-sm text-[var(--foreground)]/70">Contributed</p>
            <p className="mt-1 text-2xl font-semibold">₹ 0</p>
            <div className="mt-3 h-2 rounded bg-black/10">
              <div className="h-full rounded bg-[#ff6a00]" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-xs text-[var(--foreground)]/60">Target ₹ 50,00,000 • {progress}% achieved</p>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-[var(--foreground)]/70 md:text-base">
            This work exists to question blind belief, psychological slavery, and unconscious
            living. It grows only through conscious participation, not emotional charity.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-[var(--foreground)]/70 md:text-base">
            The expansion of dialogue, infrastructure, and accessibility requires steady
            and responsible financial support.
          </p>
        </div>

        <div className="rounded-2xl border border-black/10 bg-[var(--surface-muted)] p-5 shadow-lg md:p-8">
          <p className="mb-4 text-sm font-semibold">Choose Amount</p>
          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[5000, 10000, 50000].map(v => (
              <button
                key={v}
                type="button"
                onClick={() => setAmount(String(v))}
                className={`rounded-lg border px-3 py-2 text-sm transition ${
                  amount === String(v)
                    ? "border-[#ff6a00] bg-[#ff6a00] text-white"
                    : "border-black/20 bg-white hover:border-[#ff6a00]"
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
            onChange={e => setAmount(e.target.value)}
            className="mb-4 w-full rounded-lg border border-black/20 bg-white px-4 py-3"
          />

          <div className="space-y-3">
            <input className="w-full rounded-lg border border-black/20 px-4 py-3" placeholder="Full Name" />
            <input className="w-full rounded-lg border border-black/20 px-4 py-3" placeholder="Mobile Number" />
            <input className="w-full rounded-lg border border-black/20 px-4 py-3" placeholder="Email" />
            <input className="w-full rounded-lg border border-black/20 px-4 py-3" placeholder="Address" />
          </div>

          <div className="mt-4 rounded-lg border border-black/20 bg-white p-4">
            <p className="text-sm font-medium">Donate via UPI</p>
            <p className="text-sm text-[var(--foreground)]/65">9999793389@ybi</p>
          </div>

          <button className="mt-5 w-full rounded-full bg-[#ff6a00] py-3 text-sm font-semibold text-white">
            Proceed to Payment
          </button>

          <p className="mt-3 text-xs text-[var(--foreground)]/60">
            Contributions are voluntary. No spiritual or material promises are made.
          </p>
        </div>
      </div>
    </section>
  );
}
