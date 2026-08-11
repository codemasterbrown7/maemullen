"use client";

import { useEffect, useRef, useState } from "react";
import { addItem } from "@/lib/cart";

/**
 * The add-to-cart control on a shop card. Writes to the cart store and flashes a
 * short confirmation, then returns to its label. The whole shop grid is static
 * except these buttons, so they are the page's only client code.
 */
export function AddToCart({ slug, label = "Add to cart" }: { slug: string; label?: string }) {
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <button
      type="button"
      className="shop__add"
      onClick={() => {
        addItem(slug);
        setAdded(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setAdded(false), 1500);
      }}
    >
      {added ? "Added ✓" : label}
    </button>
  );
}
