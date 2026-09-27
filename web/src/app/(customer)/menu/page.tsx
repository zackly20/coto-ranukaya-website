import { db } from "@/lib/db";
import { MenuCard } from "@/components/menu-card";

export const metadata = {
  title: "Menu — Coto Ranukaya",
  description: "Daftar menu Coto Ranukaya: coto khas Sulawesi Selatan, minuman, dan camilan beserta harga.",
};

export default async function MenuPage() {
  const categories = await db.category.findMany({
    orderBy: { id: "asc" },
    include: {
      menus: { where: { isAvailable: true }, orderBy: { id: "asc" } },
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-stone-800">Menu Kami</h1>
        <p className="mt-2 text-stone-500">
          Semua harga dalam Rupiah. Ketuk menu untuk detail & pemesanan.
        </p>
      </header>

      {categories.map((cat) => (
        <section key={cat.id} className="mb-12">
          <h2 className="mb-5 border-l-4 border-amber-600 pl-3 text-xl font-bold text-stone-800">
            {cat.name}
          </h2>
          {cat.menus.length === 0 ? (
            <p className="text-sm text-stone-400">Belum ada menu di kategori ini.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cat.menus.map((m) => (
                <MenuCard key={m.id} menu={m} />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
