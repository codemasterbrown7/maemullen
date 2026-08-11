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
 * /about — two screens, not a long scroll.
 *
 *   Page one  — the two founders, SCATTERED rather than lined up: Laura sits
 *               high, Poppy drops down and hangs off the right, echoing the
 *               editorial reference the client sent. Each person's mark, name
 *               and bio sit directly UNDER their placeholder image.
 *   Page two  — the studio, with "A female-founded studio" set VERTICALLY down
 *               the side (the /services edge-type treatment) so the page is not
 *               just a stack of paragraphs.
 *
 * NO SCROLL-DRAWN LINE (that is /services' alone). PHOTOGRAPHY IS PLACEHOLDER —
 * two studio shots stand in, flagged by the note under the masthead, until the
 * real portraits are chosen. The air around everything is the room for Poppy's
 * doodles.
 */
export default function AboutPage() {
  return (
    <div className="abt mmc">
      <ChromeHeader current="/about" />

      <main className="abt__main">
        {/* PAGE ONE — the founders, scattered */}
        <section className="abt__page abt__founders">
          <header className="abt__intro">
            <p className="abt__mark">[ {aboutPage.mark} ]</p>
            <h1 className="abt__title">{aboutPage.title}</h1>
            <p className="abt__standfirst">{aboutPage.standfirst}</p>
            <p className="abt__note">{aboutNote}</p>
          </header>

          <ol className="abt__founders-scatter">
            {founders.map((founder) => (
              <li key={founder.name} className="abt__founder">
                {/* The placeholder image, with its identity underneath it. */}
                <img
                  className="abt__plate-img"
                  src={asset(founder.image.src)}
                  alt={founder.image.alt}
                  loading="lazy"
                  decoding="async"
                />
                <p className="abt__mark abt__founder-mark">
                  [ {founder.number} · {founder.edge} ]
                </p>
                <h2 className="abt__name">{founder.name}</h2>
                <p className="abt__prose">{founder.bio}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* PAGE TWO — the studio, heading set vertically */}
        <section className="abt__page abt__studio">
          <div className="abt__studio-grid">
            <h2 className="abt__story-heading">{aboutStory.heading}</h2>

            <div className="abt__studio-inner">
              <p className="abt__mark">[ {aboutStory.mark} ]</p>
              <p className="abt__story-body">
                {aboutStory.bodyLead}
                <strong className="abt__brand">{aboutStory.bodyName}</strong>
                {aboutStory.bodyRest}
              </p>
              <p className="abt__story-body">{aboutClosing}</p>

              <div className="abt__cta">
                <Link href={aboutCta.href} className="mm-cta-bracket abt__cta-link">
                  {aboutCta.label}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ChromeFooter />
    </div>
  );
}
