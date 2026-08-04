import Link from "next/link";
import "./gooey-marquee.css";

/**
 * Gooey marquee — two rows travelling in opposite directions, the type crisp
 * through the middle and morphing into a solid bar at each end.
 *
 * HOW IT WORKS, because the arrangement is not obvious:
 *
 *   layer 1 (behind)  blurred + alpha-thresholded, plus a solid bar at each
 *                     end. The blur makes shapes that are close together fuse,
 *                     so letters approaching a bar melt into it.
 *   layer 2 (on top)  the same rows again, completely unfiltered.
 *
 * The top layer is the whole trick. Blurring and then thresholding at 50% alpha
 * leaves a shape's contour almost exactly where it started, so through the
 * middle the two layers coincide and the type reads as perfectly sharp; only
 * near the end bars, where the blurred shapes overlap enough to fuse, does the
 * lower layer show beyond the upper one. An earlier version had the filtered
 * layer alone and stayed soft across the whole band.
 *
 * The end bars fade inward rather than stopping hard. Under a 50% alpha
 * threshold a linear ramp resolves to a hard edge at its midpoint, so the bar
 * still looks solid — but letters begin fusing with it well before they reach
 * it, which is what makes the morph gradual instead of snapping on at the edge.
 *
 * ON COLOUR: the reference component gets its edges with `contrast(15)`, which
 * crushes every channel to its extreme — brand cream would become pure white
 * and brand blue pure #0000ff. Thresholding the ALPHA channel instead gives the
 * same melt and leaves the palette untouched.
 *
 * Adapted from a Tailwind/shadcn component; this codebase runs neither. Tailwind
 * is installed but deliberately never imported in globals.css, because its
 * preflight would set `box-sizing: border-box` and break the content-box layout
 * maths the imported design at / depends on.
 *
 * A server component: no state, no effects, no client JS.
 */

export type MarqueeItem = { label: string; href?: string };

interface GooeyMarqueeProps {
  items: MarqueeItem[];
  /** Seconds for one full loop. Larger is slower. */
  speed?: number;
  className?: string;
}

/** Four-pointed sparkle, drawn rather than typed — ✦/✧/✳ each resolve to a
 *  different shape depending on the fallback font, and the client picked one. */
function Sparkle() {
  return (
    <svg
      className="gooey-marquee__sparkle"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 0 C12 6.5 17.5 12 24 12 C17.5 12 12 17.5 12 24 C12 17.5 6.5 12 0 12 C6.5 12 12 6.5 12 0 Z" />
    </svg>
  );
}

function Run({ items, linked }: { items: MarqueeItem[]; linked?: boolean }) {
  return (
    <div className="gooey-marquee__run">
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} style={{ display: "contents" }}>
          {linked && item.href ? (
            <Link href={item.href} className="gooey-marquee__item">
              {item.label}
            </Link>
          ) : (
            <span className="gooey-marquee__item">{item.label}</span>
          )}
          <Sparkle />
        </span>
      ))}
    </div>
  );
}

/** Both layers render this identically, so the two stacks stay in register. */
function Stack({
  items,
  lower,
  variant,
  linked,
}: {
  items: MarqueeItem[];
  lower: MarqueeItem[];
  variant: "goo" | "clear";
  linked?: boolean;
}) {
  return (
    <div className={`gooey-marquee__stack gooey-marquee__stack--${variant}`}>
      <div className="gooey-marquee__row">
        <Run items={items} linked={linked} />
        <Run items={items} />
      </div>
      <div className="gooey-marquee__row gooey-marquee__row--reverse">
        <Run items={lower} />
        <Run items={lower} />
      </div>

      {variant === "goo" && (
        <>
          <span className="gooey-marquee__cap gooey-marquee__cap--start" />
          <span className="gooey-marquee__cap gooey-marquee__cap--end" />
        </>
      )}
    </div>
  );
}

export function GooeyMarquee({ items, speed = 44, className = "" }: GooeyMarqueeProps) {
  // The lower row starts partway through the list so the two rows never line up
  // into readable columns as they pass each other.
  const offset = Math.floor(items.length / 2);
  const lower = [...items.slice(offset), ...items.slice(0, offset)];

  return (
    <div
      className={`gooey-marquee ${className}`.trim()}
      style={{ ["--gm-speed" as string]: `${speed}s` }}
    >
      {/* Blur, then a steep ramp on the alpha channel only: the last matrix row
          multiplies alpha by 20 and subtracts 10, so soft edges snap back to
          hard ones and overlapping shapes fuse. Colour passes through. */}
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
        <defs>
          <filter id="mm-gooey-marquee">
            {/* As low as it can go while still rounding off what the bars'
                alpha field pulls together — the field is what carries the melt
                inward now, so the blur no longer has to reach for it. Pushing
                this up instead (it was 2.6) buys nothing but filled counters
                and welded letter pairs, and those are visible as specks
                wherever the mask above lets the layer show. The value is in
                pixels, so it is pinned to the ~19px cap on --gm-size; change
                the type size and this has to move with it. */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 20 -10"
            />
          </filter>
        </defs>
      </svg>

      {/* Decorative duplicate — the readable copy is the clear layer below. */}
      <div aria-hidden="true">
        <Stack items={items} lower={lower} variant="goo" />
      </div>

      <Stack items={items} lower={lower} variant="clear" linked />
    </div>
  );
}
