import { Anton, Bagel_Fat_One, Dela_Gothic_One, Syncopate } from "next/font/google";
import { siteName } from "@/content/site";
import "./faces.css";

/**
 * The lettering the intro's name passes through — a set of treatments of the
 * name, not just typefaces: stamps, badges, monograms, stickers, marks.
 *
 * After a reference the user sent on 2026-09-21: a studio intro that fires
 * through about twenty logotype treatments of its own name, nine a second.
 * These take the vibe of that set, not its letterforms — the original frames
 * are in ~/Desktop/Mother Design references/, and each treatment below names
 * the frame it answers to. Three things from the house rules shape them:
 *
 *  - **Upright only.** Italic is banned from this design outright, so the
 *    reference's slanted treatments (the speed stripes, the ///MD) are
 *    redrawn upright; only the slashes themselves lean.
 *  - **No blackletter, no pixel faces** (rejected in earlier rounds), which
 *    rules out a few of the reference's frames altogether.
 *  - **Black on the intro's white.** The reference is white on black; each
 *    treatment is drawn in currentColor, with var(--brand-white) for anything
 *    cut out of it, so the RGB glitch can recolour every one of them.
 *
 * Every treatment's box is its ink — cap height to baseline for type (via
 * text-box-trim in faces.css), the drawing itself for the marks — so the
 * intro can centre each one on screen and the name holds still between
 * changes rather than jumping to wherever a font's line box put it.
 */
export const FACES = {
  playfair: "The wordmark — Playfair 700, the logotype's own capitals",
  stripes: "Speed stripes — Anton, cut through with rules (ref 03)",
  smiley: "Smiley badge — the initials over a grin (ref 02)",
  sticker: "Sticker — Bagel Fat One stacked, with a drop shadow (ref 04)",
  tracked: "Tracked out — Syncopate, small and wide, with a heart (ref 10)",
  katakana: "Katakana — Dela Gothic One, stacked (ref 07)",
  inline: "Inline monogram — drawn arches with a groove (ref 09)",
  extrude: "Block letters — outlined and extruded (ref 13)",
  seal: "Seal — nine letters, three by three, in a stamp (ref 01)",
  split: "Split line — wide outlined capitals, cut through the middle (ref 15)",
  console: "Standing and lying — one M up, one on the floor (ref 20)",
  tight: "Tight grotesk — Switzer 900, letters touching (ref 12)",
  slashes: "Slashes — ///MM (ref 18)",
  heart: "Heart — with a shine (ref 24)",
} as const;

export type FaceId = keyof typeof FACES;

/* The faces the site does not otherwise use, loaded here rather than in the
   root layout so only the pages that show them download them. Playfair and
   Switzer come from the layout. */
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const syncopate = Syncopate({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-syncopate",
  display: "swap",
});

const bagel = Bagel_Fat_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bagel",
  display: "swap",
});

/* Latin is preloaded; the kana live in one of Google's Japanese slices, which
   only download once something uses them — see preloadFaces(). */
const dela = Dela_Gothic_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dela",
  display: "swap",
});

/** Class names that define every --font-* variable above, for whatever
 *  element the faces render inside. */
export const faceFonts = [anton, syncopate, bagel, dela].map((f) => f.variable).join(" ");

/** The name in katakana: メイ (Mae, said "may") ミュレン (Müllen). */
const KATAKANA = ["メイ", "ミュレン"];

/** Start the kana downloading now, rather than when the katakana treatment
 *  first appears several seconds in — by which point it would show in a
 *  fallback face for a frame or two. */
export function preloadFaces() {
  document.fonts.load(`1em ${dela.style.fontFamily}`, KATAKANA.join("")).catch(() => {});
}

/* "MaeMüllen" → ["Mae", "Müllen"], and its initials, "MM". */
const HALVES = siteName.split(/(?=\p{Lu})/u);
const INITIALS = HALVES.map((h) => h[0]).join("");
const LETTERS = Array.from(siteName.toUpperCase());

/** A heart, in a 100 × 90 box. */
const HEART =
  "M50 88C20 64 0 46 0 26 0 10 12 0 27 0c11 0 19 6 23 14C54 6 62 0 73 0c15 0 27 10 27 26 0 20-20 38-50 62Z";

/** Two stacked lines: the name's two halves. */
function Stacked() {
  return (
    <>
      <span className="face__line">{HALVES[0]}</span>
      <span className="face__line">{HALVES[1]}</span>
    </>
  );
}

/** One arched m, as a centreline for a stroke 24 wide: stems at x, x+44 and
 *  x+88, running down to y. */
const arches = (x: number, y: number) =>
  `M${x} ${y}V34a22 22 0 0 1 44 0V${y}M${x + 44} 34a22 22 0 0 1 44 0V${y}`;

/**
 * One treatment of the name. Plain markup, no state — the intro wraps it in
 * the glitch layers, and the design gallery at /intro/designs shows it as is.
 */
export function Face({ face }: { face: FaceId }) {
  switch (face) {
    case "stripes":
    case "tight":
    case "playfair":
    case "extrude":
    case "split":
      return <span className={`face face--${face}`}>{siteName}</span>;

    case "sticker":
      /* Three copies in one cell: the shadow, knocked down and to the right;
         a white ring round the letters; the letters. */
      return (
        <span className="face face--sticker">
          <span className="face--sticker__edge">
            <Stacked />
          </span>
          <span className="face--sticker__gap">
            <Stacked />
          </span>
          <span className="face--sticker__ink">
            <Stacked />
          </span>
        </span>
      );

    case "katakana":
      return (
        <span className="face face--katakana" lang="ja">
          <span className="face__line">{KATAKANA[0]}</span>
          <span className="face__line">{KATAKANA[1]}</span>
        </span>
      );

    case "tracked":
      return (
        <span className="face face--tracked">
          {siteName}
          <svg className="face--tracked__heart" viewBox="0 0 100 90">
            <path d={HEART} fill="currentColor" />
          </svg>
        </span>
      );

    case "seal":
      return (
        <span className="face face--seal">
          {LETTERS.map((ch, i) => (
            <span key={i}>{ch}</span>
          ))}
        </span>
      );

    case "smiley":
      return (
        <svg className="face face--smiley" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="50" fill="currentColor" />
          <text x="50" y="44" textAnchor="middle">
            {INITIALS}
          </text>
          <path className="face__cut" d="M23 57q27 30 54 0" />
        </svg>
      );

    case "inline":
      /* Each m drawn twice on one centreline: the body, then a thin white
         groove down its middle that stops short of the feet so it reads as
         carved in rather than splitting the stems. */
      return (
        <svg className="face face--inline" viewBox="0 0 238 100">
          <path className="face--inline__body" d={arches(12, 100) + arches(138, 100)} />
          <path className="face--inline__groove" d={arches(12, 84) + arches(138, 84)} />
        </svg>
      );

    case "console":
      return (
        <span className="face face--console">
          <span className="face--console__stand">{INITIALS[0]}</span>
          <span className="face--console__lie">{INITIALS[1]}</span>
        </span>
      );

    case "slashes":
      return (
        <span className="face face--slashes">
          <span className="face--slashes__bar" />
          <span className="face--slashes__bar" />
          <span className="face--slashes__bar" />
          {INITIALS}
        </span>
      );

    case "heart":
      return (
        <svg className="face face--heart" viewBox="0 0 100 90">
          <path d={HEART} fill="currentColor" />
          <path className="face__cut" d="M80 13c7 3 10 10 9 17" />
        </svg>
      );
  }
}
