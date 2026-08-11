/**
 * /shop content — the studio sells Poppy's hand-drawn illustrations. Kept
 * deliberately small so the site can go live fast; more products follow later.
 *
 * THE FLOW. Add to cart on the shop → the cart (browser-side, lib/cart.ts) →
 * Checkout hands off to GUMROAD, which takes the payment and delivers the files.
 * The site is a static export, so there is nothing to run on our side.
 *
 * TO SWITCH CHECKOUT ON. Create the product on Gumroad, then paste its product
 * URL into `gumroad` below. While it is empty, the cart's Checkout explains that
 * payment isn't connected yet instead of opening a dead link.
 *
 * PLACEHOLDER PIECE. Name, price and cover art are stand-ins until Poppy's real
 * illustrations arrive; `shopNote` says so on the page.
 */

export type Product = {
  slug: string;
  name: string;
  /** A short line under the name — what the buyer receives. */
  format: string;
  blurb: string;
  /** Whole pounds. */
  price: number;
  /**
   * The product's Gumroad URL, e.g.
   * "https://maemullen.gumroad.com/l/your-permalink". PASTE IT HERE once the
   * product exists on Gumroad — that switches Checkout from the "not connected"
   * note to a live Gumroad checkout. Leave "" until then.
   */
  gumroad: string;
};

export const currency = "£";

/** Format a whole-pound price. */
export function formatPrice(price: number): string {
  return `${currency}${price}`;
}

/**
 * Gumroad's overlay script, included once on the cart page. With it loaded, the
 * Checkout link opens Gumroad's payment form in a modal on our own page rather
 * than navigating away.
 */
export const gumroadScriptSrc = "https://gumroad.com/js/gumroad.js";

/**
 * One product for now — the illustration package, a set of Poppy's hand-drawn
 * pieces. It is NOT a single illustration; the copy says so (2026-08-09).
 */
export const products: Product[] = [
  {
    slug: "illustration-package",
    name: "Illustration Package",
    format: "Digital download · PNG + PDF",
    blurb:
      "A pack of the studio's hand-drawn illustrations, delivered as high-resolution files ready to print.",
    price: 20,
    gumroad: "",
  },
];

export function productBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export const shopPage = {
  mark: "The shop",
  title: "Shop",
  /** Deliberately generic — the studio will sell more than illustrations, and
   *  each product explains itself. Do not narrow this back to illustrations. */
  standfirst:
    "Digital products from the studio, bought and delivered securely through Gumroad — with more to come.",
};

/** Shown once under the masthead: the product is a stand-in. */
export const shopNote = "Placeholder — product details and covers on their way.";

export const cartPage = {
  mark: "Your cart",
  title: "Cart",
  empty: "Your cart is empty.",
  emptyLink: { label: "Browse the shop", href: "/shop" },
  subtotalLabel: "Subtotal",
  removeLabel: "Remove",
  checkoutLabel: "Checkout",
  /** Shown above the per-product checkout links when the cart holds more than
   *  one distinct product (each still checks out on Gumroad individually). */
  multiHint: "Each item checks out on Gumroad:",
  /**
   * Shown when a cart item has no Gumroad link yet — checkout cannot open a
   * payment that does not exist. Paste the product's Gumroad URL into
   * content/shop.ts to switch checkout on.
   */
  checkoutNote:
    "Checkout runs through Gumroad, which takes the payment and sends the files. It goes live the moment this product is connected on Gumroad.",
};
