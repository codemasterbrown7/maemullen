import type { Metadata } from "next";
import Link from "next/link";
import { ChromeFooter, ChromeHeader, ChromeMarquee } from "@/components/chrome/SiteChrome";
import { heroPairV3, studioIntro } from "@/content/home";
import { siteName } from "@/content/site";
import "./v3.css";

export const metadata: Metadata = {
  title: `${siteName} — v3 draft`,
};

/**
 * /v3 — the third landing-page draft, 2026-08-02.
 *
 * Brief: v2's restrained editorial vibe on v1's layout and structure, with the
 * royal blue marquee lifted above the navigation, four-pointed sparkles in
 * place of the asterisks, and the tulle portrait in place of the cowhide chair.
 *
 * / and /v2 are untouched, so all three can be compared side by side. Every
 * style is scoped under .v3 in v3.css, where the full design plan is recorded.
 *
 * Copy is verbatim from the deck via content/. Nothing here is invented.
 */

/**
 * The header, the marquee and the footer now come from
 * components/chrome/SiteChrome — same markup, same styles, just somewhere
 * /services can reach them too. They were local functions here until
 * 2026-08-03, when this page became the design every new page builds on and a
 * second copy of the header would have started drifting immediately.
 */

/** Two full-bleed frames butted together, filling whatever the chrome leaves. */
function Pair() {
  return (
    <div className="v3__pair">
      {heroPairV3.map((image) => (
        <figure key={image.src} className="v3__cell">
          <img src={image.src} alt={image.alt} className="v3__cell-img" />
          <span className="v3__cell-scrim" />
          <figcaption
            className={`v3__caption v3__caption--${image.align === "end" ? "end" : "start"}`}
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
    <section id="studio" aria-label="About the studio" className="v3__intro">
      {image && (
        <figure className="v3__plate">
          <img src={image.src} alt={image.alt} className="v3__plate-img" />
        </figure>
      )}

      <div className="v3__copy">
        <h1 className="v3__eyebrow">{eyebrow}</h1>

        <p className="v3__body">
          {lead}
          {leadRest}
        </p>

        <p className="v3__body">{body}</p>

        <Link href={cta.href} className="mm-cta-bracket v3__cta">
          {cta.label}
        </Link>
      </div>
    </section>
  );
}

export default function V3() {
  return (
    <div className="v3 mmc">
      {/* Nav, images, then the marquee closing the first screen. The marquee
          stays inside the 100svh column rather than below it, so the whole
          arrangement is visible without scrolling. It keeps its black type
          here — the photographs sit between it and the header, so the two
          cream bands never touch. */}
      <div className="v3__fold">
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
