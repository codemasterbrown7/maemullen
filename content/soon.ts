/**
 * The pages that exist in the navigation but are not built yet.
 *
 * WHY THEY EXIST AS PAGES AT ALL. The header carries six links and only two of
 * them lead anywhere — /about, /packages, /work and /enquire are all still to
 * come, and /services links out at /packages and /enquire as well. On a live
 * site every one of those is a dead end, and a dead end that returns the host's
 * default 404 reads as a broken site rather than an unfinished one. These give
 * each of them a real page instead: what is coming, and a way onward.
 *
 * WHAT GOES IN THE `contents` LISTS. Only what docs/SITEMAP.md §4 already
 * commits to. Nothing here previews an OPEN question — the packages page does
 * not name its tiers (§4.4 Q2 has Gold/Silver/Bronze against
 * Essential/Signature/Elevated unresolved, with "Elevated" currently on the
 * cheapest tier), and /work names only Bendito, the one project confirmed to
 * have cleared assets. Announcing a decision that has not been made is worse
 * than announcing nothing.
 *
 * The `standfirst` lines are the only copy on this site not taken from the
 * deck, for the obvious reason that the deck has nothing to say about pages
 * that do not exist yet. They are placeholders in the same sense as
 * `footer.emailPlaceholder` — deliberately plain, and Laura and Poppy should
 * rewrite them in their own voice whenever they like.
 */

export type SoonPage = {
  /** Route it sits at — also what marks the matching nav link. */
  href: string;
  /** Set huge, in the display face. Stored in real case; CSS uppercases it. */
  title: string;
  /** Browser title. Kept distinct from `title`, which is a single word. */
  metaTitle: string;
  description: string;
  /** One sentence under the title. */
  standfirst: string;
  /** What will be on the page. Rendered as a contents page for it. */
  contents: string[];
};

/** The mono mark in the masthead, where /services carries `[ 001–007 ]`. */
export const soonMark = "In progress";

/**
 * The block at the foot. Every one of these pages is a dead end by definition,
 * so it has to hand the visitor somewhere real — and /enquire, the site's usual
 * next step, is itself one of the unbuilt pages. Services and Instagram are
 * what is actually live.
 */
export const soonOnward = {
  heading: "In the meantime",
  links: [{ label: "See the services", href: "/services" }],
  /** Rendered only if a handle is configured; the href comes from site.ts. */
  instagramLabel: "Follow on Instagram",
};

export const soonPages: Record<string, SoonPage> = {
  about: {
    href: "/about",
    title: "About",
    metaTitle: "About",
    description: "Where MaeMüllen came from, and the two people behind it.",
    standfirst: "Where MaeMüllen came from, and the two people behind it.",
    // Deck p9's own three requirements — "info about us · picture of us ·
    // poppys doodles" — read back as page contents rather than as a checklist.
    contents: ["How MaeMüllen started", "Laura and Poppy", "Poppy's doodles"],
  },

  packages: {
    href: "/packages",
    title: "Packages",
    metaTitle: "Packages",
    description: "How we work together month to month, and what that includes.",
    standfirst: "How we work together month to month, and what that includes.",
    // No tier names: see the note at the top of this file.
    contents: ["Three monthly packages", "What each one includes", "The TikTok add-on"],
  },

  work: {
    href: "/work",
    title: "Work",
    metaTitle: "Selected work",
    description: "Selected projects, one screen each.",
    standfirst: "Selected projects, one screen each.",
    // Bendito is the only project with cleared assets and a confirmed name
    // (SITEMAP §4.5), so it is the only one named.
    contents: [
      "Three projects, one screen each",
      "Bendito's hand-drawn menu",
      "The thinking behind each one",
    ],
  },

  enquire: {
    href: "/enquire",
    title: "Enquire",
    metaTitle: "Enquire",
    description: "The form that starts a project.",
    standfirst:
      "The form that starts a project. Until it lands, Instagram is the quickest way to reach us.",
    // The three groups the field list in SITEMAP §4.6 falls into.
    contents: ["Who you are, and where to find you", "What your brand needs", "The services you're after"],
  },
};

/**
 * 404 — SITEMAP §4.7: "Wordmark, a short line in the brand voice, and a link
 * home. Low effort, but it should not look like a default." The wordmark comes
 * with the shared chrome, so all this carries is the line.
 *
 * It shares the in-progress page's layout because on a site this size the two
 * really are the same situation seen from either end: most ways to land here
 * are a link to a page that has not been made yet.
 */
export const notFoundPage = {
  mark: "404",
  title: "Not found",
  metaTitle: "Page not found",
  description: "That page isn't here.",
  standfirst:
    "That page isn't here. It may be one we haven't made yet, or the address may have a typo in it.",
};
