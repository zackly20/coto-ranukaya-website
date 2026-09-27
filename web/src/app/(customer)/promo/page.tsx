import { db } from "@/lib/db";
import { formatIDR } from "@/lib/format";

export const metadata = {
  title: "Promo — Coto Ranukaya",
  description: "Promo dan penawaran spesial terbaru dari Coto Ranukaya.",
};

export default async function PromoPage() {
  const promos = await db.promo.findMany({
    where: { status: "active" },
    orderBy: { id: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-stone-800">Promo Spesial</h1>
        <p className="mt-2 text-stone-500">Penawaran terbaik dari Coto Ranukaya untuk Anda.</p>
      </header>

      {promos.length === 0 ? (
        <p className="text-center text-stone-400">Belum ada promo yang berlangsung.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {promos.map((p) => (
            <div
              key={p.id}
              className="rounded-3xl border-2 border-dashed border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-bold text-amber-900">{p.name}</h2>
                <span className="shrink-0 rounded-full bg-amber-600 px-3 py-1 text-sm font-extrabold text-white">
                  {p.discountType === "percent" ? `${p.discountValue}% OFF` : `HEMAT ${formatIDR(p.discountValue)}`}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-amber-800">{p.description}</p>
              <p className="mt-3 text-xs font-semibold text-amber-600">
                Berlaku hingga:{" "}
                {p.endDate ? new Date(p.endDate).toLocaleDateString("id-ID") : "selama promo berlangsung"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
