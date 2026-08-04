"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { nav, siteName, type NavItem } from "@/content/site";

function NavLink({ item, className }: { item: NavItem; className: string }) {
  const pathname = usePathname();
  const current = pathname === item.href;
  return (
    <Link
      href={item.href}
      className={className}
      aria-current={current ? "page" : undefined}
    >
      {item.label}
    </Link>
  );
}

/**
 * The header is its own surface, independent of the page (DESIGN.md §0 S1).
 * Logotype centred, links split three and three (S2). The wordmark is
 * recoloured via CSS mask so it takes the --logotype token.
 */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const allItems = [...nav.left, ...nav.right];

  const close = useCallback(() => {
    setMenuOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Esc closes; body scroll locks while open (DESIGN.md §8.3).
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      // Keep focus inside the toggle + menu while open.
      if (e.key === "Tab") {
        const links =
          menuRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [];
        const first = toggleRef.current;
        const last = links[links.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector("a")?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen, close]);

  return (
    <header className="site-header">
      <nav aria-label="Primary" className="site-header__bar">
        <ul className="site-header__group">
          {nav.left.map((item) => (
            <li key={item.label}>
              <NavLink item={item} className="nav-link" />
            </li>
          ))}
        </ul>

        <Link href="/" aria-label={`${siteName} — home`}>
          <span className="wordmark" aria-hidden="true" />
        </Link>

        <ul className="site-header__group site-header__group--right">
          {nav.right.map((item) => (
            <li key={item.label}>
              <NavLink item={item} className="nav-link" />
            </li>
          ))}
        </ul>

        <button
          ref={toggleRef}
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => (menuOpen ? close() : setMenuOpen(true))}
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          <span className="menu-toggle__line" aria-hidden="true" />
          <span className="menu-toggle__line" aria-hidden="true" />
          <span className="menu-toggle__line" aria-hidden="true" />
        </button>
      </nav>

      {menuOpen && (
        <div id="mobile-menu" ref={menuRef} className="mobile-menu">
          <nav aria-label="Primary, mobile">
            <ul>
              {allItems.map((item, i) => (
                // Portfolio and Work both point at /work for now, so the
                // key needs the index to stay unique.
                <li key={`${item.label}-${i}`}>
                  <Link
                    href={item.href}
                    className="mobile-menu__link"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
