import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdmin } from "@/lib/admin-guard";

export async function PATCH(req: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const b = (await req.json()) ?? {};

  // --- Info restoran ---
  if (b.settings) {
    const s = b.settings;
    const current = await db.restaurantSettings.findFirst();
    const data = {
      name: String(s.name ?? current?.name ?? "").slice(0, 100),
      address: String(s.address ?? current?.address ?? "").slice(0, 300),
      phone: String(s.phone ?? current?.phone ?? "").slice(0, 30),
      whatsapp: String(s.whatsapp ?? current?.whatsapp ?? "").replace(/[^0-9]/g, "").slice(0, 20),
      mapsUrl: String(s.mapsUrl ?? current?.mapsUrl ?? "").slice(0, 500),
      plusCode: String(s.plusCode ?? current?.plusCode ?? "").slice(0, 120),
      description: String(s.description ?? current?.description ?? "").slice(0, 1000),
      priceRange: String(s.priceRange ?? current?.priceRange ?? "").slice(0, 100),
    };
    if (current) await db.restaurantSettings.update({ where: { id: current.id }, data });
    else await db.restaurantSettings.create({ data });
  }

  // --- Jam operasional: array [{day, openTime, closeTime, isOpen}] ---
  if (Array.isArray(b.hours)) {
    for (const h of b.hours) {
      const day = Number(h.day);
      if (!Number.isInteger(day) || day < 0 || day > 6) continue;
      const openTime = /^\d{2}:\d{2}$/.test(String(h.openTime)) ? String(h.openTime) : "08:30";
      const closeTime = /^\d{2}:\d{2}$/.test(String(h.closeTime)) ? String(h.closeTime) : "22:30";
      await db.operatingHour.upsert({
        where: { day },
        update: { openTime, closeTime, isOpen: Boolean(h.isOpen) },
        create: { day, openTime, closeTime, isOpen: Boolean(h.isOpen) },
      });
    }
  }

  return NextResponse.json({ ok: true });
}
