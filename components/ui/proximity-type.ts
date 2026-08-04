/**
 * Splits the page's text into per-letter spans so the cursor can push them
 * around, and keeps a flat cache of where every letter is.
 *
 * WHY IT IS DONE IN THE DOM RATHER THAN IN REACT
 * The brief is "all text on the website". Doing that in JSX means wrapping every
 * string in every component in every route; doing it here is one TreeWalker pass
 * that covers /, /v2, /v3 and anything added later for free. It is safe in this
 * codebase specifically because every page is a static server component with no
 * state, so React never re-renders these subtrees and never tries to reconcile
 * the nodes we replaced. If a page ever gains client state, exclude it with
 * data-no-proximity rather than hoping.
 *
 * WHY THE CENTRES ARE CACHED IN DOCUMENT COORDINATES
 * The alternative is getBoundingClientRect() per letter per frame, which is a
 * forced layout thousands of times a second. Stored against the document instead
 * of the viewport, scrolling needs no re-measure at all — the cursor's viewport
 * position is converted on the way in. Only a resize or a reflow invalidates it.
 */

/** One flat record of every letter on the page. Parallel arrays, not objects:
 *  the hot loop touches every entry each frame and this keeps it in cache. */
export type LetterField = {
  els: HTMLElement[];
  /** Centre of each letter, in DOCUMENT coordinates. */
  cx: Float32Array;
  cy: Float32Array;
  /** Last proximity written, so the loop can skip unchanged letters. */
  prev: Float32Array;
};

/** Never split inside these — the text is not laid out as text. */
const SKIP_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "TEXTAREA",
  "INPUT",
  "SELECT",
  "OPTION",
  "CODE",
  "PRE",
  "TITLE",
]);

/**
 * .gooey-marquee is the important one. It draws the same rows twice — once
 * blurred and thresholded, once clean — and the effect only works while the two
 * layers stay in exact register. Splitting one of them into inline-blocks moves
 * it by a fraction of a pixel and the whole band ghosts. It has its own morph
 * anyway; two goo effects on the same letters would be mush.
 */
const SKIP_CLOSEST = [
  ".gooey-marquee",
  ".mm-visually-hidden",
  ".mm-cursor",
  ".mm-prox",
  "[data-no-proximity]",
].join(", ");

const XHTML = "http://www.w3.org/1999/xhtml";

/** Grapheme-aware where available: "MaeMüllen" must not lose its diaeresis to a
 *  naive code-unit split, and Array.from still breaks decomposed forms apart. */
const segmenter =
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;

function graphemes(word: string): string[] {
  if (!segmenter) return Array.from(word);
  return Array.from(segmenter.segment(word), (s) => s.segment);
}

/**
 * Anything riding a running animation is left alone as well, whatever it is
 * called. A cached centre is a lie for text inside a marquee — the row slides
 * out from under it and the cursor would light whichever letters happened to be
 * there when the page loaded. Asked of the engine rather than answered with a
 * list of class names, so it also covers the older marquee on / and anything
 * added later. Only the ancestors matter, so this is a cheap Set lookup per
 * candidate rather than a walk over every animation.
 */
function movingElements(): Set<Element> {
  const moving = new Set<Element>();
  for (const animation of document.getAnimations()) {
    const target = (animation.effect as KeyframeEffect | null)?.target;
    if (target) moving.add(target);
  }
  return moving;
}

function ridesAnimation(el: Element, moving: Set<Element>, root: Element): boolean {
  if (moving.size === 0) return false;
  let node: Element | null = el;
  while (node && node !== root) {
    if (moving.has(node)) return true;
    node = node.parentElement;
  }
  return false;
}

/**
 * Replaces one text node with an aria-hidden pile of letter spans plus a
 * visually hidden copy of the original string.
 *
 * The screen-reader copy is not belt-and-braces. Some engines announce a run of
 * inline-block spans character by character, and this page is mostly uppercase
 * labels, which are exactly the case where that goes wrong. One extra text node
 * per split (not per letter) buys the original reading back.
 *
 * Whitespace runs are re-emitted as real text nodes rather than the &nbsp; the
 * reference component uses. That matters here: .v3__body is `text-align:
 * justify`, and justification stretches the gaps at breakable spaces — nbsp is
 * not one, so the reference's version would have quietly killed the flush-both-
 * edges setting that the client's type reference is built on.
 */
function splitTextNode(node: Text) {
  const text = node.nodeValue ?? "";
  const visual = document.createElement("span");
  visual.className = "mm-prox";
  visual.setAttribute("aria-hidden", "true");

  for (const part of text.split(/(\s+)/)) {
    if (!part) continue;
    if (!part.trim()) {
      visual.appendChild(document.createTextNode(part));
      continue;
    }
    // Words stay whole: every letter is an inline-block and therefore a line
    // break opportunity, so without this a paragraph would break mid-word.
    const word = document.createElement("span");
    word.className = "mm-prox__w";
    for (const ch of graphemes(part)) {
      const letter = document.createElement("span");
      letter.className = "mm-prox__l";
      letter.textContent = ch;
      word.appendChild(letter);
    }
    visual.appendChild(word);
  }

  const spoken = document.createElement("span");
  spoken.className = "mm-visually-hidden";
  spoken.textContent = text;

  const frag = document.createDocumentFragment();
  frag.append(visual, spoken);
  node.replaceWith(frag);
}

/** Splits every eligible text node under `root`. Idempotent — already-split text
 *  sits inside .mm-prox, which the filter rejects. */
export function splitText(root: HTMLElement) {
  const moving = movingElements();

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT;
      const parent = (node as Text).parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      // Rejects <svg> and everything under it: SVG text is not laid out like
      // HTML text and an HTML <span> inside it renders nothing at all.
      if (parent.namespaceURI !== XHTML) return NodeFilter.FILTER_REJECT;
      if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (parent.closest(SKIP_CLOSEST)) return NodeFilter.FILTER_REJECT;
      if (ridesAnimation(parent, moving, root)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  // Collected first, mutated after: replacing nodes mid-walk invalidates it.
  const targets: Text[] = [];
  while (walker.nextNode()) targets.push(walker.currentNode as Text);
  for (const node of targets) splitTextNode(node);
}

export function collectLetters(root: HTMLElement): LetterField {
  const els = Array.from(root.querySelectorAll<HTMLElement>(".mm-prox__l"));
  return {
    els,
    cx: new Float32Array(els.length),
    cy: new Float32Array(els.length),
    prev: new Float32Array(els.length),
  };
}

/** Parked far outside any real page, so a letter that is not laid out (display:
 *  none, or an ancestor still hidden) can never match the cursor. Zero would put
 *  it at the document origin, where it would light up under the header. */
const OFFSCREEN = 1e9;

export function measureLetters(field: LetterField) {
  const { els, cx, cy } = field;
  const sx = window.scrollX;
  const sy = window.scrollY;

  // Reads only, no interleaved writes — one layout for the whole pass.
  for (let i = 0; i < els.length; i += 1) {
    const r = els[i].getBoundingClientRect();
    if (r.width === 0 && r.height === 0) {
      cx[i] = OFFSCREEN;
      cy[i] = OFFSCREEN;
      continue;
    }
    // The centre of a letter does not move when it is scaled about its own
    // centre, so a lit letter still measures where it belongs.
    cx[i] = r.left + r.width / 2 + sx;
    cy[i] = r.top + r.height / 2 + sy;
  }
}

/** Clears every letter this field has touched. Used when the field is thrown
 *  away on navigation, so nothing is left frozen mid-scale. */
export function clearLetters(field: LetterField) {
  const { els, prev } = field;
  for (let i = 0; i < els.length; i += 1) {
    if (prev[i] !== 0) {
      prev[i] = 0;
      els[i].style.removeProperty("--mm-p");
    }
  }
}
