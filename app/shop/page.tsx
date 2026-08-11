import type { Metadata } from "next";
import { ChromeFooter, ChromeHeader } from "@/components/chrome/SiteChrome";
import { AddToCart } from "@/components/AddToCart";
import { formatPrice, products, shopNote, shopPage } from "@/content/shop";
import { siteName } from "@/content/site";
import "./shop.css";

export const metadata: Metadata = {
  title: `Shop — ${siteName}`,
  description: shopPage.standfirst,
};

/**
 * /shop — the studio's digital products (Poppy's illustration package for now).
 * Built on the shared chrome, in the site's type registers.
 *
 * Each card is static except its add-to-cart button (components/AddToCart.tsx),
 * which writes to the browser-side cart (lib/cart.ts). Checkout happens on the
 * cart page and hands off to Gumroad.
 *
 * PLACEHOLDER with no cover art yet — the tile is a labelled stand-in until the
 * real illustrations arrive (content/shop.ts).
 */
export default function ShopPage() {
  return (
    <div className="shop mmc">
      <ChromeHeader current="/shop" />

      <main className="shop__main">
        <header className="shop__masthead">
          <p className="shop__mark">[ {shopPage.mark} ]</p>
          <h1 className="shop__title">{shopPage.title}</h1>
          <p className="shop__standfirst">{shopPage.standfirst}</p>
          <p className="shop__note">{shopNote}</p>
        </header>

        <ul className="shop__grid">
          {products.map((product) => (
            <li key={product.slug} className="shop__card">
              {/* No cover art yet — a labelled placeholder tile stands in. */}
              <div className="shop__thumb" aria-hidden="true">
                <span className="shop__thumb-note">Artwork to come</span>
              </div>

              <div className="shop__card-body">
                <p className="shop__format">{product.format}</p>
                <h2 className="shop__name">{product.name}</h2>
                <p className="shop__blurb">{product.blurb}</p>

                <div className="shop__card-foot">
                  <span className="shop__price">{formatPrice(product.price)}</span>
                  <AddToCart slug={product.slug} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </main>

      <ChromeFooter />
    </div>
  );
}
