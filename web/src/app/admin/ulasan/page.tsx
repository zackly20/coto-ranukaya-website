import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getAdmin } from "@/lib/admin-guard";
import { ReviewsManager } from "./reviews-manager";

export default async function AdminReviewsPage() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  const reviews = await db.review.findMany({ orderBy: { id: "desc" } });
  return (
    <div>
      <h1 className="text-2xl font-extrabold text-stone-800">Moderasi Ulasan</h1>
      <p className="mt-1 text-stone-500">Setujui atau tolak ulasan pelanggan sebelum tampil publik.</p>
      <ReviewsManager reviews={reviews.map((r) => ({
        id: r.id,
        customerName: r.customerName,
        rating: r.rating,
        comment: r.comment,
        status: r.status,
        createdAt: r.createdAt.toISOString(),
      }))} />
    </div>
  );
}
