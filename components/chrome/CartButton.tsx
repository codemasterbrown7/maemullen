"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { cartCount, getCartServerSnapshot, getCartSnapshot, onCartChange } from "@/lib/cart";

/**
 * The cart button at the end of the header — a small bag glyph with a live
 * count. `useSyncExternalStore` subscribes to the cart store: it renders the
 * server snapshot (0) during hydration and switches to the real count after,
 * with no hydration mismatch and no setState-in-effect.
 */
export function CartButton() {
  const items = useSyncExternalStore(onCartChange, getCartSnapshot, getCartServerSnapshot);
  const count = cartCount(items);

  return (
    <Link
      href="/cart"
      className="mmc__cart"
      aria-label={count === 1 ? "Cart, 1 item" : `Cart, ${count} items`}
    >
      <svg
        className="mmc__cart-icon"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <path d="M6 8h12l-1 12H7L6 8Z" strokeLinejoin="round" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
      </svg>
      <span className="mmc__cart-count">{count}</span>
    </Link>
  );
}
