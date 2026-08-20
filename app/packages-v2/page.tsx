import type { Metadata } from "next";
import Link from "next/link";
import { ChromeFooter, ChromeHeader } from "@/components/chrome/SiteChrome";
import {
  packageTabs,
  packagesDescription,
  packagesPage,
  socialMatrix,
} from "@/content/packages";
import { siteName } from "@/content/site";
import "./receipt.css";

export const metadata: Metadata = {
  title: `Packages (receipt) — ${siteName}`,
  description: packagesDescription,
  /* A comparison page, not a route anyone should land on from a search. */
  robots: { index: false, follow: false },
};

const TAB_GROUP = "rcpt-tab";

/**
 * /packages-v2 — the packages as receipts. Built 2026-08-20 alongside
 * /packages-v3 so the two can be looked at side by side against the live
 * /packages; whichever wins gets folded back and both of these routes go.
 *
 * NOTHING HERE IS NEW CONTENT. Every string still comes out of
 * content/packages.ts, so the three pages can only differ in how they look.
 *
 * WHY THE ROWS STILL LINE UP WITHOUT A TABLE. /packages uses a real <table>
 * because the tiers have to compare row by row. A receipt cannot: its whole
 * form is one column of item-and-figure. What replaces the table here is that
 * every card renders EVERY row of socialMatrix in the same order, and the left
 * side of each row is the shared `label` rather than the tier's own wording —
 * so the three columns wrap identically and land on the same lines by
 * construction. A tier that lacks a row prints it as an absent line rather
 * than skipping it, which is also how a real receipt shows a zero.
 *
 * THE FIGURE ON THE RIGHT is derived, not authored — see `figure()` below.
 */
export default function PackagesReceiptPage() {
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
                      <article key={card.slug} id={card.slug} className="rcpt__strip">
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
                                <dt className="rcpt__item">{row.label}</dt>
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
                              money slot is: that sentence already exists once on
                              the page as `priceNote`, and inventing a second
                              wording for it would be writing client copy to fill
                              a shape. The slot stays a count. */}
                          <p className="rcpt__meta">
                            {card.number} &nbsp; {tab.label} &nbsp; {siteName}
                          </p>

                          <div className="rcpt__barcode" aria-hidden="true" data-seed={cardIndex} />

                          <div className="rcpt__foot">
                            <Link
                              href={packagesPage.bespoke.href}
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
              </section>
            ))}
          </div>
        </div>

        <section className="rcpt__bespoke">
          <p className="rcpt__price-note">{packagesPage.priceNote}</p>
          <h2 className="rcpt__bespoke-heading">{packagesPage.bespoke.heading}</h2>
          <p className="rcpt__bespoke-line">{packagesPage.bespoke.line}</p>
          <Link href={packagesPage.bespoke.href} className="mm-cta-bracket rcpt__bespoke-cta">
            {packagesPage.bespoke.label}
          </Link>
        </section>
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
