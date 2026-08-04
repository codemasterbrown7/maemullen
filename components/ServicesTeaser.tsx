import Link from "next/link";
import { services, servicesHeading, servicesLink } from "@/content/home";
import { Reveal } from "@/components/Reveal";

/** Numbered 001…007 services list, each row linking into /services. */
export function ServicesTeaser() {
  return (
    <section className="section wrap-default" aria-labelledby="services-heading">
      <Reveal>
        <div className="mb-12 flex flex-wrap items-baseline justify-between gap-6">
          <h2 id="services-heading">{servicesHeading}</h2>
          <Link href={servicesLink.href} className="cta-bracket">
            {servicesLink.label}
          </Link>
        </div>
      </Reveal>
      <ul>
        {services.map((service, i) => (
          <li key={service.anchor} className="service-row">
            <Reveal index={i}>
              <Link
                href={`/services#${service.anchor}`}
                className="service-row__link"
              >
                <span className="service-row__number">{service.number}</span>
                <span className="service-row__name">{service.name}</span>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
