import type { Metadata } from "next";
import Link from "next/link";
import { ChromeFooter, ChromeHeader } from "@/components/chrome/SiteChrome";
import { TabLine } from "@/components/ui/tab-line";
import {
  packageTabs,
  packagesDescription,
  packagesPage,
  socialMatrix,
} from "@/content/packages";
import { siteName } from "@/content/site";
import "./packages.css";

export const metadata: Metadata = {
  title: `Packages — ${siteName}`,
  description: packagesDescription,
};

/** The radio group's name — shared with TabLine, which listens on it. */
const TAB_GROUP = "pkg-tab";

/**
 * /packages — one tab per thing you can buy. Why the page exists separately
 * from /services, why social media is the only tab holding more than one card,
 * and where every line of copy came from is all in content/packages.ts; this
 * file is layout only.
 *
 * THE TABS RUN ON CSS, NOT JAVASCRIPT. One radio group, visually hidden, with
 * the tab bar and the panels as its siblings — `#id:checked ~ … [data-panel]`
 * does the switching. This is not cleverness for its own sake; it buys four
 * things a useState component would not:
 *
 *   · The site is a static export, so this stays a server component. The only
 *     script the page ships is the tab rule's animation, which is decoration
 *     (components/ui/tab-line.tsx) and degrades to a static underline.
 *   · A radio group already IS the semantics — one of a set, exactly one
 *     chosen. Arrow keys move between options natively, so the keyboard
 *     behaviour a hand-rolled tablist has to implement comes free and correct.
 *   · Every panel is in the HTML at all times, so all ten packages are
 *     indexable and findable with the browser's own find-in-page.
 *   · With JS off it still works.
 *
 * The inputs are hidden with `.mm-visually-hidden` (clip-path), NOT
 * `display: none` — a display-none radio is not focusable and the whole thing
 * would stop being keyboard-operable.
 *
 * TWO PANEL LAYOUTS, and the difference is not decorative. `compare` panels put
 * their cards in columns because the cards are ALTERNATIVES and the reader has
 * a choice to make; every other tab holds one package, which has nothing to be
 * compared against, so it gets the width instead.
 *
 * THE COMPARISON IS A REAL <table>. Asked for: things that appear across all
 * three tiers must sit on the same line. Grid rows sized to the tallest cell is
 * exactly what a table row already is, so this is the mechanism rather than a
 * fallback — and `scope="col"` means a screen reader announces "Elevated: 20+
 * pieces of content" instead of reading three lists in a row.
 *
 * NO PRICES ANYWHERE. Deck p8, confirmed by the client. `commitment` on each
 * card is what stands in for them.
 */
export default function PackagesPage() {
  return (
    <div className="pkg mmc">
      <ChromeHeader current="/packages" />

      <main className="pkg__main">
        <header className="pkg__masthead">
          <p className="pkg__edge">{packagesPage.edge}</p>

          <div className="pkg__masthead-body">
            <h1 className="pkg__title">{packagesPage.title}</h1>

            <div className="pkg__masthead-foot">
              <p className="pkg__standfirst">{packagesPage.standfirst}</p>

              <p className="pkg__mark">
                [ {packagesPage.mark.range} ]
                <br />
                {packagesPage.mark.label}
              </p>
            </div>
          </div>
        </header>

        {/* Inputs, tab bar and panels are siblings in ONE element, because the
            whole mechanism is `~` — a general sibling selector can only see
            forwards from the checked input, so the inputs must come first and
            everything they drive must be their sibling, not their nephew. */}
        <div className="pkg__tabbed">
          {packageTabs.map((tab, i) => (
            <input
              key={tab.key}
              type="radio"
              name={TAB_GROUP}
              id={`pkg-tab-${tab.key}`}
              className="pkg__radio mm-visually-hidden"
              defaultChecked={i === 0}
            />
          ))}

          {/* Two elements, because the bar scrolls and the track does not: the
              track is exactly as wide as its labels, which is what lets them
              centre when they fit and slide sideways when they do not — and
              what makes the moving rule's offsets meaningful, since it is
              positioned against the track rather than the scrollport. */}
          <div className="pkg__tabbar">
            <div className="pkg__tabtrack" role="group" aria-label="Choose a package">
              {packageTabs.map((tab) => (
                <label key={tab.key} htmlFor={`pkg-tab-${tab.key}`} className="pkg__tab">
                  {tab.label}
                </label>
              ))}

              <TabLine name={TAB_GROUP} />
            </div>
          </div>

          <div className="pkg__panels">
            {packageTabs.map((tab) =>
              tab.compare ? (
                <section
                  key={tab.key}
                  className="pkg__panel"
                  data-panel={tab.key}
                  aria-label={tab.label}
                >
                  <table className="pkg__matrix">
                    <caption className="mm-visually-hidden">
                      {tab.label} packages compared
                    </caption>

                    <thead>
                      <tr>
                        {tab.cards.map((card) => (
                          <th
                            key={card.slug}
                            id={card.slug}
                            scope="col"
                            className="pkg__col-head"
                          >
                            <span className="pkg__num">{card.number}</span>
                            <span className="pkg__name">{card.name}</span>
                            {/* Doing the job the price would have done: the
                                shape of the spend, in the annotation register. */}
                            <span className="pkg__commitment">{card.commitment}</span>
                            <span className="pkg__positioning">{card.positioning}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {socialMatrix.map((row) => (
                        <tr key={row.label}>
                          {row.cells.map((cell, i) => (
                            <td
                              key={tab.cards[i].slug}
                              className={`pkg__cell${cell ? "" : " pkg__cell--absent"}`}
                            >
                              {/* The row's name is spoken but not shown: on
                                  screen every cell says what it is ("20+ pieces
                                  of content"), so a label column would repeat
                                  each row four times. A dash has no such luxury
                                  — without this it is announced as nothing. */}
                              <span className="mm-visually-hidden">{row.label}: </span>
                              {cell ?? <span aria-hidden="true">—</span>}
                              {!cell && <span className="mm-visually-hidden">Not included</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>

                    <tfoot>
                      <tr>
                        {tab.cards.map((card) => (
                          <td
                            key={card.slug}
                            className="pkg__col-foot"
                          >
                            {/* A wrapper, because the two links have to stack and
                                `display: flex` on the <td> itself would drop the
                                cell out of the table's column sizing. */}
                            <div className="pkg__foot-stack">
                              <Link
                                href={packagesPage.bespoke.href}
                                className="mm-cta-bracket pkg__card-cta"
                              >
                                {packagesPage.bespoke.label}
                                <span className="mm-visually-hidden"> about {card.name}</span>
                              </Link>

                              <ServiceLink card={card} />
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tfoot>
                  </table>
                </section>
              ) : (
                <section
                  key={tab.key}
                  className="pkg__panel"
                  data-panel={tab.key}
                  aria-label={tab.label}
                >
                  {tab.cards.map((card) => (
                    <article key={card.slug} id={card.slug} className="pkg__single">
                      <div className="pkg__single-head">
                        <span className="pkg__num">{card.number}</span>
                        <h3 className="pkg__name">{card.name}</h3>
                        <p className="pkg__commitment">{card.commitment}</p>
                        <p className="pkg__positioning">{card.positioning}</p>

                        <div className="pkg__single-foot">
                          <Link
                            href={packagesPage.bespoke.href}
                            className="mm-cta-bracket pkg__card-cta"
                          >
                            {packagesPage.bespoke.label}
                          </Link>
                          <ServiceLink card={card} />
                        </div>
                      </div>

                      <div className="pkg__single-body">
                        <p className="pkg__includes-label">{packagesPage.includesLabel}</p>
                        <ul className="pkg__includes">
                          {card.includes?.map((include) => (
                            <li key={include} className="pkg__include">
                              {include}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  ))}
                </section>
              ),
            )}
          </div>
        </div>

        {/* The bespoke offer and the page's closing CTA are one band. See the
            note on `bespoke` in content/packages.ts — every card already ends in
            Enquire, so a generic "let's work together" underneath this would be
            the third ask on one screen. */}
        <section className="pkg__bespoke" aria-labelledby="pkg-bespoke-heading">
          <p className="pkg__price-note">{packagesPage.priceNote}</p>

          <h2 id="pkg-bespoke-heading" className="pkg__bespoke-heading">
            {packagesPage.bespoke.heading}
          </h2>

          <p className="pkg__bespoke-line">{packagesPage.bespoke.line}</p>

          <Link href={packagesPage.bespoke.href} className="mm-cta-bracket pkg__bespoke-cta">
            {packagesPage.bespoke.label}
          </Link>
        </section>
      </main>

      <ChromeFooter />
    </div>
  );
}

/**
 * Rule 3 in content/packages.ts: every package points back at the service it
 * draws on, so the commitment and the discipline read as two views of one thing
 * rather than as two menus.
 */
function ServiceLink({ card }: { card: { service: { label: string; href: string } } }) {
  return (
    <Link href={card.service.href} className="pkg__service-link">
      {card.service.label}
      {/* The gap is a margin, not a space in the string: the arrow is
          inline-block so it can slide on hover, and leading whitespace inside an
          inline-block is collapsed away. */}
      <span className="pkg__service-arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
