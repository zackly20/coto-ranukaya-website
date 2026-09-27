import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdmin } from "@/lib/admin-guard";

const ALLOWED = ["received", "confirmed", "processing", "ready", "delivering", "done", "cancelled"];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { order_status: orderStatus, payment_status: paymentStatus } = (await req.json()) ?? {};

  const data: { orderStatus?: string; paymentStatus?: string } = {};
  if (orderStatus) {
    if (!ALLOWED.includes(orderStatus))
      return NextResponse.json({ error: "Status tidak valid." }, { status: 400 });
    data.orderStatus = orderStatus;
  }
  if (paymentStatus) {
    if (!["unpaid", "paid"].includes(paymentStatus))
      return NextResponse.json({ error: "Status pembayaran tidak valid." }, { status: 400 });
    data.paymentStatus = paymentStatus;
  }
  if (Object.keys(data).length === 0)
    return NextResponse.json({ error: "Tidak ada perubahan." }, { status: 400 });

  const updated = await db.order.update({
    where: { id: Number(id) },
    data,
  });
  return NextResponse.json({ ok: true, order: updated });
}
