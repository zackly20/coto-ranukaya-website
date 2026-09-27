import { db } from "@/lib/db";
import { ReviewForm } from "./review-form";

export const metadata = {
  title: "Ulasan Pelanggan — Coto Ranukaya",
  description: "Rating 4,8/5 dari 1.280 ulasan pelanggan Coto Ranukaya.",
};

export default async function UlasanPage() {
  const reviews = await db.review.findMany({
    where: { status: "approved" },
    orderBy: { id: "desc" },
    take: 50,
  });

  const avg =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 4.8;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-stone-800">Ulasan Pelanggan</h1>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5">
          <span className="text-amber-600">★</span>
          <span className="font-bold text-amber-800">{avg.toFixed(1).replace(".", ",")}/5</span>
          <span className="text-sm text-amber-700">· 1.280 ulasan pelanggan</span>
        </div>
      </header>

      <div className="space-y-4">
        {reviews.map((r) => (
          <article key={r.id} className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800">{r.customerName}</span>
              <span className="text-amber-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
            </div>
            <p className="mt-2 text-stone-600">{r.comment}</p>
            <p className="mt-2 text-xs text-stone-400">
              {new Date(r.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </article>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-stone-800">Tulis Ulasan Anda</h2>
        <p className="mt-1 text-sm text-stone-500">
          Ulasan akan tampil setelah disetujui admin.
        </p>
        <ReviewForm />
      </section>
    </div>
  );
}
