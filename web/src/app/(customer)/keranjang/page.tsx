"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-context";
import { formatIDR } from "@/lib/format";

export default function KeranjangPage() {
  const { items, subtotal, count, setQty, remove, setNotes } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="text-6xl">🛒</div>
        <h1 className="mt-4 text-2xl font-bold text-stone-800">Keranjang masih kosong</h1>
        <p className="mt-2 text-stone-500">Yuk, pilih coto favoritmu dulu!</p>
        <Link
          href="/menu"
          className="mt-6 inline-block rounded-full bg-amber-600 px-8 py-3 font-bold text-white hover:bg-amber-700"
        >
          Lihat Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-stone-800">Keranjang ({count} item)</h1>

      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <div key={item.menuId} className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
            <div className="flex gap-4">
              <img
                src={item.image || "/images/menu/placeholder.svg"}
                alt={item.name}
                className="h-20 w-20 rounded-xl object-cover"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-stone-800">{item.name}</h3>
                  <button
                    onClick={() => remove(item.menuId)}
                    className="text-xs font-semibold text-red-500 hover:underline"
                  >
                    Hapus
                  </button>
                </div>
                <p className="text-sm text-stone-500">{formatIDR(item.price)} / porsi</p>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-stone-200">
                    <button
                      onClick={() => setQty(item.menuId, item.quantity - 1)}
                      className="grid h-8 w-8 place-items-center rounded-l-full font-bold text-stone-600 hover:bg-stone-100"
                      aria-label="Kurangi"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      onClick={() => setQty(item.menuId, item.quantity + 1)}
                      className="grid h-8 w-8 place-items-center rounded-r-full font-bold text-stone-600 hover:bg-stone-100"
                      aria-label="Tambah"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-bold text-amber-700">{formatIDR(item.price * item.quantity)}</span>
                </div>

                <input
                  type="text"
                  value={item.notes}
                  onChange={(e) => setNotes(item.menuId, e.target.value)}
                  placeholder="Catatan untuk item ini…"
                  maxLength={300}
                  className="mt-3 w-full rounded-lg border border-stone-200 px-3 py-1.5 text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Subtotal */}
      <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm border border-amber-100">
        <div className="flex items-center justify-between text-lg">
          <span className="font-semibold text-stone-600">Subtotal</span>
          <span className="font-extrabold text-stone-800">{formatIDR(subtotal)}</span>
        </div>
        <p className="mt-1 text-xs text-stone-400">
          Biaya pengiriman (jika ada) ditentukan saat konfirmasi oleh restoran.
        </p>
        <Link
          href="/checkout"
          className="mt-4 block rounded-full bg-amber-600 py-3.5 text-center font-bold text-white hover:bg-amber-700"
        >
          Lanjut ke Checkout
        </Link>
      </div>
    </div>
  );
}
