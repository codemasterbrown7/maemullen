"use client";

import { Anton, Unbounded } from "next/font/google";
import { type CSSProperties, useEffect, useEffectEvent, useRef, useState } from "react";
import { siteName } from "@/content/site";
import { GlitchText } from "./GlitchText";
import { TextScramble } from "./TextScramble";
import "./intro.css";

/** The scramble: each letter gets four frames — three random capitals, then
 *  itself — at 57ms a frame, so the name types at 228ms a letter, about two
 *  seconds for the word. The reference's 0.8s and 40ms read as a blur; 60ms
 *  was close but a touch slow, and 57 is it 5% faster (2026-09-21). */
const SCRAMBLE_FRAMES = 4;
const SCRAMBLE_FRAME_S = 0.057;

/** How long the finished name sits still before the first glitch, so it is
 *  read as the name before anything happens to it. */
const SETTLE_MS = 700;

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
 *                  the screen switches off like an old television
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
 *  The first burst shakes longer before its swap: at the standard length the
 *  word was gone before the glitch had registered as a glitch. */
const LEAD_MS = 220;
const FIRST_LEAD_MS = 380;
const TAIL_MS = 140;

/** The still between glitches: each face is held long enough to be looked at,
 *  not just noticed (2026-09-21: 380ms read as rushed). */
const HOLD_MS = 650;

/** The television switching off, from the last swap: the screen closes to a
 *  line, the line to a dot, the dot goes out. */
const TV_OFF_MS = 1000;

/** How long the screen stays black once it is off, before the page opens. */
const BLACK_MS = 1200;

/** The black parting from the middle onto the home page beneath. */
const REVEAL_MS = 1100;

/** Under reduced motion: no glitch, no swaps and no switch-off — just the
 *  word, then the site, as a cut. */
const STILL_MS = 1500;

type Stage = "scramble" | "glitch" | "off" | "reveal" | "done";

/**
 * The intro — the studio's name on a white screen: typed in, glitched through
 * four typefaces, then the screen switches off like an old television, sits
 * black, and opens onto the home page.
 *
 *   scramble  TextScramble types the name letter by letter, in Playfair, and
 *             it sits still for SETTLE_MS once it is complete.
 *   glitch    Bursts of RGB shake, the face swapping partway through each,
 *             a still beat on each new face — through FACES.
 *   off       On the last swap the television switches off. The word is only
 *             what is on the screen, so the switch-off happens to the screen,
 *             not to the letters (2026-09-21: squashing the word itself was
 *             wrong): black closes in from top and bottom until the picture is
 *             a thin white line across the middle, the line draws in to a
 *             glowing dot, and the dot goes out. Then black, for BLACK_MS.
 *   reveal    The black parts along the same centre line the picture closed
 *             to — top half up, bottom half down — onto the home page, which
 *             has been sitting fully drawn underneath.
 *   done      The overlay is gone and the page is the home page.
 *
 * It is an overlay, not a page of its own, so the way in to the site is an
 * animation rather than a navigation: nothing loads at the end, and the home
 * page is simply uncovered. A click or any key skips straight to the reveal —
 * an intro nobody can get past is a wall, not a welcome. The page underneath
 * cannot scroll until the reveal starts.
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
     place: a still beat, then burst on, face swap, burst off, hold — once per
     face after the first — except that the last swap switches the screen off
     instead of holding, and the reveal follows the black.

     The stage stays "scramble" through the settle, so the finished word is
     still the scramble's own letters; the glitch layers only take over as the
     first burst starts, under cover of the shake. The two set the word
     slightly differently (the scramble's letters sit in cells, which drops
     kerning), and swapping them on a still word would show as a twitch. */
  const run = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      at(STILL_MS, () => setStage("done"));
      return;
    }

    let t = SETTLE_MS;
    FACES.slice(1).forEach((next, i) => {
      const last = i === FACES.length - 2;
      at(t, () => {
        setStage("glitch");
        setGlitching(true);
      });
      t += i === 0 ? FIRST_LEAD_MS : LEAD_MS;
      at(t, () => {
        setFace(next);
        if (last) setStage("off");
      });
      at(t + TAIL_MS, () => setGlitching(false));
      t += last ? TV_OFF_MS + BLACK_MS : TAIL_MS + HOLD_MS;
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
     React is rewriting them every 57ms. */
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
      <div className="intro__screen">
        <h1 className="intro__word" data-face={face}>
          <span className="intro__name">{siteName}</span>
          <span aria-hidden="true">
            {stage === "scramble" ? (
              <TextScramble
                text={siteName}
                frames={SCRAMBLE_FRAMES}
                speed={SCRAMBLE_FRAME_S}
                onComplete={run}
              />
            ) : (
              <GlitchText text={siteName} active={glitching} />
            )}
          </span>
        </h1>
      </div>
      <span className="intro__beam" aria-hidden="true" />
    </div>
  );
}
