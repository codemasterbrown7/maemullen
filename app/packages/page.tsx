import type { Metadata } from "next";
import Link from "next/link";
import { ChromeFooter, ChromeHeader } from "@/components/chrome/SiteChrome";
import { enquireHref } from "@/content/enquiry-subjects";
import {
  packageTabs,
  packagesDescription,
  packagesPage,
  socialMatrix,
} from "@/content/packages";
import { siteName } from "@/content/site";
import "./receipt.css";

export const metadata: Metadata = {
  title: `Packages — ${siteName}`,
  description: packagesDescription,
};

const TAB_GROUP = "rcpt-tab";

/**
 * Which crumpled sheet a given strip gets.
 *
 * THE BUG THIS FIXES. The crumple was keyed off `:nth-child`, and seven of the
 * nine tabs hold exactly one package — so every one of them matched
 * `nth-child(1)` and got the same sheet. Only the social comparison, with three
 * strips, ever showed more than one. Every single-package tab was the identical
 * piece of paper (2026-08-21).
 *
 * Numbering is global across the whole page rather than per panel, so no two
 * strips anywhere share a sheet — including across tabs, which is where it was
 * visible.
 *
 * TWELVE VARIANTS OUT OF THREE SHEETS. The CSS carries three generated sheets
 * and flips each one four ways (as-is, mirrored, inverted, both). A crumple has
 * no grain direction and no readable orientation, so a flipped sheet reads as a
 * different sheet — and it costs nothing, where three more generated sheets
 * would be roughly 12KB gzipped each. Ten strips into twelve variants means
 * every one is distinct with room to spare.
 */
const sheetOfStrip = (() => {
  const index = new Map<string, number>();
  let n = 0;
  for (const tab of packageTabs) {
    for (const card of tab.cards) index.set(`${tab.key}/${card.slug}`, n++);
  }
  return (tabKey: string, slug: string) => (index.get(`${tabKey}/${slug}`) ?? 0) % 12;
})();

/**
 * /packages — one receipt per thing you can buy.
 *
 * WHY A RECEIPT. Chosen on 2026-08-21 out of three directions built side by
 * side: the card version this replaces, a paper version, and this. What made
 * it the answer is that it was barely a costume — the page already spoke IBM
 * Plex Mono for every annotation on it, so an item-and-figure list with dotted
 * leaders and a total was a register it was half in already. The references
 * were the Frank Ocean "blond" receipt and a West Tenth Denim receipt.
 *
 * The other two routes are gone. They duplicated this layout and would have
 * drifted; the history has them if a decision ever needs revisiting.
 *
 * WHY THE ROWS LINE UP WITHOUT A TABLE. The old card version used a real
 * <table>, because the tiers have to compare row by row. A receipt cannot: its
 * whole form is one column of item-and-figure. What replaces the table is that
 * every strip renders EVERY row of socialMatrix in the same order, and the
 * left side of each row is the SHARED `label` rather than the tier's own
 * wording — so the three columns wrap identically and land on the same lines
 * by construction. A tier that lacks a row prints it as an absent line rather
 * than skipping it, which is also how a real receipt shows a zero.
 *
 * THE TABS RUN ON CSS, NOT JAVASCRIPT. One radio group, visually hidden, with
 * the tab bar and the panels as its siblings — `#id:checked ~ … [data-panel]`
 * does the switching. Four things that buys, none of them cleverness for its
 * own sake:
 *
 *   · The site is a static export, so this stays a server component. The page
 *     ships no JavaScript of its own at all.
 *   · A radio group already IS the semantics — one of a set, exactly one
 *     chosen — so arrow-key navigation comes free and correct.
 *   · Every panel is in the HTML at all times, so all ten packages are
 *     indexable and findable with the browser's own find-in-page.
 *   · With JS off it still works.
 *
 * The inputs are hidden with `.mm-visually-hidden` (clip-path), NOT
 * `display: none` — a display-none radio is not focusable and the whole thing
 * would stop being keyboard-operable.
 *
 * NO PRICES ANYWHERE. Deck p8, confirmed by the client. `commitment` on each
 * card is what stands in for them, and the receipt's money line is a count.
 *
 * NOTHING HERE IS NEW CONTENT. Every string comes out of content/packages.ts.
 * The figure on the right of each line is DERIVED — see `figure()` below.
 */
export default function PackagesPage() {
  return (
    <div className="rcpt mmc">
      <ChromeHeader current="/packages" />

      <main className="rcpt__main">
        <header className="rcpt__masthead">
          <p className="rcpt__edge">{packagesPage.edge}</p>
          <h1 className="rcpt__title">{packagesPage.title}</h1>
          <p className="rcpt__standfirst">{packagesPage.standfirst}</p>
        </header>

        <div className="rcpt__tabbed">
          {packageTabs.map((tab, i) => (
            <input
              key={tab.key}
              type="radio"
              name={TAB_GROUP}
              id={`rcpt-tab-${tab.key}`}
              className="rcpt__radio mm-visually-hidden"
              defaultChecked={i === 0}
            />
          ))}

          <div className="rcpt__tabbar">
            <div className="rcpt__tabtrack" role="group" aria-label="Choose a package">
              {packageTabs.map((tab) => (
                <label key={tab.key} htmlFor={`rcpt-tab-${tab.key}`} className="rcpt__tab">
                  {tab.label}
                </label>
              ))}
            </div>
          </div>

          <div className="rcpt__panels">
            {packageTabs.map((tab) => (
              <section
                key={tab.key}
                className="rcpt__panel"
                data-panel={tab.key}
                aria-label={tab.label}
              >
                {tab.enquireOnly ? (
                  /* Nothing to itemise, so nothing is printed. An empty receipt
                     with a total of zero would be a joke at the expense of the
                     person reading it. */
                  <div className="rcpt__bespoke">
                    <h2 className="rcpt__bespoke-heading">{packagesPage.bespoke.heading}</h2>
                    <p className="rcpt__bespoke-line">{packagesPage.bespoke.line}</p>
                    <Link
                      href={enquireHref(tab.key)}
                      className="mm-cta-bracket rcpt__bespoke-cta"
                    >
                      {packagesPage.bespoke.label}
                    </Link>
                  </div>
                ) : (
                <div className={`rcpt__strips${tab.compare ? " rcpt__strips--three" : ""}`}>
                  {tab.cards.map((card, cardIndex) => {
                    /* The comparison tab reads its rows off the shared matrix so
                       the three line up; every other tab has one package and
                       reads its own `includes`. */
                    const rows = tab.compare
                      ? socialMatrix.map((row) => ({
                          label: row.label,
                          cell: row.cells[cardIndex],
                        }))
                      : (card.includes ?? []).map((include) => ({
                          label: include,
                          cell: include,
                        }));

                    const included = rows.filter((r) => r.cell).length;

                    return (
                      <article
                        key={card.slug}
                        id={card.slug}
                        className="rcpt__strip"
                        data-sheet={sheetOfStrip(tab.key, card.slug)}
                      >
                        {/* Two bars of torn paper, drawn as page-coloured teeth
                            over the strip's own ends. */}
                        <span className="rcpt__tear rcpt__tear--top" aria-hidden="true" />

                        <div className="rcpt__body">
                          <header className="rcpt__head">
                            <p className="rcpt__brand">{siteName}</p>
                            <h2 className="rcpt__name">{card.name}</h2>
                            <p className="rcpt__sub">{card.commitment}</p>
                          </header>

                          <p className="rcpt__positioning">{card.positioning}</p>

                          <div className="rcpt__rule" aria-hidden="true" />

                          <dl className="rcpt__lines">
                            {rows.map((row) => (
                              <div
                                key={row.label}
                                className={`rcpt__line${row.cell ? "" : " rcpt__line--absent"}`}
                              >
                                <dt className="rcpt__item">
                                  {/* The strike is on the words, not the row:
                                      a rule drawn through the leader dots and
                                      the figure as well reads as a crossed-out
                                      receipt line rather than as an item this
                                      tier does not have. */}
                                  <span className="rcpt__item-text">{row.label}</span>
                                </dt>
                                <span className="rcpt__leader" aria-hidden="true" />
                                <dd className="rcpt__figure">
                                  {row.cell ? (
                                    figure(row.label, row.cell)
                                  ) : (
                                    <>
                                      <span aria-hidden="true">0</span>
                                      <span className="mm-visually-hidden">Not included</span>
                                    </>
                                  )}
                                </dd>
                              </div>
                            ))}
                          </dl>

                          <div className="rcpt__rule" aria-hidden="true" />

                          {/* Where a receipt puts the money. There are no prices
                              on this site (deck p8, confirmed), so the total is
                              a count and the money line says so instead. */}
                          <div className="rcpt__total">
                            <span className="rcpt__item">Total included</span>
                            <span className="rcpt__leader" aria-hidden="true" />
                            <span className="rcpt__figure">{included}</span>
                          </div>

                          {/* No "quoted per brand" line here, tempting as the
                              money slot is. Inventing a wording for it would be
                              writing client copy to fill a shape, and Bespoke
                              already makes the point in its own tab. The slot
                              stays a count. */}
                          <p className="rcpt__meta">
                            {card.number} &nbsp; {tab.label} &nbsp; {siteName}
                          </p>

                          <div className="rcpt__foot">
                            <Link
                              href={enquireHref(card.slug)}
                              className="mm-cta-bracket rcpt__cta"
                            >
                              {packagesPage.bespoke.label}
                              <span className="mm-visually-hidden"> about {card.name}</span>
                            </Link>

                            <Link href={card.service.href} className="rcpt__service">
                              {card.service.label}
                            </Link>
                          </div>
                        </div>

                        <span className="rcpt__tear rcpt__tear--bottom" aria-hidden="true" />
                      </article>
                    );
                  })}
                </div>
                )}
              </section>
            ))}
          </div>
        </div>

      </main>

      <ChromeFooter />
    </div>
  );
}

/**
 * The figure a receipt prints in its right-hand column.
 *
 * A receipt is a list of things and their amounts, and the deck's copy is
 * neither — it is eleven full sentences. Rather than rewrite any of it (copy in
 * content/ is the client's and is verbatim), this takes the row's shared label
 * as the item and prints only what the tier's own wording ADDS to it:
 *
 *   "Pieces of content"      + "8 pieces of content"        → 8
 *   "Instagram Stories"      + "Daily Instagram Stories"    → Daily
 *   "Performance report"     + "…& recommendations"         → & recommendations
 *   "Content calendar"       + "Content calendar"           → ✓  (adds nothing)
 *
 * The singular/plural retry is what catches "1 content creation session"
 * against a label of "Content creation sessions". Anything that still does not
 * split cleanly falls back to printing the cell whole, which is never wrong,
 * only long — this must not be able to drop content on the floor.
 */
function figure(label: string, cell: string): string {
  const item = cell.trim();
  const lower = item.toLowerCase();

  const candidates = [label.trim().toLowerCase()];
  if (candidates[0].endsWith("s")) candidates.push(candidates[0].slice(0, -1));

  for (const name of candidates) {
    if (lower === name) return "✓";
    if (lower.endsWith(name)) {
      const rest = item.slice(0, item.length - name.length).trim();
      if (rest) return rest;
    }
    if (lower.startsWith(name)) {
      const rest = item.slice(name.length).trim();
      if (rest) return rest;
    }
  }

  return item;
}
