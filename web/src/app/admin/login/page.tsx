"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login gagal.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-3xl border border-stone-200 bg-white p-8 shadow-lg">
      <div className="mb-6 text-center">
        <span className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-amber-600 text-2xl font-bold text-white">C</span>
        <h1 className="text-xl font-extrabold text-stone-800">Admin Coto Ranukaya</h1>
        <p className="mt-1 text-sm text-stone-500">Masuk untuk mengelola website</p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-stone-700" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 focus:border-amber-500 focus:outline-none"
            placeholder="admin@cotoranukaya.com"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-stone-700" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-stone-200 px-4 py-2.5 focus:border-amber-500 focus:outline-none"
            placeholder="••••••••"
          />
        </div>
        {error && <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600">{error}</p>}
        <button
          disabled={busy}
          className="w-full rounded-full bg-amber-600 py-3 font-bold text-white hover:bg-amber-700 disabled:opacity-50"
        >
          {busy ? "Memproses…" : "Masuk"}
        </button>
      </form>

      <p className="mt-4 rounded-xl bg-amber-50 px-4 py-2.5 text-center text-xs text-amber-800">
        Default: <b>admin@cotoranukaya.com</b> / <b>admin123</b> (ganti setelah deploy)
      </p>
    </div>
  );
}
