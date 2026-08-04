import Link from "next/link";
import { ChromeFooter, ChromeHeader, ChromeMarquee } from "@/components/chrome/SiteChrome";
import { ScrollThread } from "@/components/ui/scroll-thread";
import { instagramUrl } from "@/content/site";
import { soonOnward } from "@/content/soon";
import "./in-progress.css";

/**
 * The page a route gets before it is built — and, with `contents` omitted, the
 * 404. Content is in content/soon.ts.
 *
 * IT IS /services' MASTHEAD, NOT A NEW DESIGN. Same grammar in the same order:
 * a mono mark, the page's name set huge in Heros Bold, a narrow standfirst, and
 * a knot of loops drawn into the room on the right. A visitor who has seen one
 * page of this site has seen this layout, which is the point — an unfinished
 * page should read as part of the same site, not as the place the site stops.
 *
 * The one deliberate difference is the contents block. It is /services' index,
 * set on HAIRLINES instead of solid rules: a contents page for something not
 * printed yet, drawn faintly because it is not set. That block is also the whole
 * argument for these pages existing rather than a redirect home — it answers
 * "when I come back, what will be here?", which a redirect cannot.
 *
 * THE LINE draws itself as you scroll, as everywhere else — knot in the
 * masthead, one strand down the right margin past the contents, then a rule
 * under "In the meantime". It is not placed by coordinates: it measures the
 * `data-thread` elements below. See components/ui/scroll-thread.tsx.
 *
 * The marquee is here on purpose. Every one of these pages is a dead end, and
 * the band is the site's own list of ways onward — seven links into the one deep
 * page that is finished.
 */

type InProgressProps = {
  /** Route, so the header can mark the nav item you are on. Omitted for 404. */
  current?: string;
  /** The mono mark: "In progress", or "404". */
  mark: string;
  /** The word set huge. */
  title: string;
  standfirst: string;
  /** What will be on the page. Omitted on 404, which is not a page-to-be. */
  contents?: string[];
};

export function InProgress({ current, mark, title, standfirst, contents }: InProgressProps) {
  return (
    <div className="soon mmc">
      <ChromeHeader current={current} />

      <main className="soon__main">
        <ScrollThread />

        <header className="soon__masthead">
          {/* Mark, title and standfirst all stack in the left column — the
              arrangement /services settled on, and for the same reason: it
              keeps every piece of small type out of the lane the 14px stroke
              runs through. */}
          <div className="soon__masthead-body">
            <p className="soon__mark">[ {mark} ]</p>
            <h1 className="soon__title">{title}</h1>
            <p className="soon__standfirst">{standfirst}</p>
          </div>

          {/* Empty by design: the room the knot is drawn into. An element
              rather than a coordinate, so it moves with the layout. */}
          <div className="soon__ornament" data-thread="knot" data-thread-exit="60" />
        </header>

        {contents && (
          <section
            className="soon__contents"
            aria-labelledby="soon-contents-label"
            /* Hard against the right margin, outside the text — a full-width
               list has no empty half for the line to run down. */
            data-thread="pass"
            data-thread-x="0.95"
          >
            <p id="soon-contents-label" className="soon__contents-label">
              What goes on this page
            </p>

            <ol className="soon__list">
              {contents.map((item, index) => (
                <li key={item} className="soon__row">
                  {/* Decorative: the ordered list already carries position. */}
                  <span className="soon__row-num" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="soon__row-name">{item}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        <section className="soon__onward" aria-labelledby="soon-onward-heading">
          {/* The line finishes in a second, smaller knot beside the sign-off
              rather than ruling under it.

              IT WAS AN UNDERLINE FIRST, as on /services, AND THAT WAS WRONG
              HERE. An underline drops down the margin beside its heading and
              rules left to right — which works there because the strand is
              already on the left when it arrives. On this page the strand is
              hard against the RIGHT margin, the only lane a full-width contents
              list leaves it, so it had to cross the whole page to reach the
              start of the rule: the stroke came round the words in a loop and
              ran off the left edge of the screen. */}
          <div className="soon__copy">
            <h2 id="soon-onward-heading" className="soon__onward-heading">
              {soonOnward.heading}
            </h2>

            <div className="soon__onward-links">
              {soonOnward.links.map((link) => (
                <Link key={link.href} href={link.href} className="mm-cta-bracket">
                  {link.label}
                </Link>
              ))}

              {/* Only if a handle is configured. The site never renders a dead
                  link to a profile it does not know. */}
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
          </div>

          {/* Empty by design, like the masthead's: the room the closing knot is
              drawn into. Fewer loops than the masthead's — the line has come a
              long way by here and this is a sign-off, not the opening. */}
          <div
            className="soon__ornament soon__ornament--onward"
            data-thread="knot"
            data-thread-loops="4"
            data-thread-shape="fit"
          />
        </section>
      </main>

      <ChromeMarquee />
      <ChromeFooter />
    </div>
  );
}
