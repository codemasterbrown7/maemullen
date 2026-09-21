"use client";

import { Anton, Instrument_Serif, Syncopate } from "next/font/google";
import { type CSSProperties, useEffect, useEffectEvent, useRef, useState } from "react";
import { siteName } from "@/content/site";
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
 * The faces the word passes through once it has resolved, melting from one
 * into the next. Chosen to be good-looking faces in their own right that are
 * as unlike each other as possible, in shape and in size, swinging between
 * large and small (2026-09-21: the pixel and blackletter faces were the
 * worst of the last set, and the hairline was too thin to see):
 *
 *   Playfair 700       the Didone of the wordmark, at the base size
 *   Anton              towering — tall, narrow, heavy, at 1.7×
 *   Switzer 400        small, light and spaced wide open
 *   Instrument Serif   a tall, narrow, delicate serif, large
 *   Syncopate 700      very wide, flat capitals, small
 *   Playfair 700       back to the wordmark's face before the page opens
 *
 * Each name maps to a family, weight, size and spacing in intro.css.
 */
const FACES = ["playfair", "anton", "switzer", "instrument", "syncopate", "playfair"] as const;

/* The three faces the site does not otherwise use, loaded here rather than in
   the root layout so only the page that plays the intro downloads them.
   next/font preloads them with the page, so they are in hand long before the
   first change. Playfair and Switzer come from the layout. Roman only —
   italic is banned from this design. */
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "normal",
  variable: "--font-instrument",
  display: "swap",
});

const syncopate = Syncopate({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-syncopate",
  display: "swap",
});

/** Each change: the glitch starts, and a beat later the word morphs into the
 *  next face — the old one blurring out as the new one blurs in, through an
 *  alpha threshold so the overlap reads as liquid letterforms rather than a
 *  crossfade (2026-09-21: "she wants them to almost morph into each other").
 *  The glitch runs over the whole morph and stops as it lands. The first
 *  change waits a little longer so the glitch registers before anything
 *  moves. */
const LEAD_MS = 60;
const FIRST_LEAD_MS = 200;
const MORPH_MS = 380;

/** How long the finished name sits still before the first glitch, and the
 *  still on each face between changes — quicker than the 650ms it was, so the
 *  faces run into one another (2026-09-21). */
const SETTLE_MS = 700;
const HOLD_MS = 350;

/** The white screen parting from the middle onto the home page beneath. */
const REVEAL_MS = 1100;

/** Under reduced motion: no glitch and no swaps — just the word, then the
 *  site, as a cut. */
const STILL_MS = 1500;

type Stage = "scramble" | "glitch" | "reveal" | "done";

/**
 * The intro — the studio's name on white: typed in, glitched and morphed
 * through five typefaces, then the screen parts down the middle onto the home
 * page.
 *
 *   scramble  TextScramble types the name letter by letter, in Playfair, and
 *             it sits still for SETTLE_MS once it is complete.
 *   glitch    For each face in FACES: RGB shake, the word morphing into the
 *             new face under it, then a still beat on the new face.
 *   reveal    The screen splits along its centre line — the top half, with the
 *             top of the word, rises; the bottom half falls — onto the home
 *             page, which has been sitting fully drawn underneath. (A TV
 *             switch-off stood here for two rounds and was cut, 2026-09-21.)
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
  /* Which face in FACES the word is on, and whether it is mid-morph from the
     one before. */
  const [step, setStep] = useState(0);
  const [morphing, setMorphing] = useState(false);
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
     place: a still beat, then for each face after the first — glitch on,
     morph, glitch off as it lands, hold — and the reveal after the last hold.

     The stage stays "scramble" through the settle, so the finished word is
     still the scramble's own letters; the glitch layers only take over as the
     first glitch starts, under cover of the shake. The two set the word
     slightly differently (the scramble's letters sit in cells, which drops
     kerning), and swapping them on a still word would show as a twitch. */
  const run = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      at(STILL_MS, () => setStage("done"));
      return;
    }

    let t = SETTLE_MS;
    FACES.slice(1).forEach((_, i) => {
      at(t, () => {
        setStage("glitch");
        setGlitching(true);
      });
      t += i === 0 ? FIRST_LEAD_MS : LEAD_MS;
      at(t, () => {
        setStep(i + 1);
        setMorphing(true);
      });
      t += MORPH_MS;
      at(t, () => {
        setMorphing(false);
        setGlitching(false);
      });
      t += HOLD_MS;
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

  const face = FACES[step];
  const fonts = `${anton.variable} ${instrument.variable} ${syncopate.variable}`;
  const style = {
    "--intro-reveal": `${REVEAL_MS}ms`,
    "--intro-morph": `${MORPH_MS}ms`,
  } as CSSProperties;

  /* The reveal: two copies of the screen, each clipped to one half and
     carrying its half of the word, sliding apart. The word is still by now,
     so a plain copy in the current face lines up exactly with the glitch
     layers it replaces. */
  if (stage === "reveal") {
    return (
      <div
        className={`intro ${fonts}`}
        data-stage={stage}
        data-no-proximity
        style={style}
        aria-hidden="true"
      >
        {(["top", "bottom"] as const).map((half) => (
          <div key={half} className={`intro__half intro__half--${half}`}>
            <span className="intro__word">
              <span className="intro__face" data-face={face}>
                {siteName}
              </span>
            </span>
          </div>
        ))}
      </div>
    );
  }

  /* During a morph the word is two copies in one grid cell — the face it is
     leaving on its way out, the face it is going to on its way in — keyed by
     their place in FACES, so the incoming copy of one change is the same
     element as the outgoing copy of the next and never remounts mid-shake.

     The morph lengths go to CSS from here, so the keyframes and the timeline
     above can never drift apart. data-no-proximity keeps the cursor's letter
     split out: it would wrap these letters in spans of its own while React is
     rewriting them every 60ms. */
  return (
    <div className={`intro ${fonts}`} data-stage={stage} data-no-proximity style={style}>
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
            <span className="intro__face" data-face={face}>
              <TextScramble
                text={siteName}
                frames={SCRAMBLE_FRAMES}
                speed={SCRAMBLE_FRAME_S}
                onComplete={run}
              />
            </span>
          ) : (
            <>
              {morphing && (
                <span
                  key={step - 1}
                  className="intro__face intro__face--out"
                  data-face={FACES[step - 1]}
                >
                  <GlitchText text={siteName} active={glitching} />
                </span>
              )}
              <span
                key={step}
                className={`intro__face${morphing ? " intro__face--in" : ""}`}
                data-face={face}
              >
                <GlitchText text={siteName} active={glitching} />
              </span>
            </>
          )}
        </span>
      </h1>
    </div>
  );
}
