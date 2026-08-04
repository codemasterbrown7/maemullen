import Link from "next/link";
import { InstagramStrip } from "@/components/chrome/InstagramStrip";
import { GooeyMarquee } from "@/components/ui/gooey-marquee";
import { services } from "@/content/home";
import { footer, instagramUrl, nav, siteName } from "@/content/site";
import { asset } from "@/lib/asset";
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
  /**
   * The one link marked as the page you are on — matched by identity, not by
   * href, so a repeated href marks only its FIRST item.
   *
   * Portfolio and Work both point at /work (SITEMAP §2 defers the split), and
   * comparing hrefs lit both of them blue at once, which reads as a bug rather
   * than as orientation. The comment here always said "only the first match";
   * the code never did it. It went unnoticed while /services was the only page
   * using `current`, because /services appears in the nav exactly once — the
   * moment /work existed, the pair lit up.
   */
  const currentItem = [...nav.left, ...nav.right].find((item) => item.href === current);

  const link = (item: { label: string; href: string }) => (
    <Link
      key={item.label}
      href={item.href}
      className="mmc__nav-link"
      aria-current={item === currentItem ? "page" : undefined}
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
            src={asset("/assets/brand/wordmark-ink.png")}
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

/**
 * The rule that used to sit on the <footer> now sits on the line itself, so the
 * post strip can slot in above it without the two borders stacking. With no
 * strip configured this renders exactly what it always did.
 */
export function ChromeFooter() {
  return (
    <footer>
      <InstagramStrip />
      <div className="mmc__footer">
        <span>{footer.copyright}</span>
        <div className="mmc__footer-group">
          {footer.instagram && instagramUrl ? (
            <a
              className="mmc__footer-link"
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {footer.instagram}
            </a>
          ) : (
            <span>{footer.instagramPlaceholder}</span>
          )}
          <span>{footer.email ?? footer.emailPlaceholder}</span>
        </div>
      </div>
    </footer>
  );
}
