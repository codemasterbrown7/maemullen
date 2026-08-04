import Link from "next/link";
import { footer, nav, siteName } from "@/content/site";

const columnStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-3)",
  alignItems: "flex-start",
} as const;

const eyebrowStyle = {
  fontSize: "var(--text-eyebrow)",
  fontWeight: 600,
  letterSpacing: "0.3em",
  textTransform: "uppercase",
  color: "var(--ink-muted)",
} as const;

const finePrintStyle = {
  fontSize: "var(--text-eyebrow)",
  letterSpacing: "0.09em",
  textTransform: "uppercase",
  color: "var(--ink-muted)",
} as const;

/** Nav minus the duplicate Portfolio entry, which points at /work like Work does. */
const footerLinks = [...nav.left, ...nav.right].filter((item) => item.label !== "Portfolio");

/**
 * Site footer — lifted out of the Claude Design import so routes share one copy.
 * Contact details render as clearly-marked placeholders until confirmed
 * (SITEMAP.md §6, Q6).
 */
export function SiteFooter() {
  return (
    <footer style={{ borderTop: "var(--border-hairline) solid var(--border)", background: "var(--bg)" }}>
      <div
        style={{
          maxWidth: "var(--container-wide)",
          margin: "0 auto",
          padding: "var(--space-16) var(--gutter) var(--space-10)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "var(--space-12)",
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", alignItems: "flex-start" }}>
          <img src="/assets/brand/monogram.png" alt="" aria-hidden="true" style={{ width: "56px", display: "block" }} />
          <p
            style={{
              margin: 0,
              fontSize: "var(--text-body-sm)",
              color: "var(--ink-muted)",
              maxWidth: "22em",
              textWrap: "pretty",
            }}
          >
            A female-founded creative studio — social, content and design for brands people remember.
          </p>
        </div>

        <nav aria-label="Footer" style={columnStyle}>
          <span style={eyebrowStyle}>Menu</span>
          {footerLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="mm-footer-link"
              style={{ fontSize: "var(--text-body-sm)", color: "var(--ink)", textDecoration: "none" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={columnStyle}>
          <span style={eyebrowStyle}>Say hello</span>
          <span style={{ fontSize: "var(--text-body-sm)", color: "var(--ink-muted)" }}>
            {footer.email ?? footer.emailPlaceholder}
          </span>
          <span style={{ fontSize: "var(--text-body-sm)", color: "var(--ink-muted)" }}>
            {footer.instagram ?? footer.instagramPlaceholder}
          </span>
        </div>
      </div>

      <div
        style={{
          maxWidth: "var(--container-wide)",
          margin: "0 auto",
          padding: "0 var(--gutter) var(--space-8)",
          display: "flex",
          justifyContent: "space-between",
          gap: "var(--space-6)",
          flexWrap: "wrap",
        }}
      >
        <span style={finePrintStyle}>
          © {new Date().getFullYear()} {siteName}
        </span>
        <span style={finePrintStyle}>Made with personality &amp; purpose</span>
      </div>
    </footer>
  );
}
