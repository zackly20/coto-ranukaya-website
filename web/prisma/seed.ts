import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // --- Admin user ---
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@cotoranukaya.com" },
    update: {},
    create: {
      name: "Admin Coto Ranukaya",
      email: "admin@cotoranukaya.com",
      password: passwordHash,
      role: "admin",
    },
  });

  // --- Categories ---
  const catNames = ["Coto", "Minuman", "Camilan"];
  const cats: Record<string, number> = {};
  for (const name of catNames) {
    const existing = await prisma.category.findFirst({ where: { name } });
    if (existing) {
      cats[name] = existing.id;
    } else {
      const c = await prisma.category.create({ data: { name } });
      cats[name] = c.id;
    }
  }

  // --- Menus ---
  const menus = [
    {
      category: "Coto",
      name: "Coto Ranukaya",
      price: 25000,
      description:
        "Coto Ranukaya asli dengan kuah kacang gurih khas Sulawesi Selatan, isi daging sapi dan jeroan pilihan. Disajikan dengan buras dan sambal tauco.",
      image: "/images/menu/coto-ranukaya.svg",
    },
    {
      category: "Coto",
      name: "Coto Campur",
      price: 28000,
      description:
        "Campuran daging sapi, jeroan, dan perasan limau. Kuah kaldu kacang yang kental dan aromatik, favorit pelanggan kami.",
      image: "/images/menu/coto-campur.svg",
    },
    {
      category: "Coto",
      name: "Coto Ranukaya Spesial",
      price: 32000,
      description:
        "Coto Ranukaya dengan tambahan tirikan daging melimpah dan telur rebus. Porsi paling ramai untuk yang berani lapar besar.",
      image: "/images/menu/coto-ranukaya-spesial.svg",
    },
    {
      category: "Coto",
      name: "Coto Daging Saja",
      price: 30000,
      description:
        "Coto dengan irisan daging sapi pilihan tanpa jeroan, cocok untuk yang ingin rasa lebih ringan.",
      image: "/images/menu/coto-daging.svg",
    },
    {
      category: "Minuman",
      name: "Es Teh Manis",
      price: 5000,
      description: "Teh manis dingin segar, pendamping setia coto.",
      image: "/images/menu/es-teh.svg",
    },
    {
      category: "Minuman",
      name: "Es Jeruk",
      price: 6000,
      description: "Perasan jeruk peras asli, dingin dan menyegarkan.",
      image: "/images/menu/es-jeruk.svg",
    },
    {
      category: "Camilan",
      name: "Pisang Ijo",
      price: 12000,
      description:
        "Pisang ijo khas Makassar dengan kuah santan dan sirup merah, pencuci mulut legendaris.",
      image: "/images/menu/pisang-ijo.svg",
    },
    {
      category: "Camilan",
      name: "Buras",
      price: 8000,
      description:
        "Buras (ketan) pulen wajib teman makan coto, dibungkus daun pisang.",
      image: "/images/menu/buras.svg",
    },
  ];

  for (const m of menus) {
    const existing = await prisma.menu.findFirst({ where: { name: m.name } });
    if (existing) {
      await prisma.menu.update({
        where: { id: existing.id },
        data: {
          categoryId: cats[m.category],
          description: m.description,
          price: m.price,
          image: m.image,
        },
      });
    } else {
      await prisma.menu.create({
        data: {
          categoryId: cats[m.category],
          name: m.name,
          description: m.description,
          price: m.price,
          image: m.image,
        },
      });
    }
  }

  // --- Restaurant settings ---
  const existingSettings = await prisma.restaurantSettings.findFirst();
  const settingsData = {
    name: "Coto Ranukaya",
    address: "Jl. Contoh Alamat No. 123, Kel. Fiksi, Kec. Portofolio, Kota Demo",
    phone: "0812-0000-0000",
    whatsapp: "628120000000",
    mapsUrl: "",
    plusCode: "",
    description:
      "Restoran Coto Ranukaya menyajikan coto khas Sulawesi Selatan. Buka setiap hari 08.30–22.30.",
    priceRange: "Rp25.000–Rp50.000 per orang",
  };
  if (existingSettings) {
    await prisma.restaurantSettings.update({ where: { id: existingSettings.id }, data: settingsData });
  } else {
    await prisma.restaurantSettings.create({ data: settingsData });
  }

  // --- Operating hours (0 = Minggu ... 6 = Sabtu) ---
  for (let day = 0; day < 7; day++) {
    await prisma.operatingHour.upsert({
      where: { day },
      update: { openTime: "08:30", closeTime: "22:30", isOpen: true },
      create: { day, openTime: "08:30", closeTime: "22:30", isOpen: true },
    });
  }

  // --- Promos (P1) ---
  for (const promo of [
    {
      name: "Hemat Senin",
    description:
      "Diskon 15% untuk semua menu Coto setiap hari Senin, pukul 08.30–15.00.",
    discountType: "percent",
    discountValue: 15,
    status: "active",
  },
  {
    name: "Gratis Es Teh",
    description:
      "Pembelian Coto Ranukaya + Coto Campur gratis 1 Es Teh Manis. Hanya makan di tempat.",
    discountType: "fixed",
    discountValue: 5000,
    status: "active",
  },
]) {
    const existing = await prisma.promo.findFirst({ where: { name: promo.name } });
    if (!existing) await prisma.promo.create({ data: promo });
  }

  // --- Reviews (P1) ---
  const existingReviews = await prisma.review.count();
  if (existingReviews === 0) {
    await prisma.review.createMany({
      data: [
        {
          customerName: "Andi R.",
          rating: 5,
          comment:
            "Kuah kacangnya otentik banget, paling suka Coto Campur. Burasnya juga pulen.",
          status: "approved",
        },
        {
          customerName: "Maria T.",
          rating: 5,
          comment:
            "Rasa coto-nya mirip yang di Makassar. Pisang ijo-nya wajib coba!",
          status: "approved",
        },
        {
          customerName: "Jefry K.",
          rating: 4,
          comment: "Porsi pas, harga bersahabat, pelayanan cepat.",
          status: "approved",
        },
      ],
    });
  }

  // --- Gallery (P1) ---
  const gallery = [
    { title: "Coto Ranukaya", image: "/images/gallery/g1.svg", category: "makanan" },
    { title: "Coto Campur", image: "/images/gallery/g2.svg", category: "makanan" },
    { title: "Pisang Ijo", image: "/images/gallery/g3.svg", category: "makanan" },
    { title: "Suasana Restoran", image: "/images/gallery/g4.svg", category: "suasana" },
    { title: "Area Makan", image: "/images/gallery/g5.svg", category: "restoran" },
    { title: "Es Teh & Es Jeruk", image: "/images/gallery/g6.svg", category: "minuman" },
  ];
  for (const g of gallery) {
    const existing = await prisma.gallery.findFirst({ where: { title: g.title } });
    if (!existing) await prisma.gallery.create({ data: g });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
