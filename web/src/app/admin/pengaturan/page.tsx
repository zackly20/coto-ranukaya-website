import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getAdmin } from "@/lib/admin-guard";
import { getSettings } from "@/lib/settings";
import { SettingsForm } from "./settings-form";

export default async function AdminSettingsPage() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  const [settings, hours] = await Promise.all([
    getSettings(),
    db.operatingHour.findMany({ orderBy: { day: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-stone-800">Pengaturan Restoran</h1>
      <p className="mt-1 text-stone-500">Informasi yang tampil di seluruh website.</p>
      <SettingsForm
        settings={{
          name: settings.name,
          address: settings.address,
          phone: settings.phone,
          whatsapp: settings.whatsapp,
          mapsUrl: settings.mapsUrl,
          plusCode: settings.plusCode,
          description: settings.description,
          priceRange: settings.priceRange,
        }}
        hours={hours.map((h) => ({ day: h.day, openTime: h.openTime, closeTime: h.closeTime, isOpen: h.isOpen }))}
      />
    </div>
  );
}
