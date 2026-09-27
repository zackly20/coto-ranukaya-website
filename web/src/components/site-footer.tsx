import Link from "next/link";

type Settings = {
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  mapsUrl: string;
};

export function SiteFooter({ settings }: { settings: Settings }) {
  return (
    <footer className="mt-16 border-t border-amber-100 bg-stone-900 text-stone-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-amber-600 font-bold text-white">C</span>
            <span className="font-bold text-white">{settings.name}</span>
          </div>
          <p className="text-sm leading-relaxed">
            Coto khas Sulawesi Selatan dengan kuah kacang otentik, disajikan hangat setiap hari.
          </p>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-white">Navigasi</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/menu" className="hover:text-amber-400">Menu</Link></li>
            <li><Link href="/promo" className="hover:text-amber-400">Promo</Link></li>
            <li><Link href="/ulasan" className="hover:text-amber-400">Ulasan</Link></li>
            <li><Link href="/galeri" className="hover:text-amber-400">Galeri</Link></li>
            <li><Link href="/status-pesanan" className="hover:text-amber-400">Status Pesanan</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-white">Kontak</h3>
          <ul className="space-y-2 text-sm">
            <li>📞 {settings.phone}</li>
            <li>
              💬{" "}
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400"
              >
                WhatsApp
              </a>
            </li>
            <li className="pt-1 text-xs leading-relaxed text-stone-400">{settings.address}</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-white">Jam Operasional</h3>
          <p className="text-sm">Setiap hari</p>
          <p className="text-sm">08.30 – 22.30 WITA</p>
        </div>
      </div>
      <div className="border-t border-stone-800 py-4 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} {settings.name}. Semua hak dilindungi.
      </div>
    </footer>
  );
}
