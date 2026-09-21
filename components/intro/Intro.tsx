"use client";

import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useState } from "react";
import { siteName } from "@/content/site";
import { GlitchText } from "./GlitchText";
import { TextScramble } from "./TextScramble";
import "./intro.css";

/** How long the scramble takes to resolve the whole word, in seconds, and how
 *  often it draws a new set of letters. The reference's 0.8s and 40ms read as
 *  a blur (2026-09-21), so it runs at 2s and 60ms. */
const SCRAMBLE_S = 2;
const SCRAMBLE_FRAME_S = 0.06;

/**
 * The faces the word passes through once it has resolved, one per glitch. All
 * four are the site's own, already preloaded on every page, so a swap never
 * waits on a download or flashes a fallback. It ends where it started, on
 * Playfair — the wordmark's face is the last thing seen before the site opens.
 * Each name maps to a family and weight in intro.css.
 */
const FACES = ["playfair", "heros", "mono", "switzer", "playfair"] as const;
type Face = (typeof FACES)[number];

/** One glitch: how long it shakes, and how far into the shake the face swaps.
 *  The swap lands inside the burst rather than at the end of it, so the glitch
 *  is visibly still running on the new face — that overlap is what makes the
 *  glitch read as the cause of the change. */
const BURST_MS = 260;
const SWAP_AT = 0.6;

/** The still between glitches: long enough to register each face. */
const HOLD_MS = 380;

/** Under reduced motion: no glitch and no swaps, just the word, then the site. */
const STILL_MS = 1500;

/**
 * The intro — the studio's name on white, scrambling into place, then
 * glitching from one typeface into the next before the site opens.
 *
 * TextScramble resolves the word letter by letter in Playfair. The moment it
 * lands, the glitch sequence takes over: a short burst of RGB shake, the face
 * swapping partway through it, then a still beat on the new face — four times,
 * through FACES, ending back on Playfair. Then the visitor is sent home. A
 * click or any key skips straight there — an intro nobody can get past is a
 * wall, not a welcome.
 *
 * The name is set in capitals by CSS rather than typed in capitals here, so the
 * copy is still the brand's own spelling and a screen reader says "MaeMüllen"
 * rather than spelling out M-A-E. The animated letters are hidden from it for
 * the same reason; it hears the real name once.
 *
 * Fixed and full-screen with its own white ground, so it does not depend on the
 * page behind it: today it is the whole of /intro, and later it can sit over
 * the home page on a first visit without changing.
 */
export function Intro() {
  const router = useRouter();
  const [phase, setPhase] = useState<"scramble" | "glitch">("scramble");
  const [face, setFace] = useState<Face>(FACES[0]);
  const [glitching, setGlitching] = useState(false);
  const enter = useEffectEvent(() => router.replace("/"));

  /* Fetch the home page while the word is still animating, so the handoff is a
     cut rather than a wait. */
  useEffect(() => {
    router.prefetch("/");
  }, [router]);

  useEffect(() => {
    const skip = () => enter();
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    return () => {
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, []);

  /* The glitch sequence, laid out as one timeline from the moment the scramble
     lands: burst on, face swap, burst off, hold — once per face after the
     first — and then home. */
  useEffect(() => {
    if (phase !== "glitch") return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      at(STILL_MS, enter);
    } else {
      let t = 0;
      for (const next of FACES.slice(1)) {
        at(t, () => setGlitching(true));
        at(t + BURST_MS * SWAP_AT, () => setFace(next));
        at(t + BURST_MS, () => setGlitching(false));
        t += BURST_MS + HOLD_MS;
      }
      at(t, enter);
    }

    return () => timers.forEach(clearTimeout);
  }, [phase]);

  /* data-no-proximity keeps the cursor's letter split out: it would wrap these
     letters in spans of its own while React is rewriting them every 60ms. */
  return (
    <div className="intro" data-no-proximity>
      <h1 className="intro__word" data-face={face}>
        <span className="intro__name">{siteName}</span>
        <span aria-hidden="true">
          {phase === "scramble" ? (
            <TextScramble
              text={siteName}
              duration={SCRAMBLE_S}
              speed={SCRAMBLE_FRAME_S}
              onComplete={() => setPhase("glitch")}
            />
          ) : (
            <GlitchText text={siteName} active={glitching} />
          )}
        </span>
      </h1>
    </div>
  );
}
