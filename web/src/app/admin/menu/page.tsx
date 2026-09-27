import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getAdmin } from "@/lib/admin-guard";
import { MenusManager } from "./menus-manager";

export default async function AdminMenusPage() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  const [menus, categories] = await Promise.all([
    db.menu.findMany({ include: { category: true }, orderBy: { id: "asc" } }),
    db.category.findMany({ orderBy: { id: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-stone-800">Menu</h1>
      <p className="mt-1 text-stone-500">Tambah, ubah, nonaktifkan, dan hapus menu.</p>
      <MenusManager
        menus={menus.map((m) => ({
          id: m.id,
          name: m.name,
          description: m.description,
          price: m.price,
          image: m.image,
          isAvailable: m.isAvailable,
          categoryId: m.categoryId,
          categoryName: m.category.name,
        }))}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}
