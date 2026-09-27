import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Coto Ranukaya — Coto Khas Sulawesi Selatan",
    template: "%s",
  },
  description:
    "Coto Ranukaya: coto khas Sulawesi Selatan dengan kuah kacang otentik. Buka setiap hari 08.30–22.30. Makan di tempat, ambil di tepi jalan, dan antar tanpa bertemu.",
  keywords: [
    "Coto Ranukaya",
    "coto khas Sulawesi Selatan",
    "restoran coto",
    "coto Makassar",
  ],
  openGraph: {
    title: "Coto Ranukaya — Coto Khas Sulawesi Selatan",
    description:
      "Coto khas Sulawesi Selatan dengan kuah kacang otentik. Rating 4,8/5 dari 1.280 ulasan.",
    images: ["/images/gallery/hero.svg"],
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
