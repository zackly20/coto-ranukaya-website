"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/pesanan", label: "Pesanan", icon: "🧾" },
  { href: "/admin/menu", label: "Menu", icon: "🍜" },
  { href: "/admin/kategori", label: "Kategori", icon: "🗂️" },
  { href: "/admin/promo", label: "Promo", icon: "🏷️" },
  { href: "/admin/ulasan", label: "Ulasan", icon: "⭐" },
  { href: "/admin/galeri", label: "Galeri", icon: "🖼️" },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: "⚙️" },
];

export function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-16 shrink-0 flex-col border-r border-stone-200 bg-white lg:w-60">
      <div className="flex h-16 items-center gap-2 border-b border-stone-100 px-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-amber-600 font-bold text-white">C</span>
        <div className="hidden lg:block">
          <p className="text-sm font-bold text-stone-800">Coto Ranukaya</p>
          <p className="text-xs text-stone-400">Dashboard Admin</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              pathname === l.href
                ? "bg-amber-100 text-amber-800"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <span>{l.icon}</span>
            <span className="hidden lg:inline">{l.label}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-stone-100 p-3">
        <p className="mb-2 hidden px-2 text-xs text-stone-400 lg:block">Login sebagai {adminName}</p>
        <button
          onClick={logout}
          className="w-full rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
        >
          Keluar
        </button>
      </div>
    </aside>
  );
}
