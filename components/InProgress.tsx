import Link from "next/link";
import { ChromeFooter, ChromeHeader, ChromeMarquee } from "@/components/chrome/SiteChrome";
import { instagramUrl } from "@/content/site";
import { soonOnward } from "@/content/soon";
import "./in-progress.css";

/**
 * The page a route gets before it is built, and the 404. Copy is in
 * content/soon.ts.
 *
 * PLAIN ON PURPOSE (asked for directly, 2026-08-04). Four things, centred in
 * the space the chrome leaves: a mono mark, the page's name, one sentence, and
 * a way onward. That is the whole page.
 *
 * NO SCROLL-DRAWN LINE. The first version wore /services' masthead — the knot
 * of loops behind the display type, a strand down the right margin, a second
 * knot beside the sign-off — and a contents list of what was coming. Both were
 * cut. The drawn line is /services' and belongs only there; an unfinished page
 * borrowing the most elaborate thing on the site was the wrong instinct. That
 * also means no <ScrollThread>, so these pages ship no client JS of their own.
 *
 * The marquee stays. It is site chrome rather than this page's design, and it
 * is the only route onward that leads somewhere finished.
 */

type InProgressProps = {
  /** Route, so the header can mark the nav item you are on. Omitted for 404. */
  current?: string;
  /** The mono mark: "In progress", or "404". */
  mark: string;
  /** The page's name. */
  title: string;
  /** One sentence. */
  line: string;
};

export function InProgress({ current, mark, title, line }: InProgressProps) {
  return (
    <div className="soon mmc">
      <ChromeHeader current={current} />

      <main className="soon__main">
        <p className="soon__mark">[ {mark} ]</p>

        <h1 className="soon__title">{title}</h1>

        <p className="soon__line">{line}</p>

        <div className="soon__links">
          {soonOnward.links.map((link) => (
            <Link key={link.href} href={link.href} className="mm-cta-bracket">
              {link.label}
            </Link>
          ))}

          {/* Only if a handle is configured. The site never renders a dead link
              to a profile it does not know. */}
          {instagramUrl && (
            <a
              className="mm-cta-bracket"
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {soonOnward.instagramLabel}
            </a>
          )}
        </div>
      </main>

      <ChromeMarquee />
      <ChromeFooter />
    </div>
  );
}
