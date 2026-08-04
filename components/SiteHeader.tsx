import Link from "next/link";
import { nav, siteName } from "@/content/site";

const linkStyle = {
  color: "var(--nav-ink)",
  textDecoration: "none",
  fontSize: "var(--nav-link-size)",
  fontWeight: "var(--nav-link-weight)",
  letterSpacing: "var(--nav-link-tracking)",
  textTransform: "uppercase",
} as const;

/**
 * Site header — lifted verbatim out of the Claude Design import so every route
 * shares one copy. Cream on pink at 11px is a knowingly accepted contrast
 * trade-off (DESIGN.md §0, §8.1) — do not "fix" it.
 *
 * The wordmark must point at /assets/brand/, which mirrors the design export.
 * public/brand/wordmark-cream.png is a different, square, padded file and
 * renders 250px tall (DESIGN.md, design/import/README.md trap 3).
 */
export function SiteHeader() {
  return (
    <header
      style={{
        background: "var(--nav-bg)",
        borderBottom: "var(--border-hairline) solid var(--nav-border)",
      }}
    >
      <nav
        aria-label="Primary"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          minHeight: "var(--nav-height)",
          padding: "0 var(--gutter)",
          gap: "var(--space-6)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "var(--space-8)",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {nav.left.map((item) => (
            <Link key={item.label} href={item.href} className="mm-nav-link" style={linkStyle}>
              {item.label}
            </Link>
          ))}
        </div>

        <Link href="/" style={{ display: "flex", alignItems: "center", padding: "var(--space-3) 0" }}>
          <img
            src="/assets/brand/wordmark-cream.png"
            alt={`${siteName} — home`}
            style={{ width: "var(--nav-mark-width)", minWidth: "120px", display: "block" }}
          />
        </Link>

        <div
          style={{
            display: "flex",
            gap: "var(--space-8)",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {nav.right.map((item) => (
            <Link key={item.label} href={item.href} className="mm-nav-link" style={linkStyle}>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
