import type { Metadata } from "next";
import Script from "next/script";
import { ChromeFooter, ChromeHeader } from "@/components/chrome/SiteChrome";
import {
  buyLabel,
  comingSoonLabel,
  formatPrice,
  gumroadScriptSrc,
  illustrations,
  shopNote,
  shopPage,
} from "@/content/shop";
import { siteName } from "@/content/site";
import "./shop.css";

export const metadata: Metadata = {
  title: `Shop — ${siteName}`,
  description: shopPage.standfirst,
};

/**
 * /shop — the studio's hand-drawn illustrations. Built on the shared chrome, in
 * the site's type registers.
 *
 * CHECKOUT IS GUMROAD, and it needs no client code of ours: the overlay script
 * (loaded once below) turns every link to a Gumroad product into a modal
 * checkout on this page, and Gumroad delivers the file. A piece with no Gumroad
 * URL yet shows a "Coming soon" tag instead of a live button.
 *
 * PLACEHOLDER PIECES with no cover art yet — the tiles are labelled stand-ins
 * until Poppy's illustrations and their Gumroad links arrive (content/shop.ts).
 */
export default function ShopPage() {
  return (
    <div className="shop mmc">
      {/* Gumroad's overlay — included once. Any link to a Gumroad product on this
          page then opens checkout in a modal rather than navigating away. */}
      <Script src={gumroadScriptSrc} strategy="afterInteractive" />

      <ChromeHeader current="/shop" />

      <main className="shop__main">
        <header className="shop__masthead">
          <p className="shop__mark">[ {shopPage.mark} ]</p>
          <h1 className="shop__title">{shopPage.title}</h1>
          <p className="shop__standfirst">{shopPage.standfirst}</p>
          <p className="shop__note">{shopNote}</p>
        </header>

        <ul className="shop__grid">
          {illustrations.map((piece) => (
            <li key={piece.slug} className="shop__card">
              {/* No cover art yet — a labelled placeholder tile stands in. */}
              <div className="shop__thumb" aria-hidden="true">
                <span className="shop__thumb-note">Artwork to come</span>
              </div>

              <div className="shop__card-body">
                <p className="shop__format">{piece.format}</p>
                <h2 className="shop__name">{piece.name}</h2>
                <p className="shop__blurb">{piece.blurb}</p>

                <div className="shop__card-foot">
                  <span className="shop__price">{formatPrice(piece.price)}</span>
                  {piece.gumroad ? (
                    <a
                      className="shop__buy"
                      href={piece.gumroad}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {buyLabel}
                    </a>
                  ) : (
                    <span className="shop__soon">{comingSoonLabel}</span>
                  )}
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
