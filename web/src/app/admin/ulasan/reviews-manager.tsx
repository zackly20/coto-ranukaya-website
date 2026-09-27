"use client";

import { useRouter } from "next/navigation";

type Review = {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  status: string;
  createdAt: string;
};

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  pending: { label: "Menunggu", cls: "bg-orange-100 text-orange-700" },
  approved: { label: "Disetujui", cls: "bg-green-100 text-green-700" },
  rejected: { label: "Ditolak", cls: "bg-red-100 text-red-600" },
};

export function ReviewsManager({ reviews }: { reviews: Review[] }) {
  const router = useRouter();

  async function setStatus(id: number, status: string) {
    await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    router.refresh();
  }

  async function remove(id: number) {
    if (!confirm("Hapus ulasan ini?")) return;
    await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="mt-6 space-y-3">
      {reviews.map((r) => {
        const badge = STATUS_BADGE[r.status] ?? STATUS_BADGE.pending;
        return (
          <div key={r.id} className="rounded-2xl border border-stone-200 bg-white p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-bold text-stone-800">{r.customerName}</span>
              <span className="text-amber-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${badge.cls}`}>{badge.label}</span>
              <span className="ml-auto text-xs text-stone-400">
                {new Date(r.createdAt).toLocaleDateString("id-ID")}
              </span>
            </div>
            <p className="mt-2 text-stone-600">{r.comment}</p>
            <div className="mt-3 flex gap-2">
              {r.status !== "approved" && (
                <button onClick={() => setStatus(r.id, "approved")} className="rounded-lg bg-green-600 px-4 py-1.5 text-sm font-bold text-white hover:bg-green-700">
                  Setujui
                </button>
              )}
              {r.status !== "rejected" && (
                <button onClick={() => setStatus(r.id, "rejected")} className="rounded-lg bg-stone-200 px-4 py-1.5 text-sm font-bold text-stone-700 hover:bg-stone-300">
                  Tolak
                </button>
              )}
              <button onClick={() => remove(r.id)} className="rounded-lg px-4 py-1.5 text-sm font-semibold text-red-500 hover:bg-red-50">
                Hapus
              </button>
            </div>
          </div>
        );
      })}
      {reviews.length === 0 && (
        <p className="rounded-2xl bg-white p-8 text-center text-stone-400">Belum ada ulasan.</p>
      )}
    </div>
  );
}
