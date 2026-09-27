import { db } from "@/lib/db";

export const metadata = {
  title: "Galeri — Coto Ranukaya",
  description: "Galeri foto makanan, minuman, suasana, dan restoran Coto Ranukaya.",
};

const CATS = [
  { key: "makanan", label: "Makanan" },
  { key: "minuman", label: "Minuman" },
  { key: "suasana", label: "Suasana" },
  { key: "restoran", label: "Restoran" },
];

export default async function GaleriPage() {
  const items = await db.gallery.findMany({ orderBy: { id: "desc" } });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-stone-800">Galeri</h1>
        <p className="mt-2 text-stone-500">Momen dan hidangan di Coto Ranukaya.</p>
      </header>

      {CATS.map((cat) => {
        const filtered = items.filter((i) => i.category === cat.key);
        if (filtered.length === 0) return null;
        return (
          <section key={cat.key} className="mb-10">
            <h2 className="mb-4 border-l-4 border-amber-600 pl-3 text-xl font-bold text-stone-800">
              {cat.label}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((g) => (
                <figure key={g.id} className="group overflow-hidden rounded-2xl bg-amber-50 shadow-sm">
                  <img
                    src={g.image}
                    alt={g.title}
                    loading="lazy"
                    className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <figcaption className="p-3 text-sm font-semibold text-stone-700">{g.title}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
