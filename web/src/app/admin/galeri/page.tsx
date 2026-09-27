import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getAdmin } from "@/lib/admin-guard";
import { GalleryManager } from "./gallery-manager";

export default async function AdminGalleryPage() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  const gallery = await db.gallery.findMany({ orderBy: { id: "desc" } });
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-stone-800">Galeri</h1>
      <p className="mt-1 text-stone-500">Kelola foto yang tampil di halaman Galeri publik.</p>
      <GalleryManager items={gallery.map((g) => ({
        id: g.id,
        title: g.title,
        image: g.image,
        category: g.category,
      }))} />
    </div>
  );
}
