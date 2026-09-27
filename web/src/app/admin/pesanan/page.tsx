import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getAdmin } from "@/lib/admin-guard";
import { OrdersTable } from "./orders-table";

export default async function AdminOrdersPage() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  const orders = await db.order.findMany({
    orderBy: { id: "desc" },
    include: { items: { include: { menu: { select: { name: true } } } } },
    take: 100,
  });

  const data = orders.map((o) => ({
    id: o.id,
    orderCode: o.orderCode,
    customerName: o.customerName,
    phone: o.phone,
    orderType: o.orderType,
    address: o.address,
    tableNumber: o.tableNumber,
    pickupTime: o.pickupTime,
    total: o.total,
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus,
    orderStatus: o.orderStatus,
    createdAt: o.createdAt.toISOString(),
    items: o.items.map((i) => ({ name: i.menu.name, quantity: i.quantity, notes: i.notes, subtotal: i.subtotal })),
  }));

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-stone-800">Pesanan</h1>
      <p className="mt-1 text-stone-500">Kelola dan perbarui status pesanan pelanggan.</p>
      <OrdersTable orders={data} />
    </div>
  );
}
