import { heroPair } from "@/content/home";

/**
 * The first screen: two images side by side, full-bleed, butted together with
 * no gutter, each carrying a line of micro-copy in its outer bottom corner.
 *
 * Sits inside the 100svh flex column in app/page.tsx and takes whatever the
 * header and marquee leave, so it always ends exactly at the fold.
 *
 * Below 700px they stack instead of splitting the width. Two portrait photos
 * side by side on a phone would be roughly 180px wide each — too narrow to
 * read as anything. Stacked, each takes half the height and the screen still
 * holds both.
 *
 * No client JS: this is a static server component.
 */
export function HeroPair() {
  return (
    <div className="mm-hero-pair">
      {heroPair.map((image) => (
        <figure key={image.src} className="mm-hero-pair__cell">
          <img src={image.src} alt={image.alt} className="mm-hero-pair__img" />
          <figcaption className="mm-hero-pair__caption" data-align={image.align}>
            {image.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
