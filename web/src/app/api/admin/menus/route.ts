import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdmin } from "@/lib/admin-guard";

export async function GET() {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const menus = await db.menu.findMany({
    include: { category: true },
    orderBy: { id: "asc" },
  });
  return NextResponse.json({ menus });
}

export async function POST(req: Request) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const b = (await req.json()) ?? {};
  const name = String(b.name ?? "").trim();
  const price = Number(b.price);
  const categoryId = Number(b.categoryId);
  if (!name || !Number.isFinite(price) || price < 0 || !Number.isFinite(categoryId))
    return NextResponse.json({ error: "Data tidak lengkap." }, { status: 400 });

  const menu = await db.menu.create({
    data: {
      name: name.slice(0, 100),
      description: String(b.description ?? "").slice(0, 500),
      price: Math.round(price),
      categoryId,
      image: String(b.image ?? "").slice(0, 300),
      isAvailable: b.isAvailable !== false,
    },
  });
  return NextResponse.json({ menu });
}
