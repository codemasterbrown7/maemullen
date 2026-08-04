import Link from "next/link";
import { services } from "@/content/home";

const itemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "var(--space-2)",
  padding: "var(--space-3) var(--space-5)",
  color: "var(--marquee-ink)",
  textDecoration: "none",
  fontSize: "var(--marquee-size)",
  fontWeight: "var(--marquee-weight)",
  letterSpacing: "0.09em",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
} as const;

const starStyle = { color: "var(--marquee-ink)" } as const;

/**
 * Services marquee — its own surface under the header (DESIGN.md §0 S3, §8.2).
 *
 * The track holds the list twice: the real one, then an aria-hidden duplicate.
 * The keyframe translates by -50%, so the copy lands exactly where the original
 * started and the loop is seamless. Screen readers hear the list once.
 *
 * Pausing on hover *and* focus-within is what makes it keyboard-usable
 * (§8.2.1); both live in globals.css alongside the reduced-motion rule that
 * stops the animation outright.
 */
export function ServicesMarquee() {
  return (
    <div
      id="mm-marquee"
      style={{
        background: "var(--marquee-bg)",
        borderBottom: "var(--border-hairline) solid var(--border)",
        overflow: "hidden",
      }}
    >
      <div
        id="mm-marquee-track"
        style={{
          display: "flex",
          width: "max-content",
          animation: "mm-marquee var(--marquee-duration) linear infinite",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {services.map((s) => (
            <span key={s.anchor} style={{ display: "contents" }}>
              <Link href={`/services#${s.anchor}`} className="mm-marquee-link" style={itemStyle}>
                {s.name}
              </Link>
              <span aria-hidden="true" style={starStyle}>
                ✳
              </span>
            </span>
          ))}
        </div>
        <div aria-hidden="true" style={{ display: "flex", alignItems: "center" }}>
          {services.map((s) => (
            <span key={s.anchor} style={{ display: "contents" }}>
              <span style={itemStyle}>{s.name}</span>
              <span style={starStyle}>✳</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
