import Link from "next/link";
import { formatIDR } from "@/lib/format";

type Menu = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  isAvailable: boolean;
};

export function MenuCard({ menu }: { menu: Menu }) {
  return (
    <Link
      href={`/menu/${menu.id}`}
      className="group overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="aspect-[4/3] overflow-hidden bg-amber-50">
        <img
          src={menu.image || "/images/menu/placeholder.svg"}
          alt={menu.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-stone-800">{menu.name}</h3>
          <span className="whitespace-nowrap font-bold text-amber-700">{formatIDR(menu.price)}</span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-stone-500">{menu.description}</p>
        {!menu.isAvailable && (
          <span className="mt-2 inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
            Habis
          </span>
        )}
      </div>
    </Link>
  );
}
