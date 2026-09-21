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
 * Text scramble: every letter starts as a random character and they lock in
 * left to right until the whole word has resolved. A port of the framer-motion
 * TextScramble component, with its timing kept (0.8s, a new frame every 40ms)
 * and two changes:
 *
 *  - **Each letter holds its final width.** The real character sits invisibly
 *    in each cell and the random one is drawn over it. The reference writes the
 *    random string straight into the text, so a W landing where an I will be
 *    reflows the whole line forty times a second, and a centred word jitters at
 *    both ends. Here the word is the size it will end at from the first frame.
 *  - **Nothing shows until it starts.** The reference renders the finished word
 *    and scrambles it on mount, which on a static page means the answer flashes
 *    up before the puzzle.
 *
 * Under prefers-reduced-motion the word appears already resolved.
 */
export function TextScramble({
  text,
  duration = 0.8,
  speed = 0.04,
  characterSet = CAPITALS,
  onComplete,
}: {
  text: string;
  duration?: number;
  speed?: number;
  characterSet?: string;
  onComplete?: () => void;
}) {
  /** null until the first frame, so the cells hold their space but draw nothing. */
  const [shown, setShown] = useState<string[] | null>(null);
  const complete = useEffectEvent(() => onComplete?.());

  /* Array.from, not text[i]: it iterates code points, so a letter outside the
     BMP could never be split in half. Ü itself is a single unit either way. */
  const letters = Array.from(text);

  useEffect(() => {
    const target = Array.from(text);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const steps = reduced ? 0 : duration / speed;
    let step = 0;

    const id = setInterval(() => {
      const progress = step / steps;
      setShown(
        target.map((ch, i) =>
          ch === " " || progress * target.length > i
            ? ch
            : characterSet[Math.floor(Math.random() * characterSet.length)],
        ),
      );
      step++;

      if (step > steps) {
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
