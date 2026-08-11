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
 * /about — two screens, not a long scroll (asked for directly, 2026-08-09).
 *
 *   Page one  — the two founders side by side: intro line, then Laura and Poppy
 *               as a two-up with small portrait plates, in the /services type
 *               registers (Heros names, the mono `[ 00x ]` mark).
 *   Page two  — the studio itself: the "female-founded studio" block, the
 *               closing statement, and the CTA into /enquire.
 *
 * Each `.abt__page` is sized to fill a screen and centres its content, so the
 * whole thing reads as two pages rather than five stacked sections.
 *
 * NO SCROLL-DRAWN LINE (that is /services' alone). PHOTOGRAPHY IS PLACEHOLDER —
 * two studio shots stand in, captioned as such, until the real portraits are
 * chosen. The air around the blocks is the room for Poppy's doodles.
 */
export default function AboutPage() {
  return (
    <div className="abt mmc">
      <ChromeHeader current="/about" />

      <main className="abt__main">
        {/* PAGE ONE — the founders */}
        <section className="abt__page abt__founders">
          <header className="abt__intro">
            <p className="abt__mark">[ {aboutPage.mark} ]</p>
            <h1 className="abt__title">{aboutPage.title}</h1>
            <p className="abt__standfirst">{aboutPage.standfirst}</p>
            <p className="abt__note">{aboutNote}</p>
          </header>

          <ol className="abt__founders-grid">
            {founders.map((founder) => (
              <li key={founder.name} className="abt__founder">
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

                <p className="abt__mark abt__founder-mark">
                  [ {founder.number} · {founder.edge} ]
                </p>
                <h2 className="abt__name">{founder.name}</h2>
                <p className="abt__prose">{founder.bio}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* PAGE TWO — the studio */}
        <section className="abt__page abt__studio">
          <div className="abt__studio-inner">
            <p className="abt__mark">[ {aboutStory.mark} ]</p>
            <h2 className="abt__story-heading">{aboutStory.heading}</h2>
            <p className="abt__story-body">{aboutStory.body}</p>
            <p className="abt__statement">{aboutClosing}</p>

            <div className="abt__cta">
              <h2 className="abt__cta-heading">{aboutCta.heading}</h2>
              <Link href={aboutCta.href} className="mm-cta-bracket abt__cta-link">
                {aboutCta.label}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <ChromeFooter />
    </div>
  );
}
