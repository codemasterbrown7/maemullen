import Image from "next/image";
import Link from "next/link";
import { footer, nav } from "@/content/site";

/**
 * Footer (DESIGN.md §8.4): nav repeat, Instagram, email, copyright.
 * The brand mark here is the MM monogram (the small-space lockup,
 * DESIGN.md §1.3) — the logotype itself lives in the header only (§0 S4).
 * Instagram and email are unconfirmed (SITEMAP.md §6 Q6) and render as
 * clearly-marked placeholders.
 */
export function Footer() {
  const items = [...nav.left, ...nav.right];
  return (
    <footer className="site-footer">
      <div className="wrap-default flex flex-col items-start gap-10 py-16">
        <Image
          src="/brand/monogram-trimmed.png"
          alt=""
          width={48}
          height={48}
        />
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-8">
            {items.map((item, i) => (
              <li key={`${item.label}-${i}`}>
                <Link href={item.href} className="footer-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-ink-muted">
          <span>{footer.instagram ?? footer.instagramPlaceholder}</span>
          <span>{footer.email ?? footer.emailPlaceholder}</span>
        </div>
        <p className="text-ink-muted" style={{ fontSize: "var(--text-body-sm)" }}>
          {footer.copyright}
        </p>
      </div>
    </footer>
  );
}
