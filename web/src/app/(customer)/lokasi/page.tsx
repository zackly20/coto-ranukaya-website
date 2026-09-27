import { getSettings } from "@/lib/settings";

export const metadata = {
  title: "Lokasi — Coto Ranukaya",
  description: "Lokasi Coto Ranukaya — restoran coto khas Sulawesi Selatan (proyek portofolio).",
};

export default async function LokasiPage() {
  const settings = await getSettings();
  const hasMaps = Boolean(settings.mapsUrl);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-stone-800">Lokasi Kami</h1>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-stone-800">{settings.name}</h2>
          <p className="mt-2 text-stone-600">{settings.address}</p>
          {settings.plusCode && (
            <p className="mt-2 text-sm text-stone-500">Plus Code: {settings.plusCode}</p>
          )}

          <div className="mt-6 space-y-3">
            {hasMaps && (
              <a
                href={settings.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-full bg-amber-600 py-3 text-center font-bold text-white hover:bg-amber-700"
              >
                Buka di Google Maps
              </a>
            )}
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-full bg-green-600 py-3 text-center font-bold text-white hover:bg-green-700"
            >
              Chat WhatsApp
            </a>
          </div>

          {!hasMaps && (
            <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-700">
              Peta belum tersedia. Admin dapat mengisi URL Google Maps melalui dashboard
              (Pengaturan → URL Google Maps) dan tombol peta akan muncul otomatis di sini.
            </p>
          )}
        </div>

        <div className="grid min-h-64 place-items-center rounded-3xl border-2 border-dashed border-amber-200 bg-amber-50/50 p-6 text-center">
          <div>
            <div className="text-4xl">🗺️</div>
            <p className="mt-3 font-semibold text-stone-700">Peta Lokasi</p>
            <p className="mt-1 text-sm text-stone-500">
              {hasMaps
                ? "Peta akan ditampilkan di sini."
                : "Belum dikonfigurasi — tambahkan URL Google Maps dari dashboard admin."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
