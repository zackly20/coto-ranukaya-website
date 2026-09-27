"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatIDR } from "@/lib/format";

type OrderData = {
  order_code: string;
  customer_name: string;
  order_type: string;
  total: number;
  order_status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  items: { name: string; quantity: number; subtotal: number; notes: string }[];
};

const TYPE_LABEL: Record<string, string> = {
  dine_in: "Makan di Tempat",
  takeaway: "Ambil di Tepi Jalan",
  delivery: "Antar Tanpa Bertemu",
};

function baseFlow(type: string) {
  if (type === "delivery")
    return [
      { key: "received", label: "Pesanan Diterima", icon: "📥" },
      { key: "confirmed", label: "Dikonfirmasi", icon: "✅" },
      { key: "processing", label: "Diproses", icon: "👨‍🍳" },
      { key: "delivering", label: "Dalam Pengantaran", icon: "🛵" },
      { key: "done", label: "Selesai", icon: "🎉" },
    ];
  return [
    { key: "received", label: "Pesanan Diterima", icon: "📥" },
    { key: "confirmed", label: "Dikonfirmasi", icon: "✅" },
    { key: "processing", label: "Sedang Diproses", icon: "👨‍🍳" },
    { key: "ready", label: "Siap", icon: "🔔" },
    { key: "done", label: "Selesai", icon: "🎉" },
  ];
}

function StatusContent() {
  const params = useSearchParams();
  const code = params.get("code");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState("");
  const [inputCode, setInputCode] = useState(code ?? "");

  const fetchOrder = useCallback(async (c: string) => {
    setError("");
    const res = await fetch(`/api/orders/${encodeURIComponent(c)}`);
    if (!res.ok) {
      setOrder(null);
      setError("Pesanan tidak ditemukan. Periksa kembali nomor pesanan Anda.");
      return;
    }
    setOrder(await res.json());
  }, []);

  useEffect(() => {
    if (!code) return;
    fetchOrder(code);
  }, [code, fetchOrder]);

  // Polling tiap 15 detik selama pesanan belum selesai
  useEffect(() => {
    if (!order || ["done", "cancelled"].includes(order.order_status)) return;
    const t = setInterval(() => fetchOrder(order.order_code), 15000);
    return () => clearInterval(t);
  }, [order, fetchOrder]);

  if (!code && !order) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-stone-800">Lacak Pesanan</h1>
        <p className="mt-2 text-sm text-stone-500">
          Masukkan nomor pesanan Anda (contoh: CR-250927-1234).
        </p>
        <form
          className="mt-6 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (inputCode.trim()) fetchOrder(inputCode.trim());
          }}
        >
          <input
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            placeholder="CR-XXXXXX-XXXX"
            className="flex-1 rounded-xl border border-stone-200 px-4 py-2.5 focus:border-amber-500 focus:outline-none"
          />
          <button className="rounded-xl bg-amber-600 px-6 font-bold text-white hover:bg-amber-700">
            Cari
          </button>
        </form>
        {error && <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>}
      </div>
    );
  }

  if (error && !order)
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="font-semibold text-red-600">{error}</p>
        <Link href="/status-pesanan" className="mt-4 inline-block text-sm font-semibold text-amber-700 hover:underline">
          Coba nomor lain
        </Link>
      </div>
    );

  if (!order)
    return <div className="py-24 text-center text-stone-400">Memuat status pesanan…</div>;

  const flow = baseFlow(order.order_type);
  const currentIdx = flow.findIndex((s) => s.key === order.order_status);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm text-stone-500">Nomor Pesanan</p>
            <h1 className="text-2xl font-extrabold tracking-wide text-stone-800">{order.order_code}</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-stone-500">{order.customer_name}</p>
            <p className="text-sm font-semibold text-amber-700">{TYPE_LABEL[order.order_type]}</p>
          </div>
        </div>

        {/* Timeline status */}
        <div className="mt-8 space-y-0">
          {flow.map((step, idx) => {
            const done = idx < currentIdx;
            const active = idx === currentIdx;
            return (
              <div key={step.key} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`grid h-10 w-10 place-items-center rounded-full text-lg ${
                      done
                        ? "bg-green-100 text-green-600"
                        : active
                        ? "bg-amber-600 text-white ring-4 ring-amber-200"
                        : "bg-stone-100 text-stone-400"
                    }`}
                  >
                    {done ? "✓" : step.icon}
                  </div>
                  {idx < flow.length - 1 && (
                    <div className={`h-8 w-0.5 ${done ? "bg-green-300" : "bg-stone-200"}`} />
                  )}
                </div>
                <div className={`pb-8 ${active ? "" : "pt-2"}`}>
                  <p className={`font-semibold ${active ? "text-amber-700" : done ? "text-stone-600" : "text-stone-400"}`}>
                    {step.label}
                    {active && <span className="ml-2 animate-pulse text-xs">● sedang berlangsung</span>}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rincian */}
        <div className="rounded-2xl bg-stone-50 p-4">
          <ul className="space-y-1 text-sm text-stone-600">
            {order.items.map((i, idx) => (
              <li key={idx} className="flex justify-between">
                <span>
                  {i.quantity}× {i.name}
                </span>
                <span>{formatIDR(i.subtotal)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex justify-between border-t border-stone-200 pt-2 font-bold">
            <span>Total</span>
            <span className="text-amber-700">{formatIDR(order.total)}</span>
          </div>
          <p className="mt-2 text-xs text-stone-400">
            Pembayaran: {order.payment_method.toUpperCase()} · {order.payment_status === "paid" ? "Lunas" : "Belum dibayar"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function StatusPesananPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-stone-400">Memuat…</div>}>
      <StatusContent />
    </Suspense>
  );
}
