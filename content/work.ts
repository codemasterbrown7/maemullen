/**
 * /work content — the portfolio.
 *
 * FOUR PROJECTS, and the fourth is deliberately a pair. Asked for directly
 * (2026-08-24): tfest.ai and trifectaproperty.co.uk are ONE entry called
 * Websites rather than two, because they are one strand of work — the same
 * service delivered twice — and splitting them would have made half the
 * portfolio websites. Its hero is the two sites butted together, which says
 * "two of these" before a word is read.
 *
 * WHAT THE TWO UNPHOTOGRAPHED PROJECTS ARE, since neither is in the deck and
 * the answer only exists in the conversation that commissioned this page:
 *
 * · **Harmony Hub** — a freelance massage therapist working out of her own
 *   home, with her own website and social accounts. The broadest brief on the
 *   page: it is the whole of what a client sees before they book.
 * · **The Loft** — the Airbnb. This CLOSES the open question in
 *   docs/SITEMAP.md §4.5, which listed the project as `airbnb` with its real
 *   name marked `OPEN:`. It is The Loft.
 *
 * `OPEN:` **is Harmony Hub the project the sitemap calls `mia-massage`?**
 * §4.5's third row is "Mia Massage", and a one-person massage practice is
 * suspiciously close. If it is the same job under its business name, that row
 * should be folded into this one rather than left as a fourth project waiting
 * to be built.
 *
 * ── COPY ──────────────────────────────────────────────────────────────────
 *
 * PROVISIONAL, and marked as such per project below. Unlike /services and
 * /packages, none of this is deck copy — there is no deck page for these
 * projects, so `prose` is written rather than quoted. It sticks to what is
 * actually known and invents no results, no dates and no client names beyond
 * the four given. Rewrite it freely; nothing here is verbatim and nothing is
 * load-bearing.
 *
 * The Websites entry is the exception: everything said about TFEST26 and
 * Trifecta Property is read off the two live sites, so it is checkable.
 *
 * NO YEARS ANYWHERE, on purpose. A portfolio wants dates and we do not have
 * them, and a made-up year on a real client's job is the one error here that
 * would be embarrassing rather than merely wrong. `year` below is optional and
 * renders only when set — filling in four strings turns the row on.
 *
 * Uppercase treatments come from CSS `text-transform`, so every string is
 * stored in its real case (DESIGN.md §3.4).
 */

import { services } from "@/content/home";

/**
 * The hero at the top of each band.
 *
 * Three kinds rather than one nullable image, because the three genuinely
 * behave differently and a component that has to guess is a component that
 * renders a broken plate the day an asset is missing:
 *
 * · `photo`   one picture, filling the plate.
 * · `pair`    two butted together — the Websites entry, and the same
 *             arrangement as the landing page's first screen.
 * · `pending` no photography yet. NOT an empty box and not a grey rectangle:
 *             a pink field carrying a line that says what is missing. Pink
 *             because it is the brand's own second surface (it is the header),
 *             cream type on it is the proven pairing, and it is unmistakably a
 *             placeholder — which is the point. Nobody sends the photographs
 *             for a hole that already looks finished.
 */
export type Hero =
  | { kind: "photo"; src: string; alt: string; dim: [number, number] }
  | { kind: "pair"; cells: { src: string; alt: string; dim: [number, number] }[] }
  | { kind: "pending"; note: string };

/** A supporting picture inside an opened band. Only Bendito has one. */
export type Still = { src: string; alt: string; dim: [number, number]; caption: string };

/**
 * A line in the wall label — the small block of facts beside the prose.
 *
 * `href` is what makes the label do a job rather than decorate: the services a
 * project used link into the matching section of /services, so the portfolio
 * proves the services page instead of sitting next to it. External links get
 * the arrow and open in a new tab; `/services#…` links do not.
 */
export type LabelRow = { term: string; items: { text: string; href?: string }[] };

export type Project = {
  slug: string;
  /** Set at display size, straddling the foot of its plate. One word or two —
   *  it is held on a single line at every width, so a long name would break
   *  the treatment rather than wrap out of it. */
  name: string;
  /** The line under the plate. What this job actually was, in three words. */
  discipline: string;
  hero: Hero;
  /** Two paragraphs at most, at one size. Hierarchy on this page comes from
   *  the size jump to the name, not from stacking treatments inside the copy
   *  (design-taste ruling, 2026-08-02). */
  prose: string[];
  label: LabelRow[];
  stills?: Still[];
  /** Rendered only when set — see the note about years above. */
  year?: string;
};

/** `/services#…` for a service, looked up by name so a renamed service cannot
 *  leave a dead anchor behind in here. Throws at build time if it misses. */
const service = (name: string) => {
  const match = services.find((s) => s.name === name);
  if (!match) throw new Error(`content/work.ts: no service named "${name}"`);
  return { text: match.name, href: `/services#${match.anchor}` };
};

export const workPage = {
  /** Runs up the left edge of the masthead, as on /services and /packages. */
  edge: "Selected work",
  title: "Portfolio",
  /** Says what is on the page and how it works. The second sentence is the
   *  only instruction on the page, and it is here rather than repeated four
   *  times as a hint under every band. */
  standfirst:
    "Four projects: a whole online presence, a short-let flat, a printed menu, and two websites built end to end. Open one to see what we made.",
  cta: {
    heading: "Something like one of these?",
    label: "Enquire",
    href: "/enquire",
  },
  /** Both halves of the toggle, so the affordance is content rather than a
   *  string buried in a component. */
  toggle: { closed: "Open", open: "Close" },
};

export const workDescription =
  "Selected work from MaeMüllen — social, content, design and websites for four clients.";

export const projects: Project[] = [
  {
    slug: "harmony-hub",
    name: "Harmony Hub",
    discipline: "Website, social and content",
    hero: { kind: "pending", note: "Photography to come" },
    /* PROVISIONAL. Written from one fact — a massage therapist working from
       home, with a website and social of her own — and nothing else. */
    prose: [
      "A massage therapist working out of her own home, which is the whole appeal and also the thing that is hardest to show: a treatment room in a house has to look like somewhere you would happily take your shoes off.",
      "So we built the lot — the site, the accounts that feed it, and the photography that fills both. The site has one job, which is to get someone to book, and everything on it is arranged around that.",
    ],
    label: [
      { term: "Client", items: [{ text: "Harmony Hub" }] },
      {
        term: "We made",
        items: [
          service("Website design"),
          service("Social media management"),
          service("Content days"),
        ],
      },
    ],
  },

  {
    slug: "the-loft",
    name: "The Loft",
    discipline: "Content and social",
    hero: { kind: "pending", note: "Photography to come" },
    /* PROVISIONAL. Written from one fact — it is the Airbnb — and the general
       truth that a short let is sold on its pictures. */
    prose: [
      "A short-let flat, and short lets are sold on photography before they are sold on anything else. Most listings photograph a property as an inventory: here is the bedroom, here is the other bedroom.",
      "We shot it as a place to stay instead, and gave it an account of its own so there is somewhere for the pictures to keep working between bookings.",
    ],
    label: [
      { term: "Client", items: [{ text: "The Loft" }] },
      {
        term: "We made",
        items: [service("Content days"), service("Social media management")],
      },
    ],
  },

  {
    slug: "bendito",
    name: "Bendito",
    discipline: "Menu design and illustration",
    hero: {
      /* Cropped to 2:1 from the supplied portrait original, which is a 20 MB
         JPEG and has no business being fetched by a browser. The master stays
         in the repo at menu-in-situ.jpg; this is the derived plate. */
      kind: "photo",
      src: "/work/bendito/menu-in-situ-wide.webp",
      alt: "The Bendito menu laid on a set table, beside a glass of red wine",
      dim: [2400, 1200],
    },
    prose: [
      "Hand-drawn menu artwork for Bendito — every dish illustrated, drawn to be printed rather than posted. Red line work and blue type on a cream card.",
      "It is the one piece of design on this page a guest picks up and holds, and it does its work before a single dish has been read.",
    ],
    label: [
      { term: "Client", items: [{ text: "Bendito" }] },
      { term: "We made", items: [service("Design & illustration")] },
      { term: "Printed", items: [{ text: "Single-sheet menu card" }] },
    ],
    stills: [
      {
        src: "/work/bendito/menu-artwork.png",
        alt: "The Bendito menu artwork flat: hand-drawn illustrations in red around blue type",
        dim: [943, 2000],
        caption: "The artwork, flat",
      },
    ],
  },

  {
    slug: "websites",
    name: "Websites",
    discipline: "Design and build",
    hero: {
      kind: "pair",
      cells: [
        {
          src: "/work/websites/tfest.webp",
          alt: "The TFEST26 website: a white headline over a photograph of a conference stage",
          dim: [1600, 1000],
        },
        {
          src: "/work/websites/trifecta.webp",
          alt: "The Trifecta Property website: a dark headline on white over a fine line-drawn landscape",
          dim: [1600, 743],
        },
      ],
    },
    /* The only entry here that is checkable rather than provisional — both
       sites are live and everything below is read off them. */
    prose: [
      "Two sites, designed and built. TFEST26 is a supply-chain conference for senior leaders, held in Berlin; Trifecta Property sells AI call handling to estate agents.",
      "Different audiences, opposite ends of the room, and the same brief underneath: say what this is in one screen, and make the next step obvious.",
    ],
    label: [
      {
        term: "Live",
        items: [
          { text: "tfest.ai", href: "https://tfest.ai" },
          { text: "trifectaproperty.co.uk", href: "https://trifectaproperty.co.uk" },
        ],
      },
      { term: "We made", items: [service("Website design")] },
    ],
  },
];
