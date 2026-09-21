"use client";

import { useEffect, useEffectEvent, useState } from "react";

/**
 * Capitals only. The reference component draws from both cases and the
 * figures, but the word is set in capitals, and a stray lowercase letter
 * mid-scramble reads as a different word rather than as the same one
 * resolving. The figures go for the same reason: Playfair's are old-style, so
 * a 0 sits at x-height and reads as a lowercase o.
 */
const CAPITALS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Text scramble, one letter at a time: the word types itself out left to
 * right, and the letter being typed flickers through random capitals before it
 * locks. Letters not reached yet are blank.
 *
 * This started as a port of the framer-motion TextScramble component, which
 * scrambles every unresolved letter at once and locks them in from the left.
 * It was hard to follow (2026-09-21): with five or six letters flickering
 * together there is no single place to look, so the left-to-right reading
 * gets lost in the noise. With one flickering letter, the eye has exactly one
 * thing to track, and it moves in reading order.
 *
 * Two things carried over from that first version:
 *
 *  - **Each letter holds its final width.** The real character sits invisibly
 *    in each cell and the random one is drawn over it, so a W flickering where
 *    an I will be does not reflow the line, and the centred word is the size it
 *    will end at from the first frame, rather than growing from the middle.
 *  - **Nothing shows until it starts.** On a static page, rendering the
 *    finished word first would flash the answer before the puzzle.
 *
 * `duration` is the whole word; each letter gets an equal share of it, drawn
 * as a new random capital every `speed` seconds. Under prefers-reduced-motion
 * the word appears already resolved.
 */
export function TextScramble({
  text,
  duration = 2,
  speed = 0.05,
  characterSet = CAPITALS,
  onComplete,
}: {
  text: string;
  duration?: number;
  speed?: number;
  characterSet?: string;
  onComplete?: () => void;
}) {
  /** One entry per letter: its character, or null while it is still blank. */
  const [shown, setShown] = useState<(string | null)[] | null>(null);
  const complete = useEffectEvent(() => onComplete?.());

  /* Array.from, not text[i]: it iterates code points, so a letter outside the
     BMP could never be split in half. Ü itself is a single unit either way. */
  const letters = Array.from(text);

  useEffect(() => {
    const target = Array.from(text);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    /* Frames per letter, at least one. The last frame of each letter's share is
       the real character, so it is seen to land before the next one starts. */
    const perLetter = Math.max(1, Math.round(duration / speed / target.length));
    const total = reduced ? 0 : perLetter * target.length;
    let step = 0;
    let last = "";

    /* A random capital that is neither the real letter nor the previous draw,
       so every frame visibly changes and the answer is never given away early. */
    const draw = (real: string) => {
      let ch = last;
      while (ch === last || ch === real.toUpperCase()) {
        ch = characterSet[Math.floor(Math.random() * characterSet.length)];
      }
      last = ch;
      return ch;
    };

    const id = setInterval(() => {
      const active = Math.floor(step / perLetter);
      const landing = step % perLetter === perLetter - 1;

      setShown(
        target.map((ch, i) => {
          if (i < active || ch === " ") return ch;
          if (i === active) return landing ? ch : draw(ch);
          return null;
        }),
      );
      step++;

      if (step >= total) {
        clearInterval(id);
        setShown(target);
        complete();
      }
    }, speed * 1000);

    return () => clearInterval(id);
  }, [text, duration, speed, characterSet]);

  return (
    <span className="intro-scramble">
      {letters.map((ch, i) => (
        <span key={i} className="intro-scramble__cell">
          <span className="intro-scramble__hold">{ch}</span>
          <span>{shown?.[i]}</span>
        </span>
      ))}
    </span>
  );
}
