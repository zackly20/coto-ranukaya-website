"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatIDR } from "@/lib/format";

type OrderRow = {
  id: number;
  orderCode: string;
  customerName: string;
  phone: string;
  orderType: string;
  address: string | null;
  tableNumber: string | null;
  pickupTime: string | null;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  items: { name: string; quantity: number; notes: string; subtotal: number }[];
};

const STATUSES = [
  { value: "received", label: "Diterima" },
  { value: "confirmed", label: "Dikonfirmasi" },
  { value: "processing", label: "Diproses" },
  { value: "ready", label: "Siap" },
  { value: "delivering", label: "Diantar" },
  { value: "done", label: "Selesai" },
  { value: "cancelled", label: "Batal" },
];

const TYPE_LABEL: Record<string, string> = {
  dine_in: "Makan di Tempat",
  takeaway: "Ambil Sendiri",
  delivery: "Antar",
};

const STATUS_COLOR: Record<string, string> = {
  received: "bg-blue-100 text-blue-700",
  confirmed: "bg-indigo-100 text-indigo-700",
  processing: "bg-amber-100 text-amber-700",
  ready: "bg-green-100 text-green-700",
  delivering: "bg-cyan-100 text-cyan-700",
  done: "bg-stone-100 text-stone-500",
  cancelled: "bg-red-100 text-red-600",
};

export function OrdersTable({ orders }: { orders: OrderRow[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState("active");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (filter === "active") return orders.filter((o) => !["done", "cancelled"].includes(o.orderStatus));
    if (filter === "done") return orders.filter((o) => o.orderStatus === "done");
    return orders;
  }, [orders, filter]);

  async function update(id: number, patch: { order_status?: string; payment_status?: string }) {
    setBusyId(id);
    try {
      await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mt-6">
      {/* Filter */}
      <div className="mb-4 flex gap-2">
        {[
          { value: "active", label: "Aktif" },
          { value: "done", label: "Selesai" },
          { value: "all", label: "Semua" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              filter === f.value ? "bg-amber-600 text-white" : "bg-white text-stone-600 ring-1 ring-stone-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((o) => (
          <div key={o.id} className="rounded-2xl border border-stone-200 bg-white p-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                className="font-mono text-sm font-bold text-amber-700 hover:underline"
              >
                {o.orderCode}
              </button>
              <span className="text-sm font-semibold text-stone-700">{o.customerName}</span>
              <span className="text-xs text-stone-400">{TYPE_LABEL[o.orderType]}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLOR[o.orderStatus]}`}>
                {STATUSES.find((s) => s.value === o.orderStatus)?.label}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                o.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
              }`}>
                {o.paymentStatus === "paid" ? "Lunas" : "Belum Bayar"}
              </span>
              <span className="ml-auto font-bold text-stone-800">{formatIDR(o.total)}</span>
            </div>

            {/* Actions */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <select
                value={o.orderStatus}
                disabled={busyId === o.id}
                onChange={(e) => update(o.id, { order_status: e.target.value })}
                className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm focus:border-amber-500 focus:outline-none"
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <button
                onClick={() => update(o.id, { payment_status: o.paymentStatus === "paid" ? "unpaid" : "paid" })}
                className="rounded-lg bg-stone-100 px-3 py-1.5 text-sm font-semibold text-stone-700 hover:bg-stone-200"
              >
                {o.paymentStatus === "paid" ? "Tandai Belum Bayar" : "Tandai Lunas"}
              </button>
              <a
                href={`/status-pesanan?code=${o.orderCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-amber-700 hover:underline"
              >
                Lihat halaman status →
              </a>
            </div>

            {/* Detail expand */}
            {expanded === o.id && (
              <div className="mt-3 rounded-xl bg-stone-50 p-4 text-sm">
                <p className="text-stone-600">
                  📞 {o.phone}
                  {o.tableNumber && <> · Meja {o.tableNumber}</>}
                  {o.pickupTime && <> · Ambil {o.pickupTime}</>}
                  {o.address && <> · 📍 {o.address}</>}
                </p>
                <ul className="mt-2 space-y-1">
                  {o.items.map((i, idx) => (
                    <li key={idx} className="flex justify-between text-stone-700">
                      <span>
                        {i.quantity}× {i.name}
                        {i.notes && <em className="ml-1 text-xs text-stone-400">({i.notes})</em>}
                      </span>
                      <span>{formatIDR(i.subtotal)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-stone-400">
                  Dibuat: {new Date(o.createdAt).toLocaleString("id-ID")} · Bayar: {o.paymentMethod.toUpperCase()}
                </p>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="rounded-2xl bg-white p-8 text-center text-stone-400">Tidak ada pesanan pada filter ini.</p>
        )}
      </div>
    </div>
  );
}
