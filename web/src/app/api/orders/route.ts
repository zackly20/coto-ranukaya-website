import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customer_name: customerName,
      phone,
      order_type: orderType,
      address,
      table_number: tableNumber,
      pickup_time: pickupTime,
      notes,
      items,
      payment_method: paymentMethod,
    } = body ?? {};

    // --- Validation ---
    if (!customerName || typeof customerName !== "string" || !customerName.trim())
      return NextResponse.json({ error: "Nama wajib diisi." }, { status: 400 });
    if (!phone || typeof phone !== "string" || !/^[0-9+\-\s]{8,20}$/.test(phone))
      return NextResponse.json(
        { error: "Nomor WhatsApp tidak valid." },
        { status: 400 }
      );
    if (!["dine_in", "takeaway", "delivery"].includes(orderType))
      return NextResponse.json(
        { error: "Jenis pesanan tidak valid." },
        { status: 400 }
      );
    if (!Array.isArray(items) || items.length === 0)
      return NextResponse.json({ error: "Keranjang kosong." }, { status: 400 });
    if (orderType === "delivery" && (!address || String(address).trim().length < 5))
      return NextResponse.json(
        { error: "Alamat pengiriman wajib diisi." },
        { status: 400 }
      );
    if (!["cash", "transfer", "qris"].includes(paymentMethod))
      return NextResponse.json(
        { error: "Metode pembayaran tidak valid." },
        { status: 400 }
      );

    // --- Recalculate from DB (never trust client prices) ---
    const menuIds = items.map((i: { menu_id: number }) => Number(i.menu_id));
    const menusFromDb = await db.menu.findMany({
      where: { id: { in: menuIds }, isAvailable: true },
    });
    if (menusFromDb.length !== new Set(menuIds).size)
      return NextResponse.json(
        { error: "Ada menu yang tidak tersedia." },
        { status: 400 }
      );

    let total = 0;
    const orderItems = items.map((i: { menu_id: number; quantity: number; notes?: string }) => {
      const menu = menusFromDb.find((m) => m.id === Number(i.menu_id))!;
      const qty = Math.max(1, Math.min(99, Number(i.quantity) || 1));
      const subtotal = menu.price * qty;
      total += subtotal;
      return {
        menuId: menu.id,
        quantity: qty,
        price: menu.price,
        notes: String(i.notes ?? "").slice(0, 300),
        subtotal,
      };
    });

    // --- Order code: CR-YYMMDD-XXXX (Coto Ranukaya) ---
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const rand = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `CR-${yy}${mm}${dd}-${rand}`;

    const order = await db.order.create({
      data: {
        orderCode,
        customerName: customerName.trim().slice(0, 100),
        phone: phone.trim(),
        orderType,
        address: address ? String(address).slice(0, 300) : null,
        tableNumber: tableNumber ? String(tableNumber).slice(0, 10) : null,
        pickupTime: pickupTime ? String(pickupTime).slice(0, 30) : null,
        total,
        paymentMethod,
        orderStatus: "received",
        // @ts-expect-error notes kolom level order tidak ada di DB; catatan per item di order_items
        notes,
        items: { create: orderItems },
      },
    });

    return NextResponse.json({ order_code: order.orderCode, id: order.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
