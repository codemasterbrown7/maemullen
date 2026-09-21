"use client";

import { Anton, Silkscreen, UnifrakturCook } from "next/font/google";
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
 * The faces the word passes through once it has resolved, one per glitch,
 * ordered so each is as unlike the last as possible — in shape and in size,
 * swinging between huge and small (2026-09-21: the second set was still too
 * alike, so the sizes went further apart and two stranger shapes came in):
 *
 *   Playfair 700      the Didone of the wordmark, at the base size
 *   Anton             towering — tall, narrow, heavy, at 1.7×
 *   Switzer 100       a small hairline, spaced wide open
 *   UnifrakturCook    blackletter, large
 *   Silkscreen        a small pixel face, the glitch's own register
 *   Playfair 700      back to the wordmark's face before the page opens
 *
 * Each name maps to a family, weight, size and spacing in intro.css.
 */
const FACES = ["playfair", "anton", "switzer", "blackletter", "pixel", "playfair"] as const;
type Face = (typeof FACES)[number];

/* The three faces the site does not otherwise use, loaded here rather than in
   the root layout so only the page that plays the intro downloads them.
   next/font preloads them with the page, so they are in hand long before the
   first swap. Playfair and Switzer come from the layout. */
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const blackletter = UnifrakturCook({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-blackletter",
  display: "swap",
});

const pixel = Silkscreen({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pixel",
  display: "swap",
});

/** One glitch: how long it shakes before the face swaps, and how long it
 *  carries on after. The swap lands inside the burst rather than at the end
 *  of it, so the glitch is visibly still running on the new face — that
 *  overlap is what makes the glitch read as the cause of the change. Kept
 *  short and sharp (2026-09-21: 220/140ms read as slow); the first burst runs
 *  a little longer so it registers as a glitch before anything changes. */
const LEAD_MS = 120;
const FIRST_LEAD_MS = 250;
const TAIL_MS = 90;

/** How long the finished name sits still before the first glitch, and the
 *  still between glitches — both signed off as right (2026-09-21). */
const SETTLE_MS = 700;
const HOLD_MS = 650;

/** The white screen parting from the middle onto the home page beneath. */
const REVEAL_MS = 1100;

/** Under reduced motion: no glitch and no swaps — just the word, then the
 *  site, as a cut. */
const STILL_MS = 1500;

type Stage = "scramble" | "glitch" | "reveal" | "done";

/**
 * The intro — the studio's name on white: typed in, glitched through five
 * typefaces, then the screen parts down the middle onto the home page.
 *
 *   scramble  TextScramble types the name letter by letter, in Playfair, and
 *             it sits still for SETTLE_MS once it is complete.
 *   glitch    Bursts of RGB shake, the face swapping partway through each,
 *             a still beat on each new face — through FACES.
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
     face after the first — and the reveal after the last hold.

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
      at(t, () => {
        setStage("glitch");
        setGlitching(true);
      });
      t += i === 0 ? FIRST_LEAD_MS : LEAD_MS;
      at(t, () => setFace(next));
      t += TAIL_MS;
      at(t, () => setGlitching(false));
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

  const fonts = `${anton.variable} ${blackletter.variable} ${pixel.variable}`;
  const style = { "--intro-reveal": `${REVEAL_MS}ms` } as CSSProperties;

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
            <span className="intro__word" data-face={face}>
              {siteName}
            </span>
          </div>
        ))}
      </div>
    );
  }

  /* The reveal length goes to CSS from here, so the keyframes and the
     timeline above can never drift apart. data-no-proximity keeps the cursor's
     letter split out: it would wrap these letters in spans of its own while
     React is rewriting them every 60ms. */
  return (
    <div className={`intro ${fonts}`} data-stage={stage} data-no-proximity style={style}>
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
  );
}
