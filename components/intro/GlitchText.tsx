import type { ReactNode } from "react";

/**
 * RGB glitch: whatever it wraps, three times over, in pure red, green and
 * blue, each layer shaking on its own short loop and multiplied onto the white
 * ground. Where all three line up, red × green × blue multiplies to black, so
 * the lettering still reads as black; wherever they drift apart the separated
 * channels show through as coloured fringes. White multiplies to nothing, so
 * anything cut out of the lettering in white stays cut out.
 *
 * A port of the framer-motion GlitchText component into CSS keyframes (see
 * intro.css). The loops, offsets, skews and opacities are the reference's own
 * values, with one change: the offsets are in em rather than px, scaled from
 * the reference's 60px type, so the shake stays in proportion to lettering
 * that is sized to the viewport rather than fixed. It wrapped a plain string
 * until the lettering became drawings as well as words (2026-09-21); each
 * layer sets `color`, and the drawings are all in currentColor.
 *
 * `active` switches the shake on and off. Off, the layers sit exactly on top
 * of each other and the lettering is plain black; on, each burst starts from
 * the top of its loop.
 *
 * No state and no effects — this is plain markup, the motion is all CSS.
 */
export function GlitchText({ children, active = true }: { children: ReactNode; active?: boolean }) {
  return (
    <span className="intro-glitch" data-active={active}>
      <span className="intro-glitch__layer intro-glitch__layer--red">{children}</span>
      <span className="intro-glitch__layer intro-glitch__layer--green">{children}</span>
      <span className="intro-glitch__layer intro-glitch__layer--blue">{children}</span>
    </span>
  );
}
