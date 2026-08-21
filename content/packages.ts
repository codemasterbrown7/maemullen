/**
 * /packages content — deck p8 and p10–p18, via docs/SITEMAP.md §4.4.
 *
 * ── THE SHAPE OF THE PAGE ──────────────────────────────────────────────────
 *
 * ONE TAB PER THING YOU CAN BUY. Eight tabs across the top; clicking one swaps
 * what is underneath. Asked for directly (2026-08-06) — an earlier pass grouped
 * them into four areas ("Content" holding both the content day and UGC) and the
 * note was that each thing should be its own clickable item.
 *
 * The only tab holding more than one card is SOCIAL MEDIA, and that is not an
 * exception to the rule — it is the rule. Essential, Signature and Elevated are
 * three prices for one thing, so they are alternatives to each other and belong
 * side by side. Nothing else on this page is an alternative to anything, so
 * nothing else shares a panel.
 *
 * That history is worth keeping, because the page has now failed twice in the
 * same direction: the first build was one eleven-row accordion ("way way too
 * confusing"), the second grouped nine packages into four areas. Both made the
 * reader work out for themselves which items compete with each other. One tab
 * per package answers it before a word is read.
 *
 * ── WHY THIS PAGE IS NOT /services AGAIN ───────────────────────────────────
 *
 * Every subject here also appears on /services, and that is the trap this file
 * exists to avoid. The axis between them is DISCIPLINE vs COMMITMENT:
 *
 *   /services   What we do. Field by field. Capability and evidence — statement
 *               copy, photography, the drawn thread. Answers "can you do X?"
 *   /packages   How you buy it. Every card is a SHAPE OF COMMITMENT — a month,
 *               a day, a project. Answers "what am I committing to?"
 *
 * The mapping is deliberately NOT one-to-one: social media management is one
 * service and three packages, and PR & events is one service split into two
 * tabs — PR recurs monthly, events are quoted one-off.
 *
 * Three rules keep the pages apart. Break any one and this collapses back into
 * a copy of /services:
 *
 *   1. NAME THE SHAPE, NOT THE FIELD. "Design project", not "Design &
 *      illustration". A field has no end; a project does.
 *   2. NO PROSE AND NO PHOTOGRAPHY. /services carries the statement copy and
 *      the fifteen scatter plates. This page is type and rules only, and there
 *      is no scroll-drawn thread — the knot belongs to /services (see the note
 *      in content/soon.ts).
 *   3. EVERY CARD LINKS BACK to the service it draws on.
 *
 * ── RESOLVED ───────────────────────────────────────────────────────────────
 *
 * · §4.4 OPEN 1, prices — SUPPRESSED SITE-WIDE. Deck p8 puts "dont include
 *   prices on website" at the END of the whole PACKAGES parenthesis, not on
 *   "website building" alone, and the client confirmed it directly. `commitment`
 *   is what replaces them: the SHAPE of the spend rather than the amount. The
 *   real deck figures stay recorded in content/services.ts, unrendered.
 *
 * · §4.4 OPEN 2, naming — METALS DROPPED, WORD-NAMES REMAPPED TO ASCEND. The
 *   deck carries Gold/Silver/Bronze AND Essential/Signature/Elevated, and the
 *   second set is mis-mapped: "Elevated" sat on the CHEAPEST tier and
 *   "Essential" on the dearest. The two broken names swap; Signature does not
 *   move. Metals go because they read as a podium — the entry client is told
 *   they bought bronze. Confirmed 2026-08-06.
 *
 *     deck Bronze  / "Elevated"  →  001 Essential
 *     deck Silver  / Signature   →  002 Signature
 *     deck Gold    / "Essential" →  003 Elevated
 *
 * · PR IS A PACKAGE, NOT AN ADD-ON (client). Its own tab, 007, beside Events.
 *
 * · TIKTOK IS ITS OWN TAB TOO (client, 2026-08-06) — it was a line under the
 *   social tiers and the note was that it should not be "hidden down at the
 *   bottom". It is 006. Its `commitment` still says "alongside any package",
 *   which is the deck's own framing (p13) and the thing that was worth keeping
 *   from treating it as an add-on: it does not replace a package, it joins one.
 *
 * COPY PROVENANCE. Deck wording is marked `verbatim` at the line that uses it.
 * The rest is marked `OURS`. All of it is the client's to reword.
 *
 * Uppercase treatments come from CSS `text-transform`, so strings are stored in
 * their real case (DESIGN.md §3.4).
 */

/** Where a card's detail lives — the service it draws on. */
export type ServiceLink = { label: string; href: string };

export type PackageCard = {
  /** Continuous across every tab, so the page keeps one index: `[ 001–010 ]`. */
  number: string;
  slug: string;
  name: string;
  /**
   * WHAT STANDS IN FOR THE PRICE, and the reason this page works without one.
   * Never an amount — the shape of the spend: a retainer, a day, a fixed fee, a
   * quote.
   */
  commitment: string;
  /** One line under the name: what this is, or who it is for. */
  positioning: string;
  /** Used by every tab EXCEPT social media, which compares on `socialMatrix`. */
  includes?: string[];
  service: ServiceLink;
};

/* NO EMPHASISED PACKAGE. Elevated carried a `[ RECOMMENDED ]` tag, blue ink and
   a heavier rule — three signals, built to a brief about making the top tier
   likelier to be clicked. Cut outright on 2026-08-06: "i dont like the
   recommended effect on the most expensive package. just get rid of it
   altogether."

   The three tiers now differ only in what they say they contain, which the
   comparison rows already make plain. If a recommendation ever comes back it
   should be a deliberate decision with the client rather than a design device —
   and blue is free again, so it stays the page's one unspent accent. */

export type PackageTab = {
  key: string;
  /**
   * The tab label. SHORT — eight of these sit in one row, and the panel
   * underneath immediately gives the full name ("UGC" → "UGC & brand content"),
   * so the tab only has to be a handle, not a title.
   */
  label: string;
  cards: PackageCard[];
  /** Renders the three-column comparison rather than a single wide block. */
  compare?: boolean;
  /**
   * A tab that is not a package. Bespoke has nothing to print — no rows, no
   * total, no figure — so it holds `packagesPage.bespoke` as plain type rather
   * than a receipt (2026-08-21). `cards` stays empty and the panel renders
   * from the bespoke block instead.
   */
  enquireOnly?: boolean;
};

/* ────────────────────────────────────────────────────────────────────────────
   THE SOCIAL MEDIA COMPARISON

   Asked for directly (2026-08-06): "make sure things that are across all 3 are
   on the same line so its easy to compare". So the three tiers are no longer
   three independent lists — they are one matrix, and every row is one feature
   across all three. `null` renders as a dash: this tier does not include it.

   ⚠️ THE DECK'S THREE LISTS DO NOT LINE UP, AND THIS EXPOSES IT. Laid side by
   side they say a cheaper tier includes things a dearer one does not:

     · Signature (p11) never mentions caption writing or content scheduling.
       Essential, BELOW it, lists both.
     · Elevated (p10) never mentions the 2 revisions Signature lists.

   Read literally that is a ladder that goes down as it goes up, which no one
   intends and which the accordion happened to hide — each list was its own
   column and nobody compared them. Aligned into rows it is the first thing you
   see.

   THE ASSUMPTION MADE HERE, AND IT IS AN ASSUMPTION: each tier includes
   everything below it. The lists in the deck are summaries, not contracts, and
   every tiered offer in existence works this way — so the cells below are
   filled cumulatively rather than left as dashes that would misrepresent the
   client's own product. Marked `INHERITED` where that is what is happening.

   CONFIRM WITH LAURA & POPPY. It is a five-minute answer. If any of these is
   genuinely NOT in a tier, set that cell to `null` and the dash comes back.
   ──────────────────────────────────────────────────────────────────────────── */

/** One feature, across the three tiers, in Essential → Signature → Elevated order. */
export type MatrixRow = {
  /** Screen-reader-only row name — the cells are self-describing on screen. */
  label: string;
  cells: [string | null, string | null, string | null];
};

/**
 * ROW ORDER IS LOAD-BEARING: rows run from "in all three tiers" to "in Elevated
 * only", so every column's dashes collect at the BOTTOM of it.
 *
 * Asked for directly (2026-08-06) — the first version grouped rows by subject,
 * which scattered Essential's dashes through the middle of its column and left
 * holes in the list. Sorted by reach, each column now reads as a solid run of
 * what you get, and then stops:
 *
 *     Essential   7 filled, 4 dashes
 *     Signature   9 filled, 2 dashes
 *     Elevated   11 filled, none
 *
 * This only works because the matrix is cumulative (see the note above): no row
 * can be "Essential has it, Signature does not", so the three sets nest and the
 * dashes cannot help but fall at the end. If a cell above is ever set back to
 * `null` to correct the deck, the assertion under this array will catch the
 * hole at build time rather than letting it reappear on the page.
 *
 * Within each band the two quantity rows lead, because 8 → 12–16 → 20+ read
 * across in one glance IS the argument for the ladder, and it should be the
 * first thing the eye does.
 */
export const socialMatrix: MatrixRow[] = [
  /* ── In all three ─────────────────────────────────────────────────────── */
  {
    /* verbatim, deck p10–p12. */
    label: "Pieces of content",
    cells: ["8 pieces of content", "12–16 pieces of content", "20+ pieces of content"],
  },
  {
    /* verbatim, deck p10–p12. */
    label: "Instagram Stories",
    cells: ["8 Instagram Stories", "12 Instagram Stories", "Daily Instagram Stories"],
  },
  {
    /* Verbatim in Essential; INHERITED into Signature and Elevated. */
    label: "Monthly content planning",
    cells: ["Monthly content planning", "Monthly content planning", "Monthly content planning"],
  },
  {
    /* verbatim in all three. */
    label: "Content calendar",
    cells: ["Content calendar", "Content calendar", "Content calendar"],
  },
  {
    /* INHERITED. Essential (p12) lists it; Signature does not; Elevated folds it
       into "Full social media management". */
    label: "Caption writing",
    cells: ["Caption writing", "Caption writing", "Caption writing"],
  },
  {
    /* INHERITED, same reasoning as caption writing. */
    label: "Content scheduling",
    cells: ["Content scheduling", "Content scheduling", "Content scheduling"],
  },
  {
    /* verbatim; Elevated's (p10) adds the recommendations. */
    label: "Performance report",
    cells: [
      "Monthly performance report",
      "Monthly performance report",
      "Performance report & recommendations",
    ],
  },

  /* ── Signature and Elevated ───────────────────────────────────────────── */
  {
    /* verbatim, deck p10–p11. */
    label: "Content creation sessions",
    cells: [null, "1 content creation session", "2 content creation sessions"],
  },
  {
    /* A real distinction, not an oversight: Essential (p12) has monthly content
       planning but no call, and the deck is explicit about it. Kept. */
    label: "Monthly planning call",
    cells: [null, "Monthly planning call", "Monthly planning call"],
  },
  /* A "Revisions" row (deck p11: Signature's "2 revisions") was here and is cut
     on request, 2026-08-06. It was also the only row whose Elevated cell was
     INHERITED purely to stop the ladder reading backwards, so removing it takes
     one of the three deck contradictions off the page rather than papering over
     it. The figure is still in the deck if it is ever wanted back. */

  /* ── Elevated only ────────────────────────────────────────────────────── */
  {
    label: "Full social media management",
    cells: [null, null, "Full social media management"],
  },
  {
    label: "Priority support",
    cells: [null, null, "Priority support"],
  },
];

/**
 * The row order above is a promise the page's layout depends on, so it is
 * checked rather than trusted. Once a column has its first dash, everything
 * below it in that column must be a dash too — otherwise a hole opens in the
 * middle of the list, which is exactly the thing that was rejected.
 *
 * Module scope, so on a static export this runs at BUILD time: reordering
 * `socialMatrix` badly fails `next build` instead of shipping.
 */
["Essential", "Signature", "Elevated"].forEach((tier, column) => {
  const firstGap = socialMatrix.findIndex((row) => row.cells[column] === null);
  if (firstGap === -1) return;

  const stray = socialMatrix.findIndex(
    (row, index) => index > firstGap && row.cells[column] !== null,
  );
  if (stray !== -1) {
    throw new Error(
      `content/packages.ts: socialMatrix leaves a hole in the ${tier} column — ` +
        `"${socialMatrix[stray].label}" is filled but sits below the gap at ` +
        `"${socialMatrix[firstGap].label}". Rows must run from "in all three tiers" ` +
        `down to "in Elevated only" so every column's dashes collect at the end.`,
    );
  }
});

const socialService: ServiceLink = {
  label: "Social media management",
  href: "/services#social-media",
};

export const packageTabs: PackageTab[] = [
  {
    key: "social",
    label: "Social media",
    compare: true,
    cards: [
      {
        number: "001",
        slug: "essential",
        name: "Essential",
        commitment: "Monthly, ongoing",
        /* verbatim, deck p12 (there attached to Bronze). */
        positioning: "Perfect for businesses building a consistent online presence.",
        service: socialService,
      },
      {
        number: "002",
        slug: "signature",
        name: "Signature",
        commitment: "Monthly, ongoing",
        /* verbatim, deck p11. */
        positioning: "Perfect for growing brands ready to elevate their social presence.",
        service: socialService,
      },
      {
        number: "003",
        slug: "elevated",
        name: "Elevated",
        commitment: "Monthly, ongoing",
        /* verbatim, deck p10 (there attached to Gold). */
        positioning: "Perfect for brands looking for a dedicated creative partner.",
        service: socialService,
      },
    ],
  },

  {
    key: "content-days",
    label: "Content days",
    cards: [
      {
        number: "004",
        slug: "content-day",
        name: "Content day",
        commitment: "Half day or full day",
        /* OURS. The deck's own line — "Need a month's worth of content in one
           session?" — is already set verbatim on /services#content-days, and
           repeating it is precisely the duplication this page has to avoid.
           Same claim, said as a shape: one booking, one day, a delivery. */
        positioning:
          "One booking, one day of shooting, and a month of content delivered ready to post.",
        /* verbatim, deck p15. */
        includes: [
          "Reels",
          "TikToks",
          "Photography",
          "Product content",
          "Lifestyle content",
          "Behind the scenes",
          "Staff & team content",
        ],
        service: { label: "Content days", href: "/services#content-days" },
      },
    ],
  },

  {
    key: "ugc",
    label: "UGC",
    cards: [
      {
        number: "005",
        slug: "ugc",
        name: "UGC & brand content",
        commitment: "By the hour, or by the project",
        /* OURS, and it is doing one specific job: drawing the line against the
           content day, the only pair on this page a reader could confuse. A
           content day is a day at your place; this is content made for your
           channels and priced by the time it takes. The deck prices them
           separately for that reason. */
        positioning:
          "Content made for your channels — booked by the hour, or scoped as a campaign.",
        /* Deck p16, less the entries that name the field rather than a
           deliverable ("UGC", "Lifestyle content", "Social-first campaign
           content", "Short-form video production") — those stay on /services,
           where naming the field is the job. */
        includes: [
          "Behind-the-scenes content",
          "Luxury travel & hospitality content",
          "Hotel & destination content",
          "Brand campaigns",
          "Product & lifestyle photography",
          "Reels & TikToks",
          "Event coverage",
        ],
        service: { label: "UGC & brand content", href: "/services#ugc" },
      },
    ],
  },

  {
    key: "tiktok",
    label: "TikTok",
    cards: [
      {
        number: "006",
        slug: "tiktok",
        name: "TikTok management",
        /* The deck's own framing, kept when this stopped being an add-on: it
           does not replace a package, it joins one. */
        commitment: "Monthly, alongside any package",
        /* OURS. */
        positioning: "The same monthly rhythm as a social package, run on TikTok instead.",
        /* verbatim, deck p13. */
        includes: [
          "TikTok strategy",
          "Caption writing",
          "Posting & scheduling",
          "Trend research",
          "Monthly management",
        ],
        service: { label: "TikTok management", href: "/services#tiktok" },
      },
    ],
  },

  {
    key: "pr",
    label: "PR",
    cards: [
      {
        number: "007",
        slug: "pr",
        name: "PR & influencer",
        commitment: "Monthly, ongoing",
        /* OURS. Deck p14's opening line is "Helping brands build meaningful
           relationships", set verbatim on /services#pr-events. */
        positioning: "Ongoing outreach — the relationships that put your brand in front of people.",
        /* verbatim, deck p14 — the PR half. */
        includes: [
          "Influencer outreach",
          "Product gifting",
          "Brand collaborations",
          "Press outreach",
          "Campaign coordination",
          "Event invitations",
        ],
        service: { label: "PR & events", href: "/services#pr-events" },
      },
    ],
  },

  {
    key: "events",
    label: "Events",
    cards: [
      {
        number: "008",
        slug: "event",
        name: "Event",
        commitment: "Quoted by scale",
        /* OURS, compressed from deck p14's "From concept to execution. Whether
           you're launching a new business, hosting a wellness event or planning
           a brand activation, we'll help bring your vision to life." */
        positioning: "From concept to execution — a launch, an activation or a private event.",
        /* verbatim, deck p14 — the Events half. */
        includes: [
          "Event planning",
          "Brand launches",
          "Wellness events",
          "Community events",
          "Pop-ups",
          "Influencer events",
          "Supplier coordination",
          "Guest list management",
          "On-the-day coordination",
        ],
        service: { label: "PR & events", href: "/services#pr-events" },
      },
    ],
  },

  {
    key: "design",
    label: "Design",
    cards: [
      {
        number: "009",
        slug: "design-project",
        name: "Design project",
        commitment: "Fixed project fee",
        /* OURS. Named for the shape, not the field — rule 1 at the top of this
           file. "Design & illustration" is a discipline with no end; a design
           project has a brief, a delivery and artwork at the end of it. */
        positioning:
          "Menus, print and brand illustration — drawn for you, and yours to keep as artwork.",
        /* verbatim, deck p17. */
        includes: [
          "Restaurant & café menus",
          "Illustrated menus",
          "Brand illustrations",
          "Flyers & posters",
          "Event stationery",
          "Signage",
          "Social media graphics",
          "Packaging concepts",
        ],
        service: { label: "Design & illustration", href: "/services#design-illustration" },
      },
    ],
  },

  {
    key: "websites",
    label: "Websites",
    cards: [
      {
        number: "010",
        slug: "website",
        name: "Website build",
        commitment: "Fixed project fee",
        /* OURS, one word off the deck's own "Websites, built with your brand in
           mind." (p18) — the shape is what changes it: a site, built, once. */
        positioning: "A landing page or a small site, designed and built with your brand in mind.",
        /* verbatim, deck p18. The deck's "after x amount of clients we get 15%"
           is an internal commercial note, not website copy — excluded, per
           SITEMAP.md §4.3. */
        includes: [
          "Landing pages",
          "Portfolio websites",
          "Small business websites",
          "Website refreshes",
        ],
        service: { label: "Website design", href: "/services#websites" },
      },
    ],
  },

  /* The ninth way to work together. No cards: see `enquireOnly` above. */
  {
    key: "bespoke",
    label: "Bespoke",
    enquireOnly: true,
    cards: [],
  }
];

/** Flat list, for the index range in the masthead. */
export const allPackages: PackageCard[] = packageTabs.flatMap((tab) => tab.cards);

export const packagesPage = {
  title: "Packages",
  /** The index mark above the masthead, matching /services' `[ 001–007 ]`. */
  mark: {
    range: `${allPackages[0].number}–${allPackages[allPackages.length - 1].number}`,
    label: "How we work together",
  },
  /**
   * Vertical type up the left edge. DELIBERATELY SHORT, and that is a layout
   * constraint rather than an editorial preference: the masthead is a grid and
   * this sits in its own column, so a long string sets the row's height and
   * pushes the tabs down the page. An earlier version listed the areas and put
   * ~240px of dead cream between the standfirst and the tab bar.
   */
  edge: "Monthly · by the day · by the project",
  /* OURS. An earlier version read "The same work as our services page, in the
     shapes you can actually book it in — a month at a time, a day at a time, or
     a project with a beginning and an end", which the client called horrible and
     was: it explained the page's internal logic instead of telling anyone
     anything, and "shapes you can actually book it in" is a phrase no one says.
     This names the three commitments in six words and then gets out of the way. */
  standfirst:
    "Ways to work with us — monthly, by the day, or by the project. Everything here can be shaped around what you need.",
  /** Heading over the includes list on a single-package tab. */
  includesLabel: "What’s included",
  /* A `priceNote` was here — "prices are quoted to each brand rather than
     listed" — written on the reasoning that a menu with no prices looks like an
     oversight unless the page says so. Cut on 2026-08-21: "i dont like this
     text randomly shoved into the left hand side, in one block of text i think
     we can get rid of it all together."

     It was the last thing on the page and had nothing to sit against, so it
     read as a leftover rather than as a note. Bespoke now makes the same point
     in the place someone actually looks for it — its own tab, beside the eight
     things you can buy. The sentence is in git history if it is ever wanted. */
  /**
   * Bespoke. Asked for directly: "don't see a package that fits you? contact us
   * for a bespoke package".
   *
   * IT IS A TAB NOW, not a band under the page (2026-08-21). As a band it read
   * as the page's closing CTA, which put it after everything and made it look
   * like the thing you land on when you have given up. As a tab it sits beside
   * the eight things you can buy, which is what it actually is: the ninth way
   * to work together.
   *
   * Deliberately NOT a receipt. There is nothing to itemise — no rows, no
   * total, no figure — and printing an empty one would be a joke at the
   * expense of the person reading it.
   */
  bespoke: {
    heading: "Bespoke",
    line: "Don’t see a package that fits? Tell us what you are trying to do and we will put something together.",
    label: "Enquire",
    href: "/enquire",
  },
};

export const packagesDescription =
  "Monthly social media packages, content days, UGC, TikTok, PR, events, design projects and websites — how MaeMüllen works with brands.";
