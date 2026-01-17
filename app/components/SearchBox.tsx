"use client";

import { useState } from "react";
import Link from "next/link";

/* 🔍 Lightweight search index (client-safe) */
const searchIndex = [
  {
    slug: "what-is-clarity",
    title_en: "What Is Clarity?",
    title_hi: "स्पष्टता क्या है?",
  },
  // add more articles here later
];

export default function SearchBox() {
  const [q, setQ] = useState("");

  const results = searchIndex.filter(item =>
    item.title_en.toLowerCase().includes(q.toLowerCase()) ||
    item.title_hi.includes(q)
  );

  return (
    <div className="relative">
      <input
        placeholder="Search…"
        className="border px-3 py-1 rounded text-black"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {q && (
        <div className="absolute top-full left-0 bg-white shadow-lg border mt-1 w-64 z-50">
          {results.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-500">
              No results
            </div>
          )}

          {results.map((r) => (
            <Link
              key={r.slug}
              href={`/articles/${r.slug}`}
              className="block px-3 py-2 hover:bg-gray-100 text-black"
              onClick={() => setQ("")}
            >
              {r.title_en}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
