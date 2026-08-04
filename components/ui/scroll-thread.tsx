"use client";

import { useEffect, useRef, useState } from "react";
import "./scroll-thread.css";

/**
 * One line that draws itself as the page scrolls — an ornament at the top, a
 * single strand down the page with one loop-the-loop in it, a second ornament
 * at the foot, and a last stroke that finishes by underlining whatever it is
 * pointed at.
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
 *   data-thread="flower"      draw a five-petal flower in this box instead,
 *     data-thread-phase="122" rotated by this many degrees — pick the angle
 *                             that puts a GAP where the line arrives and leaves
 *   data-thread="pass"        run through this element, at
 *     data-thread-x="0.8"     this fraction of the page width — point it at the
 *                             half the copy is NOT in
 *     data-thread-loop="right" and put one loop-the-loop in that run
 *   data-thread="underline"   swing below, hook back, and rule under this
 *                             element left to right. Always last.
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
 *     The drift has to stay well under each loop's own reach or the loops
 *     stretch into pinched slivers and it reads as a scribble; about a third is
 *     the useful range.
 *
 * The drift is also what forces the chaining in the loop below — see there.
 *
 * This was the shape before the flower, and it is the shape the client came
 * back to. The two are interchangeable per instance from the markup — see the
 * `data-thread` values in the header comment.
 */
function knotPoints(box: Box, flip: boolean): Pt[] {
  const petals = 7;
  const spread = 143 * DEG;
  const samplesPerPetal = 30;

  const baseAt = (i: number): Pt => [
    0.32 + (0.34 * i) / petals,
    0.5 + 0.12 * Math.sin(i * 1.6 + 0.3),
  ];

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

    const len = 0.55 * (0.88 + 0.26 * Math.sin(i * 1.7 + 0.9));
    const c1: Pt = [p[0] + Math.cos(theta - spread) * len, p[1] + Math.sin(theta - spread) * len];
    const c2: Pt = [p[0] + Math.cos(theta + spread) * len, p[1] + Math.sin(theta + spread) * len];
    const next = baseAt(i + 1);

    for (let k = 1; k <= samplesPerPetal; k++) {
      raw.push(cubicAt(p, c1, c2, next, k / samplesPerPetal));
    }

    exit = [next[0] - c2[0], next[1] - c2[1]];
    p = next;
  }

  return fitToBox(raw, box, flip);
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
function fitToBox(raw: readonly Pt[], box: Box, flip: boolean, fitCount = raw.length): Pt[] {
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
 * Points from `straightFrom` on are emitted as straight lines instead — that is
 * the underline, and a smoothed underline is a sag.
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
function toPath(points: readonly Pt[], straightFrom: number): string {
  if (points.length < 2) return "";

  const at = (i: number) => points[Math.min(Math.max(i, 0), points.length - 1)];
  const end = straightFrom >= 0 ? straightFrom : points.length - 1;

  let d = `M ${round(at(0)[0])} ${round(at(0)[1])}`;

  for (let i = 0; i < end; i++) {
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

  for (let i = end + 1; i < points.length; i++) {
    d += ` L ${round(points[i][0])} ${round(points[i][1])}`;
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
  let straightFrom = -1;

  for (const el of Array.from(document.querySelectorAll<HTMLElement>(selector))) {
    const box = rel(el);
    const kind = el.dataset.thread;

    if (kind === "knot" || kind === "flower") {
      if (points.length) bowAt.push(points.length - 1);
      points.push(
        ...(kind === "knot"
          ? knotPoints(box, el.dataset.threadFlip === "1")
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
      const rule = box.top + box.height + 16;
      // Out into the margin BESIDE the heading, straight down past it, then
      // hook right into the rule — so the underline is drawn left to right, the
      // direction the gesture reads in, and the approach never crosses the
      // words. The knot that precedes this one sits on the left for exactly
      // this reason: coming from the right meant either ruling backwards or
      // doubling a second line back underneath, which read as a mistake.
      // Two points, at different x — NOT a vertical lane between two corners.
      // Same-x points either side of the heading drew a big rounded rectangle
      // out at the edge of the viewport, which read as a box rather than as a
      // stroke.
      points.push([Math.max(box.left - 78, 10), box.top + box.height * 0.62]);
      points.push([Math.max(box.left - 40, 6), rule + 18]);
      straightFrom = points.length;
      points.push([box.left - 4, rule]);
      points.push([box.left + box.width + 18, rule]);
    }
  }

  if (points.length < 2) return null;

  // Back to front, so the splices do not shift the indices still to come. The
  // underline's straight tail moves with them.
  for (let i = bowAt.length - 1; i >= 0; i--) {
    const at = bowAt[i];
    const before = points.length;
    bowConnector(points, at, hostRect.width);
    if (points.length > before && straightFrom > at) straightFrom += 1;
  }

  return {
    width: hostRect.width,
    height: hostRect.height,
    d: toPath(points, straightFrom),
  };
}

/** How far along the path each of N+1 evenly spaced samples sits vertically. */
const SAMPLES = 900;

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
   * Where the pen sits, as a fraction of the viewport height. 0.88 puts it a
   * little above the bottom edge — far enough in to watch it draw, not so far
   * that the line arrives before the section it belongs to.
   */
  sweep?: number;
  className?: string;
}

export function ScrollThread({
  selector = "[data-thread]",
  sweep = 0.88,
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

    // The furthest point along the path that is still above the sweep line.
    // Scanning backwards makes this monotonic in `y`: as the line descends the
    // set of samples above it only grows, so the drawing never runs backwards
    // even where the path loops up on itself inside a knot.
    const drawnAt = (y: number) => {
      for (let i = SAMPLES; i >= 0; i--) {
        if (depths[i] <= y) return i / SAMPLES;
      }
      return 0;
    };

    const targetNow = () => {
      const rect = host.getBoundingClientRect();
      return drawnAt(-rect.top + window.innerHeight * sweep);
    };

    // EASING IS NOT DECORATION HERE, it is what makes the drawing continuous.
    // `drawnAt` can only return one of the sampled positions, and inside a knot
    // a hundred consecutive samples sit within a few pixels of each other
    // vertically — so a small scroll can move the answer by a tenth of the whole
    // path in one frame, which is exactly the stepping that made it feel rough.
    // Chasing the target instead of snapping to it turns those jumps into the
    // pen racing through a flourish, and leaves it trailing slightly behind the
    // scroll everywhere else, which is the part that reads as fluid.
    let current = targetNow();
    let target = current;
    let frame = 0;

    path.style.strokeDashoffset = String(1 - current);

    const tick = () => {
      const diff = target - current;
      if (Math.abs(diff) < 0.0002) {
        current = target;
        frame = 0;
      } else {
        current += diff * 0.14;
        frame = requestAnimationFrame(tick);
      }
      path.style.strokeDashoffset = String(1 - current);
    };

    const schedule = () => {
      target = targetNow();
      if (!frame) frame = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
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
