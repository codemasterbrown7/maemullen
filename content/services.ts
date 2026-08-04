/**
 * /services content — deck p8 and p14–p18, via docs/SITEMAP.md §4.3.
 *
 * The names, numbers and anchors are NOT redeclared here. They come from
 * `services` in content/home.ts, which is the same array the marquee and /v3
 * render, so the page and the marquee can never drift out of step. This file
 * only adds the detail copy hanging off each anchor, plus how each one sits on
 * the page.
 *
 * COPY. `statement` and `prose` are the deck's own wording, split at a sentence
 * boundary so the opening line can be set large and the rest at reading size —
 * a split, not a rewrite; no word is changed. The two exceptions are marked
 * where they occur: 001's prose, because the deck describes social media
 * management only through the package tiers, and the CTA heading.
 *
 * Uppercase treatments come from CSS `text-transform`, so strings are stored in
 * their real case (DESIGN.md §3.4).
 *
 * TWO STANDING OPEN QUESTIONS THIS FILE ENCODES:
 *
 * · Q1, prices. Deck p8: "dont include prices on website" — yet every service
 *   page in the deck quotes one. The `price` fields below carry the real deck
 *   figures so they are not lost, and **nothing renders them**. If the client
 *   confirms prices go on the site, app/services/page.tsx is where to add it.
 *
 * · Q3, the list and its order. Reconstructed from MaeMüllen's own service
 *   pages, not the reference site's 001–007 list. Still unconfirmed.
 */

import { services, type Service } from "@/content/home";

/**
 * What a service includes. `label` is only set where the deck itself splits the
 * service into named parts — 006 is PR and Events, quoted and priced
 * separately. Everything else is one unlabelled group.
 */
export type IncludeGroup = { label?: string; items: string[] };

export type ServiceDetail = {
  /** The deck's opening line, set at display size. Verbatim. */
  statement: string;
  /** The rest of the deck copy, at reading size. Verbatim. Often empty. */
  prose: string[];
  includes: IncludeGroup[];
  /** Deck figures, recorded and DELIBERATELY NOT RENDERED — see Q1 above. */
  price?: string;
  link?: { label: string; href: string };
  image?: { src: string; alt: string; caption: string };

  /* ── How it sits on the page ────────────────────────────────────────────
     Sides alternate, but the sections are deliberately not mirror images of
     each other: `offset` drops some of them down the row, and only four of the
     seven carry vertical edge type. See the note in app/services/services.css
     about why a perfect zigzag is the thing to avoid. */

  /** Which half of the page the copy sits in. */
  side: "left" | "right";
  /** Nudge down the row, in --space-10 steps. Breaks the drumbeat. */
  offset?: number;
  /** Type running up (or down) the outer edge of the section. Not on all of
   *  them — an annotation on every single row stops being an annotation. */
  edge?: string;
  /** Where the scroll-drawn line runs past this section, as a fraction of the
   *  page width. It must be the half the copy is NOT in — that is the whole
   *  mechanism by which the line never crosses text. 005 is the exception: it
   *  runs over the Bendito plate, which is imagery rather than text. */
  threadX: number;
  /** Set on exactly one section, to put a loop-the-loop in the descent. Which
   *  way the loop bulges — point it at open space. */
  threadLoop?: "left" | "right";
};

const detail: Record<string, ServiceDetail> = {
  "social-media": {
    /* Ours, not the deck's — p8 and p10–12 describe this service entirely
       through the three package tiers, so there is no prose to quote. */
    statement: "Delivered as monthly packages.",
    prose: [
      "Content creation, scheduling, stories, planning calls, performance reports and content calendars — everything that keeps a brand present month to month.",
    ],
    includes: [
      {
        items: [
          "Monthly content planning",
          "Content creation sessions",
          "Instagram Stories",
          "Caption writing",
          "Content scheduling",
          "Content calendar",
          "Monthly planning call",
          "Monthly performance report",
        ],
      },
    ],
    link: { label: "See the packages", href: "/packages" },
    side: "left",
    threadX: 0.8,
    edge: "Monthly — three tiers",
  },

  "content-days": {
    statement: "Need a month’s worth of content in one session?",
    prose: ["We create premium, social-first content tailored to your brand."],
    includes: [
      {
        items: [
          "Reels",
          "TikToks",
          "Photography",
          "Product content",
          "Lifestyle content",
          "Behind the scenes",
          "Staff & team content",
        ],
      },
    ],
    price: "Half-day shoot £350–450 · Full-day shoot £650–900",
    side: "right",
    threadX: 0.2,
    offset: 2,
  },

  tiktok: {
    statement: "Available alongside any package.",
    prose: [],
    includes: [
      {
        items: [
          "TikTok strategy",
          "Caption writing",
          "Posting & scheduling",
          "Trend research",
          "Monthly management",
        ],
      },
    ],
    price: "+£250–400 per month",
    side: "left",
    threadX: 0.82,
    edge: "Add-on — any package",
  },

  ugc: {
    statement: "Creating premium, social-first content that captures your brand at its best.",
    prose: [
      "From luxury stays and wellness experiences to product launches and behind-the-scenes moments, we create authentic content designed to elevate your online presence.",
    ],
    includes: [
      {
        items: [
          "UGC",
          "Behind-the-scenes content",
          "Luxury travel & hospitality content",
          "Hotel & destination content",
          "Lifestyle content",
          "Brand campaigns",
          "Product & lifestyle photography",
          "Reels & TikToks",
          "Short-form video production",
          "Event coverage",
          "Social-first campaign content",
        ],
      },
    ],
    price: "Quote depends on hours needed, starting from £250",
    side: "right",
    threadX: 0.18,
    /* The one loop-the-loop in the descent. Here because this is the tallest
       section — most vertical room — and it is far enough down that the line
       has read as a straight run for a while first. It bulges right, towards
       the empty middle, rather than out towards the page edge. */
    threadLoop: "right",
    offset: 1,
  },

  "design-illustration": {
    statement:
      "From bespoke illustrations to beautifully designed print and digital assets, we create visuals that feel unique to your brand.",
    prose: [],
    includes: [
      {
        items: [
          "Restaurant & café menus",
          "Illustrated menus",
          "Brand illustrations",
          "Flyers & posters",
          "Event stationery",
          "Signage",
          "Social media graphics",
          "Packaging concepts",
        ],
      },
    ],
    /* The only real service imagery that exists. The artwork PNG rather than
       menu-in-situ.jpg: the in-situ photograph is a 19 MB 4000×6000 original
       and has no business on a page load until it is resized. */
    image: {
      src: "/work/bendito/menu-artwork.png",
      alt: "The Bendito menu — red line drawings of chillies, glasses and figures around a handwritten blue menu of dishes",
      caption: "Bendito — menu & artwork",
    },
    side: "left",
    /* Deliberately ON the plate, not in the gap beside it. The artwork is set
       in mix-blend-mode: darken, so the line shows through its paper but loses
       to every red and blue stroke in the drawing — it reads as passing behind
       the menu, and overprints where the two cross. */
    threadX: 0.78,
  },

  "pr-events": {
    statement: "Helping brands build meaningful relationships.",
    prose: [
      "From concept to execution. Whether you’re launching a new business, hosting a wellness event or planning a brand activation, we’ll help bring your vision to life.",
    ],
    includes: [
      {
        label: "PR",
        items: [
          "Influencer outreach",
          "Product gifting",
          "Brand collaborations",
          "Press outreach",
          "Campaign coordination",
          "Event invitations",
        ],
      },
      {
        label: "Events",
        items: [
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
      },
    ],
    price: "PR & influencer marketing £600 per month · Events quoted by scale and budget",
    side: "right",
    threadX: 0.2,
    offset: 3,
    edge: "PR — events",
  },

  websites: {
    statement: "Websites, built with your brand in mind.",
    prose: [],
    includes: [
      {
        items: [
          "Landing pages",
          "Portfolio websites",
          "Small business websites",
          "Website refreshes",
        ],
      },
    ],
    /* Deck p18 also carries "after x amount of clients we get 15%" — an
       internal commercial note, not website copy. Excluded (SITEMAP.md §4.3). */
    price: "£900",
    side: "left",
    threadX: 0.8,
    offset: 1,
    edge: "Landing — portfolio — refresh",
  },
};

export type ServiceEntry = Service & ServiceDetail;

/**
 * The page's data: the shared name/number/anchor joined to the detail above.
 * Throws rather than rendering a half-built row if the two ever fall out of
 * sync — adding a service to content/home.ts without its copy is a mistake we
 * want to hear about at build time, not discover as an empty section.
 */
export const serviceEntries: ServiceEntry[] = services.map((service) => {
  const entry = detail[service.anchor];
  if (!entry) {
    throw new Error(
      `content/services.ts has no detail for "${service.anchor}". Add it, or remove the service from content/home.ts.`,
    );
  }
  return { ...service, ...entry };
});

export const servicesPage = {
  title: "Services",
  /** The index mark above the masthead — the bracket-and-number annotation
   *  register. Spans the range rather than naming one service. */
  mark: { range: "001–007", label: "Everything we do" },
  /** Vertical type up the left edge. Verbatim from the Claude Design landing
   *  page, where it is the studio's own list of disciplines. */
  edge: "MaeMüllen — social · content · design · illustration · PR · events",
  /* Verbatim, deck p6 — the tail of the About summary, which happens to name
     every service on this page. Nothing invented. */
  standfirst:
    "From social media and content creation to design, illustration, PR and events, we create work that feels authentic, considered and designed to leave a lasting impression.",
  /* Not deck copy — the same words as the home page's CTA band, so the site
     asks for the enquiry in one voice. Replace at will. */
  /* No index mark on this one. The `[ 00x ]` marks are an index of the seven
     services; an `[ 008 ]` on the closing band implies an eighth service that
     does not exist, and it sat exactly in the corridor the drawn line needs to
     reach the underline. The masthead already carries `[ 001–007 ]`. */
  cta: { heading: "Let’s work together", label: "Enquire", href: "/enquire" },
};

export const servicesDescription =
  "Social media management, content days, TikTok, UGC, design and illustration, PR and events, and website design — from MaeMüllen.";
