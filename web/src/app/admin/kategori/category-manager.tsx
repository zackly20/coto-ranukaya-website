"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Cat = { id: number; name: string; menuCount: number };

export function CategoryManager({ categories }: { categories: Cat[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      setError((await res.json()).error);
      return;
    }
    setName("");
    router.refresh();
  }

  async function rename(id: number) {
    if (!editName.trim()) return;
    await fetch("/api/admin/categories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name: editName }),
    });
    setEditId(null);
    router.refresh();
  }

  async function remove(c: Cat) {
    if (!confirm(`Hapus kategori "${c.name}"?`)) return;
    const res = await fetch(`/api/admin/categories?id=${c.id}`, { method: "DELETE" });
    if (!res.ok) {
      alert((await res.json()).error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="mt-6 max-w-xl">
      <form onSubmit={add} className="flex gap-2">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama kategori baru"
          className="flex-1 rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
        />
        <button className="rounded-xl bg-amber-600 px-5 text-sm font-bold text-white hover:bg-amber-700">
          Tambah
        </button>
      </form>
      {error && <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>}

      <div className="mt-5 space-y-2">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-3.5">
            {editId === c.id ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 rounded-lg border border-amber-300 px-3 py-1.5 text-sm focus:outline-none"
                />
                <button onClick={() => rename(c.id)} className="text-sm font-bold text-green-600">Simpan</button>
                <button onClick={() => setEditId(null)} className="text-sm text-stone-400">Batal</button>
              </>
            ) : (
              <>
                <span className="flex-1 font-semibold text-stone-800">{c.name}</span>
                <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-500">
                  {c.menuCount} menu
                </span>
                <button
                  onClick={() => { setEditId(c.id); setEditName(c.name); }}
                  className="text-sm font-semibold text-amber-700 hover:underline"
                >
                  Ubah
                </button>
                <button onClick={() => remove(c)} className="text-sm font-semibold text-red-500 hover:underline">
                  Hapus
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
