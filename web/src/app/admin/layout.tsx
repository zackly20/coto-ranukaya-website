import type { ReactNode } from "react";
import { getAdmin } from "@/lib/admin-guard";
import { AdminSidebar } from "@/components/admin-sidebar";
import { redirect } from "next/navigation";

export const metadata = { title: "Admin — Coto Ranukaya" };

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await getAdmin();

  // /admin/login menangani dirinya sendiri (lihat struktur route)
  return (
    <div className="flex min-h-screen bg-stone-100">
      {admin ? (
        <>
          <AdminSidebar adminName={admin.name} />
          <main className="flex-1 p-4 sm:p-8">{children}</main>
        </>
      ) : (
        <div className="grid w-full place-items-center">{children}</div>
      )}
    </div>
  );
}
