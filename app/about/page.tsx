import type { Metadata } from "next";
import Link from "next/link";
import { ChromeFooter, ChromeHeader } from "@/components/chrome/SiteChrome";
import {
  aboutClosing,
  aboutCta,
  aboutDescription,
  aboutNote,
  aboutPage,
  aboutStory,
  founders,
} from "@/content/about";
import { siteName } from "@/content/site";
import { asset } from "@/lib/asset";
import "./about.css";

export const metadata: Metadata = {
  title: `About — ${siteName}`,
  description: aboutDescription,
};

/**
 * /about — the two people behind the studio. Built on the shared chrome and the
 * /services vibe: Heros display headings, the mono `[ 00x ]` register, vertical
 * edge type, and copy/photo sections that alternate side down the page.
 *
 * NO SCROLL-DRAWN LINE. That belongs to /services alone. What this page keeps
 * from it is the layout and the type, not the ornament.
 *
 * WHITESPACE IS LOAD-BEARING. The big padding around every block is the room
 * Poppy's doodles go into — asked for directly (2026-08-09). Do not tighten it.
 *
 * PHOTOGRAPHY IS PLACEHOLDER. Two studio shots stand in until the real portraits
 * are chosen; content/about.ts marks them, and the note below says so on the
 * page.
 */
export default function AboutPage() {
  return (
    <div className="abt mmc">
      <ChromeHeader current="/about" />

      <main className="abt__main">
        <header className="abt__masthead">
          <div className="abt__masthead-body">
            <p className="abt__mark">[ {aboutPage.mark} ]</p>
            <h1 className="abt__title">{aboutPage.title}</h1>
            <p className="abt__standfirst">{aboutPage.standfirst}</p>
            <p className="abt__note">{aboutNote}</p>
          </div>
        </header>

        <ol className="abt__list">
          {founders.map((founder) => (
            <li key={founder.name} className={`abt__item abt__item--${founder.side}`}>
              <p
                className={`abt__edge ${
                  founder.side === "left" ? "abt__edge--up" : "abt__edge--down"
                }`}
              >
                {founder.edge}
              </p>

              <div className="abt__body">
                <p className="abt__mark" aria-hidden="true">
                  [ {founder.number} ]
                </p>
                <h2 className="abt__name">{founder.name}</h2>
                <p className="abt__prose">{founder.bio}</p>
              </div>

              {/* Placeholder plate — a clean portrait rectangle, no frame, in the
                  section's empty half. Real photography swaps in later. */}
              <figure className="abt__plate">
                <img
                  className="abt__plate-img"
                  src={asset(founder.image.src)}
                  alt={founder.image.alt}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="abt__plate-caption">{founder.image.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ol>

        <section className="abt__story">
          <p className="abt__mark">[ {aboutStory.mark} ]</p>
          <h2 className="abt__story-heading">{aboutStory.heading}</h2>
          <p className="abt__story-body">{aboutStory.body}</p>
        </section>

        <section className="abt__closing">
          <p className="abt__statement">{aboutClosing}</p>
        </section>

        <section className="abt__cta">
          <h2 className="abt__cta-heading">{aboutCta.heading}</h2>
          <Link href={aboutCta.href} className="mm-cta-bracket abt__cta-link">
            {aboutCta.label}
          </Link>
        </section>
      </main>

      <ChromeFooter />
    </div>
  );
}
