/**
 * WHAT AN ENQUIRY IS ABOUT — the list of things a CTA elsewhere on the site can
 * hand to /enquire, and the join between them and the form's own fields.
 *
 * THE PROBLEM THIS SOLVES. Every `[ ENQUIRE ]` on the site pointed at the same
 * blank form, so someone who had just read the Signature package and pressed the
 * button attached to it arrived at a page that asked them what they wanted. The
 * bracket knows; the form did not.
 *
 * THE CONTRACT IS A QUERY STRING. `/enquire?package=signature`,
 * `/enquire?service=design-illustration`. A query string is the only thing that
 * survives here: the site is a static export (next.config.ts), so there is no
 * per-package route to prerender and no server to read a POST. `?package=…`
 * still serves the same /enquire/index.html and the form reads the value after
 * hydration.
 *
 * TWO PARAMS, NOT ONE, because the two id spaces collide — `ugc` and `tiktok`
 * are both a package slug AND a service anchor, and one shared `?about=` would
 * have to disambiguate them by guessing.
 *
 * NOTHING HERE IS NEW CONTENT. Every label is derived from the package or
 * service it names, so a rename in content/packages.ts moves the enquiry line
 * with it and the two can never disagree.
 *
 * WHY IT IS NOT IMPORTED BY THE FORM. components/EnquireSection.tsx is a client
 * component; importing this would pull all of content/packages.ts into the
 * browser bundle — every line of copy for ten packages, plus the build-time
 * assertions in that file, re-run on every page load. So /enquire's server
 * component imports it and hands the derived list down as a prop: ten short
 * records instead of the whole file.
 */

import { enquiryServices } from "@/content/enquire";
import { services } from "@/content/home";
import { packageTabs, packagesPage } from "@/content/packages";

export type EnquirySubjectKind = "package" | "service";

export type EnquirySubject = {
  kind: EnquirySubjectKind;
  /** The value in the URL: `?package=<id>` / `?service=<id>`. */
  id: string;
  /** What the line on the form reads. */
  label: string;
  /**
   * Which "Service(s) of interest" box arrives ticked, or null for a subject
   * that maps to no single service. Always a string out of `enquiryServices` —
   * asserted below, so a typo is a build failure rather than a box that
   * silently never ticks.
   */
  service: string | null;
};

const packageSubjects: EnquirySubject[] = packageTabs.flatMap((tab) =>
  tab.cards.map((card) => ({
    kind: "package" as const,
    id: card.slug,
    /* Only the social tab holds alternatives to each other, and only there does
       the tab name have to lead: "Essential" on its own names nothing. Every
       other tab holds one card, where "Content days — Content day" only
       stutters, so the card speaks for itself. */
    label: tab.cards.length > 1 ? `${tab.label} — ${card.name}` : card.name,
    service: card.service.label,
  })),
);

/**
 * Bespoke has no card — it is the tab for the thing we have not listed — so it
 * cannot be derived like the rest and cannot name a service either.
 */
const bespokeTab = packageTabs.find((tab) => tab.enquireOnly);
const bespokeSubject: EnquirySubject[] = bespokeTab
  ? [{ kind: "package", id: bespokeTab.key, label: "A bespoke package", service: null }]
  : [];

const serviceSubjects: EnquirySubject[] = services.map((service) => ({
  kind: "service" as const,
  id: service.anchor,
  label: service.name,
  service: service.name,
}));

export const enquirySubjects: EnquirySubject[] = [
  ...packageSubjects,
  ...bespokeSubject,
  ...serviceSubjects,
];

/* Two things that would fail silently on the page, failed loudly at build time
   instead: a subject naming a service the form has no box for, and two subjects
   of the same kind sharing an id (the second would be unreachable). */
for (const subject of enquirySubjects) {
  if (subject.service && !enquiryServices.includes(subject.service)) {
    throw new Error(
      `content/enquiry-subjects.ts: "${subject.label}" points at the service ` +
        `"${subject.service}", which is not in enquiryServices. The names in ` +
        `content/packages.ts must match content/home.ts exactly.`,
    );
  }
}
const seen = new Set<string>();
for (const subject of enquirySubjects) {
  const key = `${subject.kind}/${subject.id}`;
  if (seen.has(key)) {
    throw new Error(`content/enquiry-subjects.ts: two subjects share the id ${key}.`);
  }
  seen.add(key);
}

/**
 * The href a CTA uses, so no page hand-builds the query string and the param
 * names live in one file. `/enquire` comes from the same place the CTA label
 * does rather than being written out again.
 */
export function enquireHref(kind: EnquirySubjectKind, id: string): string {
  return `${packagesPage.bespoke.href}?${kind}=${encodeURIComponent(id)}`;
}
