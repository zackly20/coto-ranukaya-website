import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdmin } from "@/lib/admin-guard";

export async function GET() {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const categories = await db.category.findMany({
    orderBy: { id: "asc" },
    include: { _count: { select: { menus: true } } },
  });
  return NextResponse.json({ categories });
}

export async function POST(req: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = (await req.json()) ?? {};
  const name = String(b.name ?? "").trim();
  if (!name) return NextResponse.json({ error: "Nama kategori wajib." }, { status: 400 });
  const category = await db.category.create({ data: { name: name.slice(0, 60) } });
  return NextResponse.json({ category });
}

export async function PATCH(req: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = (await req.json()) ?? {};
  const id = Number(b.id);
  const name = String(b.name ?? "").trim();
  if (!Number.isFinite(id) || !name)
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  const category = await db.category.update({ where: { id }, data: { name: name.slice(0, 60) } });
  return NextResponse.json({ category });
}

export async function DELETE(req: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!Number.isFinite(id))
    return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
  const menuCount = await db.menu.count({ where: { categoryId: id } });
  if (menuCount > 0)
    return NextResponse.json(
      { error: "Kategori masih berisi menu. Pindahkan/hapus menunya dulu." },
      { status: 400 }
    );
  await db.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
