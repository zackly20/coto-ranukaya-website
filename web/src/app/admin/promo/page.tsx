import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getAdmin } from "@/lib/admin-guard";
import { PromoManager } from "./promo-manager";

export default async function AdminPromoPage() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  const promos = await db.promo.findMany({ orderBy: { id: "desc" } });
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-stone-800">Promo</h1>
      <p className="mt-1 text-stone-500">Kelola promo yang tampil di halaman publik.</p>
      <PromoManager promos={promos.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        discountType: p.discountType,
        discountValue: p.discountValue,
        status: p.status,
      }))} />
    </div>
  );
}
