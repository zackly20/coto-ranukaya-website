import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatIDR } from "@/lib/format";
import { MenuDetailClient } from "./menu-detail-client";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const menu = await db.menu.findUnique({ where: { id: Number(id) } });
  if (!menu) return { title: "Menu tidak ditemukan — Coto Ranukaya" };
  return {
    title: `${menu.name} — Coto Ranukaya`,
    description: menu.description,
  };
}

export default async function MenuDetailPage({ params }: Props) {
  const { id } = await params;
  const menuId = Number(id);
  if (!Number.isFinite(menuId)) notFound();

  const menu = await db.menu.findUnique({
    where: { id: menuId },
    include: { category: true },
  });
  if (!menu) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/menu" className="mb-6 inline-block text-sm font-semibold text-amber-700 hover:underline">
        ← Kembali ke Menu
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-amber-50 shadow-sm">
          <img
            src={menu.image || "/images/menu/placeholder.svg"}
            alt={menu.name}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            {menu.category.name}
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-stone-800">{menu.name}</h1>
          <p className="mt-2 text-2xl font-bold text-amber-700">{formatIDR(menu.price)}</p>
          <p className="mt-4 leading-relaxed text-stone-600">{menu.description}</p>

          <div className="mt-6">
            <MenuDetailClient
              menu={{
                id: menu.id,
                name: menu.name,
                description: menu.description,
                price: menu.price,
                image: menu.image,
                isAvailable: menu.isAvailable,
                category: { name: menu.category.name },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
