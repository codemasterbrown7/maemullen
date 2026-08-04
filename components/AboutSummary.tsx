import Link from "next/link";
import { aboutLink, aboutSummary } from "@/content/home";
import { Reveal } from "@/components/Reveal";

/** About summary — deck p6, verbatim (SITEMAP.md §4.1 row 5). */
export function AboutSummary() {
  return (
    <section className="section wrap-narrow">
      <Reveal>
        <p className="leading-relaxed" style={{ fontSize: "var(--text-body-lg)" }}>
          {aboutSummary}
        </p>
        <p className="mt-8">
          <Link href={aboutLink.href} className="text-link">
            {aboutLink.label}
          </Link>
        </p>
      </Reveal>
    </section>
  );
}
