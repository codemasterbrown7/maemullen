import Image from "next/image";
import Link from "next/link";
import { work, workHeading, workLink, type WorkItem } from "@/content/home";
import { Reveal } from "@/components/Reveal";

function CardMedia({ item }: { item: WorkItem }) {
  if (item.placeholder || !item.image) {
    return (
      <div className="work-card__media work-card__media--placeholder">
        <span className="placeholder-label">
          Placeholder — {item.placeholderNote}
        </span>
      </div>
    );
  }
  return (
    <div className="work-card__media">
      <Image
        src={item.image.src}
        alt={item.image.alt}
        fill
        className="object-cover"
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
      />
    </div>
  );
}

/**
 * Selected work — 3 case studies (deck p19: menu, airbnb, mia massage).
 * Only Bendito has assets; the other two are clearly-marked placeholders
 * and stay non-interactive until their case studies exist.
 */
export function SelectedWork() {
  return (
    <section className="section wrap-wide" aria-labelledby="work-heading">
      <Reveal>
        <div className="mb-12 flex flex-wrap items-baseline justify-between gap-6">
          <h2 id="work-heading">{workHeading}</h2>
          <Link href={workLink.href} className="cta-bracket">
            {workLink.label}
          </Link>
        </div>
      </Reveal>
      <ul className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
        {work.map((item, i) => (
          <li key={item.slug}>
            <Reveal index={i}>
              {item.placeholder ? (
                <div className="work-card">
                  <CardMedia item={item} />
                  <p className="work-card__title">{item.title}</p>
                  <p className="work-card__meta">{item.meta}</p>
                </div>
              ) : (
                <Link href="/work" className="work-card">
                  <CardMedia item={item} />
                  <h3 className="work-card__title">{item.title}</h3>
                  <p className="work-card__meta">{item.meta}</p>
                </Link>
              )}
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
