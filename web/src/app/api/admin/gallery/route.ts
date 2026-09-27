import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdmin } from "@/lib/admin-guard";

// --- GALLERY ---
export async function GET() {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const gallery = await db.gallery.findMany({ orderBy: { id: "desc" } });
  return NextResponse.json({ gallery });
}

export async function POST(req: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = (await req.json()) ?? {};
  const title = String(b.title ?? "").trim();
  const image = String(b.image ?? "").trim();
  if (!title || !image)
    return NextResponse.json({ error: "Judul & gambar wajib." }, { status: 400 });
  const cats = ["makanan", "minuman", "suasana", "restoran"];
  const category = cats.includes(b.category) ? b.category : "makanan";
  const item = await db.gallery.create({
    data: { title: title.slice(0, 100), image: image.slice(0, 300), category },
  });
  return NextResponse.json({ item });
}

export async function DELETE(req: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!Number.isFinite(id)) return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
  await db.gallery.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
