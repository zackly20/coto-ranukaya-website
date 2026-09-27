import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdmin } from "@/lib/admin-guard";

// --- PROMOS ---
export async function GET() {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const promos = await db.promo.findMany({ orderBy: { id: "desc" } });
  return NextResponse.json({ promos });
}

export async function POST(req: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = (await req.json()) ?? {};
  const name = String(b.name ?? "").trim();
  const discountType = b.discountType === "fixed" ? "fixed" : "percent";
  const discountValue = Math.max(0, Math.round(Number(b.discountValue) || 0));
  if (!name || discountValue <= 0)
    return NextResponse.json({ error: "Nama & nilai diskon wajib." }, { status: 400 });
  const promo = await db.promo.create({
    data: {
      name: name.slice(0, 100),
      description: String(b.description ?? "").slice(0, 500),
      discountType,
      discountValue,
      status: "active",
    },
  });
  return NextResponse.json({ promo });
}

export async function PATCH(req: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = (await req.json()) ?? {};
  const id = Number(b.id);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
  const promo = await db.promo.update({
    where: { id },
    data: { status: b.status === "active" ? "active" : "inactive" },
  });
  return NextResponse.json({ promo });
}

export async function DELETE(req: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!Number.isFinite(id)) return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
  await db.promo.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
