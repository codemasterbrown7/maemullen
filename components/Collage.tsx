import { collage } from "@/content/home";

const TILE_VARIANTS = ["a", "b", "c", "d", "e"] as const;

/**
 * Moving collage (deck p5): a slow horizontal drift of overlapping tiles,
 * paused on hover and stopped under reduced motion (DESIGN.md §10).
 * Photography has not been supplied, so every tile is a clearly-marked
 * placeholder tinted --decor. The whole band is decorative for now.
 */
export function Collage() {
  const tiles = Array.from({ length: collage.tileCount }, (_, i) => i);
  // The track holds two identical sets; the animation travels -50% for a
  // seamless loop.
  const sets = [0, 1];

  return (
    <section className="section collage" aria-hidden="true">
      <div className="collage__track">
        {sets.map((set) =>
          tiles.map((tile) => (
            <div
              key={`${set}-${tile}`}
              className={`collage__tile collage__tile--${TILE_VARIANTS[tile % TILE_VARIANTS.length]}`}
            >
              <span className="placeholder-label">
                {collage.placeholderNote}
              </span>
            </div>
          )),
        )}
      </div>
    </section>
  );
}
