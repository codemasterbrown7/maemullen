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

/**
 * A photograph dotted into the empty half of a section — the treatment from the
 * references the client sent: small plates in a big pale field at unequal sizes
 * and unequal offsets, hard-edged, no frame, no shadow.
 *
 * EVERY PLATE IS ANNOTATED, and that is not decoration. The first pass shipped
 * them bare and the client's note was that they "look a bit out of place …
 * because they don't have any text associated to them, they are just floating"
 * (2026-08-04). Every reference they sent annotates the picture, and always the
 * same way: a Roman numeral, then a short label.
 *
 *   Bendito, menu in situ   `I — BENDITO, MENU IN SITU` up the right edge
 *   Giulia Nardi            `I  Sophie Lou Jacobsen` up the left edge
 *   Nude Social             `[01]` bottom left, `GHD` bottom right, under it
 *
 * ROMAN numerals, deliberately — the page's `[ 00x ]` marks are an index of the
 * seven services, and a second Arabic index would read as a competing one. I,
 * II, III … XV run in document order across the whole page, so the plates are
 * their own sequence rather than a per-section count.
 *
 * THE LABELS ARE DESCRIPTIVE AND PROVISIONAL. They say what is in the frame and
 * nothing more — no client names, no places, no dates, because none of that is
 * known here and the reference's `GHD` is a real credit. Reword them freely;
 * the client has the context these are standing in for.
 *
 * `w`, `x` and `y` are the whole point: equal plates in an even column are a
 * gallery, not a scatter. Vary them. See the note in app/services/services.css.
 */
export type Plate = {
  src: string;
  alt: string;
  /** Intrinsic pixel size, as shipped. Only reserves the space — CSS sizes it. */
  dim: [number, number];
  /**
   * Width of the WHOLE plate in rem — picture plus its edge annotation, not the
   * picture alone. Capped against the lane so it can never overflow.
   */
  w: number;
  /** Nudge across the empty lane, as a percentage of the lane. */
  x?: number;
  /** Nudge down the lane, in --space-10 steps. */
  y?: number;
  /**
   * `edge` runs "I — LABEL" up the outer side of the picture, away from the
   * copy. `foot` splits the numeral and the label to opposite ends of a line
   * under it. Foot goes on the widest plate in each section, because a
   * horizontal line of type needs width to sit in; edge on the rest.
   */
  note: { n: string; label: string; place: "edge" | "foot" };
};

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
  /** Photographs dotted down the empty half of the section. */
  plates?: Plate[];

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
   *  runs over the Bendito plate, which is imagery rather than text.
   *
   *  THE PARITY OF THIS COLUMN IS LOAD-BEARING and it is why the whole list was
   *  mirrored. Seven sections alternating from the index's right-hand lane put
   *  the line on the RIGHT at 007, and the underline it then has to draw starts
   *  at the far LEFT — so the last thing the line did before the page's one
   *  call to action was cut straight across it. Mirrored, 007 leaves the line
   *  already in the left margin and it just drops into the rule. Flip one of
   *  these and you put that crossing back. */
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
    /* One large, one small and far across the lane. The first plate on the page
       sits level with the heading, so the treatment announces itself before the
       reader has to hunt for it. */
    plates: [
      {
        src: "/scatter/cafe-coffee.webp",
        alt: "A woman in a checked-lapel trench coat drinking an iced coffee in a wood-panelled café",
        dim: [640, 843],
        w: 16,
        x: 4,
        note: { n: "I", label: "Coffee run", place: "foot" },
      },
      {
        src: "/scatter/candles-linen.webp",
        alt: "Candles and fragrance bottles arranged on a linen-draped table in low afternoon sun",
        dim: [640, 846],
        w: 12,
        x: 58,
        y: 1,
        note: { n: "II", label: "Candles & scent", place: "edge" },
      },
    ],
    side: "right",
    threadX: 0.2,
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
    /* Three, and the closest thing on the page to a contact sheet — which is
       the argument this section is making: one session, a month of content,
       several subjects. Furniture, a portrait, a still life. */
    plates: [
      {
        src: "/scatter/cowhide-chair.webp",
        alt: "A tub chair upholstered in brown-and-white cowhide on a polished concrete floor",
        dim: [640, 840],
        w: 13,
        x: 28,
        note: { n: "III", label: "Cowhide chair", place: "edge" },
      },
      {
        src: "/scatter/street-trench.webp",
        alt: "A woman in a navy gingham-lined trench coat and corduroy baker boy cap sitting on a cobbled kerb",
        dim: [640, 845],
        w: 13,
        x: 2,
        y: 1,
        note: { n: "IV", label: "Street style", place: "foot" },
      },
      {
        /* 11rem, and it stays there: this slot held the cowhide chair when it
           was called out by name as too small at 8rem (2026-08-04) — the whole
           reason every plate under ~10rem grew by a fifth. The chair has since
           moved up to III and the stool down to here, but the floor the note
           established is a property of the slot, not of the picture in it. */
        src: "/scatter/bedside-stool.webp",
        alt: "A striped cup and saucer and gold jewellery on a wooden stool beside a white bed",
        dim: [640, 838],
        w: 11,
        x: 50,
        y: 1,
        note: { n: "V", label: "Morning, still life", place: "edge" },
      },
    ],
    side: "left",
    threadX: 0.8,
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
    /* One, dropped well down the lane. 003 is the shortest section on the page
       — a cluster here would be more picture than service. It is also the
       stillest picture in the set, which is the right note under the shortest
       section: one room, held, rather than a scene with something going on in
       it. */
    plates: [
      {
        src: "/scatter/leather-sofa.webp",
        alt: "A low black leather sofa against a poured-concrete wall, with books and a blue vase on a steel side table",
        dim: [640, 844],
        w: 16,
        x: 14,
        y: 2,
        note: { n: "VI", label: "Leather sofa", place: "foot" },
      },
    ],
    side: "right",
    threadX: 0.18,
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
    /* The section names "luxury stays", "hotel & destination" and "product &
       lifestyle photography" in its own copy, and these three are exactly that
       — so this is the one place on the page where the pictures are evidence
       rather than atmosphere. Two rooms and a flat lay, which is also the range
       the copy claims. Also the tallest section, so it carries three
       comfortably. */
    plates: [
      {
        src: "/scatter/villa-garden.webp",
        alt: "A parasol and two sun loungers beside a plunge pool, seen from above through tropical planting",
        dim: [640, 846],
        w: 14,
        x: 5,
        note: { n: "VII", label: "Pool garden", place: "foot" },
      },
      {
        src: "/scatter/beauty-tray.webp",
        alt: "Make-up and skincare — a blusher palette, serum, lip products and a tanning mist — laid out on an oval silver tray on crumpled linen",
        dim: [640, 853],
        w: 12,
        x: 54,
        y: 1,
        note: { n: "VIII", label: "Beauty, flat lay", place: "edge" },
      },
      {
        src: "/scatter/bamboo-suite.webp",
        alt: "A bed under a woven bamboo ceiling, with a lit recess above the headboard",
        dim: [640, 844],
        w: 14,
        x: 16,
        y: 1,
        note: { n: "IX", label: "Bamboo suite", place: "edge" },
      },
    ],
    side: "left",
    threadX: 0.82,
    /* The one loop-the-loop in the descent. Here because this is the tallest
       section — most vertical room — and it is far enough down that the line
       has read as a straight run for a while first. It bulges right, towards
       the empty middle, rather than out towards the page edge. */
    threadLoop: "left",
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
    /* The Bendito menu artwork used to plate the right half of this section.
       Pulled at the client's request; the file is still at
       /work/bendito/menu-artwork.png and .svc__plate still renders any entry
       that declares an `image`, so it is one block away from coming back. */
    /* A printed menu card in situ, and a piece of furniture that is itself a
       drawn shape — the two halves of "design & illustration".

       X IS THE BENDITO MENU, but as a PHOTOGRAPH, not as the artwork. The thing
       that was pulled on request was /work/bendito/menu-artwork.png — a flat
       scan, plated large with a vertical caption. This is the studio's own shot
       of the same menu on the table it was made for
       (/assets/work/bendito/menu-in-situ.jpg), scattered at plate scale like
       every other picture on the page. Different asset, different treatment;
       the earlier note still stands. Cropped from the top to 3:4 to sit with
       the rest of the set — the source file is 2:3. */
    plates: [
      {
        src: "/scatter/menu-table.webp",
        alt: "An illustrated menu card, hand-drawn in red and blue, on a white-clothed table laid with wine, bread and charcuterie",
        dim: [640, 851],
        w: 17,
        x: 18,
        y: 1,
        note: { n: "X", label: "Menu, in situ", place: "foot" },
      },
      {
        src: "/scatter/blue-chair.webp",
        alt: "A chair built from a single looped tube upholstered in bright blue",
        dim: [640, 631],
        w: 13,
        x: 6,
        y: 1,
        note: { n: "XI", label: "Blue chair", place: "edge" },
      },
    ],
    side: "right",
    /* Was 0.78 — tucked onto the plate. With the right half empty it joins the
       other left-hand sections in the lane at 0.8. */
    threadX: 0.2,
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
    /* Two halves of one event and the room it was held in: the table dressed,
       the brand's own plinth, the private dining room laid up. The plinth is
       small and pushed far across the lane on purpose — a branded product stand
       at 15rem would read as an advert rather than as event coverage. */
    plates: [
      {
        src: "/scatter/kerastase-table.webp",
        alt: "A long table dressed in white for a brand lunch, with white anthuriums and gift bags at every place",
        dim: [640, 798],
        w: 15,
        note: { n: "XII", label: "Table, dressed", place: "foot" },
      },
      {
        src: "/scatter/kerastase-plinth.webp",
        alt: "A branded product plinth holding three haircare bottles, in front of sheer curtains",
        dim: [640, 797],
        w: 13,
        x: 46,
        y: 1,
        note: { n: "XIII", label: "Product plinth", place: "edge" },
      },
      {
        src: "/scatter/dining-room.webp",
        alt: "A private dining room laid up on a black table, with cane-backed chairs and a glazed partition",
        dim: [640, 796],
        w: 14,
        x: 12,
        y: 1,
        note: { n: "XIV", label: "Private dining", place: "edge" },
      },
    ],
    side: "left",
    threadX: 0.8,
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
    /* One, and the last picture before the closing band, so it wants to read as
       a breath rather than as another piece of evidence — which is why it is
       the only frame on the page pointing at nothing but a ceiling. */
    plates: [
      {
        src: "/scatter/bamboo-ceiling.webp",
        alt: "A paper lantern hanging beneath a curved bamboo ceiling",
        dim: [640, 845],
        w: 13,
        x: 40,
        y: 1,
        note: { n: "XV", label: "Woven ceiling", place: "foot" },
      },
    ],
    side: "right",
    threadX: 0.2,
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
