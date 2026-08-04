import Link from "next/link";
import { ctaBand } from "@/content/home";
import { Reveal } from "@/components/Reveal";

/**
 * CTA band — every page ends with one, into /enquire (SITEMAP.md §2).
 * Its own accent surface: cream on red passes APCA for body text and up.
 */
export function CtaBand() {
  return (
    <section className="cta-band" aria-labelledby="cta-heading">
      <div className="wrap-default py-section text-center">
        <Reveal>
          <h2 id="cta-heading" className="cta-band__heading">
            {ctaBand.heading}
          </h2>
          <div className="mt-10">
            <Link href={ctaBand.button.href} className="btn btn--on-accent">
              {ctaBand.button.label}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
