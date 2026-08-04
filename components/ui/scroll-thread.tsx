"use client";

import { useEffect, useRef, useState } from "react";
import "./scroll-thread.css";

/**
 * One line that draws itself as the page scrolls — an ornament at the top, a
 * single strand down the page with one loop-the-loop in it, a stroke that rules
 * under whatever it is pointed at, and a last flourish off the end of it.
 *
 * WHY IT MEASURES THE PAGE INSTEAD OF USING FIXED COORDINATES. The first
 * version was hand-placed waypoints in an abstract grid, and it crossed text —
 * unavoidably, because the sections are different heights at every viewport
 * width, so a coordinate that is in the empty half at 1440px is over a
 * paragraph at 1100px. This version reads the real geometry out of the DOM.
 * Elements opt in with `data-thread`:
 *
 *   data-thread="knot"        draw a wandering knot of loops in this box;
 *     data-thread-flip="1"    mirrored, so the line arrives at its near end
 *                             rather than across the whole shape
 *     data-thread-exit="50"   the compass bearing, in page space, that the
 *                             knot should be heading when it stops — point it
 *                             at wherever the line goes next
 *     data-thread-loops="7"   how many loops it wanders through. This is the
 *                             busy/simple dial: it is the only thing deciding
 *                             whether the shape reads as a flourish or as a
 *                             scribble, so it is set per instance
 *     data-thread-shape="fit" spread the loops out until the tangle fills the
 *                             box, instead of keeping its natural proportions.
 *                             See KNOT_SHAPES — the default is the masthead's
 *                             and is not to be tuned
 *   data-thread="flower"      draw a five-petal flower in this box instead,
 *     data-thread-phase="122" rotated by this many degrees — pick the angle
 *                             that puts a GAP where the line arrives and leaves
 *   data-thread="pass"        run through this element, at
 *     data-thread-x="0.8"     this fraction of the page width — point it at the
 *                             half the copy is NOT in
 *     data-thread-loop="right" and put one loop-the-loop in that run
 *   data-thread="underline"   drop down the margin beside this element, rule
 *                             under it left to right, and turn back up off the
 *                             end of it
 *   data-thread="point"       finish by swerving out and back to an arrowhead
 *                             off the end of this element, aimed at it. Last.
 *
 * DOCUMENT ORDER IS DRAW ORDER — the elements are read with one
 * querySelectorAll, so where a thing sits in the markup is when the pen gets to
 * it. That is why the closing knot follows the heading rather than preceding it:
 * the line rules under the words and then runs on into the flourish.
 *
 * "knot" and "flower" are interchangeable per instance: the client has now
 * preferred each of them in turn, so both stay and the markup picks.
 *
 * So "don't cross the text" is a property of the markup rather than a number
 * someone has to keep re-tuning. It re-measures on resize and once the webfonts
 * land, because both move the words.
 *
 * WHY THE PEN IS DRIVEN BY A SWEEP LINE AND NOT BY SCROLL PROGRESS. Mapping
 * scroll 0→1 onto path length 0→1 looks obvious and is wrong: path length is
 * not proportional to page height. A knot packs a couple of thousand pixels of
 * line into three hundred pixels of page, so the pen tears through it and then
 * spends the rest of the page far off-screen — you never actually catch it
 * drawing. Instead the path is sampled once into a y-per-arc-length table, and
 * on each frame we draw everything lying above a sweep line held near the
 * bottom of the viewport. The pen is then always exactly where you are looking,
 * whatever the line is doing.
 *
 * WHY NOT FRAMER-MOTION. Its `pathLength` only drives stroke-dasharray and
 * stroke-dashoffset, which SVG gives us free — and it would animate the wrong
 * variable anyway, per the paragraph above. `pathLength={1}` renormalises the
 * path so its length is exactly 1 whatever the geometry, so the offset IS the
 * fraction. Progress is written straight to the DOM node inside a rAF and never
 * becomes React state, so scrolling causes no re-renders.
 *
 * Decorative: aria-hidden, pointer-events none, and under
 * `prefers-reduced-motion: reduce` it renders complete and still.
 */

type Pt = readonly [number, number];
type Box = { left: number; top: number; width: number; height: number };

const round = (n: number) => Math.round(n * 10) / 10;
const DEG = Math.PI / 180;

function cubicAt(p0: Pt, c1: Pt, c2: Pt, p1: Pt, t: number): Pt {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [
    a * p0[0] + b * c1[0] + c * c2[0] + d * p1[0],
    a * p0[1] + b * c1[1] + c * c2[1] + d * p1[1],
  ];
}

/**
 * The flower: five long petals off one centre, drawn as real cubic béziers and
 * then sampled densely so the rest of the pipeline can treat them as points.
 *
 * THE GEOMETRY, because none of these numbers are free.
 *
 * Each petal is ONE cubic that leaves the centre and returns to it, with both
 * control arms thrown out at ±`spread` either side of the petal's direction.
 * Two constraints then decide everything:
 *
 *   · SMOOTHNESS. The tangent leaving one petal only lines up with the tangent
 *     entering the next when the angle between them is exactly 2·spread − 180.
 *     Get this wrong and every petal meets the next at a cusp — which is what
 *     the first two attempts did, and why they were called scribbles.
 *   · EVEN SPACING. For petals to land evenly round a circle, that angle also
 *     has to be 360·skip/petals.
 *
 * Solving both for five petals with skip 2 gives a step of 144° and a spread of
 * 162° — the arms end up only 36° apart, both thrown out away from the centre,
 * so each petal comes out long and narrow rather than round. That pair IS the
 * shape; 5-and-1 gives a fat rosette, 9-and-4 gives a spiky asterisk.
 *
 * `phase` rotates the whole thing, and it matters more than it looks: it decides
 * whether the line arrives and leaves through a GAP between petals or straight
 * across one. Tuned per instance from the markup.
 *
 * Generated in unit space and fitted to its box afterwards, so it cannot spill
 * out of the area it was given however the parameters are tuned.
 */
const PETALS = 5;
const PETAL_SKIP = 2;

function flowerPoints(box: Box, phase: number): Pt[] {
  const step = (360 * PETAL_SKIP) / PETALS;
  const spread = ((180 + step) / 2) * DEG;
  const samplesPerPetal = 44;
  const centre: Pt = [0, 0];

  const raw: Pt[] = [centre];

  for (let i = 0; i < PETALS; i++) {
    const theta = (phase + step * i) * DEG;
    // LENGTH ONLY. Varying the arm's magnitude leaves its direction alone, so
    // the tangents still meet cleanly at the centre and the flower just stops
    // looking machine-made. Jittering the ANGLE would put a kink in every join.
    const len = 1 + 0.16 * Math.sin(i * 2.3 + 0.7);
    const c1: Pt = [Math.cos(theta - spread) * len, Math.sin(theta - spread) * len];
    const c2: Pt = [Math.cos(theta + spread) * len, Math.sin(theta + spread) * len];
    for (let k = 1; k <= samplesPerPetal; k++) {
      raw.push(cubicAt(centre, c1, c2, centre, k / samplesPerPetal));
    }
  }

  return fitToBox(raw, box, false);
}

/**
 * The knot: a chain of long overlapping loops wandering across its box, rather
 * than five petals off one centre.
 *
 * Same primitive as a flower petal — one cubic out from a base point and back —
 * with two differences, and both of them matter:
 *
 *   · `spread` is 143°, which fans the loops by about 106° a time. That does
 *     not divide the circle evenly, so they never land in a tidy rosette.
 *   · the base DRIFTS between loops, which is what turns a rosette into a knot.
 *     Below about a twentieth of a unit the loops all radiate from effectively
 *     one spot, and loops off one spot are a rosette — which is the flower, a
 *     shape this page moved away from. Past about a third of a loop's own reach
 *     they stretch into pinched slivers and it reads as a scribble, which has
 *     been rejected twice.
 *
 * The drift is also what forces the chaining in the loop below — see there.
 *
 * This was the shape before the flower, and it is the shape the client came
 * back to. The two are interchangeable per instance from the markup — see the
 * `data-thread` values in the header comment.
 *
 * `petals` IS THE BUSY/SIMPLE DIAL and it is per instance. Four is a bow and was
 * called too simple; seven is the pair on this page.
 *
 * TWO SHAPES, AND THE SPLIT IS DELIBERATE. The masthead knot is settled — it has
 * been through the flower and back and the client has asked twice not to have it
 * touched. `natural` is exactly what it has always been drawn with, and nothing
 * tuned for the closing knot may reach it: that is the whole reason these numbers
 * are a per-instance table rather than module constants, because as constants a
 * change made for the foot of the page silently redrew the top of it.
 */
const KNOT_SPREAD = 143 * DEG;
const KNOT_SAMPLES = 30;
const KNOT_DRIFT_MIN = 0.05;
const KNOT_DRIFT_MAX = 0.18;

type KnotShape = {
  /** Total distance the base walks over the whole chain, or solved from the box. */
  drift: number | "fit";
  /** Mean loop length and its swing either side, both absolute. */
  reach: number;
  vary: number;
  /** Vertical wander of the base. */
  wobble: number;
  /**
   * Length of the two END loops as a fraction of the middle ones. They are the
   * only loops with nothing drawn across them, so at full length they read as
   * two big open lobes with a tangle parked between them — and the lower of the
   * two sets the shape's bottom edge, which held the closing knot up away from
   * the words. 1 leaves them alone.
   */
  taper: number;
};

const KNOT_SHAPES: Record<string, KnotShape> = {
  /** THE MASTHEAD. Settled, and not to be tuned — see above. */
  natural: { drift: 0.34, reach: 0.484, vary: 0.143, wobble: 0.12, taper: 1 },
  /**
   * THE CLOSING KNOT. `fit` walks the base out until the tangle is as wide,
   * relative to its height, as the box it has been given: `fitToBox` scales
   * uniformly, so whatever the shape does not use of its box comes out as dead
   * cream along one axis, and a compact tangle in a wide shallow box sat in the
   * middle of it with a wedge of nothing beside it.
   */
  fit: { drift: "fit", reach: 0.55, vary: 0.066, wobble: 0.13, taper: 0.72 },
};

/** The chain itself, in unit space, at a given per-loop drift. */
function knotChain(petals: number, drift: number, shape: KnotShape): Pt[] {
  const spread = KNOT_SPREAD;

  const baseAt = (i: number): Pt => [drift * i, shape.wobble * Math.sin(i * 1.6 + 0.3)];

  const raw: Pt[] = [];
  let p = baseAt(0);
  let theta = -35 * DEG;
  let exit: Pt | null = null;
  raw.push(p);

  for (let i = 0; i < petals; i++) {
    // EACH PETAL'S DIRECTION COMES FROM THE PREVIOUS PETAL'S ACTUAL EXIT, not
    // from stepping a fixed 2·spread − 180 degrees. Those are the same thing
    // only when the base does not move; here it drifts, so a fixed step leaves
    // a real angular mismatch at every join — measured at 4° to 17°, worst
    // where a petal's arm is shortest, and the 17° one was visible as a hard
    // corner in the middle of the knot. Chaining off the true exit tangent
    // makes every join exactly continuous while keeping the same fan and the
    // same overall shape.
    if (exit) theta = Math.atan2(exit[1], exit[0]) + spread;

    // Shortening the end loops packs the mass into the middle, which is where a
    // knot's mass belongs — see `taper` on KnotShape.
    const taper = shape.taper + (1 - shape.taper) * Math.sin((Math.PI * (i + 0.5)) / petals);
    const len = taper * (shape.reach + shape.vary * Math.sin(i * 1.7 + 0.9));
    const c1: Pt = [p[0] + Math.cos(theta - spread) * len, p[1] + Math.sin(theta - spread) * len];
    const c2: Pt = [p[0] + Math.cos(theta + spread) * len, p[1] + Math.sin(theta + spread) * len];
    const next = baseAt(i + 1);

    for (let k = 1; k <= KNOT_SAMPLES; k++) {
      raw.push(cubicAt(p, c1, c2, next, k / KNOT_SAMPLES));
    }

    exit = [next[0] - c2[0], next[1] - c2[1]];
    p = next;
  }

  return raw;
}

const extent = (pts: readonly Pt[]) =>
  [
    Math.max(...pts.map((q) => q[0])) - Math.min(...pts.map((q) => q[0])),
    Math.max(...pts.map((q) => q[1])) - Math.min(...pts.map((q) => q[1])),
  ] as const;

function knotPoints(
  box: Box,
  flip: boolean,
  exitDeg: number,
  petals: number,
  shape: KnotShape,
): Pt[] {
  // Solved rather than estimated, because drifting the base also swings every
  // loop after it — a single correction off the undrifted rosette undershot by
  // about a third and the loops piled up into a ball. Three passes lands inside
  // a tenth of a percent; it is arithmetic over ~200 points and runs once per
  // measure, not per frame. Held between the rosette floor and the scribble
  // ceiling, so a box the shape cannot honestly fill keeps its slack instead.
  let drift = shape.drift === "fit" ? KNOT_DRIFT_MIN : shape.drift / petals;
  if (shape.drift === "fit") {
    const aspect = box.width / box.height;
    for (let pass = 0; pass < 3; pass++) {
      const [w, h] = extent(knotChain(petals, drift, shape));
      drift = Math.min(Math.max(drift + (aspect * h - w) / petals, KNOT_DRIFT_MIN), KNOT_DRIFT_MAX);
    }
  }

  const raw = knotChain(petals, drift, shape);

  // STOP DRAWING WHERE IT IS ALREADY HEADING THE RIGHT WAY.
  //
  // Left to run to the end, the knot finishes pointing up and back to the left,
  // while the line then has to leave down and to the right. Something has to
  // absorb that reversal and there is no good answer: a uniform spline shot off
  // in a dead straight diagonal, and a centripetal one hooked round in a 10px
  // radius — under the 14px stroke width, so the stroke folded over itself. Both
  // read as a bump.
  //
  // But the knot is a continuous curve whose tangent sweeps through every
  // direction inside a single petal, so there is always a point in the last
  // petal already heading where we want to go. Ending there means no reversal
  // exists to absorb. It costs the tail of one loop out of seven.
  //
  // `exitDeg` is in page space; the mirror in fitToBox turns a unit-space angle
  // θ into 180 − θ, so undo it here.
  const want = ((flip ? 180 - exitDeg : exitDeg) * DEG + Math.PI * 4) % (Math.PI * 2);
  let cut = raw.length - 1;
  let best = Infinity;
  for (let i = raw.length - KNOT_SAMPLES; i < raw.length - 1; i++) {
    const angle = Math.atan2(raw[i + 1][1] - raw[i][1], raw[i + 1][0] - raw[i][0]);
    const diff = Math.abs(((angle - want + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
    if (diff < best) {
      best = diff;
      cut = i;
    }
  }

  return fitToBox(raw.slice(0, cut + 1), box, flip);
}

/**
 * Bow the connector that leaves an ornament, so it departs on a curve instead
 * of a ruler-straight diagonal.
 *
 * The knot's last petal leaves heading up and back to the left, but the line
 * then has to travel down and right to the next waypoint — close to a reversal,
 * and a spline handed a reversal just shoots off in a straight line. That
 * straight run was the one thing the client picked out of an otherwise curved
 * design.
 *
 * The fix is one point, pushed off the midpoint of the connector at right
 * angles to it, which is enough to turn the whole span into an arc. It bows
 * towards the middle of the page rather than away: outwards would send it into
 * the margin and off the edge, and the middle of the page is the empty part
 * anyway. A lead-out grown off the knot itself was tried first and is worse —
 * to come round from a reversal it needs a sweep big enough to escape the
 * masthead entirely, and it sailed up over the header.
 */
function bowConnector(points: Pt[], at: number, hostWidth: number): void {
  const a = points[at];
  const b = points[at + 1];
  if (!a || !b) return;

  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  if (len < hostWidth * 0.12) return; // short hops are already curved enough

  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  let px = -dy / len;
  let py = dx / len;
  if ((mx - hostWidth / 2) * px > 0) {
    px = -px;
    py = -py;
  }

  const bow = Math.min(len * 0.3, hostWidth * 0.14);
  points.splice(at + 1, 0, [mx + px * bow, my + py * bow]);
}

/**
 * Scale into the box uniformly, so loops keep their proportions — centred
 * across, but anchored to the TOP. Centring vertically would waste the slack in
 * a box taller than the shape, and that slack is exactly what lets it reach up
 * behind the headline.
 *
 * `flip` mirrors it left-to-right. That is not cosmetic: the knot starts at one
 * end and finishes at the other, so which way round it sits decides whether the
 * line arrives across the whole shape or straight into its near end. Arriving
 * across it is what made the closing one look scribbled. Mirroring also turns
 * the lead-out's down-RIGHT sweep into a down-left one, which is where the
 * closing knot needs to go.
 *
 * Only the first `fitCount` points set the bounding box; anything after gets
 * the same transform but is allowed outside it. That is how the lead-out can
 * extend past the box without shrinking the shape it grows out of.
 */
function fitToBox(
  raw: readonly Pt[],
  box: Box,
  flip: boolean,
  fitCount = raw.length,
): Pt[] {
  const pts = flip ? raw.map((q) => [-q[0], q[1]] as Pt) : raw;
  const measured = pts.slice(0, fitCount);
  const xs = measured.map((q) => q[0]);
  const ys = measured.map((q) => q[1]);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const spanX = Math.max(...xs) - minX || 1;
  const spanY = Math.max(...ys) - minY || 1;
  const scale = Math.min(box.width / spanX, box.height / spanY);
  const offX = box.left + (box.width - spanX * scale) / 2;
  const offY = box.top;

  return pts.map((q) => [offX + (q[0] - minX) * scale, offY + (q[1] - minY) * scale] as Pt);
}

/**
 * A single loop-the-loop, dropped into the middle of an otherwise straight run
 * so the descent has one moment in it.
 *
 * A circle with a steady vertical drift — a prolate cycloid — NOT a closed loop.
 * The first version was a closed one (out from a point and back to the same
 * point) and it read wrong for a specific reason: the two strands met
 * tangentially at one spot, so instead of crossing they pinched, and the whole
 * thing looked like a bow tied on the line rather than a coil in it.
 *
 * The drift is what fixes it. `pitch` separates where the loop starts from
 * where it ends, so the strands genuinely cross at an angle. At 0.9 × radius
 * the crossing is open enough to read; much less and it pinches again, much
 * more and the loop stops closing.
 *
 * Both ends leave heading exactly straight down — the horizontal component of
 * the velocity is zero at t=0 and t=1, because the sweep starts and ends at the
 * side of the circle — so it joins the straight run above and below with no
 * corner at all. That holds whichever side it bulges towards.
 */
function loopPoints(p: Pt, side: 1 | -1, radius: number): Pt[] {
  const pitch = radius * 0.9;
  const cx = p[0] + side * radius;
  const out: Pt[] = [];
  const steps = 48;
  for (let k = 0; k <= steps; k++) {
    const t = k / steps;
    const a = (180 - 360 * t) * DEG;
    out.push([cx + Math.cos(a) * radius * side, p[1] + Math.sin(a) * radius + pitch * t]);
  }
  return out;
}

/**
 * CENTRIPETAL Catmull-Rom through every point, converted to cubic béziers, so
 * the curve passes exactly through them rather than being pulled off them.
 * Segments inside a `straight` range are emitted as lines instead. There are two
 * of them: the underline, because a smoothed underline is a sag, and the barbs
 * of the arrowhead, because a smoothed corner is not a barb. Ranges rather than
 * a tail, because neither is the last thing the line does.
 *
 * The parameterisation is the whole point. Plain Catmull-Rom advances its
 * parameter by 1 per point, which assumes the points are evenly spaced — and
 * these are wildly not: an ornament contributes two hundred samples a few
 * pixels apart, then the next waypoint is most of a page away. At that junction
 * the uniform version computes the tangent almost entirely from the far point,
 * so the curve leaves the ornament aimed straight at it and puts a hard corner
 * in the line. That corner is what the client spotted as a "weird bump".
 *
 * Advancing the parameter by the SQUARE ROOT of each gap instead fixes it at
 * source: the two long terms in the tangent cancel and what survives is the
 * ornament's own direction, scaled small — so the line leaves tangentially and
 * then bends towards the next point. It also removes the need for the arm cap
 * this used to carry, which was a crude approximation of the same idea.
 */
function toPath(points: readonly Pt[], straight: readonly (readonly [number, number])[]): string {
  if (points.length < 2) return "";

  const at = (i: number) => points[Math.min(Math.max(i, 0), points.length - 1)];

  let d = `M ${round(at(0)[0])} ${round(at(0)[1])}`;

  for (let i = 0; i < points.length - 1; i++) {
    if (straight.some(([from, to]) => i >= from && i < to)) {
      d += ` L ${round(at(i + 1)[0])} ${round(at(i + 1)[1])}`;
      continue;
    }

    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];

    // Knot spacing. The `|| 1e-6` is a divide-by-zero guard for coincident
    // points, which the clamped `at()` produces at both ends of the path.
    const t01 = Math.sqrt(Math.hypot(p1[0] - p0[0], p1[1] - p0[1])) || 1e-6;
    const t12 = Math.sqrt(Math.hypot(p2[0] - p1[0], p2[1] - p1[1])) || 1e-6;
    const t23 = Math.sqrt(Math.hypot(p3[0] - p2[0], p3[1] - p2[1])) || 1e-6;

    const tangent = (axis: 0 | 1) => {
      const m1 =
        t12 *
        ((p1[axis] - p0[axis]) / t01 -
          (p2[axis] - p0[axis]) / (t01 + t12) +
          (p2[axis] - p1[axis]) / t12);
      const m2 =
        t12 *
        ((p2[axis] - p1[axis]) / t12 -
          (p3[axis] - p1[axis]) / (t12 + t23) +
          (p3[axis] - p2[axis]) / t23);
      return [m1, m2];
    };

    const [m1x, m2x] = tangent(0);
    const [m1y, m2y] = tangent(1);

    d +=
      ` C ${round(p1[0] + m1x / 3)} ${round(p1[1] + m1y / 3)},` +
      ` ${round(p2[0] - m2x / 3)} ${round(p2[1] - m2y / 3)},` +
      ` ${round(p2[0])} ${round(p2[1])}`;
  }

  return d;
}

function buildPath(host: HTMLElement, selector: string) {
  const hostRect = host.getBoundingClientRect();
  if (hostRect.width < 1 || hostRect.height < 1) return null;

  const rel = (el: Element): Box => {
    const r = el.getBoundingClientRect();
    return {
      left: r.left - hostRect.left,
      top: r.top - hostRect.top,
      width: r.width,
      height: r.height,
    };
  };

  const points: Pt[] = [];
  // Connectors either side of an ornament, by the index of the point they
  // start at. Both need bowing: one is the line leaving the shape, the other
  // the line arriving at it, and a spline draws both as ruler-straight runs.
  const bowAt: number[] = [];
  const straight: [number, number][] = [];
  // The underline's own y, so the arrow after it can be kept above it.
  let ruleY = Infinity;

  for (const el of Array.from(document.querySelectorAll<HTMLElement>(selector))) {
    const box = rel(el);
    const kind = el.dataset.thread;

    if (kind === "knot" || kind === "flower") {
      if (points.length) bowAt.push(points.length - 1);
      points.push(
        ...(kind === "knot"
          ? knotPoints(
              box,
              el.dataset.threadFlip === "1",
              Number(el.dataset.threadExit ?? 50),
              Number(el.dataset.threadLoops ?? 7),
              KNOT_SHAPES[el.dataset.threadShape ?? "natural"] ?? KNOT_SHAPES.natural,
            )
          : flowerPoints(box, Number(el.dataset.threadPhase ?? 122))),
      );
      bowAt.push(points.length - 1);
    } else if (kind === "pass") {
      // TWO points, near the top and near the bottom, both at the same x. That
      // is what keeps the line running straight down the empty lane for the
      // whole height of a section and confines the crossing to the gap between
      // sections, where there is nothing to cross.
      const x = Number(el.dataset.threadX ?? 0.5) * hostRect.width;
      points.push([x, box.top + box.height * 0.15]);

      // One section opts into a loop-the-loop halfway down its run. Radius is
      // bounded by the section's own height as well as the page width, so a
      // short section cannot end up with a loop taller than it is.
      const loop = el.dataset.threadLoop;
      if (loop === "left" || loop === "right") {
        points.push(
          ...loopPoints(
            [x, box.top + box.height * 0.36],
            loop === "right" ? 1 : -1,
            Math.min(hostRect.width * 0.1, box.height * 0.2),
          ),
        );
      } else {
        // A third point pinning the middle of the run. Without it the spline
        // bows out sideways across the whole section, because the points either
        // side of this one are in the OPPOSITE half of the page and drag the
        // tangents with them — which is how the line ended up riding the edge
        // of the Bendito plate instead of crossing it.
        points.push([x, box.top + box.height * 0.5]);
      }

      points.push([x, box.top + box.height * 0.85]);
    } else if (kind === "underline") {
      // NO BOW ON THE WAY IN. `bowConnector` pushes towards the middle of the
      // page, and on a run already heading down and left into the margin that
      // push is downwards — which is what carried the approach across the front
      // of the heading instead of past it. Drop any bow registered by whatever
      // came before; the descent below is deliberately straight anyway.
      if (bowAt.length && bowAt[bowAt.length - 1] === points.length - 1) bowAt.pop();

      const rule = box.top + box.height + 16;
      ruleY = rule;

      // Down a lane in the margin BESIDE the heading, a quarter turn into the
      // rule, along under the words, and a second quarter turn back up off the
      // end of them. Left to right, the direction the gesture reads in, and
      // nothing ever passes over the words.
      //
      // WHY THE CORNERS ARE EXPLICIT ARCS. The first version was two waypoints
      // with the spline left to invent the turn. It came out as a teardrop
      // hooked on the end of the line, and because the last smoothed point was
      // also the first point of the straight rule, the curve arrived at an angle
      // and the join showed as a notch. Both were called out. A quarter circle
      // fixes the class of problem rather than the instance: it leaves heading
      // exactly along the rule, so there is no kink available to it, and its
      // radius is a stated number instead of an accident of where the
      // neighbouring waypoints happened to fall. The same argument applies at
      // the far end now that the line carries on past the words.
      const lane = Math.max(box.left - 84, 18);
      // Big enough to read as a curve against a 14px stroke, never so big that
      // the turn finishes to the right of the first letter and the rule starts
      // short of the word it is underlining.
      const radius = Math.min(44, Math.max(box.left - lane - 6, 20));
      // `skipFirst` on the exit arc, whose first point is the rule's own end —
      // a repeated point is a zero-length segment and a divide-by-zero in the
      // spline's knot spacing.
      const arc = (cx: number, cy: number, from: number, to: number, skipFirst = false) => {
        for (let k = skipFirst ? 1 : 0; k <= 14; k++) {
          const a = (from + (to - from) * (k / 14)) * DEG;
          points.push([cx + Math.cos(a) * radius, cy + Math.sin(a) * radius]);
        }
      };

      // TWO points at the same x before the turn, so the descent is genuinely
      // vertical by the time it gets there. A corner rounded off a diagonal is
      // just a bend; a corner on a vertical reads as a corner.
      points.push([lane, box.top - box.height * 0.5]);
      points.push([lane, rule - radius * 1.7]);
      arc(lane + radius, rule - radius, 180, 90);

      // The entry arc's last point ends the smoothed run and starts the straight
      // one, already pointing along the rule; the exit arc's first point ends it.
      const from = points.length - 1;
      const end = box.left + box.width + 18;
      points.push([end, rule]);
      straight.push([from, points.length - 1]);

      // Up off the end of the words and into the flourish. Turning UP rather
      // than down because everything below the rule belongs to the next thing
      // on the page, and a stroke that dives under it reads as an underline for
      // that instead.
      arc(end, rule - radius, 90, 0, true);
    } else if (kind === "point") {
      // THE LAST THING THE LINE DOES IS AIM AT THE ONE THING ON THE PAGE ANYONE
      // IS MEANT TO CLICK. The flourish used to curl up and stop; now it carries
      // on out to the right, swings back, and finishes as an arrowhead a
      // thumbnail's width off the end of the label, pointing back into it.
      const tail = points[points.length - 1];
      if (!tail) continue;

      // Off the END of the label rather than any of its other edges: arriving
      // from the right means the arrow points back along the words, the
      // direction they read in.
      // EVERY PART OF THIS IS A FRACTION OF THE ROOM BESIDE THE LABEL, not a
      // fixed number of pixels. There is 240px of it at 1440 and 86px at 940 —
      // the heading is set in vw against a capped band, so the margin collapses
      // as the window narrows — and fixed offsets put the approach, and then the
      // swerve, off the side of the screen. Scaled, the gesture just tightens
      // into a hook and stays on the page.
      const room = Math.max(60, hostRect.width - (box.left + box.width));
      const gap = Math.min(30, room * 0.22);
      const reach = Math.min(66, room * 0.4);

      const tip: Pt = [box.left + box.width + gap, box.top + box.height * 0.55];

      // THE SWERVE. Out past the tip and down first, so the line comes back at
      // it: straight from the flourish to the label would be a leader line —
      // correct and dead.
      const out = Math.min(hostRect.width - 34, tip[0] + reach + 26);
      points.push([out, tail[1] + (tip[1] - tail[1]) * 0.45]);
      // Where the arrow comes in from, set RELATIVE TO THE TIP rather than to
      // whatever room the swerve got, so the approach is the same shallow
      // left-and-slightly-up at every width. Pinned to the swerve instead it
      // steepened as the margin narrowed, until at 1024 the head was pointing up
      // into the label from underneath.
      // KEPT ABOVE THE UNDERLINE, and this is not a nicety. The rule is the
      // deepest thing the line does, and the pacing, the draw order and the
      // moment the ending comes due are all keyed off that fact — let the swerve
      // dip a few pixels lower and it silently becomes the deepest point
      // instead, which stretched the closing move from two seconds to over five.
      // It is also just where the arrow belongs: below the rule is the next
      // section.
      points.push([tip[0] + reach, Math.min(tip[1] + 26, ruleY - 24)]);
      points.push(tip);

      // THE HEAD, drawn the way a hand draws one: on to a barb, back over the
      // line it just made, out to the other. The retrace re-inks ground already
      // covered, so what you see is the two barbs appearing in turn — which is
      // the whole reason it is a stroke of the same pen rather than a shape
      // faded in on top.
      const before = points[points.length - 2];
      const heading = Math.atan2(tip[1] - before[1], tip[0] - before[0]);
      const barb = Math.min(26, room * 0.24);
      const spread = 32 * DEG;
      const headFrom = points.length - 1;
      const barbAt = (a: number): Pt => [
        tip[0] - Math.cos(a) * barb,
        tip[1] - Math.sin(a) * barb,
      ];
      points.push(barbAt(heading - spread), tip, barbAt(heading + spread));
      straight.push([headFrom, points.length - 1]);
    }
  }

  if (points.length < 2) return null;

  // Back to front, so the splices do not shift the indices still to come. The
  // underline's straight run moves with them.
  for (let i = bowAt.length - 1; i >= 0; i--) {
    const at = bowAt[i];
    const before = points.length;
    bowConnector(points, at, hostRect.width);
    if (points.length > before) {
      for (const range of straight) {
        if (range[0] > at) range[0] += 1;
        if (range[1] > at) range[1] += 1;
      }
    }
  }

  return {
    width: hostRect.width,
    height: hostRect.height,
    d: toPath(points, straight),
  };
}

/** How far along the path each of N+1 evenly spaced samples sits vertically. */
const SAMPLES = 900;

/**
 * How fast the pen may draw the closing stretch, as a fraction of the whole
 * path per second. On /services that stretch is about a sixth of the line, so
 * this is roughly "the rule and the flourish take a second and a quarter",
 * against the third of a second they took when nothing bounded them. See the
 * note in the draw loop.
 */
const TAIL_SPEED = 0.13;

/**
 * The closing move accelerates the whole way: RUN_IN_SPEED as it leaves the
 * sweep line and comes down into the corner, RULE_SPEED by the first letter,
 * TAIL_SPEED by the last — which is the speed the flourish then keeps.
 * TAIL_TRIGGER is how far down the screen the words may still be when it starts.
 * See the draw loop.
 */
const RUN_IN_SPEED = 0.02;
const RULE_SPEED = 0.07;
const TAIL_TRIGGER = 0.86;

function sampleDepths(path: SVGPathElement): number[] {
  const total = path.getTotalLength();
  const depths: number[] = new Array(SAMPLES + 1);
  for (let i = 0; i <= SAMPLES; i++) {
    depths[i] = path.getPointAtLength((total * i) / SAMPLES).y;
  }
  return depths;
}

interface ScrollThreadProps {
  /** Elements carrying `data-thread`, in document order. */
  selector?: string;
  /**
   * Where the pen sits, as a fraction of the viewport height. It was 0.88, which
   * pinned it inside the bottom eighth of the screen for the whole page —
   * technically "always visible" and in practice always in the same sliver of
   * peripheral vision, which is what "it is always in the last 25%" was about.
   * Just past the middle keeps the tip in the part of the screen anyone is
   * actually looking at, and gives the line room to be seen arriving.
   */
  sweep?: number;
  className?: string;
}

export function ScrollThread({
  selector = "[data-thread]",
  sweep = 0.62,
  className = "",
}: ScrollThreadProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [geometry, setGeometry] = useState<{ width: number; height: number; d: string } | null>(
    null,
  );

  // Measure. Nothing renders until this has run, which is right for a
  // decoration: better absent for a frame than in the wrong place.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const next = buildPath(host, selector);
      // Only re-render when the path actually changed — a ResizeObserver that
      // fires on every scroll-driven reflow would otherwise thrash.
      setGeometry((prev) => (prev && next && prev.d === next.d ? prev : next));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();

    // Webfonts change where every word sits, and the whole point of this
    // component is going where the words aren't.
    if (document.fonts?.status !== "loaded") void document.fonts?.ready.then(schedule);

    const observer = new ResizeObserver(schedule);
    observer.observe(document.documentElement);
    for (const el of Array.from(document.querySelectorAll(selector))) observer.observe(el);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [selector]);

  // Draw.
  useEffect(() => {
    const host = hostRef.current;
    const path = pathRef.current;
    if (!host || !path || !geometry) return;

    // Complete and still, rather than the same thing but faster. Someone who
    // has asked for less motion is not asking for a shorter animation.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      path.style.strokeDashoffset = "0";
      return;
    }

    const depths = sampleDepths(path);

    // How far the pen has got. Two different tests, and the split is deliberate.
    //
    // THE BODY asks only whether a sample is above the sweep line — the furthest
    // one that is, wherever it falls. Inside a knot that lets the drawing run a
    // little ahead of itself, and that is wanted: the opening tangle is already
    // part-drawn when the page loads and fills in as you come down to it.
    // Reverted to this after the stricter test below was applied to the whole
    // path and took the masthead from 21% drawn at rest to 1.8% — *"the top of
    // the page has changed… it only gets drawn after you scroll a bit."*
    //
    // THE ENDING is gated on the deepest point of the path instead, which is the
    // rule. It has to be: only a prefix can be drawn, and the closing flourish
    // sits about 370px ABOVE the rule it comes off, so on the body's test the
    // sweep reached the flourish first and dragged the rule out with it — the
    // whole ending went while the words were still at the bottom edge of the
    // screen. Between the two, the tests agree everywhere anyway: measured
    // identical at every scroll position from the masthead to the foot.
    const reach: number[] = new Array(SAMPLES + 1);
    for (let i = 0, deepestSoFar = -Infinity; i <= SAMPLES; i++) {
      deepestSoFar = Math.max(deepestSoFar, depths[i]);
      reach[i] = deepestSoFar;
    }
    const drawnAt = (y: number) => {
      // THE ENDING RUNS AHEAD OF THE SWEEP LINE by `tailLead`. Held to the sweep
      // it only started once the rule was level with the pen, two thirds up the
      // screen, which is most of a viewport further down the page than anyone
      // needs to go to have read the words — *"this is happening too late, some
      // people might not scroll down that far."* Given a lead it starts while
      // the heading is still low on the screen, and since everything past the
      // rule is above it, the whole ending comes due together and the speeds
      // below decide how it plays out.
      if (y >= deepest - tailLead) return 1;
      for (let i = tailFrom - 1; i >= 0; i--) {
        if (depths[i] <= y) return i / SAMPLES;
      }
      return 0;
    };

    // WHERE THE LINE RUNS OUT OF PAGE TO BE DRAWN OVER. Everything from the
    // path's lowest point onwards — here, the rule under the heading and the
    // flourish that comes off the end of it — sits at or above that one y, so
    // the sweep unlocks the whole lot the moment it crosses it. On this page
    // that is 17% of the line's length falling due inside the last 200px of
    // scroll. Found rather than guessed: it is exactly the run of samples that
    // share the deepest point, so it stays right if the ending is re-routed.
    const deepest = reach[SAMPLES];
    let tailFrom = 0;
    while (tailFrom < SAMPLES && reach[tailFrom] < deepest) tailFrom++;
    // …and where the RULE within it stops and the flourish takes over: the rule
    // is the run lying flat at that deepest point, so it ends where the exit arc
    // starts climbing away from it.
    let ruleTo = tailFrom;
    while (ruleTo < SAMPLES && depths[ruleTo + 1] >= deepest - 1) ruleTo++;
    const tailStart = tailFrom / SAMPLES;
    const ruleThrough = ruleTo / SAMPLES;

    // WHERE THE SWEEP LINE SITS, adjusted down if this window is tall enough
    // that it would otherwise never reach the deepest point of the path before
    // the page runs out of scroll — which would strand the line unfinished a
    // few percent short. It binds only on very tall windows; at ordinary
    // heights the requested position stands. Reads scrollHeight, so it is
    // measured on mount and on resize rather than on every scroll.
    let effectiveSweep = sweep;
    // How far ahead of the sweep line the ending starts, in page pixels.
    let tailLead = 0;
    const measureSweep = () => {
      const view = window.innerHeight;
      const maxScroll = document.documentElement.scrollHeight - view;
      const hostTop = host.getBoundingClientRect().top + window.scrollY;
      // +40px so the rule is reached a little before the page runs out rather
      // than exactly on the last pixel of scroll.
      effectiveSweep = Math.min(
        0.95,
        Math.max(sweep, (deepest + 40 + hostTop - maxScroll) / view),
      );
      tailLead = Math.max(0, (TAIL_TRIGGER - effectiveSweep) * view);
    };
    measureSweep();

    // ONE RULE FOR THE WHOLE LINE, and that is the point. An earlier version
    // held the pen at the mouth of the closing stretch and released it once the
    // heading was properly on screen. It was the wrong shape of fix: a threshold
    // can only ever produce a wait and then a rush, and it read as exactly that
    // — the pen leapt from 61% to 97% of the screen in 100px of scroll, sat
    // still for another 200px, then went. Both halves were called out. The
    // ending needed no special cue in the end: dropping the sweep line to just
    // past the middle of the screen already delays it until the words are
    // comfortably in view, and TAIL_SPEED keeps the flourish to its own pace
    // without anything having to stop.
    const targetNow = () => {
      const rect = host.getBoundingClientRect();
      return drawnAt(-rect.top + window.innerHeight * effectiveSweep);
    };

    // EASING IS NOT DECORATION HERE, it is what makes the drawing continuous.
    // `drawnAt` can only return one of the sampled positions, and inside a knot
    // a hundred consecutive samples sit within a few pixels of each other
    // vertically — so a small scroll can move the answer by a tenth of the whole
    // path in one frame, which is exactly the stepping that made it feel rough.
    // Chasing the target instead of snapping to it smooths that out, and leaves
    // the pen trailing slightly behind the scroll everywhere else, which is the
    // part that reads as fluid.
    let current = targetNow();
    let target = current;
    let frame = 0;
    let last = 0;
    // Where the pen was when the ending came due, so the run-in can be measured
    // from it. Reset if the page is scrolled back up out of the ending.
    let unlockAt = -1;

    path.style.strokeDashoffset = String(1 - current);

    const tick = (now: number) => {
      // Seconds since the last frame, clamped so a backgrounded tab does not
      // come back and jump the pen. `last` is 0 on the first tick of a run.
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      last = now;

      const diff = target - current;
      if (Math.abs(diff) < 0.0002) {
        current = target;
        frame = 0;
        last = 0;
      } else {
        // Frame-rate independent: 0.14 was tuned at 60Hz and would otherwise be
        // twice the chase on a 120Hz display.
        let step = Math.abs(diff) * (1 - Math.pow(1 - 0.14, dt * 60));

        // A CEILING ON THE PEN'S SPEED, BUT ONLY ONCE IT IS INTO THE TAIL, and
        // the "only" is the whole point. Chased on gap alone the closing stretch
        // went down in about a tenth of a second: the pen flicked rather than
        // drew, and the finish read as rushed. Capping its speed spends about a
        // second on it instead — the pace the rest of the line already moves at,
        // and the same second however hard you flicked to get there.
        //
        // Capping everywhere is the obvious version and it is wrong. Elsewhere
        // the sweep keeps advancing, so a speed limit becomes a debt the pen can
        // never pay back: measured at a 1200px/s scroll it ended up 1277px above
        // the sweep line, which is off the top of the screen — the exact thing
        // this whole sweep-line design exists to prevent. In the tail there is
        // no debt to accrue, because there is no more page for the sweep to move
        // through.
        // TWO PACES, because one reads as neither. The flourish is settled and
        // must not move. The rule is a fifth of its length, so at the same speed
        // it was over in a quarter of a second — *"almost instant instead of it
        // being drawn"* — while the flourish, being longer, looked drawn at the
        // identical rate. Slowing the rule alone gives it about a second, which
        // is what a ruled line under a headline wants, and leaves the flourish
        // exactly as it was. The slow pace starts before the rule rather than at
        // it, so the last of the descent into the corner is drawn rather than
        // flicked through on the way.
        // Paced from the moment the ending comes due rather than from a point
        // along the path, which is the difference between the whole closing move
        // being drawn and the pen flicking through the last of the descent on
        // its way to the rule. `target` only reaches 1 when the ending unlocks,
        // so it is exactly that moment.
        if (target >= 1) {
          // THE WHOLE CLOSING MOVE ACCELERATES. A hand ruling a line under a
          // headline does not travel at one rate: it comes in, builds, and is
          // fastest as it leaves the last letter. So the pace climbs the whole
          // way — from a crawl as it leaves the sweep line, through RULE_SPEED
          // by the first letter, to TAIL_SPEED by the last, which is the speed
          // the flourish then keeps. Nothing changes abruptly anywhere: each
          // stage ends on the number the next one starts at.
          //
          // The run-in matters as much as the rule. Held at one rate it was a
          // fivefold step up from the scroll-paced crawl the pen had been moving
          // at, dropped on it the instant the ending came due — the motion
          // snapped on rather than starting. Ramping it from RUN_IN_SPEED is
          // what makes the descent read as the beginning of the stroke instead
          // of the end of the waiting.
          if (unlockAt < 0) unlockAt = current;
          let pace: number;
          if (current >= ruleThrough) {
            pace = TAIL_SPEED;
          } else if (current >= tailStart) {
            // Squared, so the build is late — which is where a wrist flick is.
            const t = (current - tailStart) / (ruleThrough - tailStart);
            pace = RULE_SPEED + (TAIL_SPEED - RULE_SPEED) * t * t;
          } else {
            // Linear, so the descent gathers speed steadily rather than sitting
            // slow and then lunging at the corner.
            const t = Math.min(Math.max((current - unlockAt) / (tailStart - unlockAt), 0), 1);
            pace = RUN_IN_SPEED + (RULE_SPEED - RUN_IN_SPEED) * t;
          }
          step = Math.min(step, pace * dt);
        } else {
          unlockAt = -1;
        }

        current += Math.sign(diff) * step;
        frame = requestAnimationFrame(tick);
      }
      path.style.strokeDashoffset = String(1 - current);
    };

    const schedule = () => {
      target = targetNow();
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onResize = () => {
      measureSweep();
      schedule();
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
    };
  }, [geometry, sweep]);

  return (
    <div ref={hostRef} className={`mm-thread ${className}`.trim()} aria-hidden="true">
      {geometry && (
        <svg
          className="mm-thread__svg"
          viewBox={`0 0 ${round(geometry.width)} ${round(geometry.height)}`}
          fill="none"
          focusable="false"
        >
          <path ref={pathRef} className="mm-thread__path" d={geometry.d} pathLength={1} />
        </svg>
      )}
    </div>
  );
}
