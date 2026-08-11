/**
 * The shopping cart — client-side only.
 *
 * WHY LOCALSTORAGE. The site is a static export on GitHub Pages with no server
 * (next.config.ts), so there is nowhere to keep a session. The cart lives in the
 * visitor's own browser under one key, and every page that touches it reads and
 * writes the same key. Actual payment/fulfilment is a separate, later step — it
 * needs a provider (Stripe, Gumroad, Lemon Squeezy, …); this module only holds
 * what the visitor has chosen until then.
 *
 * SYNC. Any change dispatches a `mm-cart-change` event on window, and the module
 * also listens for the native `storage` event, so the header count and the cart
 * page update live — within the tab and across tabs.
 *
 * Every reader is guarded for SSR (`typeof window`) because these run during the
 * static prerender too, where there is no localStorage.
 */

export type CartItem = { slug: string; qty: number };

const KEY = "mm-cart";
export const CART_EVENT = "mm-cart-change";

// Trust nothing off disk: keep only well-formed { slug, qty>=1 } rows.
function parse(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (row): row is CartItem =>
          !!row &&
          typeof (row as CartItem).slug === "string" &&
          Number.isFinite((row as CartItem).qty),
      )
      .map((row) => ({ slug: row.slug, qty: Math.max(1, Math.floor(row.qty)) }));
  } catch {
    return [];
  }
}

/** A fresh read of the cart — used by the mutators below. */
export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return parse(window.localStorage.getItem(KEY));
  } catch {
    return [];
  }
}

/**
 * A CACHED snapshot for useSyncExternalStore: it must return the SAME array
 * reference while localStorage is unchanged, or the store would re-render
 * forever. The parsed value is recomputed only when the raw string changes.
 * `EMPTY` is a stable reference so the server snapshot never triggers a diff.
 */
const EMPTY: CartItem[] = [];
let snapRaw: string | null = null;
let snapItems: CartItem[] = EMPTY;

export function getCartSnapshot(): CartItem[] {
  if (typeof window === "undefined") return EMPTY;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  if (raw !== snapRaw) {
    snapRaw = raw;
    snapItems = parse(raw);
  }
  return snapItems;
}

/** The server (and hydration) snapshot: an empty cart, stably referenced. */
export function getCartServerSnapshot(): CartItem[] {
  return EMPTY;
}

function writeCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_EVENT));
}

export function addItem(slug: string): void {
  const items = readCart();
  const found = items.find((i) => i.slug === slug);
  if (found) found.qty += 1;
  else items.push({ slug, qty: 1 });
  writeCart(items);
}

export function removeItem(slug: string): void {
  writeCart(readCart().filter((i) => i.slug !== slug));
}

export function setQty(slug: string, qty: number): void {
  if (qty <= 0) {
    removeItem(slug);
    return;
  }
  const items = readCart();
  const found = items.find((i) => i.slug === slug);
  if (found) found.qty = Math.floor(qty);
  writeCart(items);
}

export function clearCart(): void {
  writeCart([]);
}

export function cartCount(items: CartItem[] = readCart()): number {
  return items.reduce((n, i) => n + i.qty, 0);
}

/** Subscribe to any cart change (same tab and cross-tab). Returns an unsubscribe. */
export function onCartChange(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener(CART_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CART_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
