/**
 * RGB glitch: the word three times over, in pure red, green and blue, each
 * layer shaking on its own short loop and multiplied onto the white ground.
 * Where all three line up, red × green × blue multiplies to black, so the word
 * still reads as black type; wherever they drift apart the separated channels
 * show through as coloured fringes.
 *
 * A port of the framer-motion GlitchText component into CSS keyframes (see
 * intro.css). The loops, offsets, skews and opacities are the reference's own
 * values, with one change: the offsets are in em rather than px, scaled from
 * the reference's 60px type, so the shake stays in proportion to a word that
 * is sized to the viewport rather than fixed.
 *
 * No state and no effects — this is plain markup, the motion is all CSS.
 */
export function GlitchText({ text }: { text: string }) {
  return (
    <span className="intro-glitch">
      <span className="intro-glitch__layer intro-glitch__layer--red">{text}</span>
      <span className="intro-glitch__layer intro-glitch__layer--green">{text}</span>
      <span className="intro-glitch__layer intro-glitch__layer--blue">{text}</span>
    </span>
  );
}
