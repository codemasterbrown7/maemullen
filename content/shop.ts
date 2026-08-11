/**
 * /shop content — the studio sells Poppy's hand-drawn illustrations. Kept
 * deliberately small so the site can go live fast (asked for 2026-08-09); the
 * templates and toolkits come later.
 *
 * CHECKOUT IS GUMROAD. Each piece links to its own Gumroad product; Gumroad
 * hosts the payment overlay and delivers the file, so there is nothing to run on
 * our side (the site is a static export). To take a piece live: create it as a
 * product on Gumroad, then paste its URL into `gumroad` below. Until a piece has
 * a URL it shows as "Coming soon" rather than a dead buy button.
 *
 * PLACEHOLDER PIECES. Names, prices and cover art are stand-ins until Poppy's
 * real illustrations and their Gumroad links arrive; `shopNote` says so on the
 * page. Prices are whole pounds.
 */

export type Illustration = {
  slug: string;
  name: string;
  /** A short line under the name — what the buyer receives. */
  format: string;
  blurb: string;
  /** Whole pounds. */
  price: number;
  /**
   * The piece's Gumroad product URL, e.g.
   * "https://maemullen.gumroad.com/l/your-permalink". Empty until the product
   * exists on Gumroad — an empty string renders "Coming soon".
   */
  gumroad: string;
};

export const currency = "£";

/** Format a whole-pound price. */
export function formatPrice(price: number): string {
  return `${currency}${price}`;
}

/**
 * Gumroad's overlay script, included once on the shop page. With it loaded, any
 * link to a Gumroad product opens the checkout in a modal on our own page.
 */
export const gumroadScriptSrc = "https://gumroad.com/js/gumroad.js";

/**
 * One product for now — the illustration package, a stand-in the studio fills
 * with Poppy's hand-drawn pieces. More products follow later.
 */
export const illustrations: Illustration[] = [
  {
    slug: "illustration-package",
    name: "Illustration Package",
    format: "Digital download",
    blurb:
      "A set of the studio's hand-drawn illustrations, delivered as print-ready files. Pieces added as they're released.",
    price: 30,
    gumroad: "",
  },
];

export const shopPage = {
  mark: "The shop",
  title: "Shop",
  standfirst:
    "Hand-drawn illustrations from the studio, bought and delivered securely through Gumroad — with more to come.",
};

/** Shown once under the masthead: the product is a stand-in. */
export const shopNote = "Placeholder — illustrations, prices and covers on their way.";

/** The label on a piece that has no Gumroad link yet. */
export const comingSoonLabel = "Coming soon";
export const buyLabel = "Buy";
