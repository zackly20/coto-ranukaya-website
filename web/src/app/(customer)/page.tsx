import Link from "next/link";
import { db } from "@/lib/db";
import { getSettings, getOpenStatus } from "@/lib/settings";
import { formatIDR } from "@/lib/format";
import { MenuCard } from "@/components/menu-card";

export default async function HomePage() {
  const [settings, status, featured, promos, reviews] = await Promise.all([
    getSettings(),
    getOpenStatus(),
    db.menu.findMany({ where: { isAvailable: true }, take: 3, orderBy: { id: "asc" } }),
    db.promo.findMany({ where: { status: "active" }, take: 2 }),
    db.review.findMany({ where: { status: "approved" }, take: 3, orderBy: { id: "desc" } }),
  ]);

  return (
    <div>
      {/* --- HERO --- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-700 via-amber-600 to-orange-500 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium">
              <span className={`h-2 w-2 rounded-full ${status.isOpen ? "bg-green-300" : "bg-red-300"}`} />
              {status.isOpen ? "Buka sekarang · 08.30–22.30" : "Sedang tutup · buka 08.30"}
            </span>
            <h1 className="text-4xl font-extrabold leading-tight lg:text-5xl">
              Coto Ranukaya Otentik,
              <br />
              Rasa Sulawesi yang Jujur
            </h1>
            <p className="mt-4 max-w-md text-amber-50/90">
              Kuah kacang gurih khas Ranukaya, daging dan jeroan pilihan, disajikan dengan buras hangat.
              Makan di tempat, ambil di tepi jalan, atau antar tanpa bertemu.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="rounded-full bg-white px-6 py-3 font-semibold text-amber-700 shadow hover:bg-amber-50"
              >
                Lihat Menu
              </Link>
              <Link
                href="/menu"
                className="rounded-full bg-stone-900/30 px-6 py-3 font-semibold text-white ring-1 ring-white/40 hover:bg-stone-900/50"
              >
                Pesan Sekarang
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-amber-50/90">
              <span>⭐ 4,8/5 · 1.280 ulasan</span>
              <span>💰 {settings.priceRange}</span>
              <span>📍 Kota Demo</span>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -inset-6 rounded-full bg-white/10 blur-2xl" />
            <img
              src="/images/hero.svg"
              alt="Semangkuk coto Ranukaya dengan kuah kacang khas Sulawesi Selatan"
              className="relative w-full rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* --- LAYANAN --- */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: "🍜", title: "Makan di Tempat", desc: "Nikmati coto hangat di area makan kami." },
            { icon: "🛍️", title: "Ambil di Tepi Jalan", desc: "Pesan dulu, ambil tanpa keluar dari mobil." },
            { icon: "🛵", title: "Antar Tanpa Bertemu", desc: "Pesanan diantarkan sampai depan rumah Anda." },
          ].map((s) => (
            <div key={s.title} className="rounded-2xl border border-amber-100 bg-white p-6 text-center shadow-sm">
              <div className="text-3xl">{s.icon}</div>
              <h3 className="mt-2 font-bold text-stone-800">{s.title}</h3>
              <p className="mt-1 text-sm text-stone-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- MENU ANDALAN --- */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-stone-800">Menu Andalan</h2>
            <p className="text-stone-500">Coto Ranukaya & Coto Campur, favorit pelanggan.</p>
          </div>
          <Link href="/menu" className="text-sm font-semibold text-amber-700 hover:underline">
            Lihat semua →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((m) => (
            <MenuCard key={m.id} menu={m} />
          ))}
        </div>
      </section>

      {/* --- PROMO --- */}
      {promos.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <h2 className="mb-6 text-2xl font-bold text-stone-800">Promo Saat Ini</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {promos.map((p) => (
              <div key={p.id} className="rounded-2xl border border-dashed border-amber-400 bg-amber-50 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-amber-900">{p.name}</h3>
                  <span className="rounded-full bg-amber-600 px-2.5 py-0.5 text-xs font-bold text-white">
                    {p.discountType === "percent" ? `-${p.discountValue}%` : `-${formatIDR(p.discountValue)}`}
                  </span>
                </div>
                <p className="mt-1 text-sm text-amber-800">{p.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- ULASAN --- */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-stone-800">Kata Pelanggan</h2>
              <p className="text-stone-500">Rating 4,8/5 dari 1.280 ulasan.</p>
            </div>
            <Link href="/ulasan" className="text-sm font-semibold text-amber-700 hover:underline">
              Semua ulasan →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-stone-100 bg-stone-50 p-5">
                <div className="text-amber-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                <p className="mt-2 text-sm text-stone-600">&ldquo;{r.comment}&rdquo;</p>
                <p className="mt-2 text-sm font-semibold text-stone-800">— {r.customerName}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA LOKASI --- */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-3xl bg-stone-900 p-8 text-center text-white sm:p-12">
          <h2 className="text-2xl font-bold">Mampir ke Coto Ranukaya</h2>
          <p className="mx-auto mt-2 max-w-xl text-stone-300">{settings.address}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={settings.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-amber-600 px-6 py-3 font-semibold hover:bg-amber-700"
            >
              Buka di Google Maps
            </a>
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-green-600 px-6 py-3 font-semibold hover:bg-green-700"
            >
              Chat WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
