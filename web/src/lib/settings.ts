import { db } from "@/lib/db";

/** Business info from DB with safe fallbacks (PRD: info yang sering berubah disimpan di database). */
export async function getSettings() {
  const s = await db.restaurantSettings.findFirst();
  return (
    s ?? {
      id: 0,
      name: "Coto Ranukaya",
      address: "Jl. Contoh Alamat No. 123, Kel. Fiksi, Kec. Portofolio, Kota Demo",
      phone: "0812-0000-0000",
      whatsapp: "628120000000",
      mapsUrl: "",
      plusCode: "",
      description: "Restoran Coto Ranukaya — coto khas Sulawesi Selatan.",
      priceRange: "Rp25.000–Rp50.000 per orang",
    }
  );
}

export async function getOpenStatus(): Promise<{ isOpen: boolean; label: string }> {
  const now = new Date();
  const day = now.getDay(); // 0 = Minggu
  const minutes = now.getHours() * 60 + now.getMinutes();

  const oh = await db.operatingHour.findUnique({ where: { day } });
  if (!oh || !oh.isOpen) return { isOpen: false, label: "Tutup" };

  const [oh_, om] = oh.openTime.split(":").map(Number);
  const [ch, cm] = oh.closeTime.split(":").map(Number);
  const openMins = oh_ * 60 + om;
  const closeMins = ch * 60 + cm;

  const isOpen = minutes >= openMins && minutes < closeMins;
  return { isOpen, label: isOpen ? "Buka" : "Tutup" };
}
