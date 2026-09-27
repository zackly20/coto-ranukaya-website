import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getAdmin } from "@/lib/admin-guard";
import { formatIDR } from "@/lib/format";

export default async function AdminDashboardPage() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [ordersToday, allOrders, menus, pendingReviews] = await Promise.all([
    db.order.findMany({ where: { createdAt: { gte: startOfDay } }, orderBy: { id: "desc" } }),
    db.order.findMany({ orderBy: { id: "desc" }, take: 8 }),
    db.menu.count(),
    db.review.count({ where: { status: "pending" } }),
  ]);

  const revenueToday = ordersToday
    .filter((o) => o.orderStatus !== "cancelled")
    .reduce((s, o) => s + o.total, 0);
  const activeOrders = allOrders.filter((o) => !["done", "cancelled"].includes(o.orderStatus)).length;

  const STATUS_LABEL: Record<string, string> = {
    received: "Diterima",
    confirmed: "Dikonfirmasi",
    processing: "Diproses",
    ready: "Siap",
    delivering: "Diantar",
    done: "Selesai",
    cancelled: "Batal",
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-stone-800">Dashboard</h1>
      <p className="mt-1 text-stone-500">Ringkasan hari ini, {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Pesanan Hari Ini", value: String(ordersToday.length), icon: "🧾", color: "bg-blue-50 text-blue-700" },
          { label: "Omzet Hari Ini", value: formatIDR(revenueToday), icon: "💰", color: "bg-green-50 text-green-700" },
          { label: "Pesanan Aktif", value: String(activeOrders), icon: "⏳", color: "bg-amber-50 text-amber-700" },
          { label: "Ulasan Menunggu", value: String(pendingReviews), icon: "⭐", color: "bg-purple-50 text-purple-700" },
        ].map((c) => (
          <div key={c.label} className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className={`inline-grid h-10 w-10 place-items-center rounded-xl text-lg ${c.color}`}>{c.icon}</div>
            <p className="mt-3 text-sm text-stone-500">{c.label}</p>
            <p className="text-2xl font-extrabold text-stone-800">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Pesanan terbaru */}
        <div className="rounded-2xl border border-stone-200 bg-white p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-stone-800">Pesanan Terbaru</h2>
            <Link href="/admin/pesanan" className="text-sm font-semibold text-amber-700 hover:underline">
              Semua pesanan →
            </Link>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-100 text-xs uppercase text-stone-400">
                  <th className="pb-2 pr-3">Kode</th>
                  <th className="pb-2 pr-3">Pelanggan</th>
                  <th className="pb-2 pr-3">Total</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {allOrders.map((o) => (
                  <tr key={o.id} className="border-b border-stone-50 last:border-0">
                    <td className="py-2.5 pr-3 font-mono text-xs">{o.orderCode}</td>
                    <td className="py-2.5 pr-3">{o.customerName}</td>
                    <td className="py-2.5 pr-3 font-semibold">{formatIDR(o.total)}</td>
                    <td className="py-2.5">
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-600">
                        {STATUS_LABEL[o.orderStatus] ?? o.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {allOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-stone-400">
                      Belum ada pesanan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick stats */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <h2 className="font-bold text-stone-800">Menu Terdaftar</h2>
            <p className="mt-2 text-3xl font-extrabold text-amber-700">{menus}</p>
            <Link href="/admin/menu" className="mt-2 inline-block text-sm font-semibold text-amber-700 hover:underline">
              Kelola menu →
            </Link>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <h2 className="font-bold text-stone-800">Jumlah Total Pesanan</h2>
            <p className="mt-2 text-3xl font-extrabold text-amber-700">{allOrders.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
