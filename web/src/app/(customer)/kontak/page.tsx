import { getSettings } from "@/lib/settings";

export const metadata = {
  title: "Kontak — Coto Ranukaya",
  description: "Hubungi Coto Ranukaya via telepon atau WhatsApp.",
};

export default async function KontakPage() {
  const settings = await getSettings();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-stone-800">Hubungi Kami</h1>
        <p className="mt-2 text-stone-500">Kami siap membantu pesanan dan pertanyaan Anda.</p>
      </header>

      <div className="space-y-4">
        <a
          href={`https://wa.me/${settings.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-2xl border border-green-200 bg-green-50 p-5 transition hover:shadow-md"
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-green-600 text-2xl text-white">💬</span>
          <div>
            <h2 className="font-bold text-green-800">WhatsApp</h2>
            <p className="text-sm text-green-700">Paling cepat untuk pesanan & tanya menu</p>
          </div>
        </a>

        <a
          href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
          className="flex items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 transition hover:shadow-md"
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-amber-600 text-2xl text-white">📞</span>
          <div>
            <h2 className="font-bold text-amber-800">Telepon</h2>
            <p className="text-sm text-amber-700">{settings.phone}</p>
          </div>
        </a>

        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <h2 className="font-bold text-stone-800">Alamat</h2>
          <p className="mt-1 text-sm text-stone-600">{settings.address}</p>
        </div>
      </div>
    </div>
  );
}
