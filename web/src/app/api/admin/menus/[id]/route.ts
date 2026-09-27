import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdmin } from "@/lib/admin-guard";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const b = (await req.json()) ?? {};
  const data: Record<string, unknown> = {};
  if (b.name !== undefined) data.name = String(b.name).trim().slice(0, 100);
  if (b.description !== undefined) data.description = String(b.description).slice(0, 500);
  if (b.price !== undefined) {
    const p = Number(b.price);
    if (!Number.isFinite(p) || p < 0)
      return NextResponse.json({ error: "Harga tidak valid." }, { status: 400 });
    data.price = Math.round(p);
  }
  if (b.categoryId !== undefined) data.categoryId = Number(b.categoryId);
  if (b.image !== undefined) data.image = String(b.image).slice(0, 300);
  if (b.isAvailable !== undefined) data.isAvailable = Boolean(b.isAvailable);

  const menu = await db.menu.update({ where: { id: Number(id) }, data });
  return NextResponse.json({ menu });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  // Cek dulu apakah menu punya riwayat order_items
  const count = await db.orderItem.count({ where: { menuId: Number(id) } });
  if (count > 0) {
    // Jangan hapus; nonaktifkan saja agar riwayat pesanan tetap utuh
    await db.menu.update({ where: { id: Number(id) }, data: { isAvailable: false } });
    return NextResponse.json({
      ok: true,
      softDeleted: true,
      message: "Menu punya riwayat pesanan, jadi dinonaktifkan saja (tidak dihapus).",
    });
  }
  await db.menu.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true, softDeleted: false });
}
