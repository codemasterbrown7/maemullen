import Link from "next/link";
import { heroCtas, statement } from "@/content/home";
import { Reveal } from "@/components/Reveal";

/**
 * Statement hero (DESIGN.md §0 S4): no logotype here — the page opens on
 * the statement block, and the h1 is real text because the header
 * logotype is an image.
 */
export function Hero() {
  return (
    <section className="section wrap-narrow">
      <Reveal>
        <h1 className="statement">{statement}</h1>
      </Reveal>
      <Reveal index={1}>
        <div className="mt-10 flex flex-wrap items-center gap-8">
          <Link href={heroCtas.primary.href} className="btn btn--primary">
            {heroCtas.primary.label}
          </Link>
          <Link href={heroCtas.bracket.href} className="cta-bracket">
            {heroCtas.bracket.label}
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
