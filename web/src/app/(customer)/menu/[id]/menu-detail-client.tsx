"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-context";
import { formatIDR } from "@/lib/format";

type Menu = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  isAvailable: boolean;
  category: { name: string };
};

export function MenuDetailClient({ menu }: { menu: Menu }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");
  const [added, setAdded] = useState(false);

  if (!menu.isAvailable) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-semibold text-red-700">Menu ini sedang tidak tersedia.</p>
        <p className="mt-1 text-sm text-red-600">Silakan lihat menu lainnya.</p>
      </div>
    );
  }

  function handleAdd() {
    add({
      menuId: menu.id,
      name: menu.name,
      price: menu.price,
      image: menu.image,
      quantity: qty,
      notes: notes.trim(),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Jumlah */}
      <div className="flex items-center gap-4">
        <span className="font-semibold text-stone-700">Jumlah</span>
        <div className="flex items-center rounded-full border border-stone-200">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="grid h-9 w-9 place-items-center rounded-l-full text-lg font-bold text-stone-600 hover:bg-stone-100"
            aria-label="Kurangi jumlah"
          >
            −
          </button>
          <span className="w-10 text-center font-bold">{qty}</span>
          <button
            onClick={() => setQty(Math.min(99, qty + 1))}
            className="grid h-9 w-9 place-items-center rounded-r-full text-lg font-bold text-stone-600 hover:bg-stone-100"
            aria-label="Tambah jumlah"
          >
            +
          </button>
        </div>
      </div>

      {/* Catatan */}
      <div>
        <label htmlFor="catatan" className="mb-1 block font-semibold text-stone-700">
          Catatan (opsional)
        </label>
        <textarea
          id="catatan"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          maxLength={300}
          placeholder="Contoh: tanpa jeroan, pedas sedang…"
          className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
        />
      </div>

      {/* Tambah ke keranjang */}
      <button
        onClick={handleAdd}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-600 px-6 py-3.5 font-bold text-white shadow hover:bg-amber-700"
      >
        {added ? "✓ Ditambahkan ke keranjang" : `Tambahkan ke Keranjang · ${formatIDR(menu.price * qty)}`}
      </button>
      {added && (
        <a href="/keranjang" className="block text-center text-sm font-semibold text-amber-700 hover:underline">
          Lihat keranjang →
        </a>
      )}
    </div>
  );
}
