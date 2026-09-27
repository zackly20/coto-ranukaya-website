"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-context";
import { formatIDR } from "@/lib/format";

const ORDER_TYPES = [
  { value: "dine_in", label: "Makan di Tempat", icon: "🍜" },
  { value: "takeaway", label: "Ambil di Tepi Jalan", icon: "🛍️" },
  { value: "delivery", label: "Antar Tanpa Bertemu", icon: "🛵" },
];

const PAYMENT_METHODS = [
  { value: "cash", label: "Bayar di Tempat" },
  { value: "transfer", label: "Transfer Bank" },
  { value: "qris", label: "QRIS" },
];

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    order_type: "dine_in",
    table_number: "",
    pickup_time: "",
    address: "",
    payment_method: "cash",
  });

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="text-6xl">🧾</div>
        <h1 className="mt-4 text-2xl font-bold">Belum ada item untuk di-checkout</h1>
        <Link href="/menu" className="mt-6 inline-block rounded-full bg-amber-600 px-8 py-3 font-bold text-white hover:bg-amber-700">
          Lihat Menu
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            menu_id: i.menuId,
            quantity: i.quantity,
            notes: i.notes,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal membuat pesanan.");
        return;
      }
      clear();
      router.push(`/status-pesanan?code=${data.order_code}`);
    } finally {
      setSubmitting(false);
    }
  }

  const inputCls =
    "w-full rounded-xl border border-stone-200 px-4 py-2.5 focus:border-amber-500 focus:outline-none";
  const labelCls = "mb-1.5 block text-sm font-semibold text-stone-700";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-stone-800">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Data pelanggan */}
        <section className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-stone-800">Data Pelanggan</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="nama">Nama</label>
              <input
                id="nama"
                required
                value={form.customer_name}
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                className={inputCls}
                placeholder="Nama Anda"
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="wa">Nomor WhatsApp</label>
              <input
                id="wa"
                required
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputCls}
                placeholder="08xxxxxxxxxx"
              />
            </div>
          </div>
        </section>

        {/* Jenis pesanan */}
        <section className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-stone-800">Jenis Pesanan</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {ORDER_TYPES.map((t) => (
              <button
                type="button"
                key={t.value}
                onClick={() => setForm({ ...form, order_type: t.value })}
                className={`rounded-xl border-2 p-4 text-center transition ${
                  form.order_type === t.value
                    ? "border-amber-600 bg-amber-50"
                    : "border-stone-200 hover:border-amber-300"
                }`}
              >
                <div className="text-2xl">{t.icon}</div>
                <div className="mt-1 text-sm font-semibold">{t.label}</div>
              </button>
            ))}
          </div>

          {/* Data tambahan sesuai jenis */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {form.order_type === "dine_in" && (
              <div>
                <label className={labelCls} htmlFor="meja">Nomor Meja</label>
                <input
                  id="meja"
                  value={form.table_number}
                  onChange={(e) => setForm({ ...form, table_number: e.target.value })}
                  className={inputCls}
                  placeholder="Contoh: 5"
                />
              </div>
            )}
            {form.order_type === "takeaway" && (
              <div>
                <label className={labelCls} htmlFor="waktu">Perkiraan Waktu Ambil</label>
                <input
                  id="waktu"
                  value={form.pickup_time}
                  onChange={(e) => setForm({ ...form, pickup_time: e.target.value })}
                  className={inputCls}
                  placeholder="Contoh: 12.30"
                />
              </div>
            )}
            {form.order_type === "delivery" && (
              <div className="sm:col-span-2">
                <label className={labelCls} htmlFor="alamat">Alamat Pengiriman</label>
                <textarea
                  id="alamat"
                  required
                  rows={2}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className={inputCls}
                  placeholder="Nama jalan, nomor rumah, patokan…"
                />
              </div>
            )}
          </div>
        </section>

        {/* Pembayaran */}
        <section className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-stone-800">Metode Pembayaran</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {PAYMENT_METHODS.map((p) => (
              <button
                type="button"
                key={p.value}
                onClick={() => setForm({ ...form, payment_method: p.value })}
                className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition ${
                  form.payment_method === p.value
                    ? "border-amber-600 bg-amber-50 text-amber-800"
                    : "border-stone-200 hover:border-amber-300"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </section>

        {/* Ringkasan */}
        <section className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-stone-800">Ringkasan Pesanan</h2>
          <ul className="mt-3 space-y-1 text-sm text-stone-600">
            {items.map((i) => (
              <li key={i.menuId} className="flex justify-between">
                <span>
                  {i.quantity}× {i.name}
                </span>
                <span>{formatIDR(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-stone-100 pt-3 text-lg font-extrabold">
            <span>Total</span>
            <span className="text-amber-700">{formatIDR(subtotal)}</span>
          </div>
        </section>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-amber-600 py-4 font-bold text-white shadow hover:bg-amber-700 disabled:opacity-50"
        >
          {submitting ? "Mengirim pesanan…" : "Kirim Pesanan"}
        </button>
      </form>
    </div>
  );
}
