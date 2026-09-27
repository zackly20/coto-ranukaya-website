import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const order = await db.order.findUnique({
    where: { orderCode: code },
    include: {
      items: {
        include: { menu: { select: { name: true } } },
      },
    },
  });
  if (!order)
    return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });

  return NextResponse.json({
    order_code: order.orderCode,
    customer_name: order.customerName,
    order_type: order.orderType,
    total: order.total,
    order_status: order.orderStatus,
    payment_method: order.paymentMethod,
    payment_status: order.paymentStatus,
    created_at: order.createdAt,
    items: order.items.map((i) => ({
      name: i.menu.name,
      quantity: i.quantity,
      subtotal: i.subtotal,
      notes: i.notes,
    })),
  });
}
