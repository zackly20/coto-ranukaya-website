import { getSettings } from "@/lib/settings";
import { db } from "@/lib/db";

export const metadata = {
  title: "Tentang Kami — Coto Ranukaya",
  description: "Kenali Coto Ranukaya, restoran coto fiksi khas Sulawesi Selatan untuk portofolio.",
};

const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export default async function TentangPage() {
  const [settings, hours] = await Promise.all([
    getSettings(),
    db.operatingHour.findMany({ orderBy: { day: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-stone-800">Tentang {settings.name}</h1>
      </header>

      <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm sm:p-8">
        <p className="leading-relaxed text-stone-600">{settings.description}</p>
        <p className="mt-4 leading-relaxed text-stone-600">
          Kami menghadirkan coto khas Sulawesi Selatan — kuah kacang yang gurih dan kaya rempah,
          disajikan dengan buras hangat. Setiap mangkuk dibuat dari resep keluarga yang dijaga
          keotentikannya, untuk Anda yang jauh dari tanah Bugis maupun Anda yang penasaran mencoba.
        </p>

        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-stone-50 p-4">
            <dt className="text-sm font-semibold text-stone-500">Alamat</dt>
            <dd className="mt-1 text-sm text-stone-800">{settings.address}</dd>
          </div>
          <div className="rounded-2xl bg-stone-50 p-4">
            <dt className="text-sm font-semibold text-stone-500">Plus Code</dt>
            <dd className="mt-1 text-sm text-stone-800">{settings.plusCode}</dd>
          </div>
          <div className="rounded-2xl bg-stone-50 p-4">
            <dt className="text-sm font-semibold text-stone-500">Telepon / WhatsApp</dt>
            <dd className="mt-1 text-sm text-stone-800">{settings.phone}</dd>
          </div>
          <div className="rounded-2xl bg-stone-50 p-4">
            <dt className="text-sm font-semibold text-stone-500">Kisaran Harga</dt>
            <dd className="mt-1 text-sm text-stone-800">{settings.priceRange}</dd>
          </div>
        </dl>
      </div>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-bold text-stone-800">Jam Operasional</h2>
        <div className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
          {hours.map((h) => (
            <div
              key={h.id}
              className="flex items-center justify-between border-b border-stone-100 px-5 py-3 last:border-0"
            >
              <span className="font-medium text-stone-700">{DAY_NAMES[h.day]}</span>
              <span className={h.isOpen ? "text-stone-600" : "text-red-500"}>
                {h.isOpen ? `${h.openTime.replace(":", ".")} – ${h.closeTime.replace(":", ".")}` : "Tutup"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
