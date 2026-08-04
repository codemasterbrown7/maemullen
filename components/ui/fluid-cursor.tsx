"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  clearLetters,
  collectLetters,
  measureLetters,
  splitText,
  type LetterField,
} from "./proximity-type";
import "./fluid-cursor.css";

/**
 * The cursor: a drop with a smaller one trailing it, which fuse into a single
 * bead when the pointer slows or stops. It has no colour of its own — it is
 * filled white and blended with `difference`, so it shows the inverse of
 * whatever it is over: cream goes near black, a dark photograph goes bright,
 * the royal blue marquee goes orange. It also draws out along its heading as it
 * picks up speed. Whatever text it passes over swells and picks up the brand
 * blue.
 *
 * One cursor, every route. An earlier pass had a black "ink" drop on /, /v2 and
 * /services and the inverting one only on /v3; that is gone and the pathname no
 * longer selects anything. Do not reintroduce a second skin without a reason —
 * the whole thing is ~15 lines of state and it is only simple while there is
 * one of it.
 *
 * THE DROP IS EMERGENT, NOT SCRIPTED
 * There is no speed test and no "are we moving?" branch. The lead dot chases the
 * pointer hard, the trail chases the lead softly, and the SVG filter below fuses
 * any two shapes that come close enough. Move fast and the lag opens a gap wider
 * than the filter can bridge, so they read as two dots; stop and the trail
 * catches up and they merge with a neck, exactly like a droplet running down
 * glass. Speed thresholds would have to be tuned per display; a lag does not.
 *
 * The same lag is where the oval comes from, so that is not scripted either:
 *
 *   heading  = -(trail - lead)     the trail is always behind
 *   how fast =  |trail - lead|     the gap opens with speed
 *
 * A consequence worth naming: the deformation builds fast and relaxes slowly,
 * because that is what an eased chase does. That is the air-resistance feel,
 * and it came for free rather than being animated in.
 *
 * WHY THE INVERSION IS A BLEND AND NOT backdrop-filter
 * `backdrop-filter: invert(1)` is the obvious way to do this and it is the
 * wrong one here, twice over. It cannot be used at all inside a filtered
 * ancestor — `filter` makes an element a backdrop root and backdrop-filter only
 * sees inside its own — so it would cost the goo filter, the fusion and the
 * trail dot. And its blur is applied in the element's local space, so a shape
 * stretched to 1.65x has its blur stretched with it and smears in the one state
 * where you most want the edge crisp.
 *
 * `mix-blend-mode: difference` over a white fill has neither problem. Painting
 * order is filter first, then blend the filtered result with the backdrop, so
 * the metaball silhouette is what gets inverted — full inversion, hard edges,
 * no blur anywhere. |backdrop - 1| is a true channel inversion.
 *
 * WHY NOT THE motion/react COMPONENT THE BRIEF SUPPLIED
 * That component gives every letter its own motion value and its own useTransform.
 * On the demo's one word that is fine. Across a whole site it is a few thousand
 * subscriptions re-running every frame, and the hooks are called inside .map(),
 * which is a Rules-of-Hooks violation that only survives because the demo's
 * string length never changes. The effect it produces is worth having, so it is
 * reproduced here: one animation frame loop, positions cached up front, and a
 * single custom property written per affected letter — see proximity-type.ts.
 *
 * COST, because it has been raised: the two dots are cheap (the filter rides a
 * 320px box, not the viewport). The letters are the expensive half, so the loop
 * sleeps the moment nothing is moving, letters outside a bounding box are
 * rejected before any real maths, and no text inside a marquee is split at all —
 * a permanently running animation would keep the loop awake forever.
 *
 * QUALITY FLOOR
 * Coarse pointers and prefers-reduced-motion never get here: the overlay is
 * hidden in CSS (so there is no hydration mismatch) and the loop refuses to
 * start (so no text is split and nothing is measured). The native cursor is only
 * hidden once the replacement is actually running, so a JS failure leaves a
 * usable pointer behind.
 */

/* ── Feel ─────────────────────────────────────────────────────────────────
   The two easings are the whole personality. LEAD near 1 would weld the dot to
   the pointer and kill the drop; TRAIL near LEAD would keep the pair glued
   together and the trail would never separate. */
const LEAD_EASE = 0.24;
const TRAIL_EASE = 0.105;

/**
 * Cap on how far the trail may fall behind. A real droplet detaches rather than
 * stretching, and it also keeps both dots inside the overlay's box.
 *
 * That box is 320px square and rides the lead dot rather than covering the
 * viewport, because an SVG filter is evaluated over its source's bounding box —
 * a full-screen overlay would blur two million pixels sixty times a second for
 * the sake of two circles. 120px of lag clears it in any direction with room
 * left for the blur. The size itself lives in fluid-cursor.css.
 *
 * It doubles as the denominator for the oval: lag/MAX_LAG is "how fast", 0 to 1.
 */
const MAX_LAG = 120;

/* ── The oval ─────────────────────────────────────────────────────────────
   Deliberately restrained. The drop already says "fast" by splitting in two,
   and an ellipse strong enough to read on its own turns the whole thing rigid
   and mechanical — the shape stops looking like liquid and starts looking like
   a rotating pill. This only has to draw the lead out enough to suggest it is
   being pulled; the neck and the trailing dot do the rest. An earlier pass at
   0.95/0.34 was rejected for exactly that reason.

   The squash is floored well above the point where the drop would thin past
   what the filter's alpha cut can hold: at 0.18 the lead's short axis is ~18px,
   still clear of the 14px trail, which the threshold is tuned to keep. */
const STRETCH_MAX = 0.65;
const SQUASH_MAX = 0.18;

/* ── Reach of the text effect ───────────────────────────────────────────── */
const R_LEAD = 118;
const R_TRAIL = 84;
/** radius / 2.6 puts the gaussian at ~0.02 by the time it reaches the cull box,
 *  so letters fade out instead of switching off at the boundary. */
const SIGMA_LEAD = R_LEAD / 2.6;
const SIGMA_TRAIL = R_TRAIL / 2.6;

/** Below this the dot has arrived; the loop can stop until something moves. */
const REST = 0.05;
/** Don't touch the DOM for changes too small to see. */
const WRITE_EPS = 0.004;
/** Anything fainter than this is rounded away rather than left as a stuck sliver. */
const FLOOR = 0.01;

/**
 * Gentle at a stroll, full at a flick.
 *
 * The raw lag saturates at a fairly leisurely pointer speed — steady state puts
 * it near MAX_LAG at only ~14px a frame — so feeding it in linearly would leave
 * the drop permanently half-drawn. Smoothstep holds the low end back and spends
 * the range where the movement actually looks fast.
 */
function ramp(t: number) {
  return t * t * (3 - 2 * t);
}

function enabled() {
  return (
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function FluidCursor() {
  const pathname = usePathname();
  const fieldRef = useRef<LetterField | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLSpanElement>(null);
  const trailRef = useRef<HTMLSpanElement>(null);

  /* ── The cursor itself: listeners and the one animation frame loop ──────
     Mounted once, for the life of the app. It reads the letter field through a
     ref, so a navigation can swap the field underneath it without tearing any
     of this down — and without the drop having to fly back in from wherever it
     restarted. */
  useEffect(() => {
    if (!enabled()) return;

    const root = rootRef.current;
    const leadEl = leadRef.current;
    const trailEl = trailRef.current;
    if (!root || !leadEl || !trailEl) return;

    document.documentElement.classList.add("mm-cursor-on");

    const pointer = { x: 0, y: 0 };
    const lead = { x: 0, y: 0 };
    const trail = { x: 0, y: 0 };
    let started = false;
    /** Pointer has left the window: park the dots and release every letter. */
    let suppressed = false;
    let raf = 0;
    /** Last shape written to the lead, so a round drop is not rewritten every
     *  frame while the pointer sits still. */
    let shape = "";

    // Arrow consts declared after the null guard, not hoisted declarations:
    // TypeScript only carries a narrowing into a closure that is created after
    // it, and a function declaration is hoisted above the guard.
    const frame = () => {
      raf = requestAnimationFrame(frame);

      // Chase.
      const gapX = pointer.x - lead.x;
      const gapY = pointer.y - lead.y;
      lead.x += gapX * LEAD_EASE;
      lead.y += gapY * LEAD_EASE;
      trail.x += (lead.x - trail.x) * TRAIL_EASE;
      trail.y += (lead.y - trail.y) * TRAIL_EASE;

      let lagX = trail.x - lead.x;
      let lagY = trail.y - lead.y;
      const lag = Math.hypot(lagX, lagY);
      if (lag > MAX_LAG) {
        const k = MAX_LAG / lag;
        lagX *= k;
        lagY *= k;
        trail.x = lead.x + lagX;
        trail.y = lead.y + lagY;
      }

      root.style.transform = `translate3d(${lead.x}px, ${lead.y}px, 0)`;
      trailEl.style.transform = `translate3d(${lagX}px, ${lagY}px, 0)`;

      // Draw the lead out along the direction of travel. The trail is left round
      // on purpose: it is a detached satellite, not part of the same membrane,
      // and stretching it too would read as two pills rather than a drop
      // shedding a bead.
      let next = "";
      if (lag > REST) {
        const t = ramp(Math.min(1, lag / MAX_LAG));
        const angle = Math.atan2(-lagY, -lagX);
        const sx = 1 + STRETCH_MAX * t;
        const sy = 1 - SQUASH_MAX * t;
        next = `rotate(${angle.toFixed(4)}rad) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`;
      }
      if (next !== shape) {
        shape = next;
        leadEl.style.transform = next;
      }

      const wrote = drive(lead, trail, suppressed, fieldRef.current);

      // Nothing is moving and nothing changed — stop burning frames until the
      // pointer, the wheel or the window says otherwise.
      const settled = Math.abs(gapX) < REST && Math.abs(gapY) < REST && lag < REST;
      if (settled && !wrote) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const wake = () => {
      if (raf === 0) raf = requestAnimationFrame(frame);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;

      if (!started) {
        // Start where the pointer already is, or the dots fly in from 0,0.
        started = true;
        lead.x = trail.x = pointer.x;
        lead.y = trail.y = pointer.y;
        root.dataset.visible = "true";
      }
      if (suppressed) {
        suppressed = false;
        root.dataset.visible = "true";
      }

      wake();
    };

    const onLeave = () => {
      suppressed = true;
      root.dataset.visible = "false";
      wake();
    };

    // Scrolling moves the text past a stationary cursor, so the field has to be
    // re-driven even though nothing about the pointer changed.
    const onScroll = () => wake();

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("blur", onLeave);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
      document.documentElement.classList.remove("mm-cursor-on");
    };
  }, []);

  /* ── The text: split, measure, and re-measure when the page moves ───────
     Keyed on pathname because navigation between routes is client side: React
     throws the old DOM away and with it every letter we split, so the field has
     to be rebuilt against the new page. */
  useEffect(() => {
    if (!enabled()) return;

    let live = true;
    let pending = 0;

    const build = () => {
      if (!live) return;
      splitText(document.body);
      const field = collectLetters(document.body);
      measureLetters(field);
      fieldRef.current = field;
    };

    const remeasure = () => {
      if (pending || !live) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        if (fieldRef.current) measureLetters(fieldRef.current);
      });
    };

    // One frame after commit, so hydration has finished before the DOM is
    // rewritten underneath it.
    const kick = requestAnimationFrame(build);

    // Switzer and Heros load with display:swap, so the first paint is in the
    // fallback and every letter moves when the real faces arrive.
    document.fonts?.ready.then(remeasure).catch(() => {});

    window.addEventListener("resize", remeasure);
    // Catches reflow that no event reports: images arriving, text wrapping
    // differently, a section growing.
    const observer = new ResizeObserver(remeasure);
    observer.observe(document.body);

    return () => {
      live = false;
      cancelAnimationFrame(kick);
      if (pending) cancelAnimationFrame(pending);
      observer.disconnect();
      window.removeEventListener("resize", remeasure);
      if (fieldRef.current) clearLetters(fieldRef.current);
      fieldRef.current = null;
    };
  }, [pathname]);

  return (
    <>
      {/* Blur, then a steep ramp on the alpha channel alone: soft edges snap
          back to hard ones and shapes that overlap after the blur come out as a
          single silhouette. The same trick as the marquee, and for the same
          reason — filter: contrast() would work too but it crushes every colour
          channel to its extreme, and the fill has to stay exactly white or the
          difference blend stops being a true inversion. */}
      <svg width="0" height="0" aria-hidden="true" focusable="false" className="mm-cursor-defs">
        <defs>
          <filter id="mm-fluid-cursor">
            {/* Blur and threshold are a pair, and the small dot is what
                constrains them. A disc of radius r blurred by sigma keeps only
                1 - exp(-r²/2sigma²) of its alpha at the centre, so a dot much
                under 1.5·sigma across barely clears the cut and renders a
                fraction of its nominal size. At 5.5/0.42 the 13px trail came
                out at about 7px. 5 with the cut down at 0.35 leaves both dots
                clear of it and rendering true to size. SQUASH_MAX is bounded by
                the same arithmetic. */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 24 -8"
            />
          </filter>
        </defs>
      </svg>

      {/* Rendered on the server so there is no hydration mismatch; hidden until
          the first pointer move, and hidden for good on touch. */}
      <div ref={rootRef} className="mm-cursor" aria-hidden="true" data-visible="false">
        <span ref={leadRef} className="mm-cursor__dot mm-cursor__dot--lead" />
        <span ref={trailRef} className="mm-cursor__dot mm-cursor__dot--trail" />
      </div>
    </>
  );
}

/**
 * Lights every letter within reach of either dot. Returns whether anything
 * actually changed, which is how the loop knows it may stop.
 *
 * Both dots drive it, per the brief. A letter takes the stronger of the two
 * rather than their sum, so the merged drop is not twice as loud as one dot.
 */
function drive(
  lead: { x: number; y: number },
  trail: { x: number; y: number },
  suppressed: boolean,
  field: LetterField | null,
): boolean {
  if (!field) return false;

  const { els, cx, cy, prev } = field;
  // Letters are cached against the document; the dots live in the viewport.
  const sx = window.scrollX;
  const sy = window.scrollY;
  const ax = lead.x + sx;
  const ay = lead.y + sy;
  const bx = trail.x + sx;
  const by = trail.y + sy;

  let wrote = false;

  for (let i = 0; i < els.length; i += 1) {
    let p = 0;

    if (!suppressed) {
      // Box test before the exponential: on a full page this rejects all but a
      // few dozen letters for the cost of four comparisons.
      const dx = cx[i] - ax;
      const dy = cy[i] - ay;
      if (dx > -R_LEAD && dx < R_LEAD && dy > -R_LEAD && dy < R_LEAD) {
        p = Math.exp(-(dx * dx + dy * dy) / (2 * SIGMA_LEAD * SIGMA_LEAD));
      }
      const tx = cx[i] - bx;
      const ty = cy[i] - by;
      if (tx > -R_TRAIL && tx < R_TRAIL && ty > -R_TRAIL && ty < R_TRAIL) {
        const q = Math.exp(-(tx * tx + ty * ty) / (2 * SIGMA_TRAIL * SIGMA_TRAIL));
        if (q > p) p = q;
      }
      if (p < FLOOR) p = 0;
    }

    if (p === 0) {
      // Unconditional, not epsilon-gated: a letter sitting just under the write
      // threshold would otherwise stay minutely scaled for the rest of the page.
      if (prev[i] !== 0) {
        prev[i] = 0;
        els[i].style.removeProperty("--mm-p");
        wrote = true;
      }
    } else if (Math.abs(p - prev[i]) > WRITE_EPS) {
      prev[i] = p;
      els[i].style.setProperty("--mm-p", p.toFixed(3));
      wrote = true;
    }
  }

  return wrote;
}
