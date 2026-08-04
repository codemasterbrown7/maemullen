import Link from "next/link";
import { services } from "@/content/home";

/**
 * Services marquee — its own surface, under the header (DESIGN.md §0 S3,
 * §8.2). One loop per --marquee-duration; pauses on hover and focus-within;
 * every duplicate is aria-hidden so screen readers hear the list once;
 * fully stopped (static wrapped list) under prefers-reduced-motion.
 *
 * Each track holds three copies of the list so the band stays full at any
 * viewport width; the second track provides the seamless wrap.
 */
export function Marquee() {
  const copies = [0, 1, 2];

  const renderItems = (hidden: boolean) =>
    copies.map((copy) => {
      const copyHidden = hidden || copy > 0;
      return services.map((s) => (
        <li
          key={`${copy}-${s.anchor}`}
          className="marquee__item"
          aria-hidden={copyHidden || undefined}
        >
          <Link
            href={`/services#${s.anchor}`}
            className="marquee__link"
            tabIndex={copyHidden ? -1 : undefined}
          >
            {s.name}
          </Link>
        </li>
      ));
    });

  return (
    <div className="marquee" aria-label="Our services">
      <ul className="marquee__track">{renderItems(false)}</ul>
      <ul className="marquee__track" aria-hidden="true">
        {renderItems(true)}
      </ul>
    </div>
  );
}
