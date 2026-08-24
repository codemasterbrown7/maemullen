/**
 * WHAT AN ENQUIRY IS ABOUT — the list of things a CTA elsewhere on the site can
 * hand to /enquire, and the join between them and the form's own fields.
 *
 * THE PROBLEM THIS SOLVES. Every `[ ENQUIRE ]` on the site pointed at the same
 * blank form, so someone who had just read the Signature package and pressed the
 * bracket attached to it arrived at a page that asked them what they wanted. The
 * bracket knew; the form did not.
 *
 * THE CONTRACT IS A QUERY STRING. `/enquire?package=signature`. A query string
 * is the only thing that survives here: the site is a static export
 * (next.config.ts), so there is no per-package route to prerender and no server
 * to read a POST. `?package=…` still serves the same /enquire/index.html and the
 * form reads the value after hydration.
 *
 * PACKAGES ONLY, AND ON PURPOSE. The other enquire CTAs — home, /about, /work,
 * the two on /services, both in the chrome — are page-level. They sit at the
 * bottom of a page about everything, so there is nothing specific for them to
 * carry and they stay pointed at the bare form. A `?service=` half was built
 * and cut the same day: nothing linked with it, and it put "TikTok management"
 * and "UGC & brand content" into the Change picker twice over, once as a
 * package and once as a service, with no way for a reader to tell which was
 * which. If /services ever grows a bracket per section, this file is where the
 * second kind goes back.
 *
 * NOTHING HERE IS NEW CONTENT. Every label is derived from the package it
 * names, so a rename in content/packages.ts moves the enquiry line with it and
 * the two can never disagree.
 *
 * WHY IT IS NOT IMPORTED BY THE FORM. components/EnquireSection.tsx is a client
 * component; importing this would pull all of content/packages.ts into the
 * browser bundle — every line of copy for ten packages, plus the build-time
 * assertions in that file, re-run on every page load. So /enquire's server
 * component imports it and hands the derived list down as a prop: eleven short
 * records instead of the whole file.
 */

import { enquiryServices } from "@/content/enquire";
import { packageTabs, packagesPage } from "@/content/packages";

export type EnquirySubject = {
  /** The value in the URL: `?package=<id>`. A package slug, or the Bespoke tab. */
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

const cardSubjects: EnquirySubject[] = packageTabs.flatMap((tab) =>
  tab.cards.map((card) => ({
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
  ? [{ id: bespokeTab.key, label: "A bespoke package", service: null }]
  : [];

export const enquirySubjects: EnquirySubject[] = [...cardSubjects, ...bespokeSubject];

/* Two things that would fail silently on the page, failed loudly at build time
   instead: a subject naming a service the form has no box for, and two subjects
   sharing an id (the second would be unreachable). */
for (const subject of enquirySubjects) {
  if (subject.service && !enquiryServices.includes(subject.service)) {
    throw new Error(
      `content/enquiry-subjects.ts: "${subject.label}" points at the service ` +
        `"${subject.service}", which is not in enquiryServices. The service names ` +
        `in content/packages.ts must match content/home.ts exactly.`,
    );
  }
}
const seen = new Set<string>();
for (const subject of enquirySubjects) {
  if (seen.has(subject.id)) {
    throw new Error(`content/enquiry-subjects.ts: two subjects share the id "${subject.id}".`);
  }
  seen.add(subject.id);
}

/** The query param the id travels in. One name, one place. */
export const enquirySubjectParam = "package";

/**
 * The href a CTA uses, so no page hand-builds the query string. `/enquire`
 * comes from the same place the CTA label does rather than being written out
 * again.
 */
export function enquireHref(id: string): string {
  return `${packagesPage.bespoke.href}?${enquirySubjectParam}=${encodeURIComponent(id)}`;
}
