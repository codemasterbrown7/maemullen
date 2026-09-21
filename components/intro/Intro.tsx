"use client";

import { type CSSProperties, useEffect, useEffectEvent, useRef, useState } from "react";
import { siteName } from "@/content/site";
import { Face, type FaceId, faceFonts, preloadFaces } from "./faces";
import { GlitchText } from "./GlitchText";
import { TextScramble } from "./TextScramble";
import "./intro.css";

/** The scramble: each letter gets three frames — two random capitals, then
 *  itself — at 60ms a frame, so the name types at 180ms a letter, about 1.6s
 *  for the word. The reference's 0.8s read as a blur; four frames a letter
 *  (228ms) read as slow to get going (2026-09-21). */
const SCRAMBLE_FRAMES = 3;
const SCRAMBLE_FRAME_S = 0.06;

/**
 * The treatments the name passes through once it has typed in — see
 * faces.tsx for each one. Big words, small lines, stacks and marks in turn,
 * so every change alters the whole silhouette; the wordmark opens and closes
 * it, because the page it opens onto is under that name.
 *
 * Since 2026-09-21 these are lettering treatments rather than typefaces, after
 * a reference the user sent: a studio intro firing through its name drawn
 * twenty different ways.
 */
const SEQUENCE: readonly FaceId[] = [
  "playfair",
  "stripes",
  "smiley",
  "sticker",
  "tracked",
  "katakana",
  "inline",
  "extrude",
  "seal",
  "split",
  "console",
  "tight",
  "slashes",
  "heart",
  "playfair",
];

/** Each change: the glitch starts, and a beat later the name morphs into the
 *  next treatment — the old one blurring out as the new one blurs in, through
 *  an alpha threshold so the overlap reads as liquid letterforms rather than a
 *  crossfade (2026-09-21: "she wants them to almost morph into each other").
 *  The glitch runs over the whole morph and stops as it lands. The first
 *  change waits a little longer so the glitch registers before anything
 *  moves. */
const LEAD_MS = 60;
const FIRST_LEAD_MS = 200;

/** It speeds up as it goes. The first change morphs and holds for about as
 *  long as the last version's every change did; each one after runs ACCEL
 *  times the one before, down to a floor — so it opens at a pace the eye can
 *  follow and ends in a rattle of marks, like the reference, which cuts at
 *  nine a second. The last change, back to the wordmark, slows down again to
 *  land, and that holds before the fade. */
const MORPH_MS = 340;
const HOLD_MS = 320;
const ACCEL = 0.78;
const MORPH_MIN_MS = 110;
const HOLD_MIN_MS = 70;
const LAND_MS = 420;
const LAND_HOLD_MS = 900;

/** How long the finished name sits still before the first glitch. */
const SETTLE_MS = 700;

/** The white fading away onto the home page underneath. It was a split down
 *  the middle, and before that a TV switching off; both cut for a plain fade
 *  (2026-09-21). */
const FADE_MS = 800;

/** Under reduced motion: no glitch and no changes — just the name, then the
 *  site, as a cut. */
const STILL_MS = 1500;

type Stage = "scramble" | "glitch" | "done";

/**
 * The intro — the studio's name on white: typed in, glitched and morphed
 * through a run of lettering treatments, then faded away onto the home page.
 *
 *   scramble  TextScramble types the name letter by letter, in the wordmark's
 *             Playfair, and it sits still for SETTLE_MS once it is complete.
 *   glitch    For each treatment in SEQUENCE: RGB shake, the name morphing
 *             into the new treatment under it, then a still beat on it.
 *   fading    Not a stage but a flag on top of one: the whole overlay fades
 *             out, over whatever it was showing, onto the home page, which
 *             has been sitting fully drawn underneath.
 *   done      The overlay is gone and the page is the home page.
 *
 * Every treatment is centred on the screen by its ink, not its line box (see
 * faces.css), so the name changes shape in place rather than jumping about.
 *
 * It is an overlay, not a page of its own, so the way in to the site is an
 * animation rather than a navigation: nothing loads at the end, and the home
 * page is simply uncovered. A click or any key skips straight to the fade —
 * an intro nobody can get past is a wall, not a welcome. The page underneath
 * cannot scroll until the fade starts.
 *
 * The name is set in capitals by CSS rather than typed in capitals here, so the
 * copy is still the brand's own spelling and a screen reader says "MaeMüllen"
 * rather than spelling out M-A-E. The animated lettering is hidden from it for
 * the same reason; it hears the real name once.
 */
export function Intro() {
  const [stage, setStage] = useState<Stage>("scramble");
  const [fading, setFading] = useState(false);
  /* Which treatment in SEQUENCE the name is on, whether it is mid-morph from
     the one before, and how long that morph runs. */
  const [step, setStep] = useState(0);
  const [morphing, setMorphing] = useState(false);
  const [morphMs, setMorphMs] = useState(MORPH_MS);
  const [glitching, setGlitching] = useState(false);

  /* Every pending step of the timeline, so a skip can cancel whatever is left
     of it in one go rather than have a stale timer drag the stage backwards. */
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const at = (ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms));
  };
  const cancel = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => cancel, []);

  useEffect(() => preloadFaces(), []);

  const fade = () => {
    cancel();
    setFading(true);
    at(FADE_MS, () => setStage("done"));
  };

  /* The whole timeline from the moment the scramble lands, laid out in one
     place: a still beat, then for each treatment after the first — glitch on,
     morph, glitch off as it lands, hold — and the fade after the last hold.

     The stage stays "scramble" through the settle, so the finished name is
     still the scramble's own letters; the glitch layers only take over as the
     first glitch starts, under cover of the shake. The two set the word
     slightly differently (the scramble's letters sit in cells, which drops
     kerning), and swapping them on a still word would show as a twitch.

     A skip during the scramble fades it out mid-word; the scramble still
     finishes typing under the fade, and must not start the show then. */
  const run = () => {
    if (fading) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      at(STILL_MS, () => setStage("done"));
      return;
    }

    let t = SETTLE_MS;
    SEQUENCE.slice(1).forEach((_, i) => {
      const landing = i === SEQUENCE.length - 2;
      const morph = landing ? LAND_MS : Math.max(MORPH_MIN_MS, Math.round(MORPH_MS * ACCEL ** i));
      const hold = landing ? LAND_HOLD_MS : Math.max(HOLD_MIN_MS, Math.round(HOLD_MS * ACCEL ** i));

      at(t, () => {
        setStage("glitch");
        setGlitching(true);
      });
      t += i === 0 ? FIRST_LEAD_MS : LEAD_MS;
      at(t, () => {
        setStep(i + 1);
        setMorphMs(morph);
        setMorphing(true);
      });
      t += morph;
      at(t, () => {
        setMorphing(false);
        setGlitching(false);
      });
      t += hold;
    });
    at(t, fade);
  };

  const skip = useEffectEvent(() => {
    if (fading || stage === "done") return;
    fade();
  });

  useEffect(() => {
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    return () => {
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, []);

  /* Hold the page underneath still while it is covered, so the visitor is
     uncovered onto the top of the home page rather than wherever a stray
     scroll wheel left it. */
  const covering = !fading && stage !== "done";
  useEffect(() => {
    if (!covering) return;
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = before;
    };
  }, [covering]);

  if (stage === "done") return null;

  const style = {
    "--intro-morph": `${morphMs}ms`,
    "--intro-fade": `${FADE_MS}ms`,
  } as CSSProperties;

  /* During a morph the name is two copies in one grid cell — the treatment it
     is leaving on its way out, the one it is going to on its way in — keyed by
     their place in SEQUENCE, so the incoming copy of one change is the same
     element as the outgoing copy of the next and never remounts mid-shake.

     The morph length goes to CSS from here, so the keyframes and the timeline
     above can never drift apart. data-no-proximity keeps the cursor's letter
     split out: it would wrap these letters in spans of its own while React is
     rewriting them every 60ms. */
  return (
    <div
      className={`intro ${faceFonts}`}
      data-stage={stage}
      data-fading={fading}
      data-no-proximity
      style={style}
    >
      <svg className="intro__defs" aria-hidden="true">
        <filter id="intro-melt">
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -140"
          />
        </filter>
      </svg>
      <h1 className="intro__word">
        <span className="intro__name">{siteName}</span>
        <span className="intro__morph" data-morphing={morphing} aria-hidden="true">
          {stage === "scramble" ? (
            <span className="intro__face">
              <span className="face face--playfair">
                <TextScramble
                  text={siteName}
                  frames={SCRAMBLE_FRAMES}
                  speed={SCRAMBLE_FRAME_S}
                  onComplete={run}
                />
              </span>
            </span>
          ) : (
            <>
              {morphing && (
                <span key={step - 1} className="intro__face intro__face--out">
                  <GlitchText active={glitching}>
                    <Face face={SEQUENCE[step - 1]} />
                  </GlitchText>
                </span>
              )}
              <span
                key={step}
                className={`intro__face${morphing ? " intro__face--in" : ""}`}
              >
                <GlitchText active={glitching}>
                  <Face face={SEQUENCE[step]} />
                </GlitchText>
              </span>
            </>
          )}
        </span>
      </h1>
    </div>
  );
}
