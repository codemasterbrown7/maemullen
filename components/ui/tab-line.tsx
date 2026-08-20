"use client";

import { useEffect, useRef } from "react";

/**
 * The moving rule under the active tab on /packages.
 *
 * IT STRETCHES. Asked for: "it stretches and accelerates and then slows down
 * under the one you clicked on." The mechanism is that the rule's two edges are
 * animated SEPARATELY — `left` and `right` are transitioned with the same
 * easing but different delays, so the edge travelling towards the new tab
 * leaves first and the trailing edge follows ~90ms later. For that 90ms the
 * rule is longer than either tab; then the tail catches up and it closes. One
 * ease-in-out curve on both edges gives the accelerate-then-settle.
 *
 * Which edge leads depends on which way you are going, or the rule would
 * stretch backwards away from the tab you clicked — hence `data-dir`.
 *
 * ── WHY THIS IS A SEPARATE CLIENT COMPONENT ────────────────────────────────
 *
 * The tabs themselves do NOT need JavaScript: /packages runs them on a hidden
 * radio group and `#id:checked ~ …` selectors (see app/packages/page.tsx), so
 * switching tabs works with JS off, on a static export, with no client bundle
 * for the page itself. Only the ANIMATION needs measuring, and measuring is the
 * one thing CSS cannot do — a rule that spans a label of unknown width, at an
 * offset of unknown distance, is not expressible without reading the layout.
 *
 * So this is decoration layered on top, and it announces itself by putting
 * `is-enhanced` on the track. Until that class lands the CSS draws a plain
 * static underline on the checked label; after it lands, that underline is
 * switched off and this rule takes over. Nothing breaks if the script never
 * runs.
 *
 * NOTE FOR ANYONE TEMPTED TO DELETE THIS AGAIN: it was removed once, on
 * 2026-08-06, on a note about a line looking out of place — and the line meant
 * was the one BELOW it, the rule over each column of the comparison. That rule
 * is gone; this one was asked back the same day. The tab indicator stays.
 */
export function TabLine({ name }: { name: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const line = ref.current;
    const track = line?.parentElement;
    if (!line || !track) return;

    const inputs = Array.from(
      document.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`),
    );
    if (inputs.length === 0) return;

    /* Only now does the static underline go, so a failure above this point
       leaves the page with a working — if unanimated — indicator. */
    track.classList.add("is-enhanced");

    let previousLeft: number | null = null;

    const place = (animate: boolean) => {
      const checked = inputs.find((input) => input.checked) ?? inputs[0];
      const label = track.querySelector<HTMLElement>(`[for="${checked.id}"]`);
      if (!label) return;

      /* offsetLeft/offsetWidth, NOT getBoundingClientRect: the track scrolls
         horizontally on narrow screens, and rect values are viewport-relative,
         so they would shift the rule by the scroll distance. Offsets are
         layout-relative and immune to it. `.pkg__tabtrack` is the offset parent
         (it is `position: relative`). */
      const left = label.offsetLeft;
      const right = track.offsetWidth - label.offsetLeft - label.offsetWidth;

      /* No previous position means first paint — jump, do not slide in from the
         left edge on load. */
      const shouldAnimate = animate && previousLeft !== null;
      line.dataset.dir = previousLeft !== null && left < previousLeft ? "left" : "right";
      line.style.transitionDuration = shouldAnimate ? "" : "0s";
      line.style.left = `${left}px`;
      line.style.right = `${right}px`;

      /* Reading back forces the style flush, so the next placement animates
         from where this one actually landed rather than being coalesced with
         it. Cheap, and only on a tab change. */
      if (!shouldAnimate) void line.offsetWidth;
      line.style.transitionDuration = "";

      previousLeft = left;

      /* A tab chosen with the arrow keys can be outside the scrollport on a
         phone. Bring it back — `nearest` so it never scrolls when it does not
         have to. */
      if (shouldAnimate) {
        label.scrollIntoView({ block: "nearest", inline: "nearest" });
      }
    };

    place(false);
    line.style.opacity = "1";

    const onChange = () => place(true);
    inputs.forEach((input) => input.addEventListener("change", onChange));

    /* Re-measure when the track resizes — a viewport change, and also the web
       fonts landing, which changes every label's width after first paint. */
    const observer = new ResizeObserver(() => place(false));
    observer.observe(track);

    return () => {
      inputs.forEach((input) => input.removeEventListener("change", onChange));
      observer.disconnect();
      track.classList.remove("is-enhanced");
    };
  }, [name]);

  /* aria-hidden: it is a picture of the radio group's state, and the radio
     group already announces that state properly. */
  return <span ref={ref} className="pkg__tab-line" aria-hidden="true" />;
}
