"use client";

import { useState } from "react";

export default function DonatePage() {
  const [amount, setAmount] = useState("");

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="grid lg:grid-cols-2 gap-16 items-start">

        {/* LEFT CONTENT */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-6">
            For General Expenses and Expansion of the Work
          </h1>

          <div className="mb-6">
            <p className="text-sm mb-1">Contributed</p>
            <p className="font-semibold">₹ 0</p>

            <div className="h-2 bg-black/10 rounded mt-2">
              <div className="h-full w-[0%] bg-[#e4572e] rounded"></div>
            </div>

            <p className="text-xs mt-2 text-[#5f5f5f]">
              Target ₹ 50,00,000 • 0% achieved
            </p>
          </div>

          <p className="text-[#5f5f5f] leading-relaxed mb-6">
            This work exists to question blind belief, psychological slavery,
            and unconscious living. It grows only through conscious participation,
            not emotional charity.
          </p>

          <p className="text-[#5f5f5f]">
            The expansion of dialogue, infrastructure, and accessibility
            requires steady and responsible financial support.
          </p>
        </div>

        {/* RIGHT FORM */}
        <div className="bg-white border border-black/10 rounded-2xl shadow-lg p-8">

          {/* Amount Buttons */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[5000, 10000, 50000].map((v) => (
              <button
                key={v}
                onClick={() => setAmount(v)}
                className={`border px-3 py-2 text-sm ${
                  amount === v
                    ? "bg-black text-white"
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
            className="w-full border border-black/30 px-4 py-3 mb-4"
          />

          {/* Donor Details */}
          <input className="w-full border px-4 py-3 mb-3" placeholder="Full Name" />
          <input className="w-full border px-4 py-3 mb-3" placeholder="Mobile Number" />
          <input className="w-full border px-4 py-3 mb-3" placeholder="Email" />
          <input className="w-full border px-4 py-3 mb-4" placeholder="Address" />

          {/* UPI */}
          <div className="border rounded p-4 mb-4">
            <p className="text-sm font-medium">Donate via UPI</p>
            <p className="text-sm text-[#5f5f5f]">9999793389@ybi</p>
          </div>

          {/* CTA */}
          <button
            disabled
            className="w-full bg-[#e4572e] text-white py-3 text-sm cursor-not-allowed"
          >
            Proceed to Payment (Gateway Coming Soon)
          </button>

          <p className="text-xs text-[#5f5f5f] mt-4">
            Contributions are voluntary. No spiritual or material promises are made.
          </p>
        </div>
      </div>
    </section>
  );
}
