"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Item = { id: number; title: string; image: string; category: string };

const CATS = ["makanan", "minuman", "suasana", "restoran"];

export function GalleryManager({ items }: { items: Item[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", image: "", category: "makanan" });
  const [error, setError] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setError((await res.json()).error);
      return;
    }
    setForm({ title: "", image: "", category: "makanan" });
    router.refresh();
  }

  async function remove(id: number) {
    if (!confirm("Hapus foto ini dari galeri?")) return;
    await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
    router.refresh();
  }

  const inputCls =
    "w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none";

  return (
    <div className="mt-6">
      <form onSubmit={save} className="grid max-w-2xl gap-3 rounded-2xl border border-stone-200 bg-white p-5 sm:grid-cols-3">
        <input required placeholder="Judul foto" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
        <input required placeholder="/images/gallery/g1.svg" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={inputCls} />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
          {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {error && <p className="text-sm font-semibold text-red-600 sm:col-span-3">{error}</p>}
        <button className="rounded-full bg-amber-600 px-6 py-2.5 text-sm font-bold text-white sm:col-span-3">
          Tambah ke Galeri
        </button>
      </form>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((g) => (
          <div key={g.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <img src={g.image} alt={g.title} className="aspect-square w-full object-cover" />
            <div className="p-3">
              <p className="truncate text-sm font-bold text-stone-800">{g.title}</p>
              <div className="mt-1 flex items-center justify-between">
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500">{g.category}</span>
                <button onClick={() => remove(g.id)} className="text-xs font-semibold text-red-500 hover:underline">
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
