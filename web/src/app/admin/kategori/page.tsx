import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getAdmin } from "@/lib/admin-guard";
import { CategoryManager } from "./category-manager";

export default async function AdminCategoriesPage() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  const categories = await db.category.findMany({
    orderBy: { id: "asc" },
    include: { _count: { select: { menus: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-stone-800">Kategori Menu</h1>
      <p className="mt-1 text-stone-500">Kelola pengelompokan menu.</p>
      <CategoryManager categories={categories.map((c) => ({ id: c.id, name: c.name, menuCount: c._count.menus }))} />
    </div>
  );
}
