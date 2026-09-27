"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Settings = {
  name: string; address: string; phone: string; whatsapp: string;
  mapsUrl: string; plusCode: string; description: string; priceRange: string;
};
type Hour = { day: number; openTime: string; closeTime: string; isOpen: boolean };

const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export function SettingsForm({ settings, hours }: { settings: Settings; hours: Hour[] }) {
  const router = useRouter();
  const [form, setForm] = useState(settings);
  const [dayHours, setDayHours] = useState<Hour[]>(hours);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  function updateHour(day: number, patch: Partial<Hour>) {
    setDayHours((prev) => prev.map((h) => (h.day === day ? { ...h, ...patch } : h)));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: form, hours: dayHours }),
      });
      if (res.ok) {
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setBusy(false);
    }
  }

  const inputCls =
    "w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none";
  const labelCls = "mb-1 block text-sm font-semibold text-stone-700";

  return (
    <form onSubmit={save} className="mt-6 max-w-2xl space-y-6">
      {/* Info restoran */}
      <section className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5">
        <h2 className="font-bold text-stone-800">Informasi Restoran</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Nama</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Telepon (tampil publik)</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>WhatsApp (format 62xxx)</label>
            <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Kisaran Harga</label>
            <input value={form.priceRange} onChange={(e) => setForm({ ...form, priceRange: e.target.value })} className={inputCls} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Alamat</label>
          <textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputCls} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Plus Code</label>
            <input value={form.plusCode} onChange={(e) => setForm({ ...form, plusCode: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>URL Google Maps</label>
            <input value={form.mapsUrl} onChange={(e) => setForm({ ...form, mapsUrl: e.target.value })} className={inputCls} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Deskripsi (halaman Tentang)</label>
          <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} />
        </div>
      </section>

      {/* Jam operasional */}
      <section className="rounded-2xl border border-stone-200 bg-white p-5">
        <h2 className="font-bold text-stone-800">Jam Operasional</h2>
        <p className="mt-1 text-xs text-stone-400">Status Buka/Tutup di website dihitung dari data ini.</p>
        <div className="mt-4 space-y-2">
          {dayHours.map((h) => (
            <div key={h.day} className="flex flex-wrap items-center gap-3 rounded-xl bg-stone-50 px-4 py-2.5">
              <label className="flex w-32 items-center gap-2 text-sm font-semibold text-stone-700">
                <input
                  type="checkbox"
                  checked={h.isOpen}
                  onChange={(e) => updateHour(h.day, { isOpen: e.target.checked })}
                />
                {DAYS[h.day]}
              </label>
              {h.isOpen ? (
                <div className="flex items-center gap-2 text-sm">
                  <input type="time" value={h.openTime} onChange={(e) => updateHour(h.day, { openTime: e.target.value })} className="rounded-lg border border-stone-200 px-2 py-1" />
                  <span>–</span>
                  <input type="time" value={h.closeTime} onChange={(e) => updateHour(h.day, { closeTime: e.target.value })} className="rounded-lg border border-stone-200 px-2 py-1" />
                </div>
              ) : (
                <span className="text-sm text-red-500">Tutup</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button
          disabled={busy}
          className="rounded-full bg-amber-600 px-8 py-3 font-bold text-white hover:bg-amber-700 disabled:opacity-50"
        >
          {busy ? "Menyimpan…" : "Simpan Pengaturan"}
        </button>
        {saved && <span className="text-sm font-semibold text-green-600">✓ Tersimpan</span>}
      </div>
    </form>
  );
}
