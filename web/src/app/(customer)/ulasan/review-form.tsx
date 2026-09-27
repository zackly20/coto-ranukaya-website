"use client";

import { useState } from "react";

export function ReviewForm() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName: name, rating, comment }),
      });
      if (res.ok) setSent(true);
    } finally {
      setBusy(false);
    }
  }

  if (sent)
    return (
      <div className="mt-4 rounded-2xl bg-green-50 p-5 text-center">
        <p className="font-semibold text-green-700">Terima kasih! Ulasan Anda menunggu moderasi admin.</p>
      </div>
    );

  const inputCls =
    "w-full rounded-xl border border-stone-200 px-4 py-2.5 focus:border-amber-500 focus:outline-none";

  return (
    <form onSubmit={submit} className="mt-4 space-y-4 rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-stone-700" htmlFor="rname">Nama</label>
        <input id="rname" required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-stone-700">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => setRating(n)}
              className={`text-2xl transition ${n <= rating ? "text-amber-500" : "text-stone-300"}`}
              aria-label={`Beri ${n} bintang`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-stone-700" htmlFor="rcomment">Komentar</label>
        <textarea
          id="rcomment"
          required
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className={inputCls}
          maxLength={500}
        />
      </div>
      <button
        disabled={busy}
        className="w-full rounded-full bg-amber-600 py-3 font-bold text-white hover:bg-amber-700 disabled:opacity-50"
      >
        {busy ? "Mengirim…" : "Kirim Ulasan"}
      </button>
    </form>
  );
}
