import type { Metadata } from "next";
import Script from "next/script";
import { ChromeFooter, ChromeHeader } from "@/components/chrome/SiteChrome";
import { CartView } from "@/components/CartView";
import { cartPage, gumroadScriptSrc } from "@/content/shop";
import { siteName } from "@/content/site";
import "./cart.css";

export const metadata: Metadata = {
  title: `Cart — ${siteName}`,
  description: "Your selected digital products from the MaeMüllen shop.",
};

/**
 * /cart — the browser-side cart. This page owns the metadata and chrome; the
 * contents are a client island (components/CartView.tsx) because the cart lives
 * in localStorage.
 *
 * Checkout hands off to Gumroad. Gumroad's overlay script (loaded once below)
 * turns the Checkout link into a payment modal on this page; Gumroad takes the
 * payment and delivers the files. Until a product is connected on Gumroad, the
 * view explains that instead of opening a dead link.
 */
export default function CartPage() {
  return (
    <div className="cart mmc">
      <Script src={gumroadScriptSrc} strategy="afterInteractive" />

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
