import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdmin } from "@/lib/admin-guard";

// --- REVIEWS moderation ---
export async function GET() {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const reviews = await db.review.findMany({ orderBy: { id: "desc" } });
  return NextResponse.json({ reviews });
}

export async function PATCH(req: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = (await req.json()) ?? {};
  const id = Number(b.id);
  if (!Number.isFinite(id) || !["approved", "rejected", "pending"].includes(b.status))
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  const review = await db.review.update({ where: { id }, data: { status: b.status } });
  return NextResponse.json({ review });
}

export async function DELETE(req: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!Number.isFinite(id)) return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
  await db.review.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
