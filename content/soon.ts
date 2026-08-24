/**
 * The pages that exist in the navigation but are not built yet — and as of
 * 2026-08-24 there are none. /work was the last one, and it is now the
 * portfolio (app/work/page.tsx, content/work.ts). All six header links lead
 * somewhere real.
 *
 * WHY THE MACHINERY STAYS. `soonPages` is empty rather than deleted because
 * what it is for has not gone away: the moment a seventh link goes in the
 * header ahead of the page behind it, a dead end that returns the host's
 * default 404 reads as a broken site rather than an unfinished one. One entry
 * here plus a four-line route is the whole cost of avoiding that.
 *
 * DELIBERATELY PLAIN, by request (2026-08-04). The first version carried a
 * contents list of what was coming and the scroll-drawn knot from /services;
 * both were cut. The knot belongs to /services and nowhere else, and the job
 * here is to say the page is being built — not to be a small page in its own
 * right. Anything added back should have to earn it.
 */

export type SoonPage = {
  /** Route it sits at — also what marks the matching nav link. */
  href: string;
  /** Set large, in the display face. Stored in real case; CSS uppercases it. */
  title: string;
  /** Browser title. Kept separate from `title`, which is a single word. */
  metaTitle: string;
  /** Meta description only — nothing renders this on the page. */
  description: string;
};

/** The mono mark above the title, where /services carries `[ 001–007 ]`. */
export const soonMark = "In progress";

/**
 * One line, shared by every page that needs it. Per-page wording was the previous
 * version's and went with the rest of it: a variation on "this is being built"
 * per page is a chance to say it slightly differently for no gain.
 */
export const soonLine = "This page is being built. It will be here soon.";

/**
 * Every one of these pages is a dead end by definition, so it has to hand the
 * visitor somewhere real. Services and Instagram are the live routes onward;
 * /enquire — the site's usual next step — is now built too.
 */
export const soonOnward = {
  links: [{ label: "See the services", href: "/services" }],
  /** Rendered only if a handle is configured; the href comes from site.ts. */
  instagramLabel: "Follow on Instagram",
};

export const soonPages: Record<string, SoonPage> = {
  /* Emptied 2026-08-24, when /work shipped as the portfolio — four projects,
     each a hero plate that opens in place. /about, /enquire and /packages left
     ahead of it; /packages' reasoning is recorded at the top of
     content/packages.ts. */
};

/**
 * 404 — docs/SITEMAP.md §4.7: "Wordmark, a short line in the brand voice, and a
 * link home. Low effort, but it should not look like a default." The wordmark
 * comes with the shared chrome, so all this carries is the line.
 *
 * It shares the in-progress layout because on a site this size the two really
 * are the same situation seen from either end: most ways to land here are a link
 * to a page that has not been made yet.
 */
export const notFoundPage = {
  mark: "404",
  title: "Not found",
  metaTitle: "Page not found",
  description: "That page isn't here.",
  line: "That page isn't here. It may be one we haven't made yet, or the address may have a typo in it.",
};
