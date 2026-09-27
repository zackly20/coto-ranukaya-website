# 🍲 Coto Ranukaya — Website Restoran Open Source

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)

Website pemesanan restoran lengkap (customer + dashboard admin) — **open source** dengan brand & data fiksi, siap dipakai sebagai portofolio maupun template dasar untuk usaha kuliner.

> **Catatan:** "Coto Ranukaya" adalah brand fiksi. Semua data bisnis (alamat, telepon, rating, ulasan) adalah dummy dan tidak terafiliasi dengan bisnis manapun.

## ✨ Fitur

### Untuk Pelanggan
- 🏠 **Homepage** — hero, layanan, menu andalan, promo, ulasan
- 🍜 **Menu & Detail Menu** — dikelompokkan per kategori, status tersedia/habis
- 🛒 **Keranjang** — ubah jumlah, catatan per item, subtotal otomatis
- 📦 **Checkout** — nama & WhatsApp + 3 jenis pesanan:
  - Makan di tempat (nomor meja)
  - Ambil di tepi jalan (waktu pengambilan)
  - Antar tanpa bertemu (alamat)
- 💰 **Metode bayar** — Bayar di tempat, Transfer, QRIS
- 🔎 **Status pesanan** — lacak dengan nomor pesanan, timeline real-time (polling)
- ⭐ **Ulasan** — tulis ulasan (moderasi admin sebelum tampil)
- 🖼️ **Galeri, Promo, Tentang, Lokasi, Kontak** (WhatsApp & telepon)
- 🟢 **Status Buka/Tutup** dihitung otomatis dari jam operasional di database

### Untuk Admin (`/admin`)
- 📊 Dashboard ringkasan (omzet hari ini, pesanan aktif)
- 🧾 Manajemen pesanan — ubah status, tandai lunas, detail item
- 🍜 CRUD Menu & Kategori
- 🏷️ Manajemen promo (aktif/nonaktif)
- ⭐ Moderasi ulasan
- 🖼️ Manajemen galeri
- ⚙️ Pengaturan informasi restoran & jam operasional 7 hari

## 🚀 Memulai

**Prasyarat:** Node.js ≥ 20 dan npm.

```bash
# 1. Clone
git clone https://github.com/USERNAME/coto-ranukaya-website.git
cd coto-ranukaya-website/web   # semua kode ada di folder web/

# 2. Setup sekali jalan (install + gambar + database + seed)
npm run setup

# 3. Jalankan
npm run dev
```

Buka **http://localhost:3000** — dashboard admin di **/admin**.

| Akun | Nilai default |
|---|---|
| Email admin | `admin@cotoranukaya.com` |
| Password | `admin123` |

> ⚠️ Ganti kredensial default sebelum dipakai sungguhan (`prisma/seed.ts` + `AUTH_SECRET` di `.env`).

### Perintah yang tersedia

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Build & produksi |
| `npm run typecheck` | Cek TypeScript |
| `npm run lint` | ESLint |
| `npm run db:setup` | Migrasi + seed database |
| `npm run db:studio` | Prisma Studio (lihat data) |
| `npm run images` | Regenerate gambar SVG placeholder |

## 🛠️ Tech Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** — UI mobile-first, warm & food-focused
- **Prisma + SQLite** — mudah dijalankan di mana saja; migrasi ke PostgreSQL hanya dengan ganti `datasource`
- **Autentikasi admin** — bcrypt + JWT httpOnly cookie (`jose`)

## 📁 Struktur

```
web/
├── prisma/
│   ├── schema.prisma        # 10 model: users, menus, orders, dst.
│   ├── seed.ts              # data awal (menu, promo, ulasan, admin)
│   └── migrations/
├── public/images/           # ilustrasi SVG placeholder
├── scripts/gen-images.js    # generator gambar placeholder
└── src/
    ├── app/
    │   ├── (customer)/      # 12 halaman publik
    │   ├── admin/           # dashboard (dilindungi login)
    │   └── api/             # REST API + guard admin
    ├── components/
    └── lib/                 # db, auth, settings, format
```

## 🔒 Keamanan

- Password di-hash (bcrypt), sesi JWT httpOnly cookie
- Semua API admin diverifikasi server-side (401 tanpa sesi)
- Harga pesanan dihitung ulang di server (tidak percaya klien)
- Query parameterized via Prisma (anti SQL injection), output di-escape React (anti XSS)
- Validasi & pembatasan panjang input di semua endpoint

## 🗺️ Roadmap / Ide Kontribusi

Mudah memulai (good first issue):
- [ ] Upload gambar asli dari dashboard admin
- [ ] Notifikasi WhatsApp saat status pesanan berubah
- [ ] Riwayat pesanan by nomor WhatsApp

Menengah:
- [ ] Integrasi payment gateway (Midtrans/Xendit)
- [ ] Laporan penjualan + grafik di dashboard
- [ ] Voucher & paket makanan

Lanjutan:
- [ ] Akun pelanggan + loyalty point
- [ ] Multi-cabang, PWA

## 📋 Latar Belakang

Proyek ini diimplementasikan dari sebuah PRD (Product Requirements Document) website restoran yang bersifat privat — brand dalam website di-fiksikan menjadi "Coto Ranukaya" agar tidak terafiliasi dengan bisnis manapun.

## 🤝 Kontribusi

Kontribusi sangat welcome! Lihat [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduan setup dan alur pull request. Harap patuhi [Kode Etik](CODE_OF_CONDUCT.md).

## 📄 Lisensi

Didistribusikan under [MIT License](LICENSE) — bebas digunakan untuk proyek pribadi maupun komersial.
