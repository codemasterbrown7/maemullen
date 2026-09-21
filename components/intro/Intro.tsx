"use client";

import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useState } from "react";
import { siteName } from "@/content/site";
import { GlitchText } from "./GlitchText";
import { TextScramble } from "./TextScramble";
import "./intro.css";

/** How long the word glitches once it has resolved, before the site opens. */
const GLITCH_MS = 1600;

/**
 * The intro — the studio's name on white, scrambling into place and then
 * glitching, before the site opens underneath it.
 *
 * Two phases, one after the other: TextScramble resolves the word letter by
 * letter, and the moment it lands GlitchText takes over and shakes it apart
 * into its red, green and blue channels. After GLITCH_MS the visitor is sent
 * home. A click or any key skips straight there — an intro nobody can get past
 * is a wall, not a welcome.
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

  useEffect(() => {
    if (phase !== "glitch") return;
    const id = setTimeout(() => enter(), GLITCH_MS);
    return () => clearTimeout(id);
  }, [phase]);

  /* data-no-proximity keeps the cursor's letter split out: it would wrap these
     letters in spans of its own while React is rewriting them every 40ms. */
  return (
    <div className="intro" data-no-proximity>
      <h1 className="intro__word">
        <span className="intro__name">{siteName}</span>
        <span aria-hidden="true">
          {phase === "scramble" ? (
            <TextScramble text={siteName} onComplete={() => setPhase("glitch")} />
          ) : (
            <GlitchText text={siteName} />
          )}
        </span>
      </h1>
    </div>
  );
}
