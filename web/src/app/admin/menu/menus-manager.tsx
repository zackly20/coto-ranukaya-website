"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatIDR } from "@/lib/format";

type MenuRow = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  isAvailable: boolean;
  categoryId: number;
  categoryName: string;
};
type Cat = { id: number; name: string };

const EMPTY = { name: "", description: "", price: "", image: "", categoryId: 0, isAvailable: true };

export function MenusManager({ menus, categories }: { menus: MenuRow[]; categories: Cat[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<MenuRow | null>(null);
  const [form, setForm] = useState({ ...EMPTY, categoryId: categories[0]?.id ?? 0 });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function startAdd() {
    setEditing(null);
    setForm({ ...EMPTY, categoryId: categories[0]?.id ?? 0 });
    setShowForm(true);
    setError("");
  }
  function startEdit(m: MenuRow) {
    setEditing(m);
    setForm({
      name: m.name,
      description: m.description,
      price: String(m.price),
      image: m.image,
      categoryId: m.categoryId,
      isAvailable: m.isAvailable,
    });
    setShowForm(true);
    setError("");
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const payload = { ...form, price: Number(form.price) };
      const res = await fetch(editing ? `/api/admin/menus/${editing.id}` : "/api/admin/menus", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal menyimpan.");
        return;
      }
      setShowForm(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function toggleAvailable(m: MenuRow) {
    await fetch(`/api/admin/menus/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !m.isAvailable }),
    });
    router.refresh();
  }

  async function remove(m: MenuRow) {
    if (!confirm(`Hapus menu "${m.name}"?`)) return;
    const res = await fetch(`/api/admin/menus/${m.id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.softDeleted) alert(data.message);
    router.refresh();
  }

  const inputCls =
    "w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none";

  return (
    <div className="mt-6">
      <button
        onClick={startAdd}
        className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-700"
      >
        + Tambah Menu
      </button>

      {/* Form */}
      {showForm && (
        <form onSubmit={save} className="mt-4 space-y-3 rounded-2xl border border-stone-200 bg-white p-5">
          <h3 className="font-bold text-stone-800">{editing ? `Ubah: ${editing.name}` : "Menu Baru"}</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <input required placeholder="Nama menu" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
            <input required type="number" min={0} placeholder="Harga (Rp)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputCls} />
            <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })} className={inputCls}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input placeholder="Path gambar (contoh: /images/menu/coto-ranukaya.svg)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={inputCls} />
          </div>
          <textarea placeholder="Deskripsi" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} />
          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} />
            Tersedia dijual
          </label>
          {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button disabled={busy} className="rounded-full bg-amber-600 px-6 py-2 text-sm font-bold text-white hover:bg-amber-700 disabled:opacity-50">
              {busy ? "Menyimpan…" : "Simpan"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-full bg-stone-100 px-6 py-2 text-sm font-semibold text-stone-600">
              Batal
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="mt-5 space-y-3">
        {menus.map((m) => (
          <div key={m.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4">
            <img src={m.image || "/images/menu/placeholder.svg"} alt={m.name} className="h-14 w-14 rounded-xl object-cover" />
            <div className="min-w-40 flex-1">
              <p className="font-bold text-stone-800">{m.name}</p>
              <p className="text-xs text-stone-400">{m.categoryName}</p>
            </div>
            <span className="font-bold text-amber-700">{formatIDR(m.price)}</span>
            <button
              onClick={() => toggleAvailable(m)}
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                m.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
              }`}
            >
              {m.isAvailable ? "Tersedia" : "Habis"}
            </button>
            <button onClick={() => startEdit(m)} className="text-sm font-semibold text-amber-700 hover:underline">Ubah</button>
            <button onClick={() => remove(m)} className="text-sm font-semibold text-red-500 hover:underline">Hapus</button>
          </div>
        ))}
      </div>
    </div>
  );
}
