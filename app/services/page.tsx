import type { Metadata } from "next";
import Link from "next/link";
import { ChromeFooter, ChromeHeader } from "@/components/chrome/SiteChrome";
import { ScrollThread } from "@/components/ui/scroll-thread";
import { serviceEntries, servicesDescription, servicesPage } from "@/content/services";
import { siteName } from "@/content/site";
import { asset } from "@/lib/asset";
import "./services.css";

export const metadata: Metadata = {
  title: `Services — ${siteName}`,
  description: servicesDescription,
};

/**
 * /services — built on /v3's chrome, which is the design every new page starts
 * from, plus the pieces of the Claude Design landing page the client picked:
 * vertical edge type, `[ 00x ]` marks in the mono annotation register, the
 * 001–007 index, a photo plate carrying its caption vertically beside it, and
 * copy alternating left and right down the page.
 *
 * NO MARQUEE. The band is chrome on /v3 and on /, but it lists these seven
 * services and links into these seven anchors, so on this page it was the
 * contents of the page repeated above the contents of the page. The index does
 * that job properly.
 *
 * THE LINE. components/ui/scroll-thread draws itself as you scroll: a knot of
 * loops in the masthead, one strand down the page with a single loop-the-loop
 * in it, a stroke that rules under "Let's work together", and a closing flourish
 * off the end of that rule.
 *
 * THE ORDER IS THE POINT AT THE FOOT: rule first, flourish after. It ran the
 * other way round — tangle, then rule — and the note was that underlining and
 * then flourishing reads better, which it does: the rule is the statement and
 * the knot is the sign-off.
 *
 * The masthead knot deliberately runs BEHIND the display type — that is where
 * the reference gets its scale, and a 160px word can carry a stroke across it.
 * The closing one does NOT: it sits past the last letter and above the rule,
 * because down there the same treatment landed on a 79px line and on the rule
 * underneath it at once. That knot is also the only one tuned: the masthead's
 * shape is settled and everything about it is defaulted, so nothing done for the
 * foot of the page can reach it.
 *
 * It is not placed by coordinates: it reads the real layout through the
 * `data-thread` attributes below and routes itself through the empty lane,
 * which is what guarantees it never crosses a word at any viewport width. Each
 * section declares which fraction of the page width is its empty half in
 * content/services.ts.
 *
 * The alternation is not a mirror. Sides swap, the offsets differ, only four
 * sections carry edge type and only one has a photograph. A perfect zigzag was
 * the thing to avoid.
 *
 * PRICES ARE DELIBERATELY ABSENT. Deck p8: "dont include prices on website".
 * The real figures are in content/services.ts and simply never rendered.
 */
export default function ServicesPage() {
  return (
    <div className="svc mmc">
      <ChromeHeader current="/services" />

      <main className="svc__main">
        <ScrollThread />

        <header className="svc__masthead">
          <p className="svc__edge svc__edge--up">{servicesPage.edge}</p>

          {/* Title, summary and marks all stack in the left column. They used
              to run title-left / summary-right, which left the small type
              sitting exactly where the ornament wants to be — and 11px mono behind
              a 14px stroke is unreadable in a way a 160px headline is not. */}
          <div className="svc__masthead-body">
            <h1 className="svc__title">{servicesPage.title}</h1>
            <p className="svc__standfirst">{servicesPage.standfirst}</p>
            <div className="svc__masthead-foot">
              <p className="svc__mark">
                [ {servicesPage.mark.range} ]
                <br />
                {servicesPage.mark.label}
              </p>
              <Link href={servicesPage.cta.href} className="mm-cta-bracket svc__bracket">
                {servicesPage.cta.label}
              </Link>
            </div>
          </div>

          {/* Empty by design: the room the opening ornament is drawn into. It
              is an element rather than a coordinate so it moves with the
              layout. Swap data-thread to "flower" for the five-petal version. */}
          <div className="svc__ornament" data-thread="knot" data-thread-exit="50" />
        </header>

        {/* Plain fragment links, so the jump costs no JS and works from
            anywhere else on the site; the smooth scroll comes from
            `html { scroll-behavior: smooth }` in globals.css, which turns
            itself off under reduced motion.

            The line passes this at 0.965 — hard against the right margin,
            outside the arrows, because an index row is full-width and has no
            empty half to run down. */}
        <nav className="svc__index" aria-label="Services index" data-thread="pass" data-thread-x="0.965">
          <ol className="svc__index-list">
            {serviceEntries.map((service) => (
              <li key={service.anchor}>
                <a href={`#${service.anchor}`} className="svc__index-row">
                  <span className="svc__index-num">{service.number}</span>
                  <span className="svc__index-name">{service.name}</span>
                  <span className="svc__index-arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <ol className="svc__list">
          {serviceEntries.map((service) => (
            <li
              key={service.anchor}
              id={service.anchor}
              className={`svc__item svc__item--${service.side}`}
              style={{ ["--svc-offset" as string]: service.offset ?? 0 }}
              data-thread="pass"
              data-thread-x={service.threadX}
              data-thread-loop={service.threadLoop}
            >
              {service.edge && (
                <p
                  className={`svc__edge ${
                    service.side === "left" ? "svc__edge--up" : "svc__edge--down"
                  }`}
                >
                  {service.edge}
                </p>
              )}

              <div className="svc__body">
                {/* Decorative: the ordered list already carries position, and
                    "bracket zero zero five bracket" before every heading is
                    noise. The heading itself is the service's name. */}
                <p className="svc__mark" aria-hidden="true">
                  [ {service.number} ]
                </p>

                <h2 className="svc__name">{service.name}</h2>

                <p className="svc__statement">{service.statement}</p>

                {service.prose.map((paragraph) => (
                  <p key={paragraph} className="svc__prose">
                    {paragraph}
                  </p>
                ))}

                {service.includes.map((group, index) => (
                  <div key={group.label ?? index} className="svc__group">
                    {group.label && <p className="svc__group-label">{group.label}</p>}
                    <ul className="svc__includes">
                      {group.items.map((item) => (
                        <li key={item} className="svc__include">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {service.link && (
                  <Link href={service.link.href} className="mm-cta-bracket svc__bracket">
                    {service.link.label}
                  </Link>
                )}
              </div>

              {/* Photographs dotted down the section's empty half — small,
                  unequal, hard-edged, no frame. They go in the same grid column
                  the line runs down, so the stroke passes behind them exactly
                  as it did behind the Bendito plate. Sizes and offsets come from
                  content/services.ts; there are no coordinates here.

                  Every one is annotated, because bare plates read as floating.
                  Two placements, and the difference is only where the type sits:
                  `edge` runs "I — LABEL" up the outer side of the picture,
                  `foot` splits the numeral and the label to opposite ends of a
                  line beneath it. Both are one register — Roman numeral, then a
                  short label — so the page gains a treatment, not a system. */}
              {service.plates && (
                <div className="svc__scatter">
                  {service.plates.map((plate) => (
                    <figure
                      key={plate.src}
                      className={`svc__snap svc__snap--${plate.note.place}`}
                      style={{
                        ["--snap-w" as string]: `${plate.w}rem`,
                        ["--snap-x" as string]: `${plate.x ?? 0}%`,
                        ["--snap-y" as string]: plate.y ?? 0,
                      }}
                    >
                      <img
                        src={asset(plate.src)}
                        alt={plate.alt}
                        className="svc__snap-img"
                        width={plate.dim[0]}
                        height={plate.dim[1]}
                        loading="lazy"
                        decoding="async"
                      />

                      <figcaption className="svc__snap-note">
                        {plate.note.place === "foot" ? (
                          <>
                            <span>{plate.note.n}</span>
                            <span>{plate.note.label}</span>
                          </>
                        ) : (
                          /* An em dash rather than two spans: set vertically,
                             the two halves have to read as one line. */
                          `${plate.note.n} — ${plate.note.label}`
                        )}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              )}

              {service.image && (
                /* Caption beside the plate rather than under it, running
                   vertically — the design's own treatment for photography. */
                <figure className="svc__plate">
                  <img
                    src={asset(service.image.src)}
                    alt={service.image.alt}
                    className="svc__plate-img"
                    width={943}
                    height={2000}
                    loading="lazy"
                  />
                  <figcaption className="svc__plate-caption">{service.image.caption}</figcaption>
                </figure>
              )}
            </li>
          ))}
        </ol>

        <section className="svc__cta" aria-labelledby="svc-cta-heading">
          <h2 id="svc-cta-heading" className="svc__cta-heading" data-thread="underline">
            {servicesPage.cta.heading}
          </h2>

          {/* DOCUMENT ORDER IS DRAW ORDER, and this now comes AFTER the heading:
              the line rules under the words and only then runs on into the
              flourish. Asked for directly. It is positioned, so following the
              heading in the markup does not put it below the heading on screen.

              NOT mirrored, unlike the version that sat on the left of the words:
              the line arrives from below now, which is the end the knot starts
              at anyway. */}
          <div
            className="svc__ornament svc__ornament--cta"
            data-thread="knot"
            data-thread-exit="55"
            data-thread-loops="7"
            data-thread-shape="fit"
          />

          {/* The line finishes by aiming at this. `data-thread-exit` above turns
              the flourish's last stroke DOWN and right instead of curling up, so
              it has somewhere to carry on to — that bearing and the arrow are one
              change, not two. */}
          <Link
            href={servicesPage.cta.href}
            className="mm-cta-bracket svc__cta-link"
            data-thread="point"
          >
            {servicesPage.cta.label}
          </Link>
        </section>
      </main>

      <ChromeFooter />
    </div>
  );
}
