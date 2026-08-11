/**
 * /about content — supplied by the client 2026-08-09.
 *
 * THE NAME IN BODY COPY is "Maemüllen" — a lowercase second m, unlike the
 * wordmark's "MaeMüllen" (`siteName`) — asked for directly (2026-08-09). In the
 * studio paragraph it is also set bold (see `abt__brand` in about.css). The rest
 * of every sentence is the brief's, verbatim. Uppercase treatments are CSS
 * `text-transform`, so strings are stored in their real case (DESIGN.md §3.4).
 *
 * LAYOUT borrows the /services vibe — Heros display headings, the mono `[ 00x ]`
 * annotation register, vertical type — but NOT the scroll-drawn line, which
 * belongs to /services alone. The generous whitespace around every block is
 * deliberate: it is the room Poppy's doodles go into once they are drawn.
 *
 * THE PHOTOGRAPHY IS PLACEHOLDER. Two studio shots stand in so the layout can be
 * seen; the real portraits are chosen later. `aboutNote` says so on the page.
 */

export const aboutDescription =
  "Where Maemüllen came from, and the two people behind it.";

export const aboutPage = {
  /** Mono eyebrow over the title, the annotation register. */
  mark: "The studio",
  title: "About",
  /** Brief, para 1 — the founding line, verbatim (name spelled Maemüllen). */
  standfirst:
    "Maemüllen was founded by two creatives brought together by a shared passion for design, content and creativity.",
};

/** Shown once under the masthead: these images are stand-ins. */
export const aboutNote = "Photography placeholder — final images to be chosen.";

export type Founder = {
  /** `[ 00x ]` index mark. */
  number: string;
  /** Vertical edge caption beside the section. */
  edge: string;
  name: string;
  bio: string;
  /** Which way the section faces, alternating down the page. */
  side: "left" | "right";
  image: { src: string; alt: string; caption: string };
};

/** Brief, para 2 — split into the two founders, a section each. */
export const founders: Founder[] = [
  {
    number: "001",
    edge: "Co-founder",
    name: "Laura",
    bio: "Laura is an Advertising graduate with a background in luxury PR, social media management and UGC, bringing experience in brand storytelling, content creation and digital marketing.",
    side: "left",
    image: {
      // Placeholder — a studio shot standing in until the real portrait is chosen.
      src: "/studio/hero-tulle.jpg",
      alt: "Placeholder image — studio photography to come",
      caption: "I — Laura · placeholder",
    },
  },
  {
    number: "002",
    edge: "Co-founder",
    name: "Poppy",
    bio: "Poppy is a Fine Art graduate from Central Saint Martins whose background in illustration, design and visual arts brings a distinctive creative perspective to every project.",
    side: "right",
    image: {
      // Placeholder — a studio shot standing in until the real portrait is chosen.
      src: "/studio/hero-02.jpg",
      alt: "Placeholder image — studio photography to come",
      caption: "II — Poppy · placeholder",
    },
  },
];

/**
 * Brief, para 3. "As a female-founded studio," is lifted up into the heading so
 * the phrase is not said twice; the body continues from there, verbatim.
 */
export const aboutStory = {
  mark: "Under one roof",
  heading: "A female-founded studio",
  /**
   * Split so the studio name can be set bold in the middle of the sentence
   * (about.css `.abt__brand`). Name spelled "Maemüllen", per the client.
   */
  bodyLead: "We created ",
  bodyName: "Maemüllen",
  bodyRest:
    " to combine our different creative disciplines under one roof. What began through our shared love of creating has grown into a studio where social media, design and content work together to help brands connect with their audience in a thoughtful and authentic way.",
};

/** Brief, para 4 — the closing statement, verbatim. */
export const aboutClosing =
  "Today, we partner with businesses to create work that feels considered, creative and true to their identity, combining strategy with originality to build brands people remember.";

/** Every page ends into /enquire (SITEMAP §2). */
export const aboutCta = {
  heading: "Let’s work together",
  label: "Enquire",
  href: "/enquire",
};
