/**
 * /shop content — the studio's digital products, plus the copy for the shop and
 * cart pages.
 *
 * PLACEHOLDER PRODUCTS. These four are stand-ins so the shop and cart can be
 * seen working; the real products, prices and cover art come later. `shopNote`
 * says so on the page. Prices are whole pounds for now.
 *
 * WHERE A PURCHASE GOES. Nowhere yet — the cart holds the selection in the
 * browser (lib/cart.ts), and checkout needs a payment provider chosen and wired
 * in (Stripe, Gumroad, Lemon Squeezy, …). Until then the cart page says so
 * rather than pretending to take a payment.
 */

export type Product = {
  slug: string;
  name: string;
  /** A short line under the name — the format the file arrives in. */
  format: string;
  blurb: string;
  /** Whole pounds. */
  price: number;
};

export const currency = "£";

/** Format a whole-pound price. */
export function formatPrice(price: number): string {
  return `${currency}${price}`;
}

export const products: Product[] = [
  {
    slug: "content-planner",
    name: "Content Planner",
    format: "Notion + PDF",
    blurb:
      "A month-at-a-glance planner for social — pillars, hooks and a posting rhythm, ready to fill in.",
    price: 24,
  },
  {
    slug: "instagram-grid-kit",
    name: "Instagram Grid Kit",
    format: "Canva template",
    blurb:
      "A cohesive nine-tile grid system — covers, quotes and carousels — that keeps a feed looking considered.",
    price: 18,
  },
  {
    slug: "reels-hook-library",
    name: "Reels Hook Library",
    format: "PDF",
    blurb:
      "Over a hundred opening lines that earn the first three seconds, sorted by the job they do.",
    price: 15,
  },
  {
    slug: "brand-guidelines-template",
    name: "Brand Guidelines Template",
    format: "Figma + PDF",
    blurb:
      "A clean, editable guidelines document — logo, palette, type and voice — to hand a new brand its rulebook.",
    price: 45,
  },
];

export function productBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export const shopPage = {
  mark: "The shop",
  title: "Shop",
  standfirst:
    "Digital products from the studio — templates and toolkits to help you show up with intention.",
};

/** Shown once under the masthead: these products are stand-ins. */
export const shopNote = "Placeholder products — the real shop is on its way.";

export const cartPage = {
  mark: "Your cart",
  title: "Cart",
  empty: "Your cart is empty.",
  emptyLink: { label: "Browse the shop", href: "/shop" },
  subtotalLabel: "Subtotal",
  removeLabel: "Remove",
  checkoutLabel: "Checkout",
  /**
   * Checkout is not wired up yet — no payment provider is connected — so the
   * button explains that rather than failing silently.
   */
  checkoutNote:
    "Checkout isn’t live yet — we’re setting up secure payment and delivery for our digital products. Everything you add is saved here in the meantime.",
};
