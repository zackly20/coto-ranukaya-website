"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart-context";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/menu", label: "Menu" },
  { href: "/promo", label: "Promo" },
  { href: "/ulasan", label: "Ulasan" },
  { href: "/galeri", label: "Galeri" },
  { href: "/tentang", label: "Tentang" },
  { href: "/lokasi", label: "Lokasi" },
  { href: "/kontak", label: "Kontak" },
];

export function SiteHeader({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-amber-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-amber-600 text-lg font-bold text-white">
            C
          </span>
          <span className="text-lg font-bold text-stone-800">Coto Ranukaya</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                pathname === n.href
                  ? "bg-amber-100 text-amber-800"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span
            className={`hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold sm:flex ${
              isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${isOpen ? "bg-green-500" : "bg-red-500"}`} />
            {isOpen ? "Buka" : "Tutup"}
          </span>
          <Link
            href="/keranjang"
            className="relative rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
          >
            Keranjang
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg p-2 text-stone-700 lg:hidden"
            aria-label="Buka menu navigasi"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-amber-100 bg-white px-4 py-2 lg:hidden">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                pathname === n.href ? "bg-amber-100 text-amber-800" : "text-stone-600"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
