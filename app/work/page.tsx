import type { Metadata } from "next";
import Link from "next/link";
import { ChromeFooter, ChromeHeader } from "@/components/chrome/SiteChrome";
import { siteName } from "@/content/site";
import { projects, workDescription, workPage, type Hero, type Project } from "@/content/work";
import { asset } from "@/lib/asset";
import "./work.css";

export const metadata: Metadata = {
  title: `Portfolio — ${siteName}`,
  description: workDescription,
};

/**
 * /work — the portfolio. Built 2026-08-24, replacing the in-progress stub.
 *
 * Four bands, each one a hero plate you click to open. It is the deck's own
 * spec for this page (p19: "3 photos take up the whole screen click to view
 * desctiption") with the count corrected to four and the reveal moved out from
 * over the photograph — putting the description on top of the picture hides the
 * thing the visitor clicked to look at.
 *
 * ── THE SIGNATURE: THE SPLIT NAME ─────────────────────────────────────────
 *
 * Every project's name straddles the bottom edge of its own plate — cream where
 * it crosses the picture, black where it drops onto the cream page, split
 * exactly on the edge. One word, two colours, cut by the image.
 *
 * It is two copies of the same string, not one clever element. The cream copy
 * lives INSIDE the plate, which clips it; the black copy sits outside at the
 * identical offset, so the picture's own bottom edge is the cut line and it
 * stays exact at every width without a single coordinate. See work.css for why
 * that beats background-clip and why the black copy is the one in the heading.
 *
 * This is the page's one loud gesture and the rest is deliberately quiet: no
 * scroll-drawn line (that is /services' and belongs only there), no receipt, no
 * scatter, one blue accent that appears on hover and on open.
 *
 * ── NO JAVASCRIPT ─────────────────────────────────────────────────────────
 *
 * The bands are native <details>. The site is a static export, so this stays a
 * server component and the page ships no JS of its own — and the element is
 * simply the right one: it is keyboard-operable for free, every project's copy
 * is in the HTML whether or not it is open (so find-in-page and indexing both
 * work), and with JS off nothing changes. /packages reaches for a CSS radio
 * group because its tabs are one-of-a-set; these are independent, so they are
 * checkboxes in spirit and <details> in fact.
 *
 * ── WHAT THE LABEL IS FOR ─────────────────────────────────────────────────
 *
 * The block of facts beside the prose is not a spec sheet for its own sake:
 * the "We made" rows link into the matching sections of /services, so each
 * project is evidence for a service rather than a picture next to one. The
 * links are built by name in content/work.ts, which fails the build rather
 * than rotting if a service is ever renamed.
 */

/** The plate. Everything that varies between the three hero kinds is here, so
 *  the band below stays one shape whether or not a project has photography. */
function Plate({ hero }: { hero: Hero }) {
  if (hero.kind === "pending") {
    return (
      <div className="pf__pending">
        <p className="pf__pending-note">{hero.note}</p>
      </div>
    );
  }

  if (hero.kind === "pair") {
    return (
      <div className="pf__pair">
        {hero.cells.map((cell) => (
          <img
            key={cell.src}
            src={asset(cell.src)}
            alt={cell.alt}
            className="pf__img"
            width={cell.dim[0]}
            height={cell.dim[1]}
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>
    );
  }

  return (
    <img
      src={asset(hero.src)}
      alt={hero.alt}
      className="pf__img"
      width={hero.dim[0]}
      height={hero.dim[1]}
      loading="lazy"
      decoding="async"
    />
  );
}

function Band({ project }: { project: Project }) {
  return (
    <details className="pf__band" id={project.slug}>
      <summary className="pf__summary">
        {/* The clipping box. The cream half of the name is inside it and the
            black half is its sibling — see the note at the top of the file. */}
        <div className="pf__frame">
          <div className="pf__crop" data-hero={project.hero.kind}>
            <Plate hero={project.hero} />

            {/* Decorative by definition: it is the same string as the heading
                below, and a screen reader announcing the project twice would be
                reading the seam rather than the name. */}
            <span className="pf__name pf__name--over" aria-hidden="true">
              {project.name}
            </span>
          </div>

          {/* The real heading. It carries the whole name, not the visible
              half — the plate above simply paints over its top. */}
          <h2 className="pf__name pf__name--under">{project.name}</h2>
        </div>

        <div className="pf__bar">
          <p className="pf__discipline">{project.discipline}</p>

          {/* Both states are in the DOM and CSS shows one, so the label cannot
              lag the element it describes. `aria-hidden` because <summary> is
              already announced as an expandable control with its own state —
              "Open" read after that is a second, contradictory answer. */}
          <span className="pf__toggle mm-cta-bracket" aria-hidden="true">
            <span className="pf__toggle-closed">{workPage.toggle.closed}</span>
            <span className="pf__toggle-open">{workPage.toggle.open}</span>
          </span>
        </div>
      </summary>

      <div className="pf__detail">
        <div className="pf__prose">
          {project.prose.map((paragraph) => (
            <p key={paragraph} className="pf__para">
              {paragraph}
            </p>
          ))}

          {project.stills?.map((still) => (
            <figure key={still.src} className="pf__still">
              <img
                src={asset(still.src)}
                alt={still.alt}
                className="pf__still-img"
                width={still.dim[0]}
                height={still.dim[1]}
                loading="lazy"
                decoding="async"
              />
              <figcaption className="pf__still-note">{still.caption}</figcaption>
            </figure>
          ))}
        </div>

        {/* A description list, because that is what it is: a term and the
            things under it. The rows line up on a two-column grid rather than
            with leaders — the dotted leader belongs to /packages' receipt. */}
        <dl className="pf__label">
          {project.year && (
            <div className="pf__row">
              <dt className="pf__term">Year</dt>
              <dd className="pf__def">{project.year}</dd>
            </div>
          )}

          {project.label.map((row) => (
            <div key={row.term} className="pf__row">
              <dt className="pf__term">{row.term}</dt>
              <dd className="pf__def">
                {row.items.map((item) => {
                  if (!item.href) return <span key={item.text}>{item.text}</span>;

                  /* Off-site links get target and rel; the /services anchors
                     are the same site and keep normal navigation. */
                  const external = item.href.startsWith("http");
                  return external ? (
                    <a
                      key={item.text}
                      className="pf__link pf__link--out"
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <Link key={item.text} className="pf__link" href={item.href}>
                      {item.text}
                    </Link>
                  );
                })}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </details>
  );
}

export default function WorkPage() {
  return (
    <div className="pf mmc">
      <ChromeHeader current="/work" />

      <main className="pf__main">
        {/* Short on purpose. The work is the thesis of a portfolio, so the
            masthead's job is to get out of the way of the first plate rather
            than to fill a screen of its own. */}
        <header className="pf__masthead">
          <p className="pf__edge">{workPage.edge}</p>

          <div className="pf__masthead-body">
            <h1 className="pf__title">{workPage.title}</h1>
            <p className="pf__standfirst">{workPage.standfirst}</p>
          </div>
        </header>

        <div className="pf__bands">
          {projects.map((project) => (
            <Band key={project.slug} project={project} />
          ))}
        </div>

        {/* The site's single conversion goal, in the same shape /services ends
            on — minus the drawn flourish, which is that page's alone. */}
        <section className="pf__cta" aria-labelledby="pf-cta-heading">
          <h2 id="pf-cta-heading" className="pf__cta-heading">
            {workPage.cta.heading}
          </h2>
          <Link href={workPage.cta.href} className="mm-cta-bracket pf__cta-link">
            {workPage.cta.label}
          </Link>
        </section>
      </main>

      <ChromeFooter />
    </div>
  );
}
