# Panduan Kontribusi

Terima kasih sudah ingin berkontribusi! 🎉 Proyek ini adalah website restoran open source (brand & data fiksi) yang dibuat sebagai portofolio dan template dasar untuk usaha kuliner.

## Cara Memulai

### 1. Fork & clone

```bash
git clone https://github.com/USERNAME/coto-ranukaya-website.git
cd coto-ranukaya-website/web
```

### 2. Install & setup

Cara cepat (satu perintah):

```bash
npm run setup
```

Atau manual:

```bash
npm install
cp .env.example .env      # lalu sesuaikan bila perlu
npm run images            # generate gambar SVG placeholder
npm run db:setup          # migrasi database + seed data awal
```

### 3. Jalankan

```bash
npm run dev               # http://localhost:3000
```

Akun admin default: `admin@cotoranukaya.com` / `admin123`

## Alur Kontribusi

1. Buat branch dari `main` dengan nama yang deskriptif:
   ```bash
   git checkout -b fitur/keranjang-qr
   ```
2. Pastikan semua pengecekan lulus sebelum push:
   ```bash
   npm run typecheck
   npm run lint
   npm run build
   ```
3. Commit dengan pesan yang jelas (bahasa Indonesia atau Inggris, konsisten satu bahasa per commit).
4. Push ke fork Anda dan buka **Pull Request** ke `main`.

## Gaya Kode

- **TypeScript ketat** — hindari `any`; manfaatkan tipe hasil Prisma.
- **Komponen server by default** — gunakan `"use client"` hanya bila perlu interaksi (state, event, browser API).
- **Data dari database** — informasi yang bisa berubah (nama, alamat, jam buka) wajib dibaca dari DB, bukan di-hardcode.
- **Validasi di server** — semua API memvalidasi input dan menghitung ulang data sensitif (harga) dari database.
- **Bahasa UI** — Indonesia; nama variabel & komentar dalam bahasa Inggris.
- **Warna & komponen** — ikuti palet amber/stone yang sudah ada; pecah UI jadi komponen kecil yang dapat dipakai ulang.

## Melaporkan Bug

Buka **Issue** dengan format:

- **Judul singkat** yang menjelaskan masalah
- **Langkah mereproduksi** (langkah demi langkah)
- **Perilaku yang diharapkan** vs **yang terjadi**
- **Lingkungan**: OS, versi Node, browser (jika terkait tampilan)

## Mengusulkan Fitur

Sebelum menulis kode besar, buka Issue dulu untuk didiskusikan — misalnya integrasi payment gateway, notifikasi WhatsApp, atau laporan penjualan (lihat daftar ide di README).

## Kode Etik

Dengan berpartisipasi, Anda menyetujui [Kode Etik](CODE_OF_CONDUCT.md) proyek ini.
