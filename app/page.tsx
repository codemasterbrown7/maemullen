import Link from "next/link";
import { ChromeFooter, ChromeHeader, ChromeMarquee } from "@/components/chrome/SiteChrome";
import { heroPair, studioIntro } from "@/content/home";
import { asset } from "@/lib/asset";
import "./home.css";

/**
 * The landing page.
 *
 * This is the draft that used to live at /v3 — v2's restrained editorial vibe
 * on v1's layout and structure, with the royal blue marquee lifted above the
 * navigation, four-pointed sparkles in place of the asterisks, and the tulle
 * portrait in place of the cowhide chair. It was chosen over the other two on
 * 2026-08-04 and moved here; the original / and /v2 are deleted, so there is
 * one landing page again. Every style is scoped under .home in home.css, where
 * the full design plan is recorded.
 *
 * There is deliberately no page-level metadata: / takes the site title from the
 * root layout rather than carrying a draft label.
 *
 * Copy is verbatim from the deck via content/. Nothing here is invented.
 *
 * The header, the marquee and the footer come from
 * components/chrome/SiteChrome, so /services wears the same chrome and the two
 * can never drift apart.
 */

/** Two full-bleed frames butted together, filling whatever the chrome leaves. */
function Pair() {
  return (
    <div className="home__pair">
      {heroPair.map((image) => (
        <figure key={image.src} className="home__cell">
          <img src={asset(image.src)} alt={image.alt} className="home__cell-img" />
          <span className="home__cell-scrim" />
          <figcaption
            className={`home__caption home__caption--${image.align === "end" ? "end" : "start"}`}
          >
            {image.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/**
 * Set to match the client's type reference exactly: a small label, one justified
 * uppercase block, a bracket link — all at ONE weight, in ONE size relationship,
 * with open tracking. Nothing is bold and nothing shouts.
 *
 * Earlier passes went the other way — a heavy display heading over dense body
 * copy with the studio name bolded — and read as nothing like the reference.
 * The reference has no heavy heading at all, so the "A studio of two, by
 * design." line is gone rather than merely lightened; the statement is the
 * content. `studioIntro.heading` is still in content/home.ts if it comes back.
 */
function Intro() {
  const { eyebrow, lead, leadRest, body, cta, image } = studioIntro;

  return (
    <section id="studio" aria-label="About the studio" className="home__intro">
      {image && (
        <figure className="home__plate">
          <img src={asset(image.src)} alt={image.alt} className="home__plate-img" />
        </figure>
      )}

      <div className="home__copy">
        <h1 className="home__eyebrow">{eyebrow}</h1>

        <p className="home__body">
          {lead}
          {leadRest}
        </p>

        <p className="home__body">{body}</p>

        <Link href={cta.href} className="mm-cta-bracket home__cta">
          {cta.label}
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="home mmc">
      {/* Nav, images, then the marquee closing the first screen. The marquee
          stays inside the 100svh column rather than below it, so the whole
          arrangement is visible without scrolling. It keeps its black type
          here — the photographs sit between it and the header, so the two
          cream bands never touch. */}
      <div className="home__fold">
        <ChromeHeader />
        <Pair />
        <ChromeMarquee />
      </div>
      <main>
        <Intro />
      </main>
      <ChromeFooter />
    </div>
  );
}
