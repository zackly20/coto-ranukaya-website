"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Promo = {
  id: number;
  name: string;
  description: string;
  discountType: string;
  discountValue: number;
  status: string;
};

export function PromoManager({ promos }: { promos: Promo[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", discountType: "percent", discountValue: "" });
  const [error, setError] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/promos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, discountValue: Number(form.discountValue) }),
    });
    if (!res.ok) {
      setError((await res.json()).error);
      return;
    }
    setShowForm(false);
    setForm({ name: "", description: "", discountType: "percent", discountValue: "" });
    router.refresh();
  }

  async function toggle(p: Promo) {
    await fetch("/api/admin/promos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id, status: p.status === "active" ? "inactive" : "active" }),
    });
    router.refresh();
  }

  async function remove(p: Promo) {
    if (!confirm(`Hapus promo "${p.name}"?`)) return;
    await fetch(`/api/admin/promos?id=${p.id}`, { method: "DELETE" });
    router.refresh();
  }

  const inputCls =
    "w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none";

  return (
    <div className="mt-6">
      <button
        onClick={() => setShowForm(!showForm)}
        className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-700"
      >
        + Tambah Promo
      </button>

      {showForm && (
        <form onSubmit={save} className="mt-4 max-w-xl space-y-3 rounded-2xl border border-stone-200 bg-white p-5">
          <input required placeholder="Nama promo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
          <textarea placeholder="Deskripsi / syarat promo" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} />
          <div className="grid grid-cols-2 gap-3">
            <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className={inputCls}>
              <option value="percent">Diskon Persen (%)</option>
              <option value="fixed">Diskon Rp</option>
            </select>
            <input required type="number" min={1} placeholder="Nilai" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} className={inputCls} />
          </div>
          {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button className="rounded-full bg-amber-600 px-6 py-2 text-sm font-bold text-white">Simpan</button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-full bg-stone-100 px-6 py-2 text-sm font-semibold text-stone-600">Batal</button>
          </div>
        </form>
      )}

      <div className="mt-5 space-y-3">
        {promos.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4">
            <div className="min-w-40 flex-1">
              <p className="font-bold text-stone-800">{p.name}</p>
              <p className="text-xs text-stone-400">{p.description}</p>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">
              {p.discountType === "percent" ? `${p.discountValue}%` : `Rp${p.discountValue.toLocaleString("id-ID")}`}
            </span>
            <button
              onClick={() => toggle(p)}
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                p.status === "active" ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"
              }`}
            >
              {p.status === "active" ? "Aktif" : "Nonaktif"}
            </button>
            <button onClick={() => remove(p)} className="text-sm font-semibold text-red-500 hover:underline">Hapus</button>
          </div>
        ))}
        {promos.length === 0 && <p className="rounded-2xl bg-white p-8 text-center text-stone-400">Belum ada promo.</p>}
      </div>
    </div>
  );
}
