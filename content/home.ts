/**
 * Home page content — deck p3–p7. Blockquoted copy in docs/SITEMAP.md §4.1
 * is verbatim and ships as-is. Uppercase display treatments come from CSS
 * `text-transform`, so strings are stored in their real case (DESIGN.md §3.4).
 */

import { siteName } from "@/content/site";

export type Service = { number: string; name: string; anchor: string };

/** Verbatim, deck p6 — rendered as the statement block (DESIGN.md §3.3). */
export const statement =
  "Maemullen is a creative studio where social, content and design come together. We create thoughtful, distinctive work that helps brands show up with personality and purpose.";

/**
 * The second sentence of `statement`, on its own. For layouts where the first
 * sentence would only repeat the headline — the deleted /v2 draft set "where
 * social, content & design come together" at display size, so saying it again
 * underneath was dead copy. Nothing renders this today; it is kept because it is
 * verbatim deck p6 and the next page that sets the statement as a headline will
 * want it.
 */
export const statementTail =
  "We create thoughtful, distinctive work that helps brands show up with personality and purpose.";

/** Verbatim, deck p6 — the About summary paragraph. */
export const aboutSummary =
  "We believe the strongest brands are built through creativity, consistency and genuine connection. From social media and content creation to design, illustration, PR and events, we create work that feels authentic, considered and designed to leave a lasting impression.";

export const aboutLink = { label: "About the studio", href: "/about" };

export const heroCtas = {
  /** Bracket CTA copy is verbatim from deck p7. */
  bracket: { label: "Explore our world", href: "/work" },
  primary: { label: "Enquire", href: "/enquire" },
};

/** MaeMüllen's own services (SITEMAP.md §4.3) — order to be confirmed (Q3). */
export const services: Service[] = [
  { number: "001", name: "Social media management", anchor: "social-media" },
  { number: "002", name: "Content days", anchor: "content-days" },
  { number: "003", name: "TikTok management", anchor: "tiktok" },
  { number: "004", name: "UGC & brand content", anchor: "ugc" },
  { number: "005", name: "Design & illustration", anchor: "design-illustration" },
  { number: "006", name: "PR & events", anchor: "pr-events" },
  { number: "007", name: "Website design", anchor: "websites" },
];

export const servicesHeading = "Services";
export const servicesLink = { label: "All services", href: "/services" };

export type WorkItem = {
  slug: string;
  title: string;
  meta: string;
  image?: { src: string; alt: string };
  /** True until the project's assets and copy are supplied. */
  placeholder: boolean;
  placeholderNote?: string;
};

export const workHeading = "Selected work";
export const workLink = { label: "All work", href: "/work" };

/** Deck p19: menu, airbnb and mia massage. Only Bendito has assets. */
export const work: WorkItem[] = [
  {
    slug: "bendito",
    title: "Bendito",
    meta: "Menu design & illustration",
    image: {
      src: "/work/bendito/menu-in-situ.jpg",
      alt: "Hand-illustrated Bendito menu photographed on a table in the restaurant",
    },
    placeholder: false,
  },
  {
    slug: "mia-massage",
    title: "Mia Massage",
    meta: "Case study coming soon",
    placeholder: true,
    placeholderNote: "Assets to be supplied",
  },
  {
    slug: "airbnb",
    title: "Project name TBC",
    meta: "Case study coming soon",
    placeholder: true,
    placeholderNote: "Real client name & assets to be confirmed",
  },
];

export const collage = {
  /** OPEN (SITEMAP.md §4.1): collage photography not yet supplied. */
  placeholderNote: "Placeholder — collage photography TBC",
  tileCount: 5,
};

export const ctaBand = {
  heading: "Let’s work together",
  button: { label: "Enquire", href: "/enquire" },
};

/* ──────────────────────────────────────────────────────────────────────────
   Landing page, 2026-08-02 direction: a click-through gallery above the fold,
   then one studio-intro block. Everything else moved behind the nav — the old
   sections are parked in components/parked/PortedHomeSections.tsx.
   ────────────────────────────────────────────────────────────────────────── */

/**
 * The two images filling the first screen, side by side — the Nude Social
 * arrangement: full-bleed, butted together with no gutter, a short line of
 * uppercase micro-copy in the outer bottom corner of each.
 *
 * Captions are drawn from existing deck language rather than written fresh, and
 * are short by design — they sit over photography, so anything longer competes
 * with the image. Safe to reword.
 *
 * Replaced the click-through gallery on 2026-08-02.
 */
export type HeroImage = {
  src: string;
  alt: string;
  caption: string;
  /** Which bottom corner the caption sits in — outer edge of each image. */
  align: "start" | "end";
};

/**
 * The left frame is the tulle portrait, swapped in for the cowhide chair at the
 * client's request (2026-08-02). It lived on its own as `heroPairV3` while three
 * landing-page drafts ran side by side; with the other two deleted on
 * 2026-08-04 there is one pair again. The chair shot is still at
 * /studio/hero-01.jpg if it is ever wanted back.
 */
export const heroPair: HeroImage[] = [
  {
    src: "/studio/hero-tulle.jpg",
    alt: "A figure standing behind gathered layers of fine tulle, face and shoulder softened by the mesh",
    caption: "A female-founded creative studio",
    align: "start",
  },
  {
    src: "/studio/hero-02.jpg",
    alt: "The studio's two founders standing together against a white wall, one in cream, one in black",
    caption: "Social · Content · Design",
    align: "end",
  },
];

/**
 * Studio intro — the block below the fold. The words are verbatim deck p6: the
 * first paragraph is `statement`, the second is `aboutSummary`. Nothing here is
 * invented.
 *
 * The first paragraph is stored pre-split so the studio name can be set bold
 * without string surgery at render time. Note the deck writes "Maemullen";
 * `siteName` is the correct brand spelling, "MaeMüllen", which is what the
 * wordmark reads — so the name is taken from `siteName` and only the remainder
 * of the sentence comes from the deck.
 */
export const studioIntro = {
  /**
   * Eyebrow + display heading, added 2026-08-02. Without them the block was two
   * body-size paragraphs in the same face at the same weight — no hierarchy and
   * no sign of the brand's display face anywhere in it.
   *
   * The heading is the one from the Claude Design about section, italic on the
   * second half, so it is already-approved language rather than new copy.
   */
  eyebrow: "The studio",
  heading: { text: "A studio of two,", emphasis: "by design." },
  lead: siteName,
  leadRest: statement.replace(/^Maemullen/, ""),
  body: aboutSummary,
  cta: { label: "Enquire", href: "/enquire" },
  /**
   * Cut out from the supplied Maemüllen.PNG, which arrived with a flat grey
   * background rather than real transparency. The grey was flood-filled away
   * from the four corners — a straight colour-key would also have knocked out
   * the pale photo-booth backdrop *behind their heads*, which is nearly the
   * same grey but not connected to the edge.
   *
   * WebP, because a photographic cut-out as PNG was 1 MB against 113 KB here.
   *
   * It renders with no frame: the strips sit straight on the page, lit by a
   * silhouette-tracing shadow over a halftone field (see .mm-plate in
   * globals.css). The earlier version, shot on a concrete floor, is still at
   * /studio/founders-photobooth.jpg.
   *
   * CHECK THE ALT TEXT: it assumes the two people are the founders.
   */
  image: {
    src: "/studio/founders-photobooth-cutout.webp",
    alt: "Two sepia photo-booth strips, each with three frames of the studio's founders together in fur coats",
  } as { src: string; alt: string } | null,
  placeholderNote: "Studio photography to come",
  /** Annotation under the plate — the archival caption language of the Inspo set. */
  imageCaption: "Fig. 01 — The founders",
};
