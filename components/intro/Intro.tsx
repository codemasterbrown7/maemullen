"use client";

import { Anton, Unbounded } from "next/font/google";
import { type CSSProperties, useEffect, useEffectEvent, useRef, useState } from "react";
import { siteName } from "@/content/site";
import { GlitchText } from "./GlitchText";
import { TextScramble } from "./TextScramble";
import "./intro.css";

/** How long the scramble takes to type the whole word, in seconds, and how
 *  often the letter being typed flickers. The reference's 0.8s and 40ms read
 *  as a blur (2026-09-21). At 2s and 60ms each letter gets four frames —
 *  three random capitals, then itself — so the word types at a readable
 *  quarter of a second a letter. */
const SCRAMBLE_S = 2;
const SCRAMBLE_FRAME_S = 0.06;

/**
 * The faces the word passes through once it has resolved, one per glitch,
 * ordered so each one is as unlike the last as possible — in shape and in
 * size, not just in family (2026-09-21: the first set was too alike):
 *
 *   Playfair 700   the Didone of the wordmark, at the base size
 *   Anton          tall, narrow, heavy — set half as large again
 *   Switzer 200    a hairline, small and widely spaced
 *   Unbounded 900  squat, very wide, heavy — set small to fit
 *   Playfair 700   back to the wordmark's face — and the moment it lands,
 *                  the word switches off like an old television
 *
 * Each name maps to a family, weight, size and spacing in intro.css.
 */
const FACES = ["playfair", "anton", "switzer", "unbounded", "playfair"] as const;
type Face = (typeof FACES)[number];

/* The two faces the site does not otherwise use, loaded here rather than in
   the root layout so only the page that plays the intro downloads them.
   next/font preloads them with the page, so they are in hand long before the
   first swap two seconds in. Playfair and Switzer come from the layout. */
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: "900",
  variable: "--font-unbounded",
  display: "swap",
});

/** One glitch: how long it shakes before the face swaps, and how long it
 *  carries on after. The swap lands inside the burst rather than at the end
 *  of it, so the glitch is visibly still running on the new face — that
 *  overlap is what makes the glitch read as the cause of the change.
 *
 *  The first burst, straight after the scramble lands, shakes longer before
 *  its swap (2026-09-21): at the standard length the word had barely resolved
 *  before it was gone, and it needs a beat to be read as the finished name. */
const LEAD_MS = 160;
const FIRST_LEAD_MS = 300;
const TAIL_MS = 100;

/** The still between glitches: long enough to register each face. */
const HOLD_MS = 380;

/** The television switching off: the word collapses to a line, the line to a
 *  dot, the dot to nothing. */
const TV_OFF_MS = 650;

/** The white screen opening from the middle onto the home page beneath. */
const REVEAL_MS = 1100;

/** Under reduced motion: no glitch, no swaps and no switch-off — just the
 *  word, then the site, as a cut. */
const STILL_MS = 1500;

type Stage = "scramble" | "glitch" | "off" | "reveal" | "done";

/**
 * The intro — the studio's name on white, scrambling into place, glitching
 * from one typeface into the next, switching off like an old television, and
 * opening onto the home page.
 *
 *   scramble  TextScramble types the name letter by letter, in Playfair.
 *   glitch    Bursts of RGB shake, the face swapping partway through each,
 *             a still beat on each new face — through FACES.
 *   off       On the last swap the word does not settle: it switches off, the
 *             way a CRT did — squashed to a thin line across the middle,
 *             the line shrinking to a dot, the dot winking out. The glitch
 *             keeps running and grows stronger through it, like a VHS losing
 *             tracking as the set powers down.
 *   reveal    The empty white screen parts along the same centre line the
 *             picture collapsed into — top half up, bottom half down — onto
 *             the home page, which has been sitting fully drawn underneath.
 *   done      The overlay is gone and the page is the home page.
 *
 * It is an overlay, not a page of its own, so the way in to the site is an
 * animation rather than a navigation: nothing loads at the end, there is no
 * blank frame, and the home page is simply uncovered. A click or any key skips
 * straight to the reveal — an intro nobody can get past is a wall, not a
 * welcome. The page underneath cannot scroll until the reveal starts.
 *
 * The name is set in capitals by CSS rather than typed in capitals here, so the
 * copy is still the brand's own spelling and a screen reader says "MaeMüllen"
 * rather than spelling out M-A-E. The animated letters are hidden from it for
 * the same reason; it hears the real name once.
 */
export function Intro() {
  const [stage, setStage] = useState<Stage>("scramble");
  const [face, setFace] = useState<Face>(FACES[0]);
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

  const reveal = () => {
    cancel();
    setStage("reveal");
    at(REVEAL_MS, () => setStage("done"));
  };

  /* The whole timeline from the moment the scramble lands, laid out in one
     place: burst on, face swap, burst off, hold — once per face after the
     first — except that the last swap starts the switch-off instead of a
     hold, and the reveal follows it. */
  const run = () => {
    setStage("glitch");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      at(STILL_MS, () => setStage("done"));
      return;
    }

    let t = 0;
    FACES.slice(1).forEach((next, i) => {
      const last = i === FACES.length - 2;
      at(t, () => setGlitching(true));
      t += i === 0 ? FIRST_LEAD_MS : LEAD_MS;
      at(t, () => {
        setFace(next);
        if (last) setStage("off");
      });
      if (last) {
        t += TV_OFF_MS;
      } else {
        t += TAIL_MS;
        at(t, () => setGlitching(false));
        t += HOLD_MS;
      }
    });
    at(t, reveal);
  };

  const skip = useEffectEvent(() => {
    if (stage === "reveal" || stage === "done") return;
    reveal();
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
  const covering = stage !== "reveal" && stage !== "done";
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

  /* The two animation lengths go to CSS from here, so the keyframes and the
     timeline above can never drift apart. data-no-proximity keeps the cursor's
     letter split out: it would wrap these letters in spans of its own while
     React is rewriting them every 60ms. */
  return (
    <div
      className={`intro ${anton.variable} ${unbounded.variable}`}
      data-stage={stage}
      data-no-proximity
      style={
        {
          "--intro-tv-off": `${TV_OFF_MS}ms`,
          "--intro-reveal": `${REVEAL_MS}ms`,
        } as CSSProperties
      }
    >
      <h1 className="intro__word" data-face={face}>
        <span className="intro__name">{siteName}</span>
        <span aria-hidden="true">
          {stage === "scramble" ? (
            <TextScramble
              text={siteName}
              duration={SCRAMBLE_S}
              speed={SCRAMBLE_FRAME_S}
              onComplete={run}
            />
          ) : (
            <GlitchText text={siteName} active={glitching} />
          )}
        </span>
      </h1>
    </div>
  );
}
