import Link from "next/link";
import { studioIntro } from "@/content/home";

/**
 * Studio intro — the one block below the fold on the landing page. Cut-out
 * photograph one side, copy the other.
 *
 * The copy side runs eyebrow → display heading → lead paragraph → supporting
 * paragraph → CTA, each step down in size and weight. It was previously two
 * paragraphs at identical size in the body face, which read as flat: no
 * hierarchy, and the brand's display face appeared nowhere in it.
 *
 * The CTA is the bracket tertiary — the signature from deck p7 and DESIGN.md
 * §6.3 🔒. A solid red pill sat badly here: this block is typographic and quiet,
 * and a filled 40px-radius control reads as app furniture dropped into it.
 *
 * Columns collapse via auto-fit rather than a media query, matching the rest of
 * the site — there are no breakpoints in this design, layout is a continuous
 * function of width.
 */
export function StudioIntro() {
  const { eyebrow, heading, lead, leadRest, body, cta, image, imageCaption, placeholderNote } =
    studioIntro;

  return (
    <section
      aria-label="About the studio"
      style={{
        maxWidth: "var(--container-wide)",
        margin: "0 auto",
        padding: "var(--space-section) var(--gutter)",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "clamp(var(--space-10), 6vw, var(--space-24))",
        alignItems: "center",
      }}
    >
      {image ? (
        /* No frame: the cut-out sits straight on the page, lifted only by a
           shadow that traces its own silhouette. See .mm-plate. */
        <figure className="mm-plate">
          <img src={image.src} alt={image.alt} />
          {imageCaption && <figcaption>{imageCaption}</figcaption>}
        </figure>
      ) : (
        <div
          style={{
            aspectRatio: "4 / 5",
            border: "var(--border-hairline) dashed var(--nav-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--space-6)",
            boxSizing: "border-box",
            textAlign: "center",
            color: "var(--accent)",
            fontSize: "var(--text-eyebrow)",
            fontWeight: 600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          {placeholderNote}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <span
          style={{
            fontSize: "var(--text-eyebrow)",
            fontWeight: 600,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          {eyebrow}
        </span>

        <h2
          style={{
            margin: "var(--space-5) 0 0",
            fontFamily: "var(--font-display)",
            fontWeight: "var(--head-weight)",
            letterSpacing: "var(--head-tracking)",
            fontSize: "var(--text-display-md)",
            lineHeight: 1.05,
            textWrap: "balance",
          }}
        >
          {heading.text}{" "}
          <em style={{ fontStyle: "italic" }}>{heading.emphasis}</em>
        </h2>

        <p
          style={{
            margin: "var(--space-8) 0 0",
            fontSize: "var(--text-body-lg)",
            lineHeight: 1.6,
            maxWidth: "34em",
            textWrap: "pretty",
          }}
        >
          <strong style={{ fontWeight: 700 }}>{lead}</strong>
          {leadRest}
        </p>

        {/* Supporting copy steps down in size and drops to muted ink, so the
            two paragraphs read as lead and detail rather than as a slab. */}
        <p
          style={{
            margin: "var(--space-5) 0 0",
            fontSize: "var(--text-body)",
            lineHeight: 1.7,
            color: "var(--ink-muted)",
            maxWidth: "36em",
            textWrap: "pretty",
          }}
        >
          {body}
        </p>

        <Link href={cta.href} className="mm-cta-bracket" style={{ marginTop: "var(--space-10)" }}>
          {cta.label}
        </Link>
      </div>
    </section>
  );
}
