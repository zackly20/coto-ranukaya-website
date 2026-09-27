import type { ReactNode } from "react";
import { CartProvider } from "@/components/cart-context";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getSettings, getOpenStatus } from "@/lib/settings";

export default async function CustomerLayout({ children }: { children: ReactNode }) {
  const [settings, status] = await Promise.all([getSettings(), getOpenStatus()]);

  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col bg-stone-50 text-stone-800">
        <SiteHeader isOpen={status.isOpen} />
        <main className="flex-1">{children}</main>
        <SiteFooter settings={settings} />
      </div>
    </CartProvider>
  );
}
