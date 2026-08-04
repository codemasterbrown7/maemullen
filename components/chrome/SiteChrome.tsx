import Link from "next/link";
import { GooeyMarquee } from "@/components/ui/gooey-marquee";
import { services } from "@/content/home";
import { footer, nav, siteName } from "@/content/site";
import "./chrome.css";

/**
 * The site chrome, in v3's language — cream header, gooey services marquee,
 * hairline footer.
 *
 * Extracted from app/v3/page.tsx on 2026-08-03, when /v3 was chosen as the
 * design every new page builds on. The markup is unchanged; it just lives
 * somewhere both /v3 and /services can reach it, so the header can never drift
 * between two pages of the same site.
 *
 * Server components throughout — no state, no effects, no client JS.
 */

/** v1's arrangement — three links, centred logotype, three links — in cream. */
export function ChromeHeader({ current }: { current?: string }) {
  const link = (item: { label: string; href: string }) => (
    <Link
      key={item.label}
      href={item.href}
      className="mmc__nav-link"
      // Marks the page you are already on. Only the first match, because
      // Portfolio and Work both point at /work and highlighting a pair would
      // read as a bug rather than as orientation.
      aria-current={item.href === current ? "page" : undefined}
    >
      {item.label}
    </Link>
  );

  return (
    <header className="mmc__header">
      <nav aria-label="Primary" className="mmc__nav">
        <div className="mmc__nav-group">{nav.left.map(link)}</div>

        <Link href="/" className="mmc__wordmark">
          <img
            src="/assets/brand/wordmark-ink.png"
            alt={`${siteName} — home`}
            className="mmc__wordmark-img"
          />
        </Link>

        <div className="mmc__nav-group mmc__nav-group--end">{nav.right.map(link)}</div>
      </nav>
    </header>
  );
}

/**
 * The services marquee — cream ground, two rows running opposite ways with the
 * type melting into a bar at each end.
 *
 * `adjacent` is for pages where the band sits directly under the header with no
 * photography between them; it switches the type to blue so the two cream bands
 * stay legible as two surfaces. See the note in chrome.css.
 */
export function ChromeMarquee({ adjacent = false }: { adjacent?: boolean }) {
  return (
    <GooeyMarquee
      className={`mmc__marquee${adjacent ? " mmc__marquee--adjacent" : ""}`}
      items={services.map((s) => ({ label: s.name, href: `/services#${s.anchor}` }))}
    />
  );
}

export function ChromeFooter() {
  return (
    <footer className="mmc__footer">
      <span>{footer.copyright}</span>
      <div className="mmc__footer-group">
        <span>{footer.instagram ?? footer.instagramPlaceholder}</span>
        <span>{footer.email ?? footer.emailPlaceholder}</span>
      </div>
    </footer>
  );
}
