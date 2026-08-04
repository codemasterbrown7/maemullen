import Link from "next/link";
import type { Metadata } from "next";
import { services, statementTail, studioIntro } from "@/content/home";
import { nav, siteName } from "@/content/site";
import "./v2.css";

export const metadata: Metadata = {
  title: `${siteName} — v2`,
  description: "Alternative landing page, designed against the Inspo references.",
};

/**
 * /v2 — a clone of the landing page, redesigned against the Inspo folder.
 * The live page at / is untouched; both run at once so they can be compared.
 *
 * The composition is one screen, no scrolling: a masthead rule, the headline
 * as the image, a services index in the right rail, one small photographic
 * plate, and a footer rule. Reasoning for each departure from the locked
 * design system is in v2.css.
 *
 * Note this deliberately does not use SiteHeader / ServicesMarquee: the whole
 * point is a different register, and the pink nav band plus scrolling marquee
 * belong to the other one.
 */
export default function V2() {
  const year = new Date().getFullYear();

  return (
    <div className="v2">
      <div className="v2__screen">
        <span className="v2__edge v2__micro" aria-hidden="true">
          {siteName} — Creative Studio — London — {year}
        </span>

        <header className="v2__top">
          <Link href="/v2" className="v2__wordmark">
            Mae<em style={{ fontStyle: "italic" }}>Müllen</em>
          </Link>
          <nav className="v2__nav v2__micro" aria-label="Primary">
            {[...nav.left, ...nav.right]
              .filter((item) => item.label !== "Portfolio")
              .map((item) => (
                <Link key={item.label} href={item.href}>
                  {item.label}
                </Link>
              ))}
          </nav>
        </header>

        <div className="v2__body">
          <div>
            {/* Copy is the locked deck line, unchanged. An earlier pass cycled
                the last word ("together" / "alive" / "first") as a nod to the
                rearranging type in reference 16 — pulled, because that quietly
                rewrites the client's tagline, which is not a styling decision. */}
            <h1 className="v2__headline">
              Where social,
              <br />
              content <em>&amp;</em> design
              <br />
              come together.
            </h1>
            <p className="v2__standfirst">{statementTail}</p>
          </div>

          <div className="v2__rail">
            <div>
              <span className="v2__micro v2__micro--muted">[ Index — Services ]</span>
              <ol className="v2__index" style={{ marginTop: "var(--space-3)" }}>
                {services.map((s) => (
                  <li key={s.anchor}>
                    <Link href={`/services#${s.anchor}`}>
                      <span className="v2__num">{s.number}</span>
                      <span>{s.name}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>

            {studioIntro.image && (
              <figure style={{ margin: 0 }}>
                <div className="v2__plate">
                  <img src={studioIntro.image.src} alt={studioIntro.image.alt} />
                </div>
                <figcaption
                  className="v2__micro v2__micro--muted"
                  style={{ display: "block", marginTop: "var(--space-2)" }}
                >
                  Fig. 01 — The founders
                </figcaption>
              </figure>
            )}
          </div>
        </div>

        <footer className="v2__bottom">
          <Link href="/enquire" className="v2__cta">
            Enquire
            <span aria-hidden="true">→</span>
          </Link>
          <span className="v2__micro v2__micro--muted">
            Social · Content · Design · Illustration · PR &amp; Events
          </span>
        </footer>
      </div>
    </div>
  );
}
