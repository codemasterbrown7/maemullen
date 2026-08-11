"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { cartPage, formatPrice, productBySlug } from "@/content/shop";
import {
  getCartServerSnapshot,
  getCartSnapshot,
  onCartChange,
  removeItem,
  type CartItem,
} from "@/lib/cart";

/**
 * The cart page's interactive half. Reads the cart store, lists each product
 * with its price and a remove control, totals it, and hands CHECKOUT off to
 * Gumroad: a link to the product's Gumroad page, which the overlay script on the
 * cart page opens as a payment modal (Gumroad then delivers the files). A
 * product with no Gumroad URL yet can still be added and viewed — checkout just
 * explains it isn't connected rather than opening a dead link.
 *
 * `useSyncExternalStore` renders the server snapshot (empty) during hydration
 * and the real cart after, with no mismatch and no setState-in-effect.
 */
export function CartView() {
  const items = useSyncExternalStore(onCartChange, getCartSnapshot, getCartServerSnapshot);
  const [note, setNote] = useState(false);

  const rows = items
    .map((item) => ({ item, product: productBySlug(item.slug) }))
    .filter((row): row is { item: CartItem; product: NonNullable<typeof row.product> } =>
      Boolean(row.product),
    );

  if (rows.length === 0) {
    return (
      <div className="cart__empty">
        <p className="cart__empty-line">{cartPage.empty}</p>
        <Link href={cartPage.emptyLink.href} className="mm-cta-bracket cart__empty-link">
          {cartPage.emptyLink.label}
        </Link>
      </div>
    );
  }

  const subtotal = rows.reduce((sum, { item, product }) => sum + product.price * item.qty, 0);

  // Distinct products in the cart, and whether every one is connected to Gumroad.
  const distinct = Array.from(new Map(rows.map((r) => [r.product.slug, r.product])).values());
  const allConnected = distinct.length > 0 && distinct.every((p) => p.gumroad.trim() !== "");

  return (
    <div className="cart__body">
      <ul className="cart__list">
        {rows.map(({ item, product }) => (
          <li key={item.slug} className="cart__row">
            <div className="cart__row-main">
              <h2 className="cart__row-name">{product.name}</h2>
              <p className="cart__row-format">{product.format}</p>
            </div>
            <p className="cart__row-qty">
              {item.qty > 1 ? `${item.qty} × ${formatPrice(product.price)}` : formatPrice(product.price)}
            </p>
            <p className="cart__row-price">{formatPrice(product.price * item.qty)}</p>
            <button
              type="button"
              className="cart__remove"
              onClick={() => removeItem(item.slug)}
              aria-label={`Remove ${product.name}`}
            >
              {cartPage.removeLabel}
            </button>
          </li>
        ))}
      </ul>

      <div className="cart__foot">
        <p className="cart__subtotal">
          <span className="cart__subtotal-label">{cartPage.subtotalLabel}</span>
          <span className="cart__subtotal-value">{formatPrice(subtotal)}</span>
        </p>

        {allConnected ? (
          distinct.length === 1 ? (
            // Single product — Checkout opens its Gumroad payment modal.
            <a
              className="cart__checkout"
              href={distinct[0].gumroad}
              target="_blank"
              rel="noopener noreferrer"
            >
              {cartPage.checkoutLabel}
            </a>
          ) : (
            // Several products — each checks out on Gumroad in turn.
            <div className="cart__checkout-multi">
              <p className="cart__checkout-hint">{cartPage.multiHint}</p>
              {distinct.map((product) => (
                <a
                  key={product.slug}
                  className="cart__checkout cart__checkout--multi"
                  href={product.gumroad}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {product.name}
                </a>
              ))}
            </div>
          )
        ) : (
          <>
            <button type="button" className="cart__checkout" onClick={() => setNote(true)}>
              {cartPage.checkoutLabel}
            </button>
            {note && (
              <p className="cart__checkout-note" role="status">
                {cartPage.checkoutNote}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
