import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const b = (await req.json()) ?? {};
  const customerName = String(b.customerName ?? "").trim();
  const comment = String(b.comment ?? "").trim();
  const rating = Math.min(5, Math.max(1, Math.round(Number(b.rating) || 0)));

  if (!customerName || !comment || rating < 1)
    return NextResponse.json({ error: "Data tidak lengkap." }, { status: 400 });

  await db.review.create({
    data: {
      customerName: customerName.slice(0, 80),
      comment: comment.slice(0, 500),
      rating,
      status: "pending",
    },
  });
  return NextResponse.json({ ok: true });
}
