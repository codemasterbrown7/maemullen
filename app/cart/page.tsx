import type { Metadata } from "next";
import { ChromeFooter, ChromeHeader } from "@/components/chrome/SiteChrome";
import { CartView } from "@/components/CartView";
import { cartPage } from "@/content/shop";
import { siteName } from "@/content/site";
import "./cart.css";

export const metadata: Metadata = {
  title: `Cart — ${siteName}`,
  description: "Your selected digital products from the MaeMüllen shop.",
};

/**
 * /cart — the browser-side cart. This page owns the metadata and chrome; the
 * contents are a client island (components/CartView.tsx) because the cart lives
 * in localStorage. Checkout is not connected to a payment provider yet — the
 * view says so instead of taking a payment.
 */
export default function CartPage() {
  return (
    <div className="cart mmc">
      <ChromeHeader current="/cart" />

      <main className="cart__main">
        <header className="cart__masthead">
          <p className="cart__mark">[ {cartPage.mark} ]</p>
          <h1 className="cart__title">{cartPage.title}</h1>
        </header>

        <CartView />
      </main>

      <ChromeFooter />
    </div>
  );
}
